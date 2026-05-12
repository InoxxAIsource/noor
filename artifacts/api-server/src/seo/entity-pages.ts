import { Router, type Request, type Response } from "express";
import { seoHead, page, breadcrumb, breadcrumbSchema, faqSchema, faqHtml, esc, ctaBlock } from "./shared.js";
import { quickAnswerBox, peopleAlsoAsk, emotionalCTA, relatedArticlesGrid, conversationalBlock } from "./seo-components.js";

const router = Router();

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyTazki",
  "alternateName": "MyTazki AI Islamic Companion",
  "url": "https://mytazki.com",
  "logo": "https://mytazki.com/og-image.jpg",
  "description": "MyTazki is an AI-powered Islamic growth platform helping Muslims build prayer habits, explore Quran reflections, find duas, and grow spiritually every day.",
  "foundingDate": "2024",
  "sameAs": [
    "https://instagram.com/mytazki",
    "https://tiktok.com/@mytazki",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@mytazki.com",
  },
};

function eeatBar(author: string, role: string, reviewed: string, updated: string): string {
  return `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:14px 18px;background:rgba(52,201,122,0.04);border:1px solid rgba(52,201,122,0.1);border-radius:10px;margin:20px 0;font-family:Inter,sans-serif;font-size:13px">
  <div style="display:flex;align-items:center;gap:10px">
    <div style="width:34px;height:34px;background:#1c2d21;border:1.5px solid rgba(52,201,122,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px">✍️</div>
    <div>
      <div style="color:#eaf4ee;font-weight:600">${esc(author)}</div>
      <div style="color:#6a9878;font-size:12px">${esc(role)}</div>
    </div>
  </div>
  <div style="height:28px;width:1px;background:rgba(52,201,122,0.1)"></div>
  <div style="color:#6a9878">
    <span style="margin-right:14px">🔍 Reviewed by Islamic content team</span>
    <span style="margin-right:14px">📅 Updated ${esc(updated)}</span>
  </div>
  <div style="margin-left:auto">
    <span style="background:rgba(52,201,122,0.1);color:#34c97a;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:0.05em">VERIFIED CONTENT</span>
  </div>
</div>`;
}

router.get("/about", (_req: Request, res: Response) => {
  const faqs = [
    { q: "What does 'MyTazki' mean?", a: "Tazki comes from 'Tazkiyah' — the Islamic concept of purifying and growing the soul. MyTazki is your personal spiritual companion for that inner journey, built for the modern Muslim." },
    { q: "Is MyTazki affiliated with any religious institution?", a: "No. MyTazki is an independent platform. Our content is grounded in authentic Quran and Hadith sources and reviewed by our Islamic content team for accuracy." },
    { q: "How does AI fit into an Islamic app?", a: "We use AI as a tool, not a religious authority. AI helps personalize your experience — suggesting duas, reflecting on Quran verses, tracking habits. Final guidance always traces back to Islamic sources." },
    { q: "Is MyTazki free?", a: "Yes — the core experience is completely free. Prayer times, Quran, Azkar, Duas, and habit tracking are all free, with no account required to explore." },
    { q: "Who is MyTazki for?", a: "Any Muslim who wants to grow spiritually — whether you are consistent in your practice or just reconnecting after a long time. MyTazki meets you where you are, without judgment." },
  ];
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About MyTazki — AI Islamic Companion",
    "url": "https://mytazki.com/about",
    "description": "Learn about MyTazki — an AI-powered Islamic growth platform helping Muslims pray, reflect, and grow spiritually every day.",
    "publisher": ORG_SCHEMA,
  };
  const bc = [{ name: "Home", item: "/" }, { name: "About MyTazki" }];
  const html = page(
    seoHead({ title: "About MyTazki", description: "MyTazki is an AI-powered Islamic growth companion — helping modern Muslims build prayer habits, explore Quran, find duas, and grow spiritually every day. Learn our mission.", canonical: "/about", schema: [webPageSchema, breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
${eeatBar("MyTazki Editorial Team", "Islamic Content", "May 2026", "May 2026")}

<header style="padding:40px 0 32px;text-align:center;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:40px">
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:2rem;margin:0 0 8px;line-height:1.8">وَمَن يُزَكِّيهَا قَدْ أَفْلَحَ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;margin:0 0 28px;font-family:Inter,sans-serif">And he who purifies it has truly succeeded. — Quran 91:9</p>
  <h1 style="font-family:DM Sans,Inter,sans-serif;font-size:2.4rem;font-weight:800;color:#eaf4ee;line-height:1.2;margin:0 0 16px">We built MyTazki because<br>spiritual growth deserves better tools.</h1>
  <p style="color:#6a9878;font-size:1rem;line-height:1.75;max-width:640px;margin:0 auto;font-family:Inter,sans-serif">The modern Muslim navigates prayer times, Quran recitation, daily duas, and spiritual habits — often alone, on a phone, between the noise of everyday life. MyTazki exists to make that easier, more meaningful, and more consistent.</p>
</header>

${quickAnswerBox("What is MyTazki?", "MyTazki is an AI-powered Islamic spiritual growth platform. It combines prayer times, Quran reflection, guided Azkar, curated Duas, Islamic habit tracking, and an AI Islamic companion into one calm, premium experience — designed for Muslims who want to grow every day.")}

<section style="margin:40px 0">
  <h2>Why MyTazki Exists</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">Most Islamic apps treat spirituality as a checklist. Prayer logged. Done. But real spiritual growth is quieter than that — it lives in the moments between salah, in a dua you reach for when your heart is heavy, in a Quran verse that catches you off guard at 2am.</p>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin-top:12px">We built MyTazki to honour those moments. To be present when you feel anxious and want a dua that actually speaks to your situation. To walk with you through a 7-day journey back to Fajr. To reflect Quran back at you in a way that feels personal — not performative.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:28px 0">
    ${[
      { icon: "🕌", title: "Prayer & Salah", desc: "Live prayer times, salah guides, khushoo tips" },
      { icon: "📖", title: "Quran Reflection", desc: "114 surahs, verse audio, reflective commentary" },
      { icon: "🤲", title: "Duas & Azkar", desc: "110+ authentic duas across all life situations" },
      { icon: "🤖", title: "AI Companion", desc: "Islamically guided AI — Claude-powered, adab-first" },
      { icon: "🌙", title: "Habit Building", desc: "Streaks, growth tracking, guided journeys" },
      { icon: "🧘", title: "Emotional Wellness", desc: "Islamic healing for anxiety, grief, overthinking" },
    ].map(c => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:18px 16px">
      <div style="font-size:22px;margin-bottom:8px">${c.icon}</div>
      <strong style="color:#eaf4ee;font-family:DM Sans,Inter,sans-serif;font-size:15px;display:block;margin-bottom:4px">${esc(c.title)}</strong>
      <span style="color:#4a6858;font-size:13px;font-family:Inter,sans-serif">${esc(c.desc)}</span>
    </div>`).join("")}
  </div>
</section>

<section style="margin:40px 0;padding:32px;background:linear-gradient(135deg,#152019,#0d1411);border:1px solid rgba(184,148,106,0.2);border-radius:16px">
  <h2 style="margin:0 0 14px">The MyTazki Philosophy</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">We believe the best Islamic technology is invisible — it gets out of the way and lets you connect with Allah. We design for calm, not dopamine. For depth, not volume. For consistency, not performance.</p>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin-top:12px">Every feature we build passes a simple test: <em style="color:#b8946a">does this help a Muslim get closer to Allah?</em> If not, it doesn't ship.</p>
</section>

<section style="margin:40px 0">
  <h2>How We Use AI Responsibly</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">AI is a powerful tool. In the wrong hands, it can mislead. In Islamic contexts, that responsibility is especially serious. Here is exactly what our AI does — and doesn't — do:</p>
  <div style="margin:20px 0;display:flex;flex-direction:column;gap:10px">
    ${[
      ["✅ AI does", "Suggest contextually relevant duas and Quran verses"],
      ["✅ AI does", "Help you reflect on Islamic concepts in your own words"],
      ["✅ AI does", "Answer general Islamic questions with source references"],
      ["✅ AI does", "Encourage and support your spiritual growth journey"],
      ["❌ AI never", "Issue fatwas or religious rulings"],
      ["❌ AI never", "Override or contradict established Islamic scholarship"],
      ["❌ AI never", "Pretend to be a scholar or authoritative source"],
    ].map(([badge, text]) => `<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 16px;background:#1c2d21;border-radius:10px;font-family:Inter,sans-serif">
      <span style="font-size:13px;font-weight:700;color:${badge.startsWith("✅") ? "#34c97a" : "#b8946a"};flex-shrink:0;min-width:80px">${esc(badge)}</span>
      <span style="color:#a0c8a0;font-size:14px;line-height:1.6">${esc(text)}</span>
    </div>`).join("")}
  </div>
  <p style="margin-top:12px"><a href="/ai-ethics" style="color:#34c97a;font-family:Inter,sans-serif;font-size:14px">Read our full AI Ethics policy →</a></p>
</section>

${faqHtml(faqs)}
${emotionalCTA({ title: "Begin Your Spiritual Journey", subtitle: "Free prayer times, Quran, Azkar, Duas, and AI Islamic companion — all in one place.", href: "/download", btnText: "Download MyTazki Free →" })}
${conversationalBlock(["what is mytazki", "mytazki app review", "best islamic app", "ai muslim app", "islamic growth app", "mytazki vs other apps"])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/mission", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "Our Mission" }];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "MyTazki Mission", "url": "https://mytazki.com/mission", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "Our Mission — MyTazki", description: "MyTazki's mission: to make Islamic spiritual growth accessible to every Muslim, every day — through technology that honours faith, depth, and the human soul.", canonical: "/mission", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}
<h1>Our Mission</h1>
${eeatBar("MyTazki Editorial Team", "Platform Strategy", "May 2026", "May 2026")}

${quickAnswerBox("What is MyTazki's mission?", "To make daily Islamic spiritual growth feel as natural as breathing — accessible, personal, and deeply rooted in authentic Islamic tradition, powered by responsible AI.")}

<section style="margin:32px 0">
  <p style="font-size:1.15rem;color:#eaf4ee;line-height:1.9;font-family:Inter,sans-serif;font-weight:500">We believe every Muslim deserves a companion that helps them grow — not just a prayer alarm and a Quran PDF.</p>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin-top:16px">The global Muslim population is young, mobile-first, and spiritually hungry — yet the tools available often feel like they were built in 2005. We are changing that.</p>
</section>

<section style="margin:40px 0">
  <h2>Three Core Commitments</h2>
  <div style="display:flex;flex-direction:column;gap:14px;margin-top:16px">
    ${[
      { n: "01", title: "Authenticity first", body: "Every dua, verse, and hadith on MyTazki is sourced from verified Islamic texts. Our AI surfaces knowledge — it never invents it. Scholarship leads; technology follows." },
      { n: "02", title: "Emotional intelligence", body: "Spiritual growth is not a performance metric. We design for the Muslim who is tired, struggling, or just getting back on their feet. MyTazki meets people with compassion, not a scorecard." },
      { n: "03", title: "Radical accessibility", body: "Core features are and will always be free. Prayer times, Quran, 110+ Duas, Azkar, Tasbih — no account, no paywall. We build for every Muslim, not just the ones with subscriptions." },
    ].map(c => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:14px;padding:22px 20px;display:flex;gap:18px">
      <span style="font-family:DM Sans,sans-serif;font-size:2rem;font-weight:800;color:rgba(52,201,122,0.18);flex-shrink:0">${esc(c.n)}</span>
      <div>
        <strong style="color:#eaf4ee;font-size:16px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${esc(c.title)}</strong>
        <p style="color:#6a9878;font-size:14px;line-height:1.75;margin:0;font-family:Inter,sans-serif">${esc(c.body)}</p>
      </div>
    </div>`).join("")}
  </div>
</section>

<section style="margin:40px 0;padding:28px;background:rgba(52,201,122,0.05);border-radius:14px;border-left:4px solid #34c97a">
  <p style="font-family:Amiri,serif;direction:rtl;color:#b8946a;font-size:1.8rem;text-align:right;margin:0 0 8px;line-height:1.8">وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ</p>
  <p style="color:#4a6858;font-size:13px;font-style:italic;font-family:Inter,sans-serif;margin:0 0 16px">And who is better in speech than one who calls to Allah — Quran 41:33</p>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:0">This ayah is the compass behind every decision we make at MyTazki. Technology is our method. Calling to Allah is our purpose.</p>
</section>

${relatedArticlesGrid([
  { href: "/about", label: "About MyTazki", desc: "Who we are and why we built this", tag: "Company" },
  { href: "/our-philosophy", label: "Our Philosophy", desc: "The design principles behind MyTazki", tag: "Values" },
  { href: "/how-mytazki-works", label: "How MyTazki Works", desc: "AI + Islamic content + habit design", tag: "Product" },
  { href: "/ai-ethics", label: "AI Ethics", desc: "How we use AI responsibly", tag: "Trust" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/our-philosophy", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "Our Philosophy" }];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "MyTazki Philosophy", "url": "https://mytazki.com/our-philosophy", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "Our Philosophy — Design for the Soul", description: "MyTazki's design philosophy: calm over noise, depth over volume, spiritual warmth over corporate efficiency. Built for the modern Muslim soul.", canonical: "/our-philosophy", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}
<h1>Our Philosophy — Design for the Soul</h1>
${eeatBar("MyTazki Design & Content Team", "Product Philosophy", "May 2026", "May 2026")}

<p style="font-size:1.1rem;color:#eaf4ee;line-height:1.85;font-family:Inter,sans-serif;margin:24px 0">Great Islamic technology is not about features. It is about creating space — space where a Muslim can breathe, remember Allah, and come back to themselves.</p>

<section style="margin:40px 0">
  <h2>Five Principles We Design By</h2>
  <div style="display:flex;flex-direction:column;gap:16px;margin-top:16px">
    ${[
      { title: "Calm over noise", body: "Every notification, animation, and colour decision is made in favour of calm. We do not gamify spirituality. We do not use red dots to trigger anxiety. MyTazki should feel like a breath — not an alert." },
      { title: "Depth over volume", body: "110 duas, carefully chosen. 35 guided sessions, personally written. 99 Names of Allah, with reflection. We prefer ten things that matter over a thousand that don't." },
      { title: "Soul before metrics", body: "We do not track 'engagement'. We track growth. The questions we ask: Did this person pray today? Did they feel supported? Did they come back because they found value — not because an algorithm trapped them?" },
      { title: "Islamic knowledge, not Islamic aesthetics", body: "Many apps use Islamic branding superficially — Arabic calligraphy, crescent icons, generic inspiration quotes. We build from the substance: Quran, Sunnah, authentic scholarship, lived Islamic experience." },
      { title: "Technology serves the human", body: "AI on MyTazki is a tool. It listens, suggests, reflects — but it never prescribes. The user's spiritual authority is their own. The scholar's authority is theirs. AI helps connect the two." },
    ].map((p, i) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:14px;padding:22px 20px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <span style="background:rgba(52,201,122,0.12);color:#34c97a;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${i + 1}</span>
        <strong style="color:#eaf4ee;font-size:16px;font-family:DM Sans,Inter,sans-serif">${esc(p.title)}</strong>
      </div>
      <p style="color:#6a9878;font-size:14px;line-height:1.8;margin:0;font-family:Inter,sans-serif">${esc(p.body)}</p>
    </div>`).join("")}
  </div>
</section>

${emotionalCTA({ title: "Experience the philosophy", subtitle: "See how calm, depth, and soul-centred design feels in practice.", href: "/download", btnText: "Try MyTazki Free →" })}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/how-mytazki-works", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "How It Works" }];
  const faqs = [
    { q: "Do I need an account to use MyTazki?", a: "No account is required to access prayer times, Quran, Duas, and most tools. Create a free account to unlock habit tracking, AI companion, streaks, and personalization." },
    { q: "How accurate are the prayer times?", a: "We use the aladhan.com API with your GPS location for highly accurate local prayer times. You can set your madhab and calculation method in settings." },
    { q: "Is the AI Islamic companion safe to use?", a: "Yes. Our AI is powered by Claude (Anthropic) with strict Islamic adab guidelines. It will not issue fatwas, contradict scholarship, or go outside its role as a supportive companion." },
    { q: "How do the guided journeys work?", a: "Guided journeys are structured 5-7 day programs combining daily duas, Quran reflection, guided audio sessions, and habit check-ins. You follow a path one day at a time." },
  ];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "How MyTazki Works", "url": "https://mytazki.com/how-mytazki-works", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "How MyTazki Works — AI Islamic Growth Platform", description: "Discover how MyTazki combines AI, authentic Islamic content, and habit design to help Muslims grow spiritually every day.", canonical: "/how-mytazki-works", schema: [schema, breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>How MyTazki Works</h1>
${eeatBar("MyTazki Product Team", "Platform Guide", "May 2026", "May 2026")}

${quickAnswerBox("How does MyTazki work?", "MyTazki combines four layers: authentic Islamic content (Quran, Duas, Azkar), live data (prayer times, Hijri calendar), AI-powered personalization (guided reflections, companion chat), and habit design (streaks, journeys, check-ins) — all in one free app.")}

<section style="margin:36px 0">
  <h2>The Four Layers of MyTazki</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:20px 0">
    ${[
      { n: "01", icon: "📚", title: "Islamic Content Layer", items: ["110+ authentic duas", "99 Names of Allah", "35 guided audio sessions", "1000+ Islamic baby names", "Full Quran with audio"] },
      { n: "02", icon: "⏰", title: "Live Data Layer", items: ["Accurate GPS prayer times", "Hijri Islamic calendar", "Live gold price (Zakat)", "Nearby mosque finder", "Qibla direction compass"] },
      { n: "03", icon: "🤖", title: "AI Intelligence Layer", items: ["MyTazki AI companion", "Mood-based dua engine", "Quran reflection generator", "Personalised suggestions", "20 daily AI interactions"] },
      { n: "04", icon: "🌱", title: "Growth System Layer", items: ["Daily prayer streaks", "Weekly habit goals", "Guided 7-day journeys", "Progress rings", "Journal prompts"] },
    ].map(l => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:14px;padding:20px 18px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
        <span style="font-size:20px">${l.icon}</span>
        <span style="color:#34c97a;font-size:11px;font-weight:700;letter-spacing:0.08em">${esc(l.n)}</span>
      </div>
      <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:10px">${esc(l.title)}</strong>
      <ul style="margin:0;padding-left:16px;list-style:none">
        ${l.items.map(item => `<li style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif;margin-bottom:5px;position:relative">
          <span style="position:absolute;left:-12px;color:#34c97a">·</span>${esc(item)}
        </li>`).join("")}
      </ul>
    </div>`).join("")}
  </div>
</section>

<section style="margin:40px 0">
  <h2>Your Daily MyTazki Flow</h2>
  ${[
    { time: "Fajr", icon: "🌅", action: "Check prayer time → Open Fajr dua → Mark salah complete" },
    { time: "Morning", icon: "☀️", action: "Morning Azkar session → Daily Name of Allah → Quran reflection" },
    { time: "Midday", icon: "🌤️", action: "Dhuhr reminder → AI check-in → Habit log" },
    { time: "Evening", icon: "🌙", action: "Evening Azkar → Tasbih → Guided session" },
    { time: "Night", icon: "✨", action: "Isha prayer → Sleep dua → Streak review → Tomorrow's intention" },
  ].map(f => `<div style="display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid rgba(52,201,122,0.07)">
    <span style="font-size:20px;flex-shrink:0">${f.icon}</span>
    <div>
      <strong style="color:#34c97a;font-size:13px;font-weight:700;font-family:Inter,sans-serif;text-transform:uppercase;letter-spacing:0.06em">${esc(f.time)}</strong>
      <p style="color:#a0c8a0;font-size:14px;font-family:Inter,sans-serif;margin:4px 0 0;line-height:1.6">${esc(f.action)}</p>
    </div>
  </div>`).join("")}
</section>

${faqHtml(faqs)}
${ctaBlock()}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/editorial-guidelines", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "Editorial Guidelines" }];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "MyTazki Editorial Guidelines", "url": "https://mytazki.com/editorial-guidelines", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "Editorial Guidelines — MyTazki Islamic Content Standards", description: "How MyTazki ensures all Islamic content — duas, Quran references, hadiths — meets standards of authenticity, clarity, and spiritual integrity.", canonical: "/editorial-guidelines", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}
<h1>Editorial Guidelines</h1>
${eeatBar("MyTazki Editorial Team", "Content Standards", "May 2026", "May 2026")}

<div class="ai-summary">
  <strong style="color:#34c97a;display:block;margin-bottom:6px">Our Content Commitment</strong>
  <p style="margin:0;color:#eaf4ee;font-size:15px;line-height:1.75;font-family:Inter,sans-serif">All Islamic content on MyTazki — duas, Quran verses, hadiths, Names of Allah, Islamic guidance — is sourced from verified Islamic texts and reviewed by our editorial team before publication. We prioritise authenticity over volume.</p>
</div>

<section style="margin:36px 0">
  <h2>Source Standards</h2>
  <div style="display:flex;flex-direction:column;gap:10px">
    ${[
      { title: "Quran references", body: "All Quran verses use the Hafs 'an Asim recitation as standard. Translations are sourced from established English-language Quran translations (Sahih International, Pickthall). Arabic text is verified character by character." },
      { title: "Hadith references", body: "We cite hadith collections (Bukhari, Muslim, Tirmidhi, Abu Dawud) with grade where available. We do not publish weak (da'if) hadith without noting their status." },
      { title: "Duas", body: "Duas come from the Quran, authenticated Sunnah (Hisnul Muslim / Fortress of the Muslim), and established scholarly collections. We do not include fabricated or unverified supplications." },
      { title: "AI-generated content", body: "Any content drafted with AI assistance is reviewed by our editorial team before going live. AI is used for structure and language — Islamic substance comes from verified sources only." },
    ].map(s => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px;padding:18px 20px">
      <strong style="color:#34c97a;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;font-family:Inter,sans-serif;display:block;margin-bottom:6px">${esc(s.title)}</strong>
      <p style="color:#a0c8a0;font-size:14px;line-height:1.75;margin:0;font-family:Inter,sans-serif">${esc(s.body)}</p>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0">
  <h2>What We Never Publish</h2>
  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px">
    ${[
      "Religious rulings (fatwas) — these must come from qualified scholars",
      "Content that contradicts established Islamic consensus (ijma)",
      "Sectarian content that promotes division between Muslims",
      "Unverified hadiths presented as authentic",
      "AI responses that touch on fiqh without a scholar disclaimer",
      "Personal religious opinions presented as religious fact",
    ].map(item => `<li style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:rgba(184,148,106,0.04);border-left:3px solid rgba(184,148,106,0.3);border-radius:0 8px 8px 0;color:#a0c8a0;font-size:14px;font-family:Inter,sans-serif">
      <span style="color:#b8946a;flex-shrink:0">✕</span>${esc(item)}
    </li>`).join("")}
  </ul>
</section>

<section style="margin:36px 0">
  <h2>Update & Review Cycle</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">Core content (Duas, Quran text, Names of Allah) is reviewed bi-annually. Hadith grading is checked against current scholarship consensus. If you spot an error in any Islamic content on MyTazki, email us at <strong style="color:#34c97a">content@mytazki.com</strong> — we take corrections seriously and respond within 48 hours.</p>
</section>

${relatedArticlesGrid([
  { href: "/ai-ethics", label: "AI Ethics Policy", tag: "Trust" },
  { href: "/trust-and-safety", label: "Trust & Safety", tag: "Policy" },
  { href: "/islamic-guidance-policy", label: "Islamic Guidance Policy", tag: "Content" },
  { href: "/about", label: "About MyTazki", tag: "Company" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/ai-ethics", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "AI Ethics" }];
  const faqs = [
    { q: "Can MyTazki AI give me a fatwa?", a: "No. The MyTazki AI companion is explicitly designed to not issue religious rulings. For fiqh questions, it will always direct you to qualified scholars." },
    { q: "Who controls the AI's Islamic boundaries?", a: "Our editorial team has written the AI system guidelines. The AI runs on Claude (Anthropic) with strict Islamic adab constraints that we update regularly." },
    { q: "Does the AI learn from my conversations?", a: "Your conversations are not used to train AI models. Sessions are processed in real-time and not stored permanently. See our privacy policy for details." },
    { q: "What if the AI says something incorrect Islamically?", a: "Please report it immediately at support@mytazki.com. We take Islamic accuracy seriously and will investigate and correct within 24 hours." },
  ];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "MyTazki AI Ethics", "url": "https://mytazki.com/ai-ethics", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "AI Ethics — How MyTazki Uses AI Responsibly", description: "MyTazki's AI ethics framework: how we use Claude AI responsibly in an Islamic context, what boundaries we enforce, and how we ensure Islamic authenticity.", canonical: "/ai-ethics", schema: [schema, breadcrumbSchema(bc), faqSchema(faqs)] }),
    `${breadcrumb(bc)}
<h1>AI Ethics — How We Use AI in an Islamic Context</h1>
${eeatBar("MyTazki AI & Editorial Team", "AI Ethics Policy", "May 2026", "May 2026")}

${quickAnswerBox("How does MyTazki use AI ethically?", "MyTazki uses Claude AI with strict Islamic adab constraints — it assists with reflection, duas, and guidance but never issues fatwas, contradicts Islamic scholarship, or acts as a religious authority. Islamic sources always lead; AI follows.")}

<section style="margin:36px 0">
  <h2>Our AI Philosophy in One Sentence</h2>
  <p style="font-size:1.2rem;color:#b8946a;font-family:Amiri,serif;font-style:italic;line-height:1.8;border-left:4px solid rgba(184,148,106,0.4);padding:16px 20px;background:rgba(184,148,106,0.05);border-radius:0 12px 12px 0">AI is a mirror, not a minbar. It reflects Islamic wisdom back to you — it does not stand on the pulpit and preach.</p>
</section>

<section style="margin:36px 0">
  <h2>The Six AI Boundaries</h2>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${[
      { n: "1", title: "No fatwas, ever", body: "The AI is trained to redirect any fiqh (Islamic law) questions to qualified scholars. It will say: 'This requires a scholarly opinion — please consult a local Imam or trusted Islamic institution.'" },
      { n: "2", title: "Sources, always", body: "When citing Quranic verses or hadith, the AI references the source. It does not invent or paraphrase Islamic narrations." },
      { n: "3", title: "Emotional support, not spiritual prescription", body: "The AI can support, validate, and listen. It does not prescribe specific acts of worship as solutions to spiritual problems — that is the work of human scholars and qualified counsellors." },
      { n: "4", title: "Adab in every response", body: "The AI is guided by Islamic etiquette (adab). It begins responses with bismillah where appropriate, maintains respectful tone, and honours Islamic sensitivities in all topics." },
      { n: "5", title: "Sectarian neutrality", body: "MyTazki serves Muslims of all schools of thought (madhabs). The AI does not take sides in scholarly differences of opinion. It notes where differences exist and encourages you to follow your own qualified scholar." },
      { n: "6", title: "Human review layer", body: "Our AI system guidelines are reviewed by our Islamic editorial team every quarter. Any patterns of problematic responses are flagged and corrected immediately." },
    ].map(b => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px;padding:18px 20px;display:flex;gap:14px">
      <span style="background:rgba(52,201,122,0.12);color:#34c97a;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">${esc(b.n)}</span>
      <div>
        <strong style="color:#eaf4ee;font-family:DM Sans,Inter,sans-serif;font-size:15px;display:block;margin-bottom:6px">${esc(b.title)}</strong>
        <p style="color:#6a9878;font-size:14px;line-height:1.75;margin:0;font-family:Inter,sans-serif">${esc(b.body)}</p>
      </div>
    </div>`).join("")}
  </div>
</section>

${faqHtml(faqs)}
${relatedArticlesGrid([
  { href: "/trust-and-safety", label: "Trust & Safety", tag: "Policy" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines", tag: "Content" },
  { href: "/islamic-guidance-policy", label: "Islamic Guidance Policy", tag: "Content" },
  { href: "/how-mytazki-works", label: "How MyTazki Works", tag: "Product" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/trust-and-safety", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "Trust & Safety" }];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "MyTazki Trust and Safety", "url": "https://mytazki.com/trust-and-safety", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "Trust & Safety — MyTazki", description: "How MyTazki keeps users safe: content moderation, AI limits, privacy commitments, and community standards for an Islamic platform.", canonical: "/trust-and-safety", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}
<h1>Trust & Safety</h1>
${eeatBar("MyTazki Trust Team", "Platform Safety", "May 2026", "May 2026")}
<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">MyTazki is an Islamic platform. That means trust is not a feature — it is the foundation. Here is exactly how we protect it.</p>

<section style="margin:36px 0">
  <h2>Content Safety</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
    ${[
      { icon: "🔒", title: "Halal content policy", desc: "All content must align with Islamic values. Haram content, inappropriate material, or content disrespectful to Islam is zero-tolerated." },
      { icon: "🤖", title: "AI guardrails", desc: "Our AI has hard-coded limits — it cannot discuss haram topics, issue fatwas, or go outside its role as a supportive spiritual companion." },
      { icon: "📚", title: "Source verification", desc: "Islamic content is verified before publication. Unverified hadith are marked clearly. Fabricated hadith are never published." },
      { icon: "👥", title: "Community standards", desc: "Rooms and Halaqah features have clear community guidelines. Hate speech, sectarianism, or disrespect toward any Muslim group is not permitted." },
    ].map(c => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px;padding:18px 16px">
      <div style="font-size:22px;margin-bottom:8px">${c.icon}</div>
      <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${esc(c.title)}</strong>
      <p style="color:#6a9878;font-size:13px;line-height:1.7;margin:0;font-family:Inter,sans-serif">${esc(c.desc)}</p>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0">
  <h2>Privacy & Data</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">We collect only what is necessary. Location is used only for prayer times and mosque finder — never for advertising. AI conversations are not stored permanently or used to train models. We do not sell user data.</p>
</section>

<section style="margin:36px 0">
  <h2>Report a Concern</h2>
  <p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif">If you see content on MyTazki that you believe is incorrect, harmful, or does not meet Islamic standards — please contact us immediately:</p>
  <div style="background:rgba(52,201,122,0.06);border:1px solid rgba(52,201,122,0.15);border-radius:12px;padding:20px;margin-top:14px">
    <p style="color:#eaf4ee;font-family:Inter,sans-serif;margin:0 0 8px"><strong>Email:</strong> <span style="color:#34c97a">trust@mytazki.com</span></p>
    <p style="color:#6a9878;font-size:14px;font-family:Inter,sans-serif;margin:0">We respond within 24 hours. Corrections to Islamic content are treated as the highest priority.</p>
  </div>
</section>
${relatedArticlesGrid([
  { href: "/ai-ethics", label: "AI Ethics", tag: "Policy" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines", tag: "Content" },
  { href: "/islamic-guidance-policy", label: "Islamic Guidance Policy", tag: "Content" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/islamic-guidance-policy", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "Islamic Guidance Policy" }];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "Islamic Guidance Policy — MyTazki", "url": "https://mytazki.com/islamic-guidance-policy", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "Islamic Guidance Policy — MyTazki", description: "How MyTazki handles Islamic guidance: what the platform provides, what it defers to scholars, and how we protect the integrity of Islamic knowledge.", canonical: "/islamic-guidance-policy", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}
<h1>Islamic Guidance Policy</h1>
${eeatBar("MyTazki Editorial Team", "Islamic Content Policy", "May 2026", "May 2026")}

${quickAnswerBox("Does MyTazki provide Islamic religious guidance?", "MyTazki provides Islamic educational content grounded in Quran and authentic Sunnah. It does not issue fatwas or religious rulings — those require qualified scholars. For personal fiqh questions, always consult a qualified Islamic scholar or institution.")}

<section style="margin:36px 0">
  <h2>What MyTazki Provides</h2>
  <div style="display:flex;flex-direction:column;gap:10px">
    ${[
      "Authentic duas from Quran and verified Sunnah (Hisnul Muslim)",
      "Quran text and audio — Hafs 'an Asim recitation, English translations",
      "99 Names of Allah with Arabic, transliteration, and meaning",
      "Islamic habit and character building — based on prophetic example",
      "General Islamic educational content on prayer, fasting, Zakat, Hajj",
      "Emotional and spiritual support — grounded in Islamic framework",
      "AI-assisted reflection — clearly labelled, editorially reviewed",
    ].map(item => `<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:#1c2d21;border-radius:10px;font-family:Inter,sans-serif">
      <span style="color:#34c97a;flex-shrink:0">✓</span>
      <span style="color:#a0c8a0;font-size:14px;line-height:1.6">${esc(item)}</span>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0">
  <h2>What MyTazki Does Not Provide</h2>
  <div style="display:flex;flex-direction:column;gap:10px">
    ${[
      "Fatwas or religious rulings on personal situations",
      "Guidance on complex fiqh questions (marriage, divorce, business, inheritance)",
      "Medical or psychological advice — please consult qualified professionals",
      "Absolute answers on matters of scholarly difference (ikhtilaf)",
    ].map(item => `<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:rgba(184,148,106,0.05);border-left:3px solid rgba(184,148,106,0.3);border-radius:0 10px 10px 0;font-family:Inter,sans-serif">
      <span style="color:#b8946a;flex-shrink:0">✕</span>
      <span style="color:#a0c8a0;font-size:14px;line-height:1.6">${esc(item)}</span>
    </div>`).join("")}
  </div>
</section>

<p style="color:#6a9878;font-size:14px;font-family:Inter,sans-serif;line-height:1.8;margin:20px 0">For personal Islamic questions, we recommend organisations like <strong style="color:#eaf4ee">IslamQA.info</strong>, <strong style="color:#eaf4ee">SeekersGuidance.org</strong>, or your local mosque and qualified Imam.</p>

${relatedArticlesGrid([
  { href: "/ai-ethics", label: "AI Ethics Policy", tag: "Trust" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines", tag: "Content" },
  { href: "/trust-and-safety", label: "Trust & Safety", tag: "Policy" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/content-verification", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "Content Verification" }];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "Content Verification — MyTazki", "url": "https://mytazki.com/content-verification", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "Content Verification — MyTazki", description: "How MyTazki verifies Islamic content — our process for checking duas, hadiths, Quran references, and AI-assisted material before publication.", canonical: "/content-verification", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}
<h1>Content Verification</h1>
${eeatBar("MyTazki Editorial Team", "Verification Process", "May 2026", "May 2026")}
<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">Every piece of Islamic content on MyTazki goes through a verification process before it reaches users. Here is how it works.</p>

<section style="margin:36px 0">
  <h2>The Verification Process</h2>
  <div style="display:flex;flex-direction:column;gap:0">
    ${[
      { step: "1", title: "Source identification", desc: "For each dua, verse, or hadith — we identify the original Islamic source (Quran chapter and verse, hadith collection and book number)." },
      { step: "2", title: "Text verification", desc: "Arabic text is cross-referenced against verified digital Islamic texts. We use established Quran APIs and hadith databases for primary sources." },
      { step: "3", title: "Translation review", desc: "English translations are compared across at least two established translators. Meaning is checked for accuracy and clarity." },
      { step: "4", title: "Hadith grading", desc: "For hadith, we check the grading (sahih, hasan, da'if) from established hadith scholars. Weak hadith are marked or excluded." },
      { step: "5", title: "AI content review", desc: "Any content drafted with AI assistance is reviewed by a human editor before publishing. AI cannot publish content unilaterally." },
      { step: "6", title: "Ongoing monitoring", desc: "We maintain a correction inbox (content@mytazki.com). User-reported issues are reviewed within 48 hours." },
    ].map((s, i, arr) => `<div style="display:flex;gap:16px;padding:20px 0;${i < arr.length - 1 ? "border-bottom:1px solid rgba(52,201,122,0.07)" : ""}">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
        <span style="background:#34c97a;color:#0d1411;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px">${esc(s.step)}</span>
        ${i < arr.length - 1 ? `<div style="width:1px;flex:1;background:rgba(52,201,122,0.15);margin:8px 0"></div>` : ""}
      </div>
      <div style="padding-bottom:8px">
        <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${esc(s.title)}</strong>
        <p style="color:#6a9878;font-size:14px;line-height:1.75;margin:0;font-family:Inter,sans-serif">${esc(s.desc)}</p>
      </div>
    </div>`).join("")}
  </div>
</section>

${relatedArticlesGrid([
  { href: "/editorial-guidelines", label: "Editorial Guidelines", tag: "Content" },
  { href: "/ai-ethics", label: "AI Ethics", tag: "Trust" },
  { href: "/how-ai-content-is-reviewed", label: "How AI Content is Reviewed", tag: "Process" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/how-ai-content-is-reviewed", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "AI Content Review" }];
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "How AI Content is Reviewed — MyTazki", "url": "https://mytazki.com/how-ai-content-is-reviewed", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "How AI Content is Reviewed — MyTazki", description: "Our process for reviewing AI-assisted Islamic content on MyTazki — editorial oversight, Islamic authenticity checks, and transparency about AI's role.", canonical: "/how-ai-content-is-reviewed", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}
<h1>How AI Content is Reviewed</h1>
${eeatBar("MyTazki AI & Editorial Team", "AI Review Process", "May 2026", "May 2026")}

${quickAnswerBox("Is MyTazki's content written by AI?", "Some content on MyTazki is AI-assisted (drafted with Claude, then reviewed). Core Islamic content — duas, Quran text, hadiths, Names of Allah — comes from verified Islamic sources, not AI generation. AI is never the final authority on Islamic content.")}

<section style="margin:36px 0">
  <h2>Two Types of Content on MyTazki</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:16px 0">
    <div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.15);border-radius:12px;padding:20px">
      <strong style="color:#34c97a;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:10px">Source-first content</strong>
      <p style="color:#a0c8a0;font-size:14px;line-height:1.7;margin:0 0 10px;font-family:Inter,sans-serif">Drawn directly from Islamic sources. AI may help format or translate — not create.</p>
      <ul style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif;margin:0;padding-left:16px">
        <li>All 110+ duas</li><li>Quran text &amp; translations</li><li>99 Names of Allah</li><li>Hadith references</li>
      </ul>
    </div>
    <div style="background:#1c2d21;border:1px solid rgba(184,148,106,0.15);border-radius:12px;padding:20px">
      <strong style="color:#b8946a;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:10px">AI-assisted content</strong>
      <p style="color:#a0c8a0;font-size:14px;line-height:1.7;margin:0 0 10px;font-family:Inter,sans-serif">AI drafts, human editor reviews and approves. Source references verified separately.</p>
      <ul style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif;margin:0;padding-left:16px">
        <li>Blog articles</li><li>SEO educational pages</li><li>Session scripts</li><li>Reflection prompts</li>
      </ul>
    </div>
  </div>
</section>

<section style="margin:36px 0">
  <h2>The AI Review Checklist</h2>
  <p style="color:#6a9878;font-size:14px;font-family:Inter,sans-serif;margin:0 0 16px">Every AI-assisted piece of content is checked against this list before publication:</p>
  <div style="display:flex;flex-direction:column;gap:8px">
    ${[
      "No fabricated Quranic quotes — all verses verified by reference",
      "No fabricated hadith — all hadith checked by source and grade",
      "No fatwa-style language — AI does not issue religious rulings",
      "No contradictions with mainstream Islamic scholarship",
      "Balanced tone — does not favour any particular madhab",
      "Emotional safety — does not prescribe acts of worship as 'cures'",
      "Source transparency — citations are present where Islamic sources are used",
    ].map(item => `<div style="display:flex;gap:10px;padding:10px 14px;background:#1c2d21;border-radius:8px;font-family:Inter,sans-serif;align-items:flex-start">
      <span style="color:#34c97a;flex-shrink:0;margin-top:1px">☑</span>
      <span style="color:#a0c8a0;font-size:14px;line-height:1.6">${esc(item)}</span>
    </div>`).join("")}
  </div>
</section>
${relatedArticlesGrid([
  { href: "/ai-ethics", label: "AI Ethics Policy", tag: "Trust" },
  { href: "/content-verification", label: "Content Verification", tag: "Process" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines", tag: "Standards" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/contributors", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "Contributors" }];
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "MyTazki Contributors",
    "url": "https://mytazki.com/contributors",
    "publisher": ORG_SCHEMA,
  };
  const html = page(
    seoHead({ title: "Contributors — MyTazki Islamic Content Team", description: "Meet the Islamic content team behind MyTazki — editorial reviewers, Islamic educators, and content contributors who ensure authenticity and depth.", canonical: "/contributors", schema: [schema, breadcrumbSchema(bc)] }),
    `${breadcrumb(bc)}
<h1>Contributors</h1>
${eeatBar("MyTazki Editorial Team", "Team Page", "May 2026", "May 2026")}

<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">MyTazki is built by a team that cares deeply about authentic Islamic content, responsible AI, and helping Muslims grow spiritually. Here is who stands behind the platform.</p>

<section style="margin:36px 0">
  <h2>Content & Editorial Team</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin:20px 0">
    ${[
      { name: "Islamic Content Editorial Team", role: "Dua, Hadith & Quran Verification", expertise: ["Quran text accuracy", "Hadith grading", "Arabic transliteration"], desc: "Our editorial team reviews all Islamic content before publication — duas, Quran verses, hadith references, and Names of Allah. Source accuracy and authenticity are the first filter." },
      { name: "AI Content Review Board", role: "AI-Assisted Content Oversight", expertise: ["AI output review", "Islamic accuracy checks", "Source verification"], desc: "Reviews all AI-assisted content against our Islamic guidance policy. Ensures no fatwa-style content, no fabricated Islamic narrations, and no contradictions with mainstream scholarship." },
      { name: "Product & Engineering Team", role: "Platform Development", expertise: ["Islamic UX design", "Responsible AI implementation", "Privacy engineering"], desc: "Builds MyTazki with Islamic values embedded at the product level — calm design, privacy-first, zero dark patterns, and features that genuinely serve spiritual growth." },
    ].map(c => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:14px;padding:22px 20px">
      <div style="width:44px;height:44px;background:rgba(52,201,122,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:14px">🌙</div>
      <strong style="color:#eaf4ee;font-size:16px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${esc(c.name)}</strong>
      <span style="color:#34c97a;font-size:12px;font-weight:600;font-family:Inter,sans-serif;text-transform:uppercase;letter-spacing:0.05em">${esc(c.role)}</span>
      <p style="color:#6a9878;font-size:13px;line-height:1.7;margin:12px 0;font-family:Inter,sans-serif">${esc(c.desc)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${c.expertise.map(e => `<span style="background:rgba(52,201,122,0.08);border:1px solid rgba(52,201,122,0.15);color:#6a9878;padding:4px 10px;border-radius:20px;font-size:11px;font-family:Inter,sans-serif">${esc(e)}</span>`).join("")}
      </div>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0;padding:24px;background:rgba(52,201,122,0.04);border-radius:14px">
  <h2 style="margin:0 0 12px">Contribute to MyTazki</h2>
  <p style="color:#a0c8a0;font-size:14px;line-height:1.8;font-family:Inter,sans-serif;margin:0 0 16px">Are you an Islamic scholar, educator, or content creator? If you would like to contribute to MyTazki's content — writing, reviewing, or advising — we would love to hear from you.</p>
  <a href="mailto:editorial@mytazki.com" style="background:#34c97a;color:#0d1411;padding:10px 22px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:inline-block">Get in Touch →</a>
</section>

${relatedArticlesGrid([
  { href: "/about", label: "About MyTazki", tag: "Company" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines", tag: "Content" },
  { href: "/authors", label: "Authors", tag: "Team" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

router.get("/authors", (_req: Request, res: Response) => {
  const bc = [{ name: "Home", item: "/" }, { name: "About", item: "/about" }, { name: "Authors" }];
  const authorSchema = (name: string, role: string, url: string) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": role,
    "worksFor": { "@type": "Organization", "name": "MyTazki" },
    "url": `https://mytazki.com${url}`,
  });
  const schema = { "@context": "https://schema.org", "@type": "WebPage", "name": "Authors — MyTazki", "url": "https://mytazki.com/authors", "publisher": ORG_SCHEMA };
  const html = page(
    seoHead({ title: "Authors & Islamic Content Experts — MyTazki", description: "Meet the authors and Islamic content experts who write, verify, and review content on MyTazki — duas, Quran reflections, spiritual guides, and Islamic habits.", canonical: "/authors", schema: [schema, breadcrumbSchema(bc), authorSchema("MyTazki Editorial Team", "Islamic Content Editor", "/authors")] }),
    `${breadcrumb(bc)}
<h1>Authors & Content Experts</h1>
${eeatBar("MyTazki Editorial Team", "Author Profiles", "May 2026", "May 2026")}

<p style="color:#a0c8a0;font-size:15px;line-height:1.8;font-family:Inter,sans-serif;margin:20px 0">All content on MyTazki is authored, reviewed, or supervised by qualified individuals. Here is our author and contributor framework.</p>

<section style="margin:36px 0">
  <h2>Our Author Categories</h2>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${[
      { badge: "Islamic Scholar Verified", color: "#b8946a", desc: "Content verified by an Islamic scholar or institution. Applicable to fatwah-adjacent topics, fiqh basics, and hadith usage." },
      { badge: "Editorial Reviewed", color: "#34c97a", desc: "Reviewed by MyTazki's editorial team against our Islamic content guidelines. Applies to duas, Quran reflections, spiritual guides." },
      { badge: "AI Assisted, Human Reviewed", color: "#6a9878", desc: "Drafted with AI assistance, then reviewed by a human editor for Islamic accuracy, tone, and source integrity." },
    ].map(b => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:12px;padding:18px 20px;display:flex;align-items:flex-start;gap:14px">
      <span style="background:rgba(52,201,122,0.08);border:1px solid rgba(52,201,122,0.2);color:${b.color};font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;white-space:nowrap;font-family:Inter,sans-serif;flex-shrink:0">${esc(b.badge)}</span>
      <p style="color:#6a9878;font-size:14px;line-height:1.7;margin:0;font-family:Inter,sans-serif">${esc(b.desc)}</p>
    </div>`).join("")}
  </div>
</section>

<section style="margin:36px 0">
  <h2>Author Pages</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px">
    ${[
      { name: "MyTazki Editorial", role: "Islamic Content Editor", topics: "Duas, Azkar, Names of Allah, Quran reflections", articles: "Core Islamic content library" },
      { name: "MyTazki Wellness Team", role: "Spiritual Wellness Writers", topics: "Emotional healing, mental wellness, Islamic habits", articles: "Wellness and growth articles" },
      { name: "MyTazki AI Content Team", role: "AI-Assisted Content", topics: "Educational guides, SEO articles, tool explainers", articles: "Platform guides and how-to content" },
    ].map(a => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.1);border-radius:14px;padding:20px">
      <div style="width:40px;height:40px;background:rgba(52,201,122,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:12px">✍️</div>
      <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:3px">${esc(a.name)}</strong>
      <span style="color:#34c97a;font-size:12px;font-weight:600;font-family:Inter,sans-serif">${esc(a.role)}</span>
      <p style="color:#4a6858;font-size:12px;margin:8px 0 4px;font-family:Inter,sans-serif"><strong style="color:#6a9878">Topics:</strong> ${esc(a.topics)}</p>
      <p style="color:#4a6858;font-size:12px;margin:0;font-family:Inter,sans-serif"><strong style="color:#6a9878">Content:</strong> ${esc(a.articles)}</p>
    </div>`).join("")}
  </div>
</section>

${relatedArticlesGrid([
  { href: "/editorial-guidelines", label: "Editorial Guidelines", tag: "Standards" },
  { href: "/contributors", label: "Contributors", tag: "Team" },
  { href: "/content-verification", label: "Content Verification", tag: "Process" },
])}
`
  );
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

export default router;
