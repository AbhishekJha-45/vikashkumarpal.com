import { getFormatedDates } from "../../../utils/formatDate";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const staticUrls = [
      "/seo-insights/",
      "/contact/",
      "/testimonials/",
      "/privacy-policy/",
      "/terms-and-conditions/",
      "/services/",
      "/industries/",
      "/consulting/",
      "/case-study/",
      "/portfolio/",
      "/seo-approach/",
      "/work-with-me/",
      "/about/",
      "/book-a-strategy-call/",
    ];

    const timestamps = getFormatedDates(staticUrls.length, 21, 30, 10, "weekly");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${staticUrls
            .map(
              (url, index) => `
          <url>
            <loc>https://vikashkumarpal.com${url}</loc>
            <lastmod>${timestamps[index].value}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>`
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

