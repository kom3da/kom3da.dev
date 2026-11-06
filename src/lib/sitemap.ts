import { escapeHtml } from "./html";
import type { Profile } from "./profile";

export function generateSitemap(profile: Profile, now = new Date()): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeHtml(profile.url)}/</loc>
    <lastmod>${now.toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}
