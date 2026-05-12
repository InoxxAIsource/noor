import { Router } from "express";
import { seoHead, page, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, ctaBlock, esc } from "./shared.js";
import { quickAnswerBox, peopleAlsoAsk, emotionalCTA, nextStepsBlock, relatedArticlesGrid, conversationalBlock } from "./seo-components.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function journeySchema(title: string, desc: string, slug: string, days: number): object {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": desc,
    "url": `https://mytazki.com${slug}`,
    "provider": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "duration": `P${days}D`,
    },
    "dateModified": TODAY,
  };
}

function dayCard(day: number, title: string, practice: string, duration: string, dhikr?: string): string {
  return `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:14px;padding:20px;margin:12px 0;display:flex;gap:16px;align-items:flex-start">
  <div style="background:rgba(52,201,122,0.1);border:1px solid rgba(52,201,122,0.2);border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
    <span style="color:#34c97a;font-weight:800;font-family:DM Sans,Inter,sans-serif;font-size:15px">${day}</span>
  </div>
  <div style="flex:1">
    <strong style="color:#eaf4ee;font-size:16px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${esc(title)}</strong>
    <p style="color:#6a9878;font-size:14px;margin:0 0 8px;line-height:1.6;font-family:Inter,sans-serif">${esc(practice)}</p>
    ${dhikr ? `<p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.1em;line-height:2;margin:8px 0 4px">${dhikr}</p>` : ""}
    <span style="color:#34c97a;font-size:12px;font-family:Inter,sans-serif">⏱ ${esc(duration)}</span>
  </div>
</div>`;
}

// ─── Journey 1: 7-Day Inner Peace ────────────────────────────────────────────
router.get("/7-day-inner-peace-journey", (_req, res) => {
  const slug = "/7-day-inner-peace-journey";
  const title = "7-Day Inner Peace Journey — Islamic Guided Program";
  const desc = "A 7-day guided Islamic program to restore inner peace through Quran, dua, dhikr, and salah. For the anxious, overwhelmed, and spiritually tired Muslim.";
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Mental Wellness", item: "/mental-wellness" },
    { name: "7-Day Inner Peace Journey" },
  ];
  const body = `
${breadcrumb(breadcrumbs)}

<div style="text-align:center;padding:40px 0 32px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <span style="background:rgba(184,148,106,0.12);color:#b8946a;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase">7-Day Guided Journey</span>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;margin:18px 0 14px;line-height:1.2">7-Day Inner Peace Journey</h1>
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.5rem;margin:0 0 8px;line-height:1.8">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 20px">Verily, in the remembrance of Allah do hearts find rest — Quran 13:28</p>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;max-width:580px;margin:0 auto;font-family:Inter,sans-serif">A structured 7-day program for Muslims struggling with anxiety, worry, or spiritual disconnect. Each day includes one practice, one dua, one Quran verse, and a reflection question. Small, consistent steps — because that is what Allah loves most.</p>
</div>

${quickAnswerBox("How can I find peace in Islam?", "Inner peace in Islam comes through three things working together: dhikr (remembrance of Allah), salah (direct conversation with Allah), and tawakkul (complete trust in Allah's plan). This 7-day journey gives you a structured daily practice in each area, building momentum from the first morning.")}

<h2>How This Journey Works</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0 32px">
  ${[
    ["📅", "7 days", "One focused practice per day"],
    ["⏱", "15–20 min", "Daily commitment"],
    ["🤲", "Dua", "One authenticated dua per day"],
    ["📖", "Quran", "One verse to reflect on daily"],
    ["💭", "Reflection", "One question to journal"],
  ].map(([icon, label, desc]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:16px;text-align:center">
    <div style="font-size:22px;margin-bottom:8px">${icon}</div>
    <strong style="color:#eaf4ee;font-size:14px;display:block;font-family:DM Sans,Inter,sans-serif">${label}</strong>
    <span style="color:#4a6858;font-size:12px;font-family:Inter,sans-serif">${desc}</span>
  </div>`).join("")}
</div>

<h2>Your 7-Day Program</h2>

${dayCard(1, "Day 1 — Begin with Intention (Niyyah)", "Write down your intention for this journey. What peace are you seeking? Where does the anxiety live? Make wudu, face the qibla, and recite: 'O Allah, I begin this journey seeking Your peace. Replace my worry with certainty, my anxiety with tawakkul.' Spend 5 minutes in complete silence after.", "15 minutes", "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ")}

${dayCard(2, "Day 2 — The Dua of the Distressed", "The Prophet ﷺ taught this dua specifically for worry and grief. Say it 7 times after Fajr and 7 times before sleep. Feel each word. Understand what you are asking. Today's reflection: What specific worry are you placing in Allah's hands today?", "20 minutes", "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ")}

${dayCard(3, "Day 3 — Surah Ad-Duha (The Morning Hours)", "Read Surah Ad-Duha after Fajr. Allah revealed it to the Prophet ﷺ when he was in his darkest moment of doubt and grief. Know that this surah was sent for you too. Read the translation slowly. Then read it again. Reflection: Where in your life has Allah come through before?", "20 minutes", "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَى")}

${dayCard(4, "Day 4 — Stillness: The Practice of Dhikr", "Set a timer for 15 minutes. Sit in stillness and repeat: 'Subhanallah' (33×), 'Alhamdulillah' (33×), 'Allahu Akbar' (33×), then 'La ilaha illallah' until the timer ends. No phone, no distractions. Notice how your nervous system responds to sacred repetition.", "20 minutes", "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ")}

${dayCard(5, "Day 5 — Night Prayer: Tahajjud", "Tonight, set an alarm for 45 minutes before Fajr. Wake up, make wudu, and pray 2 rakaats of tahajjud. You don't need special words — just pray and then sit and talk to Allah in your own language. This is the most intimate conversation a human being can have. Reflection: What do you most want to say to Allah?", "30 minutes")}

${dayCard(6, "Day 6 — Gratitude Inventory", "Write down 10 things Allah has given you that you didn't ask for. Not big things — small ones: a meal, a heartbeat, the ability to read this. Then recite Surah Ar-Rahman and respond to each 'Fabi'ayyi alaa'i rabbikuma tukadhdhibaan' with 'La bi shay'in min ala'ika rabbana nukadhdhibu' (We deny none of Your favours, our Lord).", "20 minutes", "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ")}

${dayCard(7, "Day 7 — Renewal: Making It Permanent", "On the final day, choose ONE practice from the last 7 days to continue permanently. Make a written commitment. Tell someone you trust. Open MyTazki and set a daily reminder. The Prophet ﷺ said: 'The most beloved deeds to Allah are those done consistently, even if small.' Reflection: What version of yourself do you want to become?", "20 minutes", "وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ")}

${nextStepsBlock([
  { href: "/dua-for-anxiety", label: "Dua for Anxiety — Full Guide", desc: "The duas you used this week, with full Arabic, transliteration, and meaning" },
  { href: "/tahajjud-for-anxiety", label: "Tahajjud for Anxiety", desc: "Go deeper into the night prayer practice from Day 5" },
  { href: "/reconnect-with-allah-journey", label: "14-Day: Reconnect with Allah Journey", desc: "Continue your journey with a deeper 14-day program" },
  { href: "/download", label: "Track Your Progress in MyTazki", desc: "Streaks, azkar, duas, sessions — all in one app" },
], "Continue After Day 7")}

${relatedArticlesGrid([
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", desc: "All the duas from this journey", tag: "Dua" },
  { href: "/tahajjud-for-anxiety", label: "Tahajjud for Anxiety", desc: "Deepen Day 5's practice", tag: "Prayer" },
  { href: "/surah-duha-reflection", label: "Surah Ad-Duha Reflection", desc: "Day 3 in depth", tag: "Quran" },
  { href: "/emotional-healing-in-islam", label: "Emotional Healing in Islam", desc: "The complete framework", tag: "Healing" },
  { href: "/morning-barakah-routine", label: "Morning Barakah Routine", desc: "Build on this journey", tag: "Habit" },
  { href: "/mental-wellness", label: "Islamic Mental Wellness Hub", desc: "All mental wellness guides", tag: "Hub" },
], "Related Guides")}

${peopleAlsoAsk([
  { q: "How do I find peace of mind in Islam?", a: "Peace of mind (itmi'nan) comes through consistent dhikr, salah, Quran recitation, and tawakkul. This 7-day journey provides a structured path: start with intention, practice the prophetic dua for worry, read Surah Ad-Duha, and end with a permanent daily habit." },
  { q: "Is there an Islamic cure for anxiety?", a: "Islam doesn't promise an anxiety-free life — it promises that you will never face it alone. The tools: dua (supplication), salah (prayer), dhikr (remembrance), Quran recitation, seeking community, and professional help when needed. These work in combination, not isolation." },
  { q: "How long does this journey take each day?", a: "Each day requires 15-20 minutes. Day 5 (tahajjud) requires waking earlier than usual, so prepare the night before. The practices are designed to be integrated into existing routines — attached to Fajr or Isha." },
])}

${emotionalCTA({ title: "Continue Your Journey with MyTazki", subtitle: "Guided audio sessions, daily azkar, duas library, and an AI Islamic companion — everything to support your peace.", href: "/download", btnText: "Download MyTazki Free →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [journeySchema(title, desc, slug, 7), breadcrumbSchema(breadcrumbs), faqSchema([{ q: "How do I find peace of mind in Islam?", a: "Through dhikr, salah, Quran, and tawakkul practiced consistently." }])] }), body));
});

// ─── Journey 2: Reconnect with Allah ─────────────────────────────────────────
router.get("/reconnect-with-allah-journey", (_req, res) => {
  const slug = "/reconnect-with-allah-journey";
  const title = "Reconnect with Allah — 14-Day Spiritual Rebuilding Journey";
  const desc = "Feel disconnected from Allah? This 14-day guided Islamic journey rebuilds your relationship with Allah through daily Quran, dua, salah, and reflection practices.";
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Mental Wellness", item: "/mental-wellness" },
    { name: "Reconnect with Allah Journey" },
  ];
  const body = `
${breadcrumb(breadcrumbs)}

<div style="text-align:center;padding:40px 0 32px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <span style="background:rgba(184,148,106,0.12);color:#b8946a;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase">14-Day Guided Journey</span>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;margin:18px 0 14px;line-height:1.2">Reconnect with Allah</h1>
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.5rem;margin:0 0 8px;line-height:1.8">وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 20px">When My servants ask you about Me, I am near — Quran 2:186</p>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;max-width:580px;margin:0 auto;font-family:Inter,sans-serif">For the Muslim who feels their heart has gone cold, their prayers feel empty, or they've drifted away. Allah never moved — this journey helps you walk back to Him, step by step, over 14 days.</p>
</div>

<h2>Week 1 — Remove the Barriers</h2>
<p style="color:#6a9878;font-family:Inter,sans-serif;line-height:1.7;margin-bottom:20px">The first week is about clearing what blocks you from feeling close to Allah: sins, distractions, negative self-talk, and broken routines.</p>
${dayCard(1, "Tawbah — Sincere Repentance", "Write down what you feel has distanced you from Allah. Be honest. Then make a full ghusl (if applicable), pray 2 rakaats of tawbah, and say Astaghfirullah 100 times. Know that the Prophet ﷺ said: 'All the children of Adam make mistakes, and the best of those who make mistakes are those who repent.' (Tirmidhi)", "20 minutes", "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ")}
${dayCard(2, "Al-Fatiha — The Opening", "Pray every salah today and pause at Al-Fatiha. Read the meaning of each verse before reciting it. Al-Fatiha is a conversation — Allah responds to each verse you say. Know that He hears.", "Ongoing through the day")}
${dayCard(3, "Digital Detox for Iman", "Remove social media for today. Use that time — 2 hours minimum — for Quran and dhikr only. Notice how different you feel. Notice what thoughts arise. Journal them.", "2+ hours")}
${dayCard(4, "The Quran Opens a Door", "Read Surah Al-Inshirah (94) 10 times and Surah Ad-Duha (93) 10 times. These were sent in the Prophet's ﷺ darkest hour. They are permission to feel low and still be loved by Allah.", "15 minutes", "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ")}
${dayCard(5, "Gratitude Audit", "Sit for 15 minutes and list 25 blessings you take for granted. Air. Eyes. A working heart. A mind that can read these words. Then say Alhamdulillah 100 times with full presence.", "20 minutes", "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ")}
${dayCard(6, "Make Dua in Your Own Words", "Tonight after Isha, sit alone and talk to Allah in your own language. No formal Arabic required. Just speak from your heart — your fears, your hopes, your longing for closeness. He understands every language.", "15 minutes")}
${dayCard(7, "Rest and Review", "Rest today from new practices. Re-read your journal entries from Days 1-6. Where did you feel closest to Allah? Plan to repeat that practice in Week 2.", "15 minutes")}

<h2>Week 2 — Build the Connection</h2>
<p style="color:#6a9878;font-family:Inter,sans-serif;line-height:1.7;margin-bottom:20px">With the barriers lowered, Week 2 builds positive spiritual momentum through consistent practice and emotional deepening.</p>
${dayCard(8, "Establish Fajr", "If Fajr is your weakest prayer, make it your anchor this week. Sleep earlier. Set two alarms. Prepare your prayer mat the night before. The Prophet ﷺ said Fajr prayer is witnessed by the angels.", "Fajr prayer daily")}
${dayCard(9, "Learn One Name of Allah", "Study one Name of Allah deeply today — Al-Qarib (The Near One). Read its meaning, examples in the Quran, and how it applies to your life. Repeat it 100 times: 'Ya Qarib.'", "20 minutes", "يَا قَرِيبُ")}
${dayCard(10, "Sadaqa for Barakah", "Give charity today — even a small amount. The Prophet ﷺ said charity does not decrease wealth. Notice what happens in your heart when you give for Allah's sake only.", "Any amount")}
${dayCard(11, "Salah with Presence", "Pray every salah today as if it is your last. Before each prayer, say: 'I am standing before Allah. He sees me. He hears me.' Slow down your movements. Feel the sujood.", "Full day practice")}
${dayCard(12, "Tahajjud Night", "Set your alarm for the last third of the night. Pray 4 rakaats of tahajjud. Make dua for 10 minutes after. The Prophet ﷺ said: 'Our Lord descends each night to the lowest heaven and says: Is there anyone calling upon Me, that I may answer him?'", "45 minutes pre-Fajr")}
${dayCard(13, "Dhikr Walk", "Go for a 20-minute walk and do dhikr the entire time. 'SubhanAllah' with each step. When you return, feel how your surroundings connect to Allah — the trees, the sky, the people, all created by Him.", "20 minutes")}
${dayCard(14, "Covenant Day", "On Day 14, make a written covenant with yourself and Allah. List the 3 practices from this journey you will continue permanently. Commit in writing. Download MyTazki to track them. Know that you are not the same person who started Day 1.", "30 minutes")}

${relatedArticlesGrid([
  { href: "/7-day-inner-peace-journey", label: "7-Day Inner Peace Journey", tag: "Journey" },
  { href: "/how-to-connect-with-allah", label: "How to Connect with Allah", tag: "Guide" },
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Dua" },
  { href: "/tahajjud-for-anxiety", label: "Tahajjud Practice", tag: "Prayer" },
  { href: "/morning-barakah-routine", label: "Morning Barakah Routine", tag: "Habit" },
  { href: "/mental-wellness", label: "Mental Wellness Hub", tag: "Hub" },
], "Continue Your Journey")}

${emotionalCTA({ title: "Keep Building the Connection", subtitle: "MyTazki tracks your salah, azkar, and streaks so you can see your spiritual growth day by day.", href: "/download", btnText: "Start Tracking Your Deen →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [journeySchema(title, desc, slug, 14), breadcrumbSchema(breadcrumbs)] }), body));
});

// ─── Journey 3: 7-Day Salah Reset ────────────────────────────────────────────
router.get("/7-day-salah-reset", (_req, res) => {
  const slug = "/7-day-salah-reset";
  const title = "7-Day Salah Reset — Rebuild Your Prayer Habit from Scratch";
  const desc = "Missing salah consistently? This 7-day guided reset rebuilds your prayer habit from zero — one prayer at a time. Practical, compassionate, and rooted in Sunnah.";
  const breadcrumbs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "7-Day Salah Reset" }];
  const body = `
${breadcrumb(breadcrumbs)}

<div style="text-align:center;padding:40px 0 32px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <span style="background:rgba(184,148,106,0.12);color:#b8946a;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase">7-Day Prayer Reset</span>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;margin:18px 0 14px;line-height:1.2">7-Day Salah Reset</h1>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;max-width:580px;margin:0 auto;font-family:Inter,sans-serif">This is not about guilt. It is about returning. The Prophet ﷺ said the first thing we will be asked about on the Day of Judgement is salah. This 7-day reset gives you a compassionate, practical system to rebuild — starting from exactly where you are.</p>
</div>

${quickAnswerBox("How do I start praying again after missing salah for years?", "Begin with sincere tawbah (repentance) — Allah forgives all sins. Then start with ONE prayer: choose the prayer you're most likely to manage, and commit to praying it consistently for 7 days. Once that prayer is anchored, add the next one. Don't try to fix everything at once. This 7-day reset is designed for exactly this situation.")}

${dayCard(1, "Day 1 — Tawbah & One Prayer", "Make sincere tawbah for missed prayers. Then commit to ONE prayer today — whichever is easiest for your schedule. Just one. Pray it with full presence. Log it in MyTazki.", "5 minutes")}
${dayCard(2, "Day 2 — Add Your Second Prayer", "Yesterday's prayer becomes a habit. Today add a second prayer from the remaining four. Set phone reminders for both. The goal: two prayers, both prayed, both logged.", "10 minutes total")}
${dayCard(3, "Day 3 — Learn the Meaning of Al-Fatiha", "Today read the translation of Al-Fatiha and understand each line. When you pray, you will now know you are saying: 'Guide us to the straight path.' You are not just reciting — you are speaking.", "15 minutes learning")}
${dayCard(4, "Day 4 — Add Fajr (The Key Prayer)", "Fajr is the hardest and most important prayer. Sleep 30 minutes earlier. Set two alarms. Prepare your prayer mat and wudu water the night before. When you pray Fajr, the Prophet ﷺ said the angels witness it.", "Fajr prayer")}
${dayCard(5, "Day 5 — All Five Prayers", "Today: all five prayers. Set five alarms. Fajr, Dhuhr, Asr, Maghrib, Isha. Don't worry about Sunnah prayers yet. Just the five fard. Log each one. You are building infrastructure.", "Full day practice")}
${dayCard(6, "Day 6 — Prayer with Presence", "Pray all five prayers, but today slow everything down. Between each position, pause for 2 seconds longer than usual. In sujood, ask for one specific thing. After prayer, sit for 60 seconds in silence.", "Full day practice")}
${dayCard(7, "Day 7 — The System", "Set up your long-term system: prayer time notifications on your phone, prayer mat in a visible location, MyTazki streak tracker active. Tell one person about your commitment. The accountability will carry you through the hard days.", "Setup day")}

${relatedArticlesGrid([
  { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah", tag: "Guide" },
  { href: "/how-to-wake-up-for-fajr", label: "How to Wake Up for Fajr", tag: "Fajr" },
  { href: "/why-salah-is-important", label: "Why Salah is Important", tag: "Foundation" },
  { href: "/missed-prayers-qada", label: "Making Up Missed Prayers", tag: "Fiqh" },
  { href: "/morning-barakah-routine", label: "Morning Barakah Routine", tag: "Habit" },
  { href: "/salah", label: "Salah Hub — All Guides", tag: "Hub" },
], "Salah Resources")}

${emotionalCTA({ title: "Track Every Prayer — Build Your Streak", subtitle: "MyTazki's salah tracker with khushu rating, reminders, and streak counter. The simplest way to build the habit.", href: "/download", btnText: "Start Salah Tracker →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [journeySchema(title, desc, slug, 7), breadcrumbSchema(breadcrumbs)] }), body));
});

// ─── Journey 4: Morning Barakah Routine ──────────────────────────────────────
router.get("/morning-barakah-routine", (_req, res) => {
  const slug = "/morning-barakah-routine";
  const title = "Morning Barakah Routine — The Islamic Morning System for a Blessed Day";
  const desc = "The complete Islamic morning routine: Fajr, morning azkar, Quran, dhikr, and intention setting. Based on Quran and Sunnah. Daily 30-minute system for barakah.";
  const breadcrumbs = [{ name: "Home", item: "/" }, { name: "Islamic Habits", item: "/islamic-habits" }, { name: "Morning Barakah Routine" }];
  const body = `
${breadcrumb(breadcrumbs)}

<div style="text-align:center;padding:40px 0 32px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <span style="background:rgba(184,148,106,0.12);color:#b8946a;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase">Daily Routine</span>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;margin:18px 0 14px;line-height:1.2">Morning Barakah Routine</h1>
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.5rem;margin:0 0 8px;line-height:1.8">بَارَكَ اللَّهُ فِي الْبُكُورِ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 20px">O Allah, bless my ummah in its early morning hours — Prophet ﷺ (Abu Dawud)</p>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;max-width:580px;margin:0 auto;font-family:Inter,sans-serif">The Prophet ﷺ specifically prayed for barakah in the early morning. This 30-minute daily system harnesses that barakah — structured, consistent, and spiritually nourishing.</p>
</div>

<h2>The Complete Morning Routine</h2>
<div style="display:flex;flex-direction:column;gap:14px;margin:16px 0 32px">
  ${[
    ["🌙", "Wake-up Dua (30 sec)", "Say: 'Alhamdulillahil ladhi ahyana ba'da ma amatana wa ilayhin nushur' — Praise be to Allah who revived us after causing us to die, and to Him is the resurrection. This is the first words on your lips each morning."],
    ["🚿", "Wudu (5 min)", "Make wudu with presence — not rushing. Say Bismillah before starting. The Prophet ﷺ said wudu washes away sins from the limbs it touches."],
    ["🕌", "Fajr Prayer (10 min)", "The anchor of the morning. Two fard rakaats and two Sunnah. Pray with slowness. In sujood, ask Allah specifically for the barakah you need today."],
    ["📿", "Morning Azkar (10 min)", "Recite the morning azkar: Ayatul Kursi (×1), Surah Ikhlas (×3), Surah Falaq (×3), Surah Nas (×3), SubhanAllah (×33), Alhamdulillah (×33), Allahu Akbar (×33). Available in MyTazki with audio."],
    ["📖", "One Page of Quran (5 min)", "Open to where you left off. Read one page with meaning. Consistency beats volume. One page daily = the full Quran in approximately 3 years."],
    ["💭", "Daily Intention (2 min)", "Write or say: 'Today, I intend to...' Set one focused intention for the day's work. Ask Allah to make it easy and blessed."],
  ].map(([icon, label, desc]) => `<div style="display:flex;gap:16px;background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px;padding:18px 16px;align-items:flex-start">
    <span style="font-size:22px;flex-shrink:0;margin-top:2px">${icon}</span>
    <div>
      <strong style="color:#34c97a;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${label}</strong>
      <p style="color:#6a9878;font-size:14px;margin:0;line-height:1.6;font-family:Inter,sans-serif">${desc}</p>
    </div>
  </div>`).join("")}
</div>

${relatedArticlesGrid([
  { href: "/islamic-night-routine", label: "Islamic Night Routine", desc: "Evening companion to morning routine", tag: "Evening" },
  { href: "/daily-muslim-routine", label: "Complete Daily Muslim Routine", tag: "Routine" },
  { href: "/dhikr-daily-habit", label: "Making Dhikr a Daily Habit", tag: "Dhikr" },
  { href: "/how-to-wake-up-for-fajr", label: "How to Wake Up for Fajr", tag: "Fajr" },
  { href: "/evening-azkar-routine", label: "Evening Azkar Routine", tag: "Azkar" },
  { href: "/islamic-habits", label: "Islamic Habits Hub", tag: "Hub" },
], "Related Habit Guides")}

${emotionalCTA({ title: "Start Your Morning Barakah Routine Today", subtitle: "Morning azkar, prayer tracker, Quran reader, and daily dhikr — all in the MyTazki morning flow.", href: "/download", btnText: "Open MyTazki Free →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [journeySchema(title, desc, slug, 30), breadcrumbSchema(breadcrumbs)] }), body));
});

// ─── Journey 5: Tahajjud Transformation ──────────────────────────────────────
router.get("/tahajjud-transformation-journey", (_req, res) => {
  const slug = "/tahajjud-transformation-journey";
  const title = "Tahajjud Transformation — 21-Night Journey to the Last Third of the Night";
  const desc = "A 21-night guided tahajjud journey. Build the night prayer habit, experience divine closeness, and transform your relationship with Allah in the quiet hours before Fajr.";
  const breadcrumbs = [{ name: "Home", item: "/" }, { name: "Salah", item: "/salah" }, { name: "Tahajjud Transformation Journey" }];
  const body = `
${breadcrumb(breadcrumbs)}

<div style="text-align:center;padding:40px 0 32px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <span style="background:rgba(184,148,106,0.12);color:#b8946a;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase">21-Night Journey</span>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;margin:18px 0 14px;line-height:1.2">Tahajjud Transformation</h1>
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.5rem;margin:0 0 8px;line-height:1.8">يَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 20px">Their sides forsake their beds, calling upon their Lord in fear and hope — Quran 32:16</p>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;max-width:580px;margin:0 auto;font-family:Inter,sans-serif">The last third of the night is when Allah descends to the lowest heaven and calls: "Is there anyone calling upon Me, that I may answer?" This 21-night journey teaches you to be there — consistently, heart open, ready to be heard.</p>
</div>

${quickAnswerBox("How do I start praying tahajjud regularly?", "Begin with 2 rakaats only — not 8, not 12. Set one alarm for 45 minutes before Fajr for the first week. The second week, add 2 more rakaats. By Week 3, the body begins to wake naturally. The key is never missing two nights in a row — one missed night is forgivable, two is a broken habit.")}

<h2>The 21-Night Structure</h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0 32px">
  ${[
    ["Week 1", "Nights 1–7", "Just 2 rakaats. Wake, make wudu, pray 2 rakaats, make dua, sleep. Simple. No pressure. Just show up."],
    ["Week 2", "Nights 8–14", "4 rakaats + 10 minutes of personal dua after. Start asking Allah for specific things in the night."],
    ["Week 3", "Nights 15–21", "6–8 rakaats + long dua + Quran recitation. You have built the habit. Now deepen it."],
  ].map(([week, nights, desc]) => `<div style="background:#1c2d21;border:1px solid rgba(184,148,106,0.2);border-radius:12px;padding:18px 14px">
    <strong style="color:#b8946a;font-size:13px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${week}</strong>
    <span style="color:#34c97a;font-size:12px;font-family:Inter,sans-serif;display:block;margin-bottom:8px">${nights}</span>
    <p style="color:#6a9878;font-size:13px;margin:0;line-height:1.5;font-family:Inter,sans-serif">${desc}</p>
  </div>`).join("")}
</div>

<h2>Practical Preparation</h2>
<div style="display:flex;flex-direction:column;gap:10px;margin:16px 0 32px">
  ${[
    ["Sleep earlier", "You cannot wake for tahajjud on 5 hours of sleep. Sleep 30-60 minutes earlier each night."],
    ["Set two alarms", "One alarm 50 minutes before Fajr, one 45 minutes before. Both will likely go off — the second ensures you don't sleep again."],
    ["Make niyyah before sleeping", "Say before bed: 'O Allah, wake me for Your sake in the night.' This intention itself is worship."],
    ["Keep the prayer mat ready", "Place your mat already laid out, facing qibla. The barrier of setting up the mat is removed."],
    ["Use cold water for wudu", "Cold water removes the sleepiness that prevents real presence in the prayer."],
  ].map(([title, desc]) => `<div style="display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:rgba(52,201,122,0.04);border-radius:10px;border-left:3px solid rgba(52,201,122,0.3)">
    <span style="color:#34c97a;font-size:16px;flex-shrink:0">✓</span>
    <div><strong style="color:#eaf4ee;font-size:14px;font-family:Inter,sans-serif">${title}</strong><p style="color:#6a9878;font-size:13px;margin:4px 0 0;font-family:Inter,sans-serif">${desc}</p></div>
  </div>`).join("")}
</div>

${relatedArticlesGrid([
  { href: "/tahajjud-for-anxiety", label: "Tahajjud for Anxiety", tag: "Healing" },
  { href: "/how-to-pray-tahajjud", label: "How to Pray Tahajjud", tag: "How-To" },
  { href: "/night-prayer-benefits", label: "Benefits of Night Prayer", tag: "Proof" },
  { href: "/7-day-salah-reset", label: "7-Day Salah Reset", tag: "Journey" },
  { href: "/how-to-wake-up-for-fajr", label: "Waking for Fajr Tips", tag: "Fajr" },
  { href: "/salah", label: "Salah Hub", tag: "Hub" },
], "Related Guides")}

${emotionalCTA({ title: "Track Your 21 Nights in MyTazki", subtitle: "Set tahajjud reminders, log each prayer, build your streak, and watch your nights transform.", href: "/download", btnText: "Start the Journey →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [journeySchema(title, desc, slug, 21), breadcrumbSchema(breadcrumbs)] }), body));
});

export default router;
