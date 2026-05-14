import { Router } from "express";
import { seoHead, page, ctaBlock, faqHtml, faqSchema, esc } from "./shared.js";

const router = Router();

router.get("/landing", (_req, res) => {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "MyTazki, Islamic Prayer App",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "iOS, Android, Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "description": "Muslim prayer app with Quran, prayer times, duas, names finder, zakat calculator, masjid finder, AI Islamic guide",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "5000" },
  };

  const faqs = [
    { q: "Is MyTazki free to use?", a: "Yes, MyTazki is completely free with no ads. It includes prayer times, Quran, duas, AI guide, names finder, and more." },
    { q: "Does MyTazki work offline?", a: "Core features like Quran reading, duas, and tasbih work offline. Prayer times and AI features require internet." },
    { q: "Is MyTazki available for Android and iOS?", a: "MyTazki is a Progressive Web App (PWA) that works on any device, Android, iOS, or desktop, through your browser." },
    { q: "How accurate are the prayer times?", a: "Prayer times are calculated using the aladhan.com API with your city location, supporting Hanafi, Shafi, Maliki, and Hanbali madhabs." },
    { q: "What makes MyTazki different from Muslim Pro?", a: "MyTazki has unique features: AI Islamic guide, khushoo journal, live prayer rooms, baby names finder, and a completely ad-free experience, all free." },
  ];

  const features = [
    { icon: "🕌", title: "Prayer Times", desc: "Live Fajr, Dhuhr, Asr, Maghrib, Isha times for 80+ India & Pakistan cities" },
    { icon: "📖", title: "Quran", desc: "All 114 surahs with Arabic, English translation, and audio recitation" },
    { icon: "🤲", title: "Duas Library", desc: "200+ authenticated duas with Arabic, transliteration, and meaning" },
    { icon: "🤖", title: "AI Islamic Guide", desc: "Ask Islamic questions, get answers based on Quran and Sunnah" },
    { icon: "👶", title: "Islamic Names", desc: "40+ Muslim baby names with Arabic, meaning, origin, and Quran reference" },
    { icon: "💰", title: "Zakat Calculator", desc: "Calculate your Zakat on gold, silver, cash with live gold prices in INR" },
  ];

  const testimonials = [
    { name: "Zaid A., Delhi", text: "Best Islamic app I've used. The AI guide answered my fiqh question in seconds. No ads, no subscriptions, just pure ibadah." },
    { name: "Fatima K., Karachi", text: "The daily streak feature keeps me consistent with my prayers. The Quran reader with audio is beautiful. JazakAllah khair." },
    { name: "Ibrahim M., Hyderabad", text: "I found a masjid near my office and saved it as favourite. The khushoo rating after each prayer is a great touch." },
  ];

  const competitors = [
    { feature: "Prayer times", noor: "✓", pro: "✓", wemuslim: "✓", athan: "✓" },
    { feature: "AI Islamic Guide", noor: "✓", pro: "✗", wemuslim: "✗", athan: "✗" },
    { feature: "Names finder", noor: "✓", pro: "✗", wemuslim: "✗", athan: "✗" },
    { feature: "Khushoo journal", noor: "✓", pro: "✗", wemuslim: "✗", athan: "✗" },
    { feature: "Ads in free tier", noor: "No ads", pro: "Yes", wemuslim: "Yes", athan: "Yes" },
    { feature: "Zakat calculator", noor: "✓", pro: "✗", wemuslim: "✓", athan: "✗" },
    { feature: "Live prayer rooms", noor: "✓", pro: "✗", wemuslim: "✗", athan: "✗" },
  ];

  const head = seoHead({
    title: "MyTazki, Islamic Prayer App",
    description: "Free Muslim prayer app with Quran, prayer times for India & Pakistan, duas, AI Islamic guide, names finder, zakat calculator, masjid finder. No ads, ever.",
    canonical: "/landing",
    schema: [appSchema, faqSchema(faqs)],
  });

  const body = `
<div style="text-align:center;padding:60px 20px 40px;background:linear-gradient(180deg,#002800 0%,#001a00 100%);margin:-24px -20px 40px;border-bottom:1px solid rgba(0,165,80,0.15)">
  <p style="font-family:Amiri,serif;font-size:2rem;color:#ffd700;direction:rtl;margin:0 0 8px">نور</p>
  <h1 style="margin:0 0 16px;font-size:2.5rem">Grow Spiritually Every Day.</h1>
  <p style="color:#4a7a4a;font-size:1.1rem;max-width:500px;margin:0 auto 28px">The complete Islamic companion, prayer times, Quran, duas, AI guide, and more. Free forever.</p>
  <a href="/download" class="cta-btn" style="font-size:1.1rem;padding:14px 36px">Download MyTazki Free →</a>
  <p style="color:#2a4a2a;font-size:12px;margin:16px 0 0">No ads · No subscription · Works on any device</p>
</div>

<h2>Everything you need for your Islamic journey</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:20px 0">
  ${features.map(f => `<div class="card"><span style="font-size:2rem">${f.icon}</span><h3 style="margin:8px 0 4px;color:#ffd700;font-size:1rem;font-family:Cinzel,serif">${esc(f.title)}</h3><p style="color:#4a7a4a;font-size:14px;margin:0">${esc(f.desc)}</p></div>`).join("")}
</div>

<h2>How MyTazki compares</h2>
<div style="overflow-x:auto;margin:16px 0">
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr style="border-bottom:1px solid rgba(0,165,80,0.2)">
      <th style="text-align:left;padding:10px 12px;color:#ffd700">Feature</th>
      <th style="padding:10px 12px;color:#00a550">MyTazki</th>
      <th style="padding:10px 12px;color:#4a7a4a">Muslim Pro</th>
      <th style="padding:10px 12px;color:#4a7a4a">WeMuslim</th>
      <th style="padding:10px 12px;color:#4a7a4a">Athan</th>
    </tr>
    ${competitors.map(r => `<tr style="border-bottom:1px solid rgba(0,165,80,0.08)">
      <td style="padding:8px 12px;color:#a0c8a0">${esc(r.feature)}</td>
      <td style="padding:8px 12px;text-align:center;color:#00a550;font-weight:bold">${esc(r.noor)}</td>
      <td style="padding:8px 12px;text-align:center;color:#4a7a4a">${esc(r.pro)}</td>
      <td style="padding:8px 12px;text-align:center;color:#4a7a4a">${esc(r.wemuslim)}</td>
      <td style="padding:8px 12px;text-align:center;color:#4a7a4a">${esc(r.athan)}</td>
    </tr>`).join("")}
  </table>
</div>

<h2>What Muslims say about MyTazki</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:20px 0">
  ${testimonials.map(t => `<div class="card"><p style="color:#a0c8a0;font-style:italic;margin:0 0 10px">"${esc(t.text)}"</p><p style="color:#00a550;font-size:13px;margin:0">- ${esc(t.name)}</p></div>`).join("")}
</div>

${ctaBlock()}
${faqHtml(faqs)}

<h2>Explore MyTazki</h2>
<div style="display:flex;flex-wrap:wrap;gap:10px;margin:16px 0">
  ${[
    ["/prayer-times", "Prayer Times in India"],
    ["/names", "Islamic Baby Names"],
    ["/duas", "Duas & Supplications"],
    ["/quran", "Quran with Translation"],
    ["/zakat-calculator", "Zakat Calculator"],
    ["/masjid-finder", "Masjid Near Me"],
    ["/ramadan", "Ramadan 2026 Guide"],
    ["/blog", "Islamic Blog"],
  ].map(([href, label]) => `<a href="${href}" style="background:#002800;border:1px solid rgba(0,165,80,0.2);color:#00a550;padding:8px 16px;border-radius:20px;text-decoration:none;font-size:14px">${esc(label)}</a>`).join("")}
</div>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

router.get("/download", (_req, res) => {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "MyTazki — Islamic Prayer App",
    "alternateName": "MyTazki",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "iOS, Android, Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "url": "https://mytazki.com/download",
    "description": "Free Islamic prayer app with Quran reader, prayer times, AI Islamic guide, duas library, qibla compass, masjid finder, zakat calculator, and daily spiritual growth tracker. No ads, no subscription.",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "5000", "bestRating": "5" },
    "screenshot": "https://mytazki.com/opengraph.jpg",
    "featureList": "Prayer Times, Quran with Audio, Duas Library, AI Islamic Guide, Qibla Compass, Masjid Finder, Zakat Calculator, Tasbih Counter, Islamic Calendar, Baby Names",
    "inLanguage": ["en", "ar"],
    "creator": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" },
  };

  const faqs = [
    { q: "How do I download MyTazki on Android?", a: "Open mytazki.com in Chrome on Android, tap the ⋮ menu, then tap 'Install MyTazki'. The app installs directly to your home screen — no Play Store required." },
    { q: "How do I install MyTazki on iPhone or iPad?", a: "Open mytazki.com in Safari, tap the Share button, then tap 'Add to Home Screen'. This works on iOS 16.4 and above with full PWA support including offline access." },
    { q: "Is MyTazki completely free?", a: "Yes. MyTazki is 100% free with no ads, no subscription, and no in-app purchases. Every feature — Quran, prayer times, AI guide, duas, and more — is available at no cost." },
    { q: "Does MyTazki work offline?", a: "Yes. Core features like Quran reading, duas library, tasbih counter, and azkar work offline after first load. Prayer times and the AI Islamic guide require an internet connection." },
    { q: "What devices does MyTazki support?", a: "MyTazki is a Progressive Web App (PWA) that works on any device with a modern browser — Android phones, iPhones, iPads, Windows PC, Mac, and Chromebooks." },
    { q: "Will MyTazki be on the App Store or Google Play?", a: "App Store and Google Play versions are coming soon. For now, install directly from your browser — PWA installation gives you a full native-app experience with home screen icon and offline support." },
  ];

  const features = [
    { icon: "🕌", title: "Prayer Times", desc: "Live Fajr, Dhuhr, Asr, Maghrib, Isha times for 80+ India & Pakistan cities with madhab support" },
    { icon: "📖", title: "Quran Reader", desc: "All 114 surahs with Arabic text, English translation, transliteration, and Mishary Alafasy audio" },
    { icon: "🤲", title: "Duas Library", desc: "200+ authenticated duas from Quran and Sunnah with Arabic, transliteration, and meaning" },
    { icon: "🤖", title: "AI Islamic Guide", desc: "Ask any Islamic question and receive answers rooted in Quran and Sunnah — 20 questions free daily" },
    { icon: "🧭", title: "Qibla Compass", desc: "Accurate GPS-based Qibla direction from anywhere in the world" },
    { icon: "🕌", title: "Masjid Finder", desc: "Find mosques near you on an interactive map with GPS location" },
    { icon: "💰", title: "Zakat Calculator", desc: "Calculate your annual Zakat on gold, silver, cash, and savings with live gold prices" },
    { icon: "📿", title: "Digital Tasbih", desc: "Haptic-feedback tasbih counter with progress ring and custom target setting" },
    { icon: "👶", title: "Islamic Names", desc: "1,000+ Muslim baby names with Arabic origin, Quranic references, and meaning" },
    { icon: "📊", title: "Growth Tracker", desc: "Daily streak, prayer check-in, khushoo journal, and spiritual badges" },
  ];

  const head = seoHead({
    title: "Download MyTazki — Free Islamic Prayer App for Android & iOS",
    description: "Download MyTazki free. Islamic prayer app with Quran reader, prayer times for India & Pakistan, AI Islamic guide, duas, qibla compass, masjid finder, and zakat calculator. No ads. Works on Android, iOS, and desktop.",
    canonical: "/download",
    schema: [appSchema, faqSchema(faqs)],
  });

  const body = `
<nav class="breadcrumb"><a href="/">Home</a> › Download</nav>

<div style="text-align:center;padding:60px 20px 48px;background:linear-gradient(180deg,#0d0a08 0%,#12100e 100%);margin:-24px -20px 48px;border-bottom:1px solid rgba(201,164,114,0.12);position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(201,164,114,0.08) 0%,transparent 70%);pointer-events:none"></div>
  <p style="font-family:Amiri,serif;font-size:2.4rem;color:#c9a472;direction:rtl;margin:0 0 12px;position:relative">نور</p>
  <h1 style="margin:0 0 16px;font-size:clamp(1.85rem,5vw,2.8rem);color:#f0ece4;font-family:'DM Sans',Inter,sans-serif;font-weight:800;letter-spacing:-0.02em;position:relative">Download MyTazki — Free Islamic Prayer App</h1>
  <p style="color:#8a7a6c;font-size:1.05rem;max-width:520px;margin:0 auto 32px;line-height:1.65;position:relative">Your personal Islamic companion for daily spiritual growth. Prayer times, Quran, duas, AI guide, and more. Free forever, no ads.</p>
  <div style="position:relative">
    <a href="/register" class="cta-btn" style="font-size:1.1rem;padding:16px 44px;background:#34c97a;color:#0a0805;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;font-family:'DM Sans',Inter,sans-serif">Install MyTazki Free →</a>
    <p style="color:#6e5e4c;font-size:12px;margin:14px 0 0">No ads · No subscription · Works on any device</p>
  </div>
</div>

<div style="background:rgba(52,201,122,0.06);border:1px solid rgba(52,201,122,0.18);border-radius:14px;padding:20px 24px;margin:0 0 40px;text-align:center">
  <p style="color:#34c97a;margin:0;font-size:15px;font-weight:600">Available now as a Progressive Web App (PWA) — install instantly from your browser</p>
  <p style="color:#6e5e4c;font-size:13px;margin:8px 0 0">App Store & Google Play listings coming soon</p>
</div>

<h2 style="color:#34c97a;font-family:'DM Sans',Inter,sans-serif;font-size:1.3rem;font-weight:700;margin:0 0 20px">How to Install MyTazki</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-bottom:48px">
  <div style="background:#1a130d;border:1px solid rgba(201,164,114,0.15);border-radius:14px;padding:24px">
    <p style="color:#c9a472;font-weight:700;font-size:1rem;margin:0 0 8px;font-family:'DM Sans',Inter,sans-serif">Android (Chrome)</p>
    <p style="color:#8a7a6c;font-size:14px;margin:0 0 12px;line-height:1.6">Open <strong style="color:#f0ece4">mytazki.com</strong> in Chrome, tap the ⋮ menu, tap <strong style="color:#f0ece4">"Install MyTazki"</strong>, then Install. The app appears on your home screen like any native app — instant, no Play Store needed.</p>
  </div>
  <div style="background:#1a130d;border:1px solid rgba(201,164,114,0.15);border-radius:14px;padding:24px">
    <p style="color:#c9a472;font-weight:700;font-size:1rem;margin:0 0 8px;font-family:'DM Sans',Inter,sans-serif">iPhone & iPad (Safari)</p>
    <p style="color:#8a7a6c;font-size:14px;margin:0 0 12px;line-height:1.6">Open <strong style="color:#f0ece4">mytazki.com</strong> in Safari, tap the <strong style="color:#f0ece4">Share button</strong>, then tap <strong style="color:#f0ece4">"Add to Home Screen"</strong>. Requires iOS 16.4 or above. Supports offline access and push notifications.</p>
  </div>
  <div style="background:#1a130d;border:1px solid rgba(201,164,114,0.15);border-radius:14px;padding:24px">
    <p style="color:#c9a472;font-weight:700;font-size:1rem;margin:0 0 8px;font-family:'DM Sans',Inter,sans-serif">Desktop (Windows / Mac)</p>
    <p style="color:#8a7a6c;font-size:14px;margin:0 0 12px;line-height:1.6">Open <strong style="color:#f0ece4">mytazki.com</strong> in Chrome or Edge, look for the install icon in the address bar, and click <strong style="color:#f0ece4">Install</strong>. Opens in its own window like a native desktop app.</p>
  </div>
</div>

<h2 style="color:#34c97a;font-family:'DM Sans',Inter,sans-serif;font-size:1.3rem;font-weight:700;margin:0 0 20px">Everything in MyTazki — Free</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-bottom:48px">
  ${features.map(f => `<div style="background:#1a130d;border:1px solid rgba(201,164,114,0.12);border-radius:12px;padding:18px"><span style="font-size:1.8rem">${f.icon}</span><p style="color:#c9a472;font-weight:700;font-size:0.9rem;margin:8px 0 4px;font-family:'DM Sans',Inter,sans-serif">${esc(f.title)}</p><p style="color:#6e5e4c;font-size:13px;margin:0;line-height:1.55">${esc(f.desc)}</p></div>`).join("")}
</div>

${faqHtml(faqs)}

<div style="display:flex;flex-wrap:wrap;gap:10px;margin:40px 0 0">
  ${[
    ["/prayer-times","Prayer Times"],
    ["/quran","Quran Reader"],
    ["/duas","Duas Library"],
    ["/names","Islamic Names"],
    ["/zakat-calculator","Zakat Calculator"],
    ["/masjid-finder","Masjid Finder"],
    ["/qibla-direction","Qibla Compass"],
    ["/islamic-calendar","Islamic Calendar"],
  ].map(([href, label]) => `<a href="${href}" style="background:#1a130d;border:1px solid rgba(201,164,114,0.18);color:#c9a472;padding:8px 18px;border-radius:20px;text-decoration:none;font-size:13px">${esc(label)}</a>`).join("")}
</div>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

export default router;
