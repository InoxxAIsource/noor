import { useState, useEffect } from "react";

const PRAYERS = [
  { name: "Fajr", arabic: "الفجر", time: "05:12", done: true },
  { name: "Dhuhr", arabic: "الظهر", time: "13:08", done: true },
  { name: "Asr", arabic: "العصر", time: "16:45", done: false, next: true },
  { name: "Maghrib", arabic: "المغرب", time: "19:32", done: false },
  { name: "Isha", arabic: "العشاء", time: "21:05", done: false },
];

const TOOLS = [
  { icon: "📖", label: "Quran" },
  { icon: "🧭", label: "Qibla" },
  { icon: "📿", label: "Tasbih" },
  { icon: "🤲", label: "Duas" },
  { icon: "🕌", label: "Masjid" },
  { icon: "📊", label: "Zakat" },
];

export function ImmersiveDark() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: (i * 37 + 13) % 100,
    y: (i * 53 + 7) % 100,
    size: i % 3 === 0 ? 2 : 1,
    delay: i * 0.3,
    dur: 3 + (i % 4) * 0.7,
  }));

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #000d00 0%, #001a00 40%, #000a0a 100%)",
      color: "#e8f5e8",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Amiri:wght@400;700&display=swap');
        @keyframes floatUp { 0%,100%{transform:translateY(0) scale(1);opacity:0.5} 50%{transform:translateY(-14px) scale(1.2);opacity:1} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(0,165,80,0.3), 0 0 60px rgba(0,165,80,0.1)} 50%{box-shadow:0 0 40px rgba(0,165,80,0.6), 0 0 100px rgba(0,165,80,0.2)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rotateGlow { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        .float-particle { animation: floatUp var(--dur) var(--delay) ease-in-out infinite; }
        .glow-card { animation: glowPulse 3s ease-in-out infinite; }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #ffd700 0%, #fffacd 30%, #ffd700 60%, #ffaa00 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Floating particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {particles.map((p, i) => (
          <div key={i} className="float-particle" style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: i % 4 === 0 ? "#ffd700" : "#00a550",
            opacity: 0.4,
            "--dur": `${p.dur}s`,
            "--delay": `${p.delay}s`,
          } as React.CSSProperties} />
        ))}
        {/* Radial green aura */}
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(0,165,80,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Islamic geometric background pattern */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300a550' fill-opacity='1'%3E%3Cpath d='M30 0L37.5 15L54 7.5L46.5 24L60 30L46.5 36L54 52.5L37.5 45L30 60L22.5 45L6 52.5L13.5 36L0 30L13.5 24L6 7.5L22.5 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Status bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 20px 0",
          fontSize: 12, color: "rgba(232,245,232,0.5)",
        }}>
          <span>{timeStr}</span>
          <span style={{ color: "#00a550", fontWeight: 600, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Noor</span>
          <span>🔋 94%</span>
        </div>

        {/* Hero greeting section */}
        <div style={{ padding: "20px 24px 0", textAlign: "center" }} className="fade-in">
          {/* Hijri date pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(0,165,80,0.12)", border: "1px solid rgba(0,165,80,0.25)",
            borderRadius: 20, padding: "5px 14px", marginBottom: 16,
            fontSize: 11, color: "#00a550", letterSpacing: 1, textTransform: "uppercase",
          }}>
            <span style={{ fontSize: 14 }}>🌙</span>
            <span>12 Dhul Qa'dah 1446</span>
          </div>

          {/* Arabic greeting */}
          <div style={{
            fontFamily: "Amiri, serif", fontSize: 32, color: "#ffd700",
            direction: "rtl", marginBottom: 4, lineHeight: 1.3,
          }}>
            السَّلامُ عَلَيكُم
          </div>
          <h1 className="shimmer-text" style={{
            fontFamily: "Cinzel, serif", fontSize: 22, fontWeight: 700,
            margin: "0 0 4px", letterSpacing: 1,
          }}>
            Welcome back, Ahmed
          </h1>
          <p style={{ color: "rgba(232,245,232,0.45)", fontSize: 13, margin: "0 0 20px" }}>
            Saturday, 10 May 2026
          </p>

          {/* Live clock ring */}
          <div style={{
            position: "relative", width: 120, height: 120,
            margin: "0 auto 24px",
          }}>
            <svg viewBox="0 0 120 120" width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={60} cy={60} r={52} fill="none" stroke="rgba(0,165,80,0.1)" strokeWidth={4} />
              <circle cx={60} cy={60} r={52} fill="none" stroke="#00a550" strokeWidth={4}
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - (now.getHours() * 60 + now.getMinutes()) / 1440)}`}
                strokeLinecap="round" />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: 22, color: "#ffd700", fontWeight: 700 }}>{timeStr}</span>
              <span style={{ fontSize: 10, color: "#4a7a4a", marginTop: 2 }}>LOCAL TIME</span>
            </div>
          </div>
        </div>

        {/* Next prayer glowing card */}
        <div style={{ padding: "0 16px 16px" }}>
          <div className="glow-card" style={{
            background: "linear-gradient(135deg, rgba(0,60,20,0.9) 0%, rgba(0,30,10,0.95) 100%)",
            border: "1px solid rgba(0,165,80,0.4)",
            borderRadius: 20, padding: "18px 20px",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Next Prayer</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontFamily: "Amiri, serif", fontSize: 28, color: "#ffd700", direction: "rtl" }}>العصر</span>
                  <span style={{ fontFamily: "Cinzel, serif", fontSize: 16, color: "#00a550" }}>Asr</span>
                </div>
                <p style={{ fontSize: 11, color: "#4a7a4a", marginTop: 2 }}>in 1h 23m · 16:45</p>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #00a550, #005a28)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
              }}>
                🕌
              </div>
            </div>
          </div>
        </div>

        {/* Prayer row pills */}
        <div style={{ padding: "0 16px 16px", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            {PRAYERS.map(p => (
              <div key={p.name} style={{
                flexShrink: 0,
                background: p.next
                  ? "linear-gradient(135deg, rgba(0,165,80,0.3), rgba(0,165,80,0.1))"
                  : p.done ? "rgba(0,165,80,0.08)" : "rgba(255,255,255,0.04)",
                border: p.next ? "1px solid rgba(0,165,80,0.6)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "8px 12px", textAlign: "center", minWidth: 62,
              }}>
                <p style={{ fontFamily: "Amiri, serif", fontSize: 13, color: p.next ? "#ffd700" : p.done ? "#00a550" : "#4a7a4a", marginBottom: 2 }}>{p.arabic}</p>
                <p style={{ fontSize: 10, color: p.next ? "#e8f5e8" : "#4a7a4a" }}>{p.time}</p>
                {p.done && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00a550", margin: "3px auto 0" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Streak + Hadith row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px 16px" }}>
          {/* Streak */}
          <div style={{
            background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: 18, padding: "14px 12px",
          }}>
            <p style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Streak</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: 32, color: "#ffd700", lineHeight: 1 }}>12</span>
              <span style={{ fontSize: 11, color: "#4a7a4a" }}>days 🔥</span>
            </div>
            <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
              {[...Array(7)].map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < 5 ? "#00a550" : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </div>

          {/* Hadith */}
          <div style={{
            background: "rgba(0,165,80,0.06)", border: "1px solid rgba(0,165,80,0.15)",
            borderRadius: 18, padding: "14px 12px",
          }}>
            <p style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Hadith</p>
            <p style={{ fontSize: 11, color: "#a0c8a0", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
              "The best of people are those most beneficial to others.", Prophet ﷺ
            </p>
          </div>
        </div>

        {/* Quick dhikr row */}
        <div style={{ padding: "0 16px 16px" }}>
          <p style={{ fontFamily: "Cinzel, serif", fontSize: 12, color: "#4a7a4a", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Quick Dhikr</p>
          <div style={{ display: "flex", gap: 8 }}>
            {["SubhanAllah", "Alhamdulillah", "Allahu Akbar"].map(d => (
              <div key={d} style={{
                flex: 1, background: "rgba(0,165,80,0.08)", border: "1px solid rgba(0,165,80,0.2)",
                borderRadius: 12, padding: "10px 8px", textAlign: "center",
                fontSize: 10, color: "#00a550", fontWeight: 600,
              }}>{d}</div>
            ))}
          </div>
        </div>

        {/* Islamic tools grid */}
        <div style={{ padding: "0 16px 32px" }}>
          <p style={{ fontFamily: "Cinzel, serif", fontSize: 12, color: "#4a7a4a", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Islamic Tools</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {TOOLS.map(t => (
              <div key={t.label} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,165,80,0.12)",
                borderRadius: 16, padding: "14px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                <p style={{ fontSize: 10, color: "#4a7a4a", fontWeight: 600 }}>{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
