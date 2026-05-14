import { Router } from "express";
import { seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc, howToSchema } from "./shared.js";
import { geoBlock } from "./geo-content.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function articleSchema(title: string, desc: string, slug: string, date: string): object {
  return { "@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "author": { "@type": "Organization", "name": "MyTazki" }, "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" }, "datePublished": date, "dateModified": TODAY, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` } };
}
function speakableSchema(slug: string): object {
  return { "@context": "https://schema.org", "@type": "WebPage", "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ai-summary", "h1"] }, "url": `https://mytazki.com${slug}` };
}

function habitPage(opts: {
  title: string; desc: string; slug: string; h1: string; date: string;
  aiSummary: string; intro: string; mainHtml: string;
  steps: Array<{ title: string; desc: string }>;
  quranRef: { arabic: string; trans: string; ref: string };
  faqs: Array<{ q: string; a: string }>;
  internalLinks: Array<{ href: string; label: string }>;
  relatedArticles: Array<{ href: string; label: string }>;
  breadcrumbs: Array<{ name: string; item?: string }>;
}): string {
  const head = seoHead({ title: opts.title, description: opts.desc, canonical: opts.slug, schema: [articleSchema(opts.title, opts.desc, opts.slug, opts.date), speakableSchema(opts.slug), faqSchema(opts.faqs), breadcrumbSchema(opts.breadcrumbs), howToSchema(opts.h1, opts.desc, opts.steps.map(s => ({ name: s.title, text: s.desc })))] });
  const body = `
${breadcrumb(opts.breadcrumbs)}
<h1>${esc(opts.h1)}</h1>
<div class="ai-summary" style="background:rgba(52,201,122,0.07);border-left:4px solid #34c97a;border-radius:0 10px 10px 0;padding:16px 20px;margin:20px 0;font-size:15px;line-height:1.7;color:#eaf4ee">
<strong style="color:#34c97a">Quick Answer:</strong> ${opts.aiSummary}
</div>
<p style="font-size:16px;line-height:1.8;color:#a0c8a0;margin-bottom:20px">${opts.intro}</p>
${opts.mainHtml}
<h2>Step-by-Step Guide</h2>
<ol style="padding-left:20px;line-height:2">
${opts.steps.map(s => `<li style="margin-bottom:10px"><strong style="color:#eaf4ee">${esc(s.title)}</strong>, <span style="color:#a0c8a0">${esc(s.desc)}</span></li>`).join("\n")}
</ol>
<h2>Quranic Foundation</h2>
<div style="background:rgba(52,201,122,0.05);border-radius:12px;padding:20px;margin:16px 0;border:1px solid rgba(52,201,122,0.12)">
<p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.5em;line-height:2;margin:0 0 10px">${opts.quranRef.arabic}</p>
<p style="color:#34c97a;font-style:italic;margin:0 0 6px;font-size:14px">${esc(opts.quranRef.trans)}</p>
<p style="color:#6a9878;font-size:13px;margin:0">${esc(opts.quranRef.ref)}</p>
</div>
${geoBlock('habits')}
${faqHtml(opts.faqs)}
<h2>Build This Habit with MyTazki</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0">
${opts.internalLinks.map(l => `<a href="${l.href}" class="card" style="text-decoration:none;color:#eaf4ee;display:block;padding:14px;border-radius:10px"><strong style="color:#34c97a;font-size:14px">${esc(l.label)}</strong></a>`).join("")}
</div>
<h2>Related Guides</h2>
<div style="display:flex;flex-direction:column;gap:10px;margin:12px 0 24px">
${opts.relatedArticles.map(a => `<a href="${a.href}" style="color:#34c97a;text-decoration:none;font-size:15px">→ ${esc(a.label)}</a>`).join("")}
</div>
${ctaBlock()}
`;
  return page(head, body);
}

router.get("/daily-muslim-routine", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(habitPage({
    slug: "/daily-muslim-routine", date: "2026-03-10",
    title: "Daily Muslim Routine, The Prophet's Schedule for Modern Life",
    desc: "A complete daily Muslim routine based on the Prophet's Sunnah, from Fajr to Isha, with Islamic habits for work, family, and spiritual growth.",
    h1: "Daily Muslim Routine, Sunnah Schedule for the Modern Muslim",
    aiSummary: "A complete daily Muslim routine: Fajr + morning Azkar → Quran recitation → breakfast with dua → Dhuha prayer → work/study with Bismillah → Dhuhr prayer in congregation → Asr on time → evening Azkar → Maghrib → family time → Isha → Surah Al-Mulk + sleep duas → Tahajjud (if possible). This structure, based on the Prophet's Sunnah, creates a life of purpose and barakah.",
    intro: "The Prophet ﷺ didn't just tell us what to believe, He showed us how to live. From how He slept (on the right side) to how He ate (with the right hand) to how He interacted with his family (with kindness and humor), the Sunnah is a complete lifestyle template. This guide extracts a practical daily schedule from it.",
    mainHtml: `<h2>The Prophet's Daily Schedule (Simplified)</h2>
<p style="color:#a0c8a0;line-height:1.8"><strong style="color:#eaf4ee">Pre-Fajr:</strong> Tahajjud prayer in the last third of night. <strong style="color:#eaf4ee">Fajr:</strong> Prayer + morning Azkar + Quran until sunrise. <strong style="color:#eaf4ee">Dhuha:</strong> 2-8 rakaats after sunrise. <strong style="color:#eaf4ee">Work hours:</strong> Productive engagement with the world. <strong style="color:#eaf4ee">Dhuhr:</strong> Prayer (ideally in congregation). <strong style="color:#eaf4ee">Asr:</strong> On time, the Prophet ﷺ warned about missing it. <strong style="color:#eaf4ee">Maghrib:</strong> Quick, on time, with family. <strong style="color:#eaf4ee">Isha:</strong> The last prayer. <strong style="color:#eaf4ee">Sleep:</strong> With specific duas, on right side, facing Qibla.</p>
<h2>How to Adapt for a Busy Modern Schedule</h2>
<p style="color:#a0c8a0;line-height:1.8">Most Muslims can't replicate the Prophet's schedule perfectly, and that's okay. The goal is the structure, not the exact timing. Block your 5 prayer times as non-negotiable calendar events. Schedule your morning Azkar as a 10-minute habit after Fajr. Set an evening reminder for Asr. These three anchor points hold the day together.</p>`,
    steps: [
      { title: "Fajr as anchor (non-negotiable)", desc: "The day begins with Fajr. If you get this right, everything else flows from it." },
      { title: "Morning Azkar (10 min)", desc: "Before your phone, before email, before news, 10 minutes with Allah." },
      { title: "Quran (5-15 min)", desc: "Even half a page with understanding. This is the minimum daily Quran habit." },
      { title: "5 prayer blocks", desc: "Calendar block all 5 prayers. Non-negotiable. Everything else adjusts around them." },
      { title: "Evening Azkar before Maghrib", desc: "The 10-minute evening Azkar protects the second half of your day." },
      { title: "Sleep Sunnah", desc: "Right side, facing Qibla, with sleep duas. Set Tahajjud alarm if possible." },
    ],
    quranRef: { arabic: "وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا", trans: "Wa sabbih bihamdi rabbika qabla tulu'ish-shamsi wa qabla ghuroobiha", ref: "And glorify the praise of your Lord before the rising of the sun and before its setting, Quran 20:130" },
    faqs: [
      { q: "What does a Muslim daily routine look like?", a: "A Muslim daily routine is structured around 5 daily prayers: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), Isha (night). Between prayers: morning Azkar, Quran, work, family time, evening Azkar, sleep Sunnah. The Prophet's Sunnah provides specific practices for each segment." },
      { q: "How do I maintain a Muslim routine while working?", a: "The key is treating prayer times as calendar events, not interruptions. Many workplaces accommodate prayer breaks. Use Dhuhr lunch prayer for congregation when possible. Keep Asr and Maghrib strict. Many Muslims find a prayer-structured day actually improves productivity by providing regular reset points." },
    ],
    internalLinks: [
      { href: "/prayer-times", label: "Today's Prayer Times" },
      { href: "/sessions", label: "Morning Azkar Session" },
      { href: "/growth", label: "Habit & Growth Tracker" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/morning-routine-muslim", label: "Muslim Morning Routine" },
      { href: "/islamic-night-routine", label: "Islamic Night Routine" },
      { href: "/islamic-habit-tracker", label: "Islamic Habit Tracker" },
      { href: "/muslim-productivity-habits", label: "Muslim Productivity Habits" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Daily Muslim Routine" }],
  }));
});

router.get("/islamic-habit-tracker", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(habitPage({
    slug: "/islamic-habit-tracker", date: "2026-03-12",
    title: "Islamic Habit Tracker, Track Your Spiritual Habits Daily",
    desc: "How to track Islamic habits like salah, Quran, dhikr, sadqa, and fasting using an Islamic habit tracker. The habits to track, why consistency matters, and free tools.",
    h1: "Islamic Habit Tracker, Build Consistent Spiritual Habits",
    aiSummary: "The most impactful Islamic habits to track daily: 5 daily prayers (on time), morning & evening Azkar, Quran recitation (any amount), dhikr target (100+ daily), sadqa (even a smile counts), and one Sunnah act. Track these using MyTazki's built-in streak tracker, visual streaks create powerful accountability. The Prophet ﷺ said: the most beloved deeds to Allah are those done consistently.",
    intro: "Habit tracking is an ancient Islamic concept, the Prophet ﷺ said: 'The most beloved of deeds to Allah are those that are most consistent, even if they are few.' Before the era of apps, scholars kept physical journals to track their prayers, dhikr counts, and Quran progress. The principle is Sunnah; the digital tools simply make it easier.",
    mainHtml: `<h2>Why Islamic Habit Tracking Works</h2>
<p style="color:#a0c8a0;line-height:1.8">Habit science shows that visual tracking (seeing your streak) activates loss aversion, you don't want to break the chain. For Islamic habits, this psychological principle aligns with the spiritual concept of consistency (mudawama). Combined, they create a powerful system for building lasting worship habits.</p>
<h2>The 6 Core Islamic Habits to Track</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0">
${[["🕌","5 Daily Prayers","Track each salah separately"],["📖","Quran Recitation","Even one page counts"],["📿","Daily Dhikr","100+ count target"],["🤲","Morning Azkar","Before phone, after Fajr"],["💚","Sadqa","Any act of charity"],["🌙","Night Routine","Sleep Sunnah completion"]].map(([icon, title, desc]) => `<div class="card"><p style="font-size:1.5rem;margin:0 0 6px">${icon}</p><p style="color:#34c97a;font-size:13px;font-weight:600;margin:0 0 4px">${esc(title)}</p><p style="color:#6a9878;font-size:12px;margin:0">${esc(desc)}</p></div>`).join("")}
</div>`,
    steps: [
      { title: "Choose your core 5 habits", desc: "Don't track everything at once. Start with the 5 most important to you right now." },
      { title: "Use MyTazki's tracker", desc: "Open the Growth section, built-in streak tracking for prayers, Quran, and dhikr." },
      { title: "Track at the same time daily", desc: "Review your habits at the same time each day (many prefer right after Isha)." },
      { title: "Don't break the chain", desc: "Once you have a 7-day streak, the psychological pull to maintain it is strong." },
      { title: "Review weekly", desc: "Every Friday, review your week. Which habits were you most consistent with? Which need attention?" },
      { title: "Adjust monthly", desc: "After 30 days, review and either level up (add a habit) or deepen (increase quality)." },
    ],
    quranRef: { arabic: "وَاعْبُدْ رَبَّكَ حَتَّىٰ يَأْتِيَكَ الْيَقِينُ", trans: "Wa'bud rabbaka hatta ya'tiyakal-yaqeen", ref: "And worship your Lord until certainty (death) comes to you, Quran 15:99" },
    faqs: [
      { q: "What Islamic habits should I track?", a: "Priority order: 5 daily prayers (on time), morning & evening Azkar, daily Quran recitation, dhikr count (SubhanAllah, Alhamdulillah, Allahu Akbar), regular sadqa, and avoiding major sins. Build these in order, don't try to track everything at once." },
      { q: "How long does it take to build an Islamic habit?", a: "The Prophet ﷺ's hadith about consistency suggests a principle: daily repetition matters more than duration. Research suggests 21-66 days for habits of varying complexity. For salah, many Muslims find 40 consecutive days creates a deeply ingrained habit." },
    ],
    internalLinks: [
      { href: "/growth", label: "MyTazki Growth Tracker" },
      { href: "/tasbih", label: "Digital Tasbih Counter" },
      { href: "/sessions", label: "Guided Sessions" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/daily-muslim-routine", label: "Daily Muslim Routine" },
      { href: "/dhikr-daily-habit", label: "Making Dhikr a Daily Habit" },
      { href: "/quran-daily-habit", label: "Reading Quran Every Day" },
      { href: "/muslim-productivity-habits", label: "Muslim Productivity Habits" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Islamic Habit Tracker" }],
  }));
});

router.get("/muslim-productivity-habits", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(habitPage({
    slug: "/muslim-productivity-habits", date: "2026-03-14",
    title: "Muslim Productivity Habits, Islam's Blueprint for High Performance",
    desc: "The Islamic habits that drive productivity, from Fajr advantage to barakah in time to intention-setting. How the Sunnah creates a high-performance Muslim lifestyle.",
    h1: "Muslim Productivity Habits, How Islam Optimizes Your Time",
    aiSummary: "Islam's top productivity habits: Fajr advantage (early risers capture the most blessed hours, the Prophet ﷺ made dua for barakah in the ummah's early mornings), setting clear niyyah (intention shapes outcome), Bismillah before every task (activates mindfulness), structured prayer breaks (prevent burnout), avoiding israf (waste), and Barakah mindset (quality over quantity).",
    intro: "The Prophet ﷺ made dua: 'O Allah, bless my ummah in their early mornings.' This was a dua for productivity. Islam has always understood that barakah, divine blessing in time and effort, is the multiplier that transforms ordinary work into extraordinary impact. The Muslim who understands barakah thinks differently about time.",
    mainHtml: `<h2>The Islamic Productivity Framework</h2>
<p style="color:#a0c8a0;line-height:1.8">Islamic productivity isn't about doing more, it's about barakah: divine blessing that makes what you do more impactful. Two people can work the same hours; the one with barakah produces more meaningful results. Barakah comes from: beginning with Bismillah, working in the early morning, maintaining salah, giving sadqa, and maintaining family ties (silat-ar-rahm).</p>`,
    steps: [
      { title: "Fajr advantage", desc: "Be active by 6am. The Prophet's dua for barakah in early mornings is your productivity advantage." },
      { title: "Niyyah before every task", desc: "Set a clear intention: 'I am doing this task for the sake of Allah and to benefit [specific person/goal].' This transforms work into worship." },
      { title: "Bismillah at every start", desc: "Beginning with Allah's name is Sunnah AND a mindfulness technique that activates focus." },
      { title: "Prayer breaks as reset points", desc: "5 scheduled breaks per day that force you to step away from work = built-in anti-burnout system." },
      { title: "Avoid israf (waste)", desc: "Time is amanah (trust). Guard it from excessive social media, idle talk, and entertainment beyond reasonable relaxation." },
      { title: "Thursday night planning", desc: "The Prophet ﷺ began his week on Friday. Plan your week Thursday night, set niyyah for each day's major goal." },
    ],
    quranRef: { arabic: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", trans: "Wal-'asr. Innal-insana lafi khusr", ref: "By time, indeed, mankind is in loss, Quran 103:1-2. The entire surah is a reminder that time is the universal currency: those who use it for faith, righteous deeds, and mutual encouragement are the exception." },
    faqs: [
      { q: "What does Islam say about productivity?", a: "Islam views time as an amanah (trust from Allah). Surah Al-Asr (103) frames all of human history as a race against time loss. The productive Muslim: begins early (Fajr), works with niyyah (intention), takes prayer breaks, avoids waste (israf), and seeks barakah through halal means and consistent worship." },
      { q: "What is barakah in productivity?", a: "Barakah is divine blessing that multiplies the value of your time and effort. It is obtained through: starting tasks with Bismillah, maintaining salah, giving sadqa, maintaining family ties, avoiding haram, and having a sincere niyyah. With barakah, 4 hours produces more than 8 hours without it." },
    ],
    internalLinks: [
      { href: "/daily-muslim-routine", label: "Daily Muslim Routine" },
      { href: "/morning-routine-muslim", label: "Muslim Morning Routine" },
      { href: "/growth", label: "Growth Tracker" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/daily-muslim-routine", label: "Daily Muslim Routine" },
      { href: "/islamic-habit-tracker", label: "Islamic Habit Tracker" },
      { href: "/morning-routine-muslim", label: "Muslim Morning Routine" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Muslim Productivity Habits" }],
  }));
});

router.get("/morning-routine-muslim", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(habitPage({
    slug: "/morning-routine-muslim", date: "2026-03-16",
    title: "Muslim Morning Routine, Complete Fajr to 9am Islamic Schedule",
    desc: "Complete Muslim morning routine from Fajr to 9am. The Islamic practices, Sunnah acts, and mindset habits that create a powerful, blessed morning for modern Muslims.",
    h1: "Muslim Morning Routine, From Fajr to 9am, Step by Step",
    aiSummary: "The ideal Muslim morning routine: Tahajjud (optional) → Fajr prayer → Morning Azkar (10 min) → Quran recitation (5-15 min) → Ishraq prayer (15 min after sunrise) → mindful breakfast with dua → journal or niyyah setting → begin work. This Sunnah-based sequence takes 60-90 minutes and produces measurable barakah in the rest of the day.",
    intro: "The morning hours are the most blessed time of the day, and most people waste them on their phones. The Islamic morning routine reclaims these hours for Allah, for spiritual nourishment, and for intentional preparation. Muslims who maintain this routine consistently report that their entire day feels qualitatively different.",
    mainHtml: `<h2>Why Morning Routines Transform Lives</h2>
<p style="color:#a0c8a0;line-height:1.8">Cortisol (the alertness hormone) peaks in the first 30-90 minutes after waking. This is when the brain forms its strongest habits and memories. What you do in this window shapes the trajectory of the entire day. The Islamic morning routine, Fajr, Azkar, Quran, fills this peak window with spiritual nourishment before the demands of the day crowd in.</p>`,
    steps: [
      { title: "Fajr prayer (dawn)", desc: "The anchor of the Muslim morning. If you get Fajr right, you get the morning right." },
      { title: "Morning Azkar (10 min)", desc: "The 7 core morning supplications from Hisnul Muslim. Recite before any screen time." },
      { title: "Quran (5-15 min)", desc: "Even 5 minutes with meaning. Daily Quran contact is the foundation of Islamic knowledge." },
      { title: "Ishraq prayer (optional)", desc: "2-4 rakaats after sunrise (15-20 min after). The Prophet ﷺ said the reward is like Hajj and Umrah." },
      { title: "Mindful breakfast", desc: "Bismillah + eat with right hand + eat slowly + stop before full. All Sunnah, all effective." },
      { title: "Set your day's niyyah", desc: "2 minutes: 'Today I intend to [specific goal] for the sake of Allah.' Write it down." },
    ],
    quranRef: { arabic: "وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ", trans: "Wa aqimis-salata tarafayin-nahar", ref: "And establish prayer at the two ends of the day, Quran 11:114. The two ends are Fajr (dawn) and Maghrib (sunset), the bookends of the Islamic day." },
    faqs: [
      { q: "What should a Muslim do in the morning?", a: "The Sunnah morning sequence: wake early (before Fajr if possible), make Wudu, pray Fajr, recite morning Azkar, read Quran, pray Ishraq (optional), eat breakfast with bismillah, and set your daily intention before beginning work or study." },
      { q: "How long should a Muslim morning routine take?", a: "A minimal Muslim morning routine (Fajr + Azkar + 5 min Quran) takes 25-30 minutes. A full routine with Ishraq prayer takes 60-90 minutes. Even the minimal version transforms the quality of the entire day." },
    ],
    internalLinks: [
      { href: "/prayer-times", label: "Fajr Times for Your City" },
      { href: "/sessions", label: "Morning Session in App" },
      { href: "/tasbih", label: "Morning Dhikr Counter" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/daily-muslim-routine", label: "Full Daily Muslim Routine" },
      { href: "/islamic-routine-for-peace", label: "Islamic Routine for Peace" },
      { href: "/how-to-wake-up-for-fajr", label: "How to Wake Up for Fajr" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Muslim Morning Routine" }],
  }));
});

router.get("/islamic-night-routine", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(habitPage({
    slug: "/islamic-night-routine", date: "2026-03-18",
    title: "Islamic Night Routine, From Maghrib to Sleep Sunnah",
    desc: "The complete Islamic night routine from Maghrib prayer to sleep. Evening Azkar, Quran, family time, Isha, Tahajjud prep, and Sunnah sleep practices.",
    h1: "Islamic Night Routine, The Sunnah from Maghrib to Sleep",
    aiSummary: "The Islamic night routine: Maghrib prayer → evening Azkar (10 min) → family time/dinner → Isha prayer → Surah Al-Mulk + Al-Sajdah → sleep duas → right side position → Tahajjud alarm set. Key: no screens 30 min before sleep, make Wudu before sleeping, recite Ayatul Kursi. This Sunnah sequence creates deep, restorative sleep and sets up Fajr success.",
    intro: "The Prophet ﷺ used to discourage long conversations after Isha, not because talking is wrong, but because the night has a sacred rhythm. Maghrib is the transition point: the day of work ends, and the evening of family, worship, and rest begins. The Islamic night routine honors this rhythm.",
    mainHtml: `<h2>Why the Night Routine Determines the Morning</h2>
<p style="color:#a0c8a0;line-height:1.8">Sleep quality, wake time, and Fajr consistency are all determined the night before. The Islamic night routine is not just a bedtime ritual, it's the system that ensures tomorrow's Fajr. When you sleep with proper duas, on the right side, with Tahajjud intention, you are setting up the next morning's spiritual success.</p>`,
    steps: [
      { title: "Maghrib: family time begins", desc: "After Maghrib is family time. Eat together. Connect. This is Sunnah and science-backed for wellbeing." },
      { title: "Evening Azkar after Maghrib (10 min)", desc: "The evening Azkar from Hisnul Muslim. Protects you through the night spiritually." },
      { title: "Isha prayer on time", desc: "The Prophet ﷺ said: 'If they knew the reward of Isha and Fajr, they would come crawling.'" },
      { title: "Read Surah Al-Mulk", desc: "The Prophet ﷺ never slept without it. 30 verses that intercede in the grave." },
      { title: "Sleep duas", desc: "Allahuma bismika amootu wa ahya + Ayatul Kursi + 3 Quls. Under 3 minutes. Life-changing habit." },
      { title: "Right side, facing Qibla", desc: "Sunnah sleeping position, also scientifically shown to improve digestion and heart function." },
    ],
    quranRef: { arabic: "وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا", trans: "Wa ja'alna nawmakum subata", ref: "And We made your sleep a cessation (of consciousness), Quran 78:9. Sleep is described as a mercy, a designed reset that Allah gave as a gift." },
    faqs: [
      { q: "What are the Sunnah practices before sleeping?", a: "Sunnah sleep practices: perform Wudu, recite Ayatul Kursi, recite Surah Al-Ikhlas, Al-Falaq, An-Nas (three times each blown on hands, wiped over body), recite 'Allahuma bismika amootu wa ahya,' sleep on right side, facing Qibla, and make intention to wake for Tahajjud." },
      { q: "Should I pray Witr before or after Tahajjud?", a: "If you are confident you will wake for Tahajjud, delay Witr until after it. If unsure, pray Witr before sleeping. The Prophet ﷺ said: 'Make Witr your last prayer of the night', so if you wake for Tahajjud, pray Witr after it." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Sleep Sessions" },
      { href: "/duas/before-sleeping", label: "Sleep Duas" },
      { href: "/tahajjud-for-anxiety", label: "Tahajjud Prayer" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/morning-routine-muslim", label: "Muslim Morning Routine" },
      { href: "/daily-muslim-routine", label: "Complete Daily Routine" },
      { href: "/how-to-wake-up-for-fajr", label: "How to Wake Up for Fajr" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Islamic Night Routine" }],
  }));
});

router.get("/dhikr-daily-habit", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(habitPage({
    slug: "/dhikr-daily-habit", date: "2026-03-20",
    title: "Making Dhikr a Daily Habit, 100 Daily Dhikr Practice Guide",
    desc: "How to make dhikr a daily habit. The 100-daily-dhikr practice, best times to do dhikr, and how to use a tasbih or app to track your remembrance of Allah.",
    h1: "Making Dhikr a Daily Habit, The 100-Count Practice",
    aiSummary: "The Prophet ﷺ recommended: SubhanAllah 33 times, Alhamdulillah 33 times, Allahu Akbar 34 times after each prayer (= 500/day). Additional: 100 Astaghfirullah daily and 100 Salawat. Making dhikr a habit: use a tasbih or MyTazki's counter, pick one consistent time (after Fajr works best), start with just SubhanAllah 33x. The Prophet ﷺ said: 'Keep your tongue moist with dhikr.'",
    intro: "The Prophet ﷺ said: 'Shall I not tell you about the best of your deeds, the most pleasing to your Lord, the most elevating of you in rank, better than spending gold and silver in charity, and better than meeting your enemy and striking at their necks?' The companions asked: 'What is it?' He said: 'The remembrance of Allah.'",
    mainHtml: `<h2>The Science of Dhikr</h2>
<p style="color:#a0c8a0;line-height:1.8">Repetitive dhikr creates neurological grooves, the same mechanism as meditation. fMRI studies show that repetitive meaningful vocalization activates the prefrontal cortex (rational decision-making), deactivates the amygdala (anxiety center), and induces theta brainwaves associated with deep calm. This is why the Quran says 'in the remembrance of Allah hearts find rest', it's neurologically true.</p>
<h2>The Daily Dhikr Targets</h2>
<div style="background:rgba(52,201,122,0.05);border-radius:10px;padding:16px;margin:16px 0;border:1px solid rgba(52,201,122,0.12)">
${[["SubhanAllah","Glory be to Allah","33x after each prayer = 165/day"],["Alhamdulillah","All praise is for Allah","33x after each prayer = 165/day"],["Allahu Akbar","Allah is the Greatest","34x after each prayer = 170/day"],["Astaghfirullah","I seek Allah's forgiveness","100x daily minimum"],["Salawat on the Prophet","Peace be upon him","100x, returns 1000x"],].map(([a, m, n]) => `<div style="border-bottom:1px solid rgba(52,201,122,0.08);padding:10px 0;display:flex;justify-content:space-between;align-items:center"><div><p style="color:#34c97a;font-weight:600;margin:0;font-size:14px">${esc(a)}</p><p style="color:#6a9878;font-size:12px;margin:0">${esc(m)}</p></div><span style="color:#b8946a;font-size:12px;font-family:Inter,sans-serif">${esc(n)}</span></div>`).join("")}
</div>`,
    steps: [
      { title: "Start with post-prayer tasbih", desc: "After every salah: SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34. This is the minimum and it's powerful." },
      { title: "Use a tasbih or MyTazki counter", desc: "Physical counting keeps you accountable. The MyTazki tasbih vibrates at completion milestones." },
      { title: "Add 100 Astaghfirullah daily", desc: "The Prophet ﷺ sought forgiveness 70-100 times daily. This practice keeps the heart soft." },
      { title: "Dhikr during commute", desc: "Driving, walking, cooking, make these times of dhikr. No special posture required." },
      { title: "Track with MyTazki streaks", desc: "Set a daily dhikr target in the app and track your consistency." },
    ],
    quranRef: { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا", trans: "Ya ayyuhal-ladhina amanu udhkurullaha dhikran katheera", ref: "O you who believe, remember Allah with much remembrance, Quran 33:41" },
    faqs: [
      { q: "What is the best dhikr to say daily?", a: "The most recommended daily dhikr: SubhanAllah (33x after each prayer), Alhamdulillah (33x), Allahu Akbar (34x), Astaghfirullah (100x daily), and Salawat (100x daily). La ilaha illallah is the most superior dhikr (hadith). Ayatul Kursi morning and evening for protection." },
      { q: "How do I make dhikr a habit?", a: "Stack dhikr onto existing habits: after salah (natural trigger), during commute, during exercise, cooking, or walking. Use a physical tasbih or MyTazki's digital counter. Start small (just post-prayer tasbih) and build. The habit compounds, what starts as intentional becomes automatic within weeks." },
    ],
    internalLinks: [
      { href: "/tasbih", label: "Digital Tasbih Counter" },
      { href: "/sessions", label: "Dhikr Sessions" },
      { href: "/99-names", label: "99 Names for Dhikr" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/islamic-habit-tracker", label: "Islamic Habit Tracker" },
      { href: "/morning-routine-muslim", label: "Muslim Morning Routine" },
      { href: "/how-islam-brings-peace", label: "How Islam Brings Peace" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Dhikr Daily Habit" }],
  }));
});

router.get("/quran-daily-habit", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(habitPage({
    slug: "/quran-daily-habit", date: "2026-03-22",
    title: "Reading Quran Every Day, Build a Daily Quran Habit",
    desc: "How to build a daily Quran reading habit. How much to read, when to read, how to maintain consistency, and the Islamic importance of daily Quran contact.",
    h1: "Reading Quran Every Day, The Daily Quran Habit Guide",
    aiSummary: "To build a daily Quran habit: start with just 5 minutes after Fajr (even half a page), read with meaning (not just Arabic), track your streak, pick the same time and location daily, and use MyTazki's Quran reader for convenience. The Prophet ﷺ compared the Muslim who doesn't recite Quran to a withered plant. Daily contact with the Quran, even small amounts, is transformative.",
    intro: "The Quran is the direct word of Allah. Every letter carries reward. Every time you open it with intention, something shifts. The challenge isn't motivation, it's consistency. This guide provides the specific system for making Quran reading a non-negotiable daily habit, not a sporadic spiritual aspiration.",
    mainHtml: `<h2>How Much Quran Should I Read Daily?</h2>
<p style="color:#a0c8a0;line-height:1.8">There is no minimum, any amount with presence is valuable. Practical targets: Beginner: 5 minutes or half a page daily. Intermediate: 1 page (10 min) or 1 ruku (paragraph). Advanced: 1 juz per day (to complete the Quran in 30 days). The key: consistency over quantity. Half a page daily for a year is 182 pages, more than most sporadic readers.</p>`,
    steps: [
      { title: "Pick your time", desc: "After Fajr is the most consistent time for most Muslims. The Quran of Fajr is described as 'witnessed' (17:78)." },
      { title: "Start with 5 minutes", desc: "Commit to 5 minutes minimum. On most days you'll go longer, but 5 minutes is unbreakable." },
      { title: "Read with meaning", desc: "Even one verse with understanding is more valuable than 10 pages without. Use MyTazki's Quran with translation." },
      { title: "Track your juz progress", desc: "Know which juz you're on. Seeing progress through the Quran is motivating." },
      { title: "Don't break the chain", desc: "If you miss a day, catch up the next day (read double). Don't let one miss become two." },
    ],
    quranRef: { arabic: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا", trans: "Wa rattilil-Qurana tartilaa", ref: "And recite the Quran with measured recitation, Quran 73:4. 'Tartil' means slow, measured, deliberate recitation with presence, not speed." },
    faqs: [
      { q: "How much Quran should I read per day?", a: "There is no Islamic minimum for daily recitation, but scholars recommend completing the Quran at least once every month (1 juz/day) for those who can. For beginners: 1-5 minutes daily is a legitimate starting point. Consistency matters infinitely more than quantity." },
      { q: "What is the best time to read Quran?", a: "The Prophet ﷺ said Fajr Quran is 'witnessed' (by angels). After Fajr is the most recommended time. Other good times: after Asr, after Maghrib, and before sleep. The 'best time' is the time you will actually be consistent with." },
    ],
    internalLinks: [
      { href: "/quran", label: "MyTazki Quran Reader" },
      { href: "/sessions", label: "Quran Guided Sessions" },
      { href: "/growth", label: "Track Your Progress" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/islamic-habit-tracker", label: "Islamic Habit Tracker" },
      { href: "/morning-routine-muslim", label: "Muslim Morning Routine" },
      { href: "/dhikr-daily-habit", label: "Making Dhikr a Daily Habit" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Daily Quran Habit" }],
  }));
});

router.get("/islamic-self-improvement", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(habitPage({
    slug: "/islamic-self-improvement", date: "2026-03-24",
    title: "Islamic Self Improvement, Tazkiyah, the Muslim Growth Path",
    desc: "The Islamic path of self improvement (Tazkiyah, spiritual purification). How to grow as a Muslim, the key areas of Islamic self development, and practical steps.",
    h1: "Islamic Self Improvement, The Path of Tazkiyah",
    aiSummary: "Islamic self improvement is called Tazkiyah (تَزكِيَة), spiritual purification and growth. It operates on four levels: purifying the heart (from arrogance, envy, miserliness), disciplining the nafs (lower self), developing character (akhlaq), and increasing in knowledge and worship. MyTazki is named after this concept, daily spiritual growth through guided practice.",
    intro: "The word 'Tazkiyah' (from which MyTazki is named) means purification and growth. The Quran mentions it repeatedly as one of the central purposes of the Prophet ﷺ's mission. This is not generic self-help, it is a specific spiritual technology developed by Islamic scholars over 1,400 years of lived practice.",
    mainHtml: `<h2>What is Tazkiyah?</h2>
<p style="color:#a0c8a0;line-height:1.8">Tazkiyah is the process of purifying the soul from negative spiritual qualities (kibr/arrogance, hasad/envy, bukhl/miserliness, hubb ad-dunya/love of the world) and cultivating positive ones (tawadu'/humility, shukr/gratitude, tawakkul/trust, zuhd/detachment from worldly excess). It is Islam's comprehensive self-improvement framework, the original personal development system.</p>
<h2>The Four Stages of Tazkiyah</h2>
<p style="color:#a0c8a0;line-height:1.8"><strong style="color:#eaf4ee">1. Muhasaba (Self-Audit):</strong> Regular honest assessment of your spiritual state. <strong style="color:#eaf4ee">2. Tawbah (Repentance):</strong> Consistent return to Allah from every shortcoming. <strong style="color:#eaf4ee">3. Muraqabah (Mindfulness of Allah):</strong> Living with the awareness that Allah sees everything. <strong style="color:#eaf4ee">4. Musharatah (Commitment):</strong> Setting specific spiritual goals and holding yourself accountable.</p>`,
    steps: [
      { title: "Daily muhasaba (self-audit)", desc: "Each night before sleep: 3 things I'm grateful for, 1 shortcoming to work on tomorrow, 1 good deed done today." },
      { title: "Weekly character review", desc: "Every Friday: which character trait needs most attention this week? Arrogance? Impatience? Choose one to work on." },
      { title: "Find a spiritual mentor", desc: "Scholars recommend a teacher who can help you identify your dominant spiritual disease. Community is essential to Tazkiyah." },
      { title: "Read about Islamic character", desc: "Works by Imam Al-Ghazali (Ihya Ulum ad-Din) and Ibn Al-Qayyim are the classics of Islamic self-improvement." },
      { title: "Use MyTazki's journey tools", desc: "The app's growth tracker, journal, and guided sessions are built for exactly this daily spiritual development." },
    ],
    quranRef: { arabic: "قَدْ أَفْلَحَ مَن زَكَّاهَا ۝ وَقَدْ خَابَ مَن دَسَّاهَا", trans: "Qad aflaha man zakkaha. Wa qad khaba man dassaha", ref: "He has succeeded who purifies it (the soul). And he has failed who corrupts it, Quran 91:9-10" },
    faqs: [
      { q: "What is Tazkiyah in Islam?", a: "Tazkiyah (تَزكِيَة) is the Islamic concept of soul purification and spiritual growth. It involves purifying the heart from negative traits (arrogance, envy, excessive worldly love), developing positive qualities (gratitude, patience, trust in Allah), and consistently working to align one's character with prophetic standards." },
      { q: "How do Muslims improve themselves spiritually?", a: "Through: daily muhasaba (self-accounting), consistent tawbah (repentance), maintaining salah with khushoo, reading the Quran with reflection, increasing voluntary worship, serving others, reducing attachment to dunya, seeking Islamic knowledge, and finding a spiritual community or mentor." },
    ],
    internalLinks: [
      { href: "/growth", label: "Growth Journey in MyTazki" },
      { href: "/journal", label: "Spiritual Journal" },
      { href: "/sessions", label: "Guided Sessions" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/daily-muslim-routine", label: "Daily Muslim Routine" },
      { href: "/islamic-habit-tracker", label: "Islamic Habit Tracker" },
      { href: "/how-to-connect-with-allah", label: "Reconnect with Allah" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Islamic Self Improvement" }],
  }));
});

export default router;
