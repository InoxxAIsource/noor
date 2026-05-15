import { Router, type Request, type Response } from "express";
import { getAllNames } from "../lib/db.js";
import {
  seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc,
} from "./shared.js";

const router = Router();

interface Name {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  meaningEnglish: string;
  gender: string;
  origin: string;
  quranReference: string | null;
  prophetConnection: string | null;
  trending2025?: boolean;
  isForbidden?: boolean;
  similarNames?: string[];
  categories?: string[];
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

router.get("/names", async (_req: Request, res: Response) => {
  const rawNames = (await getAllNames() || []) as Name[];
  const categories = ["Quranic", "Prophet", "Sahaba", "Trending", "Boy", "Girl"];

  const head = seoHead({
    title: "Islamic Baby Names 2025, Arabic, Meaning & Origin",
    description: "Browse 1000+ Muslim baby names with Arabic, meaning, origin and Quran reference. Filter by boy, girl, Quranic, prophet names and more.",
    canonical: "/names",
    schema: [
      faqSchema([
        { q: "What are popular Muslim baby names in 2025?", a: "Popular Muslim names in 2025 include Muhammad, Ahmed, Fatima, Aisha, Ibrahim, Maryam, and Noor." },
        { q: "What are Quranic names for boys?", a: "Quranic boy names include Ibrahim, Yusuf, Musa, Isa, Adam, Yahya, and Luqman." },
        { q: "What are beautiful Muslim girl names?", a: "Beautiful Muslim girl names include Fatima, Aisha, Maryam, Zainab, Noor, Layla, and Amira." },
      ]),
    ],
  });

  const body = `
<h1>Islamic Baby Names, Arabic Meaning &amp; Origin</h1>
<p style="color:#4a7a4a">Explore 40+ authentic Muslim names with Arabic script, meaning, origin, and Quran reference.</p>

<div style="display:flex;flex-wrap:wrap;gap:10px;margin:20px 0">
  ${[
    ["/names/boy", "👦 Boy Names"],
    ["/names/girl", "👧 Girl Names"],
    ["/names/quranic", "📖 Quranic Names"],
    ["/names/prophet", "☪️ Prophet Names"],
    ["/names/trending", "🔥 Trending 2025"],
    ["/names/forbidden", "⚠️ Forbidden Names"],
  ].map(([href, label]) => `<a href="${href}" style="background:#002800;border:1px solid rgba(0,165,80,0.3);color:#00a550;padding:10px 18px;border-radius:20px;text-decoration:none;font-size:14px">${label}</a>`).join("")}
</div>

<h2>Browse by Letter</h2>
<div style="display:flex;flex-wrap:wrap;gap:6px;margin:12px 0">
  ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter =>
    `<a href="/names/boy/letter/${letter.toLowerCase()}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:13px">${letter}</a>`
  ).join("")}
</div>

<h2>Featured Names</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:16px 0">
  ${rawNames.slice(0, 12).map(n => `
    <a href="/names/${slugify(n.nameEnglish)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:14px;text-decoration:none;display:block">
      <p class="arabic" style="font-size:1.3rem;margin:0 0 4px">${n.nameArabic}</p>
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 2px">${esc(n.nameEnglish)}</p>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${esc(n.meaningEnglish)}</p>
    </a>
  `).join("")}
</div>

${ctaBlock()}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

async function genderPage(gender: "boy" | "girl", res: Response): Promise<void> {
  const rawNames = (await getAllNames() || []) as Name[];
  const names = rawNames.filter(n => n.gender === gender);
  const label = gender === "boy" ? "Boy" : "Girl";

  const head = seoHead({
    title: `Muslim ${label} Names A-Z, Arabic Meaning & Origin`,
    description: `Complete list of Muslim ${label.toLowerCase()} names with Arabic, meaning, and Quran reference. Updated 2025.`,
    canonical: `/names/${gender}`,
    schema: faqSchema([
      { q: `What are popular Muslim ${label.toLowerCase()} names?`, a: names.slice(0, 5).map(n => n.nameEnglish).join(", ") + " are popular Muslim " + label.toLowerCase() + " names." },
    ]),
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: `${label} Names` }])}
<h1>Muslim ${esc(label)} Names, Arabic Meaning &amp; Origin 2025</h1>
<p style="color:#4a7a4a">${names.length}+ authentic Muslim ${label.toLowerCase()} names with Arabic script and meaning.</p>

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:24px 0">
  ${names.map(n => `
    <a href="/names/${slugify(n.nameEnglish)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:14px;text-decoration:none;display:block">
      <p class="arabic" style="font-size:1.3rem;margin:0 0 4px">${n.nameArabic}</p>
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 2px">${esc(n.nameEnglish)}</p>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${esc(n.meaningEnglish)}</p>
      ${n.quranReference ? `<p style="color:#00a550;font-size:11px;margin:4px 0 0">Quran ${esc(n.quranReference)}</p>` : ""}
    </a>
  `).join("")}
</div>

${ctaBlock()}
<p style="color:#4a7a4a">Also see: <a href="/names/${gender === "boy" ? "girl" : "boy"}" style="color:#00a550">${gender === "boy" ? "Girl" : "Boy"} names</a> · <a href="/names/quranic" style="color:#00a550">Quranic names</a> · <a href="/names/prophet" style="color:#00a550">Prophet names</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
}

router.get("/names/boy", async (_req, res) => genderPage("boy", res));
router.get("/names/girl", async (_req, res) => genderPage("girl", res));

const ALPHA_NAV = (current: string, gender: "boy" | "girl") =>
  `<div style="display:flex;flex-wrap:wrap;gap:6px;margin:16px 0">
  ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l =>
    `<a href="/names/${gender}/letter/${l.toLowerCase()}" style="background:${l === current ? "#003a00" : "#002800"};border:1px solid rgba(0,165,80,${l === current ? "0.6" : "0.2"});color:${l === current ? "#00cc60" : "#00a550"};padding:5px 11px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:${l === current ? "bold" : "normal"}">${l}</a>`
  ).join("")}
</div>`;

router.get("/names/boy/letter/:letter", async (req: Request, res: Response) => {
  const letter = String(req.params["letter"] ?? "").toUpperCase();
  const rawNames = (await getAllNames() || []) as Name[];
  const names = rawNames.filter(n => n.gender === "boy" && n.nameEnglish.startsWith(letter));

  const head = seoHead({
    title: `Muslim Boy Names Starting with ${letter}`,
    description: `Muslim boy names starting with ${letter}, Arabic meaning, origin, and Quran reference.`,
    canonical: `/names/boy/letter/${letter.toLowerCase()}`,
    schema: breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: `Boy Names, ${letter}` }]),
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: "Boy Names", item: "/names/boy" }, { name: `Letter ${letter}` }])}
<h1>Muslim Boy Names Starting with ${esc(letter)}</h1>
${ALPHA_NAV(letter, "boy")}
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:24px 0">
  ${names.length > 0 ? names.map(n => `
    <a href="/names/${slugify(n.nameEnglish)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:14px;text-decoration:none;display:block">
      <p class="arabic" style="font-size:1.3rem;margin:0 0 4px">${n.nameArabic}</p>
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 2px">${esc(n.nameEnglish)}</p>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${esc(n.meaningEnglish)}</p>
    </a>
  `).join("") : `<div class="card"><p style="color:#4a7a4a">No boy names starting with ${esc(letter)} in our current database. <a href="/names/boy" style="color:#00a550">Browse all boy names</a>.</p></div>`}
</div>
${ctaBlock()}
<p style="color:#4a7a4a;margin-top:8px">Also see: <a href="/names/girl/letter/${letter.toLowerCase()}" style="color:#00a550">Girl names starting with ${esc(letter)}</a> · <a href="/names/boy" style="color:#00a550">All boy names</a> · <a href="/names/trending" style="color:#00a550">Trending names 2025</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

router.get("/names/girl/letter/:letter", async (req: Request, res: Response) => {
  const letter = String(req.params["letter"] ?? "").toUpperCase();
  const rawNames = (await getAllNames() || []) as Name[];
  const names = rawNames.filter(n => n.gender === "girl" && n.nameEnglish.startsWith(letter));

  const head = seoHead({
    title: `Muslim Girl Names Starting with ${letter}`,
    description: `Muslim girl names starting with ${letter}, Arabic meaning, origin, and Quran reference.`,
    canonical: `/names/girl/letter/${letter.toLowerCase()}`,
    schema: breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: `Girl Names, ${letter}` }]),
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: "Girl Names", item: "/names/girl" }, { name: `Letter ${letter}` }])}
<h1>Muslim Girl Names Starting with ${esc(letter)}</h1>
${ALPHA_NAV(letter, "girl")}
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:24px 0">
  ${names.length > 0 ? names.map(n => `
    <a href="/names/${slugify(n.nameEnglish)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:14px;text-decoration:none;display:block">
      <p class="arabic" style="font-size:1.3rem;margin:0 0 4px">${n.nameArabic}</p>
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 2px">${esc(n.nameEnglish)}</p>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${esc(n.meaningEnglish)}</p>
    </a>
  `).join("") : `<div class="card"><p style="color:#4a7a4a">No girl names starting with ${esc(letter)} in our current database. <a href="/names/girl" style="color:#00a550">Browse all girl names</a>.</p></div>`}
</div>
${ctaBlock()}
<p style="color:#4a7a4a;margin-top:8px">Also see: <a href="/names/boy/letter/${letter.toLowerCase()}" style="color:#00a550">Boy names starting with ${esc(letter)}</a> · <a href="/names/girl" style="color:#00a550">All girl names</a> · <a href="/names/trending" style="color:#00a550">Trending names 2025</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

async function categoryPage(category: string, title: string, description: string, filter: (n: Name) => boolean, res: Response): Promise<void> {
  const rawNames = (await getAllNames() || []) as Name[];
  const names = rawNames.filter(filter);

  const head = seoHead({
    title,
    description,
    canonical: `/names/${category}`,
    schema: breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: title }]),
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: title }])}
<h1>${esc(title)}</h1>
<p style="color:#4a7a4a">${esc(description)}</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:24px 0">
  ${names.map(n => `
    <a href="/names/${slugify(n.nameEnglish)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:14px;text-decoration:none;display:block">
      <p class="arabic" style="font-size:1.3rem;margin:0 0 4px">${n.nameArabic}</p>
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 2px">${esc(n.nameEnglish)}</p>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${esc(n.meaningEnglish)}</p>
      ${n.quranReference ? `<p style="color:#00a550;font-size:11px;margin:4px 0 0">Quran ${esc(n.quranReference)}</p>` : ""}
    </a>
  `).join("")}
</div>
${ctaBlock()}
<p style="color:#4a7a4a">Related: <a href="/names/boy" style="color:#00a550">Boy names</a> · <a href="/names/girl" style="color:#00a550">Girl names</a> · <a href="/blog/how-to-choose-muslim-name" style="color:#00a550">How to choose a Muslim name</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
}

router.get("/names/quranic", async (_req, res) =>
  categoryPage("quranic", "Quranic Names for Boys and Girls", "Names mentioned in the Holy Quran with their Arabic meaning and reference.", n => !!n.quranReference, res));

router.get("/names/prophet", async (_req, res) =>
  categoryPage("prophet", "Prophet Names in Islam", "Names of the Prophets of Islam mentioned in the Quran and Sunnah.", n => !!n.prophetConnection, res));

router.get("/names/forbidden", async (_req, res) =>
  categoryPage("forbidden", "Forbidden Names in Islam", "Names that are not allowed in Islam according to scholars, with explanations.", n => !!n.isForbidden, res));

router.get("/names/trending", async (_req, res) =>
  categoryPage("trending", "Trending Muslim Names 2025, India & Pakistan", "The most popular Muslim baby names in India and Pakistan in 2025.", n => !!n.trending2025, res));

router.get("/names/:slug", async (req: Request, res: Response) => {
  const slug = String(req.params["slug"] ?? "");
  const rawNames = (await getAllNames() || []) as Name[];
  const name = rawNames.find(n => slugify(n.nameEnglish) === slug);

  if (!name) {
    res.redirect(302, "/names");
    return;
  }

  const faqs = [
    { q: `What does ${name.nameEnglish} mean in Islam?`, a: name.meaningEnglish },
    { q: `Is ${name.nameEnglish} mentioned in the Quran?`, a: name.quranReference ? `Yes, ${name.nameEnglish} is mentioned in the Quran (${name.quranReference}).` : `${name.nameEnglish} is not directly mentioned in the Quran but is a recognized Islamic name.` },
    { q: `Is ${name.nameEnglish} a prophet name?`, a: name.prophetConnection ? name.prophetConnection : `${name.nameEnglish} is not a prophet's name but is a blessed Islamic name.` },
    { q: `What is the Arabic of ${name.nameEnglish}?`, a: `The Arabic of ${name.nameEnglish} is "${name.nameArabic}".` },
  ];

  const similar = rawNames
    .filter(n => n.gender === name.gender && n.nameEnglish !== name.nameEnglish)
    .slice(0, 3);

  const head = seoHead({
    title: `${name.nameEnglish} Name Meaning in Islam, Arabic, Origin, Quran`,
    description: `${name.nameEnglish} (${name.nameArabic}) means "${name.meaningEnglish}" in Arabic. ${name.quranReference ? `Mentioned in Quran ${name.quranReference}.` : ""} ${name.prophetConnection || ""}`,
    canonical: `/names/${slug}`,
    schema: [
      faqSchema(faqs),
      breadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Names", item: "/names" },
        { name: name.nameEnglish },
      ]),
    ],
  });

  const body = `
${breadcrumb([
    { name: "Home", item: "/" },
    { name: "Names", item: "/names" },
    { name: `${name.gender === "boy" ? "Boy" : "Girl"} Names`, item: `/names/${name.gender}` },
    { name: name.nameEnglish },
  ])}
<h1>${esc(name.nameEnglish)}, Name Meaning in Islam</h1>

<div class="card" style="margin:24px 0;text-align:center">
  <p class="arabic" style="font-size:3rem;margin:0 0 8px">${name.nameArabic}</p>
  <p style="color:#ffd700;font-family:Cinzel,serif;font-size:1.5rem;margin:0 0 8px">${esc(name.nameEnglish)}</p>
  <p class="transliteration" style="font-size:1rem;margin:0">${esc(name.nameEnglish)}</p>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin:24px 0">
  <div class="card">
    <p style="color:#4a7a4a;font-size:12px;text-transform:uppercase;margin:0 0 4px">Meaning</p>
    <p style="margin:0;color:#e8f5e8">${esc(name.meaningEnglish)}</p>
  </div>
  <div class="card">
    <p style="color:#4a7a4a;font-size:12px;text-transform:uppercase;margin:0 0 4px">Origin</p>
    <p style="margin:0;color:#e8f5e8">${esc(name.origin)}</p>
  </div>
  <div class="card">
    <p style="color:#4a7a4a;font-size:12px;text-transform:uppercase;margin:0 0 4px">Gender</p>
    <p style="margin:0;color:#e8f5e8">${name.gender === "boy" ? "👦 Boy" : "👧 Girl"}</p>
  </div>
  ${name.quranReference ? `<div class="card">
    <p style="color:#4a7a4a;font-size:12px;text-transform:uppercase;margin:0 0 4px">Quran Reference</p>
    <p style="margin:0;color:#00a550">${esc(name.quranReference)}</p>
  </div>` : ""}
</div>

${name.prophetConnection ? `<div class="card" style="border-color:rgba(255,215,0,0.3)"><p style="color:#ffd700;font-size:13px;text-transform:uppercase;margin:0 0 4px">Prophet Connection</p><p style="margin:0;color:#e8f5e8">${esc(name.prophetConnection)}</p></div>` : ""}

${ctaBlock()}

${similar.length > 0 ? `
<h2>Similar Names</h2>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0">
  ${similar.map(n => `<a href="/names/${slugify(n.nameEnglish)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:8px 16px;border-radius:8px;text-decoration:none">${esc(n.nameEnglish)}, ${esc(n.meaningEnglish)}</a>`).join("")}
</div>` : ""}

${faqHtml(faqs)}

<p style="color:#4a7a4a">Related: <a href="/names/${name.gender}" style="color:#00a550">More ${name.gender === "boy" ? "boy" : "girl"} names</a> · <a href="/blog/best-muslim-baby-names-2025" style="color:#00a550">Best Muslim names 2025</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(page(head, body));
});

export default router;
