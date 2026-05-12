import { Router, type Request, type Response } from "express";
import {
  seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc,
} from "./shared.js";

const router = Router();

interface Surah {
  number: number;
  name: string;
  arabicName: string;
  slug: string;
  meaning: string;
  verses: number;
  place: "Makkah" | "Madinah";
  benefits: string;
  firstAyah: string;
  firstAyahTranslation: string;
}

const SURAHS: Surah[] = [
  { number: 1, name: "Al-Fatiha", arabicName: "الْفَاتِحَة", slug: "surah-fatiha", meaning: "The Opening", verses: 7, place: "Makkah", benefits: "Known as Umm al-Kitab (Mother of the Book). Recited in every prayer. Contains the essence of the entire Quran.", firstAyah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", firstAyahTranslation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  { number: 2, name: "Al-Baqarah", arabicName: "الْبَقَرَة", slug: "surah-baqarah", meaning: "The Cow", verses: 286, place: "Madinah", benefits: "The longest surah. Contains Ayatul Kursi (2:255) and the last two verses (Amanas Rasool). Protects home from Shaytan.", firstAyah: "الم", firstAyahTranslation: "Alif, Lam, Meem." },
  { number: 3, name: "Al-Imran", arabicName: "آلِ عِمْرَان", slug: "surah-al-imran", meaning: "Family of Imran", verses: 200, place: "Madinah", benefits: "Discusses the family of Imran, Jesus, and Mary. Contains verses about faith during hardship.", firstAyah: "الم", firstAyahTranslation: "Alif, Lam, Meem." },
  { number: 4, name: "An-Nisa", arabicName: "النِّسَاء", slug: "surah-nisa", meaning: "The Women", verses: 176, place: "Madinah", benefits: "Covers women's rights, marriage, inheritance, and family law in Islam.", firstAyah: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ", firstAyahTranslation: "O mankind, fear your Lord." },
  { number: 5, name: "Al-Maidah", arabicName: "الْمَائِدَة", slug: "surah-maidah", meaning: "The Table Spread", verses: 120, place: "Madinah", benefits: "Covers dietary laws, contracts, and the final completion of religion.", firstAyah: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ", firstAyahTranslation: "O you who have believed, fulfill all contracts." },
  { number: 6, name: "Al-Anam", arabicName: "الْأَنْعَام", slug: "surah-anam", meaning: "The Cattle", verses: 165, place: "Makkah", benefits: "Addresses monotheism and refutes polytheism. Revealed entirely at once.", firstAyah: "الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ", firstAyahTranslation: "Praise be to Allah, who created the heavens and earth." },
  { number: 7, name: "Al-Araf", arabicName: "الْأَعْرَاف", slug: "surah-araf", meaning: "The Heights", verses: 206, place: "Makkah", benefits: "Covers stories of Prophets and the concept of Al-Araf (the heights between Paradise and Hell).", firstAyah: "المص", firstAyahTranslation: "Alif, Lam, Meem, Sad." },
  { number: 18, name: "Al-Kahf", arabicName: "الْكَهْف", slug: "surah-kahf", meaning: "The Cave", verses: 110, place: "Makkah", benefits: "Recited on Fridays for protection from Dajjal. Contains stories of Companions of the Cave, Khidr, and Dhul-Qarnayn.", firstAyah: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ", firstAyahTranslation: "All praise is for Allah Who has revealed the Book to His servant." },
  { number: 36, name: "Ya-Sin", arabicName: "يس", slug: "surah-yasin", meaning: "Ya Sin", verses: 83, place: "Makkah", benefits: "Called the 'Heart of the Quran'. Recited for the dying and in times of need. Contains powerful verses on resurrection.", firstAyah: "يس", firstAyahTranslation: "Ya, Seen." },
  { number: 55, name: "Ar-Rahman", arabicName: "الرَّحْمَٰن", slug: "surah-rahman", meaning: "The Beneficent", verses: 78, place: "Madinah", benefits: "The 'Bride of the Quran'. Contains the refrain 'Which of your Lord's favours will you deny?' 31 times.", firstAyah: "الرَّحْمَٰنُ", firstAyahTranslation: "The Most Merciful." },
  { number: 56, name: "Al-Waqiah", arabicName: "الْوَاقِعَة", slug: "surah-waqiah", meaning: "The Event", verses: 96, place: "Makkah", benefits: "Protects from poverty. The Prophet said whoever recites it every night will never be afflicted by poverty.", firstAyah: "إِذَا وَقَعَتِ الْوَاقِعَةُ", firstAyahTranslation: "When the Occurrence occurs." },
  { number: 67, name: "Al-Mulk", arabicName: "الْمُلْك", slug: "surah-mulk", meaning: "The Sovereignty", verses: 30, place: "Makkah", benefits: "Recited every night before sleep. Intercedes for its reciter on Day of Judgment. Protects from the punishment of the grave.", firstAyah: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ", firstAyahTranslation: "Blessed is He in whose hand is dominion." },
  { number: 112, name: "Al-Ikhlas", arabicName: "الْإِخْلَاص", slug: "surah-ikhlas", meaning: "Sincerity", verses: 4, place: "Makkah", benefits: "Worth one third of the Quran when recited. Affirms pure monotheism. Brief but comprehensive declaration of Allah's oneness.", firstAyah: "قُلْ هُوَ اللَّهُ أَحَدٌ", firstAyahTranslation: "Say: He is Allah, the One." },
  { number: 113, name: "Al-Falaq", arabicName: "الْفَلَق", slug: "surah-falaq", meaning: "The Dawn", verses: 5, place: "Makkah", benefits: "One of the Muawwidhatayn (two protective surahs). Recited 3 times morning and evening for protection from evil.", firstAyah: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", firstAyahTranslation: "Say: I seek refuge in the Lord of daybreak." },
  { number: 114, name: "An-Nas", arabicName: "النَّاس", slug: "surah-nas", meaning: "Mankind", verses: 6, place: "Makkah", benefits: "One of the Muawwidhatayn. Protects from evil whispers of Shaytan. Recited 3 times morning and evening.", firstAyah: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", firstAyahTranslation: "Say: I seek refuge in the Lord of mankind." },
  { number: 2, name: "Ayatul Kursi", arabicName: "آيَة الْكُرْسِيّ", slug: "ayatul-kursi", meaning: "The Throne Verse (2:255)", verses: 1, place: "Madinah", benefits: "The greatest verse in the Quran. Recited after every prayer and before sleep for protection. Whoever recites it after obligatory prayer will be under Allah's protection until next prayer.", firstAyah: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", firstAyahTranslation: "Allah, there is no deity except Him, the Ever-Living, the Sustainer of existence." },
];

function allSurahLinks(): string {
  const all = Array.from({ length: 114 }, (_, i) => ({
    number: i + 1,
    slug: `surah-${i + 1}`,
    name: SURAHS.find(s => s.number === i + 1 && s.slug !== "ayatul-kursi")?.name || `Surah ${i + 1}`,
  }));
  return all.map(s => `<a href="/quran/${SURAHS.find(x => x.number === s.number && x.slug !== "ayatul-kursi")?.slug || s.slug}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:6px 12px;border-radius:6px;text-decoration:none;font-size:13px">${s.number}. ${esc(s.name)}</a>`).join(" ");
}

router.get("/quran", (_req: Request, res: Response) => {
  const head = seoHead({
    title: "Quran, All 114 Surahs with Arabic & English Translation",
    description: "Read the Holy Quran online with Arabic text, English translation, and audio recitation. All 114 surahs with meaning, benefits, and Tafsir.",
    canonical: "/quran",
    schema: faqSchema([
      { q: "How many surahs are in the Quran?", a: "The Quran has 114 surahs (chapters), ranging from the shortest Surah Al-Kawthar (3 verses) to the longest Surah Al-Baqarah (286 verses)." },
      { q: "Which surah should I read every Friday?", a: "Surah Al-Kahf (chapter 18) is recommended to be read every Friday. It provides protection from Dajjal." },
      { q: "Which surah is the heart of the Quran?", a: "Surah Ya-Sin (chapter 36) is called the heart of the Quran by the Prophet Muhammad ﷺ." },
    ]),
  });

  const body = `
<h1>The Holy Quran, Arabic Text &amp; English Translation</h1>
<p style="color:#4a7a4a">Read the Quran online with Arabic text, transliteration, English meaning, and Alafasy audio recitation.</p>

${ctaBlock()}

<h2>Featured Surahs</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin:16px 0">
  ${SURAHS.filter(s => s.slug !== "ayatul-kursi").map(s => `
    <a href="/quran/${s.slug}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:10px;padding:16px;text-decoration:none;display:block">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem">${esc(s.name)}</span>
        <span class="arabic" style="font-size:1.1rem">${s.arabicName}</span>
      </div>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${s.verses} verses · ${s.place} · ${esc(s.meaning)}</p>
    </a>
  `).join("")}
</div>

<h2>All 114 Surahs</h2>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin:16px 0">
  ${Array.from({ length: 114 }, (_, i) => {
    const s = SURAHS.find(x => x.number === i + 1 && x.slug !== "ayatul-kursi");
    const slug = s?.slug || `surah-${i + 1}`;
    const name = s?.name || `Surah ${i + 1}`;
    return `<a href="/quran/${slug}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:5px 10px;border-radius:6px;text-decoration:none;font-size:12px">${i + 1}. ${esc(name)}</a>`;
  }).join("")}
</div>

<div style="margin-top:24px">
  <h2>Special Verses</h2>
  <a href="/quran/ayatul-kursi" style="background:#002800;border:2px solid rgba(255,215,0,0.3);border-radius:10px;padding:16px;text-decoration:none;display:block;max-width:400px">
    <p style="color:#ffd700;font-family:Cinzel,serif;margin:0 0 4px">Ayatul Kursi, The Throne Verse</p>
    <p style="color:#4a7a4a;font-size:13px;margin:0">The greatest verse in the Quran · Quran 2:255</p>
  </a>
</div>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(page(head, body));
});

router.get("/quran/:surahSlug", async (req: Request, res: Response) => {
  const slug = String(req.params["surahSlug"] ?? "");

  let surah = SURAHS.find(s => s.slug === slug);

  if (!surah) {
    const num = parseInt(slug.replace("surah-", ""), 10);
    if (!isNaN(num) && num >= 1 && num <= 114) {
      surah = {
        number: num,
        name: `Surah ${num}`,
        arabicName: "",
        slug: `surah-${num}`,
        meaning: `Chapter ${num}`,
        verses: 0,
        place: "Makkah",
        benefits: `Surah ${num} of the Holy Quran. Open the MyTazki to read the full surah with Arabic text and audio.`,
        firstAyah: "",
        firstAyahTranslation: "",
      };
    } else {
      res.redirect(302, "/quran");
      return;
    }
  }

  const faqs = [
    { q: `When should I read Surah ${surah.name}?`, a: surah.benefits },
    { q: `How many verses are in Surah ${surah.name}?`, a: surah.verses > 0 ? `Surah ${surah.name} has ${surah.verses} verses and was revealed in ${surah.place}.` : `Open the MyTazki for complete details about Surah ${surah.name}.` },
    { q: `What does Surah ${surah.name} mean?`, a: surah.meaning ? `"${surah.name}" means "${surah.meaning}" in Arabic.` : `Open the MyTazki for the meaning and translation of Surah ${surah.name}.` },
    { q: `What are the benefits of Surah ${surah.name}?`, a: surah.benefits },
  ];

  const relatedSurahs = SURAHS.filter(s => s.slug !== surah!.slug && s.slug !== "ayatul-kursi").slice(0, 4);

  const head = seoHead({
    title: `Surah ${surah.name}, Meaning, Translation & Benefits`,
    description: `Surah ${surah.name} (${surah.arabicName || surah.name}), ${surah.meaning}. ${surah.benefits.substring(0, 100)}`,
    canonical: `/quran/${slug}`,
    schema: [
      { "@context": "https://schema.org", "@type": "Article", "headline": `Surah ${surah.name}, Meaning, Translation and Benefits`, "description": surah.benefits, "author": { "@type": "Organization", "name": "MyTazki" } },
      faqSchema(faqs),
      breadcrumbSchema([{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: `Surah ${surah.name}` }]),
    ],
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: `Surah ${surah.name}` }])}

<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
  <h1 style="margin:0">Surah ${esc(surah.name)}, Meaning, Translation &amp; Benefits</h1>
  ${surah.arabicName ? `<p class="arabic" style="font-size:2rem;margin:0">${surah.arabicName}</p>` : ""}
</div>

<div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0">
  ${surah.verses > 0 ? `<span style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:4px 12px;border-radius:20px;font-size:13px">${surah.verses} verses</span>` : ""}
  <span style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#4a7a4a;padding:4px 12px;border-radius:20px;font-size:13px">${surah.place}</span>
  ${surah.meaning ? `<span style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#4a7a4a;padding:4px 12px;border-radius:20px;font-size:13px">Meaning: ${esc(surah.meaning)}</span>` : ""}
  <span style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#4a7a4a;padding:4px 12px;border-radius:20px;font-size:13px">Surah ${surah.number}</span>
</div>

${surah.firstAyah ? `
<div class="card" style="margin:24px 0;text-align:center;padding:28px">
  <p style="color:#ffd700;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px">First Verse</p>
  <p class="arabic" style="font-size:1.8rem;line-height:2.2;margin:0 0 12px">${surah.firstAyah}</p>
  <p style="color:#a0c8a0;margin:0;font-style:italic">"${esc(surah.firstAyahTranslation)}"</p>
</div>` : ""}

<h2>Benefits &amp; Virtues</h2>
<div class="card">
  <p style="color:#a0c8a0;line-height:1.8;margin:0">${esc(surah.benefits)}</p>
</div>

${ctaBlock()}

${relatedSurahs.length > 0 ? `
<h2>Related Surahs</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:16px 0">
  ${relatedSurahs.map(s => `<a href="/quran/${s.slug}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:8px;padding:12px;text-decoration:none;display:block">
    <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.85rem;margin:0 0 2px">${esc(s.name)}</p>
    <p class="arabic" style="font-size:0.9rem;margin:0 0 2px">${s.arabicName}</p>
    <p style="color:#4a7a4a;font-size:11px;margin:0">${s.verses} verses</p>
  </a>`).join("")}
</div>` : ""}

${faqHtml(faqs)}

<p style="color:#4a7a4a">Read with audio: <a href="/download" style="color:#00a550">Download MyTazki</a> for audio recitation by Sheikh Alafasy · <a href="/duas" style="color:#00a550">Related Duas</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(page(head, body));
});

export { SURAHS };
export default router;
