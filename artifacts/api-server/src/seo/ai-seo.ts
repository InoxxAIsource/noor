import { Router } from "express";
import { seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc } from "./shared.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function articleSchema(title: string, desc: string, slug: string, date: string): object {
  return { "@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "author": { "@type": "Organization", "name": "MyTazki" }, "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" }, "datePublished": date, "dateModified": TODAY, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` } };
}
function speakableSchema(slug: string): object {
  return { "@context": "https://schema.org", "@type": "WebPage", "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ai-summary", "h1"] }, "url": `https://mytazki.com${slug}` };
}
function softwareSchema(name: string, desc: string, url: string): object {
  return { "@context": "https://schema.org", "@type": "SoftwareApplication", "name": name, "description": desc, "url": url, "applicationCategory": "LifestyleApplication", "operatingSystem": "Web, iOS, Android", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } };
}

function aiPage(opts: {
  title: string; desc: string; slug: string; h1: string; date: string;
  aiSummary: string; intro: string; mainHtml: string;
  capabilities: Array<{ icon: string; title: string; desc: string }>;
  faqs: Array<{ q: string; a: string }>;
  conversationalQ: Array<string>;
  internalLinks: Array<{ href: string; label: string }>;
  relatedArticles: Array<{ href: string; label: string }>;
  breadcrumbs: Array<{ name: string; item?: string }>;
}): string {
  const head = seoHead({ title: opts.title, description: opts.desc, canonical: opts.slug, schema: [articleSchema(opts.title, opts.desc, opts.slug, opts.date), speakableSchema(opts.slug), softwareSchema("MyTazki AI", opts.desc, `https://mytazki.com${opts.slug}`), faqSchema(opts.faqs), breadcrumbSchema(opts.breadcrumbs)] });
  const body = `
${breadcrumb(opts.breadcrumbs)}
<h1>${esc(opts.h1)}</h1>
<div class="ai-summary" style="background:rgba(52,201,122,0.07);border-left:4px solid #34c97a;border-radius:0 10px 10px 0;padding:16px 20px;margin:20px 0;font-size:15px;line-height:1.7;color:#eaf4ee">
<strong style="color:#34c97a">Quick Answer:</strong> ${opts.aiSummary}
</div>
<p style="font-size:16px;line-height:1.8;color:#a0c8a0;margin-bottom:20px">${opts.intro}</p>
${opts.mainHtml}
<h2>What MyTazki AI Can Do for You</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:16px 0">
${opts.capabilities.map(c => `<div class="card"><p style="font-size:1.5rem;margin:0 0 8px">${c.icon}</p><p style="color:#34c97a;font-weight:600;margin:0 0 4px;font-size:13px">${esc(c.title)}</p><p style="color:#6a9878;font-size:12px;margin:0;line-height:1.5">${esc(c.desc)}</p></div>`).join("")}
</div>
<h2>Questions People Ask Islamic AI</h2>
<div style="background:rgba(52,201,122,0.04);border-radius:10px;padding:16px 20px;margin:16px 0;border:1px solid rgba(52,201,122,0.1)">
${opts.conversationalQ.map(q => `<p style="color:#a0c8a0;margin:8px 0;font-size:14px;padding-left:12px;border-left:2px solid rgba(52,201,122,0.3)">→ "${esc(q)}"</p>`).join("")}
</div>
<div style="text-align:center;margin:24px 0">
<a href="/home" style="background:#34c97a;color:#0d1411;padding:14px 36px;border-radius:12px;font-weight:700;text-decoration:none;font-size:15px;display:inline-block;font-family:Inter,sans-serif">Try MyTazki AI Free →</a>
<p style="color:#6a9878;font-size:12px;margin:10px 0 0;font-family:Inter,sans-serif">Free · 20 questions/day · Grounded in Quran & Sunnah</p>
</div>
${faqHtml(opts.faqs)}
<h2>More Islamic Tools</h2>
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

router.get("/ai-islamic-assistant", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(aiPage({
    slug: "/ai-islamic-assistant", date: "2026-04-01",
    title: "AI Islamic Assistant, Ask Islamic Questions, Get Quran-Based Answers",
    desc: "MyTazki's AI Islamic Assistant answers your Islamic questions based on Quran and Sunnah. Free, available 24/7, grounded in authentic Islamic knowledge.",
    h1: "AI Islamic Assistant, Islamic Knowledge, Always Available",
    aiSummary: "MyTazki's AI Islamic Assistant is an AI guide trained to answer Islamic questions grounded in Quran and Sunnah. You can ask about prayer, fiqh, duas, Quran meaning, Islamic history, halal/haram, and spiritual struggles. It's available 24/7, free for 20 questions per day, and follows Islamic adab in every response.",
    intro: "For centuries, Muslims relied on scholars for answers to their Islamic questions. Today, access to Islamic knowledge is unequal, not everyone lives near a qualified scholar, not everyone can read classical Arabic texts, not everyone knows which questions to ask. MyTazki's AI Islamic Assistant changes that: qualified Islamic guidance, grounded in the Quran and Sunnah, available to anyone, anywhere, at any time.",
    mainHtml: `<h2>How MyTazki AI Approaches Islamic Questions</h2>
<p style="color:#a0c8a0;line-height:1.8">MyTazki AI is powered by Claude (Anthropic) with a specialized Islamic system prompt that grounds every response in the Quran and Sunnah, maintains proper Islamic adab, avoids fatwas beyond its competence, references authentic hadith, and always recommends consulting local scholars for significant fiqh questions. It is a knowledge companion, not a mufti.</p>
<h2>What Makes MyTazki AI Different</h2>
<p style="color:#a0c8a0;line-height:1.8">Unlike generic AI assistants (ChatGPT, Gemini) that give generic Islamic answers, MyTazki AI: maintains Islamic adab throughout, declines inappropriate questions with explanation, cites Quranic verses and hadith for its answers, takes spiritual state (anxiety, grief, doubt) into account, and is designed specifically for the Muslim experience.</p>`,
    capabilities: [
      { icon: "📖", title: "Quran Questions", desc: "Meaning of verses, tafsir, context, application" },
      { icon: "🤲", title: "Dua Guidance", desc: "Which duas for which situations, Arabic text" },
      { icon: "⚖️", title: "Fiqh Questions", desc: "Basic rulings from authentic sources" },
      { icon: "💚", title: "Spiritual Support", desc: "Help with anxiety, disconnection, and doubt" },
      { icon: "📿", title: "Dhikr Guidance", desc: "Best dhikr for specific situations" },
      { icon: "🕌", title: "Islamic Knowledge", desc: "History, stories of prophets, Islamic concepts" },
    ],
    conversationalQ: [
      "What dua should I say when I feel anxious?",
      "Can I pray Qada prayers for years of missed salah?",
      "What does Surah Ad-Duha mean in English?",
      "Is music halal or haram in Islam?",
      "How do I perform Ghusl correctly?",
      "What are the conditions for Zakat?",
    ],
    faqs: [
      { q: "Is the MyTazki AI a real mufti?", a: "No. MyTazki AI is an AI knowledge companion, not a qualified mufti or Islamic scholar. For significant fiqh rulings (affecting major life decisions), consult a qualified local scholar or darul ifta. MyTazki AI provides educational Islamic knowledge, not official fatwas." },
      { q: "How many questions can I ask the Islamic AI per day?", a: "MyTazki AI allows 20 questions per day for free users. The AI is powered by Anthropic's Claude, specialized with Islamic knowledge guidelines." },
      { q: "Is MyTazki AI safe for children to use?", a: "Yes. MyTazki AI is designed with Islamic adab guidelines that filter inappropriate content and maintain a spiritually appropriate tone for all ages." },
      { q: "What languages does MyTazki AI understand?", a: "MyTazki AI understands English, Urdu, Arabic, and other major languages. Responses are typically in the same language you ask in." },
    ],
    internalLinks: [
      { href: "/duas", label: "Duas Library" },
      { href: "/quran", label: "Quran Reader" },
      { href: "/sessions", label: "Guided Sessions" },
      { href: "/home", label: "Open MyTazki App" },
    ],
    relatedArticles: [
      { href: "/ai-quran-explainer", label: "AI Quran Explainer" },
      { href: "/ask-islam-ai", label: "Ask Islamic Questions Online" },
      { href: "/how-islam-brings-peace", label: "How Islam Brings Peace" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "AI Islamic Assistant" }],
  }));
});

router.get("/ai-quran-explainer", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(aiPage({
    slug: "/ai-quran-explainer", date: "2026-04-03",
    title: "AI Quran Explainer, Understand Any Verse with AI Help",
    desc: "Get AI-powered explanations of any Quran verse. Ask about meaning, context, tafsir, Arabic words, and how to apply the verse in your life, free with MyTazki.",
    h1: "AI Quran Explainer, Understanding the Quran Has Never Been Easier",
    aiSummary: "MyTazki's AI Quran Explainer helps you understand any verse of the Quran, its Arabic meaning, historical context (asbab al-nuzool), classical tafsir summary, and personal application. Unlike static translations, you can ask follow-up questions: 'What does this word mean in Arabic?' or 'How does this apply to modern life?' It's an interactive Quran study companion.",
    intro: "The Quran was revealed to be understood, not just recited. Yet for millions of Muslims who don't read classical Arabic or have access to scholars, the Quran remains linguistically inaccessible. MyTazki's AI Quran Explainer changes this: ask about any verse, in any language, and receive an explanation grounded in authentic Islamic scholarship.",
    mainHtml: `<h2>How AI Makes Quran Understanding Accessible</h2>
<p style="color:#a0c8a0;line-height:1.8">Classical tafsir (Quran interpretation) is a deep scholarly tradition, Ibn Kathir's Tafsir alone runs to thousands of pages. Most Muslims don't have the time or Arabic proficiency to access these resources directly. MyTazki AI distills this knowledge into conversational explanations while maintaining scholarly integrity, making what was once available only to Arabic scholars accessible to every Muslim.</p>
<h2>The Limits of AI Quran Explanation</h2>
<p style="color:#a0c8a0;line-height:1.8">Intellectual honesty matters: AI explanations are educational summaries, not authoritative tafsir. For complex theological questions, matters of aqeedah, or fiqh rulings derived from Quranic verses, consult qualified scholars. MyTazki AI acknowledges its limitations and refers users to scholars when appropriate.</p>`,
    capabilities: [
      { icon: "📖", title: "Verse Explanation", desc: "Plain-language meaning of any verse" },
      { icon: "🌐", title: "Arabic Word Meaning", desc: "What specific Arabic words mean" },
      { icon: "📜", title: "Tafsir Summary", desc: "Classical scholarly interpretation" },
      { icon: "🕰️", title: "Historical Context", desc: "When and why the verse was revealed" },
      { icon: "💡", title: "Life Application", desc: "How to apply the verse today" },
      { icon: "🔗", title: "Connected Verses", desc: "Related ayat on the same topic" },
    ],
    conversationalQ: [
      "What does Surah Al-Baqarah verse 286 mean?",
      "Why was Surah Ad-Duha revealed?",
      "What is the meaning of 'Alhamdulillahi rabbil alameen'?",
      "How does Surah Yusuf apply to my life?",
      "What are the themes of the last 10 surahs?",
      "Explain Ayatul Kursi word by word",
    ],
    faqs: [
      { q: "Can AI explain the Quran accurately?", a: "AI can provide accurate educational explanations based on classical tafsir and Islamic scholarship. However, AI is a tool, not a scholar. For complex questions involving aqeedah, fiqh, or personal religious rulings, always consult a qualified Islamic scholar. MyTazki AI is explicit about this limitation." },
      { q: "Which tafsir does MyTazki AI use?", a: "MyTazki AI synthesizes information from classical tafsir works (Ibn Kathir, Tafsir al-Jalalayn, Al-Tabari) and contemporary scholarly consensus, always attributing positions when possible. It prioritizes the majority scholarly view and notes significant differences when they exist." },
      { q: "Can I use AI to learn Tajweed?", a: "AI can explain Tajweed rules in text, but learning correct pronunciation requires audio feedback from a human teacher. MyTazki recommends combining AI text explanations with a qualified Tajweed teacher or certified online course for pronunciation." },
    ],
    internalLinks: [
      { href: "/quran", label: "Read the Full Quran" },
      { href: "/sessions", label: "Quran Reflection Sessions" },
      { href: "/ai-islamic-assistant", label: "MyTazki AI Assistant" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/ai-islamic-assistant", label: "AI Islamic Assistant" },
      { href: "/surah-rahman-reflection", label: "Surah Ar-Rahman Reflection" },
      { href: "/quran-about-anxiety", label: "What the Quran Says About Anxiety" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "AI Quran Explainer" }],
  }));
});

router.get("/ask-islam-ai", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(aiPage({
    slug: "/ask-islam-ai", date: "2026-04-05",
    title: "Ask Islamic Questions Online, AI-Powered Islamic Q&A",
    desc: "Ask any Islamic question online and get answers grounded in Quran and Sunnah. MyTazki's AI answers fiqh, duas, Quran, hadith, and spiritual questions, free.",
    h1: "Ask Islamic Questions Online, Get Answers from MyTazki AI",
    aiSummary: "You can ask Islamic questions online through MyTazki's AI, covering prayer, fiqh basics, duas, Quran meanings, Islamic history, halal/haram rulings, and spiritual guidance. It's free (20 questions/day), available 24/7, responses grounded in Quran and Sunnah. For major fatwa-level questions, always consult a qualified local scholar.",
    intro: "Once, getting answers to Islamic questions required finding a scholar. Now, most Muslims have immediate access to information, but much of it is unvetted, contradictory, or simply wrong. MyTazki's AI is trained specifically to answer Islamic questions from Quran and Sunnah, with transparency about what it knows and what requires a scholar.",
    mainHtml: `<h2>Types of Islamic Questions MyTazki AI Can Answer</h2>
<p style="color:#a0c8a0;line-height:1.8"><strong style="color:#eaf4ee">Quran Questions:</strong> Meaning of verses, why surahs were revealed, themes of specific surahs. <strong style="color:#eaf4ee">Prayer Questions:</strong> How to pray, Sunnah prayers, makeup prayers, conditions of salah. <strong style="color:#eaf4ee">Dua Questions:</strong> Which duas for which situations, authenticity, how to make dua. <strong style="color:#eaf4ee">Fiqh Basics:</strong> Common rulings on halal/haram, purification, zakat basics. <strong style="color:#eaf4ee">Spiritual Questions:</strong> How to strengthen iman, dealing with spiritual distance, Islamic perspectives on mental health.</p>
<h2>What MyTazki AI Will NOT Answer</h2>
<p style="color:#a0c8a0;line-height:1.8">MyTazki AI declines to: issue major fatwas on complex fiqh questions, make judgments about specific individuals, give legal or medical advice, or respond to inappropriate content. When questions exceed its competence, it explicitly refers users to qualified scholars.</p>`,
    capabilities: [
      { icon: "🤲", title: "Prayer & Worship", desc: "Salah, Wudu, Zakat, Hajj basics" },
      { icon: "📖", title: "Quran & Hadith", desc: "Verse meanings, hadith authenticity" },
      { icon: "💚", title: "Halal/Haram", desc: "Common questions on permissibility" },
      { icon: "🧠", title: "Spiritual Growth", desc: "Iman, tawbah, purification of the heart" },
      { icon: "📅", title: "Islamic Life", desc: "Marriage, family, finances in Islam" },
      { icon: "🌙", title: "Islamic Events", desc: "Ramadan, Eid, Hajj, and special nights" },
    ],
    conversationalQ: [
      "How do I perform tayammum (dry ablution)?",
      "Is it permissible to combine prayers when traveling?",
      "What makes a nikah (Islamic marriage) valid?",
      "How much is the nisab for zakat on savings?",
      "Can I listen to Quran while doing other things?",
      "What should I say when someone dies in Islam?",
    ],
    faqs: [
      { q: "Is it permissible to ask an AI for Islamic rulings?", a: "Using AI as an educational tool to understand Islamic knowledge is permissible, similar to reading an Islamic book. However, acting on AI responses for significant personal religious decisions without scholarly verification is not recommended. Use MyTazki AI for learning and understanding, consult scholars for personal fatwa." },
      { q: "Where can I ask Islamic questions for free?", a: "MyTazki AI allows 20 free questions daily. For official Islamic rulings: IslamQA.info (Sheikh Munajjid's team), your local mosque imam, or regional darul ifta (house of Islamic rulings) are the authoritative sources." },
      { q: "Can I trust AI for Islamic information?", a: "For educational questions about well-known Islamic facts (prayer times, Quran verses, common duas), AI is reasonably reliable. For nuanced fiqh questions or personal religious decisions, always verify with qualified scholars. MyTazki AI is transparent about its limitations and will tell you when to consult a scholar." },
    ],
    internalLinks: [
      { href: "/duas", label: "Duas Library" },
      { href: "/salah-guide", label: "Salah Guide" },
      { href: "/farz-guide", label: "Farz Guide" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/ai-islamic-assistant", label: "AI Islamic Assistant" },
      { href: "/ai-quran-explainer", label: "AI Quran Explainer" },
      { href: "/islamic-ai-companion", label: "Islamic AI Companion" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Ask Islam AI" }],
  }));
});

router.get("/islamic-ai-companion", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(aiPage({
    slug: "/islamic-ai-companion", date: "2026-04-07",
    title: "Islamic AI Companion, MyTazki's Spiritual Growth AI",
    desc: "MyTazki is an Islamic AI companion app for daily spiritual growth, Quran, Azkar, Duas, prayer tracking, and an AI guide grounded in Islamic values.",
    h1: "Islamic AI Companion, Grow Spiritually Every Day with MyTazki",
    aiSummary: "MyTazki is an Islamic AI companion app that combines: guided Quran reflections, Azkar sessions, Duas library, prayer time tracking, spiritual streak tracking, and an AI assistant grounded in Quran and Sunnah. Unlike generic Muslim apps, MyTazki is AI-first: every feature is designed around helping Muslims grow spiritually through personalized, intelligent guidance.",
    intro: "The concept of an Islamic 'companion' (rafiq) in the spiritual journey is well-established in Islamic tradition. Scholars throughout history have emphasized the importance of righteous companionship for spiritual growth. MyTazki is the digital manifestation of this concept, a companion that accompanies you through every moment of your day with Islamic wisdom.",
    mainHtml: `<h2>Why MyTazki is Different from Other Muslim Apps</h2>
<p style="color:#a0c8a0;line-height:1.8">Most Muslim apps are content libraries: they deliver prayer times, Quran text, and dua collections. MyTazki goes further: it understands your spiritual state, guides you through personalized growth journeys, tracks your habits, provides AI-powered Islamic answers, and adapts to where you are in your spiritual journey, beginner, returning, or advanced.</p>
<h2>The AI-First Approach to Islamic Growth</h2>
<p style="color:#a0c8a0;line-height:1.8">Traditional Islamic growth happened through: teachers (scholars), companions (righteous friends), and texts (books). AI makes all three accessible: it teaches Islamic knowledge on demand, provides companionship through guided sessions, and synthesizes centuries of Islamic texts into conversational answers. MyTazki uses AI to democratize access to Islamic spiritual guidance.</p>`,
    capabilities: [
      { icon: "✦", title: "AI Islamic Guide", desc: "Answer any Islamic question, 20/day free" },
      { icon: "📖", title: "Quran Reader", desc: "All 114 surahs with translation and audio" },
      { icon: "🎧", title: "35+ Guided Sessions", desc: "Azkar, healing, sleep, Quran reflection" },
      { icon: "🕌", title: "Prayer Times", desc: "For 80+ cities with streak tracking" },
      { icon: "📿", title: "Digital Tasbih", desc: "With vibration and progress tracking" },
      { icon: "📊", title: "Spiritual Growth", desc: "Habits, streaks, journal, milestones" },
    ],
    conversationalQ: [
      "I want an Islamic app that has AI",
      "Best Islamic companion app for Muslims",
      "Muslim spiritual growth app",
      "AI that answers Islamic questions",
      "Islamic self improvement app",
    ],
    faqs: [
      { q: "What is an Islamic AI companion?", a: "An Islamic AI companion is an application that combines AI technology with Islamic knowledge to provide personalized spiritual guidance. MyTazki uses Claude AI to answer Islamic questions, while also offering prayer tracking, guided sessions, Quran reader, and growth tracking, a complete Islamic lifestyle companion." },
      { q: "Is MyTazki free?", a: "Yes. MyTazki is completely free with no ads. Core features, prayer times, Quran reader, Duas library, Tasbih, AI guide (20 questions/day), and growth tracker, are all free forever." },
      { q: "How is MyTazki different from Calm or Headspace for Muslims?", a: "Calm and Headspace provide secular mindfulness. MyTazki provides Islamic spiritual growth, grounded in the Quran and Sunnah. The sessions are Islamic: Azkar, Quran reflections, dua-guided meditations. The AI is Islamic-specific. The tracking is salah and Islamic habit focused. It is the 'Calm for Muslims', but authentically Islamic, not Islamic-themed secular content." },
    ],
    internalLinks: [
      { href: "/sessions", label: "Guided Sessions" },
      { href: "/ai-islamic-assistant", label: "MyTazki AI" },
      { href: "/quran", label: "Quran Reader" },
      { href: "/home", label: "Open MyTazki Free" },
    ],
    relatedArticles: [
      { href: "/ai-islamic-assistant", label: "AI Islamic Assistant" },
      { href: "/islamic-self-improvement", label: "Islamic Self Improvement" },
      { href: "/daily-muslim-routine", label: "Daily Muslim Routine" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Islamic AI Companion" }],
  }));
});

router.get("/quran-ai-reflection", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(aiPage({
    slug: "/quran-ai-reflection", date: "2026-04-09",
    title: "AI-Powered Quran Reflection, Deepen Your Quran Understanding",
    desc: "Use AI to deepen your Quran reflection practice. How MyTazki's AI generates personalized Quran reflections, guided questions, and practical applications for any verse.",
    h1: "AI-Powered Quran Reflection, More Depth, More Insight",
    aiSummary: "MyTazki AI enhances Quran reflection by generating guided reflection questions for any verse, explaining classical tafsir in plain language, suggesting personal application steps, connecting verses to your current life situation, and providing Arabic word-by-word breakdowns. This transforms passive reading into active, transformative reflection, the tadabbur that the Quran commands.",
    intro: "The Quran commands us to reflect (tadabbur): 'Do they not ponder the Quran, or are there locks upon their hearts?' (47:24). Reflection is not just reading, it is asking, connecting, personalizing. AI makes this interactive: instead of reading passively, you can ask 'What does this verse mean for me today?' and receive a personalized reflection prompt.",
    mainHtml: `<h2>What is Tadabbur (Quran Reflection)?</h2>
<p style="color:#a0c8a0;line-height:1.8">Tadabbur (تَدَبُّر) means to ponder, consider, and reflect deeply on the Quran's meaning. The Prophet ﷺ and companions would spend years on single surahs, extracting layers of meaning. Scholar Ibn al-Qayyim said: 'The one who reflects on the Quran has a living heart.' AI-assisted reflection is a modern tool for this ancient practice.</p>
<h2>How MyTazki AI Enables Deeper Reflection</h2>
<p style="color:#a0c8a0;line-height:1.8">When you're reading Surah Yusuf and ask 'How does this apply to my life situation?', the AI generates personalized reflection questions: 'Where in your life do you feel unjustly treated, like Yusuf in the well? What would trusting Allah's plan look like in that situation?' This kind of guided reflection is what distinguishes transformative Quran engagement from passive recitation.</p>`,
    capabilities: [
      { icon: "💭", title: "Reflection Questions", desc: "Personalized questions for any verse" },
      { icon: "🌐", title: "Word Analysis", desc: "Arabic root meanings and nuances" },
      { icon: "📜", title: "Tafsir Summary", desc: "Classical scholarly interpretation" },
      { icon: "💡", title: "Life Application", desc: "How to act on the verse today" },
      { icon: "🔗", title: "Connected Themes", desc: "Similar verses across the Quran" },
      { icon: "📝", title: "Journal Prompts", desc: "Written reflection exercises" },
    ],
    conversationalQ: [
      "Help me reflect on Surah Al-Baqarah 2:286",
      "What can I learn from Surah Yusuf for my situation?",
      "Give me a reflection exercise on Surah Ad-Duha",
      "What does 'tawakkul' mean practically?",
      "How does Surah Ar-Rahman apply to daily gratitude?",
    ],
    faqs: [
      { q: "How can AI help with Quran reflection?", a: "AI can generate guided reflection questions for any verse, explain classical tafsir in plain language, suggest practical application steps, connect verses to contemporary situations, and provide interactive word-by-word Arabic explanations. It transforms passive Quran reading into active, transformative engagement." },
      { q: "What is the best way to reflect on the Quran?", a: "Classical scholars recommend: reading slowly (tartil), pausing at each verse, asking 'what does Allah want me to understand here?', connecting the verse to your current life, and journaling your reflections. MyTazki's guided sessions and AI companion support each of these steps." },
    ],
    internalLinks: [
      { href: "/quran", label: "Quran Reader" },
      { href: "/sessions", label: "Quran Sessions" },
      { href: "/ai-islamic-assistant", label: "MyTazki AI" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-rahman-reflection", label: "Surah Ar-Rahman Reflection" },
      { href: "/ai-quran-explainer", label: "AI Quran Explainer" },
      { href: "/ai-islamic-assistant", label: "AI Islamic Assistant" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran AI Reflection" }],
  }));
});

router.get("/ai-fatwa-guide", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(aiPage({
    slug: "/ai-fatwa-guide", date: "2026-04-11",
    title: "AI Islamic Knowledge Guide, Islamic Questions, Answered Responsibly",
    desc: "How AI can help with Islamic knowledge questions, and where its limits are. Responsible use of AI for Islamic learning, with MyTazki's approach to Islamic AI.",
    h1: "AI for Islamic Knowledge, What It Can and Cannot Do",
    aiSummary: "AI is valuable for Islamic education: explaining Quran meanings, describing Islamic practices, providing dua text, and explaining fiqh principles. It should NOT replace qualified scholars for: personal fatwa, complex jurisprudence, matters of aqeedah (creed), or medical/legal decisions. MyTazki AI follows this boundary, it educates, it doesn't issue personal religious rulings.",
    intro: "Muslims increasingly use AI (ChatGPT, Gemini, Perplexity) to answer Islamic questions. This is beneficial when done responsibly, and potentially harmful when AI's educational answers are treated as personal fatwas. This guide explains how to use AI for Islamic learning effectively and safely.",
    mainHtml: `<h2>What AI Does Well for Islamic Learning</h2>
<p style="color:#a0c8a0;line-height:1.8">AI excels at: explaining the meaning of Quranic verses and common hadith, describing Islamic practices and their Sunnah basis, providing the text and transliteration of duas, explaining Islamic historical context, translating Islamic texts, explaining fiqh principles from multiple madhabs, and summarizing scholarly positions on common questions. For these educational purposes, AI is genuinely useful.</p>
<h2>Where AI Falls Short for Islam</h2>
<p style="color:#a0c8a0;line-height:1.8">AI should not: issue personal fatwas on your specific situation, make authoritative rulings on contested fiqh questions, speak with certainty about matters of aqeedah where scholars differ, or replace the relationship between a Muslim and their scholar. AI lacks the contextual understanding, legal training, and spiritual relationship required for fatwa-level guidance.</p>
<h2>MyTazki AI's Approach</h2>
<p style="color:#a0c8a0;line-height:1.8">MyTazki AI is designed with these limits built in. It will explicitly say 'This requires consultation with a qualified scholar' when appropriate. It will present multiple scholarly positions on contested questions rather than picking one. It maintains Islamic adab in all responses and will never give advice that contradicts clear Quranic or Sunnah guidance.</p>`,
    capabilities: [
      { icon: "✅", title: "Can: Educate", desc: "Explain Quran, hadith, Islamic concepts" },
      { icon: "✅", title: "Can: Describe", desc: "Islamic practices, how-tos, steps" },
      { icon: "✅", title: "Can: Inform", desc: "Multiple scholarly views, fiqh basics" },
      { icon: "⚠️", title: "Limit: Personal Fatwa", desc: "Your specific situation needs a scholar" },
      { icon: "⚠️", title: "Limit: Complex Fiqh", desc: "Novel cases require qualified judgment" },
      { icon: "⚠️", title: "Limit: Final Authority", desc: "Always verify major decisions with scholars" },
    ],
    conversationalQ: [
      "Can I use ChatGPT for Islamic questions?",
      "Is AI fatwa allowed in Islam?",
      "How to get Islamic questions answered online?",
      "Where can I ask Islamic scholars online?",
    ],
    faqs: [
      { q: "Can I follow a fatwa from an AI?", a: "No. AI responses are educational information, not personal fatwas. A fatwa is a qualified Islamic legal ruling issued by a trained scholar who understands your specific situation, context, and the applicable fiqh methodology. AI lacks all of these. Use AI to understand the issues, then consult a qualified scholar for your specific situation." },
      { q: "Which is the best AI for Islamic questions?", a: "MyTazki AI is specifically designed for Islamic questions, it follows Islamic adab, cites Quran and hadith, acknowledges scholarly differences, and refers to scholars when appropriate. General AI (ChatGPT, Gemini) can answer Islamic questions but lacks Islamic-specific training and guidelines." },
      { q: "How do I find a qualified Islamic scholar to ask questions?", a: "Options: your local mosque imam, SeekersGuidance.org (free online fatwa service from qualified scholars), IslamQA.info, Dar al-Ifta in your country, or the Fiqh Council of North America. These are authoritative sources for qualified Islamic guidance." },
    ],
    internalLinks: [
      { href: "/ai-islamic-assistant", label: "MyTazki AI" },
      { href: "/duas", label: "Duas Library" },
      { href: "/farz-guide", label: "Farz Guide" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/ai-islamic-assistant", label: "AI Islamic Assistant" },
      { href: "/ask-islam-ai", label: "Ask Islamic Questions" },
      { href: "/ai-quran-explainer", label: "AI Quran Explainer" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "AI Islamic Knowledge Guide" }],
  }));
});

export default router;
