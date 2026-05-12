import { Router, type Request, type Response } from "express";
import { getBlogPost, getAllBlogSlugs, setBlogPost } from "../lib/db.js";
import {
  seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc,
} from "./shared.js";

const router = Router();

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  datePublished: string;
  content_html: string;
  internalLinks: Array<{ href: string; label: string }>;
  wordCount?: number;
}

export const BLOG_STUBS: Omit<BlogPost, "content_html">[] = [
  { slug: "morning-azkar-guide", title: "Complete Morning Azkar Guide — Arabic & Transliteration", description: "The full morning azkar from Hisnul Muslim with Arabic, transliteration, and English meaning.", category: "Dhikr", datePublished: "2026-01-10", internalLinks: [{ href: "/duas/morning-supplication", label: "Morning Duas" }, { href: "/prayer-times/delhi", label: "Delhi Prayer Times" }, { href: "/salah-guide", label: "Salah Guide" }] },
  { slug: "dua-for-anxiety", title: "Dua for Anxiety and Stress — Quran & Hadith", description: "Powerful duas from the Quran and Sunnah to relieve anxiety, stress, and worry.", category: "Duas", datePublished: "2026-01-12", internalLinks: [{ href: "/duas/dua-for-anxiety", label: "Dua for Anxiety" }, { href: "/99-names", label: "99 Names of Allah" }, { href: "/sessions", label: "Guided Sessions" }] },
  { slug: "how-to-pray-namaz", title: "How to Pray Namaz — Complete Step by Step Guide 2026", description: "Learn how to perform all 5 daily prayers correctly with Arabic text, English translation, and rakaat breakdown.", category: "Prayer", datePublished: "2026-01-15", internalLinks: [{ href: "/salah-guide", label: "Salah Guide" }, { href: "/wudu-guide", label: "Wudu Guide" }, { href: "/prayer-times", label: "Prayer Times" }] },
  { slug: "best-muslim-baby-names-2025", title: "Best Muslim Baby Names 2025 — Boys & Girls with Meaning", description: "Top 50 Islamic baby names for boys and girls in 2025 with Arabic, meaning, and Quran reference.", category: "Names", datePublished: "2026-01-18", internalLinks: [{ href: "/names/boy", label: "Boy Names" }, { href: "/names/girl", label: "Girl Names" }, { href: "/names/quranic", label: "Quranic Names" }] },
  { slug: "quran-surah-fatiha-benefits", title: "Surah Al-Fatiha Benefits, Meaning & Tafsir", description: "The complete guide to Surah Al-Fatiha — meaning, word-by-word translation, benefits, and when to recite.", category: "Quran", datePublished: "2026-01-20", internalLinks: [{ href: "/quran/surah-fatiha", label: "Read Surah Fatiha" }, { href: "/duas", label: "More Duas" }, { href: "/salah-guide", label: "Salah Guide" }] },
  { slug: "zakat-gold-india-2026", title: "Zakat on Gold India 2026 — Calculator & Nisab Guide", description: "How to calculate Zakat on gold in India for 2026. Current gold price, Nisab amount, and Zakat formula in INR.", category: "Zakat", datePublished: "2026-01-22", internalLinks: [{ href: "/zakat-calculator", label: "Zakat Calculator" }, { href: "/islamic-calendar/2026", label: "Islamic Calendar 2026" }, { href: "/ramadan", label: "Ramadan 2026" }] },
  { slug: "wudu-step-by-step", title: "Wudu Step by Step — Complete Ablution Guide with Duas", description: "Learn how to perform Wudu (ablution) correctly with 11 steps, Arabic duas, and common mistakes to avoid.", category: "Prayer", datePublished: "2026-01-25", internalLinks: [{ href: "/wudu-guide", label: "Interactive Wudu Guide" }, { href: "/salah-guide", label: "Salah Guide" }, { href: "/duas", label: "Duas" }] },
  { slug: "dua-for-parents", title: "Dua for Parents — Arabic, Transliteration & Meaning", description: "The duas from the Quran and Sunnah for parents — for their forgiveness, health, and entry into Jannah.", category: "Duas", datePublished: "2026-01-28", internalLinks: [{ href: "/duas/dua-for-parents", label: "Dua for Parents" }, { href: "/quran/surah-baqarah", label: "Surah Baqarah" }, { href: "/sessions", label: "Family Duas Session" }] },
  { slug: "ramadan-preparation-guide", title: "Ramadan 2026 Preparation Guide — Everything You Need", description: "Complete guide to preparing for Ramadan 2026 spiritually, physically, and practically.", category: "Ramadan", datePublished: "2026-02-01", internalLinks: [{ href: "/ramadan", label: "Ramadan 2026 Dates" }, { href: "/duas", label: "Ramadan Duas" }, { href: "/quran", label: "Quran Reading Plan" }] },
  { slug: "99-names-of-allah-meanings", title: "99 Names of Allah (Asmaul Husna) — Arabic, Meaning & Benefits", description: "All 99 Names of Allah in Arabic with transliteration, English meaning, and benefits of each name.", category: "Dhikr", datePublished: "2026-02-03", internalLinks: [{ href: "/99-names", label: "99 Names of Allah" }, { href: "/duas", label: "Duas using Allah's names" }, { href: "/sessions", label: "Dhikr Sessions" }] },
  { slug: "tahajjud-prayer-guide", title: "Tahajjud Prayer — How to Pray, Best Time & Duas", description: "Complete guide to Tahajjud (night prayer) — how to pray, the best time to wake up, and duas to recite.", category: "Prayer", datePublished: "2026-02-05", internalLinks: [{ href: "/prayer-times/delhi", label: "Prayer Times" }, { href: "/salah-guide", label: "Salah Guide" }, { href: "/duas", label: "Night Prayer Duas" }] },
  { slug: "dua-after-salah", title: "Duas After Salah — Complete Post-Prayer Supplications", description: "All the authentic duas to recite after completing prayer — Ayatul Kursi, Subhanallah 33x, and more.", category: "Duas", datePublished: "2026-02-08", internalLinks: [{ href: "/duas/after-salah", label: "After Salah Duas" }, { href: "/tasbih", label: "Digital Tasbih" }, { href: "/salah-guide", label: "Salah Guide" }] },
  { slug: "how-to-make-dua", title: "How to Make Dua — Etiquettes, Best Times & Tips", description: "Learn the proper etiquettes of making dua — facing Qibla, raising hands, best times, and what to avoid.", category: "Duas", datePublished: "2026-02-10", internalLinks: [{ href: "/duas", label: "Duas Library" }, { href: "/qibla-direction", label: "Find Qibla" }, { href: "/sessions", label: "Guided Dua Sessions" }] },
  { slug: "quran-surah-yasin-benefits", title: "Surah Yasin Benefits, Meaning & When to Recite", description: "Everything about Surah Yasin — its benefits, meaning, when to recite, and the complete Arabic text.", category: "Quran", datePublished: "2026-02-12", internalLinks: [{ href: "/quran/surah-yasin", label: "Read Surah Yasin" }, { href: "/quran", label: "Quran Hub" }, { href: "/sessions", label: "Quran Sessions" }] },
  { slug: "istikhara-prayer-guide", title: "Salatul Istikhara — How to Pray & Dua", description: "Complete guide to Salatul Istikhara (prayer for guidance) — how to pray, the dua, and how to interpret signs.", category: "Prayer", datePublished: "2026-02-14", internalLinks: [{ href: "/salah-guide", label: "Salah Guide" }, { href: "/duas", label: "Duas" }, { href: "/sessions", label: "Guided Sessions" }] },
  { slug: "sadqa-jariyah-guide", title: "Sadqa Jariyah — Ongoing Charity in Islam with Examples", description: "What is Sadqa Jariyah? Complete guide with examples, how to give it, and the rewards in Islam.", category: "Charity", datePublished: "2026-02-16", internalLinks: [{ href: "/sadqa-guide", label: "Sadqa Guide" }, { href: "/zakat-calculator", label: "Zakat Calculator" }, { href: "/duas", label: "Duas for Wealth" }] },
  { slug: "baby-names-quran", title: "Baby Names Mentioned in the Quran — Boys & Girls", description: "All the Islamic baby names directly mentioned in the Holy Quran with their Arabic meaning and surah reference.", category: "Names", datePublished: "2026-02-18", internalLinks: [{ href: "/names/quranic", label: "Quranic Names" }, { href: "/quran", label: "Quran" }, { href: "/names", label: "All Islamic Names" }] },
  { slug: "friday-jumma-guide", title: "Friday Jumma Guide — Sunnah Acts, Duas & Surah Kahf", description: "Everything to do on Friday in Islam — Ghusl, Surah Kahf, Durood, Jumma dua, and after Asr supplications.", category: "Prayer", datePublished: "2026-02-20", internalLinks: [{ href: "/quran/surah-kahf", label: "Surah Al-Kahf" }, { href: "/duas", label: "Friday Duas" }, { href: "/prayer-times", label: "Jumma Prayer Times" }] },
  { slug: "dua-for-marriage", title: "Dua for Marriage in Islam — Getting Married & Nikah Duas", description: "Authentic duas for finding a righteous spouse, the Nikah ceremony, and the wedding night from the Quran and Sunnah.", category: "Duas", datePublished: "2026-02-22", internalLinks: [{ href: "/duas/dua-for-righteous-spouse", label: "Dua for Spouse" }, { href: "/farz-guide", label: "Nikah Guide" }, { href: "/names/girl", label: "Muslim Girl Names" }] },
  { slug: "islamic-calendar-2026-india", title: "Islamic Calendar 2026 India — All Dates & Events", description: "Complete Islamic calendar for India 2026 with all major events: Ramadan, Eid ul Fitr, Eid ul Adha, Ashura, Mawlid.", category: "Calendar", datePublished: "2026-01-01", internalLinks: [{ href: "/islamic-calendar/2026", label: "Islamic Calendar 2026" }, { href: "/ramadan", label: "Ramadan 2026" }, { href: "/prayer-times", label: "Prayer Times" }] },
  { slug: "quran-surah-kahf-benefits", title: "Surah Al-Kahf — Benefits, Story & Why Read on Friday", description: "Surah Al-Kahf benefits, stories of the Companions of the Cave, Khidr, and Dhul-Qarnayn. Why Muslims read it every Friday.", category: "Quran", datePublished: "2026-02-25", internalLinks: [{ href: "/quran/surah-kahf", label: "Read Surah Al-Kahf" }, { href: "/blog/friday-jumma-guide", label: "Friday Jumma Guide" }, { href: "/quran", label: "Quran Hub" }] },
  { slug: "namaz-times-india", title: "Namaz Times in India Today — All Cities 2026", description: "Live namaz (prayer) times for all major cities in India today — Fajr, Zuhr, Asr, Maghrib, Isha.", category: "Prayer", datePublished: "2026-01-05", internalLinks: [{ href: "/prayer-times/delhi", label: "Delhi Namaz Times" }, { href: "/prayer-times/mumbai", label: "Mumbai Prayer Times" }, { href: "/masjid-finder", label: "Masjid Near Me" }] },
  { slug: "ayatul-kursi-benefits", title: "Ayatul Kursi Benefits, Meaning & Complete Guide", description: "The greatest verse in the Quran — Ayatul Kursi (2:255) with Arabic, transliteration, meaning, and benefits.", category: "Quran", datePublished: "2026-03-01", internalLinks: [{ href: "/quran/ayatul-kursi", label: "Read Ayatul Kursi" }, { href: "/duas", label: "Protective Duas" }, { href: "/quran/surah-baqarah", label: "Surah Baqarah" }] },
  { slug: "dua-for-protection", title: "Dua for Protection — From Evil, Jinn & Bad Luck", description: "The most powerful duas for protection from evil, black magic, jinn, and harm. From Quran and authentic hadith.", category: "Duas", datePublished: "2026-03-03", internalLinks: [{ href: "/duas/protection-from-evil", label: "Protection Duas" }, { href: "/quran/surah-falaq", label: "Surah Al-Falaq" }, { href: "/quran/surah-nas", label: "Surah An-Nas" }] },
  { slug: "muslim-names-meaning-light", title: "Muslim Names Meaning Light — Noor, Zia, Siraj & More", description: "Beautiful Muslim names meaning light, brightness, and radiance in Arabic — for boys and girls.", category: "Names", datePublished: "2026-03-05", internalLinks: [{ href: "/names/noor", label: "Name Noor" }, { href: "/names", label: "All Islamic Names" }, { href: "/99-names", label: "Allah's Names" }] },
  { slug: "how-to-choose-muslim-name", title: "How to Choose a Muslim Baby Name — Complete Guide", description: "Islamic guidance on choosing a name for your baby — criteria, forbidden names, and how to give the name.", category: "Names", datePublished: "2026-03-07", internalLinks: [{ href: "/names", label: "Islamic Names" }, { href: "/names/forbidden", label: "Forbidden Names" }, { href: "/aqiqah-guide", label: "Aqiqah Guide" }] },
  { slug: "salah-mistakes-to-avoid", title: "10 Common Salah Mistakes and How to Fix Them", description: "The most common mistakes Muslims make in prayer and how to correct them according to Islamic scholars.", category: "Prayer", datePublished: "2026-03-10", internalLinks: [{ href: "/salah-guide", label: "Correct Salah Guide" }, { href: "/wudu-guide", label: "Wudu Guide" }, { href: "/prayer-times", label: "Prayer Times" }] },
  { slug: "surah-mulk-benefits", title: "Surah Al-Mulk — Benefits, Meaning & Why Read Before Sleep", description: "Surah Al-Mulk with Arabic text, meaning, and hadith about reciting it every night before sleep.", category: "Quran", datePublished: "2026-03-12", internalLinks: [{ href: "/quran/surah-mulk", label: "Read Surah Al-Mulk" }, { href: "/duas/before-sleeping", label: "Sleeping Duas" }, { href: "/quran", label: "Quran Hub" }] },
  { slug: "dua-for-rizq", title: "Dua for Rizq (Sustenance) — Barakah in Wealth & Income", description: "Powerful duas for increasing rizq, barakah in wealth, and sustenance from the Quran and authentic hadith.", category: "Duas", datePublished: "2026-03-14", internalLinks: [{ href: "/duas/dua-for-good-day", label: "Dua for Rizq" }, { href: "/zakat-calculator", label: "Give Zakat" }, { href: "/sadqa-guide", label: "Sadqa Guide" }] },
  { slug: "eid-ul-adha-2026", title: "Eid ul Adha 2026 — Date, Qurbani Guide & Duas", description: "Eid ul Adha 2026 date in India, complete Qurbani guide, conditions, and duas for Eid prayer.", category: "Events", datePublished: "2026-04-01", internalLinks: [{ href: "/qurbani-guide", label: "Qurbani Guide" }, { href: "/islamic-calendar/2026", label: "Islamic Calendar" }, { href: "/duas", label: "Eid Duas" }] },
  { slug: "hajj-guide-2026", title: "Hajj 2026 — Dates, Rituals & Step by Step Guide", description: "Complete Hajj 2026 guide for first-timers — dates, rituals, duas, and practical tips.", category: "Events", datePublished: "2026-04-05", internalLinks: [{ href: "/islamic-calendar/2026", label: "Islamic Calendar 2026" }, { href: "/qibla-direction", label: "Qibla Direction" }, { href: "/duas", label: "Hajj Duas" }] },
  { slug: "islamic-finance-zakat", title: "Islamic Finance & Zakat — Halal Investment Guide", description: "How to invest Islamically, what investments are halal/haram, and how Zakat applies to investments.", category: "Zakat", datePublished: "2026-04-08", internalLinks: [{ href: "/zakat-calculator", label: "Zakat Calculator" }, { href: "/farz-guide", label: "Halal Guide" }, { href: "/sadqa-guide", label: "Sadqa Jariyah" }] },
  { slug: "duas-for-students", title: "Duas for Students — Before Exams, Study & Success", description: "Authentic duas for students — before studying, during exams, for memory retention, and success.", category: "Duas", datePublished: "2026-04-10", internalLinks: [{ href: "/duas/dua-for-strength", label: "Dua for Strength" }, { href: "/duas/dua-for-good-day", label: "Morning Dua" }, { href: "/sessions", label: "Focus Sessions" }] },
  { slug: "masjid-etiquette", title: "Masjid Etiquette in Islam — Rules & Duas for Mosque", description: "Complete guide to masjid etiquette — how to enter, duas for the mosque, things to avoid, and Sunnah acts.", category: "Prayer", datePublished: "2026-04-12", internalLinks: [{ href: "/masjid-finder", label: "Find Masjid" }, { href: "/salah-guide", label: "Salah Guide" }, { href: "/duas", label: "Masjid Duas" }] },
  { slug: "quran-reading-plan", title: "Quran Reading Plan — Finish in 30 Days (Ramadan & Daily)", description: "Complete 30-day Quran reading schedule to finish the entire Quran in one month. Includes daily juz breakdown.", category: "Quran", datePublished: "2026-04-14", internalLinks: [{ href: "/quran", label: "Quran Reader" }, { href: "/ramadan", label: "Ramadan Guide" }, { href: "/sessions", label: "Quran Sessions" }] },
  { slug: "dua-for-sick-person", title: "Dua for Sick Person — Islamic Healing Prayers", description: "Authentic duas for sick people and those visiting the sick — from Bukhari, Muslim, and the Quran.", category: "Duas", datePublished: "2026-04-16", internalLinks: [{ href: "/duas/protection-from-evil", label: "Protection Duas" }, { href: "/99-names", label: "99 Names of Allah" }, { href: "/sessions", label: "Healing Sessions" }] },
  { slug: "islamic-baby-shower", title: "Islamic Baby Shower — Aqiqah, Naming & Customs", description: "Islamic customs for welcoming a new baby — Adhan in the ear, tahnik, Aqiqah, naming ceremony.", category: "Family", datePublished: "2026-04-18", internalLinks: [{ href: "/names", label: "Islamic Baby Names" }, { href: "/duas/dua-for-righteous-spouse", label: "Family Duas" }, { href: "/farz-guide", label: "Farz Guide" }] },
  { slug: "prayer-times-ramadan-2026", title: "Prayer Times in Ramadan 2026 — Sehri & Iftar Schedule", description: "Complete Fajr, Sehri, Iftar, and Tarawih times for Ramadan 2026 in major Indian and Pakistani cities.", category: "Ramadan", datePublished: "2026-05-01", internalLinks: [{ href: "/ramadan", label: "Ramadan 2026 Guide" }, { href: "/prayer-times/delhi", label: "Delhi Prayer Times" }, { href: "/prayer-times/karachi", label: "Karachi Prayer Times" }] },
  { slug: "noor-app-guide", title: "MyTazki — Complete Guide to All Features", description: "Complete guide to all features of MyTazki Islamic Prayer App — prayer times, Quran, AI guide, names, and more.", category: "App", datePublished: "2026-01-01", internalLinks: [{ href: "/download", label: "Download MyTazki" }, { href: "/best-muslim-prayer-app-india", label: "Compare Apps" }, { href: "/prayer-times", label: "Prayer Times" }] },
  { slug: "surah-ikhlas-falaq-nas", title: "Three Quls — Surah Ikhlas, Falaq & Nas Benefits", description: "The three Quls (Surah Ikhlas, Surah Falaq, Surah Nas) — benefits, when to recite, and morning/evening routine.", category: "Quran", datePublished: "2026-03-20", internalLinks: [{ href: "/quran/surah-ikhlas", label: "Surah Ikhlas" }, { href: "/quran/surah-falaq", label: "Surah Falaq" }, { href: "/quran/surah-nas", label: "Surah Nas" }] },
  { slug: "halal-food-guide-india", title: "Halal Food Guide India 2026 — What is Halal & Haram", description: "Complete guide to halal and haram food in India — how to identify halal meat, restaurant tips, and E-codes.", category: "Fiqh", datePublished: "2026-03-22", internalLinks: [{ href: "/farz-guide", label: "Halal/Haram Guide" }, { href: "/duas/before-eating", label: "Dua Before Eating" }, { href: "/duas/after-eating", label: "Dua After Eating" }] },
];

router.get("/blog", async (_req: Request, res: Response) => {
  const categories = [...new Set(BLOG_STUBS.map(p => p.category))].sort();

  const head = seoHead({
    title: "Islamic Blog — Prayer, Quran, Duas, Names & More",
    description: "Islamic articles about prayer times, Quran, duas, Muslim names, Ramadan, Zakat, and spiritual growth. Learn and grow with MyTazki.",
    canonical: "/blog",
    schema: breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Islamic Blog" }]),
  });

  const body = `
<h1>Islamic Blog — Learn, Grow, Remember Allah</h1>
<p style="color:#4a7a4a">Articles about prayer, Quran, duas, Islamic names, Ramadan, Zakat, and spiritual growth.</p>

<div style="display:flex;flex-wrap:wrap;gap:8px;margin:20px 0">
  <a href="/blog" style="background:#00a550;color:#001a00;padding:6px 14px;border-radius:20px;text-decoration:none;font-size:13px;font-weight:bold">All</a>
  ${categories.map(cat => `<a href="/blog?category=${encodeURIComponent(cat)}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:6px 14px;border-radius:20px;text-decoration:none;font-size:13px">${esc(cat)}</a>`).join("")}
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin:24px 0">
  ${BLOG_STUBS.map(p => `
    <a href="/blog/${p.slug}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:18px;text-decoration:none;display:block">
      <p style="color:#4a7a4a;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px">${esc(p.category)}</p>
      <h2 style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 8px;line-height:1.4">${esc(p.title)}</h2>
      <p style="color:#4a7a4a;font-size:13px;margin:0 0 8px;line-height:1.5">${esc(p.description.substring(0, 80))}...</p>
      <p style="color:#2a4a2a;font-size:11px;margin:0">${esc(p.datePublished)}</p>
    </a>
  `).join("")}
</div>

${ctaBlock()}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

router.get("/blog/:slug", async (req: Request, res: Response) => {
  const slug = String(req.params["slug"] ?? "");
  const stub = BLOG_STUBS.find(p => p.slug === slug);

  if (!stub) {
    res.redirect(302, "/blog");
    return;
  }

  const dbPost = await getBlogPost(slug);
  const content_html = dbPost?.content_html || `<p style="color:#4a7a4a;padding:20px;background:#002800;border-radius:8px">Full article content is being generated by our AI. Check back soon or <a href="/download" style="color:#00a550">download MyTazki</a> for more Islamic content.</p>`;

  const related = BLOG_STUBS.filter(p => p.category === stub.category && p.slug !== slug).slice(0, 3);

  const wordCount = dbPost?.content_html ? Math.round(dbPost.content_html.replace(/<[^>]*>/g, "").split(/\s+/).length) : 800;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": stub.title,
    "description": stub.description,
    "datePublished": stub.datePublished,
    "wordCount": wordCount,
    "author": { "@type": "Organization", "name": "MyTazki" },
    "publisher": { "@type": "Organization", "name": "MyTazki" },
    "url": `https://mytazki.com/blog/${slug}`,
  };

  const head = seoHead({
    title: stub.title,
    description: stub.description,
    canonical: `/blog/${slug}`,
    schema: [
      blogSchema,
      breadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Blog", item: "/blog" },
        { name: stub.category },
        { name: stub.title },
      ]),
    ],
  });

  const body = `
${breadcrumb([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: stub.category },
    { name: stub.title },
  ])}

<p style="color:#4a7a4a;font-size:13px;margin-bottom:24px">${esc(stub.datePublished)} · ${esc(stub.category)}</p>
<h1>${esc(stub.title)}</h1>
<p style="color:#4a7a4a;font-size:1rem;line-height:1.6;margin-bottom:24px">${esc(stub.description)}</p>

${ctaBlock()}

<article style="line-height:1.8;color:#a0c8a0;margin:24px 0">
${content_html}
</article>

${stub.internalLinks.length > 0 ? `
<div class="card" style="margin:24px 0">
  <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 10px">Continue learning:</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px">
    ${stub.internalLinks.map(link => `<a href="${link.href}" style="background:#003800;border:1px solid rgba(0,165,80,0.25);color:#00a550;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:14px">${esc(link.label)} →</a>`).join("")}
  </div>
</div>` : ""}

${related.length > 0 ? `
<h2>Related Articles</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:16px 0">
  ${related.map(p => `<a href="/blog/${p.slug}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:14px;text-decoration:none;display:block">
    <p style="color:#4a7a4a;font-size:11px;margin:0 0 4px;text-transform:uppercase">${esc(p.category)}</p>
    <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.85rem;margin:0;line-height:1.4">${esc(p.title)}</p>
  </a>`).join("")}
</div>` : ""}

${ctaBlock()}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

export default router;
