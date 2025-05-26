import { request } from "../../../services/http/graphql";
import { getFormatedDates } from "../../../utils/formatDate";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const allServices = await fetchAllServices();
    const timestamps = getFormatedDates(
      allServices.length,
      13,
      0,
      7,
      "daily"
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allServices
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
    console.error("Error generating services sitemap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch all consulting services with pagination
async function fetchAllServices() {
  let allEdges = [];
  let endCursor = null;
  let hasNextPage = true;

  const query = (cursor) => `
    query {
      consultingServices(first: 100, after: ${cursor ? `"${cursor}"` : "null"}) {
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

  while (hasNextPage) {
    const response = await request(query(endCursor));
    allEdges = [...allEdges, ...response.consultingServices.edges];
    hasNextPage = response.consultingServices.pageInfo.hasNextPage;
    endCursor = response.consultingServices.pageInfo.endCursor;
  }

  return allEdges;
}
