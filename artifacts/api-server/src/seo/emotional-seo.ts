import { Router } from "express";
import { seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc } from "./shared.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function articleSchema(title: string, desc: string, slug: string, date: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": desc,
    "author": { "@type": "Organization", "name": "MyTazki" },
    "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" },
    "datePublished": date,
    "dateModified": TODAY,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` },
  };
}

function speakableSchema(slug: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ai-summary", "h1"] },
    "url": `https://mytazki.com${slug}`,
  };
}

function emotionPage(opts: {
  title: string; desc: string; slug: string; h1: string; date: string;
  aiSummary: string; intro: string; mainHtml: string;
  steps: Array<{ title: string; desc: string }>;
  quranRefs: Array<{ arabic: string; trans: string; ref: string }>;
  relatedDuas: Array<{ href: string; label: string }>;
  faqs: Array<{ q: string; a: string }>;
  internalLinks: Array<{ href: string; label: string }>;
  relatedArticles: Array<{ href: string; label: string }>;
  breadcrumbs: Array<{ name: string; item?: string }>;
}): string {
  const head = seoHead({
    title: opts.title,
    description: opts.desc,
    canonical: opts.slug,
    schema: [articleSchema(opts.title, opts.desc, opts.slug, opts.date), speakableSchema(opts.slug), faqSchema(opts.faqs), breadcrumbSchema(opts.breadcrumbs)],
  });

  const body = `
${breadcrumb(opts.breadcrumbs)}
<h1>${esc(opts.h1)}</h1>

<div class="ai-summary" style="background:rgba(52,201,122,0.07);border-left:4px solid #34c97a;border-radius:0 10px 10px 0;padding:16px 20px;margin:20px 0;font-size:15px;line-height:1.7;color:#eaf4ee">
<strong style="color:#34c97a">Quick Answer:</strong> ${opts.aiSummary}
</div>

<p style="font-size:16px;line-height:1.8;color:#a0c8a0;margin-bottom:20px">${opts.intro}</p>

${opts.mainHtml}

<h2>Practical Steps</h2>
<ol style="padding-left:20px;line-height:2">
${opts.steps.map(s => `<li style="margin-bottom:10px"><strong style="color:#eaf4ee">${esc(s.title)}</strong>, <span style="color:#a0c8a0">${esc(s.desc)}</span></li>`).join("\n")}
</ol>

<h2>Quran & Hadith</h2>
${opts.quranRefs.map(r => `<div class="quran-block" style="background:rgba(52,201,122,0.05);border-radius:10px;padding:16px 20px;margin:14px 0;border:1px solid rgba(52,201,122,0.12)">
  <p class="arabic" style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.5em;line-height:2;margin:0 0 8px">${r.arabic}</p>
  <p class="transliteration" style="color:#34c97a;font-style:italic;margin:0 0 6px;font-size:14px">${esc(r.trans)}</p>
  <p style="color:#6a9878;font-size:13px;margin:0">${esc(r.ref)}</p>
</div>`).join("")}

<h2>Find These Duas in MyTazki</h2>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0">
${opts.relatedDuas.map(d => `<a href="${d.href}" style="background:rgba(52,201,122,0.08);border:1px solid rgba(52,201,122,0.2);color:#34c97a;padding:8px 16px;border-radius:20px;text-decoration:none;font-size:13px;font-family:Inter,sans-serif">${esc(d.label)}</a>`).join("")}
</div>

${faqHtml(opts.faqs)}

<h2>Continue Your Islamic Journey</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0">
${opts.internalLinks.map(l => `<a href="${l.href}" class="card" style="text-decoration:none;color:#eaf4ee;display:block;padding:14px;border-radius:10px"><strong style="color:#34c97a;font-size:14px">${esc(l.label)}</strong></a>`).join("")}
</div>

<h2>Related Guides</h2>
<div style="display:flex;flex-direction:column;gap:10px;margin:12px 0 24px">
${opts.relatedArticles.map(a => `<a href="${a.href}" style="color:#34c97a;text-decoration:none;font-size:15px;font-family:Inter,sans-serif">→ ${esc(a.label)}</a>`).join("")}
</div>

${ctaBlock()}
`;
  return page(head, body);
}

// ─── Page 1: Dua for Anxiety ───────────────────────────────────────────────
router.get("/dua-for-anxiety", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/dua-for-anxiety",
    date: "2026-01-12",
    title: "Dua for Anxiety and Stress, Quran & Sunnah",
    desc: "The best duas for anxiety and stress from the Quran and authentic Hadith. Arabic text, transliteration, meaning, and when to recite them.",
    h1: "Dua for Anxiety and Stress, Islamic Relief for Worry",
    aiSummary: "Islam offers powerful duas for anxiety rooted in the Quran and Sunnah. The most recommended is the Prophet's dua: \"Allahumma inni a'udhu bika minal-hammi wal-hazan\" (O Allah, I seek refuge in You from worry and grief). Recite it with intention, especially after Fajr and before sleep.",
    intro: "Anxiety is part of the human experience, and the Prophet ﷺ himself experienced it. Islam doesn't ask you to suppress your emotions; it gives you direct channels to Allah to release them. These duas are not just words, they are conversations with the One who controls all things.",
    mainHtml: `
<h2>Why These Duas Work for Anxiety</h2>
<p style="color:#a0c8a0;line-height:1.8">The Prophet ﷺ taught us specific words to say when the weight of worry feels unbearable. These aren't poetic phrases, they are direct requests to Allah, acknowledging that He alone holds the cure. Clinical studies have also shown that mindful supplication reduces cortisol and activates the parasympathetic nervous system, producing calm.</p>
<h2>The Most Powerful Dua for Anxiety</h2>
<p style="color:#a0c8a0;line-height:1.8">The Prophet ﷺ used to say this dua regularly during times of distress. It covers six different types of worry and asks Allah to replace them with relief and action. Scholars recommend reciting it 7 times after Fajr and before bed.</p>`,
    steps: [
      { title: "Make Wudu", desc: "Purification before dua signals to your mind and soul that you're entering a sacred conversation." },
      { title: "Face the Qibla", desc: "Turn your body toward the direction of prayer to orient your heart toward Allah." },
      { title: "Raise your hands", desc: "Lift your hands to shoulder height, this physical act opens your heart to receiving." },
      { title: "Recite the dua", desc: "Say 'Allahumma inni a'udhu bika minal-hammi wal-hazan' with full presence and belief." },
      { title: "Sit in silence", desc: "After the dua, sit quietly for 2 minutes. Allow the peace of tawakkul (trust in Allah) to settle." },
      { title: "Repeat daily", desc: "Consistency is key. Make this dua part of your morning and evening Azkar routine." },
    ],
    quranRefs: [
      { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", trans: "Alaa bidhikrillahi tatma'innal quloob", ref: "Verily, in the remembrance of Allah do hearts find rest, Quran 13:28" },
      { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", trans: "Fa inna ma'al-'usri yusraa", ref: "For indeed, with hardship will be ease, Quran 94:5" },
    ],
    relatedDuas: [
      { href: "/duas/anxiety", label: "Duas for Anxiety" },
      { href: "/duas/hardship", label: "Duas for Hardship" },
      { href: "/duas/morning-supplication", label: "Morning Azkar" },
      { href: "/duas/before-sleeping", label: "Sleep Duas" },
    ],
    faqs: [
      { q: "What is the best dua for anxiety in Islam?", a: "The Prophet ﷺ taught: 'Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dhala'id-dayn wa ghalabatir-rijal' (Bukhari). It seeks refuge from worry, grief, incapacity, laziness, miserliness, cowardice, debt, and being overpowered by others." },
      { q: "Can Islam help with anxiety?", a: "Yes. Islamic practices like regular salah, dhikr, reading Quran, tawakkul (trust in Allah), and community support (ummah) are proven frameworks for managing anxiety. They address the spiritual, mental, and social dimensions of mental health." },
      { q: "What surah should I read for anxiety?", a: "Surah Ad-Duha (93) is especially comforting, Allah directly addresses the Prophet ﷺ saying 'Your Lord has not forsaken you'. Also Surah Al-Inshirah (94) and Surah Al-Baqarah for protection." },
      { q: "How many times should I recite a dua for anxiety?", a: "There's no fixed number, but reciting with presence 3, 7, or 33 times is a common Sunnah pattern. Consistency daily is more important than quantity in a single session." },
      { q: "Does reading Quran help with anxiety?", a: "Yes, the Quran itself says it is a 'healing for what is in the breasts' (10:57). Regular recitation, reflection, and listening to recitation are all beneficial for anxiety and emotional wellbeing." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Guided Healing Sessions" },
      { href: "/duas", label: "Full Duas Library" },
      { href: "/prayer-times", label: "Prayer Times" },
      { href: "/home", label: "Open MyTazki App" },
    ],
    relatedArticles: [
      { href: "/how-islam-brings-peace", label: "How Islam Brings Inner Peace" },
      { href: "/quran-verses-about-stress", label: "Quran Verses for Stress Relief" },
      { href: "/tahajjud-for-anxiety", label: "Tahajjud Prayer for Anxiety" },
      { href: "/islamic-routine-for-peace", label: "Islamic Morning Routine for Peace" },
      { href: "/surah-for-peace", label: "Which Surah Brings Peace of Mind?" },
    ],
    breadcrumbs: [
      { name: "Home", item: "/" },
      { name: "Duas", item: "/duas" },
      { name: "Dua for Anxiety" },
    ],
  }));
});

// ─── Page 2: Quran Verses About Stress ────────────────────────────────────
router.get("/quran-verses-about-stress", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/quran-verses-about-stress",
    date: "2026-01-14",
    title: "Quran Verses About Stress, 10 Powerful Ayat for Relief",
    desc: "10 Quran verses that bring relief from stress, worry, and anxiety. Arabic text, translation, and meaning of each ayah, with guidance on how to use them.",
    h1: "10 Quran Verses That Bring Relief from Stress",
    aiSummary: "The Quran contains many verses that directly address stress and worry. Key ayat include 13:28 (hearts find rest in Allah's remembrance), 94:5-6 (with hardship comes ease, stated twice), and 2:286 (Allah does not burden a soul beyond its capacity). These verses form the core of Islamic stress relief.",
    intro: "Long before modern psychology discovered the power of mindset reframing, Allah revealed words in the Quran that recalibrate the anxious mind. These verses are not platitudes, they are divine truths that, when internalized, transform how we experience difficulty.",
    mainHtml: `
<h2>How the Quran Addresses Stress Scientifically</h2>
<p style="color:#a0c8a0;line-height:1.8">When we recite Quranic verses with understanding, several things happen: the rhythmic recitation activates the parasympathetic nervous system; the meaning reshapes our cognitive interpretation of events; and the act of turning to Allah activates a sense of agency (tawakkul) that reduces learned helplessness. This is Islam's integrated approach to stress management.</p>
<h2>The Most Comforting Verses</h2>
<p style="color:#a0c8a0;line-height:1.8">Scholars throughout history have recommended specific surahs and ayat for periods of distress. Surah Ad-Duha was revealed when the Prophet ﷺ felt abandoned. Surah Al-Inshirah came immediately after. Allah was addressing his grief directly. And He is addressing yours too.</p>`,
    steps: [
      { title: "Choose one verse", desc: "Pick one ayah from this list that resonates with your current situation most." },
      { title: "Read the Arabic", desc: "Even if you can't read Arabic fluently, attempt to pronounce it, the sounds carry blessings." },
      { title: "Read the translation", desc: "Understand exactly what Allah is saying to you in this moment." },
      { title: "Sit with it", desc: "Close your eyes and reflect on the meaning for 60 seconds after reading." },
      { title: "Write it down", desc: "Put it somewhere visible, your phone wallpaper, a sticky note, your journal." },
      { title: "Recite throughout the day", desc: "Return to this verse whenever stress rises. Let it anchor you." },
    ],
    quranRefs: [
      { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", trans: "La yukallifullahu nafsan illa wus'aha", ref: "Allah does not burden a soul beyond that it can bear, Quran 2:286" },
      { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans: "Inna ma'al-'usri yusraa", ref: "Indeed, with hardship will be ease, Quran 94:6" },
      { arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", trans: "Wa lasawfa yu'teeka rabbuka fatardha", ref: "And your Lord will give you, and you will be satisfied, Quran 93:5" },
    ],
    relatedDuas: [
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/duas/hardship", label: "Duas for Hardship" },
      { href: "/surah-for-peace", label: "Surah for Peace" },
    ],
    faqs: [
      { q: "What does the Quran say about stress?", a: "The Quran consistently reminds believers that hardship is temporary (94:5-6), that Allah does not overburden (2:286), that remembrance of Allah brings peace (13:28), and that Allah is always near (2:186). These form a complete framework for managing stress Islamically." },
      { q: "Which surah to read when stressed?", a: "Surah Ad-Duha (93), Al-Inshirah (94), Al-Baqarah (2:155-157), and Surah Al-Kahf (especially the opening and closing verses) are most recommended by scholars for times of stress." },
      { q: "Can reciting Quran reduce stress?", a: "Yes. Multiple studies have shown that Quranic recitation lowers cortisol levels, reduces heart rate, and produces measurable relaxation responses, independent of whether the listener understands Arabic." },
    ],
    internalLinks: [
      { href: "/quran", label: "Full Quran Reader" },
      { href: "/sessions", label: "Guided Quran Sessions" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/dua-for-anxiety", label: "Dua for Anxiety and Stress" },
      { href: "/surah-for-peace", label: "Which Surah Brings Peace?" },
      { href: "/quran-about-anxiety", label: "What the Quran Says About Anxiety" },
      { href: "/how-islam-brings-peace", label: "How Islam Brings Inner Peace" },
    ],
    breadcrumbs: [
      { name: "Home", item: "/" },
      { name: "Quran", item: "/quran" },
      { name: "Quran Verses About Stress" },
    ],
  }));
});

// ─── Page 3: How Islam Brings Peace ──────────────────────────────────────
router.get("/how-islam-brings-peace", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/how-islam-brings-peace",
    date: "2026-01-16",
    title: "How Islam Brings Inner Peace, 7 Islamic Practices That Work",
    desc: "How Islam helps you find lasting inner peace. 7 evidence-backed Islamic practices for mental calm, from salah and dhikr to tawakkul and community.",
    h1: "How Islam Brings Inner Peace, 7 Practices That Actually Work",
    aiSummary: "Islam brings inner peace through consistent salah (prayer that interrupts anxious thought cycles), dhikr (remembrance that anchors the mind to Allah), tawakkul (radical trust in Allah's plan), community (ummah), Quran recitation, regular fasting, and gratitude practices. Together, they address the spiritual root of restlessness.",
    intro: "The word 'Islam' itself derives from 'salama', peace. It is not incidental that the greeting 'As-salamu alaykum' (peace be upon you) is exchanged between believers. Peace is the intended state of the Muslim heart. The question is: what are the specific mechanisms through which Islam produces this peace?",
    mainHtml: `
<h2>The 7 Islamic Pathways to Inner Peace</h2>
<p style="color:#a0c8a0;line-height:1.8">Islam's approach to peace is not passive, it is an active practice of turning toward Allah at every moment. The five pillars are not just obligations; they are the architecture of a peaceful life. Here are the seven most impactful pathways scholars and Muslims across history have found.</p>
<h2>1. Salah, Five Interruptions of Worry</h2>
<p style="color:#a0c8a0;line-height:1.8">Salah interrupts the mind's anxious rumination cycle five times daily. Each prayer is a reset, a moment where worldly concerns must be set aside and full attention given to Allah. Regular practitioners often describe salah as the most effective stress management tool in their lives.</p>`,
    steps: [
      { title: "Establish consistent Salah", desc: "Even if imperfect, pray at your scheduled times. Regularity matters more than length." },
      { title: "Practice morning Azkar", desc: "Read morning supplications before checking your phone. Start the day in Allah's remembrance." },
      { title: "Learn one new name of Allah daily", desc: "Each of Allah's 99 names reveals an attribute that addresses a different human need." },
      { title: "Give Sadqa regularly", desc: "Even small acts of charity activate gratitude and abundance mindset." },
      { title: "Limit news and social media", desc: "The Prophet ﷺ advised against excessive talk, extend this to digital consumption." },
      { title: "Build ummah connections", desc: "Attend Jumu'ah, join Islamic circles, and invest in Muslim friendships." },
      { title: "Use MyTazki's guided sessions", desc: "Access 35+ sessions for Azkar, Quran reflection, healing, and sleep to build your practice." },
    ],
    quranRefs: [
      { arabic: "وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ", trans: "Wa man yu'min billahi yahdi qalbah", ref: "And whoever believes in Allah, He will guide his heart, Quran 64:11" },
      { arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ", trans: "Alladhina amanu wa tatma'innu quloobuhum bidhikrillah", ref: "Those who believe and whose hearts find rest in the remembrance of Allah, Quran 13:28" },
    ],
    relatedDuas: [
      { href: "/duas/morning-supplication", label: "Morning Duas" },
      { href: "/duas/anxiety", label: "Duas for Anxiety" },
      { href: "/duas/gratitude", label: "Duas for Gratitude" },
    ],
    faqs: [
      { q: "Can Islam help with mental health?", a: "Yes. Islamic practices like salah, dhikr, community support, and purposeful living address the social, spiritual, and psychological dimensions of mental health. Many Muslim therapists integrate Islamic frameworks with clinical approaches." },
      { q: "What does Islam say about inner peace?", a: "Islam explicitly connects inner peace (sakinah and tuma'ninah) with the remembrance of Allah (dhikr). Quran 13:28 states: 'Verily, in the remembrance of Allah hearts find rest.' This is Islam's central promise regarding peace." },
      { q: "How do I find peace through Islam?", a: "Start with consistency in salah, add morning Azkar, learn the names of Allah, practice gratitude (shukr), give regular charity, recite Quran daily, and build connections within your Muslim community. Peace builds gradually through consistent practice." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Healing Sessions" },
      { href: "/duas", label: "Duas Library" },
      { href: "/99-names", label: "99 Names of Allah" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/islamic-routine-for-peace", label: "Islamic Morning Routine for Peace" },
      { href: "/daily-muslim-routine", label: "Daily Muslim Routine" },
      { href: "/dhikr-daily-habit", label: "Making Dhikr a Daily Habit" },
    ],
    breadcrumbs: [
      { name: "Home", item: "/" },
      { name: "How Islam Brings Peace" },
    ],
  }));
});

// ─── Page 4: Tahajjud for Anxiety ────────────────────────────────────────
router.get("/tahajjud-for-anxiety", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/tahajjud-for-anxiety",
    date: "2026-01-18",
    title: "Tahajjud Prayer for Anxiety, How It Helps & When to Pray",
    desc: "How Tahajjud prayer helps with anxiety and worry. When to pray it, what to recite, and the hadith evidence for night prayer as a cure for distress.",
    h1: "Tahajjud for Anxiety, The Night Prayer That Transforms Worry",
    aiSummary: "Tahajjud (voluntary night prayer) is one of Islam's most powerful tools for anxiety. Prayed in the last third of the night, it connects you to Allah at His closest moment to creation. The Prophet ﷺ said: 'Our Lord descends every night to the lowest heaven and says: Who will call on Me? I will answer.' Start with 2 rakaats.",
    intro: "There is something profound about waking in the deep silence before dawn to pray while the rest of the world sleeps. Tahajjud is not just an act of worship, it is a direct audience with Allah at the hour He described as His most intimate approach to His creation. For those carrying anxiety, this time is transformative.",
    mainHtml: `
<h2>Why the Last Third of the Night?</h2>
<p style="color:#a0c8a0;line-height:1.8">The hadith in Bukhari and Muslim describes Allah descending in a manner befitting His majesty to the lowest heaven in the last third of every night, calling out for those who seek His help, forgiveness, and guidance. For the person carrying anxiety, this is the optimal time to lay their worries directly before Allah.</p>
<h2>What to Recite During Tahajjud for Anxiety</h2>
<p style="color:#a0c8a0;line-height:1.8">After your 2-8 rakaats, dedicate time in sujood (prostration) for personal dua. The Prophet ﷺ said sujood is the closest position to Allah. Pour out your worries in your own language, Allah understands all languages. Then recite the specific dua for distress.</p>`,
    steps: [
      { title: "Sleep early", desc: "To wake for Tahajjud, sleep by 10–10:30pm if Fajr is around 5am." },
      { title: "Set your intention before sleep", desc: "Say: 'I intend to wake for Tahajjud for the sake of Allah' before closing your eyes." },
      { title: "Set an alarm for the last third", desc: "Calculate the last third of your night and set an alarm 15 minutes before Fajr begins." },
      { title: "Make Wudu mindfully", desc: "The cold water and the act of purification itself prepares the heart for conversation with Allah." },
      { title: "Pray minimum 2 rakaats", desc: "Don't let perfectionism prevent you from starting. Even 2 rakaats is transformative." },
      { title: "Make a long dua in sujood", desc: "In your final prostration, speak to Allah about your anxiety in your own words." },
    ],
    quranRefs: [
      { arabic: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ", trans: "Wa minal-layli fatahajjad bihi nafilatan lak", ref: "And during the night, wake for prayer as an additional offering, Quran 17:79" },
      { arabic: "تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ", trans: "Tatajafa junoobuhum 'anil-madaji'", ref: "Their sides forsake their beds to supplicate their Lord in fear and hope, Quran 32:16" },
    ],
    relatedDuas: [
      { href: "/duas/before-sleeping", label: "Sleeping Duas" },
      { href: "/duas/anxiety", label: "Anxiety Duas" },
      { href: "/duas/morning-supplication", label: "Morning Duas" },
    ],
    faqs: [
      { q: "Does Tahajjud help with anxiety?", a: "Yes. Tahajjud helps anxiety through several mechanisms: it gives a dedicated time for dua (asking Allah directly), it creates a regular rhythm of deep rest followed by purposeful wakefulness, it builds tawakkul through direct reliance on Allah, and the peace of the pre-dawn hours calms the nervous system." },
      { q: "How many rakaats is Tahajjud?", a: "There is no fixed maximum. The minimum is 2 rakaats. The Prophet ﷺ typically prayed 8-13 rakaats. Start with 2, add more as your consistency builds." },
      { q: "What time is Tahajjud?", a: "Tahajjud is prayed after Isha and before Fajr, with the optimal time being the last third of the night. Calculate this by dividing the time between Maghrib and Fajr into thirds, the final third is when Allah's closeness is described in the hadith." },
      { q: "Can I pray Tahajjud every night?", a: "Yes. The Prophet ﷺ rarely missed it. He said: 'The best prayer after the obligatory prayers is the night prayer (Tahajjud)' (Muslim). It becomes increasingly easy as your body adjusts to the rhythm." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Tahajjud Session in App" },
      { href: "/prayer-times", label: "Check Fajr Time" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-wake-up-for-fajr", label: "How to Wake Up for Fajr" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/how-islam-brings-peace", label: "How Islam Brings Inner Peace" },
    ],
    breadcrumbs: [
      { name: "Home", item: "/" },
      { name: "Tahajjud for Anxiety" },
    ],
  }));
});

// ─── Page 5: Islamic Routine for Peace ────────────────────────────────────
router.get("/islamic-routine-for-peace", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/islamic-routine-for-peace",
    date: "2026-01-20",
    title: "Islamic Morning Routine for Peace, Step-by-Step Muslim Morning",
    desc: "The complete Islamic morning routine for inner peace and productivity. From Fajr to Sunnah Azkar to breakfast, a Prophet-inspired routine for modern Muslims.",
    h1: "Islamic Morning Routine for Peace, Start Every Day with Allah",
    aiSummary: "An Islamic morning routine for peace begins with Tahajjud or Fajr prayer, followed by morning Azkar (33 SubhanAllah, 33 Alhamdulillah, 34 Allahu Akbar), Quran recitation, mindful breakfast with dua, and setting a daily intention (niyyah). This routine, based on the Prophet's Sunnah, creates a framework of peace before the day's demands arrive.",
    intro: "The Prophet ﷺ was asked about the most beloved deeds to Allah. He said: 'Those done consistently, even if small.' The Islamic morning routine isn't about doing everything perfectly, it's about beginning every day in a state of connection to Allah. That connection becomes the foundation of everything else.",
    mainHtml: `
<h2>Why Morning Routines Work in Islam</h2>
<p style="color:#a0c8a0;line-height:1.8">The Quran and Hadith are filled with references to the blessed nature of the morning hours. The Prophet ﷺ made dua: 'O Allah, bless my ummah in their early mornings.' Science confirms this, cortisol (the alertness hormone) peaks in the morning, making early habits more likely to stick. Islam leveraged this 1,400 years ago.</p>`,
    steps: [
      { title: "Fajr on time", desc: "Wake with the Adhan or alarm. Pray Fajr as soon as its time begins, this is the anchor of the whole routine." },
      { title: "Morning Azkar (10–15 min)", desc: "Recite the authenticated morning supplications from Hisnul Muslim, SubhanAllah, Alhamdulillah, Allahu Akbar each 33 times." },
      { title: "Read Quran (5–15 min)", desc: "Even half a page with understanding carries immense barakah in your day." },
      { title: "Mindful breakfast", desc: "Eat slowly, say Bismillah, and eat the Sunnah foods, dates, honey, water with the right hand." },
      { title: "Set your daily niyyah", desc: "Verbally declare your intention for the day: 'Today I will... for the sake of Allah.'" },
      { title: "Avoid phone for first 30 min", desc: "Let your first interaction be with Allah, not a notification feed." },
    ],
    quranRefs: [
      { arabic: "إِنَّ صَلَاةَ الْفَجْرِ كَانَتْ مَشْهُودَةً", trans: "Inna salatal-fajri kanat mashooda", ref: "Indeed, the dawn prayer is witnessed by the angels, Quran 17:78" },
    ],
    relatedDuas: [
      { href: "/duas/morning-supplication", label: "Morning Azkar" },
      { href: "/duas/daily-life", label: "Daily Life Duas" },
    ],
    faqs: [
      { q: "What is the Sunnah morning routine?", a: "The Prophet ﷺ would wake for Tahajjud, pray Fajr, recite morning Azkar, read Quran until sunrise, pray 2 rakaats of Ishraq after sunrise, and then engage in his daily work. This is the ideal template." },
      { q: "How long should an Islamic morning routine take?", a: "Even 20-30 minutes creates a meaningful Islamic morning routine. Fajr (10 min) + Azkar (10 min) + 5 min Quran = 25 minutes of morning peace before the day begins." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Morning Azkar Session" },
      { href: "/prayer-times", label: "Fajr Prayer Times" },
      { href: "/tasbih", label: "Digital Tasbih" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/morning-routine-muslim", label: "Muslim Morning Routine Guide" },
      { href: "/daily-muslim-routine", label: "Complete Daily Muslim Routine" },
      { href: "/dhikr-daily-habit", label: "Making Dhikr a Daily Habit" },
    ],
    breadcrumbs: [
      { name: "Home", item: "/" },
      { name: "Islamic Routine for Peace" },
    ],
  }));
});

// ─── Page 6: Dua for Overthinking ─────────────────────────────────────────
router.get("/dua-for-overthinking", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/dua-for-overthinking",
    date: "2026-01-22",
    title: "Dua for Overthinking, Islamic Cure for Intrusive Thoughts",
    desc: "The best Islamic duas for overthinking, intrusive thoughts, and mental rumination. Arabic text, transliteration, and hadith source for each.",
    h1: "Dua for Overthinking, Stop the Mental Loop with Allah's Words",
    aiSummary: "For overthinking, Islam recommends seeking refuge in Allah from Shaytan: 'A'udhu billahi minash-shaytanir-rajim', followed by the dua for worry. Also effective: Ayatul Kursi (2:255) which establishes Allah's complete control over all things, a powerful counter to the illusion that your thinking controls outcomes.",
    intro: "Overthinking is the mind's attempt to control outcomes that belong only to Allah. Every loop of 'what if' is, at its root, a failure of tawakkul. Islam doesn't shame you for this tendency; it gives you specific tools to interrupt the loop and hand control back to the One who actually holds it.",
    mainHtml: `
<h2>The Islamic Understanding of Overthinking</h2>
<p style="color:#a0c8a0;line-height:1.8">The Prophet ﷺ described Shaytan's whispering (waswasa) as one of the primary causes of mental disturbance in believers. When thoughts spiral out of control, the Sunnah response is to seek immediate refuge in Allah from Shaytan, then redirect the mind to dhikr. This breaks the neurological loop.</p>`,
    steps: [
      { title: "Recognize the loop", desc: "When you notice you're thinking in circles, name it: 'This is waswasa, it's not solving anything.'" },
      { title: "Say A'udhu billah", desc: "Immediately: 'A'udhu billahi minash-shaytanir-rajim', this disrupts the mental pattern." },
      { title: "Recite Ayatul Kursi", desc: "Its meaning, that Allah holds everything, is the perfect antidote to the illusion that you must figure everything out." },
      { title: "Do physical dhikr", desc: "Use a tasbih or the MyTazki counter. The physical action grounds you out of your head." },
      { title: "Make a decision and do tawakkul", desc: "Overthinking often masks a decision that needs to be made. Make your best decision, then say: 'I trust Allah with the outcome.'" },
    ],
    quranRefs: [
      { arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", trans: "Allahu la ilaha illa huwal-hayyul-qayyoom", ref: "Allah, there is no deity except Him, the Ever-Living, the Sustainer, Ayatul Kursi, Quran 2:255" },
    ],
    relatedDuas: [
      { href: "/duas/anxiety", label: "Anxiety Duas" },
      { href: "/duas/protection", label: "Protection Duas" },
    ],
    faqs: [
      { q: "What is the Islamic cure for overthinking?", a: "Islam addresses overthinking through seeking refuge from Shaytan (A'udhu billah), dhikr (especially Ayatul Kursi), tawakkul (trust in Allah's plan), and salah (which provides structured breaks in thought). Regular practice builds mental resilience." },
      { q: "Is overthinking a sin in Islam?", a: "Overthinking itself is not a sin, it's a common human experience. However, letting it prevent trust in Allah (tawakkul) or lead to excessive worry without action is discouraged. Islam encourages taking practical steps and then releasing the outcome to Allah." },
    ],
    internalLinks: [
      { href: "/tasbih", label: "Digital Tasbih" },
      { href: "/sessions", label: "Healing Session: Overthinking" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/how-islam-brings-peace", label: "How Islam Brings Peace" },
      { href: "/quran-verses-about-stress", label: "Quran Verses for Stress" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Dua for Overthinking" }],
  }));
});

// ─── Page 7: Quran for Depression ─────────────────────────────────────────
router.get("/quran-for-depression", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/quran-for-depression",
    date: "2026-01-24",
    title: "Quran for Depression, Verses of Hope for Dark Times",
    desc: "Quran verses for depression, hopelessness, and dark times. Allah's words of hope, comfort, and reassurance for Muslims going through difficult emotional periods.",
    h1: "Quran for Depression, Allah's Words for Your Darkest Days",
    aiSummary: "The Quran directly addresses feelings of depression and hopelessness. Surah Ad-Duha was revealed when the Prophet ﷺ felt abandoned, Allah's response was: 'Your Lord has not forsaken you.' Key verses include 93:3-5, 94:5-6, and 39:53. These are Allah's direct words to a grieving heart.",
    intro: "Depression is not a sign of weak faith. Many prophets experienced profound grief, Yaqub (AS) wept until he lost his sight over the loss of Yusuf. Allah did not criticize his grief; He sent his son back to him. Allah honors our pain by addressing it in His book directly.",
    mainHtml: `
<h2>Islam's Approach to Depression</h2>
<p style="color:#a0c8a0;line-height:1.8">Islamic scholars distinguish between grief (huzn), which is normal, and despair (qunoot), which is prohibited. Depression is not despair; it is a medical and spiritual condition that requires both professional support and spiritual nourishment. The Quran provides the latter with extraordinary tenderness.</p>
<h2>Surah Ad-Duha, Allah's Response to Grief</h2>
<p style="color:#a0c8a0;line-height:1.8">When revelation paused for a period, the Prophet ﷺ felt such profound distress that some accounts suggest he feared he had been abandoned. Allah's response was Surah Ad-Duha, one of the most personally tender passages in the entire Quran. If you are in a dark place, read it slowly, knowing it was sent for moments exactly like yours.</p>`,
    steps: [
      { title: "Read Surah Ad-Duha daily", desc: "Read it slowly with the meaning. Allah is speaking to you directly in verse 3: 'Your Lord has not abandoned you.'" },
      { title: "Seek professional help too", desc: "Islam does not oppose therapy, seeking it is Sunnah (taking the means, tawakkul for the outcome)." },
      { title: "Tell someone you trust", desc: "The Prophet ﷺ said: 'The believer is the mirror of the believer.' Share your state with a trusted Muslim." },
      { title: "Maintain minimal salah", desc: "Even if you can only pray sitting, pray. Connection with Allah is the thread of hope." },
      { title: "Avoid isolation", desc: "The Prophet ﷺ said: 'The wolf eats the stray sheep.' Stay connected to your community." },
    ],
    quranRefs: [
      { arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", trans: "Ma wadda'aka rabbuka wa ma qala", ref: "Your Lord has not abandoned you, nor has He become resentful, Quran 93:3" },
      { arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", trans: "La taqnatu min rahmatillah", ref: "Do not despair of the mercy of Allah, Quran 39:53" },
    ],
    relatedDuas: [
      { href: "/duas/hardship", label: "Dua for Hardship" },
      { href: "/duas/anxiety", label: "Dua for Anxiety" },
    ],
    faqs: [
      { q: "What does Islam say about depression?", a: "Islam acknowledges grief (huzn) as a natural human emotion. Allah forbids only complete despair of His mercy. Depression is a medical condition, Islam encourages seeking both spiritual and professional treatment, viewing them as complementary." },
      { q: "Which surah helps with depression?", a: "Surah Ad-Duha (93), Surah Al-Inshirah (94), Surah Yusuf (12), which tells the story of hope through impossibility, and Surah Al-Baqarah 2:155-157 are most recommended for depression and grief." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Healing Sessions" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/quran", label: "Quran Reader" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-duha-reflection", label: "Surah Ad-Duha Reflection" },
      { href: "/how-islam-brings-peace", label: "How Islam Brings Peace" },
      { href: "/dua-for-hardship", label: "Dua for Hardship" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran for Depression" }],
  }));
});

// ─── Page 8: How to Connect with Allah ────────────────────────────────────
router.get("/how-to-connect-with-allah", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/how-to-connect-with-allah",
    date: "2026-01-26",
    title: "How to Reconnect with Allah, 8 Steps for Spiritual Distance",
    desc: "Feeling spiritually distant from Allah? 8 practical Islamic steps to reconnect, from sincere tawbah to Tahajjud to Quran reflection. For Muslims feeling disconnected.",
    h1: "How to Reconnect with Allah, 8 Steps When Faith Feels Distant",
    aiSummary: "To reconnect with Allah: start with sincere tawbah (repentance) even for feeling distant, re-establish salah before other practices, open the Quran to Surah Ad-Duha or Surah Al-Baqarah, make personal dua in your own language, and reduce distractions. Spiritual distance almost always comes from reduced salah and increased screen time, address both simultaneously.",
    intro: "Every Muslim knows this feeling: the prayers feel rote, the Quran doesn't move you, dhikr feels mechanical. This spiritual distance isn't a sign that Allah has moved, it's a sign that something in your life is blocking the connection. And the distance itself is a mercy, because the discomfort of it is pushing you back.",
    mainHtml: `
<h2>Why Spiritual Distance Happens</h2>
<p style="color:#a0c8a0;line-height:1.8">Scholars identify the main causes of spiritual distance as: habitual sin that isn't repented, excessive entertainment and distraction, neglect of salah (especially in congregation), isolation from the Muslim community, and emotional busyness that leaves no quiet for Allah. The good news: all of these are reversible.</p>`,
    steps: [
      { title: "Make sincere tawbah", desc: "Even if you're not sure what caused the distance, repent. Tawbah wipes the slate and opens the door." },
      { title: "Return to salah first", desc: "Before trying to 'feel' anything, re-establish consistent salah. Feelings follow action in Islam." },
      { title: "Open Surah Ad-Duha", desc: "Read it slowly with its meaning. Allah is speaking to you directly about distance and return." },
      { title: "Make a personal dua", desc: "Speak to Allah in your own language about exactly how you feel. He understands all languages and all hearts." },
      { title: "Reduce your distractions by 30%", desc: "Cut screen time by one third for one week. The quiet you create is where Allah speaks." },
      { title: "Do one act of charity", desc: "Sadqa purifies and resets. Even something small creates spiritual momentum." },
      { title: "Attend a halaqa or Jumu'ah", desc: "Community Iman and shared worship rekindles individual faith." },
      { title: "Use MyTazki's healing sessions", desc: "The app's guided spiritual sessions are designed specifically for reconnection periods." },
    ],
    quranRefs: [
      { arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", trans: "Wa idha sa'alaka 'ibadi 'anni fa inni qareeb", ref: "And when My servants ask you about Me, indeed I am near, Quran 2:186" },
    ],
    relatedDuas: [
      { href: "/duas/forgiveness", label: "Dua for Forgiveness" },
      { href: "/duas/morning-supplication", label: "Morning Duas" },
    ],
    faqs: [
      { q: "Why do I feel disconnected from Allah?", a: "Spiritual disconnection usually results from reduced salah, habitual sins (even small ones), excessive entertainment, or emotional overwhelm. It's a very common experience for Muslims, even the companions described periods of weak iman. The solution is to return to basic practices consistently." },
      { q: "How can I feel close to Allah again?", a: "The fastest path back is: sincere tawbah, consistent salah (even if it feels mechanical), reading Quran with meaning, long personal dua in your own language, and avoiding the habits that created distance. Consistency in small acts matters more than dramatic gestures." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Reconnection Sessions" },
      { href: "/duas", label: "Duas Library" },
      { href: "/journal", label: "Spiritual Journal" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-islam-brings-peace", label: "How Islam Brings Peace" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/islamic-self-improvement", label: "Islamic Self Improvement" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "How to Connect with Allah" }],
  }));
});

// ─── Page 9: Surah for Peace ───────────────────────────────────────────────
router.get("/surah-for-peace", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/surah-for-peace",
    date: "2026-01-28",
    title: "Which Surah Brings Peace of Mind?, Top 5 Surahs for Calm",
    desc: "The 5 surahs that bring the most peace and calm according to scholars and Muslims worldwide. With their Arabic text, meaning, and when to recite them.",
    h1: "Which Surah Brings Peace of Mind?, 5 Surahs for Inner Calm",
    aiSummary: "The surahs most recommended for peace of mind are: Surah Ad-Duha (93) for feelings of abandonment, Surah Al-Inshirah (94) for overwhelm, Surah Al-Mulk (67) for protection and comfort before sleep, Surah Ar-Rahman (55) for gratitude and perspective, and Surah Al-Fatiha repeated for any need. Each addresses a different emotional state.",
    intro: "Not every surah feels the same when you need peace. The Quran is a living guidance, different parts speak to different emotional states. Here are the five surahs that Muslims across centuries have returned to when they needed their hearts to settle.",
    mainHtml: `
<h2>1. Surah Ad-Duha, For When You Feel Abandoned</h2>
<p style="color:#a0c8a0;line-height:1.8">Allah's direct address to a grieving Prophet makes this surah uniquely comforting for anyone who feels forgotten. 'Your Lord has not forsaken you' is one of the most direct statements of divine loyalty in the entire Quran.</p>
<h2>2. Surah Al-Inshirah, For Overwhelm</h2>
<p style="color:#a0c8a0;line-height:1.8">Revealed immediately after Ad-Duha, this short surah contains the extraordinary promise stated TWICE: 'With every hardship comes ease.' Scholars note the repetition is intentional, Allah wanted us to hear it twice.</p>
<h2>3. Surah Al-Mulk, For Night Peace</h2>
<p style="color:#a0c8a0;line-height:1.8">The Prophet ﷺ said whoever recites Surah Al-Mulk every night will be protected in the grave. Beyond its protective quality, its themes of Allah's absolute sovereignty produce profound peace of mind.</p>`,
    steps: [
      { title: "Morning: Read Ad-Duha", desc: "Set the tone for the day with Allah's reassurance." },
      { title: "Evening: Read Al-Inshirah", desc: "Remind yourself of the certainty of ease after difficulty." },
      { title: "Night: Read Al-Mulk", desc: "End the day under Allah's protection and sovereignty." },
      { title: "When stressed: Read Al-Fatiha 7 times", desc: "Scholars have recommended this for a settled heart in moments of acute distress." },
      { title: "Use MyTazki's Quran reader", desc: "Read with translation so the meaning penetrates, not just the sounds." },
    ],
    quranRefs: [
      { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا", trans: "Fa inna ma'al-'usri yusraa. Inna ma'al-'usri yusraa", ref: "For indeed, with hardship will be ease. Indeed, with hardship will be ease, Quran 94:5-6" },
    ],
    relatedDuas: [{ href: "/duas/anxiety", label: "Anxiety Duas" }],
    faqs: [
      { q: "Which surah is best for anxiety?", a: "Surah Ad-Duha (93) is most recommended for feelings of abandonment and sadness. Surah Al-Inshirah (94) for overwhelm. Surah Al-Baqarah for general protection. Ayatul Kursi for immediate calm. Al-Ikhlas, Al-Falaq, An-Nas three times each morning and evening for daily protection." },
      { q: "Can I listen to Quran for peace without understanding Arabic?", a: "Yes. Studies show that Quranic recitation reduces cortisol and stress markers even in non-Arabic speakers. The sounds themselves have a physiological calming effect. However, learning the meaning multiplies the spiritual benefit significantly." },
    ],
    internalLinks: [
      { href: "/quran", label: "Quran Reader" },
      { href: "/sessions", label: "Guided Quran Sessions" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-mulk-reflection", label: "Surah Al-Mulk Reflection" },
      { href: "/surah-duha-reflection", label: "Surah Ad-Duha Reflection" },
      { href: "/quran-verses-about-stress", label: "Quran Verses About Stress" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Surah for Peace" }],
  }));
});

// ─── Page 10: Dua for Hardship ─────────────────────────────────────────────
router.get("/dua-for-hardship", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(emotionPage({
    slug: "/dua-for-hardship",
    date: "2026-01-30",
    title: "Dua for Hardship, Islamic Prayers for Difficult Times",
    desc: "The most powerful duas for hardship, trials, and difficult times from the Quran and authentic Hadith. Arabic text, meaning, and guidance on when to recite.",
    h1: "Dua for Hardship, When Life Is Hard, Here's What to Say",
    aiSummary: "The most powerful dua for hardship is: 'Inna lillahi wa inna ilayhi raji'un' (We belong to Allah and to Him we shall return, 2:156). For ongoing difficulty, the Prophet's dua: 'Hasbunallah wa ni'mal wakeel' (Allah is sufficient for us and the best Disposer of affairs). Both were used by prophets in their most difficult moments.",
    intro: "Every prophet faced hardship. Ibrahim (AS) was thrown into fire. Yusuf (AS) was imprisoned unjustly. Musa (AS) fled his homeland. Rasulullah ﷺ lost his wife, his uncle, his children. Islam does not promise an easy life, it promises that hardship has purpose, and that Allah never abandons those who call on Him.",
    mainHtml: `
<h2>Hardship in Islamic Understanding</h2>
<p style="color:#a0c8a0;line-height:1.8">The Quran tells us that hardship is not punishment by default, it is often a sign of Allah's love and a vehicle for spiritual elevation. The Prophet ﷺ said: 'The greatest reward is with the greatest trial. When Allah loves a people He tests them.' This does not minimize the pain, it gives it meaning.</p>`,
    steps: [
      { title: "Say Inna lillahi first", desc: "'Inna lillahi wa inna ilayhi raji'un', acknowledge everything belongs to Allah and will return to Him." },
      { title: "Don't suppress the emotion", desc: "Cry if you need to. The Prophet ﷺ wept. Emotional expression is not weakness in Islam." },
      { title: "Recite Hasbunallah", desc: "'Hasbunallah wa ni'mal wakeel', the dua Ibrahim (AS) said when thrown into fire." },
      { title: "Maintain your salah", desc: "Even when everything hurts. Especially when everything hurts." },
      { title: "Make specific dua about your situation", desc: "Allah invites specific requests. Tell Him exactly what you need." },
    ],
    quranRefs: [
      { arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", trans: "Inna lillahi wa inna ilayhi raji'oon", ref: "Indeed, to Allah we belong and to Him we shall return, Quran 2:156" },
      { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", trans: "Hasbunallahu wa ni'mal wakeel", ref: "Allah is sufficient for us, and He is the Best Disposer of affairs, Quran 3:173" },
    ],
    relatedDuas: [
      { href: "/duas/hardship", label: "Hardship Duas" },
      { href: "/duas/anxiety", label: "Anxiety Duas" },
      { href: "/duas/forgiveness", label: "Forgiveness Duas" },
    ],
    faqs: [
      { q: "What dua do you say when going through hardship?", a: "'Inna lillahi wa inna ilayhi raji'un' (2:156) acknowledges Allah's ownership of all things. 'Hasbunallahu wa ni'mal wakeel' (3:173) declares full reliance on Allah. 'Allahumma inni a'udhu bika minal-hammi wal-hazan' is the comprehensive dua for all types of distress." },
      { q: "How does Islam deal with hardship?", a: "Islam frames hardship as a test, a purification, or a path to higher spiritual rank. The correct response is: patience (sabr), gratitude for remaining blessings, seeking Allah's help through salah and dua, taking practical action, and trust in Allah's plan (tawakkul). Despair is prohibited; grief is allowed." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Healing Sessions" },
      { href: "/duas", label: "Duas Library" },
      { href: "/how-islam-brings-peace", label: "How Islam Brings Peace" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/quran-for-depression", label: "Quran for Depression" },
      { href: "/how-to-connect-with-allah", label: "How to Reconnect with Allah" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Dua for Hardship" }],
  }));
});

export default router;
