const D = "de2f6393-bcd1-4102-acd6-af663b52ccb3-00-23eb5b8y7xzyh.pike.replit.dev";
const IMG = (n: string) => `https://${D}/images/${n}`;

const BG = "#110e0a";
const GREEN = "#34c97a";
const GOLD = "#b8946a";
const TEXT = "#eaf4ee";
const MUTED = "#8a7a6a";

// C — MIRROR OF THE HEART
// Hypothesis: the home screen should be a MIRROR — it reflects
// your current spiritual/emotional state back at you.
// The emotion check-in IS the home. Not a card on a list.
// Before answering: the screen is a question.
// After answering: the entire UI shifts to match your state.
// Here we show the "answered" state — emotion: Peaceful.

const EMOTION_CHOSEN = "Peaceful";
const EMOTIONS = [
  { key: "Anxious", icon: "〰", color: "#6ab0d8" },
  { key: "Peaceful", icon: "⊂", color: "#34c97a" },
  { key: "Grateful", icon: "◇", color: "#b8946a" },
  { key: "Overwhelmed", icon: "≋", color: "#9b7ec4" },
  { key: "Lonely", icon: "○", color: "#7ab0c8" },
  { key: "Frustrated", icon: "△", color: "#c47a5a" },
  { key: "Grieving", icon: "♡", color: "#7a8ab8" },
  { key: "Joyful", icon: "☼", color: "#c8b434" },
];
const chosen = EMOTIONS.find(e => e.key === EMOTION_CHOSEN)!;

export function MirrorOfHeart() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Tinted atmospheric bg matching emotion */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${chosen.color}18 0%, transparent 65%)`, zIndex: 0, pointerEvents: "none" }} />

      {/* Minimal header */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 22px 0" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: GREEN, letterSpacing: 3 }}>MYTAZKI</span>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5 }}>14 Dhul-Hijjah</div>
      </div>

      {/* THE MIRROR — full-width emotion display */}
      <div style={{ position: "relative", zIndex: 2, padding: "28px 24px 0", textAlign: "center" }}>

        {/* Large emotion glyph / state */}
        <div style={{
          width: 110, height: 110, borderRadius: "50%", margin: "0 auto 20px",
          background: `radial-gradient(circle, ${chosen.color}30 0%, ${chosen.color}08 100%)`,
          border: `1.5px solid ${chosen.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          boxShadow: `0 0 40px ${chosen.color}20`,
        }}>
          <img src={IMG("woman-reading-quran.png")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", opacity: 0.35 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 38, color: chosen.color, fontWeight: 300 }}>{chosen.icon}</span>
          </div>
        </div>

        <div style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>Right now you feel</div>
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "DM Sans, sans-serif", color: chosen.color, marginBottom: 6 }}>{EMOTION_CHOSEN}</div>
        <div style={{ fontSize: 13, color: TEXT, opacity: 0.7, maxWidth: 260, margin: "0 auto 28px", lineHeight: 1.5 }}>
          You've been finding moments of peace recently.
        </div>

        {/* Emotion selector — ring of options */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {EMOTIONS.map(e => (
            <div key={e.key} style={{
              padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer",
              background: e.key === EMOTION_CHOSEN ? `${e.color}20` : "rgba(255,255,255,0.04)",
              border: `1px solid ${e.key === EMOTION_CHOSEN ? e.color : "rgba(255,255,255,0.08)"}`,
              color: e.key === EMOTION_CHOSEN ? e.color : MUTED,
              fontWeight: e.key === EMOTION_CHOSEN ? 600 : 400,
            }}>
              {e.key}
            </div>
          ))}
        </div>
      </div>

      {/* Content matched to emotion */}
      <div style={{ position: "relative", zIndex: 2, padding: "0 22px" }}>
        <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 12 }}>For when you feel {EMOTION_CHOSEN.toLowerCase()}</div>

        {/* Matched session — main action */}
        <div style={{
          background: `linear-gradient(135deg, rgba(52,201,122,0.1) 0%, rgba(52,201,122,0.04) 100%)`,
          border: `1px solid ${chosen.color}30`,
          borderRadius: 18, padding: "16px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 10, cursor: "pointer",
        }}>
          <div>
            <div style={{ fontSize: 11, color: chosen.color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Quran Reflection</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Surah Al-Baqarah Reflection</div>
            <div style={{ fontSize: 12, color: MUTED }}>12 min · Reading + Commentary</div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: chosen.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 20px ${chosen.color}40` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={BG}><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>

        {/* Secondary — dua for this state */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>Dua of Gratitude</div>
            <div style={{ fontSize: 11, color: MUTED }}>A dua matched to your state</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      {/* Label */}
      <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
        <div style={{ display: "inline-block", background: "rgba(17,14,10,0.9)", border: `1px solid ${GOLD}`, borderRadius: 20, padding: "5px 14px", fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 1 }}>
          C — MIRROR OF THE HEART
        </div>
        <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>Emotion IS the UI. UI shifts to match your state.</div>
      </div>
    </div>
  );
}
