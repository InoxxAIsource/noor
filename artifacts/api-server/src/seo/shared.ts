export interface SeoHeadOpts {
  title: string;
  description: string;
  canonical: string;
  schema: object | object[];
}

export function seoHead({ title, description, canonical, schema }: SeoHeadOpts): string {
  const schemas = Array.isArray(schema) ? schema : [schema];
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} | MyTazki, AI Islamic Companion</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="https://mytazki.com${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="https://mytazki.com/og-image.jpg">
<meta property="og:url" content="https://mytazki.com${canonical}">
<meta name="twitter:card" content="summary_large_image">
${schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
<link rel="stylesheet" href="/seo.css">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
</head>`;
}

export function nav(): string {
  return `<nav style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:#0d1411;border-bottom:1px solid rgba(52,201,122,0.1);position:sticky;top:0;z-index:100">
  <a href="/" style="display:flex;align-items:center;gap:8px;text-decoration:none">
    <svg width="24" height="24" viewBox="0 0 180 180" fill="none"><rect width="180" height="180" rx="38" fill="#152019"/><circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.9"/><circle cx="112" cy="78" r="46" fill="#152019"/><circle cx="130" cy="58" r="6" fill="#34c97a"/></svg>
    <span style="font-family:Inter,DM Sans,sans-serif;font-size:17px;font-weight:800;letter-spacing:-0.02em"><span style="color:#34c97a">My</span><span style="color:#eaf4ee">Tazki</span></span>
  </a>
  <div style="display:flex;gap:12px;align-items:center">
    <a href="/prayer-times" style="color:#4a6858;text-decoration:none;font-size:14px;font-family:Inter,sans-serif">Prayer Times</a>
    <a href="/blog" style="color:#4a6858;text-decoration:none;font-size:14px;font-family:Inter,sans-serif">Blog</a>
    <a href="/download" style="background:#34c97a;color:#0d1411;padding:8px 20px;border-radius:8px;font-weight:700;text-decoration:none;font-size:14px;font-family:Inter,sans-serif">Download Free</a>
  </div>
</nav>`;
}

export function footer(): string {
  return `<footer style="background:#0a100d;border-top:1px solid rgba(52,201,122,0.08);padding:32px 24px;margin-top:48px">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px">
      ${[
        ["/", "Home"],
        ["/prayer-times", "Prayer Times"],
        ["/duas", "Duas"],
        ["/names", "Islamic Names"],
        ["/quran", "Quran"],
        ["/zakat-calculator", "Zakat Calculator"],
        ["/masjid-finder", "Masjid Finder"],
        ["/ramadan", "Ramadan 2026"],
        ["/blog", "Blog"],
        ["/best-muslim-prayer-app-india", "Compare Apps"],
        ["/sitemap.xml", "Sitemap"],
      ].map(([href, label]) => `<a href="${href}" style="color:#4a6858;text-decoration:none;font-size:13px;font-family:Inter,sans-serif">${label}</a>`).join(" &nbsp;·&nbsp; ")}
    </div>
    <p style="color:#2a3830;font-size:12px;margin:0;font-family:Inter,sans-serif">© 2026 MyTazki, AI Islamic Companion. Grow Spiritually Every Day.</p>
  </div>
</footer>`;
}

export function ctaBlock(): string {
  return `<div class="cta-box">
  <p style="color:#34c97a;font-family:DM Sans,Inter,sans-serif;font-size:1.1rem;margin:0 0 8px;font-weight:700">Grow Spiritually Every Day, Download MyTazki free</p>
  <p style="color:#4a6858;font-size:14px;margin:0 0 16px;font-family:Inter,sans-serif">Prayer times, Quran, Azkar, Duas, AI Islamic guide & spiritual growth tracker</p>
  <a href="/download" class="cta-btn">Download MyTazki →</a>
</div>`;
}

export function appRedirectBar(): string {
  return `<script>
(function(){
  try{
    var t=localStorage.getItem('tazki_token')||localStorage.getItem('deen_token');
    if(t){
      var b=document.createElement('div');
      b.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#0d1411;border-top:2px solid #34c97a;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:Inter,sans-serif;';
      b.innerHTML='<span style="color:#4a6858;font-size:13px">You are logged in to MyTazki</span><a href="/home" style="background:#34c97a;color:#0d1411;padding:8px 18px;border-radius:8px;font-weight:700;text-decoration:none;font-size:13px">Open App \u2192</a>';
      document.body.appendChild(b);
    }
  }catch(e){}
})();
</script>`;
}

export function breadcrumb(items: Array<{ name: string; item?: string }>): string {
  return `<nav style="font-size:13px;color:#4a6858;margin:16px 0;font-family:Inter,sans-serif">
    ${items.map((item, i) => item.item
      ? `<a href="${item.item}" style="color:#34c97a;text-decoration:none">${esc(item.name)}</a>${i < items.length - 1 ? " › " : ""}`
      : `<span>${esc(item.name)}</span>`
    ).join("")}
  </nav>`;
}

export function breadcrumbSchema(items: Array<{ name: string; item?: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      ...(item.item ? { "item": `https://mytazki.com${item.item}` } : {}),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };
}

export function faqHtml(faqs: Array<{ q: string; a: string }>): string {
  return `<section style="margin:32px 0">
    <h2>Frequently Asked Questions</h2>
    ${faqs.map(f => `<div class="faq-item"><strong style="color:#eaf4ee;font-family:Inter,sans-serif">${esc(f.q)}</strong><p style="margin:6px 0 0;color:#a0c8a0;font-size:14px;font-family:Inter,sans-serif">${esc(f.a)}</p></div>`).join("")}
  </section>`;
}

export function page(head: string, body: string): string {
  return `${head}
<body>
${nav()}
<div style="max-width:900px;margin:0 auto;padding:24px 20px 80px">
${body}
</div>
${footer()}
${appRedirectBar()}
</body>
</html>`;
}

export function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function statsBlock(stats: Array<{ stat: string; source: string }>): string {
  return `<div class="stats-block" style="background:rgba(52,201,122,0.04);border:1px solid rgba(52,201,122,0.15);border-radius:14px;padding:20px 24px;margin:28px 0">
  <p style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#34c97a;margin:0 0 14px;font-family:Inter,sans-serif">Key Statistics</p>
  <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:12px">
    ${stats.map(s => `<li style="display:flex;gap:10px;align-items:flex-start;font-family:Inter,sans-serif">
      <span style="color:#34c97a;font-size:16px;flex-shrink:0;line-height:1.6">•</span>
      <span style="font-size:14px;line-height:1.65"><strong style="color:#eaf4ee">${esc(s.stat)}</strong>&nbsp;<span style="color:#4a6858;font-size:12px">(${esc(s.source)})</span></span>
    </li>`).join("")}
  </ul>
</div>`;
}

export function scholarQuote(quote: string, scholar: string, source: string): string {
  return `<blockquote class="scholar-quote" style="border-left:3px solid #b8946a;margin:28px 0;padding:18px 22px;background:rgba(184,148,106,0.05);border-radius:0 12px 12px 0">
  <p style="color:#eaf4ee;font-size:15px;line-height:1.8;margin:0 0 12px;font-family:Inter,sans-serif;font-style:italic">"${esc(quote)}"</p>
  <footer style="color:#b8946a;font-size:13px;font-family:Inter,sans-serif">— <strong>${esc(scholar)}</strong><span style="color:#4a6858">, ${esc(source)}</span></footer>
</blockquote>`;
}

export function howToSchema(name: string, description: string, steps: Array<{ name: string; text: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": s.name,
      "text": s.text,
    })),
  };
}

export const INDIA_CITIES = [
  "Delhi", "Mumbai", "Hyderabad", "Lucknow", "Bangalore", "Kolkata", "Chennai",
  "Jaipur", "Bhopal", "Patna", "Srinagar", "Aligarh", "Moradabad", "Meerut",
  "Agra", "Varanasi", "Allahabad", "Saharanpur", "Bareilly", "Firozabad",
  "Rampur", "Sambhal", "Amroha", "Hapur", "Shahjahanpur", "Muzaffarnagar",
  "Mau", "Azamgarh", "Gorakhpur", "Faizabad", "Bahraich", "Gonda", "Sitapur",
  "Hardoi", "Lakhimpur", "Unnao", "Rae-Bareli", "Sultanpur", "Ambedkar-Nagar",
  "Ballia", "Deoria", "Kushinagar", "Basti", "Siddharth-Nagar", "Maharajganj",
  "Shravasti", "Balrampur", "Ghazipur", "Jaunpur", "Mirzapur",
];

export const PAKISTAN_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar", "Quetta", "Multan",
  "Faisalabad", "Gujranwala", "Sialkot", "Bahawalpur", "Sargodha", "Sukkur",
  "Larkana", "Hyderabad-PK", "Abbottabad", "Mardan", "Mingora", "Dera-Ghazi-Khan",
  "Sahiwal", "Okara", "Wah", "Gujrat", "Sheikhupura", "Jhang",
  "Dera-Ismail-Khan", "Kasur", "Chiniot", "Kamoke", "Hafizabad",
];

export const ALL_CITIES = [...INDIA_CITIES, ...PAKISTAN_CITIES];
