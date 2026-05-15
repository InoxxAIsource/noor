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
  const top5 = names.slice(0, 5).map(n => n.nameEnglish).join(", ");
  const quranicCount = names.filter(n => n.quranReference).length;

  const faqs = [
    { q: `What are the most popular Muslim ${label.toLowerCase()} names in 2025?`, a: `The most popular Muslim ${label.toLowerCase()} names in 2025 include ${top5}. These names are widely chosen across India, Pakistan, and Muslim communities worldwide.` },
    { q: `How do I choose a good Muslim ${label.toLowerCase()} name?`, a: `When choosing a Muslim ${label.toLowerCase()} name, look for names with positive meanings in Arabic, names mentioned in the Quran or Sunnah, and names of righteous companions or prophets. Avoid names with negative meanings or names exclusively belonging to non-Muslim deities.` },
    { q: `Which Muslim ${label.toLowerCase()} names are mentioned in the Quran?`, a: `There are ${quranicCount}+ Quranic ${label.toLowerCase()} names in our database. Quranic names carry special blessing (barakah) as they appear in the words of Allah. Browse our Quranic names collection for the full list.` },
    { q: `What is the importance of a name in Islam?`, a: `In Islam, a name is considered a du'a (prayer) that follows a person throughout their life. The Prophet Muhammad (PBUH) said: "You will be called by your names and the names of your fathers on the Day of Resurrection, so choose good names." (Abu Dawud)` },
  ];

  const head = seoHead({
    title: `Muslim ${label} Names A-Z, Arabic Meaning & Origin`,
    description: `Browse ${names.length}+ Muslim ${label.toLowerCase()} names with Arabic script, English meaning, origin, and Quranic reference. Find the perfect Islamic name for your baby ${label.toLowerCase()} — updated 2025.`,
    canonical: `/names/${gender}`,
    schema: faqSchema(faqs),
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: `${label} Names` }])}
<h1>Muslim ${esc(label)} Names, Arabic Meaning &amp; Origin 2025</h1>
<p style="color:#4a7a4a;line-height:1.7;margin:0 0 12px">Browse our complete collection of ${names.length}+ authentic Muslim ${label.toLowerCase()} names with Arabic script, English meaning, origin, and Quranic reference. Each name includes its root meaning in Arabic, whether it appears in the Quran, and guidance on correct pronunciation.</p>
<p style="color:#4a7a4a;line-height:1.7;margin:0 0 20px">Islamic scholars emphasise that a child's name is a lifelong du'a — so choosing a name with a beautiful, meaningful root is an important Sunnah. Names of prophets, companions, and those mentioned in the Quran carry special blessing.</p>

<div style="display:flex;flex-wrap:wrap;gap:8px;margin:0 0 24px">
  <a href="/names/quranic" style="background:#002800;border:1px solid rgba(0,165,80,0.3);color:#00a550;padding:8px 16px;border-radius:20px;text-decoration:none;font-size:13px">📖 Quranic Names</a>
  <a href="/names/prophet" style="background:#002800;border:1px solid rgba(0,165,80,0.3);color:#00a550;padding:8px 16px;border-radius:20px;text-decoration:none;font-size:13px">☪️ Prophet Names</a>
  <a href="/names/trending" style="background:#002800;border:1px solid rgba(0,165,80,0.3);color:#00a550;padding:8px 16px;border-radius:20px;text-decoration:none;font-size:13px">🔥 Trending 2025</a>
  <a href="/names/${gender === "boy" ? "girl" : "boy"}" style="background:#002800;border:1px solid rgba(0,165,80,0.3);color:#00a550;padding:8px 16px;border-radius:20px;text-decoration:none;font-size:13px">${gender === "boy" ? "👧 Girl Names" : "👦 Boy Names"}</a>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:0 0 32px">
  ${names.map(n => `
    <a href="/names/${slugify(n.nameEnglish)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:14px;text-decoration:none;display:block">
      <p class="arabic" style="font-size:1.3rem;margin:0 0 4px">${n.nameArabic}</p>
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 2px">${esc(n.nameEnglish)}</p>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${esc(n.meaningEnglish)}</p>
      ${n.quranReference ? `<p style="color:#00a550;font-size:11px;margin:4px 0 0">Quran ${esc(n.quranReference)}</p>` : ""}
    </a>
  `).join("")}
</div>

${faqHtml(faqs)}
${ctaBlock()}
<p style="color:#4a7a4a">Also see: <a href="/names/${gender === "boy" ? "girl" : "boy"}" style="color:#00a550">${gender === "boy" ? "Girl" : "Boy"} names</a> · <a href="/names/quranic" style="color:#00a550">Quranic names</a> · <a href="/names/prophet" style="color:#00a550">Prophet names</a> · <a href="/names/trending" style="color:#00a550">Trending 2025</a></p>
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

interface CategoryConfig {
  title: string;
  description: string;
  intro: string;
  faqs: Array<{ q: string; a: string }>;
  filter: (n: Name) => boolean;
}

async function categoryPage(category: string, cfg: CategoryConfig, res: Response): Promise<void> {
  const rawNames = (await getAllNames() || []) as Name[];
  const names = rawNames.filter(cfg.filter);

  const head = seoHead({
    title: cfg.title,
    description: cfg.description,
    canonical: `/names/${category}`,
    schema: [
      faqSchema(cfg.faqs),
      breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: cfg.title }]),
    ],
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Names", item: "/names" }, { name: cfg.title }])}
<h1>${esc(cfg.title)}</h1>
<p style="color:#4a7a4a;line-height:1.7;margin:0 0 12px">${esc(cfg.intro)}</p>
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
${faqHtml(cfg.faqs)}
${ctaBlock()}
<p style="color:#4a7a4a">Related: <a href="/names/boy" style="color:#00a550">Boy names</a> · <a href="/names/girl" style="color:#00a550">Girl names</a> · <a href="/names/trending" style="color:#00a550">Trending 2025</a> · <a href="/blog/how-to-choose-muslim-name" style="color:#00a550">How to choose a Muslim name</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
}

router.get("/names/quranic", async (_req, res) =>
  categoryPage("quranic", {
    title: "Quranic Names for Boys and Girls",
    description: "Names mentioned in the Holy Quran with Arabic script, English meaning, and Quran verse reference. Quranic baby names for boys and girls, updated 2025.",
    intro: "Quranic names are those that appear directly in the words of Allah in the Holy Quran. Giving your child a Quranic name is a beloved Sunnah — these names carry deep spiritual meaning and a direct connection to divine scripture. Each name below includes the Arabic text, its meaning, and the Quranic verse where it appears.",
    faqs: [
      { q: "What are the best Quranic names for boys?", a: "The most beloved Quranic boy names include Ibrahim (Abraham), Yusuf (Joseph), Musa (Moses), Isa (Jesus), Adam, Yahya (John), Idris, Luqman, and Dawud (David). These are names of prophets mentioned directly in the Quran." },
      { q: "What are beautiful Quranic names for girls?", a: "Beautiful Quranic girl names include Maryam (Mary), Aisha, Fatima, Zainab, Asiya, and Hawwa (Eve). Maryam is the only woman named directly in the Quran and has an entire surah (chapter) named after her." },
      { q: "Are Quranic names better than other Muslim names?", a: "Quranic names carry a special blessing (barakah) because they appear in the words of Allah. While all names with good meanings are permissible in Islam, scholars recommend choosing names mentioned in the Quran or Sunnah as a first preference." },
      { q: "How many names are mentioned in the Quran?", a: "The Quran mentions the names of 25 prophets, several companions, and a number of righteous individuals. The total count of distinct personal names in the Quran is approximately 50-60, covering both male and female names." },
    ],
    filter: n => !!n.quranReference,
  }, res));

router.get("/names/prophet", async (_req, res) =>
  categoryPage("prophet", {
    title: "Prophet Names in Islam",
    description: "Prophet names in Islam with Arabic meaning and Quranic reference. Names of all 25 prophets mentioned in the Quran — a blessed Islamic choice for your baby boy.",
    intro: "Islam recognises 25 prophets mentioned by name in the Holy Quran, from Adam (the first prophet) to Muhammad ﷺ (the final messenger). Naming a child after a prophet is among the most highly recommended choices in Islam. The Prophet Muhammad ﷺ said: 'Name yourselves with the names of the prophets.' (Abu Dawud). Each name below carries a rich history and spiritual significance.",
    faqs: [
      { q: "How many prophets are named in the Quran?", a: "The Quran names 25 prophets: Adam, Idris, Nuh, Hud, Salih, Ibrahim, Lut, Ismail, Ishaq, Yaqub, Yusuf, Shuaib, Ayyub, Musa, Harun, Dhul-Kifl, Dawud, Sulaiman, Ilyas, Al-Yasa, Yunus, Zakariyya, Yahya, Isa, and Muhammad (peace be upon them all)." },
      { q: "Which prophet name is most popular for Muslim boys?", a: "Muhammad is the most common Muslim boy name globally, chosen in honour of the Prophet Muhammad ﷺ. Ibrahim, Yusuf, Musa, and Dawud are also extremely popular prophet names for Muslim boys in India, Pakistan, and across the world." },
      { q: "Is it Sunnah to name a child after a prophet?", a: "Yes, naming a child after a prophet is highly recommended in Islam. The Prophet ﷺ said: 'Name yourselves with the names of the prophets. The most beloved names to Allah are Abdullah and Abdur-Rahman.' (Abu Dawud). Prophet names bring barakah and a connection to Islamic heritage." },
      { q: "Can I give my daughter a prophet's name?", a: "Prophet names are typically used for boys. For girls, names from female companions (Sahabiyat) like Aisha, Fatima, Khadijah, and Maryam are recommended. However, some names like Maryam (Mary) are both prophetess-adjacent and directly Quranic." },
    ],
    filter: n => !!n.prophetConnection,
  }, res));

router.get("/names/forbidden", async (_req, res) =>
  categoryPage("forbidden", {
    title: "Forbidden Names in Islam",
    description: "Names that are not allowed in Islam according to Islamic scholars, with explanations of why each name is prohibited and better alternatives to consider.",
    intro: "Islamic scholars have identified certain categories of names that are forbidden or strongly disliked in Islam. These include names that attribute servitude to anyone other than Allah, names of false deities, names with evil meanings, and names that imply arrogance. Below is a guide to names Muslims should avoid and the scholarly reasoning behind each.",
    faqs: [
      { q: "What types of names are forbidden in Islam?", a: "Forbidden names in Islam include: names meaning servitude to other than Allah (e.g. Abd-ul-Uzza), names of false deities, names that imply divine attributes belonging only to Allah (e.g. Malik-ul-Muluk), names with evil or degrading meanings, and names exclusively used by non-Muslims in a religious context." },
      { q: "Is it forbidden to name a child Iblees or Shaitan?", a: "Yes, names like Iblees (Satan) or Shaitan are absolutely forbidden in Islam. Similarly, names meaning rebellion, wickedness, or evil are strongly prohibited as Islamic scholars consider a name to be a lifelong du'a for the child." },
      { q: "What should I do if my child has a forbidden name?", a: "If a child has been given a forbidden or disliked name, it is recommended to change it. The Prophet Muhammad ﷺ himself changed several names of companions to better ones. It is not too late to give a child a new, blessed Islamic name." },
    ],
    filter: n => !!n.isForbidden,
  }, res));

router.get("/names/trending", async (_req, res) =>
  categoryPage("trending", {
    title: "Trending Muslim Names 2025, India & Pakistan",
    description: "The most popular Muslim baby names in India and Pakistan in 2025. Trending Islamic names with Arabic meaning and Quranic significance — for boys and girls.",
    intro: "These are the most searched and chosen Muslim baby names in India and Pakistan in 2025. Trending Islamic names blend traditional Arabic roots with modern appeal — names that sound beautiful in both Arabic and English. Whether you are looking for a classic name with deep meaning or a modern Islamic name gaining popularity, this list covers the most beloved choices of the year.",
    faqs: [
      { q: "What are the most trending Muslim boy names in 2025?", a: "Trending Muslim boy names in India and Pakistan in 2025 include Muhammad, Ahmed, Ali, Ibrahim, Ayaan, Zayan, Hamza, Omar, Bilal, and Rayaan. These names combine strong Islamic heritage with modern popularity." },
      { q: "What are the most trending Muslim girl names in 2025?", a: "Trending Muslim girl names in 2025 include Fatima, Aisha, Maryam, Zara, Noor, Layla, Inaya, Amira, Hana, and Safiya. These names are rising in popularity across India, Pakistan, UAE, and Muslim communities in the UK." },
      { q: "Why are certain Muslim names trending in 2025?", a: "Names trend due to cultural influences, popular Islamic figures, social media, and regional traditions. In 2025, short 2-3 syllable names with positive Arabic meanings are particularly popular, as they work well in both native languages and English-speaking environments." },
      { q: "Are trending names a good choice Islamically?", a: "Trending names can be excellent Islamic choices as long as they have positive meanings in Arabic, are not forbidden in Islam, and ideally have a Quranic or Sunnah connection. Popularity does not diminish a name's Islamic value — Muhammad remains the most common name in the world precisely because of its religious significance." },
    ],
    filter: n => !!n.trending2025,
  }, res));

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
