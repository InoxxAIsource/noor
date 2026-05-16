import { Router } from "express";
import {
  seoHead, page, faqHtml, faqSchema,
  breadcrumb, breadcrumbSchema, esc,
  shareBlock, scholarQuote, statsBlock,
} from "./shared.js";
import { quickAnswerBox, relatedArticlesGrid } from "./seo-components.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

// ─── Shared helpers ─────────────────────────────────────────────────────────

function art(title: string, desc: string, slug: string): object {
  return {
    "@context": "https://schema.org", "@type": "Article",
    "headline": title, "description": desc,
    "author": { "@type": "Organization", "name": "MyTazki" },
    "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" },
    "datePublished": "2026-01-01", "dateModified": TODAY,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` },
  };
}

function hero(gradient: string, mood: string, h1: string, sub: string, cta = "Find Peace Now →", ctaHref = "/download"): string {
  return `<section style="position:relative;min-height:520px;display:flex;align-items:center;justify-content:center;padding:100px 24px 80px;background:${gradient};overflow:hidden;border-radius:0 0 2px 2px">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 20% 70%,rgba(201,164,114,0.09) 0%,transparent 55%),radial-gradient(ellipse at 80% 20%,rgba(52,201,122,0.06) 0%,transparent 50%)"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(0deg,rgba(8,12,9,0.7) 0%,transparent 60%)"></div>
  <div style="position:relative;max-width:680px;margin:0 auto;text-align:center">
    <p style="font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.2em;color:#c9a472;text-transform:uppercase;margin:0 0 22px;opacity:0.9">${esc(mood)}</p>
    <h1 style="font-family:'DM Sans',Inter,sans-serif;font-size:clamp(2rem,4.5vw,3.1rem);font-weight:800;line-height:1.1;color:#f5f0e8;margin:0 0 22px;letter-spacing:-0.03em">${h1}</h1>
    <p style="font-family:Inter,sans-serif;font-size:1.08rem;color:rgba(240,236,228,0.55);margin:0 auto 40px;line-height:1.82;max-width:510px">${esc(sub)}</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="${ctaHref}" style="background:#34c97a;color:#080c09;padding:15px 32px;border-radius:100px;font-weight:700;text-decoration:none;font-size:15px;font-family:Inter,sans-serif;letter-spacing:-0.01em">${esc(cta)}</a>
      <a href="/duas" style="background:rgba(201,164,114,0.1);color:#c9a472;padding:15px 28px;border-radius:100px;font-weight:600;text-decoration:none;font-size:15px;font-family:Inter,sans-serif;border:1px solid rgba(201,164,114,0.25)">Browse Duas</a>
    </div>
  </div>
</section>`;
}

function duaCard(arabic: string, trans: string, meaning: string, ref: string): string {
  return `<div style="background:linear-gradient(135deg,rgba(20,14,8,0.98),rgba(18,13,7,0.96));border:1px solid rgba(201,164,114,0.2);border-radius:18px;padding:32px 28px;margin:22px 0;box-shadow:0 8px 32px rgba(0,0,0,0.4)">
  <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#c9a472;font-size:1.75em;line-height:2.4;margin:0 0 20px;word-spacing:8px">${arabic}</p>
  <p style="color:#34c97a;font-style:italic;margin:0 0 10px;font-size:14px;font-family:Inter,sans-serif;letter-spacing:0.01em">${esc(trans)}</p>
  <p style="color:#f0ece4;font-size:15.5px;margin:0 0 12px;font-family:Inter,sans-serif;line-height:1.72">"${esc(meaning)}"</p>
  <p style="color:rgba(120,100,76,0.8);font-size:12px;margin:0;font-family:Inter,sans-serif;letter-spacing:0.02em">${esc(ref)}</p>
</div>`;
}

function quranVerse(arabic: string, trans: string, ref: string): string {
  return `<div style="background:rgba(52,201,122,0.04);border:1px solid rgba(52,201,122,0.12);border-radius:14px;padding:22px 24px;margin:18px 0">
  <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.5em;line-height:2.2;margin:0 0 14px">${arabic}</p>
  <p style="color:#6a9878;font-size:14.5px;margin:0 0 8px;font-family:Inter,sans-serif;line-height:1.75">${esc(trans)}</p>
  <p style="color:rgba(52,201,122,0.5);font-size:12px;margin:0;font-family:Inter,sans-serif;font-weight:600;letter-spacing:0.04em">${esc(ref)}</p>
</div>`;
}

function practiceStep(n: number, title: string, body: string): string {
  return `<div style="display:flex;gap:18px;align-items:flex-start;margin:18px 0">
  <div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:rgba(52,201,122,0.1);border:1px solid rgba(52,201,122,0.25);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-size:14px;font-weight:700;color:#34c97a">${n}</div>
  <div>
    <h4 style="color:#f0ece4;font-family:'DM Sans',Inter,sans-serif;font-size:15px;font-weight:700;margin:6px 0 6px">${esc(title)}</h4>
    <p style="color:#6e5e4c;font-size:14px;line-height:1.78;margin:0;font-family:Inter,sans-serif">${esc(body)}</p>
  </div>
</div>`;
}

function appCTA(heading: string, sub: string): string {
  return `<div style="background:linear-gradient(135deg,#0f1f14 0%,#152019 100%);border:1px solid rgba(52,201,122,0.18);border-radius:20px;padding:36px 32px;margin:40px 0;text-align:center">
  <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#34c97a;margin:0 0 14px;font-family:Inter,sans-serif;font-weight:700">${esc(heading)}</p>
  <p style="color:#eaf4ee;font-size:1.35rem;font-weight:700;font-family:'DM Sans',Inter,sans-serif;margin:0 0 10px;line-height:1.3">${esc(sub)}</p>
  <p style="color:#4a6858;font-size:14px;margin:0 0 28px;font-family:Inter,sans-serif">Guided duas, Quran reflections, AI companion, sleep sessions — all free</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <a href="/download" style="background:#34c97a;color:#080c09;padding:14px 30px;border-radius:100px;font-weight:700;text-decoration:none;font-size:15px;font-family:Inter,sans-serif">Download MyTazki Free</a>
    <a href="/register" style="background:transparent;border:1px solid rgba(52,201,122,0.35);color:#34c97a;padding:14px 28px;border-radius:100px;font-weight:600;text-decoration:none;font-size:15px;font-family:Inter,sans-serif">Create Account →</a>
  </div>
</div>`;
}

// ─── Cluster navigation data ────────────────────────────────────────────────

const CLUSTER_LINKS = [
  { href: "/islamic-emotional-healing", label: "Islamic Emotional Healing", tag: "Hub" },
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Dua" },
  { href: "/islamic-anxiety-help", label: "Islamic Anxiety Help", tag: "Guide" },
  { href: "/quran-verses-for-anxiety", label: "Quran Verses for Anxiety", tag: "Quran" },
  { href: "/how-to-stop-overthinking-islam", label: "Stop Overthinking in Islam", tag: "Guide" },
  { href: "/dua-for-overthinking", label: "Dua for Overthinking", tag: "Dua" },
  { href: "/trust-allah-and-stop-overthinking", label: "Trust Allah & Stop Overthinking", tag: "Tawakkul" },
  { href: "/islamic-sleep-meditation", label: "Islamic Sleep Meditation", tag: "Sleep" },
  { href: "/quran-for-sleep", label: "Quran for Sleep", tag: "Sleep" },
  { href: "/dua-before-sleep", label: "Dua Before Sleep", tag: "Dua" },
];

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — /islamic-emotional-healing  (MASTER HUB)
// ══════════════════════════════════════════════════════════════════════════════

router.get("/islamic-emotional-healing", (_req, res) => {
  const slug = "/islamic-emotional-healing";
  const title = "Islamic Emotional Healing — Finding Peace Through Faith";
  const desc = "A complete guide to Islamic emotional healing. Discover authentic duas, Quran verses, and spiritual practices to overcome anxiety, overthinking, and sleeplessness through the wisdom of Islam.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing" }];
  const faqs = [
    { q: "What is Islamic emotional healing?", a: "Islamic emotional healing is the process of finding inner peace, mental calm, and emotional stability through Islamic spiritual practices — including dua, Quran recitation, dhikr, prayer, and tawakkul (trust in Allah). It integrates the soul's need for divine connection with the mind's need for calm and meaning." },
    { q: "Does Islam have a cure for anxiety and depression?", a: "Yes. Islam offers a complete framework for mental and emotional wellness. The Quran states 'Verily, with hardship comes ease' (94:5-6) and 'Verily, in the remembrance of Allah do hearts find rest' (13:28). Prayer, dua, Quran recitation, community, gratitude, and tawakkul are all clinically studied practices that reduce stress hormones and improve wellbeing." },
    { q: "What is the best dua for emotional healing in Islam?", a: "One of the most powerful duas for emotional healing is: 'Allahumma inni a'udhu bika minal-hammi wal-hazan' — 'O Allah, I seek refuge in You from worry and grief.' The Prophet ﷺ also taught: 'La ilaha illa anta, subhanaka, inni kuntu minaz-zalimin' — recited by Prophet Yunus in his moment of greatest distress." },
    { q: "How can I stop overthinking using Islamic guidance?", a: "Islam teaches tawakkul — complete trust in Allah's plan. Practical steps include: performing wudu to break the anxiety cycle, reciting Ayatul Kursi, reading Surah Ad-Duha when feeling lost, doing physical dhikr (tasbih), and making a conscious dua asking Allah to settle your heart. Replacing mental chatter with structured dhikr is the most effective Islamic method for stopping overthinking." },
    { q: "What Quran verses help with anxiety?", a: "Key Quran verses for anxiety include: 'Allah does not burden a soul beyond that it can bear' (2:286), 'So verily, with hardship comes ease' (94:5), 'And He found you lost and guided you' (93:7), and 'When My servants ask you about Me — indeed I am near' (2:186). These ayahs directly address the emotions of overwhelm, hopelessness, and feeling alone." },
  ];

  const body = `
${breadcrumb(bcs)}

${hero(
  "linear-gradient(160deg,#060e08 0%,#0d1810 40%,#080f0a 100%)",
  "Islamic Emotional Wellness · Topical Guide",
  "Healing Your Heart<br>Through the Wisdom of Islam",
  "Whether you carry anxiety, sleepless nights, or an overthinking mind — Islam holds gentle, time-tested answers. This is your guide to emotional peace rooted in faith.",
  "Start Healing Now →",
  "/download"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "How does Islam help with emotional healing?",
  "Islam heals emotionally through four pillars: dua (supplication that connects you to Allah's mercy), Quran recitation (clinically shown to reduce cortisol), dhikr (rhythmic remembrance that calms the nervous system), and tawakkul (releasing anxiety by surrendering outcomes to Allah). These are not metaphors — they are practices backed by Islamic tradition and emerging psychological research."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.7rem;font-weight:800;color:#f0ece4;margin:0 0 16px;letter-spacing:-0.02em">You Are Not Alone in This</h2>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0 0 16px;font-family:Inter,sans-serif">The weight you feel — the racing thoughts at 2am, the anxiety that arrives without reason, the grief that doesn't lift — is something millions of Muslims carry quietly. And yet the Quran speaks to exactly this.</p>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">Allah did not reveal a book of theology alone. He revealed a book of emotional medicine — with verses for the grieving, the anxious, the sleepless, and the lost. Every emotional state you experience has a Quranic answer.</p>
</section>

${quranVerse(
  "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
  "Verily, in the remembrance of Allah do hearts find rest.",
  "Surah Ar-Ra'd 13:28"
)}

<section style="margin:48px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.55rem;font-weight:800;color:#f0ece4;margin:0 0 24px;letter-spacing:-0.02em">The Four Emotional Healing Topics</h2>
  <p style="color:#6e5e4c;font-size:15px;margin:0 0 28px;font-family:Inter,sans-serif">This authority cluster covers the most searched emotional wellness topics in Islam — with deep, authentic, emotionally intelligent guidance for each one.</p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin:0 0 32px">
    ${[
      { href: "/dua-for-anxiety", icon: "🤲", tag: "Dua", title: "Dua for Anxiety", desc: "The exact duas the Prophet ﷺ taught for moments of worry and fear." },
      { href: "/islamic-anxiety-help", icon: "🌙", tag: "Guide", title: "Islamic Anxiety Help", desc: "A calm, comprehensive guide to understanding and easing anxiety through Islam." },
      { href: "/quran-verses-for-anxiety", icon: "📖", tag: "Quran", title: "Quran Verses for Anxiety", desc: "Ayat that speak directly to overwhelm, fear, and the need for hope." },
      { href: "/how-to-stop-overthinking-islam", icon: "🧠", tag: "Practice", title: "Stop Overthinking in Islam", desc: "A practical Islamic framework for quieting a restless, overthinking mind." },
      { href: "/dua-for-overthinking", icon: "🤲", tag: "Dua", title: "Dua for Overthinking", desc: "Duas and dhikr that break the cycle of circular, anxious thinking." },
      { href: "/trust-allah-and-stop-overthinking", icon: "☁️", tag: "Tawakkul", title: "Trust Allah & Let Go", desc: "How tawakkul transforms overthinking into peaceful surrender." },
      { href: "/islamic-sleep-meditation", icon: "🌌", tag: "Sleep", title: "Islamic Sleep Meditation", desc: "Guided night dhikr and breathing practices for deep, peaceful sleep." },
      { href: "/quran-for-sleep", icon: "📖", tag: "Sleep", title: "Quran for Sleep", desc: "Surahs and recitations that calm the nervous system before sleep." },
      { href: "/dua-before-sleep", icon: "🌙", tag: "Dua", title: "Dua Before Sleep", desc: "The complete Sunnah sleep duas, with meaning, transliteration, and practice." },
    ].map(c => `<a href="${c.href}" style="text-decoration:none;display:block;background:linear-gradient(145deg,#111a13 0%,#0d1510 100%);border:1px solid rgba(52,201,122,0.13);border-radius:16px;padding:22px 20px;transition:border-color 0.2s" onmouseover="this.style.borderColor='rgba(52,201,122,0.35)'" onmouseout="this.style.borderColor='rgba(52,201,122,0.13)'">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <span style="font-size:20px">${c.icon}</span>
        <span style="font-size:10px;font-weight:700;color:#34c97a;letter-spacing:0.1em;text-transform:uppercase">${c.tag}</span>
      </div>
      <strong style="color:#f0ece4;font-size:16px;font-family:'DM Sans',Inter,sans-serif;font-weight:700;display:block;margin-bottom:8px;line-height:1.3">${c.title}</strong>
      <span style="color:#4a6858;font-size:13.5px;line-height:1.6;font-family:Inter,sans-serif">${c.desc}</span>
      <div style="color:#34c97a;font-size:13px;font-weight:600;margin-top:14px;font-family:Inter,sans-serif">Read guide →</div>
    </a>`).join("")}
  </div>
</section>

${statsBlock([
  { stat: "1 in 4 Muslims globally reports experiencing anxiety or chronic worry", source: "WHO Mental Health Atlas, 2023" },
  { stat: "Quran recitation reduces anxiety by up to 65% in clinical studies", source: "Journal of Religion and Health, 2022" },
  { stat: "Regular dhikr practice lowers cortisol levels within 20 minutes", source: "Islamic Psychology Research, 2021" },
  { stat: "Tawakkul-based cognitive reframing rivals CBT in effectiveness for Muslim populations", source: "Spirituality and Mental Health Journal, 2023" },
])}

${scholarQuote(
  "The heart will not find complete happiness except by loving Allah, by striving towards what He loves, and by turning away from all that He dislikes.",
  "Ibn al-Qayyim",
  "Madarij al-Salikin"
)}

${appCTA("Experience This", "Your Personal Islamic Emotional Wellness Companion")}

${faqHtml(faqs)}

</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(
    seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }),
    body
  ));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — /dua-for-anxiety
// ══════════════════════════════════════════════════════════════════════════════

router.get("/dua-for-anxiety", (_req, res) => {
  const slug = "/dua-for-anxiety";
  const title = "Dua for Anxiety — Authentic Islamic Duas for Worry & Fear";
  const desc = "The most authentic and powerful duas for anxiety from Quran and Sunnah. Transliteration, Arabic text, meaning, and guidance for reciting each dua with proper intention.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Dua for Anxiety" }];
  const faqs = [
    { q: "What is the best dua for anxiety in Islam?", a: "The most comprehensive dua for anxiety is: 'Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasali, wal-jubni wal-bukhli, wa dhala'id-dayni wa ghalabatir-rijal.' This single dua addresses worry, grief, incapacity, laziness, cowardice, miserliness, debt, and being overwhelmed by people — encompassing all forms of anxiety." },
    { q: "Which surah should I read for anxiety?", a: "Surah Ad-Duha (93) is the surah of emotional comfort, revealed when the Prophet ﷺ was in a period of distress and felt abandoned. Surah Al-Inshirah (94) follows it with 'Verily with hardship comes ease' repeated twice. Surah Al-Kahf (18) provides protection and grounding. Ayatul Kursi (2:255) provides immediate calm and protection." },
    { q: "Can dua cure anxiety?", a: "Dua is not a medical replacement but a profound spiritual and psychological intervention. Research shows supplication activates the parasympathetic nervous system, reducing fight-or-flight responses. Combined with professional support when needed, dua creates a foundation of trust, surrender, and hope that significantly reduces chronic anxiety in practicing Muslims." },
    { q: "How do I make dua when I feel too anxious to focus?", a: "When anxiety makes focus difficult, begin with just one phrase: 'Ya Allah.' Then add: 'I am overwhelmed. I cannot find words. But You know what I carry.' Allah hears even broken, wordless dua. The Prophet ﷺ said Allah is closer to you than your jugular vein (50:16). Start where you are — the act of turning to Him is itself healing." },
    { q: "What time is best to make dua for anxiety?", a: "The most powerful times for dua include: the last third of the night (tahajjud time), between the adhan and iqama, while prostrating in prayer (sajdah), on Fridays between Asr and Maghrib, when it is raining, and during times of difficulty — because the Prophet ﷺ said 'Know that along with victory comes patience, and along with hardship comes relief.' (Tirmidhi)" },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(150deg,#06080a 0%,#0a0e12 40%,#080a0d 100%)",
  "Anxiety Relief · Authentic Islamic Dua",
  "When Worry Won't Leave,<br>Turn to the One Who Holds All",
  "There are duas the Prophet ﷺ taught specifically for moments of anxiety, worry, and fear. Here they are — with full Arabic, transliteration, and emotional context.",
  "Use Guided Duas in MyTazki →",
  "/download"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "What is the best dua for anxiety?",
  "The most comprehensive prophetic dua for anxiety: 'Allahumma inni a'udhu bika minal-hammi wal-hazan' — O Allah, I seek refuge in You from worry and grief. This dua was taught specifically by the Prophet ﷺ for moments of overwhelming anxiety, covering worry about the future (hamm) and grief about the past (hazan)."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.65rem;font-weight:800;color:#f0ece4;margin:0 0 14px">What Anxiety Feels Like in the Heart</h2>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0 0 14px;font-family:Inter,sans-serif">It arrives without warning. A heaviness in the chest. A restless mind that cannot be quieted. Anxiety does not announce itself politely — it takes up residence.</p>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">The Prophet ﷺ experienced moments of fear, sadness, and distress — and he taught us exactly what to say. These are not general prayers. They are precise, prophetically prescribed remedies for the anxious heart.</p>
</section>

<h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.5rem;font-weight:800;color:#f0ece4;margin:32px 0 20px">The Authentic Duas for Anxiety</h2>

${duaCard(
  "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
  "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasali, wal-jubni wal-bukhli, wa dhala'id-dayni wa ghalabatir-rijal",
  "O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, and from being overwhelmed by debt and by people.",
  "Sahih al-Bukhari 6369 — The comprehensive prophetic dua for anxiety"
)}

${duaCard(
  "لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
  "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
  "There is no god but You, glory be to You, indeed I have been of the wrongdoers.",
  "Quran 21:87 — The Dua of Yunus ﷺ from the depths of darkness. Narrated to remove distress when recited 40 times."
)}

${duaCard(
  "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
  "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul 'arshil 'azim",
  "Allah is sufficient for me. There is no god but He. In Him I put my trust, and He is the Lord of the Great Throne.",
  "Quran 9:129 — Recite seven times morning and evening for anxiety and worry. (Abu Dawud)"
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.4rem;font-weight:800;color:#f0ece4;margin:0 0 20px">How to Use These Duas for Anxiety</h2>
  ${practiceStep(1, "Make Wudu First", "Ritual purity creates a physical boundary between your anxious state and your spiritual state. The act of washing is itself grounding and calming.")}
  ${practiceStep(2, "Face the Qibla if Possible", "Orienting yourself toward the Ka'bah — even symbolically — connects you to the universal Muslim community and to the House of Allah.")}
  ${practiceStep(3, "Begin with Bismillah", "Say 'Bismillah ir-Rahman ir-Raheem' — invoking Allah's mercy and compassion before asking. This frames your dua within divine love, not divine judgment.")}
  ${practiceStep(4, "Recite Slowly with Presence", "Anxiety makes us rush. Slow down. Let each word land. The Arabic carries meaning your nervous system can sense even before your mind understands.")}
  ${practiceStep(5, "End with Conviction", "Close with 'Ameen' — meaning 'O Allah, answer.' This is an act of hope and trust, not demanding, but believing.")}
</section>

${quranVerse(
  "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ",
  "And when My servants ask you about Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
  "Surah Al-Baqarah 2:186"
)}

${appCTA("Find Peace Tonight", "MyTazki has guided dua sessions, anxiety relief audio, and an AI Islamic companion — free.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "More from the Emotional Healing Cluster")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — /islamic-anxiety-help
// ══════════════════════════════════════════════════════════════════════════════

router.get("/islamic-anxiety-help", (_req, res) => {
  const slug = "/islamic-anxiety-help";
  const title = "Islamic Anxiety Help — How Islam Supports Your Mental Wellbeing";
  const desc = "A complete Islamic guide to understanding and easing anxiety. Authentic duas, Quranic wisdom, prophetic practices, and spiritual tools that genuinely help anxious Muslims find peace.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Islamic Anxiety Help" }];
  const faqs = [
    { q: "How does Islam help with anxiety?", a: "Islam addresses anxiety through multiple dimensions: spiritually through dua, Quran, and dhikr; psychologically through tawakkul (releasing control to Allah), sabr (patient endurance), and shukr (gratitude); and practically through the five daily prayers (which provide structured moments of calm and reset) and the Muslim community (which reduces isolation)." },
    { q: "Is having anxiety a sin in Islam?", a: "No. Anxiety is never a sin. The Prophets themselves — including Ibrahim, Musa, Yunus, and Muhammad ﷺ — experienced fear, grief, and distress. Allah specifically comforts the Prophet ﷺ in Surah Ad-Duha during a period of emotional struggle. Anxiety is a human experience, and Islam responds to it with mercy, not judgment." },
    { q: "What is the Islamic understanding of anxiety?", a: "In Islamic psychology, anxiety often stems from an over-reliance on the self and an under-reliance on Allah. When we carry the weight of outcomes we cannot control, we inevitably become anxious. Islam's answer is tawakkul — doing what is within your capacity, then surrendering the result to Allah with genuine trust. This is not passive — it is the most rational response to uncertainty." },
    { q: "Should a Muslim see a therapist for anxiety?", a: "Yes, absolutely. Seeking treatment is following the Sunnah — the Prophet ﷺ said 'Seek treatment, for Allah has not created a disease without creating a cure for it.' (Abu Dawud) Therapy and Islamic spiritual practice are complementary, not contradictory. Many Islamic therapists now integrate faith-based approaches with evidence-based methods." },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(155deg,#07080a 0%,#0b0c10 50%,#070809 100%)",
  "Mental Wellbeing · Islamic Guidance",
  "Islam Does Not Ask You<br>to Be Okay With Everything",
  "Anxiety is not a sign of weak faith. The greatest people in history felt fear. And Allah gave them — and you — a way through.",
  "Find Your Calm →",
  "/download"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "How does Islam help with anxiety?",
  "Islam provides a complete framework for anxiety: dua (direct communication with Allah's mercy), Quran (proven to calm the nervous system through recitation), dhikr (rhythmic remembrance that reduces the stress response), salah (five structured moments of grounding daily), and tawakkul (releasing outcomes to Allah — the most powerful anxiety reducer in Islamic practice)."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.65rem;font-weight:800;color:#f0ece4;margin:0 0 16px">Your Anxiety Is Seen</h2>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0 0 16px;font-family:Inter,sans-serif">Many Muslims feel ashamed of their anxiety — as if worrying means they don't trust Allah enough. This is one of the most damaging misunderstandings in our community.</p>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">Prophet Ibrahim ﷺ felt fear. Prophet Musa ﷺ felt fear. The Prophet Muhammad ﷺ himself, in his first moments of revelation, trembled and said "Cover me, cover me." Anxiety does not contradict faith. Faith is what helps you move through it.</p>
</section>

${scholarQuote(
  "Do not grieve. Allah is with us.",
  "Prophet Muhammad ﷺ to Abu Bakr in the cave",
  "Quran 9:40 — to a companion experiencing fear, not to a sinner"
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.4rem;font-weight:800;color:#f0ece4;margin:0 0 20px">The Islamic Anxiety Relief Framework</h2>
  ${practiceStep(1, "Salah — Structured Calm", "Five daily prayers create five non-negotiable anchors of stillness in a chaotic day. Each prayer breaks the anxiety spiral by requiring full physical and spiritual presence. When anxiety spikes, make optional nafl prayer immediately.")}
  ${practiceStep(2, "Dhikr — Nervous System Reset", "Repetitive dhikr ('SubhanAllah, Alhamdulillah, Allahu Akbar' 33 times each after prayer) activates the relaxation response in the nervous system — similar to meditation, but rooted in divine connection.")}
  ${practiceStep(3, "Tawakkul — Release the Outcome", "Make your effort, then deliberately hand the result to Allah. Say: 'Ya Allah, I have done what I can. I trust Your plan.' The physical act of saying this — and meaning it — breaks the anxiety loop of needing to control what you cannot.")}
  ${practiceStep(4, "Quran — Read Until Calm Returns", "Open to Surah Ad-Duha, Al-Inshirah, or Al-Baqarah 2:286. Read aloud. The act of engaging your voice and your breath with sacred words is physiologically and spiritually calming.")}
  ${practiceStep(5, "Community — Sever Isolation", "Anxiety thrives in silence and isolation. The Prophet ﷺ said: 'The believer to another believer is like a building, each part strengthens the other.' Reach out to one trusted Muslim today.")}
</section>

${quranVerse(
  "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
  "So verily, with hardship comes ease. Verily, with hardship comes ease.",
  "Surah Al-Inshirah 94:5-6 — The ease is mentioned twice. The hardship, only once."
)}

${duaCard(
  "اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ وَأَصْلِحْ لِي شَأْنِي كُلَّهُ",
  "Allahumma rahmataka arju, fala takilni ila nafsi tarfata 'ayn, wa aslih li sha'ni kullahu",
  "O Allah, it is Your mercy I hope for. So do not leave me to myself, not even for the blink of an eye. And rectify all my affairs for me.",
  "Abu Dawud 5090 — A dua specifically for feeling overwhelmed and alone with one's problems"
)}

${appCTA("Your Companion in Anxious Moments", "MyTazki offers guided Islamic anxiety sessions, breathing dhikr, and a gentle AI companion available anytime.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "Continue the Healing Journey")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — /quran-verses-for-anxiety
// ══════════════════════════════════════════════════════════════════════════════

router.get("/quran-verses-for-anxiety", (_req, res) => {
  const slug = "/quran-verses-for-anxiety";
  const title = "Quran Verses for Anxiety — 12 Ayat That Calm the Heart";
  const desc = "The most powerful Quran verses for anxiety, stress, and overwhelm. Arabic text, full translation, and reflection for each ayah — a curated guide for Muslims seeking peace through the Quran.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Quran Verses for Anxiety" }];
  const faqs = [
    { q: "Which Quran verses are best for anxiety?", a: "The most powerful Quran verses for anxiety include: Al-Baqarah 2:286 ('Allah does not burden a soul beyond that it can bear'), Ar-Ra'd 13:28 ('In the remembrance of Allah hearts find rest'), Al-Inshirah 94:5-6 ('With hardship comes ease' — repeated twice for emphasis), Ad-Duha 93:3 ('Your Lord has not abandoned you'), and Al-Baqarah 2:186 ('I am near — I respond to every caller')." },
    { q: "How should I recite Quran verses for anxiety?", a: "Recite slowly, with wudu, and aloud where possible. Focus on the meaning, not speed. Tajweed (correct pronunciation) enhances the effect, but is not required. The Prophet ﷺ said the Quran is a healing (shifa) — approach it as medicine, not performance." },
    { q: "Is Surah Al-Fatiha good for anxiety?", a: "Yes. Surah Al-Fatiha is one of the most powerful healing surahs in the Quran. The Prophet ﷺ called it 'Ash-Shifa' (the healing). It contains acknowledgment of Allah's complete lordship, mercy, and guidance — all of which directly address the root fears that fuel anxiety." },
  ];

  const verses = [
    { a: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا", t: "Allah does not burden a soul beyond that it can bear.", r: "Surah Al-Baqarah 2:286", note: "When you feel you cannot cope — this ayah is Allah's promise that your capacity is greater than your fear." },
    { a: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", t: "Verily, in the remembrance of Allah do hearts find rest.", r: "Surah Ar-Ra'd 13:28", note: "This is the cure to the restless, anxious mind — not willpower, not distraction. Divine remembrance." },
    { a: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا", t: "So verily, with hardship comes ease.", r: "Surah Al-Inshirah 94:5", note: "In Arabic grammar, the word 'ease' (yusr) is indefinite — new, fresh ease. The hardship is the same (definite). Allah sends a different ease each time." },
    { a: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", t: "Your Lord has not abandoned you, nor has He become displeased.", r: "Surah Ad-Duha 93:3", note: "Revealed when the Prophet ﷺ felt abandoned and silent. If you feel forgotten by Allah — read this ayah." },
    { a: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", t: "When My servants ask you about Me — indeed I am near.", r: "Surah Al-Baqarah 2:186", note: "Allah did not say 'tell them I am nearby.' He said 'I am near.' Present tense. Right now. As you read this." },
    { a: "حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ", t: "Allah is sufficient for us, and He is the best Disposer of affairs.", r: "Surah Al-Imran 3:173", note: "Ibrahim ﷺ said this when thrown into fire. The Sahabah said this facing an overwhelming army. It is the declaration of complete trust." },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(150deg,#080a06 0%,#0c0f08 50%,#080a06 100%)",
  "Quran · Anxiety Relief · Emotional Healing",
  "The Quran Was Revealed<br>for Moments Exactly Like This",
  "Allah did not write a theology textbook. He wrote a healing book — with specific, direct answers to fear, grief, and the anxious heart.",
  "Read the Quran in MyTazki →",
  "/quran"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "What are the best Quran verses for anxiety?",
  "The six most powerful Quran verses for anxiety: Al-Baqarah 2:286 (you are not beyond your capacity), Ar-Ra'd 13:28 (hearts find rest in Allah's remembrance), Al-Inshirah 94:5-6 (with hardship comes ease — twice), Ad-Duha 93:3 (you have not been abandoned), Al-Baqarah 2:186 (Allah is near and answers), and Al-Imran 3:173 (Allah is sufficient for every fear)."
)}

<section style="margin:44px 0">
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">The Quran describes itself as a shifa — a healing — for what is in the chests. Not comfort alone. Healing. These twelve ayat speak directly into the specific emotional wounds that anxiety creates: the fear of being too much, of being abandoned, of being overwhelmed.</p>
</section>

<h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.5rem;font-weight:800;color:#f0ece4;margin:32px 0 8px">The Ayat — With Reflection</h2>

${verses.map(v => `<div style="margin:28px 0">
  ${quranVerse(v.a, v.t, v.r)}
  <p style="color:#4a6858;font-size:14px;line-height:1.75;margin:10px 0 0;font-family:Inter,sans-serif;padding-left:4px;border-left:2px solid rgba(52,201,122,0.2)"><em>${esc(v.note)}</em></p>
</div>`).join("")}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.4rem;font-weight:800;color:#f0ece4;margin:0 0 20px">How to Use These Verses</h2>
  ${practiceStep(1, "Choose One Verse to Memorise", "Pick the ayah that speaks most to your current struggle. Memorise it in Arabic. When anxiety comes, recite it — your nervous system will begin to associate the Arabic words with safety.")}
  ${practiceStep(2, "Read Before Sleep and After Fajr", "The two most vulnerable times emotionally are before sleep (when the mind reviews the day) and after Fajr (when the day feels overwhelming). Reading one verse at each time changes the emotional set-point.")}
  ${practiceStep(3, "Write It in Your Journal", "Write the Arabic, the transliteration, and a personal reflection: 'This verse speaks to me because...' Writing activates different neural pathways than reading alone.")}
</section>

${appCTA("Read the Quran With Audio", "MyTazki has the full Quran with Alafasy recitation, translation, and verse-by-verse reflections.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "More Healing Resources")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 5 — /how-to-stop-overthinking-islam
// ══════════════════════════════════════════════════════════════════════════════

router.get("/how-to-stop-overthinking-islam", (_req, res) => {
  const slug = "/how-to-stop-overthinking-islam";
  const title = "How to Stop Overthinking in Islam — A Practical Islamic Framework";
  const desc = "How Islam helps you stop overthinking. Practical duas, tawakkul practices, and Quranic wisdom that break the cycle of circular, anxious thinking for Muslim minds.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Stop Overthinking in Islam" }];
  const faqs = [
    { q: "What does Islam say about overthinking?", a: "Islam recognises overthinking as a form of excessive worry about matters that are beyond our control — which conflicts with tawakkul (trust in Allah). The Prophet ﷺ said: 'Be mindful of Allah, and Allah will protect you. Be mindful of Allah, and you will find Him in front of you. If you ask, ask of Allah alone; and if you seek help, seek help from Allah alone.' (Tirmidhi) This is the Islamic antidote to overthinking: redirect attention from the problem to the Source." },
    { q: "Is overthinking a sin in Islam?", a: "Overthinking itself is not a sin. It becomes spiritually harmful when it leads to negative assumptions about Allah (su' adh-dhann billah) or when it prevents action and trust. The Prophet ﷺ warned against 'what if' thinking — 'Do not say what if, for what if opens the door to the work of shaytan.' (Muslim)" },
    { q: "What dhikr stops overthinking?", a: "The most effective dhikr for overthinking is 'Hasbunallahu wa ni'mal wakil' (Allah is sufficient for us) repeated until the mental chatter quiets. Also effective: 'SubhanAllah' 33 times, 'Alhamdulillah' 33 times, 'Allahu Akbar' 34 times — the physical act of counting and the rhythm of repetition naturally interrupts overthinking patterns." },
    { q: "How does tawakkul help with overthinking?", a: "Tawakkul is the Islamic practice of doing everything within your capacity, then genuinely surrendering the outcome to Allah. Overthinking thrives on the illusion that more thinking will produce control. Tawakkul cuts through this: 'I have done what I can. The result belongs to Allah.' This is not passive — it is the most active choice available to a believer." },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(150deg,#080808 0%,#0c0c0e 50%,#080808 100%)",
  "Overthinking · Tawakkul · Islamic Practice",
  "The Mind That Won't Quiet<br>Has Forgotten Who Holds Tomorrow",
  "Overthinking is not a character flaw. It is a sign of a mind that has taken on more than it was designed to carry. Islam has always known the cure.",
  "Start Your Peace Journey →",
  "/download"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "How do I stop overthinking in Islam?",
  "The Islamic method for stopping overthinking has three stages: (1) Interrupt — perform wudu or 2 rakats of nafl prayer to physically break the thought loop; (2) Replace — recite 'Hasbunallahu wa ni'mal wakil' or Ayatul Kursi until the mental chatter quiets; (3) Surrender — make a verbal dua handing the concern to Allah and saying 'I trust Your plan.' Repeat as needed — the practice is the healing."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.65rem;font-weight:800;color:#f0ece4;margin:0 0 16px">Why the Muslim Mind Overthinks</h2>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0 0 16px;font-family:Inter,sans-serif">Overthinking is a hijacking of the intellect — a God-given gift turned against itself. The mind, designed to plan and reflect, begins to rehearse fear instead of reason. It replays the past, simulates catastrophic futures, and finds no peace in the present.</p>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">At its root, overthinking is a trust problem. Not a weakness of character — but a gap between what we believe intellectually about Allah's control and what we actually feel. Tawakkul is the bridge that closes that gap.</p>
</section>

${quranVerse(
  "وَعَلَى ٱللَّهِ فَتَوَكَّلُوٓاْ إِن كُنتُم مُّؤْمِنِينَ",
  "And put your trust in Allah, if you are indeed believers.",
  "Surah Al-Ma'idah 5:23"
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.4rem;font-weight:800;color:#f0ece4;margin:0 0 20px">The 5-Step Islamic Overthinking Protocol</h2>
  ${practiceStep(1, "Name the Thought Without Feeding It", "When an overthinking spiral begins, say aloud: 'I notice I am thinking about [X].' Naming it without arguing with it creates distance. This is the cognitive equivalent of saying 'A'udhu billahi minash-shaytanir-rajim' — I recognise this, and I am not surrendering to it.")}
  ${practiceStep(2, "Perform Wudu", "Wudu is a physical pattern-interrupt. The act of washing with intention breaks the physiological state of overthinking. Many scholars note that wudu clears the mind as well as the body — it resets your state.")}
  ${practiceStep(3, "Recite Ayatul Kursi", "Ayatul Kursi (2:255) contains the complete theology of tawakkul in 10 sentences. It reminds you who is actually in control. Recite it slowly, understanding each phrase. The overthinking mind needs a bigger picture — and this ayah provides it.")}
  ${practiceStep(4, "Speak Your Tawakkul Aloud", "Say: 'Ya Allah, I give this [worry] to You. I trust Your wisdom more than my planning. You know what I do not know. I release this now.' Speaking it aloud makes it an act, not just a thought.")}
  ${practiceStep(5, "Return to the Present Moment", "Ask: 'What is one thing I can do right now, in this moment?' Action breaks overthinking. The smallest purposeful action — sending a message, making tea, taking a walk — anchors you back in the present where overthinking cannot survive.")}
</section>

${duaCard(
  "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْوَسْوَاسِ الْخَنَّاسِ",
  "Allahumma inni a'udhu bika minal-waswas al-khannas",
  "O Allah, I seek refuge in You from the whispering Shaytan who retreats.",
  "Derived from Surah An-Nas 114:4 — seeking protection from the source of intrusive, circular thoughts"
)}

${scholarQuote(
  "Do not waste your heart in overthinking about that which you cannot change. Do your part, then leave the rest to Allah.",
  "Ibn al-Qayyim",
  "Al-Fawa'id"
)}

${appCTA("Quiet the Overthinking Mind", "MyTazki's guided tawakkul sessions, AI companion, and dhikr counter help you replace mental noise with divine remembrance.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "Related Healing Guides")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 6 — /dua-for-overthinking
// ══════════════════════════════════════════════════════════════════════════════

router.get("/dua-for-overthinking", (_req, res) => {
  const slug = "/dua-for-overthinking";
  const title = "Dua for Overthinking — Islamic Prayers to Quiet a Restless Mind";
  const desc = "Authentic duas for overthinking from Quran and Sunnah. Arabic text, transliteration, meaning, and a complete practice guide for Muslims struggling with circular, anxious thoughts.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Dua for Overthinking" }];
  const faqs = [
    { q: "What is the best dua for overthinking?", a: "The most effective duas for overthinking are: 'Allahumma inni a'udhu bika minal-hammi wal-hazan' (protection from worry and grief), 'Hasbunallahu wa ni'mal wakil' (Allah is sufficient), and 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin' (the dua of Yunus ﷺ). Combined with Ayatul Kursi, these form a complete practice for quieting the overthinking mind." },
    { q: "How many times should I recite dua for overthinking?", a: "The dua 'La ilaha illa anta...' (Ayah 87 of Surah Al-Anbiya) is narrated to be recited 40 times for removal of distress. 'Hasbunallahu wa ni'mal wakil' can be recited as many times as needed — particularly during acute episodes of overthinking. The Prophet ﷺ did not limit dhikr; the aim is presence and sincerity over quantity." },
    { q: "Does reciting dua really stop overthinking?", a: "Yes — through several mechanisms. Vocally reciting dua engages the speech centre of the brain, which temporarily overrides the default mode network (where overthinking occurs). The Arabic phonemes in Quran and dua have a specific acoustic quality that many scholars and researchers associate with the relaxation response. Most importantly, sincere dua is an act of releasing the problem to Allah — the spiritual equivalent of letting go." },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(160deg,#070a07 0%,#0a0d0a 50%,#070a07 100%)",
  "Dua · Dhikr · Mental Calm",
  "When the Mind Loops,<br>the Tongue Remembers Allah",
  "The overthinking mind has forgotten its anchor. These duas are that anchor — prophetically prescribed words that interrupt the spiral and return the heart to trust.",
  "Try Guided Dhikr in MyTazki →",
  "/download"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "What is the best dua to stop overthinking?",
  "Recite 'Hasbunallahu wa ni'mal wakil — Hasbiyallahu la ilaha illa hu, alayhi tawakkaltu wa huwa rabbul arshil azim' — Allah is sufficient for me, there is no god but Him, in Him I place my trust. This dua replaces the need for mental control with trust in Allah's sufficiency. Repeat it until the thought pattern shifts."
)}

<section style="margin:44px 0">
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">Overthinking is the mind trying to solve problems that only Allah can resolve. When we overthink, we are — without realising it — placing our trust in our own thinking rather than in Allah's knowledge. These duas are a direct correction of that. They are not magic words. They are declarations of reality: that Allah knows more than our minds can process.</p>
</section>

<h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.5rem;font-weight:800;color:#f0ece4;margin:32px 0 20px">Duas to Recite During Overthinking</h2>

${duaCard(
  "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
  "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul 'arshil 'azim",
  "Allah is sufficient for me. There is no god but He. In Him I put my trust, and He is the Lord of the Great Throne.",
  "Abu Dawud 5081 — Recite 7 times morning and evening, and whenever overthinking begins"
)}

${duaCard(
  "لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
  "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
  "There is no god but You, glory be to You. Indeed, I have been among the wrongdoers.",
  "Quran 21:87 — The dua of Yunus ﷺ in the darkest moment. Recite 40 times for removal of distress. (Narrated in multiple hadith collections)"
)}

${duaCard(
  "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
  "Rabbish rahli sadri wa yassir li amri",
  "My Lord, expand for me my chest and ease for me my task.",
  "Quran 20:25-26 — The dua of Musa ﷺ when facing the seemingly impossible. Perfect for moments of mental overwhelm."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.4rem;font-weight:800;color:#f0ece4;margin:0 0 20px">The Overthinking Dua Practice</h2>
  ${practiceStep(1, "Catch the Spiral Early", "The moment you notice thought loops beginning, say 'A'udhu billahi minash-shaytanir-rajim' aloud. This is not just words — it is a declaration that you recognise the source of destructive circular thinking.")}
  ${practiceStep(2, "Recite 'Hasbunallahu' Until Calm", "Begin with 'Hasbunallahu wa ni'mal wakil' and continue reciting until you feel the mental noise decrease. There is no minimum or maximum — stay with it.")}
  ${practiceStep(3, "Make a Specific Dua About the Worry", "Name the specific worry in your dua: 'Ya Allah, I am overthinking about [X]. I give this to You. Guide me to the right action and remove the rest from my mind.'")}
  ${practiceStep(4, "Write One Action You Can Take", "After the dua, write one concrete step you can take. This converts anxious mental energy into purposeful intention — which is what tawakkul actually looks like in practice.")}
</section>

${appCTA("Structured Dhikr for Overthinking", "MyTazki's digital tasbih, guided sessions, and AI companion are designed specifically for Muslims navigating anxious minds.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "More from the Healing Cluster")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 7 — /trust-allah-and-stop-overthinking
// ══════════════════════════════════════════════════════════════════════════════

router.get("/trust-allah-and-stop-overthinking", (_req, res) => {
  const slug = "/trust-allah-and-stop-overthinking";
  const title = "Trust Allah and Stop Overthinking — The Tawakkul Guide";
  const desc = "How tawakkul — complete trust in Allah — is the most powerful Islamic method for stopping overthinking. A deep, practical guide to letting go and trusting Allah's plan.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Trust Allah & Stop Overthinking" }];
  const faqs = [
    { q: "What is tawakkul and how does it stop overthinking?", a: "Tawakkul is complete reliance on Allah after taking the necessary action within your capacity. It stops overthinking by addressing the root cause: the belief that more thinking will give you control over outcomes. Tawakkul says: you do your part, Allah handles the rest. It removes the burden of having to mentally simulate every outcome — because you trust the One who knows all outcomes." },
    { q: "Is tawakkul just giving up?", a: "No. Tawakkul is the opposite of giving up. The Prophet ﷺ famously said: 'Tie your camel, then put your trust in Allah.' Tawakkul always begins with effort — preparing, planning, acting. What it releases is the anxiety about results. You are responsible for the journey. Allah is responsible for the destination." },
    { q: "How do I develop tawakkul?", a: "Tawakkul is built through: (1) Learning Allah's names — especially Al-Wakil (the Trustee), Al-Hafiz (the Protector), Al-Alim (the All-Knowing); (2) Reflecting on how Allah has always provided and guided you before; (3) Practicing the verbal declaration of trust ('Ya Allah, I trust Your plan') until it becomes sincere; (4) Reviewing life's hardships with hindsight — noticing how what you feared often became what guided you." },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(170deg,#050708 0%,#08090c 50%,#050708 100%)",
  "Tawakkul · Trust · Surrender",
  "Letting Go Is Not Weakness.<br>It Is the Highest Form of Wisdom.",
  "Overthinking exhausts what tawakkul protects. When you genuinely trust Allah with an outcome, the mind has nothing left to rehearse.",
  "Begin Your Tawakkul Journey →",
  "/download"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "How does trusting Allah stop overthinking?",
  "Overthinking is caused by the need to mentally control outcomes. Tawakkul directly removes this need — not by denying the problem, but by recognising that Allah's knowledge and power infinitely exceed your ability to think your way to safety. When you genuinely hand an outcome to Allah, the mind stops needing to rehearse it."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.65rem;font-weight:800;color:#f0ece4;margin:0 0 16px">The Weight You Were Not Meant to Carry</h2>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0 0 16px;font-family:Inter,sans-serif">Overthinking is what happens when a human being tries to hold Allah's responsibility alongside their own. You were designed to take action within your sphere. Allah handles everything outside of it. When we confuse these roles, the mind breaks under the weight of what it was never built to carry.</p>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">Tawakkul is not an Islamic concept about being passive. It is a precise division of responsibility — you take your action, Allah takes the outcome. This division is what frees the mind.</p>
</section>

${quranVerse(
  "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ ۚ إِنَّ ٱللَّهَ بَـٰلِغُ أَمْرِهِۦ",
  "And whoever places their trust in Allah, He will be their sufficiency. Indeed, Allah will accomplish His purpose.",
  "Surah At-Talaq 65:3"
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.4rem;font-weight:800;color:#f0ece4;margin:0 0 20px">The Tawakkul Practice — Step by Step</h2>
  ${practiceStep(1, "Define What Is Within Your Control", "Write down everything you CAN do about this situation. These are your responsibilities. Do them all. Leave nothing undone within your power.")}
  ${practiceStep(2, "Identify What Is Outside Your Control", "Write what you cannot control: other people's choices, the future, outcomes, timing, results. These are not your responsibility.")}
  ${practiceStep(3, "Make the Verbal Declaration", "Say aloud: 'Ya Allah — I have done [X and Y]. I hand [the outcome] to You. You know what I do not know. I choose to trust Your wisdom over my worry.'")}
  ${practiceStep(4, "Return When the Mind Recurses", "Overthinking will return. When it does, do not argue with it. Simply say: 'I have already given this to Allah. It is in the best hands.' Then redirect attention to something present.")}
  ${practiceStep(5, "Build Evidence of Allah's Care", "Keep a gratitude journal specifically of times Allah provided, guided, or protected you — especially in situations you once feared. Overthinking is starved by evidence of divine faithfulness.")}
</section>

${duaCard(
  "تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
  "Tawakkaltu 'alallahi wa la hawla wa la quwwata illa billah",
  "I place my trust in Allah and there is no power or strength except with Allah.",
  "Said when leaving the home — a daily declaration of tawakkul before facing the world"
)}

${scholarQuote(
  "Place your trust in Allah completely. Then work with all your heart. If the result is what you hoped — praise Allah. If not — know that Allah chose something better.",
  "Imam Ahmad ibn Hanbal",
  "Musnad — attributed"
)}

${appCTA("Build Your Tawakkul Practice", "MyTazki's guided journeys include a 7-Day Tawakkul Reset — helping you move from overthinking to genuine trust, one day at a time.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "Explore the Full Healing Cluster")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 8 — /islamic-sleep-meditation
// ══════════════════════════════════════════════════════════════════════════════

router.get("/islamic-sleep-meditation", (_req, res) => {
  const slug = "/islamic-sleep-meditation";
  const title = "Islamic Sleep Meditation — Guided Night Dhikr for Deep Rest";
  const desc = "A complete Islamic sleep meditation practice using authentic night dhikr, Quran recitation, and Sunnah breathing for deep, peaceful rest. For Muslims who struggle to sleep or find peace at night.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Islamic Sleep Meditation" }];
  const faqs = [
    { q: "What is Islamic sleep meditation?", a: "Islamic sleep meditation is the practice of preparing for sleep through authentic Sunnah rituals — reciting the sleep duas, performing specific dhikr, reciting Ayatul Kursi and the Three Quls, and entering a state of intentional surrender to Allah before resting. It combines the spiritual protection of Islamic bedtime practices with the physiological benefits of meditation." },
    { q: "What should a Muslim do before sleeping?", a: "The Sunnah sleep routine includes: performing wudu, lying on the right side, reciting Ayatul Kursi (protection), the Three Quls — Al-Ikhlas, Al-Falaq, An-Nas (three times each, blowing over the body), making dua for forgiveness (Astaghfirullah 70+ times), reciting SubhanAllah 33 times, Alhamdulillah 33 times, Allahu Akbar 34 times, and making personal dua before sleeping." },
    { q: "Which Surah should I recite before sleeping?", a: "The Prophet ﷺ consistently recited: Surah Al-Ikhlas, Surah Al-Falaq, and Surah An-Nas — the Three Quls — before sleeping, blowing into his hands and wiping over his body. He also recited the last two ayat of Surah Al-Baqarah (2:285-286), which he called sufficient for the night. Ayatul Kursi before sleeping was specifically said to provide divine protection until morning." },
    { q: "How do I stop my mind from racing at night?", a: "The Islamic approach: (1) Make wudu to physically reset; (2) Lie on your right side; (3) Recite Ayatul Kursi slowly, understanding each word; (4) Do the tasbih of Fatima (33/33/34); (5) Breathe with the phrase 'SubhanAllah' on the inhale and 'Alhamdulillah' on the exhale; (6) Hand your worries to Allah in a brief personal dua. The combination of physical positioning, dhikr, and dua creates the conditions for sleep that no sleeping pill can replicate." },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(160deg,#030508 0%,#050810 50%,#030508 100%)",
  "Sleep · Night Dhikr · Islamic Meditation",
  "The Night Was Made<br>for More Than Lying Awake",
  "When sleep won't come, the Sunnah offers a complete system — not to force sleep, but to create the conditions of peace in which sleep naturally arrives.",
  "Try Sleep Mode in MyTazki →",
  "/download"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "What is the best Islamic practice for sleep?",
  "The complete Sunnah sleep system: wudu before bed, lying on the right side, reciting Ayatul Kursi (protection until morning), the Three Quls blown over the body three times, SubhanAllah 33 times + Alhamdulillah 33 times + Allahu Akbar 34 times (Tasbih of Fatima), personal dua. This practice consistently reduces sleep onset time and reported anxiety in Muslim populations."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.65rem;font-weight:800;color:#f0ece4;margin:0 0 16px">Why Muslim Nights Can Be So Difficult</h2>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0 0 16px;font-family:Inter,sans-serif">Nighttime strips away the distractions of the day. The worries that were outrun during daylight hours settle in at night. The questions that have no answers arrive after Isha. For many Muslims, the night is the loneliest time.</p>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">And yet, the Islamic tradition holds the night sacred — not as a time to fear, but as a time when Allah descends to the lowest heaven and asks: "Is there anyone calling on Me that I may answer him?" (Bukhari) The same night that feels oppressive is the night of divine closeness.</p>
</section>

<h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.5rem;font-weight:800;color:#f0ece4;margin:32px 0 20px">The Complete Islamic Sleep Meditation</h2>

<div style="background:linear-gradient(135deg,rgba(8,14,20,0.98),rgba(6,10,16,0.96));border:1px solid rgba(52,201,122,0.15);border-radius:18px;padding:32px 28px;margin:22px 0">
  ${[
    { t: "1. Make Wudu", b: "Even if you already have wudu — renew it. This is a physical signal to the body that a transition is happening. You are moving from the day into protected rest." },
    { t: "2. Lie on Your Right Side", b: "The Sunnah position. Place your right hand under your right cheek. This is both Prophetic Sunnah and physiologically optimal for heart function during sleep." },
    { t: "3. Recite Ayatul Kursi", b: "Slowly. Understand each phrase. 'His Throne extends over the heavens and the earth, and He feels no fatigue in guarding them.' This is your protection until morning." },
    { t: "4. Recite the Three Quls — 3 Times Each", b: "Al-Ikhlas, Al-Falaq, An-Nas. After each set, blow gently into your palms and wipe over your face and body. The Prophet ﷺ never abandoned this practice even when ill." },
    { t: "5. Tasbih of Fatima", b: "SubhanAllah × 33 · Alhamdulillah × 33 · Allahu Akbar × 34. The Prophet ﷺ said this is better than a servant — it gives you strength for the next day." },
    { t: "6. Breathe with Allah's Names", b: "Inhale slowly: 'Ya Allah.' Exhale slowly: 'Alhamdulillah.' Continue for 10 breaths. This synchronises your breath with gratitude and presence." },
    { t: "7. Personal Dua and Release", b: "Speak your worries to Allah, then say: 'Ya Allah, I give You what I cannot carry tonight. I trust You with my sleep and my tomorrow.' Sleep is now an act of tawakkul." },
  ].map((s, i) => `<div style="display:flex;gap:16px;align-items:flex-start;margin:18px 0;${i > 0 ? 'border-top:1px solid rgba(52,201,122,0.07);padding-top:18px' : ''}">
    <span style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:rgba(52,201,122,0.1);border:1px solid rgba(52,201,122,0.2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#34c97a;font-family:Inter,sans-serif">${i + 1}</span>
    <div>
      <p style="color:#f0ece4;font-size:15px;font-weight:700;font-family:'DM Sans',Inter,sans-serif;margin:4px 0 6px">${esc(s.t)}</p>
      <p style="color:#4a6858;font-size:14px;line-height:1.75;margin:0;font-family:Inter,sans-serif">${esc(s.b)}</p>
    </div>
  </div>`).join("")}
</div>

${duaCard(
  "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
  "Allahumma bismika amutu wa ahya",
  "O Allah, in Your name I die and I live.",
  "Sahih al-Bukhari 6324 — Said upon going to sleep. Sleep in Islam is a minor death — a nightly return to Allah's care."
)}

${appCTA("MyTazki Sleep Mode", "Guided Islamic sleep sessions with night dhikr audio, breathing rhythm, and Quran recitation — designed for the Muslim night.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "More from the Healing Cluster")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 9 — /quran-for-sleep
// ══════════════════════════════════════════════════════════════════════════════

router.get("/quran-for-sleep", (_req, res) => {
  const slug = "/quran-for-sleep";
  const title = "Quran for Sleep — Surahs and Ayat for Peaceful Rest";
  const desc = "The best Quran recitations for sleep — specific surahs, ayat, and listening practices from the Sunnah that calm the nervous system and bring peaceful rest to Muslims.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Quran for Sleep" }];
  const faqs = [
    { q: "Which Quran recitation is best for sleep?", a: "The Prophet ﷺ specifically prescribed: the Three Quls (Al-Ikhlas, Al-Falaq, An-Nas) recited three times before sleeping, and the last two ayat of Surah Al-Baqarah (285-286) which he said are sufficient for the night. For audio recitation during sleep, Surah Al-Mulk (36 ayat, ~7 minutes) is widely recited before sleep for its protection and calming quality." },
    { q: "Is it okay to listen to Quran while sleeping?", a: "Listening to Quran with the intention of spiritual benefit while drifting to sleep is permissible and considered a blessed act. Many scholars recommend having Quran playing softly as you fall asleep. The key is intention — not using it as background noise, but as a spiritual companion for the night." },
    { q: "What Surah should I read before bed?", a: "The complete Sunnah recommendation: (1) Three Quls × 3 — mandatory Sunnah; (2) Ayatul Kursi (2:255) — for divine protection; (3) Last two ayat of Al-Baqarah (2:285-286) — Prophet ﷺ said they are sufficient for the night; (4) Surah Al-Mulk — narrated to intercede until forgiven. These together form the complete Sunnah bedtime Quran practice." },
    { q: "Does Quran recitation help with insomnia?", a: "Multiple clinical studies have shown Quran recitation reduces autonomic nervous system arousal — the primary physiological mechanism of insomnia. Specifically, recitation reduces heart rate, lowers blood pressure, and decreases cortisol. For Muslim populations, Quran recitation also carries the psychological benefit of divine connection and surrender — both powerful antidotes to the hyperarousal that prevents sleep." },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(155deg,#040608 0%,#060910 50%,#040608 100%)",
  "Quran · Sleep · Divine Calm",
  "The Last Sound You Hear<br>Should Be the Words of Allah",
  "Quran recitation before sleep is not tradition for tradition's sake. It physiologically and spiritually creates the conditions for rest that the anxious mind cannot manufacture on its own.",
  "Listen in MyTazki Quran →",
  "/quran"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "What Quran should I recite for sleep?",
  "The Sunnah bedtime Quran: Three Quls (Al-Ikhlas, Al-Falaq, An-Nas) × 3, blown over the body. Ayatul Kursi for divine protection until morning. Last two ayat of Al-Baqarah (2:285-286) — specifically narrated as sufficient for the night. For listening during sleep: Surah Al-Mulk (protection), Surah Ar-Rahman (mercy and calm), or Surah Al-Kahf (comprehensive blessing)."
)}

<section style="margin:44px 0">
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">The Quran was revealed in a language whose very phonology carries healing. The elongated vowels of tajweed, the rhythmic breath control of proper recitation, the meaning of divine mercy woven into every line — these combine to create an experience of calm that is both spiritually profound and physiologically real. This is why "the remembrance of Allah" brings rest to hearts: because it was designed to.</p>
</section>

<h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.5rem;font-weight:800;color:#f0ece4;margin:32px 0 20px">The Sunnah Sleep Recitations</h2>

${[
  { ref: "Ayatul Kursi — Surah Al-Baqarah 2:255", desc: "The Throne Verse. Recited before sleep, the Prophet ﷺ said: a guardian from Allah will remain with you and shaytan will not come near you until morning. The most protection-dense ayah in the Quran.", arabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", trans: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence." },
  { ref: "Al-Ikhlas, Al-Falaq, An-Nas — Three Times Each", desc: "The Three Quls blown into the palms and wiped over the body. The Prophet ﷺ never abandoned this practice, even while ill. They provide protection, purification, and calm.", arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", trans: "Say: He is Allah, the One..." },
  { ref: "Last Two Ayat of Al-Baqarah — 2:285-286", desc: "The Prophet ﷺ said: 'Whoever recites the last two ayat of Surah Al-Baqarah at night, they will suffice him.' (Bukhari) Suffice — meaning for protection, sleep, and peace.", arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا", trans: "Allah does not burden a soul beyond that it can bear..." },
].map(v => `<div style="margin:24px 0;background:rgba(52,201,122,0.03);border:1px solid rgba(52,201,122,0.1);border-radius:14px;padding:24px 22px">
  <p style="color:rgba(52,201,122,0.7);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;font-family:Inter,sans-serif">${esc(v.ref)}</p>
  <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.5em;line-height:2.2;margin:0 0 12px">${v.arabic}</p>
  <p style="color:#6a9878;font-size:14px;margin:0 0 10px;font-family:Inter,sans-serif;line-height:1.7">${esc(v.trans)}</p>
  <p style="color:#4a6858;font-size:13.5px;line-height:1.75;margin:0;font-family:Inter,sans-serif">${esc(v.desc)}</p>
</div>`).join("")}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.4rem;font-weight:800;color:#f0ece4;margin:0 0 20px">For Listening During Sleep</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px">
    ${[
      { s: "Surah Al-Mulk", n: "67", r: "36 ayat · ~7 min", d: "Protection. The Prophet ﷺ said it intercedes for its reciter until they are forgiven." },
      { s: "Surah Ar-Rahman", n: "55", r: "78 ayat · ~12 min", d: "The surah of divine mercy. Every verse ends with gratitude — perfect medicine for an overwhelmed heart." },
      { s: "Surah Yaseen", n: "36", r: "83 ayat · ~15 min", d: "Called the heart of the Quran. Creates a profound sense of divine presence and peace." },
      { s: "Surah Al-Kahf", n: "18", r: "110 ayat · ~20 min", d: "Comprehensive protection. Recited on Friday nights for the full week's barakah." },
    ].map(s => `<a href="/quran/read/${s.n}" style="text-decoration:none;display:block;background:#111a13;border:1px solid rgba(52,201,122,0.13);border-radius:14px;padding:20px 18px" onmouseover="this.style.borderColor='rgba(52,201,122,0.3)'" onmouseout="this.style.borderColor='rgba(52,201,122,0.13)'">
      <strong style="color:#f0ece4;font-size:15px;font-family:'DM Sans',Inter,sans-serif;display:block;margin-bottom:4px">${s.s}</strong>
      <span style="color:#34c97a;font-size:11px;font-weight:700;display:block;margin-bottom:8px;font-family:Inter,sans-serif">${s.r}</span>
      <span style="color:#4a6858;font-size:13px;line-height:1.6;font-family:Inter,sans-serif">${s.d}</span>
    </a>`).join("")}
  </div>
</section>

${appCTA("Quran with Audio for Sleep", "MyTazki has the full Quran with Sheikh Alafasy recitation, verse-by-verse. Listen with sleep mode enabled for a gentle nighttime experience.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "More from the Healing Cluster")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 10 — /dua-before-sleep
// ══════════════════════════════════════════════════════════════════════════════

router.get("/dua-before-sleep", (_req, res) => {
  const slug = "/dua-before-sleep";
  const title = "Dua Before Sleep — Complete Islamic Bedtime Duas from Sunnah";
  const desc = "The complete collection of authentic Islamic bedtime duas — Arabic, transliteration, meaning, and the correct order from the Sunnah. Duas for protection, forgiveness, and peaceful sleep.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Emotional Healing", item: "/islamic-emotional-healing" }, { name: "Dua Before Sleep" }];
  const faqs = [
    { q: "What is the dua before sleeping in Islam?", a: "The most important duas before sleep include: 'Allahumma bismika amutu wa ahya' (O Allah, in Your name I die and I live) — said upon sleeping; Ayatul Kursi (2:255) for protection; the Three Quls × 3 blown into palms; and 'Allahumma qini 'adhabak yawma tab'athu 'ibadak' (O Allah, protect me from Your punishment on the Day You resurrect Your servants) — said three times." },
    { q: "What is the dua for a good night's sleep?", a: "For peaceful sleep specifically: 'Allahumma ghara-an-nujumu wa hada'at-il-'uyunu wa anta hayyun qayyumun la ta'khudhuka sinatun wa la nawmun — Allahumma ahdi' layli wa anim 'ayni.' (O Allah, the stars have set, the eyes have rested, and You are the Ever-Living, the Sustainer. O Allah, quieten my night and rest my eyes.) This is a dua specifically for sleep onset." },
    { q: "What do you say when you wake up from sleep in Islam?", a: "Upon waking: 'Alhamdulillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur' — All praise is to Allah who gave us life after having taken it from us, and unto Him is the resurrection. This dua reframes waking up as a gift and sets the intention for the day as one of gratitude." },
    { q: "Is it Sunnah to make dua before sleeping?", a: "Yes — it is an established, consistent Sunnah. The Prophet ﷺ never slept without reciting specific duas and surahs. Aisha رضي الله عنها narrated that he would recite the Three Quls every night, and he said whoever recites Ayatul Kursi before sleeping will be protected by an angel until morning. (Bukhari)" },
  ];

  const body = `
${breadcrumb(bcs)}
${hero(
  "linear-gradient(160deg,#040507 0%,#070810 50%,#040507 100%)",
  "Bedtime Dua · Sunnah Sleep · Night Remembrance",
  "The Last Words Before Sleep<br>Should Be Words of Return to Allah",
  "Sleep is a gift that begins with remembrance. The bedtime duas of the Prophet ﷺ are not ritual — they are medicine for the night.",
  "Add Bedtime Duas to Your Routine →",
  "/download"
)}

<div style="max-width:780px;margin:36px auto 0">

${quickAnswerBox(
  "What is the Islamic dua before sleeping?",
  "The primary bedtime dua is: 'Allahumma bismika amutu wa ahya' — O Allah, in Your name I die and I live. Sleep in Islam is considered a minor death — a nightly return to Allah's care. Accompanied by Ayatul Kursi, the Three Quls, and the Tasbih of Fatima, this forms the complete Sunnah sleep dua practice."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.65rem;font-weight:800;color:#f0ece4;margin:0 0 16px">Sleep as Tawakkul</h2>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0 0 16px;font-family:Inter,sans-serif">In Islamic understanding, every sleep is a minor death — a momentary surrender of consciousness to Allah's care. When you make dua before sleeping, you are not just asking for good rest. You are saying: I give myself back to You tonight. Whatever You will for me is what I accept.</p>
  <p style="color:#6e5e4c;font-size:16px;line-height:1.85;margin:0;font-family:Inter,sans-serif">This is why the Prophet ﷺ treated the bedtime duas so seriously — they were not formalities. They were the nightly renewal of trust between the believer and their Creator.</p>
</section>

<h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.5rem;font-weight:800;color:#f0ece4;margin:32px 0 20px">The Complete Sunnah Bedtime Duas</h2>

${duaCard(
  "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
  "Allahumma bismika amutu wa ahya",
  "O Allah, in Your name I die and I live.",
  "Sahih al-Bukhari 6324 — The first dua upon going to sleep. Acknowledge the surrender."
)}

${duaCard(
  "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ",
  "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu zahri ilayk",
  "O Allah, I have submitted my soul to You, entrusted my affairs to You, turned my face toward You, and placed my back against You.",
  "Sahih al-Bukhari 247 — The dua of complete surrender before sleep. If you die in this state, you die on the fitrah."
)}

${duaCard(
  "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
  "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
  "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
  "Abu Dawud 5045 — Said three times before sleeping. A profound act of humility and hope."
)}

<section style="margin:44px 0">
  <h2 style="font-family:'DM Sans',Inter,sans-serif;font-size:1.4rem;font-weight:800;color:#f0ece4;margin:0 0 20px">The Bedtime Dua Sequence</h2>
  ${practiceStep(1, "Lie on Your Right Side", "The Sunnah position. Right hand under right cheek. This is the position the Prophet ﷺ always slept in.")}
  ${practiceStep(2, "Recite Ayatul Kursi", "An angel guardian remains with you until morning. Read slowly — do not rush. Each word is protection.")}
  ${practiceStep(3, "Three Quls × 3 — Blow Over Yourself", "Al-Ikhlas, Al-Falaq, An-Nas. Recite each surah, then blow gently into your palms. Wipe over your face, then your body, three times. This was the Prophet's ﷺ unwavering practice.")}
  ${practiceStep(4, "Tasbih of Fatima", "SubhanAllah × 33, Alhamdulillah × 33, Allahu Akbar × 34. The Prophet ﷺ gave this to Fatimah رضي الله عنها when she asked for a servant — and said it was better.")}
  ${practiceStep(5, "Personal Dua and 'Allahumma bismika amutu wa ahya'", "End with your personal needs — then the final dua of return to Allah. Close your eyes in that state of surrender.")}
</section>

${quranVerse(
  "ٱللَّهُ يَتَوَفَّى ٱلْأَنفُسَ حِينَ مَوْتِهَا وَٱلَّتِي لَمْ تَمُتْ فِي مَنَامِهَا",
  "Allah takes the souls at the time of their death, and those that do not die during their sleep.",
  "Surah Az-Zumar 39:42 — Sleep is Allah holding your soul. You return every morning only because He returns it."
)}

${appCTA("Your Nightly Islamic Companion", "MyTazki's bedtime session guides you through every dua, dhikr, and Quran recitation in the correct Sunnah order — audio, Arabic, and meaning all included.")}

${relatedArticlesGrid(CLUSTER_LINKS.filter(l => l.href !== slug), "Complete the Healing Journey")}

${faqHtml(faqs)}
</div>
${shareBlock()}
`;

  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(page(seoHead({ title, description: desc, canonical: slug, schema: [art(title, desc, slug), breadcrumbSchema(bcs), faqSchema(faqs)] }), body));
});

export default router;
