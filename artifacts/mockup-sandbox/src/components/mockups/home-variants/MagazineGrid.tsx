const PRAYERS = [
  { name: "Fajr", arabic: "الفجر", time: "05:12", done: true },
  { name: "Dhuhr", arabic: "الظهر", time: "13:08", done: true },
  { name: "Asr", arabic: "العصر", time: "16:45", done: false, next: true },
  { name: "Maghrib", arabic: "المغرب", time: "19:32", done: false },
  { name: "Isha", arabic: "العشاء", time: "21:05", done: false },
];

export function MagazineGrid() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#050f05",
      color: "#e8f5e8",
      fontFamily: "system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Amiri:wght@400;700&display=swap');
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .mag-card { animation: fadeSlideUp 0.5s ease forwards; }
        .mag-card:nth-child(2) { animation-delay: 0.1s; }
        .mag-card:nth-child(3) { animation-delay: 0.2s; }
        .gold-bar { background: linear-gradient(90deg, #ffd700, #ffaa00); }
      `}</style>

      {/* Bold header strip */}
      <div style={{
        background: "linear-gradient(135deg, #001a00 0%, #002800 100%)",
        padding: "16px 20px 20px",
        borderBottom: "3px solid #ffd700",
        position: "relative", overflow: "hidden",
      }}>
        {/* Big background text */}
        <div style={{
          position: "absolute", right: -10, top: -8,
          fontFamily: "Cinzel, serif", fontSize: 100, fontWeight: 900,
          color: "rgba(255,215,0,0.04)", lineHeight: 1, userSelect: "none",
          letterSpacing: -4,
        }}>نور</div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 3, textTransform: "uppercase", marginBottom: 2 }}>Saturday · 10 May 2026</p>
              <p style={{ fontSize: 10, color: "#00a550", letterSpacing: 2, textTransform: "uppercase" }}>12 Dhul Qa'dah 1446</p>
            </div>
            <div style={{
              background: "#ffd700", color: "#001a00",
              borderRadius: 6, padding: "4px 10px",
              fontFamily: "Cinzel, serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
            }}>
              NOOR
            </div>
          </div>
          <h1 style={{
            fontFamily: "Cinzel, serif", fontSize: 28, fontWeight: 900,
            color: "#ffd700", margin: 0, lineHeight: 1.1, letterSpacing: -0.5,
          }}>
            As-salamu<br />alaykum, Ahmed
          </h1>
          <div style={{ fontFamily: "Amiri, serif", fontSize: 20, color: "rgba(255,215,0,0.6)", marginTop: 4, direction: "rtl" }}>
            السَّلامُ عَلَيكُم
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div style={{ padding: "12px 12px 100px" }}>

        {/* NEXT PRAYER — hero tile */}
        <div className="mag-card" style={{
          background: "#00a550",
          borderRadius: 16, padding: "18px 20px",
          marginBottom: 10, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: -20, top: -20,
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 10, color: "rgba(0,26,0,0.7)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Next Prayer</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "Cinzel, serif", fontSize: 30, fontWeight: 700, color: "#001a00" }}>Asr</span>
                <span style={{ fontFamily: "Amiri, serif", fontSize: 22, color: "rgba(0,26,0,0.7)" }}>العصر</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#001a00", fontVariantNumeric: "tabular-nums" }}>16:45</p>
              <p style={{ fontSize: 12, color: "rgba(0,26,0,0.6)", marginTop: 2 }}>in 1h 23m</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 44 }}>🕌</div>
              <div style={{
                marginTop: 8, background: "rgba(0,26,0,0.15)", borderRadius: 8,
                padding: "4px 10px", fontSize: 11, color: "#001a00", fontWeight: 700,
              }}>
                Log Salah →
              </div>
            </div>
          </div>
        </div>

        {/* 2-col row: Streak + AI */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {/* Streak */}
          <div className="mag-card" style={{
            background: "#001a00", border: "1px solid #ffd700",
            borderRadius: 16, padding: "14px",
          }}>
            <p style={{ fontSize: 10, color: "#ffd700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Streak</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: "Cinzel, serif", fontSize: 40, color: "#ffd700", fontWeight: 700, lineHeight: 1 }}>12</span>
              <span style={{ fontSize: 10, color: "#4a7a4a" }}>days</span>
            </div>
            <span style={{ fontSize: 20 }}>🔥</span>
            <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
              {[...Array(7)].map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i < 5 ? "#ffd700" : "rgba(255,255,255,0.08)"
                }} />
              ))}
            </div>
            <p style={{ fontSize: 10, color: "#4a7a4a", marginTop: 4 }}>5/7 this week</p>
          </div>

          {/* Noor AI card */}
          <div className="mag-card" style={{
            background: "linear-gradient(135deg, #001400, #000d00)",
            border: "1px solid rgba(0,165,80,0.3)",
            borderRadius: 16, padding: "14px",
            display: "flex", flexDirection: "column" as const, justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: 10, color: "#00a550", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Noor AI</p>
              <p style={{ fontSize: 12, color: "rgba(232,245,232,0.7)", lineHeight: 1.4 }}>
                Ask me anything Islamic — duas, fiqh, stories…
              </p>
            </div>
            <div style={{
              marginTop: 12, background: "#00a550", borderRadius: 8,
              padding: "6px 10px", fontSize: 11, color: "#001a00", fontWeight: 700,
              textAlign: "center" as const,
            }}>
              Chat →
            </div>
          </div>
        </div>

        {/* Prayer times — magazine list */}
        <div className="mag-card" style={{
          background: "#001400", border: "1px solid rgba(0,165,80,0.15)",
          borderRadius: 16, padding: "14px 16px", marginBottom: 10,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontFamily: "Cinzel, serif", fontSize: 14, color: "#ffd700", fontWeight: 700 }}>Today's Salah</p>
            <p style={{ fontSize: 10, color: "#00a550" }}>View all →</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
            {PRAYERS.map((p, i) => (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: p.next ? "9px 16px" : "9px 0",
                margin: p.next ? "0 -16px" : undefined,
                borderTop: i > 0 ? "1px solid rgba(0,165,80,0.08)" : "none",
                background: p.next ? "rgba(0,165,80,0.05)" : "transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {p.next && <div style={{ width: 3, height: 24, background: "#00a550", borderRadius: 2 }} />}
                  <span style={{ fontFamily: "Amiri, serif", fontSize: 16, color: p.next ? "#ffd700" : p.done ? "#4a7a4a" : "#e8f5e8" }}>{p.arabic}</span>
                  <span style={{ fontSize: 11, color: p.next ? "#00a550" : "#4a7a4a" }}>{p.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 13, color: p.next ? "#ffd700" : p.done ? "#4a7a4a" : "#e8f5e8" }}>{p.time}</span>
                  {p.done && <span style={{ color: "#00a550", fontSize: 14 }}>✓</span>}
                  {p.next && <span style={{ background: "#00a550", borderRadius: 6, padding: "2px 6px", fontSize: 9, color: "#001a00", fontWeight: 700 }}>NEXT</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hadith full-width */}
        <div className="mag-card" style={{
          background: "linear-gradient(135deg, #0a0800 0%, #001400 100%)",
          border: "1px solid rgba(255,215,0,0.15)",
          borderRadius: 16, padding: "16px", marginBottom: 10,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{
              width: 3, flexShrink: 0, alignSelf: "stretch",
              background: "linear-gradient(180deg, #ffd700, #ffaa00)",
              borderRadius: 2,
            }} />
            <div>
              <p style={{ fontSize: 10, color: "#ffd700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Hadith of the Day</p>
              <p style={{ fontSize: 13, color: "#e8f5e8", lineHeight: 1.6, fontStyle: "italic" }}>
                "Make things easy, do not make them difficult. Give good news and do not drive people away."
              </p>
              <p style={{ fontSize: 11, color: "#00a550", marginTop: 6 }}>— Bukhari & Muslim</p>
            </div>
          </div>
        </div>

        {/* Bottom tools strip */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {[
            { icon: "📖", label: "Quran" }, { icon: "🧭", label: "Qibla" },
            { icon: "📿", label: "Tasbih" }, { icon: "🤲", label: "Duas" },
            { icon: "🕌", label: "Masjid" }, { icon: "📊", label: "Zakat" },
          ].map(t => (
            <div key={t.label} style={{
              flexShrink: 0, width: 64, background: "#001400",
              border: "1px solid rgba(0,165,80,0.15)",
              borderRadius: 14, padding: "10px 6px", textAlign: "center" as const,
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
              <p style={{ fontSize: 9, color: "#4a7a4a", fontWeight: 600 }}>{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
