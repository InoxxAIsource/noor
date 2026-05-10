import { useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Plan {
  name: string;
  price: string;
  period: string;
  color: string;
  features: string[];
  cta: string;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    color: "#4a7a4a",
    badge: "Current plan",
    features: [
      "Prayer times (all cities)",
      "Tasbih counter",
      "Basic duas library",
      "Quran reader",
      "99 Names of Allah",
      "Islamic Calendar",
      "Qibla Compass",
      "Masjid Finder",
      "Zakat Calculator",
    ],
    cta: "You're on Free",
  },
  {
    name: "Premium",
    price: "₹79",
    period: "/ month",
    color: "#00a550",
    badge: "Most popular",
    features: [
      "Everything in Free",
      "25 guided audio sessions",
      "Noor AI companion (unlimited)",
      "Growth dashboard & badges",
      "Mood-based recommendations",
      "Streak analytics",
      "Salah journal",
      "Gift a dua to friends",
      "No ads (ever)",
    ],
    cta: "Join Waitlist",
  },
  {
    name: "Halaqah",
    price: "₹199",
    period: "/ month",
    color: "#ffd700",
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
      if (r.ok) {
        setSubmitted(true);
      } else {
        setErr("Something went wrong. Please try again.");
      }
    } catch {
      setErr("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "#001a00", minHeight: "100vh", padding: "0 0 80px", color: "#e8f5e8" }}>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "32px 20px 24px" }}>
        <h1 style={{ fontFamily: "Cinzel,serif", color: "#ffd700", fontSize: "1.8rem", margin: "0 0 8px" }}>
          Noor Premium
        </h1>
        <p style={{ color: "#4a7a4a", fontSize: "1rem", maxWidth: 420, margin: "0 auto" }}>
          Remember Allah. Every day. Unlock the full spiritual experience.
        </p>
        <div style={{ background: "rgba(0,165,80,0.1)", border: "1px solid rgba(0,165,80,0.3)", borderRadius: 8, padding: "10px 20px", display: "inline-block", marginTop: 16 }}>
          <p style={{ color: "#00a550", margin: 0, fontSize: 14, fontWeight: "bold" }}>
            🌙 Beta — All features free until launch. Paid plans coming soon.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, padding: "0 16px", maxWidth: 900, margin: "0 auto" }}>
        {PLANS.map(plan => (
          <div key={plan.name} style={{
            background: "#002800",
            border: `1px solid ${plan.color}40`,
            borderRadius: 14,
            padding: 24,
            position: "relative",
            boxShadow: plan.name === "Premium" ? `0 0 24px ${plan.color}30` : "none",
          }}>
            {plan.badge && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.color, color: plan.name === "Halaqah" ? "#001a00" : "#001a00", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: "bold", whiteSpace: "nowrap" }}>
                {plan.badge}
              </div>
            )}

            <h2 style={{ color: plan.color, fontFamily: "Cinzel,serif", fontSize: "1.1rem", margin: "12px 0 4px" }}>{plan.name}</h2>
            <div style={{ margin: "0 0 20px" }}>
              <span style={{ color: "#ffd700", fontSize: "2rem", fontWeight: "bold" }}>{plan.price}</span>
              <span style={{ color: "#4a7a4a", fontSize: 14 }}> {plan.period}</span>
            </div>

            <ul style={{ margin: "0 0 24px", padding: "0 0 0 0", listStyle: "none" }}>
              {plan.features.map(f => (
                <li key={f} style={{ color: "#e8f5e8", fontSize: 14, padding: "6px 0", borderBottom: "1px solid rgba(0,165,80,0.08)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: plan.color, flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>

            {plan.name === "Free" ? (
              <button style={{ width: "100%", background: "#001a00", border: "1px solid rgba(0,165,80,0.2)", color: "#4a7a4a", borderRadius: 8, padding: "12px 0", fontSize: 14, cursor: "default" }}>
                {plan.cta}
              </button>
            ) : (
              <a href="#waitlist" style={{ display: "block", width: "100%", background: plan.color, color: "#001a00", borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: "bold", textAlign: "center", textDecoration: "none" }}>
                {plan.cta} →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Waitlist */}
      <div id="waitlist" style={{ maxWidth: 480, margin: "40px auto 0", padding: "0 16px" }}>
        <div style={{ background: "#002800", border: "1px solid rgba(0,165,80,0.3)", borderRadius: 14, padding: 28, textAlign: "center" }}>
          <h2 style={{ color: "#ffd700", fontFamily: "Cinzel,serif", fontSize: "1.2rem", margin: "0 0 8px" }}>Join the Premium Waitlist</h2>
          <p style={{ color: "#4a7a4a", fontSize: 14, margin: "0 0 20px" }}>
            Be first to know when paid features launch. Early joiners get 3 months free.
          </p>

          {submitted ? (
            <div style={{ background: "rgba(0,165,80,0.1)", borderRadius: 10, padding: 20 }}>
              <p style={{ color: "#00a550", fontSize: "1.1rem", margin: 0 }}>✅ JazakAllah khair!</p>
              <p style={{ color: "#4a7a4a", fontSize: 14, margin: "8px 0 0" }}>We'll email you when Premium launches.</p>
            </div>
          ) : (
            <form onSubmit={(e) => void handleWaitlist(e)} style={{ display: "flex", gap: 10, flexDirection: "column" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ background: "#001a00", border: "1px solid rgba(0,165,80,0.3)", color: "#e8f5e8", borderRadius: 8, padding: "12px 16px", fontSize: 15, outline: "none" }}
              />
              {err && <p style={{ color: "#ff6666", fontSize: 13, margin: 0 }}>{err}</p>}
              <button type="submit" disabled={loading} style={{ background: "#00a550", color: "#001a00", border: "none", borderRadius: 8, padding: "12px 0", fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>
                {loading ? "Joining…" : "Join Waitlist — Free"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 600, margin: "32px auto 0", padding: "0 16px" }}>
        <h2 style={{ color: "#00a550", fontFamily: "Cinzel,serif", fontSize: "1rem", marginBottom: 16 }}>Frequently Asked Questions</h2>
        {[
          ["When is Premium launching?", "We're in open beta. All features are free for now. Premium paid plans are launching in late 2026 — joiners today get early access."],
          ["Will my free features stay free?", "Yes. Prayer times, Quran, basic duas, Qibla, and Masjid Finder are free forever, always."],
          ["Is my data private?", "Yes. Your salah logs, journal, and streak data are private to your account. We never sell your data."],
          ["Is there a family plan?", "Halaqah plan supports group rooms. A family plan is on our roadmap."],
        ].map(([q, a]) => (
          <div key={q} style={{ background: "#002800", border: "1px solid rgba(0,165,80,0.15)", borderRadius: 10, padding: "16px 18px", marginBottom: 10 }}>
            <p style={{ color: "#ffd700", fontFamily: "Cinzel,serif", fontSize: "0.9rem", margin: "0 0 6px" }}>{q}</p>
            <p style={{ color: "#a0c8a0", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
