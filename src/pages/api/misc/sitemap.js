import { getFormatedDates } from "../../../utils/formatDate";
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const timestamps = getFormatedDates(1, 7, 0, 5, "daily");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url>
            <loc>https://vikashkumarpal.com/</loc>
            <lastmod>${timestamps[0].value}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
          </url>
        </urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
