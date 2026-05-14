import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

const FEATURES = [
  ["🕌", "Prayer Times", "Live Adhan times for 100+ cities"],
  ["📖", "Quran Reader", "All 114 surahs, Arabic + Alafasy audio"],
  ["🤲", "Duas Library", "200+ authentic supplications"],
  ["🧭", "Qibla Compass", "Accurate GPS direction, anywhere"],
  ["📿", "Digital Tasbih", "Beautiful counter with progress rings"],
  ["🕌", "Masjid Finder", "Nearby mosques on an interactive map"],
  ["🤖", "MyTazki AI", "Personal AI Islamic companion"],
  ["📊", "Growth Tracker", "Streaks, badges & mood journal"],
];

const INSTALL_STEPS_IOS = [
  ["Tap the", "Share", "button in Safari"],
  ["Tap", "Add to Home Screen"],
  ["Tap", "Add"],
];

const INSTALL_STEPS_ANDROID = [
  ["Tap the", "⋮", "menu in Chrome"],
  ["Select", "Install MyTazki…"],
  ["Tap", "Install"],
];

export default function DownloadPage() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") setInstalled(true);
  }

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
    await fetch(`${BASE}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setJoined(true);
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

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
      <div style={{ textAlign: "center", padding: "64px 20px 48px" }}>
        <div style={{ width: 80, height: 80, margin: "0 auto 24px", borderRadius: "50%", background: "rgba(201,164,114,0.08)", border: `1px solid ${C.bGold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.4rem" }}>
          🌙
        </div>
        <h1 style={{ fontFamily: "DM Sans, serif", fontWeight: 800, fontSize: "clamp(1.9rem, 5vw, 2.8rem)", color: C.text, margin: "0 0 14px", lineHeight: 1.15, letterSpacing: "-0.5px" }}>
          Download <span style={{ color: C.gold }}>MyTazki</span>
        </h1>
        <p style={{ color: C.muted, fontSize: "1.05rem", maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.65 }}>
          Your personal Islamic companion. Remember Allah, every day. Free forever, no ads. Available now as a PWA.
        </p>

        {/* PWA install state */}
        {installed ? (
          <div style={{ background: "rgba(52,201,122,0.08)", border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 32px", display: "inline-block" }}>
            <p style={{ color: C.green, fontWeight: 700, margin: 0, fontSize: "1.05rem" }}>✅ MyTazki is installed!</p>
            <p style={{ color: C.muted, margin: "6px 0 0", fontSize: 14 }}>Open it from your home screen</p>
          </div>
        ) : installPrompt ? (
          <button onClick={() => void handleInstall()} style={{ background: C.green, color: "#09070A", border: "none", borderRadius: 16, padding: "16px 40px", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
            📲 Install MyTazki Free →
          </button>
        ) : isIOS ? (
          <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 16, padding: 24, maxWidth: 360, margin: "0 auto", textAlign: "left", boxShadow: "0 8px 28px rgba(0,0,0,0.35)" }}>
            <p style={{ color: C.gold, fontFamily: "DM Sans, serif", fontWeight: 700, margin: "0 0 14px", fontSize: "0.95rem" }}>Install on iPhone / iPad</p>
            <ol style={{ color: C.muted, fontSize: 14, lineHeight: 2.2, padding: "0 0 0 18px", margin: 0 }}>
              {INSTALL_STEPS_IOS.map(([pre, key, post], i) => (
                <li key={i}>{pre} <strong style={{ color: C.green }}>{key}</strong>{post ? ` ${post}` : ""}</li>
              ))}
            </ol>
          </div>
        ) : (
          <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 16, padding: 24, maxWidth: 360, margin: "0 auto", textAlign: "left", boxShadow: "0 8px 28px rgba(0,0,0,0.35)" }}>
            <p style={{ color: C.gold, fontFamily: "DM Sans, serif", fontWeight: 700, margin: "0 0 14px", fontSize: "0.95rem" }}>Install in Chrome / Edge</p>
            <ol style={{ color: C.muted, fontSize: 14, lineHeight: 2.2, padding: "0 0 0 18px", margin: 0 }}>
              {INSTALL_STEPS_ANDROID.map(([pre, key, post], i) => (
                <li key={i}>{pre} <strong style={{ color: C.green }}>{key}</strong>{post ? ` ${post}` : ""}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* ── App store placeholders ── */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", padding: "0 20px 48px" }}>
        {[["🍎", "App Store", "iOS — Coming soon"], ["🤖", "Google Play", "Android — Coming soon"]].map(([icon, label, sub]) => (
          <div key={label} style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 28px", opacity: 0.55, cursor: "not-allowed", textAlign: "center", minWidth: 140 }}>
            <p style={{ fontSize: "1.5rem", margin: "0 0 4px" }}>{icon}</p>
            <p style={{ color: C.text, fontWeight: 700, margin: "0 0 2px", fontSize: 14 }}>{label}</p>
            <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Features grid ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        <h2 style={{ color: C.gold, fontFamily: "DM Sans, serif", fontWeight: 700, fontSize: "1.15rem", textAlign: "center", marginBottom: 24, letterSpacing: "0.4px" }}>Everything in one app</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {FEATURES.map(([icon, title, desc]) => (
            <div key={title} style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.6rem", flexShrink: 0, lineHeight: 1 }}>{icon}</span>
              <div>
                <p style={{ color: C.gold, fontFamily: "DM Sans, serif", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 4px" }}>{title}</p>
                <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Notify waitlist ── */}
      <div style={{ maxWidth: 460, margin: "48px auto 80px", padding: "0 20px" }}>
        <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 20, padding: 28, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
          <h2 style={{ color: C.gold, fontFamily: "DM Sans, serif", fontWeight: 700, fontSize: "1rem", margin: "0 0 8px" }}>Notify me when native apps launch</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: "0 0 20px" }}>App Store & Google Play — coming 2026. Be the first to know.</p>
          {joined ? (
            <p style={{ color: C.green, margin: 0, fontWeight: 600 }}>✅ JazakAllah! We'll let you know.</p>
          ) : (
            <form onSubmit={(e) => void joinWaitlist(e)} style={{ display: "flex", gap: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ flex: 1, background: C.faint, border: `1px solid ${C.border}`, color: C.text, borderRadius: 12, padding: "11px 14px", fontSize: 14, outline: "none", fontFamily: "inherit" }}
              />
              <button type="submit" style={{ background: C.green, color: "#09070A", border: "none", borderRadius: 12, padding: "11px 18px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                Notify me
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
