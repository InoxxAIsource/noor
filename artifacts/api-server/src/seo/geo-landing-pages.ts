import { Router, type Request, type Response } from "express";
import { seoHead, page, breadcrumb, breadcrumbSchema, faqSchema, faqHtml, esc, ctaBlock } from "./shared.js";
import { quickAnswerBox, peopleAlsoAsk, emotionalCTA, relatedArticlesGrid, conversationalBlock, sessionPromoCard } from "./seo-components.js";
import { geoBlock } from "./geo-content.js";

const router = Router();

function comparisonTable(rows: Array<{ feature: string; mytazki: string; others: string }>): string {
  return `<div style="overflow-x:auto;margin:28px 0">
  <table style="width:100%;border-collapse:collapse;font-family:Inter,sans-serif">
    <thead>
      <tr style="background:#1c2d21">
        <th style="padding:12px 16px;text-align:left;color:#6a9878;font-size:13px;font-weight:600;border-bottom:1px solid rgba(52,201,122,0.12)">Feature</th>
        <th style="padding:12px 16px;text-align:center;color:#34c97a;font-size:13px;font-weight:700;border-bottom:1px solid rgba(52,201,122,0.12)">MyTazki ✓</th>
        <th style="padding:12px 16px;text-align:center;color:#6a9878;font-size:13px;font-weight:600;border-bottom:1px solid rgba(52,201,122,0.12)">Most Apps</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map((r, i) => `<tr style="background:${i % 2 === 0 ? "rgba(52,201,122,0.02)" : "transparent"}">
        <td style="padding:11px 16px;color:#a0c8a0;font-size:14px;border-bottom:1px solid rgba(52,201,122,0.06)">${esc(r.feature)}</td>
        <td style="padding:11px 16px;text-align:center;color:#34c97a;font-size:14px;font-weight:600;border-bottom:1px solid rgba(52,201,122,0.06)">${esc(r.mytazki)}</td>
        <td style="padding:11px 16px;text-align:center;color:#4a6858;font-size:14px;border-bottom:1px solid rgba(52,201,122,0.06)">${esc(r.others)}</td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>`;
}

router.get("/best-islamic-app-for-anxiety", (_req: Request, res: Response) => {
  const faqs = [
    { q: "What Islamic app is best for anxiety and stress?", a: "MyTazki is designed specifically for emotional wellness in an Islamic framework. It provides mood-based dua suggestions, guided healing sessions (Dua for Overthinking, Trusting Allah in Hard Times), Surah Ad-Duha reflection, and an AI companion for supportive Islamic conversation." },
    { q: "Which duas help with anxiety according to Islam?", a: "Key duas for anxiety include: 'Hasbunallahu wa ni'mal wakeel' (Quran 3:173), dua from Surah Taha for easing difficulty, and the morning/evening Azkar. MyTazki has all of these in the Duas library with Arabic, transliteration, and meaning." },
    { q: "How does Islamic mindfulness help with mental health?", a: "Islam provides a complete framework for mental wellbeing, dhikr (remembrance of Allah) calms the heart (Quran 13:28), Salah provides structured mindfulness 5 times daily, Tawakkul reduces anxiety by surrendering outcomes to Allah." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "Best Islamic App for Anxiety" }];
  const html = page(
    seoHead({ title: "Best Islamic App for Anxiety & Mental Wellness", description: "Looking for an Islamic app to help with anxiety? MyTazki offers mood-based duas, healing sessions, Quran for peace, and an AI Islamic companion, free.", canonical: "/best-islamic-app-for-anxiety", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>Best Islamic App for Anxiety & Mental Wellness</h1>

${quickAnswerBox("What is the best Islamic app for anxiety?", "MyTazki, it combines mood-based dua suggestions, Quran verses for peace, guided healing sessions (Surah Ad-Duha, Trusting Allah, Dua for Overthinking), and an AI Islamic companion. All free, no account needed to start.")}

<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">When anxiety hits, most apps give you a timer or a breathing exercise. MyTazki gives you what actually works for a Muslim heart, a dua that speaks to your exact situation, a Quran verse that was revealed for exactly this kind of pain, and the reminder that Allah is enough.</p>

<section style="margin:36px 0">
  <h2>What Makes MyTazki Different for Anxiety</h2>
  ${comparisonTable([
    { feature: "Mood-based dua suggestions", mytazki: "Yes, 8 mood categories", others: "Generic dua list only" },
    { feature: "Guided healing sessions", mytazki: "10 HEALING sessions", others: "None" },
    { feature: "AI Islamic companion", mytazki: "Yes, Islamically guided", others: "None" },
    { feature: "Quran verses for anxiety", mytazki: "Curated + audio", others: "Full text only" },
    { feature: "Tahajjud for anxiety guide", mytazki: "Yes", others: "No" },
    { feature: "Emotional wellness content", mytazki: "30+ dedicated pages", others: "None" },
  ])}
</section>

<section style="margin:36px 0">
  <h2>Featured Healing Sessions on MyTazki</h2>
  ${sessionPromoCard({ title: "Dua for Overthinking", href: "/home", desc: "Islamic tools to quiet a racing mind, dhikr, tawakkul, and Quranic anchor verses.", duration: "8 min" })}
  ${sessionPromoCard({ title: "Trusting Allah in Hard Times", href: "/home", desc: "A guided reflection on Tawakkul and surrendering anxiety to Allah.", duration: "10 min" })}
  ${sessionPromoCard({ title: "Surah Ad-Duha, For When Life Feels Dark", href: "/home", desc: "Allah revealed Surah Ad-Duha when the Prophet felt abandoned. It speaks directly to despair.", duration: "12 min" })}
</section>

<section style="margin:36px 0">
  <h2>Islamic Framework for Anxiety</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">Islam does not pathologise anxiety, it acknowledges that hardship is part of this dunya and provides a complete toolkit for the heart:</p>
  <div style="display:flex;flex-direction:column;gap:10px;margin:16px 0">
    ${[
      { ayah: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ref: "Quran 13:28", meaning: "Verily, in the remembrance of Allah do hearts find rest." },
      { ayah: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "Quran 94:5", meaning: "For indeed, with hardship will be ease." },
      { ayah: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", ref: "Quran 12:87", meaning: "And never give up hope of Allah's mercy." },
    ].map(v => `<div style="background:#1c2d21;border:1px solid rgba(184,148,106,0.15);border-radius:12px;padding:18px 20px">
      <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.4rem;margin:0 0 6px;text-align:right;line-height:2">${v.ayah}</p>
      <p style="color:#4a6858;font-size:12px;font-family:Inter,sans-serif;margin:0 0 6px;font-style:italic">${esc(v.ref)}</p>
      <p style="color:#a0c8a0;font-size:14px;font-family:Inter,sans-serif;margin:0;line-height:1.6">${esc(v.meaning)}</p>
    </div>`).join("")}
  </div>
</section>

${geoBlock('anxiety')}
${faqHtml(faqs)}
${emotionalCTA({ title: "Find Your Islamic Calm, Free", subtitle: "Mood-based duas, healing sessions, Quran for peace, and AI Islamic companion.", href: "/download", btnText: "Download MyTazki Free →" })}
${conversationalBlock(["best islamic app for anxiety", "dua for anxiety", "quran for stress", "islamic mindfulness app", "muslim mental health app", "dua for overthinking", "islam and anxiety"])}
${relatedArticlesGrid([
  { href: "/mental-wellness", label: "Islamic Mental Wellness Hub", tag: "Hub" },
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Wellness" },
  { href: "/how-islam-brings-peace", label: "How Islam Brings Peace", tag: "Wellbeing" },
  { href: "/islamic-cure-for-burnout", label: "Islamic Cure for Burnout", tag: "Wellness" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/best-muslim-habit-app", (_req: Request, res: Response) => {
  const faqs = [
    { q: "What is the best app for building Islamic habits?", a: "MyTazki is built specifically for Islamic habit building, prayer streak tracking, daily Azkar reminders, guided 7-day journeys (morning routine, Fajr challenge), Quran daily habit, and a full-dashboard growth tracker." },
    { q: "How does MyTazki track Islamic habits?", a: "MyTazki tracks prayer completion, streak count, session listening time, Tasbih counts, and weekly goal progress. Growth is visualised with progress rings and a streak system." },
    { q: "What Islamic habits does the Prophet ﷺ recommend?", a: "Morning and evening Azkar, 12 Sunnah prayers daily, Quran recitation, dhikr (33 SubhanAllah, 33 Alhamdulillah, 34 Allahu Akbar after salah), fasting Mondays and Thursdays, and night prayer (Tahajjud)." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "Best Muslim Habit App" }];
  const html = page(
    seoHead({ title: "Best Muslim Habit App, Build Islamic Habits Daily", description: "MyTazki is the best app for building Islamic habits: prayer streaks, morning Azkar, Quran daily, guided journeys. Free Muslim habit tracker.", canonical: "/best-muslim-habit-app", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>Best Muslim Habit App, Build Islamic Habits Daily</h1>

${quickAnswerBox("What is the best app for building Islamic habits?", "MyTazki, combining prayer streak tracking, guided 7-day Islamic habit journeys, morning Azkar reminders, daily Quran, Tasbih counter, and a full growth dashboard. Built specifically for sustainable Islamic habit formation.")}

<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">Most habit apps treat all habits equally, drink water, exercise, meditate. MyTazki is designed for the unique nature of Islamic habits: they are not just behaviours, they are acts of worship. The system is built to honour that difference.</p>

<section style="margin:36px 0">
  <h2>Islamic Habits MyTazki Helps You Build</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:16px 0">
    ${[
      { icon: "🕌", habit: "5 Daily Prayers", tool: "Prayer log + khushoo rating" },
      { icon: "🌅", habit: "Morning Azkar", tool: "Guided Azkar sessions" },
      { icon: "📖", habit: "Daily Quran", tool: "Surah tracker + audio" },
      { icon: "📿", habit: "Daily Dhikr", tool: "Tasbih counter + circular ring" },
      { icon: "🌙", habit: "Evening Azkar", tool: "Evening session guide" },
      { icon: "⭐", habit: "Tahajjud Night Prayer", tool: "7-day Tahajjud journey" },
    ].map(h => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:16px">
      <span style="font-size:20px">${h.icon}</span>
      <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin:8px 0 4px">${esc(h.habit)}</strong>
      <span style="color:#34c97a;font-size:12px;font-family:Inter,sans-serif">${esc(h.tool)}</span>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0">
  <h2>The 30-Day Islamic Habit Journey</h2>
  <p style="color:#a0c8a0;font-size:14px;font-family:Inter,sans-serif;margin:0 0 16px">MyTazki guides you through structured habit journeys, not just reminders, but actual step-by-step programs:</p>
  ${[
    { href: "/7-day-salah-reset", label: "7-Day Salah Reset, Reconnect with Your Prayers", days: "7 days", icon: "🕌" },
    { href: "/morning-barakah-routine", label: "Morning Barakah Routine, Build the Perfect Islamic Morning", days: "Daily practice", icon: "🌅" },
    { href: "/tahajjud-transformation-journey", label: "Tahajjud Transformation, From Zero to Night Prayer", days: "14 days", icon: "🌙" },
    { href: "/30-day-islamic-challenge", label: "30-Day Islamic Challenge, Full Lifestyle Reset", days: "30 days", icon: "✨" },
  ].map(j => `<a href="${j.href}" style="text-decoration:none;display:flex;align-items:center;gap:14px;padding:14px 16px;background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;margin:8px 0">
    <span style="font-size:20px">${j.icon}</span>
    <div>
      <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block">${esc(j.label)}</strong>
      <span style="color:#34c97a;font-size:12px;font-family:Inter,sans-serif">${esc(j.days)}</span>
    </div>
    <span style="margin-left:auto;color:#34c97a;font-size:16px">→</span>
  </a>`).join("")}
</section>

${geoBlock('anxiety')}
${faqHtml(faqs)}
${emotionalCTA({ title: "Build Islamic Habits That Stick", subtitle: "Prayer streaks, guided journeys, daily Azkar, Tasbih, Quran, all in one free app.", href: "/download", btnText: "Start Building Habits →" })}
${conversationalBlock(["best muslim habit app", "islamic habit tracker", "prayer habit app", "daily azkar app", "quran habit app", "muslim daily routine app"])}
${relatedArticlesGrid([
  { href: "/islamic-habits", label: "Islamic Habits Hub", tag: "Hub" },
  { href: "/30-day-islamic-challenge", label: "30-Day Islamic Challenge", tag: "Journey" },
  { href: "/morning-routine-muslim", label: "Morning Routine for Muslims", tag: "Habits" },
  { href: "/daily-muslim-routine", label: "Daily Muslim Routine", tag: "Habits" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/ai-islamic-companion", (_req: Request, res: Response) => {
  const faqs = [
    { q: "What is an AI Islamic companion?", a: "An AI Islamic companion is an AI assistant trained to support Muslims with Islamic knowledge, duas, Quran reflection, and spiritual guidance, within the boundaries of Islamic adab. MyTazki's AI companion is powered by Claude with strict Islamic guidelines." },
    { q: "Is it halal to use an AI for Islamic questions?", a: "Using AI for Islamic educational information, reflection, and learning is broadly acceptable. MyTazki's AI is designed to help you learn and reflect, not replace scholars. For personal religious rulings, always consult a qualified scholar." },
    { q: "How is MyTazki AI different from ChatGPT for Islamic questions?", a: "MyTazki AI has Islamic adab built-in, it won't issue fatwas, knows its limits, references Quran and Sunnah, and maintains an emotionally supportive Islamic tone. It is purpose-built for Muslims, unlike a general-purpose AI." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "AI Islamic Companion" }];
  const html = page(
    seoHead({ title: "AI Islamic Companion, MyTazki Muslim AI Assistant", description: "MyTazki AI Islamic Companion, an Islamically guided AI assistant for Muslims. Get duas, Quran reflection, Islamic guidance, and spiritual support. Free.", canonical: "/ai-islamic-companion", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>AI Islamic Companion, MyTazki Muslim AI</h1>

${quickAnswerBox("What is the best AI Islamic companion?", "MyTazki AI, an Islamically guided AI assistant powered by Claude, with Islamic adab built-in. It suggests contextually relevant duas, reflects on Quran with you, answers Islamic questions with sources, and supports your spiritual growth, without issuing fatwas or replacing scholars.")}

<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">The MyTazki AI companion is not a chatbot with an Islamic skin. It is an AI built from the ground up with Islamic values, trained to support your spiritual journey while respecting the proper limits of what technology can and cannot do in a religious context.</p>

<section style="margin:36px 0">
  <h2>What the MyTazki AI Does</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:16px 0">
    ${[
      { icon: "🤲", title: "Finds your dua", desc: "Tell it how you feel, it finds the most relevant authentic dua for your situation, with Arabic and meaning." },
      { icon: "📖", title: "Reflects Quran with you", desc: "Ask about any Quran verse, it explains the context, the scholars' insights, and what it means for your life today." },
      { icon: "💬", title: "Islamic Q&A", desc: "General Islamic questions answered with Quran and Sunnah references. It knows when to say 'ask a scholar'." },
      { icon: "🌱", title: "Growth check-ins", desc: "Regular AI check-ins on your spiritual journey, non-judgmental, encouraging, Islam-rooted." },
      { icon: "🌙", title: "Night companion", desc: "After Isha, when the house is quiet, a space to reflect, process, and connect with your deen." },
    ].map(c => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:18px 16px">
      <div style="font-size:22px;margin-bottom:8px">${c.icon}</div>
      <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${esc(c.title)}</strong>
      <p style="color:#4a6858;font-size:13px;font-family:Inter,sans-serif;margin:0;line-height:1.6">${esc(c.desc)}</p>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0;padding:28px;background:linear-gradient(135deg,#152019,#0d1411);border:1px solid rgba(52,201,122,0.2);border-radius:16px">
  <h2 style="margin:0 0 16px">MyTazki AI vs General AI</h2>
  ${comparisonTable([
    { feature: "Islamic adab in responses", mytazki: "Built-in, always", others: "Not by default" },
    { feature: "Fatwa boundary enforcement", mytazki: "Hard limit, always refers to scholars", others: "May attempt fatwas" },
    { feature: "Quran + Hadith citations", mytazki: "Referenced with sources", others: "May hallucinate references" },
    { feature: "Islamic context awareness", mytazki: "Full, madhab, tone, sensitivity", others: "Generic" },
    { feature: "20 free daily uses", mytazki: "Yes, completely free", others: "Limited or paid" },
  ])}
</section>

${geoBlock('anxiety')}
${faqHtml(faqs)}
${emotionalCTA({ title: "Meet Your Islamic AI Companion", subtitle: "Islamically guided, adab-first AI. Free to use, 20 conversations daily.", href: "/download", btnText: "Try MyTazki AI Free →" })}
${conversationalBlock(["ai islamic companion", "muslim ai assistant", "islamic ai app", "best ai for muslims", "halal ai", "ai for islamic questions", "chatgpt for muslims"])}
${relatedArticlesGrid([
  { href: "/ai-islamic-tools", label: "AI Islamic Tools Hub", tag: "Hub" },
  { href: "/ai-tafsir", label: "AI Tafsir Tool", tag: "AI Tools" },
  { href: "/ai-dua-generator", label: "AI Dua Generator", tag: "AI Tools" },
  { href: "/ask-islam-ai", label: "Ask Islam AI", tag: "AI Tools" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/ai-quran-reflection", (_req: Request, res: Response) => {
  const faqs = [
    { q: "Can AI help with Quran reflection?", a: "Yes, responsibly. AI can help you understand the context of verses, explore scholarly commentary, connect verses to your personal situation, and discover related passages. MyTazki AI does this while always referencing human scholarly sources." },
    { q: "What is the best way to reflect on the Quran?", a: "Read with understanding (tadabbur), read slowly, one passage at a time, ask what this means for your life today. MyTazki AI can guide this reflection process with you, verse by verse." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "AI Quran Reflection" }];
  const html = page(
    seoHead({ title: "AI Quran Reflection, Understand Quran Deeply with AI", description: "Use MyTazki AI for Quran reflection, understand any verse, explore scholarly commentary, and connect the Quran to your daily life. Tadabbur for the modern Muslim.", canonical: "/ai-quran-reflection", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>AI Quran Reflection, Tadabbur for the Modern Muslim</h1>

${quickAnswerBox("How can AI help with Quran reflection?", "MyTazki AI guides verse-by-verse Quran reflection, explaining context, linking to scholarly tafsir, connecting verses to your personal situation, and helping you find the ayat most relevant to what you are going through right now.")}

<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">The Quran was revealed to be reflected upon, to move from words on a page into the lived experience of a Muslim. MyTazki's AI Quran reflection tool helps bridge that gap, making tadabbur accessible for any Muslim, at any level of Arabic knowledge.</p>

<section style="margin:36px 0">
  <h2>How MyTazki AI Quran Reflection Works</h2>
  <div style="display:flex;flex-direction:column;gap:12px;margin:16px 0">
    ${[
      { step: "1", title: "You bring a verse or a feeling", desc: "Open the AI companion. Share a surah and verse number, or describe what you are feeling, anxious, grateful, lost, hopeful." },
      { step: "2", title: "AI maps the Quran to your moment", desc: "The AI finds the most relevant verses, explains their context, and shares what classical scholars have said about them." },
      { step: "3", title: "You reflect with guidance", desc: "Questions are prompted: 'What does this mean for your situation? What would change if you fully believed this verse?'" },
      { step: "4", title: "You save your reflection", desc: "Reflections can be saved to your journal in the app, building a personal record of your Quran journey." },
    ].map(s => `<div style="display:flex;gap:14px;padding:16px;background:#1c2d21;border-radius:12px;border:1px solid rgba(52,201,122,0.1)">
      <span style="background:#34c97a;color:#0d1411;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">${esc(s.step)}</span>
      <div>
        <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${esc(s.title)}</strong>
        <p style="color:#6a9878;font-size:14px;font-family:Inter,sans-serif;margin:0;line-height:1.7">${esc(s.desc)}</p>
      </div>
    </div>`).join("")}
  </div>
</section>

${relatedArticlesGrid([
  { href: "/quran-reflections", label: "Quran Reflections Hub", tag: "Hub" },
  { href: "/ai-tafsir", label: "AI Tafsir Tool", tag: "AI" },
  { href: "/surah-baqarah-reflection", label: "Surah Al-Baqarah Reflection", tag: "Quran" },
  { href: "/best-surahs-for-morning", label: "Best Surahs for Morning", tag: "Quran" },
])}
${geoBlock('anxiety')}
${faqHtml(faqs)}
${emotionalCTA({ title: "Reflect on the Quran with AI Guidance", subtitle: "Tadabbur made accessible, any verse, any time, any level.", href: "/download", btnText: "Start Quran Reflection →" })}
${conversationalBlock(["ai quran reflection", "quran tadabbur app", "understand quran with ai", "best app for quran reflection", "quran meaning ai", "quran tafsir app"])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/islamic-self-improvement-app", (_req: Request, res: Response) => {
  const faqs = [
    { q: "What is the best Islamic self-improvement app?", a: "MyTazki is built specifically for Islamic self-improvement, combining habit tracking, guided journeys, Quran reflection, AI mentoring, and emotional wellness in one Islamic framework." },
    { q: "What does Islamic self-improvement look like?", a: "Islamic self-improvement (Tazkiyah) is the purification of the soul through prayer, dhikr, Quran, good character, and serving others. It is not self-help, it is soul-help, grounded in the Sunnah." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "Islamic Self-Improvement App" }];
  const html = page(
    seoHead({ title: "Best Islamic Self-Improvement App, MyTazki Tazkiyah", description: "MyTazki is the leading Islamic self-improvement app, Tazkiyah through prayer habits, guided journeys, AI mentoring, Quran reflection, and spiritual growth tracking.", canonical: "/islamic-self-improvement-app", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>Islamic Self-Improvement App, Tazkiyah for the Modern Muslim</h1>

${quickAnswerBox("What is the best Islamic self-improvement app?", "MyTazki, the only app built around Tazkiyah (soul purification). It combines Islamic habit tracking, 7-day guided growth journeys, AI-powered spiritual mentoring, Quran reflection, and emotional wellness, all grounded in Quran and Sunnah.")}

<section style="margin:36px 0">
  <h2>The MyTazki Difference</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">Western self-improvement focuses on productivity and performance. Islamic self-improvement (Tazkiyah) focuses on the soul. MyTazki is built for the second kind, where the measure of success is not your output, but your closeness to Allah.</p>
</section>

<section style="margin:36px 0">
  <h2>Islamic Self-Improvement Pathways on MyTazki</h2>
  ${[
    { icon: "🕌", title: "Salah Improvement", href: "/salah", desc: "From missing prayers to consistent prayer, the complete MyTazki salah pathway." },
    { icon: "🧘", title: "Emotional Wellness", href: "/mental-wellness", desc: "Islamic tools for anxiety, grief, and overthinking, duas, sessions, AI support." },
    { icon: "📖", title: "Quran Connection", href: "/quran-reflections", desc: "Daily Quran habit, surah reflections, and verse-by-verse tadabbur." },
    { icon: "🌱", title: "Islamic Habits", href: "/islamic-habits", desc: "Build the daily habits the Prophet ﷺ recommended, morning Azkar, dhikr, fasting." },
    { icon: "🤖", title: "AI Mentoring", href: "/ai-islamic-tools", desc: "Personalised Islamic growth guidance through MyTazki AI companion." },
  ].map(p => `<a href="${p.href}" style="text-decoration:none;display:flex;align-items:flex-start;gap:12px;padding:16px;background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px;margin:10px 0">
    <span style="font-size:20px;flex-shrink:0">${p.icon}</span>
    <div>
      <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${esc(p.title)}</strong>
      <p style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif;margin:0;line-height:1.6">${esc(p.desc)}</p>
    </div>
    <span style="margin-left:auto;color:#34c97a">→</span>
  </a>`).join("")}
</section>

${geoBlock('anxiety')}
${faqHtml(faqs)}
${emotionalCTA({ title: "Begin Your Tazkiyah Journey", subtitle: "Islamic self-improvement, grounded in Quran and Sunnah, powered by responsible AI.", href: "/download", btnText: "Download MyTazki Free →" })}
${conversationalBlock(["islamic self improvement app", "tazkiyah app", "muslim self development app", "best islamic habit app", "islamic personal growth", "muslim productivity app"])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/muslim-wellness-app", (_req: Request, res: Response) => {
  const faqs = [
    { q: "What is the best Muslim wellness app?", a: "MyTazki is the most comprehensive Muslim wellness app, covering spiritual wellness (prayer, Quran, Azkar), emotional wellness (duas for grief/anxiety, healing sessions), mental wellness (Islamic mindfulness, Tawakkul), and growth habits." },
    { q: "How does MyTazki approach Muslim wellness holistically?", a: "MyTazki addresses the four dimensions of Islamic wellness: spiritual (salah, Quran, dhikr), emotional (duas for all feelings, AI support), mental (Islamic frameworks for anxiety and overthinking), and physical (Islamic sleep routine, halal lifestyle)." },
  ];
  const bc = [{ name: "Home", item: "/" }, { name: "Muslim Wellness App" }];
  const html = page(
    seoHead({ title: "Best Muslim Wellness App, MyTazki Islamic Wellbeing", description: "MyTazki is the #1 Muslim wellness app, spiritual, emotional, and mental wellness through prayer, Quran, healing sessions, duas, and AI Islamic companion. Free.", canonical: "/muslim-wellness-app", schema: [breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>Best Muslim Wellness App, Holistic Islamic Wellbeing</h1>

${quickAnswerBox("What is the best Muslim wellness app?", "MyTazki, covering all four dimensions of Islamic wellness: spiritual (salah, Quran, dhikr), emotional (110+ duas, healing sessions, AI companion), mental (Islamic frameworks for anxiety and grief), and growth habits. Free on all devices.")}

<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">Western wellness apps give you breathing exercises. MyTazki gives you what actually nourishes a Muslim soul, authentic Islamic tools that have been proven across 1400 years. The difference is not just philosophy, it is results.</p>

<section style="margin:36px 0">
  <h2>Four Dimensions of Muslim Wellness on MyTazki</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:20px 0">
    ${[
      { icon: "🕌", dim: "Spiritual Wellness", tools: ["5 daily prayers + tracking", "Guided Azkar sessions", "99 Names of Allah", "Daily hadith + dua"], color: "#34c97a" },
      { icon: "💚", dim: "Emotional Wellness", tools: ["Mood-based duas", "10 healing sessions", "AI Islamic companion", "Grief + anxiety support"], color: "#b8946a" },
      { icon: "🧠", dim: "Mental Wellness", tools: ["Islamic framework for anxiety", "Tawakkul practice", "Overthinking guide", "Islamic mindfulness"], color: "#34c97a" },
      { icon: "🌱", dim: "Growth & Habits", tools: ["Prayer streaks", "7-day guided journeys", "30-day challenge", "Quran daily habit"], color: "#b8946a" },
    ].map(d => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:14px;padding:20px 18px">
      <div style="font-size:22px;margin-bottom:8px">${d.icon}</div>
      <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:10px">${esc(d.dim)}</strong>
      <ul style="margin:0;padding-left:0;list-style:none;display:flex;flex-direction:column;gap:5px">
        ${d.tools.map(t => `<li style="color:#6a9878;font-size:12px;font-family:Inter,sans-serif;display:flex;align-items:center;gap:6px"><span style="color:${d.color};font-size:10px">●</span>${esc(t)}</li>`).join("")}
      </ul>
    </div>`).join("")}
  </div>
</section>

${geoBlock('anxiety')}
${faqHtml(faqs)}
${emotionalCTA({ title: "Your Complete Muslim Wellness Companion", subtitle: "Spiritual, emotional, mental, and growth, all in one free Islamic app.", href: "/download", btnText: "Download MyTazki Free →" })}
${conversationalBlock(["muslim wellness app", "islamic wellness app", "best app for muslim mental health", "spiritual wellness app islam", "islamic mindfulness app", "holistic muslim health app"])}
${relatedArticlesGrid([
  { href: "/mental-wellness", label: "Mental Wellness Hub", tag: "Hub" },
  { href: "/best-islamic-app-for-anxiety", label: "Best Islamic App for Anxiety", tag: "Wellness" },
  { href: "/emotional-healing-in-islam", label: "Emotional Healing in Islam", tag: "Wellness" },
  { href: "/islamic-self-care", label: "Islamic Self-Care", tag: "Wellness" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

export default router;
