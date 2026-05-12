import { Router, type Request, type Response } from "express";
import { getAllNames, getAllDuas } from "../lib/db.js";
import { INDIA_CITIES, PAKISTAN_CITIES } from "./shared.js";
import { SURAHS } from "./quran-seo.js";
import { BLOG_STUBS } from "./blog-seo.js";

const router = Router();

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const BASE = "https://mytazki.com";
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

  // Cluster 1 — Emotional / Anxiety + Peace
  [
    "/dua-for-anxiety", "/quran-verses-about-stress", "/how-islam-brings-peace",
    "/tahajjud-for-anxiety", "/islamic-routine-for-peace", "/dua-for-overthinking",
    "/quran-for-depression", "/how-to-connect-with-allah", "/surah-for-peace", "/dua-for-hardship",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Cluster 2 — Salah Consistency
  [
    "/how-to-stop-missing-salah", "/how-to-focus-in-salah", "/how-to-wake-up-for-fajr",
    "/why-salah-is-important", "/salah-benefits", "/how-to-make-salah-habit",
    "/missed-prayers-qada", "/dua-before-salah",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Cluster 3 — Quran Reflections
  [
    "/surah-rahman-reflection", "/surah-mulk-reflection", "/surah-fatiha-reflection",
    "/surah-duha-reflection", "/surah-kahf-reflection", "/surah-yusuf-reflection",
    "/ayatul-kursi-reflection", "/quran-about-anxiety",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Cluster 4 — Islamic Habits
  [
    "/daily-muslim-routine", "/islamic-habit-tracker", "/muslim-productivity-habits",
    "/morning-routine-muslim", "/islamic-night-routine", "/dhikr-daily-habit",
    "/quran-daily-habit", "/islamic-self-improvement",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Cluster 5 — AI Islamic Search
  [
    "/ai-islamic-assistant", "/ai-quran-explainer", "/ask-islam-ai",
    "/islamic-ai-companion", "/quran-ai-reflection", "/ai-fatwa-guide",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Phase 2 — Hub pages
  [
    "/mental-wellness", "/salah", "/quran-reflections",
    "/islamic-habits", "/ai-islamic-tools",
  ].forEach(p => urls.push(url(p, "1.0")));

  // Phase 2 — Guided journey pages
  [
    "/7-day-inner-peace-journey", "/reconnect-with-allah-journey",
    "/7-day-salah-reset", "/morning-barakah-routine",
    "/tahajjud-transformation-journey",
  ].forEach(p => urls.push(url(p, "0.95")));

  // Phase 2 — Wellness expansion
  [
    "/dua-for-loneliness", "/islamic-healing-from-heartbreak", "/dua-for-grief",
    "/quran-verses-about-patience", "/emotional-healing-in-islam",
    "/islamic-cure-for-burnout", "/dua-for-sadness", "/quran-for-hopelessness",
    "/islamic-mental-health", "/dua-for-healing",
    "/how-to-stop-overthinking-islam", "/quran-verses-about-hope", "/islamic-self-care",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Phase 2 — Salah expansion
  [
    "/tahajjud-prayer-guide", "/how-to-pray-tahajjud", "/fajr-prayer-tips",
    "/khushu-in-salah", "/salah-and-mental-health", "/salah-motivation",
    "/night-prayer-benefits",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Phase 2 — Quran expansion
  [
    "/quran-verses-about-mercy", "/quran-verses-about-healing",
    "/quran-verses-about-gratitude", "/quran-on-patience",
    "/surah-baqarah-reflection", "/surah-inshirah-reflection",
    "/quran-for-forgiveness", "/best-surahs-for-morning", "/quran-daily-reading-guide",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Phase 2 — Habits expansion
  [
    "/islamic-discipline", "/gratitude-in-islam", "/islamic-sleep-routine",
    "/islamic-time-management", "/30-day-islamic-challenge",
    "/evening-azkar-routine", "/halal-productivity",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Phase 2 — AI expansion
  [
    "/ai-tafsir", "/ai-islamic-coach", "/ai-dua-generator",
    "/best-islamic-ai-apps", "/ai-for-muslims", "/chatgpt-for-islamic-questions",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Phase 3 — Entity & trust pages
  [
    "/about", "/mission", "/our-philosophy", "/how-mytazki-works",
    "/contributors", "/authors", "/editorial-guidelines",
    "/ai-ethics", "/trust-and-safety", "/islamic-guidance-policy",
    "/content-verification", "/how-ai-content-is-reviewed",
  ].forEach(p => urls.push(url(p, "0.8")));

  // Phase 3 — GEO landing pages
  [
    "/best-islamic-app-for-anxiety", "/best-muslim-habit-app",
    "/ai-islamic-companion", "/ai-quran-reflection",
    "/islamic-self-improvement-app", "/muslim-wellness-app",
  ].forEach(p => urls.push(url(p, "0.9")));

  // Phase 3 — Start Here funnels
  [
    "/start-here", "/reconnect-with-allah", "/find-peace-in-islam",
    "/build-islamic-habits", "/start-praying-again",
  ].forEach(p => urls.push(url(p, "0.95")));

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

Sitemap: https://mytazki.com/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(txt);
});

router.get("/seo.css", (_req: Request, res: Response) => {
  const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
*, *::before, *::after { box-sizing: border-box; }
body { background: #0d1411; color: #eaf4ee; font-family: Inter, DM Sans, system-ui, sans-serif; margin: 0; line-height: 1.6; }
h1 { font-family: DM Sans, Inter, sans-serif; color: #eaf4ee; font-size: 2rem; font-weight: 800; line-height: 1.25; margin: 24px 0 14px; letter-spacing: -0.02em; }
h2 { color: #34c97a; font-family: DM Sans, Inter, sans-serif; font-size: 1.25rem; font-weight: 700; margin: 28px 0 10px; }
h3 { color: #eaf4ee; font-size: 1.05rem; font-weight: 600; margin: 16px 0 8px; }
p { margin: 0 0 12px; }
a { color: #34c97a; }
a:hover { color: #5cd68f; }
img { max-width: 100%; height: auto; }
table { border-collapse: collapse; }
th, td { padding: 8px 12px; }
.arabic { font-family: Amiri, serif; direction: rtl; text-align: right; color: #b8946a; font-size: 1.5em; line-height: 2.1; }
.transliteration { color: #34c97a; font-style: italic; }
.ai-summary { background: rgba(52,201,122,0.07); border-left: 4px solid #34c97a; border-radius: 0 10px 10px 0; padding: 16px 20px; margin: 20px 0; font-size: 15px; line-height: 1.7; color: #eaf4ee; }
.cta-box { background: rgba(52,201,122,0.08); border: 1px solid rgba(52,201,122,0.25); border-radius: 14px; padding: 28px 24px; margin: 32px 0; text-align: center; }
.cta-btn { background: #34c97a; color: #0d1411; padding: 13px 30px; border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 1rem; transition: background 0.2s; font-family: DM Sans, Inter, sans-serif; }
.cta-btn:hover { background: #5cd68f; }
.faq-item { margin: 12px 0; padding: 16px; background: rgba(52,201,122,0.04); border-radius: 10px; border-left: 3px solid rgba(52,201,122,0.3); }
.faq-item h3, .faq-item p { color: #a0c8a0; }
.faq-item h3 { color: #eaf4ee; margin: 0 0 8px; font-size: 1rem; }
.card { background: #1c2d21; border: 1px solid rgba(52,201,122,0.15); border-radius: 12px; padding: 16px; margin: 8px 0; }
nav.breadcrumb { font-size: 13px; color: #6a9878; margin-bottom: 20px; font-family: Inter, sans-serif; }
nav.breadcrumb a { color: #6a9878; text-decoration: none; }
nav.breadcrumb a:hover { color: #34c97a; }
@media (max-width: 600px) {
  h1 { font-size: 1.6rem; }
  h2 { font-size: 1.1rem; }
  .arabic { font-size: 1.3em; }
  .cta-btn { padding: 12px 24px; font-size: 0.95rem; }
}
`;

  res.setHeader("Content-Type", "text/css; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(css);
});

export default router;
