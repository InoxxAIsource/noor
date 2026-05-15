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

export function shareBlock(): string {
  return `<div style="margin:40px 0;padding:24px;background:rgba(52,201,122,0.04);border:1px solid rgba(52,201,122,0.12);border-radius:14px;text-align:center">
  <p style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#34c97a;margin:0 0 6px;font-family:Inter,sans-serif">Share this guide</p>
  <p style="font-size:13px;color:#4a6858;margin:0 0 18px;font-family:Inter,sans-serif">Help another Muslim benefit — sharing is sadaqah jariyah</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center" id="share-btns">
    <a id="share-whatsapp" href="#" target="_blank" rel="noopener"
       style="display:inline-flex;align-items:center;gap:7px;background:#25D366;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;font-family:Inter,sans-serif">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </a>
    <a id="share-telegram" href="#" target="_blank" rel="noopener"
       style="display:inline-flex;align-items:center;gap:7px;background:#229ED9;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;font-family:Inter,sans-serif">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
      Telegram
    </a>
    <a id="share-twitter" href="#" target="_blank" rel="noopener"
       style="display:inline-flex;align-items:center;gap:7px;background:#000;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;font-family:Inter,sans-serif">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      X / Twitter
    </a>
    <a id="share-reddit" href="#" target="_blank" rel="noopener"
       style="display:inline-flex;align-items:center;gap:7px;background:#FF4500;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;font-family:Inter,sans-serif">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
      Reddit
    </a>
    <button id="share-copy" onclick="(function(){var u=window.location.href;navigator.clipboard&&navigator.clipboard.writeText(u).then(function(){var b=document.getElementById('share-copy');b.textContent='✓ Copied!';b.style.background='#34c97a';b.style.color='#0d1411';setTimeout(function(){b.textContent='Copy Link';b.style.background='rgba(52,201,122,0.12)';b.style.color='#34c97a';},2000);})})()"
       style="display:inline-flex;align-items:center;gap:7px;background:rgba(52,201,122,0.12);color:#34c97a;padding:10px 18px;border-radius:10px;border:1px solid rgba(52,201,122,0.25);font-size:13px;font-weight:600;font-family:Inter,sans-serif;cursor:pointer">
      Copy Link
    </button>
  </div>
  <script>
  (function(){
    var u=encodeURIComponent(window.location.href);
    var t=encodeURIComponent(document.title.replace(' | MyTazki, AI Islamic Companion',''));
    var msg=encodeURIComponent('\u2728 ' + decodeURIComponent(t) + ' \u2014 a beneficial Islamic guide: ' + window.location.href);
    document.getElementById('share-whatsapp').href='https://wa.me/?text='+msg;
    document.getElementById('share-telegram').href='https://t.me/share/url?url='+u+'&text='+encodeURIComponent('\u2728 '+decodeURIComponent(t)+' \u2014 a beneficial Islamic guide');
    document.getElementById('share-twitter').href='https://twitter.com/intent/tweet?url='+u+'&text='+encodeURIComponent('\u2728 '+decodeURIComponent(t))+' via @MyTazki';
    document.getElementById('share-reddit').href='https://reddit.com/submit?url='+u+'&title='+encodeURIComponent(decodeURIComponent(t)+' \u2014 MyTazki Islamic Guide');
  })();
  </script>
</div>`;
}

export function page(head: string, body: string): string {
  return `${head}
<body>
${nav()}
<div style="max-width:900px;margin:0 auto;padding:24px 20px 80px">
${body}
${shareBlock()}
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
