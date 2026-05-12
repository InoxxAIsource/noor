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

const HABITS_RELATED = [
  { href: "/islamic-habits", label: "Islamic Habits Hub", tag: "Hub" },
  { href: "/daily-muslim-routine", label: "Complete Daily Routine", tag: "Routine" },
  { href: "/morning-routine-muslim", label: "Islamic Morning Routine", tag: "Morning" },
  { href: "/morning-barakah-routine", label: "Morning Barakah Journey", tag: "Journey" },
  { href: "/islamic-self-improvement", label: "Islamic Self-Improvement", tag: "Growth" },
  { href: "/dhikr-daily-habit", label: "Dhikr Daily Habit", tag: "Dhikr" },
];

function listCards(items: Array<[string, string]>): string {
  return `<div style="display:flex;flex-direction:column;gap:12px;margin:16px 0">
${items.map(([t, d]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:16px">
  <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${t}</strong>
  <p style="color:#6a9878;font-size:14px;margin:0;line-height:1.6;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>`;
}

// ─── 1. Islamic Discipline ────────────────────────────────────────────────────
router.get("/islamic-discipline", (_req, res) => {
  const slug = "/islamic-discipline"; const title = "Islamic Discipline — Mastering Your Nafs Through Quran and Sunnah"; const desc = "How Islam builds true discipline: taming the nafs, overcoming laziness, building willpower through ibadah, and the Prophetic model of self-mastery.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Habits", item: "/islamic-habits" }, { name: "Islamic Discipline" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How does Islam build discipline?", "Islamic discipline (dabt an-nafs) begins with recognising the nafs al-ammarah — the soul that commands you toward desires and away from discipline. Salah builds discipline by imposing 5 non-negotiable appointments with Allah. Fasting (especially Ramadan) proves that the body can be mastered by the will. The Prophet ﷺ said: 'The strong man is not the one who can wrestle — the strong man is the one who controls himself when angry.' (Bukhari)")}
<h2>The Islamic Model of Self-Mastery</h2>
<p style="color:#a0c8a0;line-height:1.8">Islam doesn't call it 'self-discipline' — it calls it Mujahadah (spiritual struggle) and Zuhd (detachment from desires). The nafs has three stages: Ammarah (commanding toward evil), Lawwamah (self-reproaching when it fails), and Mutma'innah (at rest with Allah's will). The entire spiritual journey is the progression through these stages. Every act of discipline is a step from the first stage toward the third.</p>
${listCards([
  ["Salah: The 5-Times Daily Practice", "Fajr before sunrise requires the highest discipline. Maintaining all five prayers is itself a complete discipline training programme — more rigorous than most gym routines."],
  ["Fasting: The Master Discipline", "Ramadan proves that the body is not the master — the will and the deen are. The habit of control built through fasting transfers to every other area of life."],
  ["Waking for Tahajjud: The Ultimate Test", "When the Shaytan tells you to sleep, and you get up anyway — this is Mujahadah. This is what builds the nafs that can be trusted."],
  ["Lowering the Gaze: Micro-Discipline", "Every time you lower your gaze from haram, you strengthen the muscle of self-control. Small disciplines compound into large ones."],
  ["Following Through on Commitments", "The Quran says: 'O you who believe, fulfil your obligations' (5:1). A Muslim is someone whose word can be trusted — and that starts with yourself."],
])}
${relatedArticlesGrid(HABITS_RELATED)}
${emotionalCTA({ title: "Track Your Discipline in MyTazki", subtitle: "Salah tracker, tasbih counter, streak system — build the discipline of a lifetime with daily accountability.", href: "/download", btnText: "Start Building Discipline →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 2. Gratitude in Islam ────────────────────────────────────────────────────
router.get("/gratitude-in-islam", (_req, res) => {
  const slug = "/gratitude-in-islam"; const title = "Gratitude in Islam — The Shukr Practice That Multiplies Blessings"; const desc = "How Islam cultivates gratitude (shukr): Allah's promise to increase those who are grateful, the daily gratitude practices from Sunnah, and how Alhamdulillah changes your life.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Habits", item: "/islamic-habits" }, { name: "Gratitude in Islam (Shukr)" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What does Islam say about gratitude?", "Allah makes a direct promise about gratitude: 'If you are grateful, I will give you more' (14:7). This is one of the few places where Allah promises a specific outcome in response to a specific action. Gratitude in Islam (shukr) has three components: (1) Feeling grateful in the heart — recognising the source of all blessings is Allah. (2) Expressing it with the tongue — Alhamdulillah. (3) Acting on it with the limbs — using blessings in obedience to Allah.")}
<h2>Daily Gratitude Practices from the Sunnah</h2>
${listCards([
  ["Alhamdulillah — 33 Times After Prayer", "After every salah, reciting Alhamdulillah 33 times is a direct gratitude practice repeated 165 times daily. This is not just tradition — it is a systematic reprogramming of how you see the world."],
  ["The Morning 'Alive' Dua", "'Alhamdulillahil ladhi ahyana ba'da ma amatana wa ilayhin nushur' — the first words after waking. You are explicitly thanking Allah for another day before anything else enters your mind."],
  ["Bismillah Before Everything", "Saying Bismillah before eating, drinking, and beginning any action is a constant acknowledgement that the blessing of this action comes from Allah."],
  ["Shukr for Specific Blessings", "The Prophet ﷺ said: 'Whoever is not grateful for small things is not grateful for large things.' Develop the practice of naming specific blessings — not 'Alhamdulillah for everything' but 'Alhamdulillah for this warm meal, this working hand, this moment of clarity.'"],
  ["Gratitude Journaling (Islamic Style)", "Write 3 things daily that Allah gave you without you asking. Not big things — small ones. Barakah is found in noticing what was always there."],
])}
<h2>The Neuroscience of Shukr</h2>
<p style="color:#a0c8a0;line-height:1.8">Research consistently shows that gratitude practices — listing specific blessings, expressing thanks — increase dopamine and serotonin, reduce anxiety, and improve sleep quality. What Islam prescribed 1400 years ago as Shukr, modern psychology is now calling 'gratitude journaling' and 'positive psychology.' The Muslim has a theological framework that makes gratitude not just useful but obligatory — and that deepens its effect.</p>
${relatedArticlesGrid(HABITS_RELATED)}
${emotionalCTA({ title: "Practice Shukr Daily in MyTazki", subtitle: "Morning azkar, daily Alhamdulillah practices, and gratitude-focused sessions — all in one app.", href: "/download", btnText: "Start Gratitude Practice →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 3. Islamic Sleep Routine ─────────────────────────────────────────────────
router.get("/islamic-sleep-routine", (_req, res) => {
  const slug = "/islamic-sleep-routine"; const title = "Islamic Sleep Routine — Sunnah Sleep Practices for Rest and Protection"; const desc = "The Prophet's ﷺ complete sleep routine: duas before bed, sleeping position, what to recite, Sunnah of Qaylula, and how Islamic sleep hygiene improves rest.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Habits", item: "/islamic-habits" }, { name: "Islamic Sleep Routine" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is the Islamic bedtime routine from the Sunnah?", "The Prophet's ﷺ sleep Sunnah: (1) Sleep after Isha — no unnecessary conversation. (2) Make wudu before sleeping. (3) Sleep on your right side (facing the qibla). (4) Recite the Mu'awwidhat (Surahs 112, 113, 114) 3 times, blow on your hands, wipe your body. (5) Recite Ayatul Kursi. (6) Say the sleep dua: 'Bismika Allahumma amutu wa ahya.' (7) Recite Subhanallah (33×), Alhamdulillah (33×), Allahu Akbar (34×) — Fatima's tasbeeh.")}
<h2>Complete Prophetic Sleep Checklist</h2>
${listCards([
  ["✓ Sleep after Isha", "The Prophet ﷺ disliked conversation after Isha prayer. This creates the clear boundary modern sleep science calls 'sleep hygiene.' Consistent bedtime = better sleep quality."],
  ["✓ Make wudu before sleeping", "The Prophet ﷺ said: 'If you go to your bed, make wudu as you would for prayer, then lie on your right side.' The purity of wudu carries spiritual protection through the night."],
  ["✓ Recite the bedtime duas", "'Bismika Allahumma amutu wa ahya' (In Your name, O Allah, I die and I live). This acknowledges that sleep is a form of minor death and waking is a gift."],
  ["✓ Recite the Mu'awwidhat (×3)", "Surahs 112, 113, 114 — read 3 times, blow on the palms, and wipe over the body front and back. The Prophet ﷺ did this every night. These surahs provide comprehensive spiritual protection."],
  ["✓ Ayatul Kursi before sleep", "'Whoever recites Ayatul Kursi before sleeping, Allah will appoint an angel to protect them and Shaytan will not come near them until morning.' (Bukhari)"],
  ["✓ Fatima's Tasbeeh before sleep", "SubhanAllah ×33, Alhamdulillah ×33, Allahu Akbar ×34. The Prophet ﷺ taught this to Fatima RA when she asked for a servant — this dhikr would be better for her than a servant."],
  ["✓ Sleep on your right side", "Modern sleep research confirms right-side sleeping is optimal for heart health and digestion. The Prophet ﷺ recommended this 1400 years ago."],
])}
${relatedArticlesGrid(HABITS_RELATED)}
${emotionalCTA({ title: "Set Your Evening Azkar in MyTazki", subtitle: "Evening azkar, sleep duas, and bedtime reminders — the complete Islamic nighttime companion.", href: "/download", btnText: "Set Evening Routine →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 4. Islamic Time Management ───────────────────────────────────────────────
router.get("/islamic-time-management", (_req, res) => {
  const slug = "/islamic-time-management"; const title = "Islamic Time Management — Barakah in Your Hours and Days"; const desc = "How Islam views and manages time: the 5 daily prayers as a time system, the concept of barakah in time, and practical Sunnah-based productivity principles.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Habits", item: "/islamic-habits" }, { name: "Islamic Time Management" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How does Islam manage time productively?", "Islam's time management system is built on five pillars: the five daily prayers. Fajr starts the day with worship. Dhuhr breaks the work day. Asr marks the afternoon shift. Maghrib transitions to evening. Isha closes the day. These five anchors create a structured rhythm that modern productivity science calls 'time blocking.' Within this framework: early morning work (after Fajr) has prophetic blessing, Qaylula (midday rest) is Sunnah, and post-Isha hours are protected for sleep.")}
<h2>The Islamic Time Blocking System</h2>
${listCards([
  ["Fajr to Dhuhr — The Golden Block", "The Prophet ﷺ said: 'O Allah, bless my ummah in its early morning hours.' This is the most blessed time for work, study, and creative endeavour. Protect it — no social media, no news."],
  ["Dhuhr — The Reset", "Dhuhr prayer breaks the morning's intensity. The 5-minute prayer transition allows cognitive rest. After Dhuhr: a 20-minute Qaylula (if possible) before the afternoon's work."],
  ["Dhuhr to Asr — The Focus Block", "The second work block. Often less creative than the morning but excellent for systematic, focused work. Protect from unnecessary meetings if possible."],
  ["Asr to Maghrib — The Transition", "The Prophet ﷺ warned about missing Asr. Praying Asr on time anchors this transition. Evening plans begin to form. Family time takes priority in this block."],
  ["Maghrib to Isha — The Light Hours", "Family dinner, children's homework, community interaction. The Prophet ﷺ would sit with his companions and community in this window."],
  ["After Isha — Protected", "The Prophet ﷺ disliked conversation after Isha. This is sleep preparation time — reading, reflection, preparation for the next day, and the sleep Sunnah."],
])}
${relatedArticlesGrid(HABITS_RELATED)}
${emotionalCTA({ title: "Structure Your Day Around Salah in MyTazki", subtitle: "Prayer time notifications, morning and evening azkar reminders, and daily habit tracking.", href: "/download", btnText: "Start Islamic Time System →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 5. 30-Day Islamic Challenge ──────────────────────────────────────────────
router.get("/30-day-islamic-challenge", (_req, res) => {
  const slug = "/30-day-islamic-challenge"; const title = "30-Day Islamic Growth Challenge — One Month to Transform Your Deen"; const desc = "A 30-day Islamic growth challenge with one daily practice. Salah, Quran, azkar, charity, connection, and self-reflection — building a complete Islamic lifestyle.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Habits", item: "/islamic-habits" }, { name: "30-Day Islamic Challenge" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How can I improve my deen in 30 days?", "The Prophet ﷺ said the most beloved deeds to Allah are those done consistently, even if small. This 30-day challenge adds one practice per day — not replacing existing ones, but layering new ones. By Day 30, you have 30 new Islamic practices integrated into your life. The compound effect of consistent small actions is profound.")}
<h2>Week 1 — Salah Foundation (Days 1-7)</h2>
${listCards([
  ["Day 1 — Log Every Prayer", "Begin tracking all 5 prayers in MyTazki. Every prayer today, logged. This is awareness week."],
  ["Day 2 — Pray on Time", "Every prayer today at its earliest time. No delays. Feel the difference."],
  ["Day 3 — Add 2 Sunnah Rakaats", "Pray the 2 Sunnah before Fajr every day this week. Small addition, large reward."],
  ["Day 4 — Khushu Practice", "In today's Dhuhr, slow down every movement to double its normal duration. Feel each position."],
  ["Day 5 — Fajr in Masjid", "If possible, attend Fajr in the mosque. If not, pray in a dedicated prayer space at home."],
  ["Day 6 — Salah with Understanding", "Before Dhuhr, read the translation of all the duas in salah. Then pray them knowing what you're saying."],
  ["Day 7 — Reflection", "How did Week 1 change your relationship with salah? Write it down."],
])}
<h2>Week 2 — Quran Connection (Days 8-14)</h2>
${listCards([
  ["Day 8 — One Page After Fajr", "Today begins your daily Quran habit. One page, every morning, after Fajr."],
  ["Day 9 — Memorise 1 New Verse", "Choose one short verse to memorise. Recite it in salah tonight."],
  ["Day 10 — Surah Al-Kahf", "Read the full Surah Al-Kahf today (it's Friday — or treat it as a Friday reminder)."],
  ["Day 11 — Tafsir Exploration", "Read the tafsir of one verse that has always confused or moved you."],
  ["Day 12 — Listen to Recitation", "Play Sheikh Alafasy's recitation during your commute or chores. Passive Quran exposure."],
  ["Day 13 — Teach Something", "Share one Quran verse with a family member or friend today. Teaching deepens learning."],
  ["Day 14 — Reflection", "How has your relationship with the Quran changed? What verse spoke to you most?"],
])}
<h2>Week 3 — Dhikr and Dua (Days 15-21)</h2>
${listCards([
  ["Day 15 — Morning Azkar", "Complete the full morning azkar today. All of them. See how it changes your morning."],
  ["Day 16 — 100 Astaghfirullah", "Today, say Astaghfirullah 100 times throughout the day — in traffic, walking, waiting."],
  ["Day 17 — Dua from the Heart", "After Isha, spend 10 minutes making personal dua in your own words, about everything."],
  ["Day 18 — Evening Azkar", "Complete the full evening azkar tonight. Set a reminder in MyTazki for tomorrow."],
  ["Day 19 — Tasbeeh 33-33-34", "After every prayer today: SubhanAllah ×33, Alhamdulillah ×33, Allahu Akbar ×34."],
  ["Day 20 — Dua for Others", "Today's entire dua session: pray only for others. Not yourself. Notice what happens."],
  ["Day 21 — Reflection", "Week 3 check-in: which dhikr practice are you keeping permanently?"],
])}
<h2>Week 4 — Character and Community (Days 22-30)</h2>
${listCards([
  ["Day 22 — Sadaqa", "Give charity today — any amount. Track its impact on your heart."],
  ["Day 23 — Silat ur-Rahm", "Call a family member you haven't spoken to recently. Just to check in."],
  ["Day 24 — Forgiveness", "Forgive someone today — in your heart if not in person. Write it down."],
  ["Day 25 — Gratitude List", "List 25 things Allah has given you that you didn't ask for."],
  ["Day 26 — Fast (Optional Sunnah)", "Keep a voluntary Monday or Thursday fast. Feel what fasting does to your iman."],
  ["Day 27 — Smile as Sadaqa", "The Prophet ﷺ said smiling at your brother is sadaqa. Today, smile intentionally."],
  ["Day 28 — Islamic Learning", "Read one article, listen to one lecture, or attend one Islamic class today."],
  ["Day 29 — Review and Plan", "Review all 28 days. What changed? What will you continue? Write your plan."],
  ["Day 30 — Covenant", "Make a written commitment: the 5 practices from this challenge you will never stop."],
])}
${relatedArticlesGrid(HABITS_RELATED)}
${emotionalCTA({ title: "Track Your 30-Day Challenge in MyTazki", subtitle: "Salah tracker, streak counter, azkar library, Quran reader — everything for your 30-day transformation.", href: "/download", btnText: "Start 30-Day Challenge →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 6. Evening Azkar Routine ─────────────────────────────────────────────────
router.get("/evening-azkar-routine", (_req, res) => {
  const slug = "/evening-azkar-routine"; const title = "Evening Azkar Routine — The Prophetic Evening Remembrances"; const desc = "The complete evening azkar (adhkar al-masa) from authentic Sunnah: what to recite, how many times, meaning, and how to build the evening remembrance habit.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Habits", item: "/islamic-habits" }, { name: "Evening Azkar Routine" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What are the evening azkar and when should I recite them?", "The evening azkar (Adhkar al-Masa) should be recited from Asr until sunset (the Prophet ﷺ said 'evening' begins from this time). Key evening azkar: 'A'udhu bikalimati Allahit-tammati min sharri ma khalaq' (×3) — protection from all harm. 'Bismillahil-ladhi la yadurru ma'asmihi shay'un' (×3) — nothing harms the one who says this. Ayatul Kursi (×1). Surahs 112, 113, 114 (×3 each). SubhanAllah (×33), Alhamdulillah (×33), Allahu Akbar (×34).")}
<h2>The Complete Evening Azkar List</h2>
<div style="display:flex;flex-direction:column;gap:14px;margin:16px 0">
${[
  ["أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", "A'udhu bikalimati Allahit-tammati min sharri ma khalaq", "I seek refuge in the perfect words of Allah from the evil of what He created", "Recite 3 times — protects from all harm until morning (Tirmidhi)"],
  ["بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ", "Bismillahil-ladhi la yadurru ma'asmihi shay'un", "In the name of Allah, with whose name nothing can cause harm", "Recite 3 times — comprehensive protection formula (Abu Dawud)"],
  ["اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", "Allahu la ilaha illa huwal-Hayyul-Qayyum", "Ayatul Kursi — the greatest verse in the Quran", "Recite once — angel protection until morning (Bukhari)"],
].map(([arabic, trans, meaning, note]) => `<div style="background:rgba(52,201,122,0.05);border-radius:10px;padding:16px 20px;border:1px solid rgba(52,201,122,0.12)">
  <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.4em;line-height:2;margin:0 0 6px">${arabic}</p>
  <p style="color:#34c97a;font-style:italic;font-size:13px;margin:0 0 4px;font-family:Inter,sans-serif">${esc(trans)}</p>
  <p style="color:#eaf4ee;font-size:13px;margin:0 0 6px;font-family:Inter,sans-serif">${esc(meaning)}</p>
  <p style="color:#4a6858;font-size:12px;margin:0;font-family:Inter,sans-serif">${esc(note)}</p>
</div>`).join("")}
</div>
${relatedArticlesGrid(HABITS_RELATED)}
${emotionalCTA({ title: "Evening Azkar with Audio in MyTazki", subtitle: "Complete evening azkar with Arabic text, transliteration, meaning, and audio — step by step.", href: "/download", btnText: "Open Evening Azkar →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 7. Halal Productivity ────────────────────────────────────────────────────
router.get("/halal-productivity", (_req, res) => {
  const slug = "/halal-productivity"; const title = "Halal Productivity — The Muslim's Guide to Purposeful Achievement"; const desc = "A complete halal productivity framework for Muslims: working for akhira, Sunnah productivity principles, barakah in work, avoiding haram shortcuts, and Islamic goal-setting.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Islamic Habits", item: "/islamic-habits" }, { name: "Halal Productivity" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is halal productivity in Islam?", "Halal productivity means working in a way that is: (1) Halal in means — no riba, deception, or haram shortcuts. (2) Intentional in purpose — every action as worship ('for the sake of Allah'). (3) Balanced — the Prophet's model of work, prayer, rest, family, and community. (4) Blessed — seeking barakah from Allah through Bismillah, salah, sadaqa, and dhikr. The goal is not maximum output but maximum meaningful impact, in both dunya and akhira.")}
<h2>The 5 Principles of Halal Productivity</h2>
${listCards([
  ["1. Niyyah (Intention) First", "The Prophet ﷺ said: 'Actions are judged by their intentions.' Before every work task: 'I do this to provide for my family, to fulfil my obligations, and as an act of worship to Allah.' This single shift turns ordinary work into ibadah."],
  ["2. Barakah-Seeking Habits", "Barakah (divine blessing that multiplies) is real and accessible. Open every work session with Bismillah. Give sadaqa regularly (increases wealth, not decreases it — hadith). Maintain salah times — they are barakah anchors, not productivity interruptions."],
  ["3. Tawakkul After Action", "The Prophet ﷺ said: 'Tie your camel, then put your trust in Allah.' Do the work (ikhtiyar), do your best, then release the outcome to Allah (tawakkul). This removes the anxiety of outcomes that were never in your control."],
  ["4. Haram-Free Business", "No riba (interest). No deception. No bribery. No exploitation. Islam's business ethics are strict — and they protect both the soul and the long-term business. The Prophet ﷺ was known as 'Al-Amin' (The Trustworthy) long before prophethood."],
  ["5. Regular Reflection and Muhasabah", "Before each week, review the last. What was productive, what was wasted? Umar RA said: 'Hold yourself accountable before you are held accountable.' Weekly muhasabah (self-audit) is the Islamic performance review."],
])}
${relatedArticlesGrid(HABITS_RELATED)}
${emotionalCTA({ title: "Build a Purposeful Productive Life with MyTazki", subtitle: "Prayer tracking, streak building, and daily intention-setting — the halal productivity companion.", href: "/download", btnText: "Start Productive Deen →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

export default router;
