import { Router } from "express";
import { seoHead, page, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, ctaBlock, esc } from "./shared.js";
import { quickAnswerBox, peopleAlsoAsk, emotionalCTA, relatedArticlesGrid, conversationalBlock } from "./seo-components.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function articleSchema(title: string, desc: string, slug: string): object {
  return { "@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "author": { "@type": "Organization", "name": "MyTazki" }, "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" }, "datePublished": "2026-01-01", "dateModified": TODAY, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` } };
}

function speakable(slug: string): object {
  return { "@context": "https://schema.org", "@type": "WebPage", "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ai-summary", "h1"] }, "url": `https://mytazki.com${slug}` };
}

function quranBlock(arabic: string, trans: string, ref: string): string {
  return `<div style="background:rgba(52,201,122,0.05);border-radius:10px;padding:16px 20px;margin:14px 0;border:1px solid rgba(52,201,122,0.12)">
  <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.5em;line-height:2;margin:0 0 8px">${arabic}</p>
  <p style="color:#34c97a;font-style:italic;margin:0 0 6px;font-size:14px;font-family:Inter,sans-serif">${esc(trans)}</p>
  <p style="color:#6a9878;font-size:13px;margin:0;font-family:Inter,sans-serif">${esc(ref)}</p>
</div>`;
}

const SALAH_RELATED = [
  { href: "/salah", label: "Salah Hub, All Guides", tag: "Hub" },
  { href: "/how-to-stop-missing-salah", label: "Stop Missing Salah", tag: "Habit" },
  { href: "/how-to-wake-up-for-fajr", label: "Wake Up for Fajr", tag: "Fajr" },
  { href: "/how-to-focus-in-salah", label: "Focus in Salah", tag: "Khushu" },
  { href: "/7-day-salah-reset", label: "7-Day Salah Reset", tag: "Journey" },
  { href: "/tahajjud-transformation-journey", label: "Tahajjud Journey", tag: "Journey" },
];

// ─── 1. Tahajjud Prayer Guide ─────────────────────────────────────────────────
router.get("/tahajjud-prayer-guide", (_req, res) => {
  const slug = "/tahajjud-prayer-guide"; const title = "Tahajjud Prayer, The Complete Guide for Beginners"; const desc = "Everything about Tahajjud: when to pray, how many rakaats, what to recite, the best duas, and how to build the habit of the night prayer. Based on Quran and authentic Hadith.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "Tahajjud Prayer Guide" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is Tahajjud and when should I pray it?", "Tahajjud is the voluntary night prayer prayed after waking from sleep, during the last third of the night (approximately 2-3 hours before Fajr). It is one of the most beloved prayers to Allah. The Prophet ﷺ said: 'Our Lord descends to the lowest heaven in the last third of every night and says: Who is calling upon Me, that I may answer? Who is asking of Me, that I may give? Who is seeking My forgiveness, that I may forgive?' (Bukhari)")}
${quranBlock("وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ", "Wa minal-layli fatahajjad bihi nafilatan lak", "And from part of the night, arise and pray as an additional prayer for you, Quran 17:79")}
<h2>How to Pray Tahajjud</h2>
<ol style="padding-left:20px;line-height:2.2;color:#a0c8a0;font-family:Inter,sans-serif">
  <li>Sleep after Isha, you must sleep first before Tahajjud counts</li>
  <li>Set an alarm for the last third of the night (use MyTazki prayer times to calculate)</li>
  <li>Make wudu when you wake</li>
  <li>Begin with 2 light rakaats to warm up (this was the Prophet's ﷺ practice)</li>
  <li>Then pray in sets of 2 rakaats, up to 8 or 12 rakaats total</li>
  <li>End with Witr prayer (1 or 3 rakaats), the seal of the night prayer</li>
  <li>Make personal dua after, this is the most accepted time for dua</li>
</ol>
<h2>The Best Duas to Make in Tahajjud</h2>
<p style="color:#a0c8a0;line-height:1.8">After your rakaats, sit and make personal dua in your own language. The Prophet ﷺ would say: 'Allahumma lakal hamd anta qayyimus-samawati wal-ard...' (O Allah, all praise is for You, You are the Sustainer of the heavens and earth). Then ask for everything, your deen, dunya, and akhira.</p>
${faqHtml([
  { q: "How many rakaats is Tahajjud?", a: "Tahajjud is minimum 2 rakaats and maximum unlimited, but the Prophet ﷺ typically prayed 8 rakaats of Tahajjud plus 3 Witr. For beginners, 2-4 rakaats is a complete and valid Tahajjud." },
  { q: "What is the difference between Tahajjud and Qiyam ul-Layl?", a: "Qiyam ul-Layl (standing of the night) refers to all voluntary night prayers. Tahajjud specifically refers to the prayer prayed AFTER sleeping, you must sleep first for it to be Tahajjud. The Witr prayer done without sleeping first is Qiyam, not Tahajjud." },
  { q: "Is Tahajjud mandatory?", a: "Tahajjud was obligatory only for the Prophet ﷺ (Quran 17:79, 'an additional prayer for you'). For the ummah it is a highly recommended Sunnah Mu'akkadah, the Prophet ﷺ never left it, and it is one of the most beloved voluntary acts to Allah." },
])}
${relatedArticlesGrid(SALAH_RELATED)}
${emotionalCTA({ title: "Track Your Tahajjud Streak in MyTazki", subtitle: "Set tahajjud reminders, log each prayer, and join the 21-Night Tahajjud Transformation Journey.", href: "/download", btnText: "Start Tahajjud Tracker →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), faqSchema([{ q: "How many rakaats is Tahajjud?", a: "Minimum 2, typically 8 + 3 Witr." }]), breadcrumbSchema(bcs)] }), body));
});

// ─── 2. How to Pray Tahajjud ──────────────────────────────────────────────────
router.get("/how-to-pray-tahajjud", (_req, res) => {
  const slug = "/how-to-pray-tahajjud"; const title = "How to Pray Tahajjud, Step-by-Step Beginner's Guide"; const desc = "Step-by-step guide to praying Tahajjud for beginners. What to recite, how many rakaats, timing, wudu, and what duas to make. Based on authentic hadith.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "How to Pray Tahajjud" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How do I pray Tahajjud step by step?", "1. Sleep after Isha. 2. Wake in the last third of the night. 3. Make wudu. 4. Make intention (niyyah) for Tahajjud in your heart. 5. Pray 2 rakaats, short surahs are fine (Ikhlas, Falaq, Nas). 6. Repeat for 2-8 more rakaats in pairs. 7. End with Witr (1 or 3 rakaats). 8. Make personal dua. That is a complete Tahajjud.")}
<h2>Step-by-Step Walkthrough</h2>
<div style="display:flex;flex-direction:column;gap:12px;margin:16px 0">
${[
  ["Step 1: Prepare the night before", "Sleep early. Set your alarm 45 minutes before Fajr. Place your prayer mat facing Qibla. Have wudu water ready. Make niyyah before sleeping: 'O Allah, wake me for Your sake in the night.'"],
  ["Step 2: Wake and make wudu", "Cold water helps with alertness. Say Bismillah and make a complete wudu. Do not go back to bed after wudu."],
  ["Step 3: Start with 2 light rakaats", "The Prophet ﷺ would begin Tahajjud with 2 short rakaats. In these, recite Surah Al-Fatiha + a short surah (Al-Ikhlas works). This warms up your prayer."],
  ["Step 4: Pray your Tahajjud rakaats", "Now pray 2 rakaats at a time, up to 8 total. You may recite longer surahs here, Al-Baqarah, Al-Imran. The Prophet ﷺ prayed long Tahajjud. In sujood, stay longer than usual and make dua."],
  ["Step 5: Pray Witr", "End with Witr, 1 or 3 rakaats. In the last rakaat of Witr, recite Qunut (O Allah, guide me among those You have guided...)."],
  ["Step 6: Make personal dua", "This is why you woke up. Sit in the stillness. Raise your hands. Speak to Allah in any language. Ask for everything."],
].map(([title, desc]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:18px 16px">
  <strong style="color:#34c97a;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:8px">${title}</strong>
  <p style="color:#6a9878;font-size:14px;margin:0;line-height:1.65;font-family:Inter,sans-serif">${desc}</p>
</div>`).join("")}
</div>
${relatedArticlesGrid(SALAH_RELATED)}
${emotionalCTA({ title: "Join the 21-Night Tahajjud Journey", subtitle: "Guided night prayer program with reminders, reflection prompts, and streak tracking in MyTazki.", href: "/tahajjud-transformation-journey", btnText: "Start Tahajjud Journey →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 3. Fajr Prayer Tips ──────────────────────────────────────────────────────
router.get("/fajr-prayer-tips", (_req, res) => {
  const slug = "/fajr-prayer-tips"; const title = "Fajr Prayer Tips, 9 Proven Ways to Never Miss Fajr Again"; const desc = "9 practical, proven tips to wake up for Fajr consistently. Sleep hygiene, alarm strategies, spiritual motivation, and the Sunnah of the early morning from authentic hadith.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "Fajr Prayer Tips" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How do I wake up for Fajr every day?", "The key insight: Fajr is won or lost the night before. Sleep before 11pm. Make intention (niyyah) before sleeping. Set two alarms, one 15 minutes early. Keep your phone away from your bed. Place wudu water by your bedside. The morning after your first few successful Fajr prayers, you'll feel different, the Prophet ﷺ said the early morning is blessed.")}
<h2>9 Proven Fajr Strategies</h2>
<ol style="padding-left:20px;color:#a0c8a0;font-family:Inter,sans-serif;line-height:2.2">
  <li><strong style="color:#eaf4ee">Sleep immediately after Isha</strong>, The Prophet ﷺ disliked conversation after Isha. Early sleep = early rise.</li>
  <li><strong style="color:#eaf4ee">Make niyyah before sleeping</strong>, Tell Allah: "I intend to wake for Fajr." This primes your mind to wake.</li>
  <li><strong style="color:#eaf4ee">Set two alarms 10 minutes apart</strong>, The first wakes you, the second gets you out of bed.</li>
  <li><strong style="color:#eaf4ee">Place your prayer mat visible</strong>, Seeing it when you open your eyes is a cue. Remove all friction.</li>
  <li><strong style="color:#eaf4ee">Sleep in wudu</strong>, The Prophet ﷺ slept in a state of wudu. You'll wake feeling spiritually ready.</li>
  <li><strong style="color:#eaf4ee">Use cold water for face wash</strong>, Cold water is the fastest way to remove sleepiness.</li>
  <li><strong style="color:#eaf4ee">Remember the angels witness Fajr</strong>, 'The angels of the night and angels of the day meet at Fajr and Asr.' (Bukhari)</li>
  <li><strong style="color:#eaf4ee">Track your streak</strong>, MyTazki's salah tracker shows your Fajr streak. The visual momentum is powerful.</li>
  <li><strong style="color:#eaf4ee">Find a Fajr accountability partner</strong>, Text someone when you've prayed. The social commitment compounds.</li>
</ol>
${quranBlock("أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَى غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ", "Aqimis-salata lidulukit-shamsi ila ghasaqil-layli wa quran al-fajr", "Establish prayer at the decline of the sun until the darkness of the night, and the Quran of Fajr, Quran 17:78")}
${relatedArticlesGrid(SALAH_RELATED)}
${emotionalCTA({ title: "Set Your Fajr Alarm in MyTazki", subtitle: "Prayer time notifications with GPS-accurate times. Log Fajr every morning and watch your streak grow.", href: "/download", btnText: "Set Fajr Reminder →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 4. Khushu in Salah ───────────────────────────────────────────────────────
router.get("/khushu-in-salah", (_req, res) => {
  const slug = "/khushu-in-salah"; const title = "Khushu in Salah, The Deep Focus and Humility Guide"; const desc = "How to achieve khushu (humble concentration) in salah. The spiritual meaning, practical techniques, what destroys khushu, and how the Prophet ﷺ prayed with full presence.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "Khushu in Salah" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is khushu in salah and how do I achieve it?", "Khushu is the state of humble, concentrated, awe-filled presence in salah, where the heart is fully with Allah while the body performs the prayer. The Quran says the successful believers are those 'who are humble in their prayers' (23:2). Practical path to khushu: (1) Understand what you're saying. (2) Slow down every movement. (3) In sujood, feel you are the lowest and Allah is the Highest. (4) Pray as if it is your last prayer.")}
${quranBlock("قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۞ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ", "Qad aflaha al-mu'minun. Alladhina hum fi salatihim khashi'un", "Certainly the believers have succeeded, those who are humble in their prayers, Quran 23:1-2")}
<h2>7 Techniques to Build Khushu</h2>
<ol style="padding-left:20px;line-height:2.2;color:#a0c8a0;font-family:Inter,sans-serif">
  <li><strong style="color:#eaf4ee">Understand the meaning</strong>, Learn the translation of every surah and dua you recite in salah. You cannot concentrate on words you don't understand.</li>
  <li><strong style="color:#eaf4ee">Prepare beforehand</strong>, Make wudu slowly. Say the Iqamah with your heart. Stand for 5 seconds before starting, breathing.</li>
  <li><strong style="color:#eaf4ee">Say Allahu Akbar with meaning</strong>, 'Allah is Greater' than your worries, phone, to-do list. Each Allahu Akbar is a declaration of priority.</li>
  <li><strong style="color:#eaf4ee">Slow down your movements</strong>, Double the time between each position. Feel the transition. Notice your breath.</li>
  <li><strong style="color:#eaf4ee">In sujood, make personal dua</strong>, The Prophet ﷺ said the closest you are to Allah is in sujood. Use it. Ask for specific things.</li>
  <li><strong style="color:#eaf4ee">Pray as if it's your last</strong>, The Prophet ﷺ said: 'Pray as if you are saying farewell.' This one shift transforms everything.</li>
  <li><strong style="color:#eaf4ee">Remove all distractions</strong>, Phone face down, far from you. Prayer in a clean, organised space. Eyes focused on the place of sujood.</li>
</ol>
${relatedArticlesGrid(SALAH_RELATED)}
${emotionalCTA({ title: "Rate Your Khushu in MyTazki", subtitle: "Log each prayer with a khushu rating (1-5). Track how your presence improves over time.", href: "/download", btnText: "Start Salah Tracker →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 5. Salah and Mental Health ───────────────────────────────────────────────
router.get("/salah-and-mental-health", (_req, res) => {
  const slug = "/salah-and-mental-health"; const title = "Salah and Mental Health, How Prayer Heals the Mind"; const desc = "The science and spirituality of how salah improves mental health. Research on prayer and wellbeing, the neuroscience of sujood, and how the five daily prayers regulate emotion.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "Salah and Mental Health" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How does salah benefit mental health?", "Salah provides: (1) Structured routine, 5 anchors throughout the day interrupt anxiety cycles. (2) Mindfulness, the physical presence required in salah is clinically comparable to mindfulness meditation. (3) Sujood (prostration), increases blood flow to the prefrontal cortex and releases oxytocin. (4) Social connection, congregational prayer reduces isolation. (5) Meaning and purpose, the theology of salah provides existential grounding.")}
<h2>The Neuroscience of Salah</h2>
<p style="color:#a0c8a0;line-height:1.8">Research at multiple universities has studied the neurological effects of Islamic prayer. Key findings: Sujood (prostration) increases blood supply to the frontal lobes, associated with decision-making and emotional regulation. The repetitive movement of salah activates the parasympathetic nervous system, the body's rest-and-digest mode, reducing cortisol. The Arabic recitation in salah, particularly Al-Fatiha recited slowly, shows brainwave patterns associated with deep meditation.</p>
${quranBlock("إِنَّ الصَّلَاةَ تَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنكَرِ", "Innas-salata tanha 'anil-fahsha'i wal-munkar", "Indeed, prayer prevents immorality and wrongdoing, Quran 29:45")}
<h2>5 Mental Health Benefits of the Five Daily Prayers</h2>
<div style="display:flex;flex-direction:column;gap:10px;margin:16px 0">
${[
  ["Fajr, The Mood Setter", "Waking before dawn and completing Fajr sets a proactive, purposeful tone for the day. Studies on circadian rhythms show early morning activity (aligned with Fajr timing) correlates with better mental health outcomes."],
  ["Dhuhr, The Midday Reset", "Praying Dhuhr breaks the work day at its peak stress point. A 5-minute prayer pause acts as a cognitive reset, improving afternoon productivity and reducing work-related anxiety."],
  ["Asr, The Perspective Check", "The Prophet ﷺ especially warned about missing Asr. Praying Asr in the afternoon provides a mid-evening anchor, interrupting the 3pm energy crash many people experience."],
  ["Maghrib, The Gratitude Practice", "Praying immediately after sunset (one of the tightest prayer windows) builds discipline. The golden-hour timing of Maghrib is associated with reflection and gratitude."],
  ["Isha, The Day-Closure", "Isha closes the day spiritually. The Prophet ﷺ disliked conversation after Isha, using this time to pray and sleep creates the clear boundary that sleep science calls 'sleep hygiene.'"],
].map(([t, d]) => `<div style="background:#1c2d21;border-left:3px solid #34c97a;border-radius:0 10px 10px 0;padding:14px 16px">
  <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${t}</strong>
  <p style="color:#6a9878;font-size:13px;margin:0;line-height:1.6;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
${relatedArticlesGrid(SALAH_RELATED)}
${emotionalCTA({ title: "Pray More. Feel Better. Track It All.", subtitle: "MyTazki's salah tracker with khushu rating shows you the direct connection between prayer consistency and spiritual peace.", href: "/download", btnText: "Start Salah Tracker →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 6. Salah Motivation ──────────────────────────────────────────────────────
router.get("/salah-motivation", (_req, res) => {
  const slug = "/salah-motivation"; const title = "Islamic Salah Motivation, For When You Feel Too Tired to Pray"; const desc = "Feeling spiritually dry and too tired for salah? Authentic Islamic motivation rooted in Quran, hadith, and the reality of what you are missing when you skip prayer.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "Salah Motivation" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How do I motivate myself to pray when I don't feel like it?", "The Prophet ﷺ said: 'The first thing a person will be accountable for on the Day of Judgement is salah.' This isn't meant to frighten, it means salah is where Allah wants to meet you most. When motivation fails, remember: every salah is a conversation. Allah is waiting. The Adhan is literally 'Hayya 'alas-salah', come to success. Salah IS the success.")}
<h2>What You Miss When You Miss Salah</h2>
<p style="color:#a0c8a0;line-height:1.8">You miss: 5 daily conversations with the Creator. The chance to shed your sins (the Prophet ﷺ compared salah to a river you wash in 5 times a day, would any dirt remain?). The protection it provides ('Salah prevents immorality and wrongdoing', 29:45). The peace only sujood can give. The angelic witnessing of Fajr and Asr. The supplication of the angels for those in the mosque.</p>
${quranBlock("حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى", "Hafidhu 'alas-salawati was-salat al-wusta", "Guard strictly the prayers, and the middle prayer, Quran 2:238")}
<h2>10 Things That Reignite Salah Motivation</h2>
<ol style="padding-left:20px;color:#a0c8a0;line-height:2.2;font-family:Inter,sans-serif">
  <li>Remember you will die, and this might be your last salah</li>
  <li>Remember the questioning on the Day of Judgement begins with salah</li>
  <li>Read about the Prophet's ﷺ love for salah, he called it 'the coolness of my eyes'</li>
  <li>Visit a graveyard, perspective on what matters returns quickly</li>
  <li>Pray in congregation once, the communal energy compounds individual motivation</li>
  <li>Read Surah Al-Kahf on a Friday, the Quran reminds the heart</li>
  <li>Start a 7-day streak in MyTazki, seeing consecutive days builds momentum</li>
  <li>Watch a lecture on the meaning of Al-Fatiha, understanding deepens care</li>
  <li>Make wudu when you feel too tired, wudu itself changes your state</li>
  <li>Ask Allah for the love of salah, 'Allahumma habib ilayna salah'</li>
</ol>
${relatedArticlesGrid(SALAH_RELATED)}
${emotionalCTA({ title: "Build Salah Momentum with MyTazki", subtitle: "7-day streak tracker, khushu rating, and salah reminders. The simplest way to make prayer non-negotiable.", href: "/download", btnText: "Start Your Streak →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 7. Night Prayer Benefits ─────────────────────────────────────────────────
router.get("/night-prayer-benefits", (_req, res) => {
  const slug = "/night-prayer-benefits"; const title = "Benefits of Night Prayer, What Happens When You Pray Tahajjud"; const desc = "The spiritual, psychological, and physical benefits of Tahajjud and Qiyam ul-Layl. Hadith-based evidence and modern science on the benefits of the night prayer.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "Benefits of Night Prayer" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What are the benefits of praying Tahajjud?", "The Prophet ﷺ described Tahajjud as: 'The most virtuous prayer after the obligatory prayers' (Muslim). Benefits include: Allah descends to the lowest heaven and answers duas personally; sins are forgiven in the last third of the night; it was the practice of all prophets; it builds unshakeable spiritual discipline; the body's cortisol levels are naturally lowest in the early morning, making this the optimal time for spiritual receptivity.")}
<h2>8 Proven Benefits of the Night Prayer</h2>
<div style="display:flex;flex-direction:column;gap:12px;margin:16px 0">
${[
  ["1. Divine Attention", "Allah personally descends to the lowest heaven in the last third of the night asking: 'Who is calling? Who is asking?' Your tahajjud puts you directly in this divine attention. (Bukhari)"],
  ["2. Dua Acceptance", "The Prophet ﷺ said: 'In the night there is an hour, if a Muslim catches it asking Allah for good of this world and the next, He will give it.' (Muslim)"],
  ["3. Honor and Station", "Allah says (17:79): 'Your Lord may raise you to a praiseworthy station.' Tahajjud is linked to the maqam mahmood, the highest station on the Day of Judgement."],
  ["4. Forgiveness of Sins", "The Prophet ﷺ used to pray tahajjud until his feet swelled. When asked why, he said: 'Should I not be a grateful servant?' Every tahajjud prayer carries the potential for complete forgiveness."],
  ["5. Stress Reduction", "The pre-dawn cortisol awakening response peaks around 30 minutes before waking. Praying tahajjud at this time, when the body is naturally alert, uses this peak state for worship rather than anxiety."],
  ["6. Spiritual Clarity", "The Prophet ﷺ said: 'Whoever prays 12 rakaats in the night, Allah will build for him a house in Paradise.' The night prayer builds long-term iman that sustains you through daily challenges."],
  ["7. Protection", "Ayatul Kursi after every fard prayer and before sleep, Surah Al-Mulk before bed (which protects in the grave), the night prayer is surrounded by prophetic protective practices."],
  ["8. The Feeling", "Those who pray tahajjud regularly describe a quality of spiritual clarity and connection that is difficult to achieve any other way. The night's silence, the wudu cold, the prostration, something shifts permanently."],
].map(([t, d]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:16px">
  <strong style="color:#34c97a;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${t}</strong>
  <p style="color:#6a9878;font-size:14px;margin:0;line-height:1.65;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
${relatedArticlesGrid(SALAH_RELATED)}
${emotionalCTA({ title: "Start Your Tahajjud Journey Tonight", subtitle: "Set your tahajjud reminder, join the 21-Night Journey, and track your night prayers in MyTazki.", href: "/tahajjud-transformation-journey", btnText: "Begin Tahajjud Journey →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

export default router;
