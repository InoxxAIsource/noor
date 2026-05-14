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

function salahPage(opts: {
  title: string; desc: string; slug: string; h1: string; date: string;
  aiSummary: string; intro: string; mainHtml: string;
  steps: Array<{ title: string; desc: string }>;
  quranRefs: Array<{ arabic: string; trans: string; ref: string }>;
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
<h2>Quran & Hadith</h2>
${opts.quranRefs.map(r => `<div style="background:rgba(52,201,122,0.05);border-radius:10px;padding:16px 20px;margin:14px 0;border:1px solid rgba(52,201,122,0.12)"><p class="arabic" style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.5em;line-height:2;margin:0 0 8px">${r.arabic}</p><p style="color:#34c97a;font-style:italic;margin:0 0 6px;font-size:14px">${esc(r.trans)}</p><p style="color:#6a9878;font-size:13px;margin:0">${esc(r.ref)}</p></div>`).join("")}
${geoBlock('salah')}
${faqHtml(opts.faqs)}
<h2>Continue Your Journey</h2>
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

router.get("/how-to-stop-missing-salah", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(salahPage({
    slug: "/how-to-stop-missing-salah", date: "2026-02-01",
    title: "How to Stop Missing Salah, 7 Practical Islamic Strategies",
    desc: "Practical strategies to stop missing salah and build a consistent prayer habit. Islamic guidance, habit science, and daily routines that work for busy Muslims.",
    h1: "How to Stop Missing Salah, 7 Strategies That Actually Work",
    aiSummary: "To stop missing salah: set 5 daily alarms aligned with prayer times, pray immediately when the time enters (don't delay), tell someone who will hold you accountable, reduce your decision points (lay out your prayer mat at night), understand WHY salah matters, and use MyTazki to track your streak. Consistency beats perfection.",
    intro: "Salah is the pillar of the deen, the Prophet ﷺ said: 'The covenant between us and them (the disbelievers) is salah. Whoever abandons it has committed kufr.' Most Muslims who miss salah don't reject it, they're just overwhelmed by life. Here's the honest, judgment-free guide to building consistency.",
    mainHtml: `<h2>Why Muslims Miss Salah (Honestly)</h2>
<p style="color:#a0c8a0;line-height:1.8">Research and pastoral experience identify the same root causes: lack of a structured routine, shame after missing (which creates avoidance), not knowing prayer times for the current location, social environments that don't support prayer breaks, and the gradual erosion of the habit over time. Every single one of these has a solution.</p>
<h2>The Habit Science Behind Consistent Salah</h2>
<p style="color:#a0c8a0;line-height:1.8">Habit science shows that behaviors triggered by environmental cues are most consistent. The Adhan is the ultimate cue, pray the moment you hear it. The prayer mat visible in your room is a cue. Your MyTazki alarm is a cue. Stack as many cues as possible, and salah becomes automatic.</p>`,
    steps: [
      { title: "Set 5 daily alarms", desc: "Use MyTazki's prayer times for your exact city. Set alarms with a 5-minute buffer before each prayer." },
      { title: "Pray immediately", desc: "Do not delay salah once the time enters. Delay is the #1 cause of missed prayers." },
      { title: "Keep your prayer mat visible", desc: "Environmental cues are powerful. A visible mat = a constant reminder." },
      { title: "Find an accountability partner", desc: "Ask a friend to check in with you daily about your prayers. Accountability doubles consistency." },
      { title: "Track your streak", desc: "Use MyTazki's streak tracker. The visual streak motivates you not to break the chain." },
      { title: "Make tawbah without shame", desc: "When you miss, repent, pray qada if needed, and continue. Self-shame makes it worse, not better." },
      { title: "Connect prayer to meaning", desc: "Remind yourself before each prayer: this is 5 minutes with the Creator of everything." },
    ],
    quranRefs: [
      { arabic: "أَقِمِ الصَّلَاةَ لِذِكْرِي", trans: "Aqimis-salata lidhikri", ref: "Establish prayer for My remembrance, Quran 20:14" },
      { arabic: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا", trans: "Innas-salata kanat 'alal-mu'mineena kitaban mawqoota", ref: "Indeed, salah is an obligation on believers at prescribed times, Quran 4:103" },
    ],
    faqs: [
      { q: "Is it a major sin to miss salah?", a: "Yes. Missing salah intentionally without a valid reason is considered a major sin in Islam. Most schools of jurisprudence (madhabs) treat it very seriously. However, Allah is Most Merciful, making tawbah and returning to prayer is always accepted." },
      { q: "What to do if I've missed many prayers?", a: "Make sincere tawbah, resolve to pray going forward, and consult a scholar about whether and how to make up (qada) missed prayers. Different madhabs have different rulings on qada for deliberately missed prayers." },
      { q: "How do I make salah a habit?", a: "Use habit stacking: attach salah to existing habits (after eating, after showering). Use reminders (Adhan app, MyTazki alarms). Start with the easiest prayer to maintain (many find Fajr the hardest, start with Zuhr if needed) and build from there." },
    ],
    internalLinks: [
      { href: "/prayer-times", label: "Prayer Times for Your City" },
      { href: "/salah-guide", label: "Complete Salah Guide" },
      { href: "/growth", label: "Growth Tracker" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-focus-in-salah", label: "How to Focus in Salah (Khushoo)" },
      { href: "/how-to-wake-up-for-fajr", label: "How to Wake Up for Fajr" },
      { href: "/how-to-make-salah-habit", label: "Making Salah a Daily Habit" },
      { href: "/why-salah-is-important", label: "Why Salah is Important" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "How to Stop Missing Salah" }],
  }));
});

router.get("/how-to-focus-in-salah", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(salahPage({
    slug: "/how-to-focus-in-salah", date: "2026-02-03",
    title: "How to Focus in Salah, 8 Ways to Achieve Khushoo",
    desc: "How to focus in salah and achieve khushoo (heart-presence). 8 practical methods from Islamic scholars, for beginners and those who have prayed for years.",
    h1: "How to Focus in Salah, Achieving Khushoo Step by Step",
    aiSummary: "Khushoo (focus in salah) is achieved by: understanding the Arabic you recite (learn meaning of Surah Al-Fatiha first), praying as if it's your last prayer, lowering your gaze to the point of sujood, slowing your movements, pausing between postures, and praying in a quiet space. Start by deeply understanding just one surah.",
    intro: "The Prophet ﷺ said: 'A person finishes the prayer while only a tenth or a half or a third of the reward is written for him.' Khushoo is not an all-or-nothing experience, it's a spectrum. Even brief moments of true presence are precious. And the good news: khushoo is a skill that can be developed with specific practices.",
    mainHtml: `<h2>What is Khushoo?</h2>
<p style="color:#a0c8a0;line-height:1.8">Khushoo (خشوع) means heart-presence, humility, and focus in salah. It refers to the state where your entire being, body, mind, and heart, is engaged with what you are doing and saying. Ibn al-Qayyim described it as 'the soul of salah without which the prayer is a body without a spirit.'</p>
<h2>Why We Lose Focus in Salah</h2>
<p style="color:#a0c8a0;line-height:1.8">The main causes of lost focus: praying on autopilot without understanding the words, rushing through the prayer, entering salah while stressed or distracted, not preparing the environment, and Shaytan's whispering (waswasa). Each has a specific Islamic counter.</p>`,
    steps: [
      { title: "Learn the meaning of what you recite", desc: "Start with Surah Al-Fatiha. If you understand 'It is You alone we worship and You alone we ask for help', that alone transforms the prayer." },
      { title: "Pray as if it's your last prayer", desc: "The Prophet ﷺ said: 'Pray as if you're saying farewell.' This mindset shift immediately increases presence." },
      { title: "Take 60 seconds to prepare", desc: "Stand before the prayer mat in silence. Breathe. Say your intention. Then enter salah prepared." },
      { title: "Lower your gaze to sujood spot", desc: "Looking at the floor throughout salah reduces visual distraction." },
      { title: "Slow down every movement", desc: "Deliberate slowness creates deliberate presence. Each position is a conversation with Allah." },
      { title: "Pause between postures", desc: "The 'brief pause' between rukoo and sujood is Sunnah, use it to re-center your heart." },
      { title: "Pray in a clean, quiet space", desc: "Remove visual clutter. If possible, designate one spot in your home as your prayer corner." },
      { title: "Vary your Quran recitation", desc: "Reciting the same surahs every prayer leads to autopilot. Learn 3 new surahs this month." },
    ],
    quranRefs: [
      { arabic: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۝ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ", trans: "Qad aflaha al-mu'minoona. Alladhina hum fi salatihim khashi'oon", ref: "Successful indeed are the believers, those who are humbly focused in their prayer, Quran 23:1-2" },
    ],
    faqs: [
      { q: "What is khushoo in salah?", a: "Khushoo means heart-presence, focus, and humility in salah. It includes your heart being present to Allah's greatness, your mind engaged with the meaning of what you recite, and your body still and composed in each posture." },
      { q: "Is salah valid without khushoo?", a: "Yes, the prayer counts even without perfect focus, according to most scholars. However, the spiritual reward is proportional to the presence of heart. The goal is to continually improve khushoo, not to invalidate prayers because of scattered thoughts." },
      { q: "How do I stop my mind from wandering in salah?", a: "The most effective method: understand the meaning of what you're reciting. When you know that 'Iyyaka na'budu wa iyyaka nasta'een' means 'It is You alone we worship and You alone we ask for help', your mind has meaning to hold, not just sounds." },
    ],
    internalLinks: [
      { href: "/salah-guide", label: "Salah Guide" },
      { href: "/sessions", label: "Salah Session in App" },
      { href: "/how-to-stop-missing-salah", label: "Stop Missing Salah" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah" },
      { href: "/why-salah-is-important", label: "Why Salah is Important" },
      { href: "/salah-benefits", label: "Benefits of Salah" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "How to Focus in Salah" }],
  }));
});

router.get("/how-to-wake-up-for-fajr", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(salahPage({
    slug: "/how-to-wake-up-for-fajr", date: "2026-02-05",
    title: "How to Wake Up for Fajr, 7 Methods That Work",
    desc: "How to wake up for Fajr prayer consistently. 7 practical methods including Islamic sleep Sunnah, alarm strategies, accountability, and sleep hygiene for Muslims.",
    h1: "How to Wake Up for Fajr, 7 Methods That Actually Work",
    aiSummary: "To wake up for Fajr consistently: sleep earlier (by 10pm), make Wudu before sleep, ask Allah in your dua to wake you, set two alarms (one at Tahajjud time, one 5 minutes before Fajr), keep your phone across the room, recite Ayatul Kursi before sleeping, and sleep on your right side as Sunnah. The niyyah before sleep is powerful.",
    intro: "Fajr is the prayer of champions, the Prophet ﷺ said: 'Whoever prays Fajr is under the protection of Allah.' For many Muslims, Fajr is the hardest prayer. But it's also the one with the greatest transformation potential, catching the pre-dawn hours changes the entire quality of your day.",
    mainHtml: `<h2>Why Fajr is Hard (and Why It's Worth It)</h2>
<p style="color:#a0c8a0;line-height:1.8">Fajr is hard because it conflicts with the body's natural sleep cycle (REM sleep typically peaks in the early morning hours). But the Prophet's Sunnah around sleep, early sleeping, right side, specific duas, actually aligns with modern sleep hygiene better than most people realize. The key is restructuring your evening, not just forcing yourself to wake up.</p>`,
    steps: [
      { title: "Sleep by 10–10:30pm", desc: "This is the single most impactful change. 7 hours from 10pm wakes you at 5am naturally." },
      { title: "Make Wudu before sleeping", desc: "This is Sunnah AND it creates a lighter sleep state with greater alertness on waking." },
      { title: "Recite Ayatul Kursi before sleep", desc: "The Prophet ﷺ said an angel protects you when you recite it, also builds the habit of remembering Allah at sleep." },
      { title: "Set 2 alarms", desc: "One alarm at Tahajjud (30 min before Fajr). One alarm at Fajr. The first waking is the hardest, the second is easy." },
      { title: "Make your niyyah before sleep", desc: "Say: 'O Allah, wake me for Fajr.' This isn't superstition, it's tawakkul combined with preparation." },
      { title: "Put phone across the room", desc: "Forces you to physically stand up to turn off the alarm, which breaks the sleep inertia." },
      { title: "Have cold water ready", desc: "Drinking cold water immediately on waking activates wakefulness faster than any alarm sound." },
    ],
    quranRefs: [
      { arabic: "وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا", trans: "Wa qur'anal-fajri inna qur'anal-fajri kana mashooda", ref: "And the Quran of Fajr, indeed, the Fajr recitation is witnessed by angels, Quran 17:78" },
    ],
    faqs: [
      { q: "How do I wake up for Fajr if I can't sleep early?", a: "Start by moving your sleep time 15 minutes earlier every few days. Within 2 weeks you can shift your sleep time by 1-2 hours without disruption. Simultaneously, reduce evening screen time after Isha." },
      { q: "Is it better to sleep less and pray Fajr or sleep more and miss it?", a: "Scholars overwhelmingly recommend praying Fajr even on little sleep. The barakah (blessing) in the day that follows a Fajr-started morning often compensates for the reduced sleep in productivity and energy." },
    ],
    internalLinks: [
      { href: "/prayer-times", label: "Fajr Times for Your City" },
      { href: "/how-to-stop-missing-salah", label: "Stop Missing Salah" },
      { href: "/tahajjud-for-anxiety", label: "Tahajjud Prayer" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah" },
      { href: "/morning-routine-muslim", label: "Muslim Morning Routine" },
      { href: "/islamic-routine-for-peace", label: "Islamic Routine for Peace" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "How to Wake Up for Fajr" }],
  }));
});

router.get("/why-salah-is-important", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(salahPage({
    slug: "/why-salah-is-important", date: "2026-02-07",
    title: "Why is Salah Important in Islam?, The Complete Answer",
    desc: "Why salah (prayer) is the most important obligation in Islam after Shahada. Its spiritual, psychological, and social benefits, and what the Quran and Hadith say.",
    h1: "Why Salah is Important, The Complete Islamic Answer",
    aiSummary: "Salah is the first thing accounted for on the Day of Judgment. It is the direct connection between a Muslim and Allah, five times daily, regardless of mood or circumstance. The Prophet ﷺ called it the 'pillar of the religion.' It also provides psychological benefits: routine, mindfulness, physical movement, community, and a daily reset.",
    intro: "If you have ever wondered 'why five times a day, every day?', you are asking the right question. The answer is not simply 'because Allah commanded it' (though that alone is sufficient), it's because five daily prayers are exactly the rhythm a human soul needs to maintain its connection to its Creator.",
    mainHtml: `<h2>The Spiritual Importance of Salah</h2>
<p style="color:#a0c8a0;line-height:1.8">Salah is the most direct channel of communication between a believer and Allah. When Jibril (AS) brought Islam to the Prophet ﷺ, prayers were originally 50 daily, then reduced to 5, while retaining the reward of 50. Allah described salah as 'zikr', His remembrance. Without it, the soul gradually loses its orientation toward Allah.</p>
<h2>The Psychological Benefits of Salah</h2>
<p style="color:#a0c8a0;line-height:1.8">Modern psychology has discovered what Islam established 1,400 years ago: structured mindfulness practices reduce cortisol, improve emotional regulation, and create a sense of meaning and routine. Every element of salah maps onto evidence-based mental health practices, ritual, physical movement, focused attention, gratitude, and community.</p>`,
    steps: [
      { title: "Understand salah as a meeting", desc: "Each prayer is a scheduled meeting with Allah. Approach it with the preparation and presence you'd bring to a meeting with the most important person in your life." },
      { title: "Track the 5-times rhythm", desc: "Notice how your day feels on days you pray all 5 vs. days you miss. Most Muslims report measurable differences in peace, focus, and gratitude." },
      { title: "Pray in congregation when possible", desc: "Jama'ah prayer multiplies reward 27 times and creates community accountability." },
      { title: "Learn the meaning of your prayers", desc: "Salah transforms from ritual to conversation when you understand what you're saying to Allah." },
    ],
    quranRefs: [
      { arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ", trans: "Wa aqimus-salata wa atuz-zakata", ref: "And establish prayer and give zakat, Quran 2:43 (one of over 700 references to salah in the Quran)" },
    ],
    faqs: [
      { q: "Why do Muslims pray 5 times a day?", a: "The 5 daily prayers were established during the Night Journey (Isra wal-Mi'raj), originally 50 prayers reduced to 5 by Allah's mercy while retaining the full reward. The 5 times correspond to the major transitions of the day: dawn, midday, afternoon, sunset, and night." },
      { q: "What is the first thing asked about on Judgment Day?", a: "The Prophet ﷺ said: 'The first thing a servant will be held accountable for on the Day of Judgment is salah. If it is sound, all his other deeds will be sound. If it is corrupt, all his other deeds will be corrupt.' (Tabarani)" },
    ],
    internalLinks: [
      { href: "/salah-guide", label: "Complete Salah Guide" },
      { href: "/how-to-stop-missing-salah", label: "Stop Missing Salah" },
      { href: "/prayer-times", label: "Prayer Times" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-focus-in-salah", label: "How to Focus in Salah" },
      { href: "/salah-benefits", label: "Benefits of Salah on Mental Health" },
      { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Why Salah is Important" }],
  }));
});

router.get("/salah-benefits", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(salahPage({
    slug: "/salah-benefits", date: "2026-02-09",
    title: "Benefits of Salah on Mental Health, What Science & Islam Say",
    desc: "The spiritual and psychological benefits of salah. What Islam says and what science confirms about the mental health benefits of five daily prayers.",
    h1: "Benefits of Salah, Spiritual and Mental Health Evidence",
    aiSummary: "Salah's benefits include: direct connection with Allah (spiritual), stress reduction through mindfulness (psychological), improved posture and flexibility (physical), routine and structure (behavioral), community belonging when prayed in congregation (social), and protection from indecency as the Quran states in 29:45. Together they form a complete wellness system.",
    intro: "The Quran says 'Indeed, salah prevents immorality and wrongdoing' (29:45). This is not a poetic statement, it is a functional description of how salah works. Five daily prayers create a lifestyle rhythm where wrongdoing becomes increasingly incompatible with the practicing Muslim's identity.",
    mainHtml: `<h2>Spiritual Benefits</h2>
<p style="color:#a0c8a0;line-height:1.8">Salah maintains the servant's direct channel to Allah. The Prophet ﷺ said: 'The closest a servant is to his Lord is in sujood.' Five daily opportunities for this closeness mean that no Muslim should ever feel spiritually abandoned if they maintain their prayers.</p>
<h2>Psychological Benefits</h2>
<p style="color:#a0c8a0;line-height:1.8">Studies by researchers at Harvard Medical School and multiple Islamic universities confirm: regular practitioners of salah show lower rates of anxiety and depression, better emotional regulation, higher resilience under stress, and greater reported life satisfaction compared to non-praying control groups.</p>`,
    steps: [
      { title: "Pray all 5 on time for one week", desc: "Experience the psychological benefits firsthand, most people notice the difference within 3 days." },
      { title: "Add 2 Sunnah rakaats before Fajr", desc: "The Prophet ﷺ said this was more precious than the world and everything in it." },
      { title: "Pray Dhuha (2-8 rakaats after sunrise)", desc: "This additional voluntary prayer amplifies barakah and gratitude." },
      { title: "Reflect during sujood", desc: "Use the prostration moment for personal dua and gratitude, this is the practice that produces the measurable mental health benefits." },
    ],
    quranRefs: [
      { arabic: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ", trans: "Innas-salata tanha 'anil-fahsha'i wal-munkar", ref: "Indeed, salah prevents immorality and wrongdoing, Quran 29:45" },
    ],
    faqs: [
      { q: "Does salah improve mental health?", a: "Multiple studies confirm yes. Regular salah practitioners show lower anxiety, better stress management, higher resilience, and greater life satisfaction. The mechanisms include: mindfulness (focused attention), routine, physical movement, gratitude practice, community, and spiritual connection." },
      { q: "What are the physical benefits of salah?", a: "Salah involves 13+ physical positions that promote flexibility, circulation, and balance. Sujood (prostration) has been studied for its cardiovascular benefits. Regular salah practitioners have lower resting heart rates on average." },
    ],
    internalLinks: [
      { href: "/how-to-focus-in-salah", label: "Achieve Khushoo" },
      { href: "/salah-guide", label: "Salah Guide" },
      { href: "/why-salah-is-important", label: "Why Salah Matters" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-focus-in-salah", label: "How to Focus in Salah" },
      { href: "/why-salah-is-important", label: "Why Salah is Important" },
      { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Salah Benefits" }],
  }));
});

router.get("/how-to-make-salah-habit", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(salahPage({
    slug: "/how-to-make-salah-habit", date: "2026-02-11",
    title: "How to Make Salah a Daily Habit, Islamic Habit Science",
    desc: "How to make salah a consistent daily habit using Islamic guidance and modern habit science. For Muslims rebuilding their prayer practice.",
    h1: "How to Make Salah a Daily Habit, Islamic Habit Building",
    aiSummary: "Make salah a habit by attaching it to existing triggers (after waking = Fajr, after lunch = Dhuhr), reducing friction (prayer mat always out, Wudu before triggers), tracking your streak, starting with the most manageable prayer, and using the Islamic principle of consistency: 'The most beloved deeds to Allah are those done consistently, even if small.'",
    intro: "Habit science and Islamic wisdom align perfectly on one point: small, consistent actions beat large, sporadic ones. The Prophet ﷺ was asked about the most beloved deeds to Allah. He said: 'Those done consistently, even if small.' This is the foundation of a prayer habit.",
    mainHtml: `<h2>The Habit Loop for Salah</h2>
<p style="color:#a0c8a0;line-height:1.8">Every habit follows a loop: Cue → Routine → Reward. For salah: the Cue is the Adhan/alarm; the Routine is Wudu + prayer; the Reward is the peace and connection felt afterward. The goal is to strengthen each element of this loop until salah becomes as automatic as brushing your teeth.</p>`,
    steps: [
      { title: "Start with your easiest prayer", desc: "Which prayer do you find easiest to maintain? Start there and build momentum." },
      { title: "Stack salah onto existing habits", desc: "'After I make tea in the morning, I pray Fajr.' Habit stacking is the most powerful habit formation technique." },
      { title: "Reduce friction to zero", desc: "Prayer mat always out. Wudu water ready. Prayer area clean and inviting." },
      { title: "Use the MyTazki streak tracker", desc: "Visual streaks are powerful motivators. Don't break the chain." },
      { title: "Celebrate the small wins", desc: "3 days consistent? Acknowledge it to yourself. 7 days? Tell your accountability partner." },
    ],
    quranRefs: [
      { arabic: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ", trans: "Hafidhu 'alas-salawati was-salatin wusta", ref: "Maintain with care the obligatory prayers and especially the middle prayer, Quran 2:238" },
    ],
    faqs: [
      { q: "How long does it take to make salah a habit?", a: "Research suggests habits form in 21-66 days depending on the behavior's complexity. For salah, most Muslims find that 40 consistent days creates a strong habit, which aligns with the prophetic narration about doing good deeds consistently for 40 days." },
    ],
    internalLinks: [
      { href: "/how-to-stop-missing-salah", label: "Stop Missing Salah" },
      { href: "/growth", label: "Growth & Habit Tracker" },
      { href: "/prayer-times", label: "Prayer Times" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah" },
      { href: "/islamic-habit-tracker", label: "Islamic Habit Tracker" },
      { href: "/daily-muslim-routine", label: "Daily Muslim Routine" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Making Salah a Habit" }],
  }));
});

router.get("/missed-prayers-qada", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(salahPage({
    slug: "/missed-prayers-qada", date: "2026-02-13",
    title: "Making Up Missed Prayers (Qada), Islamic Ruling & How To",
    desc: "How to make up missed salah (qada prayers) in Islam. Islamic rulings from different madhabs, practical method, and how to calculate missed prayers.",
    h1: "Making Up Missed Prayers (Qada Salah), How to Start",
    aiSummary: "To make up missed prayers (qada): most scholars agree you must make up prayers missed due to sleep or forgetfulness, pray them as soon as you remember. For intentionally missed prayers, repent sincerely and pray going forward; scholars differ on whether they can be made up. Start making up any backlog by praying one extra each day after your obligatory prayer.",
    intro: "For many Muslims, years of inconsistent practice have left a backlog of missed prayers that feels overwhelming. It can even become a source of shame that paradoxically prevents returning to salah. This guide provides the practical Islamic ruling and a compassionate path forward.",
    mainHtml: `<h2>The Islamic Ruling on Qada Prayers</h2>
<p style="color:#a0c8a0;line-height:1.8">All four major madhabs agree: prayers missed due to sleep or forgetfulness MUST be made up (qada) as soon as one remembers. For intentionally missed prayers, there is scholarly difference: many scholars (Hanafi, Maliki, Shafi) say they must still be made up; others say sincere tawbah is sufficient. Consult your local imam or scholar for a ruling applicable to your madhab.</p>`,
    steps: [
      { title: "Make sincere tawbah first", desc: "Before focusing on the backlog, repent sincerely for missed prayers. This is required regardless of which position you follow." },
      { title: "Maintain going-forward prayers", desc: "Prioritize never missing another prayer going forward. This is the most important step." },
      { title: "Estimate your backlog", desc: "If you missed 2 years of prayers: 5 prayers × 365 days × 2 = 3,650 prayers. Don't be overwhelmed, this is just a number." },
      { title: "Pray one qada after each fard", desc: "Add one qada prayer after each of your 5 daily prayers. You'll make up 5 missed prayers per day." },
      { title: "Consult your local scholar", desc: "For large backlogs, get personalized guidance from a knowledgeable imam." },
    ],
    quranRefs: [
      { arabic: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي", trans: "Wa aqimis-salata lidhikri", ref: "Establish prayer for My remembrance, Quran 20:14. The Prophet ﷺ applied this to missed prayers: 'Whoever forgets a prayer should pray it when he remembers' (Bukhari)." },
    ],
    faqs: [
      { q: "Do I have to make up missed salah?", a: "Yes, for prayers missed due to sleep or forgetfulness, this is unanimous across all four madhabs. For deliberately missed prayers, most scholars still require making them up alongside sincere repentance, though a minority view considers tawbah sufficient." },
      { q: "How do I calculate years of missed prayers?", a: "Estimate: years missed × 365 days × 5 prayers = total qada prayers. For 2 years: 3,650. If you pray one extra per day after each fard, you'll clear a year of backlog in 365 days. Start today." },
    ],
    internalLinks: [
      { href: "/salah-guide", label: "Salah Guide" },
      { href: "/how-to-stop-missing-salah", label: "Never Miss Again" },
      { href: "/prayer-times", label: "Prayer Times" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah" },
      { href: "/why-salah-is-important", label: "Why Salah is Important" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Missed Prayers (Qada)" }],
  }));
});

router.get("/dua-before-salah", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(salahPage({
    slug: "/dua-before-salah", date: "2026-02-15",
    title: "Dua Before Salah, Opening Supplications in Prayer",
    desc: "The authentic duas and Sunnah supplications before and at the start of salah, Iftitah dua, Istiatha, and how to set your heart before prayer.",
    h1: "Dua Before Salah, Opening Prayers and Supplications",
    aiSummary: "Before entering salah, recite: the Iftitah dua (opening supplication after Takbir): 'Subhanakallahumma wa bihamdika wa tabarakasmuka wa ta'ala jadduka wa la ilaha ghairuk.' Then seek refuge from Shaytan (A'udhu billah), then Bismillah before Al-Fatiha. This sequence prepares your heart and is Sunnah.",
    intro: "The opening of salah sets the tone for everything that follows. Just as you wouldn't enter a meeting with an important person distracted and unprepared, the Sunnah gives us a sequence to prepare the heart for standing before Allah.",
    mainHtml: `<h2>The Complete Opening Sequence</h2>
<p style="color:#a0c8a0;line-height:1.8">After the opening Takbir (Allahu Akbar), place your right hand over your left on your chest. Then recite the Iftitah dua silently. Then say A'udhu billahi minash-shaytanir-rajim (silently). Then Bismillahir-rahmanir-raheem. Then begin Al-Fatiha. This sequence takes approximately 20 seconds and transforms the quality of focus in the prayer that follows.</p>`,
    steps: [
      { title: "Make sincere intention (niyyah)", desc: "Before Takbir, make your intention silently: 'I intend to pray [name of prayer] for the sake of Allah.'" },
      { title: "Say Allahu Akbar with presence", desc: "The Takbir is your declaration that Allah is Greater, greater than your worries, your phone, your to-do list." },
      { title: "Recite Iftitah dua", desc: "The opening supplication. Different scholars recommend slightly different versions, all are valid." },
      { title: "Seek refuge from Shaytan", desc: "A'udhu billahi minash-shaytanir-rajim, especially important for those who struggle with waswasa in prayer." },
      { title: "Begin Al-Fatiha with Bismillah", desc: "The prayer proper begins. Your heart should now be engaged and prepared." },
    ],
    quranRefs: [
      { arabic: "وَقُومُوا لِلَّهِ قَانِتِينَ", trans: "Wa qumu lillahi qanitteen", ref: "And stand before Allah in devout obedience, Quran 2:238" },
    ],
    faqs: [
      { q: "What is the Iftitah dua?", a: "The most common Iftitah dua is: 'Subhanakallahumma wa bihamdika wa tabarakasmuka wa ta'ala jadduka wa la ilaha ghairuk', meaning: Glory and praise be to You, O Allah; Your name is blessed; Your majesty is exalted; and there is no god but You." },
    ],
    internalLinks: [
      { href: "/salah-guide", label: "Complete Salah Guide" },
      { href: "/how-to-focus-in-salah", label: "How to Focus in Salah" },
      { href: "/duas", label: "Full Duas Library" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/how-to-focus-in-salah", label: "How to Focus in Salah" },
      { href: "/why-salah-is-important", label: "Why Salah is Important" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Dua Before Salah" }],
  }));
});

export default router;
