const DOMAIN = "de2f6393-bcd1-4102-acd6-af663b52ccb3-00-23eb5b8y7xzyh.pike.replit.dev";
const IMG = (name: string) => `https://${DOMAIN}/images/${name}`;

const BG = "#0a0a0b";
const SURFACE = "#141415";
const CARD = "#1c1c1e";
const GREEN = "#34c97a";
const GOLD = "#b8946a";
const TEXT = "#eaf4ee";
const MUTED = "#888890";

export function NeutralBlack() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Header image */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 280, zIndex: 0, overflow: "hidden" }}>
        <img src={IMG("man-praying-moon.png")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(10,10,11,0.2) 0%, rgba(10,10,11,0.5) 50%, rgba(10,10,11,1) 100%)` }} />
      </div>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 20px 0", position: "relative", zIndex: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: GREEN, letterSpacing: 3 }}>MYTAZKI</span>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: MUTED, opacity: 0.5 }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: MUTED, opacity: 0.5 }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: MUTED, opacity: 0.5 }} />
        </div>
      </div>

      <div style={{ padding: "220px 20px 24px", position: "relative", zIndex: 5 }}>

        {/* Greeting */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 2, marginBottom: 4 }}>14 Dhul-Hijjah 1446 AH</div>
          <h2 style={{ fontSize: 24, fontFamily: "DM Sans, sans-serif", fontWeight: 700, margin: "0 0 4px" }}>Good evening, Ahmad</h2>
          <p style={{ fontSize: 13, color: GOLD, margin: 0 }}>You've been carrying joy in your heart.</p>
        </div>

        {/* Emotion grid */}
        <div style={{ background: SURFACE, border: `1px solid rgba(184,148,106,0.2)`, borderRadius: 20, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>What do you need right now?</div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Your answer shapes everything that follows.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {["Anxious","Peaceful","Overwhelmed","Lonely","Grateful","Frustrated","Grieving","Joyful"].map(e => (
              <div key={e} style={{ background: CARD, border: `1px solid rgba(52,201,122,0.1)`, borderRadius: 12, padding: "10px 4px", textAlign: "center" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: `rgba(52,201,122,0.15)`, margin: "0 auto 5px" }} />
                <div style={{ fontSize: 9, color: MUTED }}>{e}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Morning ritual card */}
        <div style={{ background: SURFACE, border: `1px solid rgba(52,201,122,0.2)`, borderRadius: 20, padding: 18, marginBottom: 14, position: "relative", overflow: "hidden" }}>
          <img src={IMG("woman-reading-quran.png")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.1 }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 10, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Morning ritual</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Begin your day with intention</div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>A 3-minute guided morning grounding</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: GREEN, color: BG, borderRadius: 20, padding: "8px 18px", fontSize: 12, fontWeight: 700 }}>
              Begin now →
            </div>
          </div>
        </div>

        {/* Prayer times */}
        <div style={{ background: SURFACE, border: `1px solid rgba(52,201,122,0.12)`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1, marginBottom: 2 }}>NEXT PRAYER</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: GREEN }}>Maghrib</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, fontFamily: "monospace" }}>0:43:12</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid rgba(52,201,122,0.08)` }}>
            {["Fajr","Dhuhr","Asr","Maghrib","Isha"].map((p, i) => (
              <div key={p} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: i === 3 ? GREEN : MUTED, marginBottom: 2 }}>{p}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: i === 3 ? GOLD : TEXT }}>
                  {["05:12","12:45","16:20","19:48","21:15"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Label */}
        <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
          <div style={{ display: "inline-block", background: `rgba(10,10,11,0.8)`, border: `1px solid ${GOLD}`, borderRadius: 20, padding: "6px 16px", fontSize: 11, color: GOLD, fontWeight: 600 }}>
            ③ Neutral Black — #0a0a0b
          </div>
        </div>
      </div>
    </div>
  );
}
