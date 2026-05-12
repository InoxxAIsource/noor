import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const FEATURES = [
  { icon: "✦", title: "AI Islamic Guide", desc: "Ask anything. Get answers grounded in Quran and Sunnah." },
  { icon: "📖", title: "Quran Reflections", desc: "All 114 surahs with audio, translation, and guided reflection." },
  { icon: "📿", title: "Azkar & Dhikr", desc: "35+ guided audio sessions for morning, evening, sleep, and salah." },
  { icon: "🤲", title: "Duas Library", desc: "110+ authentic duas for every moment — Morning to night." },
  { icon: "🕌", title: "Prayer Times", desc: "Live salah times for your city, with streak tracking." },
  { icon: "🌙", title: "Growth Journey", desc: "Habits, streaks, journal and spiritual milestones." },
];

const VERSES = [
  { arabic: "اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا", translation: "Remember Allah with much remembrance — Quran 33:41" },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", translation: "And whoever fears Allah — He will make a way out for him — Quran 65:2" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Verily, in the remembrance of Allah hearts find rest — Quran 13:28" },
];

const SESSIONS = [
  { label: "Morning Azkar", duration: "7 min", tag: "AZKAR" },
  { label: "Surah Al-Mulk Reflection", duration: "12 min", tag: "QURAN" },
  { label: "Sleep with Ayatul Kursi", duration: "9 min", tag: "SLEEP" },
  { label: "Healing Through Sujood", duration: "10 min", tag: "HEALING" },
];

export default function LandingPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [verseIdx, setVerseIdx] = useState(0);
  const [verseVisible, setVerseVisible] = useState(true);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      void navigate("/home", { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  useEffect(() => {
    const id = setInterval(() => {
      setVerseVisible(false);
      setTimeout(() => {
        setVerseIdx(i => (i + 1) % VERSES.length);
        setVerseVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d1411", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(52,201,122,0.3)", borderTop: "2px solid #34c97a", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ color: "#34c97a", fontFamily: "Inter, sans-serif", fontSize: 13, letterSpacing: 2, fontWeight: 600 }}>MYTAZKI</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const verse = VERSES[verseIdx]!;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1411", color: "#eaf4ee", fontFamily: "Inter, DM Sans, system-ui, sans-serif", overflowX: "hidden" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 24px", borderBottom: "1px solid rgba(52,201,122,0.08)",
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,20,17,0.92)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
            <rect width="180" height="180" rx="38" fill="#152019"/>
            <circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.9"/>
            <circle cx="112" cy="78" r="46" fill="#152019"/>
            <circle cx="130" cy="58" r="6" fill="#34c97a"/>
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#34c97a" }}>My</span>
            <span style={{ color: "#eaf4ee" }}>Tazki</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => void navigate("/login")}
            style={{ background: "transparent", border: "1px solid rgba(52,201,122,0.25)", color: "#6a9878", borderRadius: 10, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
          >
            Sign In
          </button>
          <button
            onClick={() => void navigate("/register")}
            style={{ background: "#34c97a", border: "none", color: "#0d1411", borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 64px", maxWidth: 680, margin: "0 auto" }}>
        {/* Rotating Arabic verse */}
        <div style={{
          opacity: verseVisible ? 1 : 0, transition: "opacity 0.5s ease",
          marginBottom: 36, minHeight: 72,
        }}>
          <div style={{ fontFamily: "Amiri, serif", fontSize: 26, color: "#34c97a", direction: "rtl", marginBottom: 8, lineHeight: 1.5 }}>
            {verse.arabic}
          </div>
          <div style={{ fontSize: 12, color: "#4a6858", fontStyle: "italic", letterSpacing: 0.3 }}>
            {verse.translation}
          </div>
        </div>

        <h1 style={{
          fontFamily: "DM Sans, Inter, sans-serif",
          fontSize: "clamp(36px, 8vw, 62px)",
          fontWeight: 800,
          color: "#eaf4ee",
          margin: "0 0 20px",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}>
          Grow Spiritually<br />
          <span style={{ color: "#34c97a" }}>Every Day.</span>
        </h1>

        <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", color: "#6a9878", maxWidth: 500, margin: "0 auto 44px", lineHeight: 1.75, fontWeight: 400 }}>
          Guided Quran reflections, Azkar, Duas, and AI-powered Islamic growth journeys designed for modern Muslims.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => void navigate("/register")}
            style={{
              background: "#34c97a", border: "none", color: "#0d1411",
              borderRadius: 14, padding: "16px 36px", fontSize: 16, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em",
              boxShadow: "0 0 32px rgba(52,201,122,0.25)",
            }}
          >
            Start Your Journey
          </button>
          <button
            onClick={() => void navigate("/login")}
            style={{
              background: "rgba(52,201,122,0.08)", border: "1px solid rgba(52,201,122,0.2)",
              color: "#34c97a", borderRadius: 14, padding: "16px 36px",
              fontSize: 16, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Explore Sessions
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#2a3830", marginTop: 16 }}>Free forever · No credit card · Works on any device</p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(52,201,122,0.12), transparent)", margin: "0 24px" }} />

      {/* Features Grid */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "72px 24px" }}>
        <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#34c97a", textTransform: "uppercase", marginBottom: 16 }}>
          Everything you need
        </p>
        <h2 style={{ textAlign: "center", fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "#eaf4ee", marginBottom: 40, letterSpacing: "-0.02em" }}>
          Your complete Islamic growth companion
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: "rgba(21,32,25,0.8)", border: "1px solid rgba(52,201,122,0.1)",
              borderRadius: 16, padding: "24px 20px",
              transition: "border-color 0.2s",
            }}>
              <div style={{ fontSize: 22, marginBottom: 12, opacity: 0.9 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#eaf4ee", marginBottom: 6, letterSpacing: "-0.01em" }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "#4a6858", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sessions Preview */}
      <div style={{ background: "rgba(21,32,25,0.5)", borderTop: "1px solid rgba(52,201,122,0.08)", borderBottom: "1px solid rgba(52,201,122,0.08)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#34c97a", textTransform: "uppercase", marginBottom: 16 }}>
            Guided sessions
          </p>
          <h2 style={{ textAlign: "center", fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#eaf4ee", marginBottom: 8, letterSpacing: "-0.02em" }}>
            35+ guided audio sessions
          </h2>
          <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 40 }}>
            Azkar · Quran · Dhikr · Sleep · Healing · Salah
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SESSIONS.map(s => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(13,20,17,0.7)", border: "1px solid rgba(52,201,122,0.1)",
                borderRadius: 14, padding: "16px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(52,201,122,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "12px solid #34c97a", marginLeft: 3 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#eaf4ee" }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#4a6858", marginTop: 2 }}>{s.duration}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#34c97a", background: "rgba(52,201,122,0.1)", padding: "3px 8px", borderRadius: 6 }}>
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#4a6858", marginTop: 20 }}>
            + many more inside the app
          </p>
        </div>
      </div>

      {/* AI Companion Section */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "rgba(52,201,122,0.1)",
          border: "1px solid rgba(52,201,122,0.2)", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 24px", fontSize: 28,
        }}>
          ✦
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#34c97a", textTransform: "uppercase", marginBottom: 16 }}>
          AI companion
        </p>
        <h2 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: "#eaf4ee", marginBottom: 16, letterSpacing: "-0.02em" }}>
          Your personal Islamic guide, available 24/7
        </h2>
        <p style={{ fontSize: 15, color: "#4a6858", lineHeight: 1.75, marginBottom: 32 }}>
          Ask about fiqh, Sunnah, Arabic words, spiritual struggles, or anything Islamic.
          MyTazki AI responds with wisdom grounded in Quran and Sunnah.
        </p>
        <div style={{
          background: "rgba(21,32,25,0.8)", border: "1px solid rgba(52,201,122,0.12)",
          borderRadius: 16, padding: "20px 24px", textAlign: "left",
        }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(52,201,122,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🙋</div>
            <div style={{ background: "rgba(52,201,122,0.07)", borderRadius: "0 12px 12px 12px", padding: "10px 14px", fontSize: 13, color: "#6a9878", flexGrow: 1 }}>
              What is the best time to make dua?
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <div style={{ background: "rgba(52,201,122,0.1)", borderRadius: "12px 0 12px 12px", padding: "10px 14px", fontSize: 13, color: "#34c97a", maxWidth: "80%", lineHeight: 1.6 }}>
              The last third of the night (Tahajjud time) is one of the most blessed times for dua. The Prophet ﷺ said: "Our Lord descends every night..." (Bukhari & Muslim)
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(52,201,122,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✦</div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        background: "linear-gradient(180deg, #0d1411 0%, #101a15 50%, #0d1411 100%)",
        borderTop: "1px solid rgba(52,201,122,0.08)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontFamily: "Amiri, serif", fontSize: 28, color: "#34c97a", direction: "rtl", marginBottom: 16, opacity: 0.8 }}>
          وَاذْكُرُوا اللَّهَ كَثِيرًا
        </div>
        <p style={{ fontSize: 13, color: "#4a6858", marginBottom: 36 }}>
          "And remember Allah often" — Quran 62:10
        </p>
        <h2 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, color: "#eaf4ee", marginBottom: 12, letterSpacing: "-0.02em" }}>
          Begin your growth journey today.
        </h2>
        <p style={{ color: "#4a6858", fontSize: 14, marginBottom: 36 }}>Join thousands of Muslims building better spiritual habits.</p>
        <button
          onClick={() => void navigate("/register")}
          style={{
            background: "#34c97a", border: "none", color: "#0d1411",
            borderRadius: 14, padding: "16px 48px", fontSize: 16, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 40px rgba(52,201,122,0.2)",
          }}
        >
          Start Your Journey →
        </button>
        <p style={{ fontSize: 12, color: "#2a3830", marginTop: 16 }}>Free forever · No ads · No subscription</p>
      </div>

      {/* Footer */}
      <div style={{ padding: "24px", textAlign: "center", borderTop: "1px solid rgba(52,201,122,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <svg width="18" height="18" viewBox="0 0 180 180" fill="none">
            <rect width="180" height="180" rx="38" fill="#152019"/>
            <circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.9"/>
            <circle cx="112" cy="78" r="46" fill="#152019"/>
            <circle cx="130" cy="58" r="6" fill="#34c97a"/>
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: "#34c97a" }}>My</span>
            <span style={{ color: "#4a6858" }}>Tazki</span>
          </span>
        </div>
        <p style={{ fontSize: 11, color: "#2a3830", margin: 0 }}>
          AI Islamic Companion · Grow Spiritually Every Day · Free to use
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
