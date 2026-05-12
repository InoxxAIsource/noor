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

function softwareAppSchema(name: string, desc: string): object {
  return { "@context": "https://schema.org", "@type": "SoftwareApplication", "name": name, "description": desc, "applicationCategory": "LifestyleApplication", "operatingSystem": "iOS, Android", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }, "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "2400" } };
}

const AI_RELATED = [
  { href: "/ai-islamic-tools", label: "AI Islamic Tools Hub", tag: "Hub" },
  { href: "/ai-islamic-assistant", label: "AI Islamic Assistant", tag: "AI Tool" },
  { href: "/ai-quran-explainer", label: "AI Quran Explainer", tag: "Quran AI" },
  { href: "/ask-islam-ai", label: "Ask Islam AI", tag: "AI Q&A" },
  { href: "/islamic-ai-companion", label: "Islamic AI Companion", tag: "AI Tool" },
  { href: "/quran-reflections", label: "Quran Reflections Hub", tag: "Quran" },
];

// ─── 1. AI Tafsir ────────────────────────────────────────────────────────────
router.get("/ai-tafsir", (_req, res) => {
  const slug = "/ai-tafsir"; const title = "AI Tafsir, Quran Commentary Made Accessible Through AI"; const desc = "How AI makes classical Quran tafsir accessible: AI-powered explanations of Quran verses, drawing from Ibn Kathir, Al-Tabari, and classical scholarship. Try it in MyTazki.";
  const bcs = [{ name: "Home", item: "/" }, { name: "AI Islamic Tools", item: "/ai-islamic-tools" }, { name: "AI Tafsir" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is AI Tafsir and how does it work?", "AI Tafsir uses large language models trained on classical Islamic texts to explain Quran verses in accessible, contextually relevant language. A good AI tafsir system draws from classical scholarship (Ibn Kathir, Al-Tabari, Al-Qurtubi, Maududi) while presenting insights in plain English. It is not a replacement for scholarly tafsir, it is a bridge that makes classical knowledge accessible to modern Muslims who may not have access to Islamic education.")}
<h2>Classical Tafsir Sources AI Draws From</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:16px 0">
${[
  ["Tafsir Ibn Kathir", "The most widely used Sunni tafsir. Emphasises hadith-based interpretation. Complete and authentic. Ibn Kathir (d. 774 AH) cross-referenced verses with Hadith and historical context."],
  ["Tafsir Al-Tabari", "The most comprehensive classical tafsir, over 30 volumes. Al-Tabari (d. 310 AH) compiled interpretations of the companions and early Muslims. The foundation of all later scholarship."],
  ["Tafsir Al-Qurtubi", "Famous for Fiqh (Islamic law) derivations from Quran verses. Al-Qurtubi (d. 671 AH) is essential for understanding the legal dimensions of Quranic guidance."],
  ["Tafhim ul-Quran", "Maududi's 20th-century tafsir in accessible language. Contextualises Quran for modern Muslims facing contemporary challenges. Widely used in South Asia."],
].map(([t, d]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:14px">
  <strong style="color:#34c97a;font-size:13px;font-family:DM Sans,sans-serif;display:block;margin-bottom:6px">${t}</strong>
  <p style="color:#6a9878;font-size:13px;margin:0;line-height:1.5;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
<h2>How AI Tafsir Works in MyTazki</h2>
<p style="color:#a0c8a0;line-height:1.8">MyTazki's AI companion (powered by Claude, Anthropic's most capable model) can explain any Quran verse by: drawing from classical scholarship, presenting multiple scholarly opinions where they differ, providing linguistic analysis of the Arabic, contextualising within the surah's themes, and applying insights to contemporary situations, all while citing sources and maintaining Islamic adab (respect and propriety).</p>
${faqHtml([
  { q: "Is AI tafsir reliable for Islamic learning?", a: "AI tafsir is reliable for introductory learning and exploration, it accurately draws from established classical sources. However, it is NOT a substitute for qualified scholars for complex fiqh questions, disputed interpretations, or anything that requires formal Islamic scholarship. Use AI tafsir to learn and explore, then verify important matters with a scholar." },
  { q: "Can AI replace an Islamic scholar?", a: "No. AI can provide information based on classical texts, but it lacks the lived embodiment, ijaza (scholarly transmission chain), nuanced judgment, and divine guidance that scholars carry. AI is a powerful learning tool, like a very comprehensive book, not a replacement for human Islamic scholarship." },
])}
${relatedArticlesGrid(AI_RELATED)}
${emotionalCTA({ title: "Explore Quran with AI in MyTazki", subtitle: "Ask any verse, get AI-powered reflection drawing from classical tafsir. 20 free queries daily.", href: "/download", btnText: "Try AI Tafsir →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), faqSchema([{ q: "Is AI tafsir reliable?", a: "Yes for exploration; not for formal rulings." }]), breadcrumbSchema(bcs)] }), body));
});

// ─── 2. AI Islamic Coach ─────────────────────────────────────────────────────
router.get("/ai-islamic-coach", (_req, res) => {
  const slug = "/ai-islamic-coach"; const title = "AI Islamic Life Coach, Personalized Guidance for Your Spiritual Journey"; const desc = "An AI Islamic coach for habit building, spiritual growth, and deen questions. How AI can guide your Islamic lifestyle choices, and where its limits are.";
  const bcs = [{ name: "Home", item: "/" }, { name: "AI Islamic Tools", item: "/ai-islamic-tools" }, { name: "AI Islamic Life Coach" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What can an AI Islamic coach help with?", "An AI Islamic coach can: help you design a personal Islamic daily routine, suggest duas for specific situations, explain Islamic concepts in plain language, help you understand Quran passages, offer accountability for habits like salah and Quran reading, answer general fiqh questions (with appropriate caveats), and provide emotional support grounded in Islamic perspective. It cannot: provide formal fatawa, replace a therapist, or substitute for a human Islamic mentor.")}
<h2>What Makes a Good AI Islamic Coach</h2>
<div style="display:flex;flex-direction:column;gap:12px;margin:16px 0">
${[
  ["Islamic Adab First", "A good AI Islamic coach begins responses with Bismillah or Islamic greetings, cites Quran and Hadith when relevant, uses appropriate honorifics (ﷺ), and maintains the dignity and respect of Islamic scholarship."],
  ["Knowledge Boundaries", "It clearly distinguishes between established Islamic guidance and its own analysis. For complex fiqh matters, it says: 'You should consult a qualified scholar about this.'"],
  ["Emotional Intelligence", "Islamic coaching is not just informational, it is pastoral. A good AI coach acknowledges feelings, provides comfort from Islamic sources, and offers hope grounded in Quran and Sunnah."],
  ["Personalisation", "The best AI Islamic coach remembers context and provides guidance specific to your situation, not generic answers. MyTazki's AI remembers your questions within the session and responds contextually."],
  ["No Haram Content", "A properly configured Islamic AI refuses to engage with haram topics, provide guidance that contradicts Islamic principles, or make theological claims that could mislead Muslims."],
].map(([t, d]) => `<div style="background:#1c2d21;border-left:3px solid rgba(52,201,122,0.4);padding:14px 16px;border-radius:0 10px 10px 0">
  <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${t}</strong>
  <p style="color:#6a9878;font-size:13px;margin:0;line-height:1.6;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
<h2>Sample Questions for MyTazki AI Coach</h2>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin:16px 0">
${[
  "How do I stop missing Fajr?",
  "What dua should I say for anxiety?",
  "How do I build a Quran reading habit?",
  "What does Islam say about depression?",
  "How do I reconnect with Allah after a long absence?",
  "What is the ruling on X in Hanafi fiqh?",
  "Can you explain Surah Al-Inshirah?",
  "How do I make tawbah properly?",
].map(q => `<span style="background:rgba(52,201,122,0.07);border:1px solid rgba(52,201,122,0.15);color:#6a9878;padding:8px 14px;border-radius:20px;font-size:13px;font-family:Inter,sans-serif">${esc(q)}</span>`).join("")}
</div>
${relatedArticlesGrid(AI_RELATED)}
${emotionalCTA({ title: "Try the MyTazki AI Islamic Coach", subtitle: "Claude-powered. Islamic adab guidelines. 20 free questions daily. Ask anything about your deen.", href: "/download", btnText: "Chat with AI Companion →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 3. AI Dua Generator ─────────────────────────────────────────────────────
router.get("/ai-dua-generator", (_req, res) => {
  const slug = "/ai-dua-generator"; const title = "AI Dua Suggestion Tool, Find the Right Dua for Any Situation"; const desc = "How AI helps you find the right dua from Quran and Sunnah for any situation. Explore MyTazki's dua library and AI companion for personalised supplication guidance.";
  const bcs = [{ name: "Home", item: "/" }, { name: "AI Islamic Tools", item: "/ai-islamic-tools" }, { name: "AI Dua Suggestion Tool" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("Can AI help me find the right dua?", "Yes, AI can search through the vast treasury of Prophetic duas and Quranic supplications to find the most relevant dua for your situation. If you say 'I'm feeling anxious about a job interview,' AI can suggest: the dua for anxiety ('Allahumma inni a'udhu bika minal hamm wal hazan'), the dua before undertaking something important, and the dua for seeking guidance (Istikharah). MyTazki's AI companion does exactly this.")}
<h2>Categories of Duas AI Can Help You Find</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:16px 0">
${[
  ["😟 Emotional", "Anxiety, grief, sadness, loneliness, fear, anger"],
  ["🤲 Daily Life", "Morning, evening, eating, sleeping, travelling, entering home"],
  ["💼 Work & Study", "Before exams, for rizq, for success, for barakah in work"],
  ["👨‍👩‍👧 Family", "For spouse, for children, for parents, for pregnancy"],
  ["🏥 Health", "For healing, for the sick, when in pain, for protection"],
  ["📖 Spiritual", "For guidance, for tawbah, for strength of iman, for khushu"],
  ["🌙 Prayer", "Before salah, in sujood, after prayer, Witr qunoot"],
  ["🛡 Protection", "Evil eye, black magic, Shaytan, bad dreams, enemies"],
].map(([t, d]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:12px">
  <strong style="color:#eaf4ee;font-size:13px;font-family:Inter,sans-serif;display:block;margin-bottom:4px">${t}</strong>
  <p style="color:#4a6858;font-size:12px;margin:0;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
<h2>MyTazki's Duas Library, 110+ Authentic Duas</h2>
<p style="color:#a0c8a0;line-height:1.8">Every dua in MyTazki comes from Quran and authenticated Hadith. No fabricated duas. Arabic text, transliteration, English meaning, category, and audio. Filter by mood/emotion (8 emotional categories), search by keyword, and save favourites. The AI companion can suggest specific duas from this library based on your situation.</p>
${relatedArticlesGrid(AI_RELATED)}
${emotionalCTA({ title: "Find Your Dua in MyTazki", subtitle: "110+ authentic duas with Arabic, audio, and AI-powered suggestions for any situation.", href: "/download", btnText: "Open Duas Library →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 4. Best Islamic AI Apps ──────────────────────────────────────────────────
router.get("/best-islamic-ai-apps", (_req, res) => {
  const slug = "/best-islamic-ai-apps"; const title = "Best AI Apps for Muslims in 2026, Complete Comparison"; const desc = "The best Islamic AI apps compared: MyTazki, Muslim Pro, Quran.com, and others. Which app has the best AI features, prayer tools, Quran, and Islamic guidance?";
  const bcs = [{ name: "Home", item: "/" }, { name: "AI Islamic Tools", item: "/ai-islamic-tools" }, { name: "Best Islamic AI Apps 2026" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is the best AI app for Muslims in 2026?", "MyTazki is the most complete AI-integrated Islamic app in 2026: it combines Claude AI (the most capable AI model) with prayer times, Quran reader, duas library, azkar sessions, habit tracking, and spiritual growth tools, all in one app. Other apps offer AI features but lack the integrated Islamic lifestyle ecosystem. MyTazki's AI is specifically configured with Islamic adab guidelines and designed for Muslim spiritual growth.")}
<h2>App Comparison: AI Islamic Features</h2>
<div style="overflow-x:auto;margin:20px 0">
<table style="width:100%;border-collapse:collapse;font-family:Inter,sans-serif;font-size:14px">
  <thead><tr style="background:rgba(52,201,122,0.08)">
    ${["App", "AI Companion", "Quran", "Prayer Times", "Duas", "Habits", "Price"].map(h => `<th style="padding:12px 16px;text-align:left;color:#34c97a;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid rgba(52,201,122,0.15)">${h}</th>`).join("")}
  </tr></thead>
  <tbody>
    ${[
      ["MyTazki", "✅ Claude AI (20/day)", "✅ 114 surahs + audio", "✅ GPS accurate", "✅ 110+ duas", "✅ Streak tracker", "Free"],
      ["Muslim Pro", "⚠️ Basic chatbot", "✅ Full Quran", "✅ Good", "⚠️ Limited", "⚠️ Basic", "Freemium"],
      ["Quran.com", "❌ No AI", "✅ Excellent", "❌ No", "❌ No", "❌ No", "Free"],
      ["Athan Pro", "❌ No AI", "⚠️ Basic", "✅ Good", "⚠️ Limited", "❌ No", "Freemium"],
    ].map((row, i) => `<tr style="background:${i === 0 ? 'rgba(52,201,122,0.05)' : 'transparent'};border-bottom:1px solid rgba(52,201,122,0.08)">
      ${row.map((cell, j) => `<td style="padding:12px 16px;color:${j === 0 ? '#eaf4ee' : '#6a9878'};font-weight:${j === 0 ? '700' : '400'}">${esc(cell)}</td>`).join("")}
    </tr>`).join("")}
  </tbody>
</table>
</div>
<h2>Why MyTazki's AI Is Different</h2>
<p style="color:#a0c8a0;line-height:1.8">Most Islamic apps bolt on a generic chatbot. MyTazki's AI (powered by Anthropic's Claude) is specifically configured with Islamic adab guidelines: it cites Quran and Hadith, uses appropriate honorifics, avoids controversial rulings, always recommends scholars for complex matters, and is integrated with the app's complete Islamic content library, Quran, duas, sessions, and habit data.</p>
${relatedArticlesGrid(AI_RELATED)}
${emotionalCTA({ title: "Try the Best Islamic AI App Free", subtitle: "MyTazki, Prayer times, Quran, Duas, AI companion, and spiritual growth tools. Everything in one app.", href: "/download", btnText: "Download MyTazki Free →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), softwareAppSchema("MyTazki", "AI-powered Islamic companion app"), breadcrumbSchema(bcs)] }), body));
});

// ─── 5. AI for Muslims ────────────────────────────────────────────────────────
router.get("/ai-for-muslims", (_req, res) => {
  const slug = "/ai-for-muslims"; const title = "How Muslims Are Using AI, The Rise of Islamic AI Tools"; const desc = "How Muslims worldwide are using AI for Islamic learning, Quran understanding, fatwa research, and daily spiritual guidance. The ethical Islamic framework for AI use.";
  const bcs = [{ name: "Home", item: "/" }, { name: "AI Islamic Tools", item: "/ai-islamic-tools" }, { name: "AI for Muslims" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("Is it permissible for Muslims to use AI for Islamic guidance?", "Using AI as a tool for Islamic learning is permissible (and beneficial), similar to using books, search engines, or lecture recordings. What matters is how it is used: AI should assist in learning and exploration, not replace qualified scholars for formal rulings. The Islamic principle is: 'Ask the people of knowledge if you do not know' (16:43), AI is a powerful knowledge tool, not an 'alim (scholar). Use it accordingly.")}
<h2>5 Ways Muslims Are Using AI in Their Deen</h2>
<div style="display:flex;flex-direction:column;gap:12px;margin:16px 0">
${[
  ["Quran Understanding", "AI explains complex Quranic verses in plain language, drawing from classical tafsir. Muslims who didn't have access to Islamic education can now engage deeply with the Quran in their own language."],
  ["Arabic Learning Assistance", "AI helps Muslims learn Quranic Arabic, explaining grammar, root words, and nuances. Understanding the Quran in its original language transforms the prayer experience."],
  ["Finding Relevant Duas", "Muslims ask AI to suggest specific duas from the Sunnah for their situation, anxiety, travel, exams, grief. AI surfaces authentic supplications that people might not have known existed."],
  ["Islamic Lifestyle Questions", "How to handle a specific halal/haram question, how to explain Islamic practices to non-Muslim colleagues, how to manage a certain situation Islamically, AI provides initial guidance while recommending scholars for complex matters."],
  ["Ramadan and Ibadah Planning", "Muslims use AI to plan their Ramadan schedule, design a Quran completion plan, or create a personalised dhikr routine. AI helps structure Islamic practice around modern life schedules."],
].map(([t, d]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:16px">
  <strong style="color:#34c97a;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${t}</strong>
  <p style="color:#6a9878;font-size:14px;margin:0;line-height:1.6;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
<h2>Islamic Principles for Ethical AI Use</h2>
<p style="color:#a0c8a0;line-height:1.8">Islam's framework for any new technology (istislah) asks: does this serve the five objectives of Islamic law (protection of life, intellect, lineage, wealth, and religion)? AI, when used appropriately, protects intellect by increasing access to knowledge. The key principles: (1) Verify AI outputs against established scholarship. (2) Never use AI for fatawa on major life decisions. (3) Report harmful AI outputs to developers. (4) Use AI as a tool for ibadah, not to replace it.</p>
${relatedArticlesGrid(AI_RELATED)}
${emotionalCTA({ title: "Islamic AI, Designed for Muslims by Muslims", subtitle: "MyTazki's AI is built with Islamic adab, trained on Islamic knowledge, and integrated with your deen.", href: "/download", btnText: "Try MyTazki AI Free →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 6. ChatGPT for Islamic Questions ────────────────────────────────────────
router.get("/chatgpt-for-islamic-questions", (_req, res) => {
  const slug = "/chatgpt-for-islamic-questions"; const title = "ChatGPT for Islamic Questions, What to Use and What to Avoid"; const desc = "Can you use ChatGPT for Islamic questions? An honest guide: what ChatGPT does well, where it falls short, common errors in Islamic fiqh, and why MyTazki's AI is better for Muslims.";
  const bcs = [{ name: "Home", item: "/" }, { name: "AI Islamic Tools", item: "/ai-islamic-tools" }, { name: "ChatGPT for Islamic Questions" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("Is it safe to use ChatGPT for Islamic questions?", "ChatGPT can be useful for general Islamic learning, understanding concepts, exploring Islamic history, and finding common duas. However, it has significant limitations: it sometimes confuses madhabs, presents minority opinions as mainstream, and lacks the Islamic adab (proper respect) of trained Islamic AI. For formal rulings, always consult a qualified scholar. For daily Islamic questions, MyTazki's AI companion is specifically configured with Islamic guidelines and more reliable for Muslims.")}
<h2>What ChatGPT Does Well for Islamic Questions</h2>
<div style="display:flex;flex-direction:column;gap:10px;margin:16px 0">
${[
  ["✅ General Islamic History", "ChatGPT is knowledgeable about Islamic history, the life of the Prophet ﷺ, the Sahaba, major Islamic civilisations, and historical events. Good for exploration."],
  ["✅ Explaining Basic Concepts", "The Five Pillars, basic fiqh definitions, the difference between fard and sunnah, what Ramadan is, ChatGPT handles these competently."],
  ["✅ Finding Common Duas", "For well-known duas (Ayatul Kursi, Istighfar, morning azkar), ChatGPT can provide accurate Arabic and translation."],
].map(([t, d]) => `<div style="background:rgba(52,201,122,0.04);border-left:3px solid rgba(52,201,122,0.3);padding:12px 16px;border-radius:0 8px 8px 0"><strong style="color:#eaf4ee;font-size:14px;font-family:Inter,sans-serif;display:block;margin-bottom:4px">${t}</strong><p style="color:#6a9878;font-size:13px;margin:0;font-family:Inter,sans-serif">${d}</p></div>`).join("")}
</div>
<h2>Where ChatGPT Falls Short for Muslims</h2>
<div style="display:flex;flex-direction:column;gap:10px;margin:16px 0">
${[
  ["⚠️ Fiqh Rulings", "ChatGPT frequently confuses rulings across different madhabs (Hanafi, Shafi, Maliki, Hanbali) or presents one opinion as if it is universal consensus. This can be misleading."],
  ["⚠️ Hadith Authentication", "ChatGPT sometimes presents weak or fabricated hadiths as authentic, or misattributes hadith gradings. Always verify hadith references with authentic sources."],
  ["⚠️ Lack of Islamic Adab", "Generic AI doesn't consistently use ﷺ, RA, or appropriate Islamic honorifics. This feels disrespectful and indicates a lack of Islamic awareness in the AI's configuration."],
  ["⚠️ No Spiritual Context", "ChatGPT treats Islamic questions informationally, not spiritually. It can tell you WHAT to pray but cannot guide you on WHY it matters to your heart."],
].map(([t, d]) => `<div style="background:rgba(184,148,106,0.05);border-left:3px solid rgba(184,148,106,0.3);padding:12px 16px;border-radius:0 8px 8px 0"><strong style="color:#b8946a;font-size:14px;font-family:Inter,sans-serif;display:block;margin-bottom:4px">${t}</strong><p style="color:#6a9878;font-size:13px;margin:0;font-family:Inter,sans-serif">${d}</p></div>`).join("")}
</div>
<h2>Why MyTazki AI Is Better for Muslims</h2>
<p style="color:#a0c8a0;line-height:1.8">MyTazki's AI companion is built on Claude (Anthropic), configured specifically for Islamic context: consistent use of Islamic honorifics, built-in knowledge of the major madhabs, explicit hedging on disputed matters, redirection to scholars for formal rulings, integration with the app's authentic duas and Quran library, and a spiritually supportive rather than purely informational tone. It is Islamic AI, not generic AI with Islamic questions.</p>
${relatedArticlesGrid(AI_RELATED)}
${emotionalCTA({ title: "Try Islamic AI, Properly Configured for Muslims", subtitle: "MyTazki's AI companion. Claude-powered. Islamic adab. 20 free questions daily.", href: "/download", btnText: "Try MyTazki AI →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), faqSchema([{ q: "Is it safe to use ChatGPT for Islamic questions?", a: "For general learning yes, for formal rulings no, always consult a scholar." }]), breadcrumbSchema(bcs)] }), body));
});

export default router;
