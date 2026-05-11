import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const FEATURES = [
  { icon: "🕌", title: "Prayer Times", desc: "Live salah times for your city, every day" },
  { icon: "📿", title: "Tasbih & Dhikr", desc: "Digital counter with guided dhikr sessions" },
  { icon: "📖", title: "Quran Reader", desc: "All 114 surahs with audio and translation" },
  { icon: "🤲", title: "Duas Library", desc: "Curated duas for every moment in life" },
  { icon: "🧭", title: "Qibla Compass", desc: "Find the direction of Makkah instantly" },
  { icon: "🌙", title: "Islamic Calendar", desc: "Hijri dates and all major Islamic events" },
];

const TICKER = [
  "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
  "سُبْحَانَ اللَّهِ",
  "اَلْحَمْدُ لِلَّهِ",
  "اللَّهُ أَكْبَرُ",
  "لَا إِلَهَ إِلَّا اللَّهُ",
];

export default function LandingPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tickerIdx, setTickerIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  // If already logged in, go straight to the app
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      void navigate("/home", { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  // Arabic ticker animation
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % TICKER.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#001a00", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#00a550", fontFamily: "Cinzel, serif", fontSize: 18, letterSpacing: 4 }}>NOOR</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#001a00", color: "#e8f5e8", fontFamily: "system-ui, sans-serif", overflowX: "hidden" }}>

      {/* Top nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "0.5px solid rgba(0,165,80,0.15)" }}>
        <div style={{ fontFamily: "Cinzel, serif", fontSize: 20, fontWeight: 700, color: "#00a550", letterSpacing: 4 }}>NOOR</div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => void navigate("/login")}
            style={{ background: "transparent", border: "0.5px solid rgba(0,165,80,0.4)", color: "#00a550", borderRadius: 8, padding: "7px 18px", fontSize: 13, cursor: "pointer" }}
          >
            Sign In
          </button>
          <button
            onClick={() => void navigate("/register")}
            style={{ background: "#00a550", border: "none", color: "#001a00", borderRadius: 8, padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "56px 24px 40px" }}>
        {/* Arabic ticker */}
        <div style={{
          fontFamily: "Amiri, serif", fontSize: 28, color: "#ffd700", direction: "rtl",
          marginBottom: 24, minHeight: 42,
          opacity: visible ? 1 : 0, transition: "opacity 0.4s ease",
        }}>
          {TICKER[tickerIdx]}
        </div>

        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "clamp(28px, 7vw, 48px)", fontWeight: 700, color: "#e8f5e8", margin: "0 0 14px", lineHeight: 1.2 }}>
          Remember Allah.<br />
          <span style={{ color: "#00a550" }}>Every day.</span>
        </h1>
        <p style={{ fontSize: 16, color: "#4a7a4a", maxWidth: 360, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Your personal Islamic companion for prayer, dhikr, Quran, and spiritual growth.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <button
            onClick={() => void navigate("/register")}
            style={{
              background: "#00a550", border: "none", color: "#001a00",
              borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 0 24px rgba(0,165,80,0.3)",
            }}
          >
            Start for Free
          </button>
          <button
            onClick={() => void navigate("/login")}
            style={{
              background: "rgba(0,165,80,0.1)", border: "0.5px solid rgba(0,165,80,0.3)",
              color: "#00a550", borderRadius: 12, padding: "14px 32px",
              fontSize: 15, cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#2a4a2a" }}>Free forever · No credit card needed</p>
      </div>

      {/* Crescent divider */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <svg width="50" height="50" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="rgba(0,165,80,0.06)" />
          <path d="M38 10 A20 20 0 1 1 38 50 A14 14 0 1 0 38 10Z" fill="#00a550" opacity="0.7" />
          <circle cx="42" cy="16" r="2" fill="#ffd700" opacity="0.8" />
          <circle cx="48" cy="22" r="1.2" fill="#ffd700" opacity="0.6" />
        </svg>
      </div>

      {/* Features grid */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 48px" }}>
        <h2 style={{ textAlign: "center", fontFamily: "Cinzel, serif", fontSize: 18, color: "#e8f5e8", marginBottom: 24, letterSpacing: 1 }}>
          Everything you need
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: "rgba(0,165,80,0.06)", border: "0.5px solid rgba(0,165,80,0.18)",
              borderRadius: 12, padding: "16px 14px",
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e8f5e8", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: "#4a7a4a", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        background: "rgba(0,165,80,0.07)", borderTop: "0.5px solid rgba(0,165,80,0.15)",
        borderBottom: "0.5px solid rgba(0,165,80,0.15)", padding: "40px 24px", textAlign: "center",
      }}>
        <div style={{ fontFamily: "Amiri, serif", fontSize: 22, color: "#ffd700", marginBottom: 12, direction: "rtl" }}>
          وَاذْكُرُوا اللَّهَ كَثِيرًا
        </div>
        <p style={{ fontSize: 13, color: "#4a7a4a", marginBottom: 24 }}>
          "And remember Allah often" — Quran 62:10
        </p>
        <button
          onClick={() => void navigate("/register")}
          style={{
            background: "#00a550", border: "none", color: "#001a00",
            borderRadius: 12, padding: "14px 40px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 0 20px rgba(0,165,80,0.25)",
          }}
        >
          Begin your journey →
        </button>
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 24px", textAlign: "center", color: "#2a4a2a", fontSize: 11 }}>
        <span style={{ fontFamily: "Cinzel, serif", color: "#00a550", marginRight: 8 }}>NOOR</span>
        Islamic Prayer & Spirituality App · Free to use
      </div>
    </div>
  );
}
