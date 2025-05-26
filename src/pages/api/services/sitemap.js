import { request } from "../../../services/http/graphql";
import { getFormatedDates } from "../../../utils/formatDate";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let allEdges = [];
  let endCursor = null;
  let hasNextPage = true;

  const query = (cursor) => `
    query {
      services(first: 100, after: ${cursor ? `"${cursor}"` : "null"}) {
        edges {
          node {
            uri
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    while (hasNextPage) {
      const response = await request(query(endCursor));
      allEdges = [...allEdges, ...response.services.edges];
      hasNextPage = response.services.pageInfo.hasNextPage;
      endCursor = response.services.pageInfo.endCursor;
    }

    const timestamps = getFormatedDates(
      allEdges.length,
      9,
      0,
      10,
      "daily"
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allEdges
        .map(
          ({ node }, index) => `
          <url>
            <loc>https://vikashkumarpal.com${node.uri}</loc>
            <lastmod>${timestamps[index].value}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.9</priority>
          </url>
        `
        )
        .join("")}
      </urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
