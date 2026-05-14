import { useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const C = {
  bg:      "#09070A",
  surface: "#16100a",
  card:    "#1a130d",
  faint:   "#241a10",
  border:  "rgba(52,201,122,0.12)",
  bGold:   "rgba(201,164,114,0.18)",
  bSoft:   "rgba(201,164,114,0.08)",
  green:   "#34c97a",
  gold:    "#c9a472",
  text:    "#f0ece4",
  muted:   "#6e5e4c",
};

interface Plan {
  name: string;
  price: string;
  period: string;
  accent: string;
  glow: string;
  badge?: string;
  features: string[];
  cta: string;
  disabled?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    accent: C.muted,
    glow: "rgba(110,94,76,0.12)",
    badge: "Current plan",
    features: [
      "Prayer times for all cities",
      "Tasbih counter",
      "Basic duas library",
      "Quran reader (all 114 surahs)",
      "99 Names of Allah",
      "Islamic Calendar",
      "Qibla Compass",
      "Masjid Finder",
      "Zakat Calculator",
    ],
    cta: "You're on Free",
    disabled: true,
  },
  {
    name: "Premium",
    price: "₹79",
    period: "/ month",
    accent: C.green,
    glow: "rgba(52,201,122,0.14)",
    badge: "Most popular",
    features: [
      "Everything in Free",
      "25 guided audio sessions",
      "MyTazki AI companion (unlimited)",
      "Growth dashboard & badges",
      "Mood-based recommendations",
      "Streak analytics",
      "Salah journal",
      "Gift a dua to friends",
      "No ads — ever",
    ],
    cta: "Join Waitlist",
  },
  {
    name: "Halaqah",
    price: "₹199",
    period: "/ month",
    accent: C.gold,
    glow: "rgba(201,164,114,0.14)",
    features: [
      "Everything in Premium",
      "Create group prayer rooms",
      "Halaqah (study circle) mode",
      "Group streak tracking",
      "Admin dashboard",
      "Custom group duas",
      "Group journal sharing",
      "Priority support",
    ],
    cta: "Join Waitlist",
  },
];

const FAQ = [
  ["When is Premium launching?", "We're in open beta — all features are free for now. Paid plans launch in late 2026; early joiners get 3 months free."],
  ["Will my free features stay free?", "Always. Prayer times, Quran, Qibla, Masjid Finder, and core duas are free forever."],
  ["Is my data private?", "Yes. Your salah logs, journal, and streak data are private to your account. We never sell data."],
  ["Is there a family plan?", "The Halaqah plan supports group rooms. A family plan is on our roadmap."],
];

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setErr("Please enter a valid email"); return; }
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${BASE}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (r.ok) setSubmitted(true);
      else setErr("Something went wrong. Please try again.");
    } catch {
      setErr("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "Inter, DM Sans, system-ui, sans-serif", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(9,7,10,0.88)", backdropFilter: "blur(22px) saturate(1.2)", borderBottom: `1px solid ${C.bSoft}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 180 180" fill="none"><rect width="180" height="180" rx="38" fill="#09070A"/><path d="M56 90C56 68.46 70.77 50.5 91 46.23 87.5 45.43 83.83 45 80 45 57.91 45 40 62.91 40 85s17.91 40 40 40c3.83 0 7.5-.43 11-.23C70.77 120.5 56 111.54 56 90z" fill="#34c97a"/><circle cx="112" cy="78" r="46" fill="#09070A"/><circle cx="130" cy="58" r="6" fill="#34c97a"/></svg>
          <span style={{ fontFamily: "DM Sans, Inter, sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>
            <span style={{ color: C.green }}>My</span><span style={{ color: C.text }}>Tazki</span>
          </span>
        </a>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="/prayer-times" style={{ color: C.muted, fontSize: 14, textDecoration: "none" }}>Prayer Times</a>
          <a href="/" style={{ color: C.muted, fontSize: 14, textDecoration: "none" }}>Blog</a>
          <a href="/download" style={{ background: C.green, color: "#09070A", borderRadius: 24, padding: "8px 18px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Download Free</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", padding: "56px 20px 40px" }}>
        <div style={{ display: "inline-block", background: `rgba(52,201,122,0.08)`, border: `1px solid ${C.border}`, borderRadius: 24, padding: "6px 18px", fontSize: 12, fontWeight: 700, letterSpacing: 1.8, color: C.green, textTransform: "uppercase", marginBottom: 20 }}>
          Open Beta · All features free
        </div>
        <h1 style={{ fontFamily: "DM Sans, serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 2.8rem)", color: C.text, margin: "0 0 12px", lineHeight: 1.15 }}>
          MyTazki <span style={{ color: C.gold }}>Premium</span>
        </h1>
        <p style={{ color: C.muted, fontSize: "1.05rem", maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.65 }}>
          Grow Spiritually Every Day. Unlock the full spiritual experience for less than a coffee a month.
        </p>
        <div style={{ background: `rgba(201,164,114,0.06)`, border: `1px solid ${C.bGold}`, borderRadius: 12, padding: "10px 22px", display: "inline-block" }}>
          <p style={{ color: C.gold, margin: 0, fontSize: 14, fontWeight: 600 }}>
            🌙 Beta — All features free until launch. Paid plans coming soon.
          </p>
        </div>
      </div>

      {/* ── Plans grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 20, padding: "0 20px 8px", maxWidth: 960, margin: "0 auto" }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{
            background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`,
            border: `1px solid ${plan.accent}30`,
            borderRadius: 20,
            padding: "28px 24px",
            position: "relative",
            boxShadow: plan.name !== "Free" ? `0 0 32px ${plan.glow}, 0 8px 28px rgba(0,0,0,0.40)` : "0 4px 20px rgba(0,0,0,0.35)",
            transition: "transform 0.2s ease",
          }}>
            {plan.badge && (
              <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: plan.accent, color: plan.name === "Halaqah" ? "#09070A" : "#09070A", padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", letterSpacing: 0.5 }}>
                {plan.badge}
              </div>
            )}

            {/* Plan header */}
            <div style={{ marginTop: plan.badge ? 8 : 0, marginBottom: 20 }}>
              <h2 style={{ color: plan.accent, fontFamily: "DM Sans, serif", fontWeight: 800, fontSize: "1.15rem", margin: "0 0 12px", letterSpacing: "-0.2px" }}>{plan.name}</h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ color: C.text, fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-1px" }}>{plan.price}</span>
                <span style={{ color: C.muted, fontSize: 14 }}>{plan.period}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${plan.accent}25, transparent)`, marginBottom: 20 }} />

            {/* Features */}
            <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.features.map(f => (
                <li key={f} style={{ color: C.text, fontSize: 14, display: "flex", gap: 10, alignItems: "flex-start", lineHeight: 1.4 }}>
                  <span style={{ color: plan.accent, flexShrink: 0, fontWeight: 700, marginTop: 1 }}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            {plan.disabled ? (
              <div style={{ width: "100%", background: C.faint, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 12, padding: "13px 0", fontSize: 14, textAlign: "center", boxSizing: "border-box" }}>
                {plan.cta}
              </div>
            ) : (
              <a href="#waitlist" style={{ display: "block", width: "100%", background: plan.name === "Premium" ? C.green : "transparent", border: `1px solid ${plan.accent}`, color: plan.name === "Premium" ? "#09070A" : plan.accent, borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}>
                {plan.cta} →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* ── Waitlist ── */}
      <div id="waitlist" style={{ maxWidth: 500, margin: "48px auto 0", padding: "0 20px" }}>
        <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 20, padding: 32, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌙</div>
          <h2 style={{ color: C.gold, fontFamily: "DM Sans, serif", fontWeight: 800, fontSize: "1.3rem", margin: "0 0 8px" }}>Join the Premium Waitlist</h2>
          <p style={{ color: C.muted, fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
            Be first to know when paid features launch. Early joiners get 3 months free.
          </p>

          {submitted ? (
            <div style={{ background: "rgba(52,201,122,0.08)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <p style={{ color: C.green, fontSize: "1.05rem", margin: 0, fontWeight: 600 }}>✅ JazakAllah khair!</p>
              <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0" }}>We'll email you when Premium launches.</p>
            </div>
          ) : (
            <form onSubmit={(e) => void handleWaitlist(e)} style={{ display: "flex", gap: 10, flexDirection: "column" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ background: C.faint, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "13px 16px", fontSize: 15, outline: "none", fontFamily: "inherit" }}
              />
              {err && <p style={{ color: "#c04848", fontSize: 13, margin: 0 }}>{err}</p>}
              <button type="submit" disabled={loading} style={{ background: C.green, color: "#09070A", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {loading ? "Joining…" : "Join Waitlist — Free"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: 640, margin: "48px auto 80px", padding: "0 20px" }}>
        <h2 style={{ color: C.gold, fontFamily: "DM Sans, serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: 20, textAlign: "center", letterSpacing: "0.5px" }}>Frequently Asked Questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQ.map(([q, a]) => (
            <div key={q} style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ color: C.gold, fontFamily: "DM Sans, serif", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 8px" }}>{q}</p>
              <p style={{ color: C.muted, fontSize: 14, margin: 0, lineHeight: 1.65 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
