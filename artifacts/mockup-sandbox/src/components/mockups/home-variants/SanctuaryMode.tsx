const D = "de2f6393-bcd1-4102-acd6-af663b52ccb3-00-23eb5b8y7xzyh.pike.replit.dev";
const IMG = (n: string) => `https://${D}/images/${n}`;

const BG = "#110e0a";
const GREEN = "#34c97a";
const GOLD = "#b8946a";
const TEXT = "#eaf4ee";
const MUTED = "#8a7a6a";

// A — SANCTUARY MODE
// Hypothesis: the dashboard should feel like entering a sacred space,
// not scanning a feature list. ONE thing is foregrounded at a time.
// The image IS the home. Interaction is minimal: breathe, then choose.

export function SanctuaryMode() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/* Full-bleed hero — image takes 62% of the screen */}
      <div style={{ position: "relative", height: "62vh", flexShrink: 0, overflow: "hidden" }}>
        <img src={IMG("man-making-dua.png")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
        {/* Very light vignette only at edges */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(17,14,10,0.6) 100%)" }} />
        {/* Bottom fade into BG */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to bottom, transparent, ${BG})` }} />

        {/* Minimal top bar — just logo + time */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 22px 0" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: GREEN, letterSpacing: 3, opacity: 0.9 }}>MYTAZKI</span>
          <span style={{ fontSize: 12, color: TEXT, opacity: 0.6, letterSpacing: 1 }}>7:41 PM</span>
        </div>

        {/* Arabic verse over image */}
        <div style={{ position: "absolute", top: "38%", left: 0, right: 0, textAlign: "center", padding: "0 32px" }}>
          <div style={{ fontFamily: "serif", fontSize: 22, color: GREEN, direction: "rtl", textShadow: "0 2px 20px rgba(0,0,0,0.8)", lineHeight: 1.6, marginBottom: 8 }}>
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </div>
          <div style={{ fontSize: 11, color: TEXT, opacity: 0.7, fontStyle: "italic", textShadow: "0 1px 10px rgba(0,0,0,0.9)", letterSpacing: 0.5 }}>
            Verily, in the remembrance of Allah hearts find rest
          </div>
        </div>
      </div>

      {/* Ground level — sparse, breathing */}
      <div style={{ flex: 1, padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 0 }}>

        {/* Greeting — one line, personal */}
        <div style={{ paddingTop: 4, marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 2, marginBottom: 6 }}>Good evening</div>
          <div style={{ fontSize: 26, fontFamily: "DM Sans, sans-serif", fontWeight: 700, lineHeight: 1.1 }}>Ahmad</div>
          <div style={{ fontSize: 13, color: GOLD, marginTop: 4, opacity: 0.9 }}>You've been carrying joy in your heart.</div>
        </div>

        {/* Single primary action — the ONE thing to do now */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(52,201,122,0.12) 0%, rgba(184,148,106,0.08) 100%)",
            border: "1px solid rgba(52,201,122,0.25)",
            borderRadius: 20, padding: "20px 22px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16, cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: GREEN, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 8 }}>Your focus now</div>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 3 }}>Morning Azkar</div>
            <div style={{ fontSize: 12, color: MUTED }}>7 min · Begin when ready</div>
          </div>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: GREEN, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 28px rgba(52,201,122,0.35)", flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={BG}><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>

        {/* Next prayer — single line, no chart */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 13, color: MUTED }}>Maghrib in</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: GOLD, fontFamily: "monospace" }}>0:43:12</div>
        </div>

        {/* Emotion — ultra minimal single tap */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 13, color: MUTED }}>How are you feeling?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["🌿","🌊","✨","🔥"].map(e => (
              <div key={e} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{e}</div>
            ))}
          </div>
        </div>

      </div>

      {/* Label */}
      <div style={{ textAlign: "center", padding: "0 0 16px" }}>
        <div style={{ display: "inline-block", background: "rgba(17,14,10,0.9)", border: `1px solid ${GOLD}`, borderRadius: 20, padding: "5px 14px", fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 1 }}>
          A — SANCTUARY MODE
        </div>
        <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Image IS the home. One action foregrounded.</div>
      </div>
    </div>
  );
}
