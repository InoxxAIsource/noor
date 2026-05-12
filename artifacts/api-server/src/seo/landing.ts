import { Router } from "express";
import { seoHead, page, ctaBlock, faqHtml, faqSchema, esc } from "./shared.js";

const router = Router();

router.get("/landing", (_req, res) => {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "MyTazki — Islamic Prayer App",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "iOS, Android, Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
    "description": "Muslim prayer app with Quran, prayer times, duas, names finder, zakat calculator, masjid finder, AI Islamic guide",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "5000" },
  };

  const faqs = [
    { q: "Is MyTazki free to use?", a: "Yes, MyTazki is completely free with no ads. It includes prayer times, Quran, duas, AI guide, names finder, and more." },
    { q: "Does MyTazki work offline?", a: "Core features like Quran reading, duas, and tasbih work offline. Prayer times and AI features require internet." },
    { q: "Is MyTazki available for Android and iOS?", a: "MyTazki is a Progressive Web App (PWA) that works on any device — Android, iOS, or desktop — through your browser." },
    { q: "How accurate are the prayer times?", a: "Prayer times are calculated using the aladhan.com API with your city location, supporting Hanafi, Shafi, Maliki, and Hanbali madhabs." },
    { q: "What makes MyTazki different from Muslim Pro?", a: "MyTazki has unique features: AI Islamic guide, khushoo journal, live prayer rooms, baby names finder, and a completely ad-free experience — all free." },
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
    { name: "Zaid A., Delhi", text: "Best Islamic app I've used. The AI guide answered my fiqh question in seconds. No ads, no subscriptions — just pure ibadah." },
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
    title: "MyTazki — Islamic Prayer App",
    description: "Free Muslim prayer app with Quran, prayer times for India & Pakistan, duas, AI Islamic guide, names finder, zakat calculator, masjid finder. No ads, ever.",
    canonical: "/landing",
    schema: [appSchema, faqSchema(faqs)],
  });

  const body = `
<div style="text-align:center;padding:60px 20px 40px;background:linear-gradient(180deg,#002800 0%,#001a00 100%);margin:-24px -20px 40px;border-bottom:1px solid rgba(0,165,80,0.15)">
  <p style="font-family:Amiri,serif;font-size:2rem;color:#ffd700;direction:rtl;margin:0 0 8px">نور</p>
  <h1 style="margin:0 0 16px;font-size:2.5rem">Grow Spiritually Every Day.</h1>
  <p style="color:#4a7a4a;font-size:1.1rem;max-width:500px;margin:0 auto 28px">The complete Islamic companion — prayer times, Quran, duas, AI guide, and more. Free forever.</p>
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
  ${testimonials.map(t => `<div class="card"><p style="color:#a0c8a0;font-style:italic;margin:0 0 10px">"${esc(t.text)}"</p><p style="color:#00a550;font-size:13px;margin:0">— ${esc(t.name)}</p></div>`).join("")}
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
  const head = seoHead({
    title: "Download MyTazki — Islamic Prayer App | Free PWA for Android & iOS",
    description: "Download MyTazki Islamic prayer app. Free PWA — works on Android, iOS, and desktop. Prayer times, Quran, AI guide, duas, and more. Install now.",
    canonical: "/download",
    schema: [],
  });

  const body = `
<div style="text-align:center;padding:40px 20px 24px">
  <div style="font-size:4rem;margin-bottom:12px">🌙</div>
  <h1>Download MyTazki — Islamic Prayer App</h1>
  <p style="color:#4a7a4a;font-size:1rem;max-width:420px;margin:0 auto 24px;line-height:1.6">
    Your personal Islamic companion. Remember Allah — every day. Free forever, no ads.
  </p>

  <div style="background:rgba(0,165,80,0.1);border:1px solid rgba(0,165,80,0.3);border-radius:10px;padding:14px 24px;display:inline-block;margin-bottom:28px">
    <p style="color:#00a550;margin:0;font-size:14px;font-weight:bold">✅ Available now as a PWA — works on any device</p>
  </div>

  <div>
    <a href="/register" class="cta-btn" style="font-size:1.1rem;padding:16px 40px;display:inline-block">📲 Install MyTazki Free →</a>
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;max-width:700px;margin:32px auto;padding:0 16px">
  ${[
    ["🕌","Prayer Times","Live times for 80+ cities"],
    ["📖","Quran Reader","All 114 surahs + audio"],
    ["🤲","Duas Library","200+ authentic supplications"],
    ["🧭","Qibla Compass","Accurate direction anywhere"],
    ["📿","Digital Tasbih","With vibration & progress ring"],
    ["🕌","Masjid Finder","Nearby mosques on map"],
    ["🤖","MyTazki AI","Islamic companion (20 req/day free)"],
    ["📊","Growth Tracker","Streaks, badges, journal"],
  ].map(([icon, title, desc]) => `
    <div class="card">
      <p style="font-size:1.8rem;margin:0 0 6px">${icon}</p>
      <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.85rem;margin:0 0 4px">${title}</p>
      <p style="color:#4a7a4a;font-size:12px;margin:0">${desc}</p>
    </div>
  `).join("")}
</div>

<div style="max-width:500px;margin:0 auto 32px;padding:0 16px">
  <h2>How to Install</h2>
  <div class="card" style="margin-bottom:12px">
    <p style="color:#00a550;font-weight:bold;margin:0 0 6px">Android (Chrome)</p>
    <p style="color:#a0c8a0;font-size:14px;margin:0">Tap the ⋮ menu → "Install MyTazki" → Install. The app appears on your home screen like a native app.</p>
  </div>
  <div class="card">
    <p style="color:#00a550;font-weight:bold;margin:0 0 6px">iPhone / iPad (Safari)</p>
    <p style="color:#a0c8a0;font-size:14px;margin:0">Tap Share button → "Add to Home Screen" → Add. Works on iOS 16.4+ with full PWA support.</p>
  </div>
</div>

<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:32px">
  <div style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:12px;padding:14px 28px;opacity:0.6;text-align:center">
    <p style="color:#e8f5e8;font-weight:bold;margin:0 0 4px;font-size:14px">🍎 App Store</p>
    <p style="color:#4a7a4a;font-size:12px;margin:0">Coming soon</p>
  </div>
  <div style="background:#002800;border:1px solid rgba(0,165,80,0.2);border-radius:12px;padding:14px 28px;opacity:0.6;text-align:center">
    <p style="color:#e8f5e8;font-weight:bold;margin:0 0 4px;font-size:14px">🤖 Google Play</p>
    <p style="color:#4a7a4a;font-size:12px;margin:0">Coming soon</p>
  </div>
</div>

${ctaBlock()}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

export default router;
