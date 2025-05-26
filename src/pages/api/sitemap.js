import { getFormatedDates } from "../../utils/formatDate";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const BASE_URL = "https://vikashkumarpal.com";

    const sitemaps = [
      { name: "misc", hrs: 7, mins: 0, gap: 5, freq: "daily" },
      { name: "services", hrs: 9, mins: 0, gap: 10, freq: "daily" },
      { name: "consulting", hrs: 13, mins: 0, gap: 7, freq: "daily" },
      { name: "industries", hrs: 16, mins: 0, gap: 5, freq: "daily" },
      { name: "post", hrs: 20, mins: 0, gap: 5, freq: "daily" },
      { name: "page", hrs: 21, mins: 30, gap: 10, freq: "weekly" },
      { name: "case-study", hrs: 22, mins: 30, gap: 5, freq: "weekly" },
      { name: "category", hrs: 23, mins: 0, gap: 5, freq: "monthly" },
      { name: "authors", hrs: 23, mins: 0, gap: 10, freq: "monthly" },
    ];

    const lastmod = sitemaps.map(
      ({ hrs, mins, gap, freq }) => getFormatedDates(1, hrs, mins, gap, freq)[0]
    );

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" >
        ${sitemaps
          .map(
            (sitemap, index) => `
        <sitemap>
          <loc>${BASE_URL}/${sitemap.name}/sitemap.xml</loc>
          <lastmod>${lastmod[index].value}</lastmod>
        </sitemap>`
          )
          .join("")}
      </sitemapindex>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemapXml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
