const D = "de2f6393-bcd1-4102-acd6-af663b52ccb3-00-23eb5b8y7xzyh.pike.replit.dev";
const IMG = (n: string) => `https://${D}/images/${n}`;

const BG = "#110e0a";
const SURFACE = "#1d1510";
const CARD = "#261c13";
const GREEN = "#34c97a";
const GOLD = "#b8946a";
const TEXT = "#eaf4ee";
const MUTED = "#8a7a6a";
const DIM = "#4a3a2a";

// B — PRAYER TIMELINE
// Hypothesis: the day IS the information architecture.
// Not a list of features — a map of your spiritual day.
// Prayers are waypoints. Content lives between them.
// "You are here" is the anchor.

const prayers = [
  { name: "Fajr", time: "05:12", done: true },
  { name: "Dhuhr", time: "12:45", done: true },
  { name: "Asr", time: "16:20", done: true },
  { name: "Maghrib", time: "19:48", done: false, current: true },
  { name: "Isha", time: "21:15", done: false },
];

export function PrayerTimeline() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Header — compact, atmospheric */}
      <div style={{ position: "relative", height: 160, overflow: "hidden", flexShrink: 0 }}>
        <img src={IMG("man-praying-moon.png")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,14,10,0.3) 0%, rgba(17,14,10,1) 100%)" }} />
        <div style={{ position: "absolute", bottom: 16, left: 22, right: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, marginBottom: 4 }}>14 Dhul-Hijjah 1446</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "DM Sans, sans-serif" }}>Good evening, Ahmad</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: GREEN, letterSpacing: 3 }}>MYTAZKI</span>
        </div>
      </div>

      {/* Timeline body */}
      <div style={{ flex: 1, padding: "8px 22px 16px", overflowY: "auto" }}>

        {/* Section label */}
        <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 16, marginTop: 8 }}>Your day</div>

        {prayers.map((p, i) => (
          <div key={p.name}>
            {/* Prayer node */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              {/* Timeline spine */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 28 }}>
                {/* Node dot */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: p.current ? GREEN : p.done ? "rgba(52,201,122,0.3)" : DIM,
                  border: p.current ? `2px solid ${GREEN}` : `2px solid ${p.done ? "rgba(52,201,122,0.5)" : DIM}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: p.current ? `0 0 16px rgba(52,201,122,0.5)` : "none",
                  flexShrink: 0,
                }}>
                  {p.done && !p.current && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  {p.current && <div style={{ width: 8, height: 8, borderRadius: "50%", background: BG }} />}
                </div>
                {/* Spine line */}
                {i < prayers.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 32, background: p.done ? "rgba(52,201,122,0.3)" : "rgba(255,255,255,0.08)", marginTop: 2 }} />
                )}
              </div>

              {/* Prayer content */}
              <div style={{ paddingBottom: 8, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: p.current ? 12 : 4 }}>
                  <div style={{ fontSize: p.current ? 16 : 14, fontWeight: p.current ? 700 : 500, color: p.current ? TEXT : p.done ? "rgba(234,244,238,0.6)" : MUTED }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: p.current ? GOLD : MUTED, fontWeight: p.current ? 600 : 400 }}>{p.time}</div>
                </div>

                {/* Current prayer gets extra content */}
                {p.current && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: GREEN, marginBottom: 8 }}>↑ Coming up in 43 minutes</div>
                    {/* Recommended session between prayers */}
                    <div style={{ background: SURFACE, border: "1px solid rgba(52,201,122,0.15)", borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: GREEN, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Before Maghrib</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Evening Azkar</div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>5 min · Purify before prayer</div>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={BG}><polygon points="5,3 19,12 5,21"/></svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Between Asr and Maghrib — progress section */}
                {i === 2 && (
                  <div style={{ marginTop: 4, marginBottom: 4 }}>
                    <div style={{ background: CARD, borderRadius: 12, padding: "10px 12px", fontSize: 11, color: MUTED }}>
                      <span style={{ color: GREEN }}>✓ Quran</span> · Surah Al-Baqarah 3 ayahs read
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gap between nodes */}
            {i < prayers.length - 1 && <div style={{ height: i === 2 ? 0 : 4 }} />}
          </div>
        ))}

        {/* Streak at bottom */}
        <div style={{ marginTop: 20, background: SURFACE, border: "1px solid rgba(184,148,106,0.15)", borderRadius: 16, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>Consistency streak</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: GOLD, fontFamily: "DM Sans, sans-serif" }}>7 days</div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {Array(7).fill(null).map((_, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: i < 7 ? GREEN : "rgba(255,255,255,0.1)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{ textAlign: "center", padding: "0 0 16px" }}>
        <div style={{ display: "inline-block", background: "rgba(17,14,10,0.9)", border: `1px solid ${GOLD}`, borderRadius: 20, padding: "5px 14px", fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 1 }}>
          B — PRAYER TIMELINE
        </div>
        <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Day is the info architecture. You are here.</div>
      </div>
    </div>
  );
}
