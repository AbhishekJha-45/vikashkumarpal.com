import { request } from "../../../services/http/graphql";
import { getFormatedDates } from "../../../utils/formatDate";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const allIndustries = await fetchAllIndustries();
    const timestamps = getFormatedDates(allIndustries.length, 16, 0, 5, "daily");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allIndustries
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
    console.error("Error generating industries sitemap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch all industries with pagination
async function fetchAllIndustries() {
  let allEdges = [];
  let endCursor = null;
  let hasNextPage = true;

  const query = (cursor) => `
    query {
      industries(first: 100, after: ${cursor ? `"${cursor}"` : "null"}) {
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
    allEdges = [...allEdges, ...response.industries.edges];
    hasNextPage = response.industries.pageInfo.hasNextPage;
    endCursor = response.industries.pageInfo.endCursor;
  }

  return allEdges;
}
