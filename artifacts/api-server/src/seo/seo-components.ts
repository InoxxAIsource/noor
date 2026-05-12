import { esc } from "./shared.js";

export interface ArticleLink {
  href: string;
  label: string;
  desc?: string;
  tag?: string;
}

export interface JourneyLink {
  href: string;
  title: string;
  subtitle: string;
  days: string;
  icon?: string;
}

export function relatedArticlesGrid(articles: ArticleLink[], heading = "Continue Your Journey"): string {
  return `<section style="margin:40px 0">
  <h2 style="margin-bottom:16px">${esc(heading)}</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px">
    ${articles.map(a => `<a href="${a.href}" style="text-decoration:none;display:block;background:#1c2d21;border:1px solid rgba(52,201,122,0.15);border-radius:12px;padding:18px 16px;transition:border-color 0.2s" onmouseover="this.style.borderColor='rgba(52,201,122,0.4)'" onmouseout="this.style.borderColor='rgba(52,201,122,0.15)'">
      ${a.tag ? `<span style="font-size:11px;font-weight:700;color:#34c97a;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;display:block">${esc(a.tag)}</span>` : ""}
      <strong style="color:#eaf4ee;font-size:15px;line-height:1.4;font-family:DM Sans,Inter,sans-serif;display:block">${esc(a.label)}</strong>
      ${a.desc ? `<span style="color:#6a9878;font-size:13px;margin-top:6px;display:block;line-height:1.5">${esc(a.desc)}</span>` : ""}
    </a>`).join("")}
  </div>
</section>`;
}

export function guidedJourneyCard(j: JourneyLink): string {
  return `<a href="${j.href}" style="text-decoration:none;display:block;background:linear-gradient(135deg,#1c2d21 0%,#152019 100%);border:1px solid rgba(184,148,106,0.25);border-radius:16px;padding:24px 20px;margin:14px 0">
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
    <span style="font-size:24px">${j.icon ?? "🌙"}</span>
    <span style="background:rgba(184,148,106,0.12);color:#b8946a;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:0.05em">${esc(j.days)}</span>
  </div>
  <strong style="color:#eaf4ee;font-size:17px;font-family:DM Sans,Inter,sans-serif;font-weight:700;display:block;margin-bottom:6px">${esc(j.title)}</strong>
  <span style="color:#6a9878;font-size:14px;line-height:1.6">${esc(j.subtitle)}</span>
  <div style="margin-top:14px;color:#34c97a;font-size:13px;font-weight:600">Begin journey →</div>
</a>`;
}

export function guidedJourneysBlock(journeys: JourneyLink[], heading = "Guided Spiritual Journeys"): string {
  return `<section style="margin:40px 0">
  <h2 style="margin-bottom:4px">${esc(heading)}</h2>
  <p style="color:#6a9878;font-size:14px;margin-bottom:18px;font-family:Inter,sans-serif">Structured paths to help you grow — one day at a time.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
    ${journeys.map(guidedJourneyCard).join("")}
  </div>
</section>`;
}

export function quickAnswerBox(question: string, answer: string): string {
  return `<div class="ai-summary" style="background:rgba(52,201,122,0.06);border:1px solid rgba(52,201,122,0.2);border-left:4px solid #34c97a;border-radius:0 12px 12px 0;padding:18px 22px;margin:20px 0">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#34c97a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span style="color:#34c97a;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">AI Quick Answer</span>
  </div>
  <p style="color:#6a9878;font-size:13px;font-style:italic;margin:0 0 8px;font-family:Inter,sans-serif">"${esc(question)}"</p>
  <p style="color:#eaf4ee;font-size:15px;line-height:1.75;margin:0;font-family:Inter,sans-serif">${esc(answer)}</p>
</div>`;
}

export function peopleAlsoAsk(items: Array<{ q: string; a: string }>, heading = "People Also Ask"): string {
  return `<section style="margin:40px 0">
  <h2 style="margin-bottom:16px">${esc(heading)}</h2>
  ${items.map((item, i) => `<details style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:0;margin-bottom:10px;overflow:hidden" ${i === 0 ? "open" : ""}>
    <summary style="padding:16px 20px;cursor:pointer;color:#eaf4ee;font-weight:600;font-size:15px;font-family:DM Sans,Inter,sans-serif;list-style:none;display:flex;justify-content:space-between;align-items:center">
      ${esc(item.q)}
      <span style="color:#34c97a;font-size:18px;flex-shrink:0;margin-left:12px">+</span>
    </summary>
    <div style="padding:4px 20px 16px;color:#a0c8a0;font-size:14px;line-height:1.75;font-family:Inter,sans-serif">${esc(item.a)}</div>
  </details>`).join("")}
</section>`;
}

export function conversationalBlock(queries: string[]): string {
  return `<section style="margin:36px 0;padding:24px;background:rgba(52,201,122,0.03);border-radius:14px;border:1px solid rgba(52,201,122,0.08)">
  <h3 style="color:#34c97a;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 14px;font-family:Inter,sans-serif">How People Search for This</h3>
  <div style="display:flex;flex-wrap:wrap;gap:8px">
    ${queries.map(q => `<span style="background:rgba(52,201,122,0.07);border:1px solid rgba(52,201,122,0.15);color:#6a9878;padding:6px 14px;border-radius:20px;font-size:13px;font-family:Inter,sans-serif">${esc(q)}</span>`).join("")}
  </div>
</section>`;
}

export function nextStepsBlock(steps: Array<{ href: string; label: string; desc: string }>, heading = "Your Next Step"): string {
  return `<section style="margin:40px 0">
  <h2 style="margin-bottom:16px">${esc(heading)}</h2>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${steps.map((s, i) => `<a href="${s.href}" style="text-decoration:none;display:flex;align-items:flex-start;gap:16px;background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:18px 16px">
      <span style="background:rgba(52,201,122,0.12);color:#34c97a;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">${i + 1}</span>
      <div>
        <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:4px">${esc(s.label)}</strong>
        <span style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif">${esc(s.desc)}</span>
      </div>
    </a>`).join("")}
  </div>
</section>`;
}

export function emotionalCTA(opts: { title: string; subtitle: string; href: string; btnText: string }): string {
  return `<section style="background:linear-gradient(135deg,#152019 0%,#0d1411 100%);border:1px solid rgba(52,201,122,0.2);border-radius:18px;padding:36px 28px;margin:40px 0;text-align:center">
  <div style="font-size:28px;margin-bottom:12px">🌙</div>
  <h2 style="font-family:DM Sans,Inter,sans-serif;font-size:1.4rem;color:#eaf4ee;margin:0 0 10px;font-weight:700">${esc(opts.title)}</h2>
  <p style="color:#6a9878;font-size:15px;line-height:1.65;margin:0 0 22px;font-family:Inter,sans-serif">${esc(opts.subtitle)}</p>
  <a href="${opts.href}" style="background:#34c97a;color:#0d1411;padding:14px 32px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:inline-block">${esc(opts.btnText)}</a>
  <p style="color:#2a3830;font-size:12px;margin:14px 0 0;font-family:Inter,sans-serif">Free to download · No account required to start</p>
</section>`;
}

export function sessionPromoCard(opts: { title: string; href: string; desc: string; duration?: string }): string {
  return `<a href="${opts.href}" style="text-decoration:none;display:block;background:linear-gradient(135deg,#152019,#0d1411);border:1px solid rgba(184,148,106,0.2);border-radius:14px;padding:20px 18px;margin:10px 0">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#b8946a" stroke-width="1.5"/><polygon points="10,8 16,12 10,16" fill="#b8946a"/></svg>
    ${opts.duration ? `<span style="color:#b8946a;font-size:12px;font-family:Inter,sans-serif">${esc(opts.duration)}</span>` : ""}
  </div>
  <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${esc(opts.title)}</strong>
  <span style="color:#6a9878;font-size:13px;font-family:Inter,sans-serif">${esc(opts.desc)}</span>
</a>`;
}

export function hubHero(opts: { title: string; arabicText: string; arabicMeaning: string; subtitle: string; stats: Array<{ n: string; label: string }> }): string {
  return `<header style="padding:48px 0 40px;border-bottom:1px solid rgba(52,201,122,0.1);margin-bottom:40px">
  <p style="font-family:Amiri,serif;direction:rtl;text-align:center;color:#b8946a;font-size:2rem;margin:0 0 6px;line-height:1.8">${opts.arabicText}</p>
  <p style="text-align:center;color:#4a6858;font-size:13px;font-family:Inter,sans-serif;margin:0 0 24px;font-style:italic">${esc(opts.arabicMeaning)}</p>
  <h1 style="text-align:center;font-family:DM Sans,Inter,sans-serif;font-size:2.2rem;font-weight:800;color:#eaf4ee;line-height:1.2;margin:0 0 16px">${esc(opts.title)}</h1>
  <p style="text-align:center;color:#6a9878;font-size:1rem;line-height:1.7;max-width:620px;margin:0 auto 32px;font-family:Inter,sans-serif">${esc(opts.subtitle)}</p>
  ${opts.stats.length > 0 ? `<div style="display:flex;justify-content:center;gap:32px;flex-wrap:wrap">
    ${opts.stats.map(s => `<div style="text-align:center"><div style="font-family:DM Sans,sans-serif;font-size:1.5rem;font-weight:800;color:#34c97a">${esc(s.n)}</div><div style="color:#4a6858;font-size:12px;font-family:Inter,sans-serif">${esc(s.label)}</div></div>`).join("")}
  </div>` : ""}
</header>`;
}

export function clusterNavBar(links: Array<{ href: string; label: string }>, active?: string): string {
  return `<nav style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid rgba(52,201,122,0.08)">
  ${links.map(l => `<a href="${l.href}" style="padding:8px 16px;border-radius:20px;font-size:13px;font-family:Inter,sans-serif;text-decoration:none;${active === l.href ? "background:#34c97a;color:#0d1411;font-weight:700" : "background:rgba(52,201,122,0.07);border:1px solid rgba(52,201,122,0.15);color:#6a9878"}">${esc(l.label)}</a>`).join("")}
</nav>`;
}

export function articleGrid(articles: ArticleLink[], cols = 3): string {
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(${cols === 2 ? 260 : 200}px,1fr));gap:12px;margin:16px 0">
  ${articles.map(a => `<a href="${a.href}" style="text-decoration:none;background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:16px;display:block">
    ${a.tag ? `<span style="color:#34c97a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:6px">${esc(a.tag)}</span>` : ""}
    <strong style="color:#eaf4ee;font-size:14px;line-height:1.4;font-family:Inter,sans-serif;display:block">${esc(a.label)}</strong>
    ${a.desc ? `<p style="color:#4a6858;font-size:12px;margin:6px 0 0;line-height:1.5;font-family:Inter,sans-serif">${esc(a.desc)}</p>` : ""}
  </a>`).join("")}
</div>`;
}

export function mostReadSection(articles: ArticleLink[]): string {
  return `<section style="margin:40px 0;background:rgba(52,201,122,0.04);border-radius:14px;padding:24px">
  <h2 style="margin:0 0 16px;font-size:1rem;text-transform:uppercase;letter-spacing:0.08em;color:#34c97a;font-size:12px">Most Read</h2>
  <ol style="margin:0;padding-left:20px">
    ${articles.map(a => `<li style="margin-bottom:12px"><a href="${a.href}" style="color:#eaf4ee;text-decoration:none;font-size:15px;font-family:Inter,sans-serif;line-height:1.4">${esc(a.label)}</a>${a.desc ? `<p style="color:#4a6858;font-size:12px;margin:3px 0 0;font-family:Inter,sans-serif">${esc(a.desc)}</p>` : ""}</li>`).join("")}
  </ol>
</section>`;
}

export function startHereBox(steps: Array<{ label: string; href: string }>): string {
  return `<div style="background:linear-gradient(135deg,rgba(52,201,122,0.08),rgba(184,148,106,0.05));border:1px solid rgba(52,201,122,0.18);border-radius:14px;padding:24px;margin:32px 0">
  <h3 style="color:#34c97a;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 16px">Start Here — Recommended Path</h3>
  <ol style="margin:0;padding-left:0;list-style:none;display:flex;flex-direction:column;gap:10px">
    ${steps.map((s, i) => `<li style="display:flex;align-items:center;gap:12px">
      <span style="background:#34c97a;color:#0d1411;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">${i + 1}</span>
      <a href="${s.href}" style="color:#eaf4ee;text-decoration:none;font-size:14px;font-family:Inter,sans-serif">${esc(s.label)}</a>
    </li>`).join("")}
  </ol>
</div>`;
}
