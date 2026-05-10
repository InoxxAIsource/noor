const PRAYERS = [
  { name: "Fajr", arabic: "الفجر", time: "05:12", done: true },
  { name: "Dhuhr", arabic: "الظهر", time: "13:08", done: true },
  { name: "Asr", arabic: "العصر", time: "16:45", done: false, next: true },
  { name: "Maghrib", arabic: "المغرب", time: "19:32", done: false },
  { name: "Isha", arabic: "العشاء", time: "21:05", done: false },
];

export function MinimalSacred() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#001a00",
      color: "#c8e6c8",
      fontFamily: "system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Amiri:wght@400&display=swap');
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.05);opacity:1} }
        @keyframes rise { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .rise { animation: rise 0.6s ease-out forwards; }
        .rise-2 { animation: rise 0.6s 0.15s ease-out forwards; opacity:0; }
        .rise-3 { animation: rise 0.6s 0.3s ease-out forwards; opacity:0; }
        .breathe-ring { animation: breathe 4s ease-in-out infinite; }
      `}</style>

      {/* Subtle top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 24px",
        borderBottom: "1px solid rgba(0,165,80,0.08)",
      }}>
        <div style={{
          fontFamily: "Cinzel, serif", fontSize: 11, letterSpacing: 3,
          color: "rgba(200,230,200,0.4)", textTransform: "uppercase",
        }}>نور · Noor</div>
        <div style={{ fontSize: 11, color: "rgba(200,230,200,0.3)" }}>16:45 local</div>
      </div>

      <div style={{ padding: "32px 24px 24px" }}>

        {/* Greeting — minimal */}
        <div className="rise" style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, color: "rgba(200,230,200,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
            Saturday, 10 May 2026 · 12 Dhul Qa'dah
          </p>
          <h1 style={{
            fontFamily: "Cinzel, serif", fontSize: 26, fontWeight: 600,
            color: "#ffd700", margin: "0 0 6px", letterSpacing: 0.5,
          }}>
            Peace be upon you,<br />Ahmed
          </h1>
          <div style={{ fontFamily: "Amiri, serif", fontSize: 20, color: "rgba(255,215,0,0.4)", direction: "rtl" }}>
            السَّلامُ عَلَيكُم وَرَحْمَةُ اللَّه
          </div>
        </div>

        {/* Moon + next prayer — centered, breathing */}
        <div className="rise-2" style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="breathe-ring" style={{
            display: "inline-flex", flexDirection: "column" as const, alignItems: "center",
            justifyContent: "center",
            width: 140, height: 140, borderRadius: "50%",
            border: "1px solid rgba(0,165,80,0.2)",
            boxShadow: "0 0 0 24px rgba(0,165,80,0.04), 0 0 0 48px rgba(0,165,80,0.02)",
            marginBottom: 16,
          }}>
            <svg viewBox="0 0 60 60" width={52} height={52}>
              <path d="M30 6 A24 24 0 1 1 30 54 A16 16 0 1 0 30 6 Z" fill="#ffd700" opacity="0.85" />
            </svg>
          </div>
          <p style={{ fontSize: 11, color: "rgba(200,230,200,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Next Prayer</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontFamily: "Cinzel, serif", fontSize: 24, color: "#e8f5e8", fontWeight: 600 }}>Asr</span>
            <span style={{ color: "rgba(200,230,200,0.3)" }}>·</span>
            <span style={{ fontFamily: "Amiri, serif", fontSize: 22, color: "#ffd700" }}>العصر</span>
          </div>
          <p style={{ fontVariantNumeric: "tabular-nums", fontSize: 20, color: "#00a550", marginTop: 4, fontWeight: 300 }}>16:45 <span style={{ fontSize: 12, color: "rgba(200,230,200,0.4)" }}>in 1h 23m</span></p>
        </div>

        {/* Thin divider */}
        <div style={{ height: 1, background: "rgba(0,165,80,0.1)", marginBottom: 28 }} />

        {/* Prayer list — stripped minimal */}
        <div className="rise-3" style={{ marginBottom: 28 }}>
          {PRAYERS.map((p, i) => (
            <div key={p.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < PRAYERS.length - 1 ? "1px solid rgba(0,165,80,0.06)" : "none",
              opacity: p.done ? 0.4 : 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {p.next
                  ? <div style={{ width: 2, height: 16, background: "#00a550", borderRadius: 1 }} />
                  : <div style={{ width: 2, height: 16 }} />
                }
                <span style={{ fontFamily: "Amiri, serif", fontSize: 17, color: p.next ? "#ffd700" : "#c8e6c8" }}>{p.arabic}</span>
                <span style={{ fontSize: 12, color: p.next ? "#00a550" : "rgba(200,230,200,0.4)" }}>{p.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontVariantNumeric: "tabular-nums", fontSize: 13,
                  color: p.next ? "#e8f5e8" : "rgba(200,230,200,0.5)",
                  fontWeight: p.next ? 600 : 400,
                }}>{p.time}</span>
                {p.done && <span style={{ color: "#00a550", fontSize: 12 }}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Thin divider */}
        <div style={{ height: 1, background: "rgba(0,165,80,0.08)", marginBottom: 24 }} />

        {/* Streak — text-first minimal */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 10, color: "rgba(200,230,200,0.35)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Prayer Streak</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: 36, color: "#ffd700", fontWeight: 600 }}>12</span>
              <span style={{ fontSize: 12, color: "rgba(200,230,200,0.4)" }}>days · 🔥</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: i < 5 ? "#00a550" : "rgba(0,165,80,0.12)",
              }} />
            ))}
          </div>
        </div>

        {/* Dua card — quiet */}
        <div style={{
          border: "1px solid rgba(0,165,80,0.12)",
          borderRadius: 16, padding: "18px 20px", marginBottom: 24,
        }}>
          <p style={{ fontSize: 10, color: "rgba(200,230,200,0.35)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Dua of the Day</p>
          <p style={{ fontFamily: "Amiri, serif", fontSize: 18, color: "#ffd700", direction: "rtl", textAlign: "right" as const, marginBottom: 6, lineHeight: 1.6 }}>
            رَبِّ زِدْنِي عِلْمًا
          </p>
          <p style={{ fontSize: 12, color: "rgba(200,230,200,0.5)", fontStyle: "italic", marginBottom: 4 }}>Rabbi zidni 'ilma</p>
          <p style={{ fontSize: 12, color: "rgba(200,230,200,0.6)" }}>My Lord, increase me in knowledge.</p>
        </div>

        {/* Tools — list style */}
        <p style={{ fontSize: 10, color: "rgba(200,230,200,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Tools</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          {[
            { icon: "📖", label: "Quran Reader" },
            { icon: "🧭", label: "Qibla Compass" },
            { icon: "📿", label: "Tasbih" },
            { icon: "🤲", label: "Duas Library" },
            { icon: "🕌", label: "Masjid Finder" },
            { icon: "📊", label: "Zakat Calculator" },
          ].map((t, i) => (
            <div key={t.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 10px",
              borderBottom: i < 4 ? "1px solid rgba(0,165,80,0.06)" : "none",
              borderRight: i % 2 === 0 ? "1px solid rgba(0,165,80,0.06)" : "none",
            }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ fontSize: 12, color: "rgba(200,230,200,0.6)" }}>{t.label}</span>
              <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(0,165,80,0.4)" }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
