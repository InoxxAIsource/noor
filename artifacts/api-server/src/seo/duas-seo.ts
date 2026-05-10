import { Router, type Request, type Response } from "express";
import { getAllDuas } from "../lib/db.js";
import {
  seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc,
} from "./shared.js";

const router = Router();

interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  meaningEnglish: string;
  source: string;
  category: string;
  isPopular?: boolean;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Morning: "Morning azkar and duas — Recite these supplications every morning for protection and blessings.",
  Evening: "Evening azkar and duas — Recite these supplications every evening for protection.",
  Forgiveness: "Duas for forgiveness and repentance — Seek Allah's mercy with these authentic supplications.",
  Protection: "Duas for protection from evil, harm, and adversity.",
  "Daily Life": "Duas for everyday activities — eating, drinking, traveling, and more.",
  Sleep: "Duas before sleeping and upon waking — for peaceful sleep and morning blessings.",
  Travel: "Duas for travel and journeys — seek Allah's protection on your travels.",
  Hardship: "Duas for hardship, anxiety, stress, and difficult times.",
  Gratitude: "Duas of gratitude and thankfulness to Allah.",
  Salah: "Duas related to prayer — before, during, and after Salah.",
  Quran: "Duas for reciting the Quran and seeking knowledge.",
  Family: "Duas for family, parents, spouse, and children.",
};

router.get("/duas", async (_req: Request, res: Response) => {
  const rawDuas = (await getAllDuas() || []) as Dua[];
  const categories = [...new Set(rawDuas.map(d => d.category))].sort();

  const head = seoHead({
    title: "Islamic Duas — Arabic, Transliteration & Meaning",
    description: "Collection of 200+ authentic Islamic duas with Arabic text, transliteration, English meaning and source. Morning, evening, travel, protection duas and more.",
    canonical: "/duas",
    schema: faqSchema([
      { q: "What is a dua in Islam?", a: "A dua (supplication) is a direct personal prayer to Allah. Unlike salah, dua can be made at any time in any language." },
      { q: "What is the most powerful dua?", a: "Sayyid al-Istighfar (the master supplication for forgiveness) is considered one of the most powerful duas." },
      { q: "What is the morning dua?", a: "The morning dua includes Alhamdu lillahil-ladhi ahyana ba'da ma amatana — All praise is for Allah who gave us life after having taken it from us." },
    ]),
  });

  const body = `
<h1>Islamic Duas — Arabic &amp; Meaning</h1>
<p style="color:#4a7a4a">Authentic supplications from the Quran and Sunnah with Arabic, transliteration, and meaning.</p>

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:24px 0">
  ${categories.map(cat => {
    const count = rawDuas.filter(d => d.category === cat).length;
    return `<a href="/duas/${slugify(cat)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:16px;text-decoration:none;display:block">
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 4px">${esc(cat)} Duas</p>
      <p style="color:#4a7a4a;font-size:13px;margin:0">${count} duas</p>
    </a>`;
  }).join("")}
</div>

<h2>Popular Duas</h2>
<div style="space-y:12px;margin:16px 0">
  ${rawDuas.filter(d => d.isPopular).slice(0, 6).map(d => `
    <a href="/duas/${slugify(d.title)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:16px;text-decoration:none;display:block;margin-bottom:10px">
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 6px">${esc(d.title)}</p>
      <p class="arabic" style="font-size:1.1rem;margin:0 0 6px;line-height:1.8">${d.arabic.substring(0, 60)}...</p>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${esc(d.category)} · ${esc(d.source)}</p>
    </a>
  `).join("")}
</div>

${ctaBlock()}
<p style="color:#4a7a4a;margin-top:16px">Related: <a href="/sessions" style="color:#00a550">Guided audio sessions</a> · <a href="/quran" style="color:#00a550">Quran recitation</a> · <a href="/blog" style="color:#00a550">Islamic blog</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

router.get("/duas/:slug", async (req: Request, res: Response) => {
  const slug = req.params["slug"]!;
  const rawDuas = (await getAllDuas() || []) as Dua[];

  const byCategory = rawDuas.find(d => slugify(d.category) === slug);
  if (byCategory) {
    const category = byCategory.category;
    const dues = rawDuas.filter(d => d.category === category);
    const desc = CATEGORY_DESCRIPTIONS[category] || `${category} duas from the Quran and Sunnah.`;

    const head = seoHead({
      title: `${category} Duas — Arabic, Transliteration & Meaning`,
      description: desc,
      canonical: `/duas/${slug}`,
      schema: [
        breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Duas", item: "/duas" }, { name: `${category} Duas` }]),
        faqSchema([
          { q: `What are ${category.toLowerCase()} duas?`, a: desc },
          { q: `How many ${category.toLowerCase()} duas are there?`, a: `There are ${dues.length} ${category.toLowerCase()} duas in our collection from Bukhari, Muslim, Tirmidhi, and the Quran.` },
        ]),
      ],
    });

    const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Duas", item: "/duas" }, { name: `${category} Duas` }])}
<h1>${esc(category)} Duas — Arabic &amp; Meaning</h1>
<p style="color:#4a7a4a">${esc(desc)}</p>

${dues.map(d => `
  <div class="card" style="margin-bottom:16px">
    <h2 style="font-size:1.1rem;margin:0 0 10px"><a href="/duas/${slugify(d.title)}" style="color:#ffd700;text-decoration:none">${esc(d.title)}</a></h2>
    <p class="arabic" style="font-size:1.3rem;line-height:2;margin:0 0 8px">${d.arabic}</p>
    <p class="transliteration" style="margin:0 0 6px">${esc(d.transliteration)}</p>
    <p style="color:#a0c8a0;margin:0 0 6px">${esc(d.meaningEnglish)}</p>
    <p style="color:#2a4a2a;font-size:12px;margin:0">Source: ${esc(d.source)}</p>
  </div>
`).join("")}

${ctaBlock()}
`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(page(head, body));
    return;
  }

  const dua = rawDuas.find(d => slugify(d.title) === slug);
  if (!dua) {
    res.redirect(302, "/duas");
    return;
  }

  const related = rawDuas.filter(d => d.category === dua.category && d.title !== dua.title).slice(0, 3);

  const faqs = [
    { q: `When should I say ${dua.title}?`, a: `${dua.title} is a ${dua.category.toLowerCase()} dua. Recite it during your ${dua.category.toLowerCase()} routine or whenever you need this supplication.` },
    { q: `What is the source of ${dua.title}?`, a: `This dua is narrated in ${dua.source}.` },
    { q: `What does ${dua.title} mean?`, a: dua.meaningEnglish },
  ];

  const head = seoHead({
    title: `${dua.title} — Arabic, Meaning and When to Say It`,
    description: `${dua.title}: "${dua.meaningEnglish.substring(0, 100)}..." Arabic text, transliteration and English meaning. Source: ${dua.source}.`,
    canonical: `/duas/${slug}`,
    schema: [
      { "@context": "https://schema.org", "@type": "Article", "headline": `${dua.title} — Arabic and Meaning`, "description": dua.meaningEnglish, "author": { "@type": "Organization", "name": "Noor App" }, "publisher": { "@type": "Organization", "name": "Noor App" } },
      faqSchema(faqs),
      breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Duas", item: "/duas" }, { name: `${dua.category}`, item: `/duas/${slugify(dua.category)}` }, { name: dua.title }]),
    ],
  });

  const body = `
${breadcrumb([
    { name: "Home", item: "/" },
    { name: "Duas", item: "/duas" },
    { name: dua.category, item: `/duas/${slugify(dua.category)}` },
    { name: dua.title },
  ])}
<h1>${esc(dua.title)} — Arabic, Meaning and When to Say It</h1>

<div class="card" style="margin:24px 0;text-align:center;padding:24px">
  <p class="arabic" style="font-size:1.8rem;line-height:2.2;margin:0 0 16px">${dua.arabic}</p>
  <p class="transliteration" style="font-size:1rem;margin:0 0 16px">${esc(dua.transliteration)}</p>
  <p style="color:#a0c8a0;font-size:0.95rem;max-width:600px;margin:0 auto">${esc(dua.meaningEnglish)}</p>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:24px 0">
  <div class="card"><p style="color:#4a7a4a;font-size:12px;margin:0 0 4px;text-transform:uppercase">Source</p><p style="margin:0;color:#e8f5e8">${esc(dua.source)}</p></div>
  <div class="card"><p style="color:#4a7a4a;font-size:12px;margin:0 0 4px;text-transform:uppercase">Category</p><p style="margin:0;color:#e8f5e8">${esc(dua.category)}</p></div>
  <div class="card"><p style="color:#4a7a4a;font-size:12px;margin:0 0 4px;text-transform:uppercase">When to Recite</p><p style="margin:0;color:#e8f5e8">${esc(dua.category)} time</p></div>
</div>

${ctaBlock()}

${related.length > 0 ? `
<h2>Related Duas</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:16px 0">
  ${related.map(d => `<a href="/duas/${slugify(d.title)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:14px;text-decoration:none;display:block">
    <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.85rem;margin:0 0 4px">${esc(d.title)}</p>
    <p style="color:#4a7a4a;font-size:12px;margin:0">${esc(d.meaningEnglish).substring(0, 60)}...</p>
  </a>`).join("")}
</div>` : ""}

${faqHtml(faqs)}
<p style="color:#4a7a4a;margin-top:16px">Listen to guided: <a href="/sessions" style="color:#00a550">Dhikr &amp; Dua sessions on Noor</a> · <a href="/duas/${slugify(dua.category)}" style="color:#00a550">More ${esc(dua.category)} duas</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(page(head, body));
});

export default router;
