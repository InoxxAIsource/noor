import { Router, type Request, type Response } from "express";
import { seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, esc } from "./shared.js";

const router = Router();

router.get("/best-muslim-prayer-app-india", (_req: Request, res: Response) => {
  const rows = [
    { feature: "Prayer times (India & Pakistan)", noor: "✓ 80+ cities", pro: "✓", wemuslim: "✓", athan: "✓" },
    { feature: "AI Islamic Guide (Q&A)", noor: "✓ Claude AI", pro: "✗", wemuslim: "✗", athan: "✗" },
    { feature: "Khushoo journal", noor: "✓", pro: "✗", wemuslim: "✗", athan: "✗" },
    { feature: "Islamic baby names finder", noor: "✓ 40+ names", pro: "✗", wemuslim: "✗", athan: "✗" },
    { feature: "Ads in free tier", noor: "No ads ever", pro: "Yes", wemuslim: "Yes", athan: "Yes" },
    { feature: "Subscription required", noor: "No, free forever", pro: "Yes (premium)", wemuslim: "Yes", athan: "Yes" },
    { feature: "Zakat calculator (INR)", noor: "✓ live gold price", pro: "✗", wemuslim: "✓", athan: "✗" },
    { feature: "Masjid finder", noor: "✓ GPS + navigate", pro: "✓", wemuslim: "✗", athan: "✗" },
    { feature: "Live prayer rooms", noor: "✓ real-time SSE", pro: "✗", wemuslim: "✗", athan: "✗" },
    { feature: "Quran with audio", noor: "✓ Alafasy recitation", pro: "✓", wemuslim: "✓", athan: "✓" },
    { feature: "Qibla compass", noor: "✓ animated SVG", pro: "✓", wemuslim: "✓", athan: "✓" },
    { feature: "Tasbih (dhikr counter)", noor: "✓ vibration, ring", pro: "✓", wemuslim: "✓", athan: "✓" },
    { feature: "Shia content", noor: "✓ Shia filter", pro: "Partial", wemuslim: "✗", athan: "✗" },
    { feature: "99 Names of Allah", noor: "✓ full meanings", pro: "✓", wemuslim: "✗", athan: "✗" },
    { feature: "Guided audio sessions", noor: "✓ 25 sessions", pro: "✗", wemuslim: "✗", athan: "✗" },
  ];

  const faqs = [
    { q: "What is the best free Muslim prayer app in India?", a: "MyTazki is the best free Muslim prayer app in India in 2026. It offers prayer times for 80+ cities, Quran with audio, AI Islamic guide, and no ads, all completely free." },
    { q: "Is MyTazki better than Muslim Pro?", a: "MyTazki has unique features that Muslim Pro lacks: AI Islamic guide, khushoo journal, live prayer rooms, Islamic baby names finder, and guided audio sessions. Unlike Muslim Pro, MyTazki is completely free with no ads." },
    { q: "Does MyTazki work without internet?", a: "Core features like Quran reading, duas, tasbih, and salah guide work offline. Prayer times, AI guide, and masjid finder require internet." },
    { q: "Is MyTazki free?", a: "Yes, MyTazki is completely free with no ads, no subscription, and no premium tier. All features are available to all users." },
    { q: "Is MyTazki available for iPhone?", a: "MyTazki is a Progressive Web App (PWA) that works on any device, iPhone, Android, or desktop, through your browser. No app store download needed." },
  ];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Best Muslim Prayer Apps India 2026",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "MyTazki", "url": "https://mytazki.com" },
      { "@type": "ListItem", "position": 2, "name": "Muslim Pro", "url": "https://mytazki.com/best-muslim-prayer-app-india" },
      { "@type": "ListItem", "position": 3, "name": "WeMuslim", "url": "https://mytazki.com/best-muslim-prayer-app-india" },
      { "@type": "ListItem", "position": 4, "name": "Athan", "url": "https://mytazki.com/best-muslim-prayer-app-india" },
    ],
  };

  const head = seoHead({
    title: "Best Muslim Prayer App in India 2026, Ranked & Compared",
    description: "Comparison of the best Muslim prayer apps in India 2026: MyTazki vs Muslim Pro vs WeMuslim vs Athan. Features, price, and honest review.",
    canonical: "/best-muslim-prayer-app-india",
    schema: [itemListSchema, faqSchema(faqs)],
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Best Muslim Prayer App India 2026" }])}
<h1>Best Muslim Prayer App in India 2026 (Ranked)</h1>
<p style="color:#4a7a4a">We compared the top 4 Muslim prayer apps on features, ads, price, and unique tools. Here's our honest ranking.</p>

<div class="card" style="margin:24px 0;border-color:rgba(255,215,0,0.4);background:rgba(255,215,0,0.03)">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
    <span style="background:#ffd700;color:#001a00;font-weight:bold;padding:4px 10px;border-radius:20px;font-size:12px">#1 Best App</span>
    <span style="font-family:Cinzel,serif;font-size:1.2rem;color:#ffd700">MyTazki</span>
  </div>
  <p style="color:#a0c8a0;margin:0">Free forever · No ads · AI guide · 80+ city prayer times · Quran audio · Khushoo journal</p>
</div>

<h2>Feature Comparison</h2>
<div style="overflow-x:auto;margin:16px 0">
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr style="border-bottom:1px solid rgba(0,165,80,0.3)">
      <th style="text-align:left;padding:10px 12px;color:#4a7a4a;min-width:200px">Feature</th>
      <th style="padding:10px 12px;color:#00a550;min-width:120px">MyTazki ★</th>
      <th style="padding:10px 12px;color:#4a7a4a;min-width:120px">Muslim Pro</th>
      <th style="padding:10px 12px;color:#4a7a4a;min-width:120px">WeMuslim</th>
      <th style="padding:10px 12px;color:#4a7a4a;min-width:120px">Athan</th>
    </tr>
    ${rows.map((r, i) => `<tr style="border-bottom:1px solid rgba(0,165,80,0.06);${i % 2 === 0 ? "background:rgba(0,165,80,0.02)" : ""}">
      <td style="padding:9px 12px;color:#a0c8a0">${esc(r.feature)}</td>
      <td style="padding:9px 12px;text-align:center;color:#00a550;font-weight:bold">${esc(r.noor)}</td>
      <td style="padding:9px 12px;text-align:center;color:#4a7a4a">${esc(r.pro)}</td>
      <td style="padding:9px 12px;text-align:center;color:#4a7a4a">${esc(r.wemuslim)}</td>
      <td style="padding:9px 12px;text-align:center;color:#4a7a4a">${esc(r.athan)}</td>
    </tr>`).join("")}
  </table>
</div>

${ctaBlock()}
${faqHtml(faqs)}

<h2>Our Verdict</h2>
<div class="card">
  <p style="color:#a0c8a0;line-height:1.8;margin:0">MyTazki is the best free Islamic prayer app in India for 2026. It offers all the essential features (prayer times, Quran, duas, qibla, tasbih, masjid finder, zakat calculator) PLUS unique features no other app has: an AI-powered Islamic guide, khushoo quality journal, live prayer rooms for praying together, Islamic baby names finder, guided audio sessions for spirituality, and Ramadan special mode with iftar countdown. And it's completely free, no ads, no subscriptions, ever.</p>
</div>

<p style="color:#4a7a4a;margin-top:24px">Related: <a href="/prayer-times" style="color:#00a550">Prayer times in India</a> · <a href="/names" style="color:#00a550">Islamic baby names</a> · <a href="/blog" style="color:#00a550">Islamic blog</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(page(head, body));
});

export default router;
