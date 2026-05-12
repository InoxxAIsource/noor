import { Router, type Request, type Response } from "express";
import { seoHead, page, breadcrumb, breadcrumbSchema, faqSchema, faqHtml, esc, ctaBlock } from "./shared.js";
import { quickAnswerBox, emotionalCTA, relatedArticlesGrid, nextStepsBlock, startHereBox, guidedJourneysBlock, conversationalBlock, sessionPromoCard } from "./seo-components.js";

const router = Router();

router.get("/start-here", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "Start Here" }];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "Start Here, MyTazki Islamic Spiritual Growth", "url": "https://mytazki.com/start-here" };
  const html = page(
    seoHead({ title: "Start Here, Your Islamic Spiritual Journey", description: "New to MyTazki? Start here. Choose your path, reconnect with prayer, find peace, build Islamic habits, or explore Quran. We'll guide you.", canonical: "/start-here", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}

<header style="padding:40px 0 36px;text-align:center;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:2rem;margin:0 0 8px;line-height:1.8">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 24px">In the name of Allah, the Most Gracious, the Most Merciful</p>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;line-height:1.2;margin:0 0 16px">Welcome. You're in the right place.</h1>
  <p style="color:#6a9878;font-size:1.05rem;line-height:1.75;max-width:560px;margin:0 auto;font-family:Inter,sans-serif">Whether you are reconnecting with your deen after a long time, or deepening a practice you already have, MyTazki walks with you. Choose where to begin.</p>
</header>

<section style="margin:36px 0">
  <h2 style="text-align:center;margin-bottom:24px">Choose Your Starting Point</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px">
    ${[
      { icon: "🕌", title: "I want to pray consistently again", desc: "Missed prayers. Struggling with Fajr. Feeling disconnected from salah.", href: "/start-praying-again", color: "#34c97a", btn: "Reconnect with Salah →" },
      { icon: "🧘", title: "I need peace and calm", desc: "Anxiety, stress, overwhelm. I need Islamic tools for my mind and heart.", href: "/find-peace-in-islam", color: "#b8946a", btn: "Find Peace →" },
      { icon: "🌱", title: "I want to build Islamic habits", desc: "Morning Azkar, daily Quran, dhikr, evening routine. Build it together.", href: "/build-islamic-habits", color: "#34c97a", btn: "Start Building →" },
      { icon: "💚", title: "I'm reconnecting with Allah", desc: "Feeling distant. Something feels missing. I want to come back.", href: "/reconnect-with-allah", color: "#b8946a", btn: "Begin Reconnecting →" },
    ].map(p => `<a href="${p.href}" style="text-decoration:none;display:block;background:linear-gradient(135deg,#1c2d21,#152019);border:1px solid rgba(52,201,122,0.15);border-radius:16px;padding:24px 20px;transition:border-color 0.2s" onmouseover="this.style.borderColor='rgba(52,201,122,0.35)'" onmouseout="this.style.borderColor='rgba(52,201,122,0.15)'">
      <div style="font-size:28px;margin-bottom:12px">${p.icon}</div>
      <strong style="color:#eaf4ee;font-size:16px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:8px;line-height:1.4">${esc(p.title)}</strong>
      <p style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif;line-height:1.65;margin:0 0 16px">${esc(p.desc)}</p>
      <span style="color:${p.color};font-size:13px;font-weight:700;font-family:Inter,sans-serif">${esc(p.btn)}</span>
    </a>`).join("")}
  </div>
</section>

<section style="margin:40px 0">
  <h2>Or, Start with Our Most Loved Features</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0">
    ${[
      { icon: "⏰", label: "Prayer Times", href: "/prayer-times", desc: "Live GPS-based prayer times" },
      { icon: "🤲", label: "Find a Dua", href: "/duas", desc: "110+ authentic duas" },
      { icon: "📖", label: "Read Quran", href: "/quran", desc: "All 114 surahs with audio" },
      { icon: "📿", label: "Tasbih Counter", href: "/tasbih", desc: "Digital dhikr counter" },
      { icon: "🤖", label: "Ask AI Companion", href: "/home", desc: "Islamic AI for any question" },
      { icon: "✨", label: "Start a Journey", href: "/7-day-inner-peace-journey", desc: "7-day guided program" },
    ].map(f => `<a href="${f.href}" style="text-decoration:none;background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px;padding:16px;display:block;text-align:center">
      <div style="font-size:22px;margin-bottom:8px">${f.icon}</div>
      <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${esc(f.label)}</strong>
      <span style="color:#4a6858;font-size:12px;font-family:Inter,sans-serif">${esc(f.desc)}</span>
    </a>`).join("")}
  </div>
</section>

<section style="margin:40px 0;padding:28px;background:rgba(52,201,122,0.04);border-radius:14px;border-left:4px solid #34c97a">
  <h2 style="margin:0 0 14px">A Note Before You Begin</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:0">You do not need to be "good enough" to use MyTazki. There is no prerequisite. There is no ideal Muslim who MyTazki is designed for and you are not. MyTazki exists for exactly where you are right now, whether you prayed today or haven't prayed in years. Allah's door is always open. Ours is too.</p>
</section>

${emotionalCTA({ title: "Ready? The journey begins now.", subtitle: "Free. No account required for most features. Grow at your own pace.", href: "/download", btnText: "Download MyTazki →" })}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/reconnect-with-allah", (_req: Request, res: Response) => {
  const faqs = [
    { q: "How do I reconnect with Allah after a long time away?", a: "Start small. Make wudu. Say Bismillah before something you do every day. Pray one rakah. Read one verse of Quran. Reconnecting is not a grand gesture, it is many small sincere ones. MyTazki guides this step by step." },
    { q: "Is it too late to come back to Islam?", a: "Never. Allah says in the Quran: 'Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.' (39:53). There is no 'too late' in the mercy of Allah." },
    { q: "What's the first step to reconnecting with Allah?", a: "The scholars say: start with istighfar (seeking forgiveness). Say Astaghfirullah from your heart. Then pray whatever salah you can manage today. Then build from there. MyTazki's 7-day reconnect journey structures exactly this process." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "Start Here", item: "/start-here" }, { name: "Reconnect with Allah" }];
  const html = page(
    seoHead({ title: "How to Reconnect with Allah, MyTazki Guide", description: "Feeling distant from Allah? This guide shows you step-by-step how to come back, istighfar, prayer, Quran, duas, and a 7-day guided journey back to your deen.", canonical: "/reconnect-with-allah", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}

<header style="padding:36px 0 28px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.8rem;margin:0 0 8px;line-height:2">قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 20px">Say: O My servants who have transgressed, do not despair of the mercy of Allah., Quran 39:53</p>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;line-height:1.2;margin:0 0 14px">Reconnect with Allah, You're Not Too Far</h1>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;font-family:Inter,sans-serif">The feeling of distance from Allah is one of the most painful human experiences. And it is also one of the most human, prophets felt it. Companions felt it. You are not alone in it. And there is always a way back.</p>
</header>

${quickAnswerBox("How do I reconnect with Allah after drifting away?", "Start with sincerity, not perfection. Sit quietly. Say Astaghfirullah three times. Then make wudu and pray two rakah of Salat al-Tawbah. This one act opens the door. MyTazki's reconnect journey guides you through the first 7 days back.")}

<section style="margin:36px 0">
  <h2>Understanding Why You Feel Distant</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">Feeling distant from Allah rarely happens suddenly. It is usually a slow drift, missed prayers, less Quran, less dhikr, more screen time, more dunya. The Prophet ﷺ warned us: "Hearts become rusty just as iron becomes rusty." The remedy is the same as it always was: remembrance of Allah.</p>
</section>

<section style="margin:36px 0">
  <h2>Your First 7 Steps Back</h2>
  <div style="display:flex;flex-direction:column;gap:0">
    ${[
      { day: "Day 1", title: "Acknowledge and ask forgiveness", action: "Sit quietly. Say Astaghfirullah 100 times. Tell Allah exactly how you feel, in your own language, from your heart. This is the beginning." },
      { day: "Day 2", title: "Pray one salah, just one", action: "If you haven't been praying, pray Asr today. Just one. Make it deliberate. Make wudu properly. Read Al-Fatiha slowly. This one act changes something." },
      { day: "Day 3", title: "Read one verse of Quran", action: "Not a chapter. One verse. Read the translation. Sit with it for five minutes. Ask: what is Allah saying to me in this?" },
      { day: "Day 4", title: "Morning dhikr before your phone", action: "Before opening your phone in the morning, say SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34. This is the Sunnah, it takes under two minutes." },
      { day: "Day 5", title: "Listen to a healing session", action: "Open MyTazki. Play 'Trusting Allah in Hard Times' or 'Surah Ad-Duha Reflection'. Let the words work on your heart." },
      { day: "Day 6", title: "Make dua with words not phrases", action: "Not memorised duas yet. Just talk to Allah. In your language. About your situation. Dua is conversation, not performance." },
      { day: "Day 7", title: "Commit to the next 7 days", action: "You've done one week. Now begin the 7-Day Reconnect Journey on MyTazki, structured, gentle, step-by-step." },
    ].map((s, i, arr) => `<div style="display:flex;gap:16px;padding:20px 0;${i < arr.length - 1 ? "border-bottom:1px solid rgba(52,201,122,0.07)" : ""}">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
        <div style="background:rgba(52,201,122,0.12);border:1.5px solid rgba(52,201,122,0.3);color:#34c97a;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:Inter,sans-serif;flex-shrink:0;text-align:center;line-height:1.2">${esc(s.day.replace("Day ", ""))}</div>
        ${i < arr.length - 1 ? `<div style="width:1px;flex:1;background:rgba(52,201,122,0.1);margin:8px 0"></div>` : ""}
      </div>
      <div style="padding-bottom:8px">
        <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${esc(s.title)}</strong>
        <p style="color:#6a9878;font-size:14px;line-height:1.75;margin:0;font-family:Inter,sans-serif">${esc(s.action)}</p>
      </div>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0">
  <h2>Duas for Reconnecting</h2>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${[
      { arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", meaning: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers., Quran 7:23", context: "Dua of Prophet Adam, for returning to Allah" },
      { arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", meaning: "O Allah, help me to remember You, to thank You, and to worship You in the best manner., Abu Dawud", context: "The Prophet's ﷺ daily dua, for help in your ibadah" },
    ].map(d => `<div style="background:#1c2d21;border:1px solid rgba(184,148,106,0.15);border-radius:14px;padding:20px">
      <span style="color:#b8946a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;font-family:Inter,sans-serif;display:block;margin-bottom:10px">${esc(d.context)}</span>
      <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.3rem;margin:0 0 8px;text-align:right;line-height:2">${d.arabic}</p>
      <p style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif;margin:0;line-height:1.7;font-style:italic">${esc(d.meaning)}</p>
    </div>`).join("")}
  </div>
</section>

${faqHtml(faqs)}
${emotionalCTA({ title: "Begin the 7-Day Reconnect Journey", subtitle: "Guided. Gentle. Step by step. You don't have to figure this out alone.", href: "/reconnect-with-allah-journey", btnText: "Start the Journey →" })}
${conversationalBlock(["how to reconnect with allah", "feeling distant from allah", "how to come back to islam", "drifted from deen", "how to get back to praying", "reconnect with quran"])}
${relatedArticlesGrid([
  { href: "/reconnect-with-allah-journey", label: "7-Day Reconnect Journey", tag: "Journey" },
  { href: "/start-praying-again", label: "Start Praying Again", tag: "Salah" },
  { href: "/how-to-connect-with-allah", label: "How to Connect with Allah", tag: "Guidance" },
  { href: "/dua-for-forgiveness", label: "Dua for Forgiveness", tag: "Dua" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/find-peace-in-islam", (_req: Request, res: Response) => {
  const faqs = [
    { q: "How does Islam bring inner peace?", a: "Islam provides a complete system for inner peace, salah as structured mindfulness 5 times daily, dhikr as anxiety relief (Quran 13:28), tawakkul as the antidote to worry, and the Quran as a healing for what is in the chests (Quran 10:57)." },
    { q: "What dua brings peace of mind in Islam?", a: "Key duas for peace include: Hasbunallahu wa ni'mal wakeel (Quran 3:173), the dua of Prophet Yunus (21:87), and the morning/evening Azkar from Hisnul Muslim. MyTazki has all of these in the Duas library." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "Start Here", item: "/start-here" }, { name: "Find Peace in Islam" }];
  const html = page(
    seoHead({ title: "Find Peace in Islam, Islamic Guide to Inner Calm", description: "Struggling with anxiety, stress, or a restless heart? Islam has the answer. Discover duas, Quran verses, and Islamic practices for finding inner peace.", canonical: "/find-peace-in-islam", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<header style="padding:36px 0 28px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.8rem;margin:0 0 8px;line-height:2">أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 20px">Verily, in the remembrance of Allah do hearts find rest., Quran 13:28</p>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;line-height:1.2;margin:0 0 14px">Find Peace in Islam, Your Heart Knows the Way</h1>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;font-family:Inter,sans-serif">The Quran says it plainly: hearts find rest in the remembrance of Allah. Not in achievement. Not in wealth. Not in solving every problem. In His remembrance. MyTazki helps you build that remembrance, one practice at a time.</p>
</header>

${quickAnswerBox("How do I find peace in Islam?", "Start with dhikr, say SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34 right now. Then explore MyTazki's Islamic peace toolkit: mood-based duas for anxiety, guided healing sessions, Quran verses for the troubled heart, and morning Azkar to anchor each day.")}

<section style="margin:36px 0">
  <h2>The Islamic Peace Toolkit</h2>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${[
      { icon: "📿", title: "Dhikr, Remembrance of Allah", desc: "The most direct path to calm. SubhanAllah, Alhamdulillah, Allahu Akbar. Repeat. Feel your nervous system settle.", href: "/tasbih" },
      { icon: "🤲", title: "Dua, Talking to Allah", desc: "Not formulaic prayer, real conversation. Tell Allah what is in your chest. He already knows, but saying it brings relief.", href: "/dua-for-anxiety" },
      { icon: "🕌", title: "Salah, Structured Peace", desc: "Five times daily, you step out of the dunya and into the presence of Allah. This is Islamic mindfulness, 1400 years before the term existed.", href: "/salah-and-mental-health" },
      { icon: "📖", title: "Quran, Healing for the Heart", desc: "Quran 10:57 says it is a healing for what is in the chests. Not metaphorically, literally. MyTazki guides you to the verses most relevant to what you are feeling.", href: "/quran-for-depression" },
      { icon: "🌙", title: "Tahajjud, Night Peace", desc: "The night prayer brings a quality of peace that is unlike anything else. When the world is quiet and it is just you and Allah.", href: "/tahajjud-prayer-guide" },
    ].map(t => `<a href="${t.href}" style="text-decoration:none;display:flex;align-items:flex-start;gap:12px;padding:16px;background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px">
      <span style="font-size:20px;flex-shrink:0">${t.icon}</span>
      <div>
        <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${esc(t.title)}</strong>
        <p style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif;margin:0;line-height:1.65">${esc(t.desc)}</p>
      </div>
      <span style="margin-left:auto;color:#34c97a;flex-shrink:0">→</span>
    </a>`).join("")}
  </div>
</section>

${sessionPromoCard({ title: "Healing Through Sujood", href: "/home", desc: "The closest you are to Allah is in prostration. A guided session on using Sujood as a place of refuge.", duration: "9 min" })}
${sessionPromoCard({ title: "Sleep with Ayatul Kursi", href: "/home", desc: "Prepare your heart for rest with the greatest verse in the Quran, Ayatul Kursi before sleep.", duration: "7 min" })}

${faqHtml(faqs)}
${emotionalCTA({ title: "Your Path to Islamic Peace Starts Here", subtitle: "Duas, Quran, healing sessions, AI companion, all the Islamic peace tools, free.", href: "/download", btnText: "Download MyTazki →" })}
${conversationalBlock(["how to find peace in islam", "dua for peace of mind", "quran for inner peace", "islamic mindfulness", "peace of heart in islam", "how islam reduces anxiety"])}
${relatedArticlesGrid([
  { href: "/mental-wellness", label: "Mental Wellness Hub", tag: "Hub" },
  { href: "/7-day-inner-peace-journey", label: "7-Day Inner Peace Journey", tag: "Journey" },
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Wellness" },
  { href: "/how-islam-brings-peace", label: "How Islam Brings Peace", tag: "Guidance" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/build-islamic-habits", (_req: Request, res: Response) => {
  const faqs = [
    { q: "How do I build Islamic habits that last?", a: "Start with one habit, not five. Make it tiny (one page of Quran, 33 dhikr, one Sunnah prayer). Attach it to an existing habit (after Fajr, before bed). MyTazki's streak system and guided journeys support this habit-building framework." },
    { q: "What are the most important Islamic habits to build?", a: "The Prophet ﷺ recommended: the five daily prayers (most important), morning and evening Azkar, consistent Quran recitation, fasting Mondays and Thursdays, and night prayer (Tahajjud). Start with prayers, then layer." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "Start Here", item: "/start-here" }, { name: "Build Islamic Habits" }];
  const html = page(
    seoHead({ title: "Build Islamic Habits, Daily Practice Guide", description: "Learn how to build lasting Islamic habits, morning Azkar, daily Quran, prayer streaks, dhikr, and more. A practical Islamic habit-building guide with MyTazki.", canonical: "/build-islamic-habits", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>Build Islamic Habits, Daily Practice That Sticks</h1>

${quickAnswerBox("How do I build Islamic habits that last?", "The Islamic habit formula: start tiny (33 dhikr, one verse of Quran), attach to salah time, track with a streak, and join a guided journey. MyTazki provides all four, streaks, reminders, 7-day journeys, and a habit dashboard.")}

<section style="margin:36px 0">
  <h2>The Islamic Habit Stack, Build in This Order</h2>
  <div style="display:flex;flex-direction:column;gap:0;margin:16px 0">
    ${[
      { n: "1", title: "The Five Prayers, Foundation", body: "Everything else is built on salah. Before adding any other habit, get your five prayers consistent. MyTazki tracks each one with khushoo rating and streak count.", href: "/how-to-make-salah-habit" },
      { n: "2", title: "Morning Azkar, Start", body: "After Fajr prayer, before your phone. 10 minutes of morning Azkar from Hisnul Muslim. MyTazki has guided audio sessions for this, it is the highest-ROI Islamic habit.", href: "/morning-routine-muslim" },
      { n: "3", title: "Daily Quran, Nourishment", body: "Even one page. Even one verse. The habit is consistency, not volume. MyTazki's Quran tracker helps you build from nothing to daily.", href: "/quran-daily-habit" },
      { n: "4", title: "Evening Azkar, Close", body: "Before sunset or after Maghrib. Evening Azkar seals your day with protection and gratitude. MyTazki has a dedicated evening session.", href: "/evening-azkar-routine" },
      { n: "5", title: "Tahajjud, Ascent", body: "Once the foundation is solid, add night prayer. Even two rakah after waking at 3am changes the quality of your entire day.", href: "/how-to-pray-tahajjud" },
    ].map((s, i, arr) => `<div style="display:flex;gap:16px;padding:20px 0;${i < arr.length - 1 ? "border-bottom:1px solid rgba(52,201,122,0.07)" : ""}">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
        <span style="background:#34c97a;color:#0d1411;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px">${esc(s.n)}</span>
        ${i < arr.length - 1 ? `<div style="width:1px;flex:1;background:rgba(52,201,122,0.15);margin:8px 0"></div>` : ""}
      </div>
      <div>
        <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${esc(s.title)}</strong>
        <p style="color:#6a9878;font-size:14px;line-height:1.75;margin:0 0 8px;font-family:Inter,sans-serif">${esc(s.body)}</p>
        <a href="${s.href}" style="color:#34c97a;font-size:13px;font-family:Inter,sans-serif;text-decoration:none;font-weight:600">Learn more →</a>
      </div>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0">
  <h2>Guided Journeys for Each Habit</h2>
  <div style="display:flex;flex-direction:column;gap:10px">
    ${[
      { href: "/7-day-salah-reset", label: "7-Day Salah Reset", desc: "Make prayers consistent, one day at a time" },
      { href: "/morning-barakah-routine", label: "Morning Barakah Routine", desc: "Build the perfect Islamic morning" },
      { href: "/tahajjud-transformation-journey", label: "Tahajjud Transformation", desc: "From zero to night prayer in 14 days" },
      { href: "/30-day-islamic-challenge", label: "30-Day Islamic Challenge", desc: "Full lifestyle reset, all habits in one journey" },
    ].map(j => `<a href="${j.href}" style="text-decoration:none;display:flex;align-items:center;gap:12px;padding:14px 16px;background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px">
      <span style="font-size:16px">🌙</span>
      <div>
        <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block">${esc(j.label)}</strong>
        <span style="color:#6a9878;font-size:12px;font-family:Inter,sans-serif">${esc(j.desc)}</span>
      </div>
      <span style="margin-left:auto;color:#34c97a">→</span>
    </a>`).join("")}
  </div>
</section>

${faqHtml(faqs)}
${emotionalCTA({ title: "Start Building Islamic Habits Today", subtitle: "Prayer streaks, guided journeys, morning Azkar, daily Quran, all in one free app.", href: "/download", btnText: "Download MyTazki Free →" })}
${conversationalBlock(["how to build islamic habits", "daily muslim habits", "islamic habit tracker", "prayer habit building", "morning azkar habit", "quran daily habit"])}
${relatedArticlesGrid([
  { href: "/islamic-habits", label: "Islamic Habits Hub", tag: "Hub" },
  { href: "/30-day-islamic-challenge", label: "30-Day Islamic Challenge", tag: "Journey" },
  { href: "/daily-muslim-routine", label: "Daily Muslim Routine", tag: "Habits" },
  { href: "/halal-productivity", label: "Halal Productivity", tag: "Habits" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/start-praying-again", (_req: Request, res: Response) => {
  const faqs = [
    { q: "How do I start praying again after a long break?", a: "Start with just one prayer today, Asr or Maghrib. Make wudu. Read Al-Fatiha slowly. Say Allahu Akbar and mean it. Don't try to catch up all at once. Build from one prayer to two, then three. MyTazki's 7-day salah reset guides this process." },
    { q: "What about all the prayers I have missed?", a: "The scholars differ on Qada (making up missed prayers). Many advise repenting sincerely, committing to regular prayer going forward, and consulting a local scholar about your specific situation. MyTazki has a guide on missed prayers at /missed-prayers-qada." },
    { q: "How do I get motivation to pray when I feel disconnected?", a: "Reconnect with the meaning of salah, not the rules. Read Surah Al-Fatiha translation and reflect that you are having a conversation with Allah. Watch 'Why Salah is Important' on MyTazki. Start with the prayer time closest to now." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "Start Here", item: "/start-here" }, { name: "Start Praying Again" }];
  const html = page(
    seoHead({ title: "How to Start Praying Again After a Long Break", description: "Haven't prayed in a while? This guide helps you start praying again, one salah at a time, without judgment. MyTazki's gentle 7-day prayer restart program.", canonical: "/start-praying-again", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<header style="padding:36px 0 28px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:36px">
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.8rem;margin:0 0 8px;line-height:2">إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 20px">Indeed, prayer is an obligation upon the believers at specified times., Quran 4:103</p>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;line-height:1.2;margin:0 0 14px">Start Praying Again, One Salah at a Time</h1>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;font-family:Inter,sans-serif">Whether it has been weeks, months, or years, this is not a judgment space. This is a starting point. Salah is not a reward for the pious; it is a lifeline for the struggling. You are exactly who salah was designed for.</p>
</header>

${quickAnswerBox("How do I start praying again after years of not praying?", "One prayer. Today. Not five. Not Qada for every missed prayer. Just make wudu right now, find the direction of Qibla, and pray Asr or whatever prayer is due next. Then tomorrow, pray two. Build gently. MyTazki's 7-day salah reset makes this concrete.")}

<section style="margin:36px 0">
  <h2>The 7-Day Salah Restart Plan</h2>
  <div style="display:flex;flex-direction:column;gap:0">
    ${[
      { day: "Day 1", task: "Pray one prayer", detail: "Just one, whichever is next. Make proper wudu. Pray slowly." },
      { day: "Day 2", task: "Pray two prayers", detail: "Add Fajr to yesterday's prayer. Set an alarm tonight." },
      { day: "Day 3", task: "Learn the meaning of Al-Fatiha", detail: "Read the translation. You are saying this to Allah. Let it mean something." },
      { day: "Day 4", task: "Pray three prayers", detail: "Fajr + Dhuhr or Asr + one evening prayer." },
      { day: "Day 5", task: "Add morning Azkar after Fajr", detail: "Just 5 minutes. MyTazki has a guided morning Azkar session." },
      { day: "Day 6", task: "Pray four prayers", detail: "Getting close to the full five. You have made it this far." },
      { day: "Day 7", task: "All five prayers", detail: "This is it. This is salah returning to your life. Mark it. Remember this day." },
    ].map((s, i, arr) => `<div style="display:flex;gap:14px;padding:18px 0;${i < arr.length - 1 ? "border-bottom:1px solid rgba(52,201,122,0.07)" : ""}">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
        <div style="background:rgba(52,201,122,0.12);border:1.5px solid rgba(52,201,122,0.25);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#34c97a;font-family:Inter,sans-serif;text-align:center;line-height:1.2">${i + 1}</div>
        ${i < arr.length - 1 ? `<div style="width:1px;flex:1;background:rgba(52,201,122,0.1);margin:8px 0"></div>` : ""}
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
          <span style="color:#34c97a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;font-family:Inter,sans-serif">${esc(s.day)}</span>
        </div>
        <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${esc(s.task)}</strong>
        <p style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif;margin:0;line-height:1.65">${esc(s.detail)}</p>
      </div>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0;padding:24px;background:rgba(52,201,122,0.04);border-radius:14px;border-left:4px solid #34c97a">
  <h2 style="margin:0 0 12px">A Word About Guilt</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:0">The Prophet ﷺ said: "All of the children of Adam sin, and the best of those who sin are those who repent." Guilt has its place, it should move you to action. But once you have made the intention to return, let the guilt go. Allah loves the one who turns back to Him. He is waiting for you.</p>
</section>

${faqHtml(faqs)}
${emotionalCTA({ title: "The 7-Day Salah Reset, Start Today", subtitle: "Guided. Gentle. One prayer at a time. No judgment, just a path back.", href: "/7-day-salah-reset", btnText: "Begin the Salah Reset →" })}
${conversationalBlock(["how to start praying again", "how to get back into salah", "haven't prayed in years", "restart prayers islam", "salah motivation", "how to pray consistently"])}
${relatedArticlesGrid([
  { href: "/7-day-salah-reset", label: "7-Day Salah Reset Journey", tag: "Journey" },
  { href: "/salah", label: "Salah Hub", tag: "Hub" },
  { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah", tag: "Salah" },
  { href: "/why-salah-is-important", label: "Why Salah Is Important", tag: "Salah" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

export default router;
