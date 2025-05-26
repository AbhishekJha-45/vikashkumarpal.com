import { request } from "../../../services/http/graphql";
import { getFormatedDates } from "../../../utils/formatDate";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const allCategories = await fetchAllCategories();
    const timestamps = getFormatedDates(
      allCategories.length,
      23,
      0,
      10,
      "monthly"
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allCategories
          .map(
            ({ node }, index) => `
          <url>
            <loc>https://vikashkumarpal.com${node.uri}</loc>
            <lastmod>${timestamps[index].value}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.5</priority>
          </url>
        `
          )
          .join("")}
      </urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating categories sitemap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch all categories
async function fetchAllCategories() {
  const query = `
    query {
      categories {
        edges {
          node {
            uri
          }
        }
      }
    }
  `;

  const res = await request(query);
  return res?.categories?.edges || [];
}

