const D = "de2f6393-bcd1-4102-acd6-af663b52ccb3-00-23eb5b8y7xzyh.pike.replit.dev";
const IMG = (n: string) => `https://${D}/images/${n}`;

const BG = "#110e0a";
const SURFACE = "#1d1510";
const CARD = "#261c13";
const GREEN = "#34c97a";
const GOLD = "#b8946a";
const TEXT = "#eaf4ee";
const MUTED = "#8a7a6a";
const DIM = "#3a2a1a";

// D — DAILY WIRD (Daily Portion)
// Hypothesis: the home screen should be a satisfying spiritual planner.
// The interaction model is completion — checking off today's wird.
// Information architecture: what must be done, what has been done.
// Gamified but not gamey — like crossing off a beautiful list.

interface WirdItem { label: string; sub: string; done: boolean; type: "prayer" | "quran" | "azkar" | "dua" | "other"; }

const WIRD: WirdItem[] = [
  { label: "Fajr", sub: "Prayed on time", done: true, type: "prayer" },
  { label: "Morning Azkar", sub: "33 tasbihat · 7 min", done: true, type: "azkar" },
  { label: "Quran", sub: "Al-Baqarah · 3 of 5 pages", done: false, type: "quran" },
  { label: "Dhuhr", sub: "Prayed on time", done: true, type: "prayer" },
  { label: "Asr", sub: "Prayed on time", done: true, type: "prayer" },
  { label: "Evening Azkar", sub: "5 min · Not done yet", done: false, type: "azkar" },
  { label: "Maghrib", sub: "Coming in 43 minutes", done: false, type: "prayer" },
  { label: "Dua", sub: "Tonight's guided dua", done: false, type: "dua" },
  { label: "Isha", sub: "At 21:15", done: false, type: "prayer" },
];

const TYPE_COLORS: Record<string, string> = {
  prayer: GREEN,
  quran: GOLD,
  azkar: "#a8c4b8",
  dua: "#b8a0c8",
  other: MUTED,
};

const doneCount = WIRD.filter(w => w.done).length;
const progress = doneCount / WIRD.length;
const circumference = 2 * Math.PI * 28;

export function DailyWird() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Header strip with image */}
      <div style={{ position: "relative", height: 140, overflow: "hidden", flexShrink: 0 }}>
        <img src={IMG("quran-pages.png")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,14,10,0.5) 0%, rgba(17,14,10,1) 100%)" }} />
        <div style={{ position: "absolute", top: 20, left: 22, right: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: GREEN, letterSpacing: 3 }}>MYTAZKI</span>
          <span style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5 }}>14 Dhul-Hijjah</span>
        </div>
      </div>

      {/* Progress ring + greeting */}
      <div style={{ padding: "0 22px 16px", display: "flex", alignItems: "center", gap: 18, marginTop: -10, position: "relative", zIndex: 2 }}>
        {/* SVG ring */}
        <div style={{ flexShrink: 0, position: "relative", width: 72, height: 72 }}>
          <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="36" cy="36" r="28" fill="none" stroke={DIM} strokeWidth="5" />
            <circle
              cx="36" cy="36" r="28" fill="none"
              stroke={GREEN} strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, lineHeight: 1 }}>{doneCount}</div>
            <div style={{ fontSize: 9, color: MUTED, lineHeight: 1 }}>of {WIRD.length}</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "DM Sans, sans-serif", marginBottom: 3 }}>Ahmad's Wird</div>
          <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
            {doneCount === WIRD.length
              ? "Alhamdulillah — today complete!"
              : `${WIRD.length - doneCount} remaining · Keep going`}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {Object.entries(TYPE_COLORS).slice(0, 4).map(([type, color]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                <span style={{ fontSize: 9, color: MUTED, textTransform: "capitalize" }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Wird list */}
      <div style={{ flex: 1, padding: "0 22px 16px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>Today's wird</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {WIRD.map((item, i) => {
            const isCurrent = !item.done && WIRD.slice(0, i).every(w => w.done);
            const color = TYPE_COLORS[item.type] ?? MUTED;
            return (
              <div key={i} style={{
                background: isCurrent ? `${SURFACE}` : item.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isCurrent ? `${color}40` : item.done ? "transparent" : "rgba(255,255,255,0.06)"}`,
                borderLeft: `3px solid ${item.done ? `${color}60` : isCurrent ? color : DIM}`,
                borderRadius: 12, padding: "11px 14px",
                display: "flex", alignItems: "center", gap: 12,
                opacity: !item.done && !isCurrent ? 0.6 : 1,
                cursor: "pointer",
                transition: "all 0.2s",
              }}>
                {/* Check circle */}
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  background: item.done ? `${color}25` : "transparent",
                  border: `2px solid ${item.done ? color : isCurrent ? `${color}80` : DIM}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                  {isCurrent && <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: isCurrent ? 600 : item.done ? 400 : 500, color: item.done ? "rgba(234,244,238,0.5)" : TEXT, textDecoration: item.done ? "line-through" : "none", textDecorationColor: "rgba(234,244,238,0.2)" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: isCurrent ? color : MUTED, marginTop: 1, opacity: item.done ? 0.7 : 1 }}>
                    {item.sub}
                  </div>
                </div>

                {isCurrent && (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 14px ${color}40` }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill={BG}><polygon points="5,3 19,12 5,21"/></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Label */}
      <div style={{ textAlign: "center", padding: "0 0 16px" }}>
        <div style={{ display: "inline-block", background: "rgba(17,14,10,0.9)", border: `1px solid ${GOLD}`, borderRadius: 20, padding: "5px 14px", fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 1 }}>
          D — DAILY WIRD
        </div>
        <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Completion is the model. Satisfying spiritual planner.</div>
      </div>
    </div>
  );
}
