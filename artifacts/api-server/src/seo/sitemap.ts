import { Router, type Request, type Response } from "express";
import { getAllNames, getAllDuas } from "../lib/db.js";
import { INDIA_CITIES, PAKISTAN_CITIES } from "./shared.js";
import { SURAHS } from "./quran-seo.js";
import { BLOG_STUBS } from "./blog-seo.js";

const router = Router();

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const BASE = "https://noorapp.com";
const TODAY = new Date().toISOString().split("T")[0]!;

function url(loc: string, priority: string, lastmod = TODAY): string {
  return `  <url>
    <loc>${BASE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`;
}

router.get("/sitemap.xml", async (_req: Request, res: Response) => {
  const [rawNames, rawDuas] = await Promise.all([
    getAllNames().catch(() => []),
    getAllDuas().catch(() => []),
  ]);

  const names = (rawNames || []) as Array<{ nameEnglish: string }>;
  const duas = (rawDuas || []) as Array<{ title: string }>;

  const urls: string[] = [];

  urls.push(url("/", "1.0"));
  urls.push(url("/landing", "1.0"));
  urls.push(url("/download", "1.0"));

  urls.push(url("/prayer-times", "0.9"));
  urls.push(url("/namaz-times", "0.9"));
  INDIA_CITIES.forEach(city => {
    urls.push(url(`/prayer-times/${slugify(city)}`, "0.9", TODAY));
  });
  PAKISTAN_CITIES.forEach(city => {
    urls.push(url(`/namaz-times/${slugify(city.replace("-PK", ""))}`, "0.9", TODAY));
  });

  urls.push(url("/names", "0.9"));
  urls.push(url("/names/boy", "0.8"));
  urls.push(url("/names/girl", "0.8"));
  urls.push(url("/names/quranic", "0.7"));
  urls.push(url("/names/prophet", "0.7"));
  urls.push(url("/names/forbidden", "0.7"));
  urls.push(url("/names/trending", "0.7"));
  "abcdefghijklmnopqrstuvwxyz".split("").forEach(l => {
    urls.push(url(`/names/boy/letter/${l}`, "0.5"));
    urls.push(url(`/names/girl/letter/${l}`, "0.5"));
  });
  names.forEach(n => {
    urls.push(url(`/names/${slugify(n.nameEnglish)}`, "0.9"));
  });

  urls.push(url("/duas", "0.9"));
  duas.forEach(d => {
    urls.push(url(`/duas/${slugify(d.title)}`, "0.9"));
  });
  [...new Set((duas as unknown as Array<{ category: string }>).map(d => d.category))].forEach(cat => {
    urls.push(url(`/duas/${slugify(cat)}`, "0.8"));
  });

  urls.push(url("/quran", "0.9"));
  SURAHS.forEach(s => {
    urls.push(url(`/quran/${s.slug}`, "0.8"));
  });
  for (let i = 1; i <= 114; i++) {
    if (!SURAHS.find(s => s.number === i && s.slug !== "ayatul-kursi")) {
      urls.push(url(`/quran/surah-${i}`, "0.8"));
    }
  }

  urls.push(url("/blog", "0.8"));
  BLOG_STUBS.forEach(p => {
    urls.push(url(`/blog/${p.slug}`, "0.8", p.datePublished));
  });

  urls.push(url("/zakat-calculator", "0.7"));
  urls.push(url("/masjid-finder", "0.7"));
  urls.push(url("/qibla-direction", "0.7"));
  urls.push(url("/ramadan", "0.7"));
  urls.push(url("/islamic-calendar/2026", "0.7"));

  urls.push(url("/best-muslim-prayer-app-india", "0.6"));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

router.get("/robots.txt", (_req: Request, res: Response) => {
  const txt = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /home
Disallow: /player/
Disallow: /profile
Disallow: /journal
Disallow: /halaqah/
Disallow: /admin
Disallow: /growth
Disallow: /tasbih
Disallow: /mood
Disallow: /rooms

Sitemap: https://noorapp.com/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(txt);
});

router.get("/seo.css", (_req: Request, res: Response) => {
  const css = `
*, *::before, *::after { box-sizing: border-box; }
body { background: #001a00; color: #e8f5e8; font-family: Georgia, serif; margin: 0; line-height: 1.6; }
h1 { font-family: Cinzel, serif; color: #ffd700; font-size: 2rem; line-height: 1.3; margin: 24px 0 12px; }
h2 { color: #00a550; font-family: Cinzel, serif; font-size: 1.3rem; margin: 28px 0 10px; }
h3 { color: #e8f5e8; font-size: 1.1rem; margin: 16px 0 8px; }
p { margin: 0 0 12px; }
a { color: #00a550; }
a:hover { color: #00d066; }
img { max-width: 100%; height: auto; }
table { border-collapse: collapse; }
th, td { padding: 8px 12px; }
.arabic { font-family: Amiri, serif; direction: rtl; text-align: right; color: #ffd700; font-size: 1.4em; line-height: 2; }
.transliteration { color: #00a550; font-style: italic; }
.cta-box { background: rgba(0, 165, 80, 0.1); border: 1px solid rgba(0, 165, 80, 0.3); border-radius: 10px; padding: 24px; margin: 28px 0; text-align: center; }
.cta-btn { background: #00a550; color: #001a00; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block; font-size: 1rem; transition: background 0.2s; }
.cta-btn:hover { background: #00c060; }
.faq-item { margin: 12px 0; padding: 14px; background: rgba(0, 165, 80, 0.05); border-radius: 8px; border-left: 3px solid rgba(0, 165, 80, 0.3); }
.card { background: #002800; border: 1px solid rgba(0, 165, 80, 0.2); border-radius: 10px; padding: 16px; margin: 8px 0; }
@media (max-width: 600px) {
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.1rem; }
  .arabic { font-size: 1.2em; }
}
`;

  res.setHeader("Content-Type", "text/css; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(css);
});

export default router;
