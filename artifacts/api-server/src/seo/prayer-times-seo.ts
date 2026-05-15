import { Router, type Request, type Response } from "express";
import {
  seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema,
  esc, INDIA_CITIES, PAKISTAN_CITIES,
} from "./shared.js";

function spreadCities(currentDisplay: string, pool: string[], count = 12): string[] {
  const clean = (s: string) => s.replace(/-PK$/i, "").replace(/-pk$/i, "").toLowerCase().replace(/-/g, " ");
  const currentIdx = pool.findIndex(c => clean(c) === clean(currentDisplay));
  const offset = currentIdx >= 0 ? currentIdx : 0;
  const result: string[] = [];
  for (let i = 1; result.length < count && i <= pool.length; i++) {
    const city = pool[(offset + i) % pool.length]!;
    if (clean(city) !== clean(currentDisplay)) result.push(city);
  }
  return result;
}

const router = Router();

router.get("/prayer-times", (_req: Request, res: Response) => {
  const head = seoHead({
    title: "Prayer Times in India & Pakistan Today",
    description: "Accurate Fajr, Dhuhr, Asr, Maghrib, Isha prayer times for 80+ cities in India and Pakistan. Updated daily.",
    canonical: "/prayer-times",
    schema: faqSchema([
      { q: "What are today's prayer times in Delhi?", a: "Get live Delhi prayer times at mytazki.com/prayer-times/delhi." },
      { q: "How do I find prayer times near me?", a: "Use MyTazki for GPS-based prayer times anywhere in India and Pakistan." },
    ]),
  });

  const body = `
<h1>Prayer Times in India & Pakistan Today</h1>
<p style="color:#4a7a4a">Find accurate Salah times for Fajr, Dhuhr, Asr, Maghrib, and Isha for your city.</p>

${ctaBlock()}

<h2>India, Prayer Times by City</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin:16px 0">
  ${INDIA_CITIES.map(city => `<a href="/prayer-times/${city.toLowerCase().replace(/\s+/g, "-")}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:10px 14px;border-radius:8px;text-decoration:none;font-size:14px;display:block">${esc(city)}</a>`).join("")}
</div>

<h2>Pakistan, Namaz Times by City</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin:16px 0">
  ${PAKISTAN_CITIES.map(city => `<a href="/namaz-times/${city.toLowerCase().replace(/\s+/g, "-").replace("-pk", "")}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:10px 14px;border-radius:8px;text-decoration:none;font-size:14px;display:block">${esc(city.replace("-PK", ""))}</a>`).join("")}
</div>

<h2>Learn More</h2>
<div style="display:flex;flex-wrap:wrap;gap:10px;margin:16px 0">
  <a href="/salah-guide" style="color:#00a550">Salah Guide</a> &nbsp;·&nbsp;
  <a href="/wudu-guide" style="color:#00a550">Wudu Guide</a> &nbsp;·&nbsp;
  <a href="/masjid-finder" style="color:#00a550">Masjid Near Me</a> &nbsp;·&nbsp;
  <a href="/duas" style="color:#00a550">Duas after Salah</a>
</div>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=1800");
  res.send(page(head, body));
});

async function cityPageHandler(city: string, isNamaz: boolean, res: Response): Promise<void> {
  const displayCity = city.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const apiCity = displayCity.replace(" Pk", "");
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const isoDate = today.toISOString().split("T")[0]!;
  const canonical = `/${isNamaz ? "namaz-times" : "prayer-times"}/${city}`;

  let times: Array<{ name: string; arabic: string; time: string }> = [];
  try {
    const r = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(apiCity)}&country=${isNamaz ? "PK" : "IN"}&method=1`);
    if (r.ok) {
      const data = await r.json() as { data?: { timings?: Record<string, string> } };
      const t = data?.data?.timings;
      if (t) {
        times = [
          { name: "Fajr", arabic: "الفجر", time: t["Fajr"] || "" },
          { name: "Sunrise", arabic: "الشروق", time: t["Sunrise"] || "" },
          { name: "Dhuhr", arabic: "الظهر", time: t["Dhuhr"] || "" },
          { name: "Asr", arabic: "العصر", time: t["Asr"] || "" },
          { name: "Maghrib", arabic: "المغرب", time: t["Maghrib"] || "" },
          { name: "Isha", arabic: "العشاء", time: t["Isha"] || "" },
        ];
      }
    }
  } catch { /* use empty times */ }

  const faqs = [
    { q: `What is Fajr time in ${apiCity} today?`, a: times.find(t => t.name === "Fajr")?.time ? `Fajr time in ${apiCity} today is ${times.find(t => t.name === "Fajr")!.time}.` : `Get live Fajr times in ${apiCity} using the MyTazki.` },
    { q: `What time is Zuhr in ${apiCity}?`, a: times.find(t => t.name === "Dhuhr")?.time ? `Dhuhr (Zuhr) time in ${apiCity} today is ${times.find(t => t.name === "Dhuhr")!.time}.` : `Check live Dhuhr times in ${apiCity} on MyTazki.` },
    { q: `What is the Isha prayer time in ${apiCity}?`, a: times.find(t => t.name === "Isha")?.time ? `Isha time in ${apiCity} today is ${times.find(t => t.name === "Isha")!.time}.` : `Get live Isha times for ${apiCity} on MyTazki.` },
    { q: `How many prayers are there in a day?`, a: "There are 5 obligatory (farz) daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha." },
  ];

  const schemas: object[] = [
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Prayer Times", item: "/prayer-times" },
      { name: `${apiCity}` },
    ]),
  ];

  const cityPool = isNamaz ? PAKISTAN_CITIES : INDIA_CITIES;
  const nearbyList = spreadCities(displayCity, cityPool, 12);

  const head = seoHead({
    title: `${isNamaz ? "Namaz" : "Prayer"} Times in ${apiCity} Today, ${dateStr}`,
    description: `Accurate Fajr, Dhuhr, Asr, Maghrib, Isha ${isNamaz ? "namaz" : "prayer"} times in ${apiCity} for ${dateStr}. Live times from aladhan.com.`,
    canonical,
    schema: schemas,
  });

  const body = `
${breadcrumb([
    { name: "Home", item: "/" },
    { name: "Prayer Times", item: "/prayer-times" },
    { name: apiCity },
  ])}
<h1>${isNamaz ? "Namaz" : "Prayer"} Times in ${esc(apiCity)} Today, ${esc(dateStr)}</h1>
<p style="color:#4a7a4a;margin-bottom:24px">Live ${isNamaz ? "namaz" : "salah"} times for ${esc(apiCity)}, <strong>${esc(isoDate)}</strong></p>

${times.length > 0 ? `
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:24px 0">
  ${times.map(t => `<div class="card" style="text-align:center">
    <p class="arabic" style="font-size:1.2rem;margin:0 0 4px">${t.arabic}</p>
    <p style="margin:0 0 4px;font-weight:bold;color:#e8f5e8">${esc(t.name)}</p>
    <p style="margin:0;font-size:1.4rem;color:#00a550;font-weight:bold;font-family:monospace">${esc(t.time)}</p>
  </div>`).join("")}
</div>
` : `<div class="card"><p style="color:#4a7a4a;margin:0">Prayer times are loading. Download MyTazki for live times.</p></div>`}

${ctaBlock()}

<h2>Mosques near ${esc(apiCity)}</h2>
<p style="color:#4a7a4a">Find your nearest masjid with the <a href="/masjid-finder" style="color:#00a550">MyTazki Masjid Finder</a>. Navigate directly from your phone.</p>

<h2>Learn Salah</h2>
<p style="color:#4a7a4a">New to prayer? Follow the complete <a href="/salah-guide" style="color:#00a550">Salah Guide</a> with Arabic text and step-by-step instructions.</p>

<h2>${isNamaz ? "Other Pakistan Cities" : "Other Indian Cities"}</h2>
<div style="display:flex;flex-wrap:wrap;gap:10px;margin:16px 0">
  ${nearbyList.map(c => {
    const slug = c.toLowerCase().replace(/\s+/g, "-").replace(/-pk$/i, "");
    const label = c.replace(/-PK$/i, "").replace(/-/g, " ");
    const prefix = isNamaz ? "namaz-times" : "prayer-times";
    return `<a href="/${prefix}/${slug}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:6px 14px;border-radius:20px;text-decoration:none;font-size:13px">${esc(label)}</a>`;
  }).join("")}
</div>

${faqHtml(faqs)}

<p style="color:#2a4a2a;font-size:13px;margin-top:24px">Prayer times are calculated using standard astronomical methods. Fajr and Isha use the University of Islamic Sciences, Karachi method. Times may vary ±1 minute based on location.</p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=900");
  res.send(page(head, body));
}

router.get("/prayer-times/:city", async (req: Request, res: Response) => {
  await cityPageHandler(String(req.params["city"] ?? ""), false, res);
});

router.get("/namaz-times/:city", async (req: Request, res: Response) => {
  await cityPageHandler(String(req.params["city"] ?? ""), true, res);
});

export default router;
