import { Router, type Request, type Response } from "express";
import {
  seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, esc,
} from "./shared.js";

const router = Router();

router.get("/zakat-calculator", (_req: Request, res: Response) => {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Zakat in India",
    "description": "Step-by-step guide to calculate your Zakat on gold, silver, cash, and business assets in INR.",
    "step": [
      { "@type": "HowToStep", "name": "Enter your total cash savings", "text": "Add all your savings accounts, cash at hand, and money owed to you." },
      { "@type": "HowToStep", "name": "Add value of gold you own", "text": "Enter the weight of your gold in grams. The current gold price in INR will be fetched automatically." },
      { "@type": "HowToStep", "name": "Subtract debts owed", "text": "Enter any debts you owe to others. These are deducted from your total assets." },
      { "@type": "HowToStep", "name": "Calculate 2.5% if above Nisab", "text": "If your net assets exceed Nisab (value of 87.48g gold), you must pay 2.5% as Zakat." },
    ],
  };

  const faqs = [
    { q: "What is Nisab for Zakat in India 2026?", a: "Nisab is the minimum amount of wealth one must have before Zakat becomes obligatory. It equals the value of 87.48 grams of gold or 612.36 grams of silver. At current gold prices in India (~₹6,500/gram), Nisab is approximately ₹5.7 lakh." },
    { q: "How much Zakat do I pay on gold in India?", a: "You pay 2.5% of the current market value of your gold if the total value of your assets exceeds Nisab. For example, if you have 100 grams of gold at ₹6,500/gram = ₹6,50,000, Zakat = ₹16,250." },
    { q: "Is Zakat obligatory on savings accounts?", a: "Yes, if your total net wealth (savings + gold + business assets minus debts) exceeds Nisab for one full lunar year (Hawl)." },
    { q: "When is Zakat due?", a: "Zakat is due annually (every Islamic lunar year, Hawl). Most Muslims pay during Ramadan for extra rewards." },
    { q: "What is the Zakat rate?", a: "The Zakat rate is 2.5% (1/40th) of your total net zakatable wealth above Nisab." },
  ];

  const head = seoHead({
    title: "Zakat Calculator India 2026, Calculate Zakat in INR",
    description: "Free Zakat calculator for India 2026. Calculate your Zakat on gold, silver, cash with live gold prices in INR. Know your Nisab and Zakat amount instantly.",
    canonical: "/zakat-calculator",
    schema: [howToSchema, faqSchema(faqs)],
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Zakat Calculator" }])}
<h1>Zakat Calculator India 2026, Calculate in INR</h1>
<p style="color:#4a7a4a">Calculate your annual Zakat on gold, silver, cash, and business assets. Live gold price fetched in INR.</p>

<div class="card" style="margin:24px 0">
  <h2 style="font-size:1rem;margin:0 0 8px">How to Calculate Zakat</h2>
  <ol style="color:#a0c8a0;padding-left:20px;margin:0;line-height:2">
    <li>Enter your total cash savings and bank balances</li>
    <li>Add the value of your gold (current market price used)</li>
    <li>Enter silver, business stock, and money owed to you</li>
    <li>Subtract any debts you owe</li>
    <li>If net total exceeds Nisab, pay <strong style="color:#00a550">2.5%</strong> as Zakat</li>
  </ol>
</div>

<div class="cta-box" style="margin:24px 0">
  <p style="color:#ffd700;font-family:Cinzel,serif;margin:0 0 8px">Use the Interactive Zakat Calculator</p>
  <p style="color:#4a7a4a;font-size:14px;margin:0 0 16px">Live gold price, automatic Nisab check, and detailed breakdown</p>
  <a href="/download" class="cta-btn">Open Zakat Calculator in MyTazki →</a>
</div>

<h2>Nisab Values (India 2026)</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:16px 0">
  <div class="card"><p style="color:#4a7a4a;font-size:12px;margin:0 0 4px">Gold Nisab</p><p style="color:#ffd700;font-size:1.2rem;margin:0">87.48 grams of gold</p><p style="color:#2a4a2a;font-size:12px;margin:4px 0 0">~₹5.7 lakh at current prices</p></div>
  <div class="card"><p style="color:#4a7a4a;font-size:12px;margin:0 0 4px">Silver Nisab</p><p style="color:#ffd700;font-size:1.2rem;margin:0">612.36 grams of silver</p><p style="color:#2a4a2a;font-size:12px;margin:4px 0 0">~₹42,000 at current prices</p></div>
  <div class="card"><p style="color:#4a7a4a;font-size:12px;margin:0 0 4px">Zakat Rate</p><p style="color:#00a550;font-size:1.5rem;font-weight:bold;margin:0">2.5%</p><p style="color:#2a4a2a;font-size:12px;margin:4px 0 0">of all zakatable wealth</p></div>
</div>

${ctaBlock()}
${faqHtml(faqs)}
<p style="color:#4a7a4a;margin-top:16px">Related: <a href="/blog/zakat-gold-india-2026" style="color:#00a550">Zakat on gold India guide</a> · <a href="/duas" style="color:#00a550">Duas for wealth & rizq</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

router.get("/masjid-finder", (_req: Request, res: Response) => {
  const faqs = [
    { q: "How do I find a mosque near me?", a: "Open MyTazki and tap Masjid Finder. It uses your GPS location to find all mosques within 5km and shows distance and navigation." },
    { q: "Does the MyTazki masjid finder show Shia mosques?", a: "Yes, MyTazki shows all types of mosques from OpenStreetMap. You can filter by All, Sunni, Shia, or Jama Masjid." },
    { q: "Can I save my favourite masjid?", a: "Yes, tap the star icon next to any mosque to save it as your favourite. It will appear at the top of the list." },
    { q: "How accurate is the mosque finder?", a: "MyTazki uses the OpenStreetMap Overpass API which has over 500,000 mosques worldwide." },
  ];

  const head = seoHead({
    title: "Masjid Near Me, Find Mosque in India & Pakistan",
    description: "Find the nearest mosque to you in India, Pakistan, UK, USA and worldwide. GPS-based mosque finder with navigation, distance, and favourite masjid saving.",
    canonical: "/masjid-finder",
    schema: faqSchema(faqs),
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Masjid Finder" }])}
<h1>Masjid Near Me, Find Mosque in India &amp; Pakistan</h1>
<p style="color:#4a7a4a">Find the nearest mosque to your current location with GPS. Navigation, distance, and filter by type.</p>

<div class="cta-box" style="margin:24px 0">
  <p style="color:#ffd700;font-family:Cinzel,serif;margin:0 0 8px">Find Mosque Near You</p>
  <p style="color:#4a7a4a;font-size:14px;margin:0 0 16px">GPS-based mosque finder with navigation links and favourite saving</p>
  <a href="/download" class="cta-btn">Open Masjid Finder →</a>
</div>

<h2>Features</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:16px 0">
  <div class="card"><p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 4px">GPS Detection</p><p style="color:#4a7a4a;font-size:13px;margin:0">Automatically detects your location and finds nearby mosques</p></div>
  <div class="card"><p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 4px">Navigation</p><p style="color:#4a7a4a;font-size:13px;margin:0">Direct Google Maps navigation to any mosque</p></div>
  <div class="card"><p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 4px">Filter by Type</p><p style="color:#4a7a4a;font-size:13px;margin:0">Filter by All, Sunni, Shia, or Jama Masjid</p></div>
  <div class="card"><p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 4px">Favourites</p><p style="color:#4a7a4a;font-size:13px;margin:0">Save your preferred mosque for quick access</p></div>
</div>

${ctaBlock()}
${faqHtml(faqs)}
<p style="color:#4a7a4a;margin-top:16px">Related: <a href="/prayer-times" style="color:#00a550">Prayer times in your city</a> · <a href="/salah-guide" style="color:#00a550">Complete Salah guide</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

router.get("/qibla-direction", (_req: Request, res: Response) => {
  const faqs = [
    { q: "What is the Qibla direction from India?", a: "The Qibla direction from most of India (Delhi) is approximately 292° northwest. It varies slightly by city." },
    { q: "How do I find Qibla direction at home?", a: "Open MyTazki and tap Qibla Compass. It uses your GPS and device compass to show the exact Qibla direction with an animated compass needle." },
    { q: "What is the Qibla direction from Pakistan?", a: "The Qibla direction from Pakistan (Karachi) is approximately 274° west. From Lahore it is approximately 271° west." },
    { q: "Can I find Qibla without internet?", a: "Yes, MyTazki calculates Qibla using mathematical bearing from your GPS coordinates, no internet needed for the calculation." },
  ];

  const head = seoHead({
    title: "Qibla Direction from India, Find Qibla Compass Online",
    description: "Find Qibla direction from any city in India, Pakistan, UK, USA. Live GPS compass showing exact bearing to Makkah. Also shows distance to Kaaba.",
    canonical: "/qibla-direction",
    schema: faqSchema(faqs),
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Qibla Direction" }])}
<h1>Qibla Direction from India, Find Qibla Compass Online</h1>
<p style="color:#4a7a4a">Find the exact direction of Qibla (Kaaba, Makkah) from your current location using GPS and a live animated compass.</p>

<div class="cta-box" style="margin:24px 0">
  <p style="color:#ffd700;font-family:Cinzel,serif;margin:0 0 8px">Find Your Qibla Now</p>
  <p style="color:#4a7a4a;font-size:14px;margin:0 0 16px">Animated SVG compass with exact bearing degree and distance to Kaaba</p>
  <a href="/download" class="cta-btn">Open Qibla Compass →</a>
</div>

<h2>Qibla Directions from Major Cities</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin:16px 0">
  ${[
    { city: "Delhi", bearing: "292°", dist: "5,538 km" },
    { city: "Mumbai", bearing: "284°", dist: "5,106 km" },
    { city: "Kolkata", bearing: "285°", dist: "6,055 km" },
    { city: "Hyderabad", bearing: "282°", dist: "5,289 km" },
    { city: "Karachi", bearing: "273°", dist: "3,722 km" },
    { city: "Lahore", bearing: "275°", dist: "4,475 km" },
  ].map(c => `<div class="card"><p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 4px">${esc(c.city)}</p><p style="color:#00a550;font-size:1.2rem;font-weight:bold;margin:0 0 2px">${c.bearing} NW</p><p style="color:#2a4a2a;font-size:12px;margin:0">${c.dist} from Kaaba</p></div>`).join("")}
</div>

${ctaBlock()}
${faqHtml(faqs)}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(page(head, body));
});

router.get("/ramadan", (_req: Request, res: Response) => {
  const faqs = [
    { q: "When does Ramadan 2026 start in India?", a: "Ramadan 2026 is expected to start on February 18, 2026 in India, subject to moon sighting. It will last 29 or 30 days until March 18/19, 2026." },
    { q: "What time is Sehri in Delhi during Ramadan 2026?", a: "Sehri (Suhoor) time in Delhi during Ramadan 2026 will be approximately 5:15 AM - 5:45 AM. Exact times vary daily and by city." },
    { q: "What time is Iftar in Ramadan 2026?", a: "Iftar time in Delhi during Ramadan 2026 will be approximately 6:10 PM - 6:35 PM. Times vary daily as days get shorter." },
    { q: "When is Laylatul Qadr in Ramadan 2026?", a: "Laylatul Qadr is in the last 10 nights of Ramadan, specifically the odd nights (21st, 23rd, 25th, 27th, 29th). In 2026, this would be around March 8-18." },
    { q: "When is Eid ul Fitr 2026?", a: "Eid ul Fitr 2026 is expected to be on March 19 or 20, 2026 in India, depending on moon sighting." },
  ];

  const sehriIftarData = [
    { day: "1 (Feb 18)", sehri: "5:45 AM", iftar: "6:10 PM" },
    { day: "5 (Feb 22)", sehri: "5:42 AM", iftar: "6:13 PM" },
    { day: "10 (Feb 27)", sehri: "5:38 AM", iftar: "6:17 PM" },
    { day: "15 (Mar 4)", sehri: "5:32 AM", iftar: "6:20 PM" },
    { day: "20 (Mar 9)", sehri: "5:26 AM", iftar: "6:24 PM" },
    { day: "25 (Mar 14)", sehri: "5:19 AM", iftar: "6:28 PM" },
    { day: "30 (Mar 19)", sehri: "5:12 AM", iftar: "6:32 PM" },
  ];

  const head = seoHead({
    title: "Ramadan 2026 India, Start Date, Sehri Iftar Timetable, Duas",
    description: "Ramadan 2026 India start date: February 18. Complete sehri and iftar timetable for Delhi, duas for Ramadan, Laylatul Qadr guide, and Eid date.",
    canonical: "/ramadan",
    schema: [
      { "@context": "https://schema.org", "@type": "Article", "headline": "Ramadan 2026 India Guide", "description": "Complete guide to Ramadan 2026 in India including start date, sehri-iftar times, and duas.", "author": { "@type": "Organization", "name": "MyTazki" } },
      faqSchema(faqs),
    ],
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Ramadan 2026" }])}
<h1>Ramadan 2026, Start Date, Schedule &amp; Duas</h1>

<div class="card" style="margin:24px 0;text-align:center;border-color:rgba(255,215,0,0.3)">
  <p style="color:#4a7a4a;font-size:12px;margin:0 0 4px;text-transform:uppercase">Ramadan 2026 Start Date (India)</p>
  <p style="color:#ffd700;font-family:Cinzel,serif;font-size:2rem;margin:0 0 4px">February 18, 2026</p>
  <p style="color:#4a7a4a;font-size:13px;margin:0">Subject to moon sighting • Eid ul Fitr: March 19/20, 2026</p>
</div>

<h2>Sehri &amp; Iftar Timetable, Delhi 2026</h2>
<div style="overflow-x:auto;margin:16px 0">
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr style="border-bottom:1px solid rgba(0,165,80,0.3)">
      <th style="text-align:left;padding:10px;color:#ffd700">Day</th>
      <th style="padding:10px;color:#00a550">Sehri (ends)</th>
      <th style="padding:10px;color:#ffd700">Iftar</th>
    </tr>
    ${sehriIftarData.map(r => `<tr style="border-bottom:1px solid rgba(0,165,80,0.08)">
      <td style="padding:8px 10px;color:#a0c8a0">Day ${esc(r.day)}</td>
      <td style="padding:8px 10px;text-align:center;color:#00a550;font-weight:bold">${esc(r.sehri)}</td>
      <td style="padding:8px 10px;text-align:center;color:#ffd700;font-weight:bold">${esc(r.iftar)}</td>
    </tr>`).join("")}
  </table>
</div>

<h2>Key Dates in Ramadan 2026</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:16px 0">
  ${[
    { date: "Feb 18", label: "1st Ramadan", desc: "First fast begins" },
    { date: "Mar 4", label: "15th Ramadan", desc: "Middle of Ramadan" },
    { date: "Mar 8", label: "19th night", desc: "Last 10 nights begin" },
    { date: "Mar 14", label: "25th night", desc: "Most likely Laylatul Qadr" },
    { date: "Mar 18", label: "29th Ramadan", desc: "Moon sighting for Eid" },
    { date: "Mar 19/20", label: "Eid ul Fitr 2026", desc: "Festival of Breaking Fast" },
  ].map(e => `<div class="card"><p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.85rem;margin:0 0 2px">${esc(e.label)}</p><p style="color:#00a550;font-weight:bold;margin:0 0 2px">${esc(e.date)}, 2026</p><p style="color:#4a7a4a;font-size:12px;margin:0">${esc(e.desc)}</p></div>`).join("")}
</div>

<h2>Essential Ramadan Duas</h2>
<div class="card" style="margin:16px 0">
  <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 8px">Dua for Breaking Fast (Iftar)</p>
  <p class="arabic" style="font-size:1.4rem;margin:0 0 6px">اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ</p>
  <p class="transliteration" style="margin:0 0 4px">Allahumma laka sumtu wa ala rizqika aftartu</p>
  <p style="color:#a0c8a0;font-size:13px;margin:0">"O Allah, for You I have fasted and with Your provision I break my fast."</p>
</div>
<div class="card" style="margin:16px 0">
  <p style="color:#ffd700;font-family:Cinzel,serif;font-size:0.9rem;margin:0 0 8px">Dua for Laylatul Qadr</p>
  <p class="arabic" style="font-size:1.4rem;margin:0 0 6px">اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي</p>
  <p class="transliteration" style="margin:0 0 4px">Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni</p>
  <p style="color:#a0c8a0;font-size:13px;margin:0">"O Allah, You are Forgiving, You love forgiveness, so forgive me."</p>
</div>

${ctaBlock()}
${faqHtml(faqs)}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

router.get("/islamic-calendar/2026", (_req: Request, res: Response) => {
  const events = [
    { date: "Jan 3, 2026", hijri: "3 Rajab 1447", event: "Islamic New Year (approx)" },
    { date: "Feb 18, 2026", hijri: "1 Ramadan 1447", event: "Ramadan 2026 begins" },
    { date: "Mar 14, 2026", hijri: "25 Ramadan 1447", event: "Laylatul Qadr (most likely)" },
    { date: "Mar 19, 2026", hijri: "1 Shawwal 1447", event: "Eid ul Fitr 2026" },
    { date: "May 26, 2026", hijri: "9 Dhul Hijjah 1447", event: "Day of Arafah" },
    { date: "May 27, 2026", hijri: "10 Dhul Hijjah 1447", event: "Eid ul Adha 2026" },
    { date: "Jun 16, 2026", hijri: "1 Muharram 1448", event: "Islamic New Year 1448" },
    { date: "Jun 25, 2026", hijri: "10 Muharram 1448", event: "Day of Ashura" },
    { date: "Aug 25, 2026", hijri: "12 Rabi al-Awwal 1448", event: "Mawlid an-Nabi (Prophet's Birthday)" },
  ];

  const head = seoHead({
    title: "Islamic Calendar 2026 India, Hijri Calendar & Islamic Events",
    description: "Islamic calendar 2026 for India with all major Islamic events, Ramadan, Eid ul Fitr, Eid ul Adha, Ashura, Laylatul Qadr dates in Gregorian and Hijri.",
    canonical: "/islamic-calendar/2026",
    schema: { "@context": "https://schema.org", "@type": "Article", "headline": "Islamic Calendar 2026 India", "description": "Complete Islamic calendar 2026 with Hijri dates and all major Islamic events.", "author": { "@type": "Organization", "name": "MyTazki" } },
  });

  const body = `
${breadcrumb([{ name: "Home", item: "/" }, { name: "Islamic Calendar 2026" }])}
<h1>Islamic Calendar 2026 India, Hijri Calendar &amp; Events</h1>
<p style="color:#4a7a4a">Major Islamic dates and events for the year 2026 (1447–1448 AH) in India.</p>

<div style="overflow-x:auto;margin:24px 0">
  <table style="width:100%;border-collapse:collapse">
    <tr style="border-bottom:1px solid rgba(0,165,80,0.3)">
      <th style="text-align:left;padding:12px;color:#ffd700">Gregorian Date</th>
      <th style="padding:12px;color:#4a7a4a">Hijri Date</th>
      <th style="text-align:left;padding:12px;color:#00a550">Islamic Event</th>
    </tr>
    ${events.map(e => `<tr style="border-bottom:1px solid rgba(0,165,80,0.08)">
      <td style="padding:10px 12px;color:#e8f5e8;font-weight:bold">${esc(e.date)}</td>
      <td style="padding:10px 12px;text-align:center;color:#4a7a4a;font-size:13px">${esc(e.hijri)}</td>
      <td style="padding:10px 12px;color:#a0c8a0">${esc(e.event)}</td>
    </tr>`).join("")}
  </table>
</div>

${ctaBlock()}
<p style="color:#4a7a4a;margin-top:16px">Related: <a href="/ramadan" style="color:#00a550">Ramadan 2026 Guide</a> · <a href="/prayer-times/delhi" style="color:#00a550">Delhi Prayer Times</a></p>
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(head, body));
});

export default router;
