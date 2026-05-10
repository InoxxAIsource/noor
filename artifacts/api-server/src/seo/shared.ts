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
<title>${esc(title)} | Noor — Islamic Prayer App</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="https://noorapp.com${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="https://noorapp.com/og-image.jpg">
<meta property="og:url" content="https://noorapp.com${canonical}">
<meta name="twitter:card" content="summary_large_image">
${schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")}
<link rel="stylesheet" href="/seo.css">
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
</head>`;
}

export function nav(): string {
  return `<nav style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px;background:#001a00;border-bottom:1px solid rgba(0,165,80,0.2);position:sticky;top:0;z-index:100">
  <a href="/" style="font-family:Cinzel,serif;font-size:20px;color:#00a550;letter-spacing:3px;text-decoration:none">NOOR</a>
  <div style="display:flex;gap:12px;align-items:center">
    <a href="/prayer-times" style="color:#4a7a4a;text-decoration:none;font-size:14px">Prayer Times</a>
    <a href="/blog" style="color:#4a7a4a;text-decoration:none;font-size:14px">Blog</a>
    <a href="/download" style="background:#00a550;color:#001a00;padding:8px 20px;border-radius:8px;font-weight:bold;text-decoration:none;font-size:14px">Download Free</a>
  </div>
</nav>`;
}

export function footer(): string {
  return `<footer style="background:#000f00;border-top:1px solid rgba(0,165,80,0.15);padding:32px 24px;margin-top:48px">
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
      ].map(([href, label]) => `<a href="${href}" style="color:#4a7a4a;text-decoration:none;font-size:13px">${label}</a>`).join(" &nbsp;·&nbsp; ")}
    </div>
    <p style="color:#2a4a2a;font-size:12px;margin:0">© 2026 Noor Islamic Prayer App. Remember Allah. Every day.</p>
  </div>
</footer>`;
}

export function ctaBlock(): string {
  return `<div class="cta-box">
  <p style="color:#ffd700;font-family:Cinzel,serif;font-size:1.1rem;margin:0 0 8px">Remember Allah every day — Download Noor free</p>
  <p style="color:#4a7a4a;font-size:14px;margin:0 0 16px">Prayer times, Quran, duas, names, zakat calculator & AI Islamic guide</p>
  <a href="/download" class="cta-btn">Download Noor App →</a>
</div>`;
}

export function appRedirectBar(): string {
  return `<script>
(function(){
  try{
    var t=localStorage.getItem('noor_token');
    if(t){
      var b=document.createElement('div');
      b.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#001a00;border-top:2px solid #00a550;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;z-index:9999;';
      b.innerHTML='<span style="color:#4a7a4a;font-size:13px">You are logged in to Noor</span><a href="/home" style="background:#00a550;color:#001a00;padding:8px 18px;border-radius:8px;font-weight:bold;text-decoration:none;font-size:13px">Open App \u2192</a>';
      document.body.appendChild(b);
    }
  }catch(e){}
})();
</script>`;
}

export function breadcrumb(items: Array<{ name: string; item?: string }>): string {
  return `<nav style="font-size:13px;color:#4a7a4a;margin:16px 0">
    ${items.map((item, i) => item.item
      ? `<a href="${item.item}" style="color:#00a550;text-decoration:none">${esc(item.name)}</a>${i < items.length - 1 ? " › " : ""}`
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
      ...(item.item ? { "item": `https://noorapp.com${item.item}` } : {}),
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
    ${faqs.map(f => `<div class="faq-item"><strong style="color:#e8f5e8">${esc(f.q)}</strong><p style="margin:6px 0 0;color:#a0c8a0;font-size:14px">${esc(f.a)}</p></div>`).join("")}
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
