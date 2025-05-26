import { request } from "../../../services/http/graphql";
import { getFormatedDates } from "../../../utils/formatDate";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const caseStudies = await fetchCaseStudies();
    const timestamps = getFormatedDates(caseStudies.length, 22, 30, 5, "weekly");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${caseStudies
        .map(
          ({ node }, index) => `
          <url>
            <loc>https://vikashkumarpal.com${node.uri}</loc>
            <lastmod>${timestamps[index].value}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.6</priority>
          </url>
        `
        )
        .join("")}
      </urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating case studies sitemap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch all case studies with pagination
async function fetchCaseStudies() {
  let allEdges = [];
  let endCursor = null;
  let hasNextPage = true;

  const query = (cursor) => `
    query {
      caseStudies(first: 100, after: ${cursor ? `"${cursor}"` : "null"}) {
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
    allEdges = [...allEdges, ...response.caseStudies.edges];
    hasNextPage = response.caseStudies.pageInfo.hasNextPage;
    endCursor = response.caseStudies.pageInfo.endCursor;
  }

  return allEdges;
}
