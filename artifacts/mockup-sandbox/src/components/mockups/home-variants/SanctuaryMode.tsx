const D = "de2f6393-bcd1-4102-acd6-af663b52ccb3-00-23eb5b8y7xzyh.pike.replit.dev";
const IMG = (n: string) => `https://${D}/images/${n}`;

const BG      = "#110e0a";
const BG2     = "#0d0b08";
const SURFACE = "#1a1410";
const CARD    = "#201812";
const GREEN   = "#34c97a";
const GOLD    = "#b8946a";
const CREAM   = "#f0e4cc";
const TEXT    = "#eaf4ee";
const SOFT    = "rgba(234,244,238,0.75)";
const MUTED   = "#7a6a58";
const DIM     = "rgba(255,255,255,0.06)";

// A — SANCTUARY MODE (refined)
// The image IS the home. Cinematic hero, one foregrounded action.
// Atmospheric gradients, sacred typography, premium depth.

export function SanctuaryMode() {
  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital@0;1&display=swap');

        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 18px rgba(52,201,122,0.30), 0 0 40px rgba(52,201,122,0.12), inset 0 1px 0 rgba(255,255,255,0.15); }
          50%       { box-shadow: 0 0 28px rgba(52,201,122,0.50), 0 0 64px rgba(52,201,122,0.22), inset 0 1px 0 rgba(255,255,255,0.20); }
        }

        @keyframes floatGlow {
          0%, 100% { opacity: 0.18; transform: translateY(0px) scale(1); }
          50%       { opacity: 0.26; transform: translateY(-6px) scale(1.04); }
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        @keyframes pulseRing {
          0%   { transform: scale(0.95); opacity: 0.7; }
          60%  { transform: scale(1.12); opacity: 0; }
          100% { transform: scale(1.12); opacity: 0; }
        }

        .sanctuary-root { -webkit-font-smoothing: antialiased; }

        .play-btn {
          animation: breathe 3.5s ease-in-out infinite;
          transition: transform 0.15s ease;
        }
        .play-btn:active { transform: scale(0.93); }

        .play-ring {
          position: absolute; inset: -6px; border-radius: 50%;
          border: 1.5px solid rgba(52,201,122,0.25);
          animation: pulseRing 3.5s ease-out infinite;
        }

        .ambient-orb {
          animation: floatGlow 6s ease-in-out infinite;
        }

        .session-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .session-card:active { transform: scale(0.985); }
      `}</style>

      <div className="sanctuary-root" style={{
        background: BG2, minHeight: "100vh", color: TEXT,
        fontFamily: "Inter, -apple-system, sans-serif",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>

        {/* ── AMBIENT ATMOSPHERIC ORB ── */}
        <div className="ambient-orb" style={{
          position: "absolute", top: "55%", left: "50%",
          transform: "translateX(-50%)",
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,201,122,0.08) 0%, rgba(184,148,106,0.04) 40%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* ══════════════════════════════════
             HERO — cinematic full-bleed
        ══════════════════════════════════ */}
        <div style={{ position: "relative", height: "63vh", flexShrink: 0, overflow: "hidden" }}>

          {/* Base image */}
          <img
            src={IMG("man-making-dua.png")} alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%", display: "block" }}
          />

          {/* Layer 1 — Radial lift: gently illuminates face/hands area */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 70% 50% at 50% 38%, rgba(184,148,106,0.10) 0%, transparent 65%)",
            mixBlendMode: "screen",
          }} />

          {/* Layer 2 — Lateral vignette: darkens edges, preserves centre */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 35%, rgba(13,11,8,0.55) 100%)",
          }} />

          {/* Layer 3 — Top fade (very light) for logo legibility */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 120,
            background: "linear-gradient(to bottom, rgba(13,11,8,0.55) 0%, transparent 100%)",
          }} />

          {/* Layer 4 — Bottom atmospheric melt into dashboard */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
            background: `linear-gradient(to bottom,
              transparent 0%,
              rgba(17,14,10,0.25) 30%,
              rgba(17,14,10,0.72) 62%,
              rgba(13,11,8,0.96) 82%,
              ${BG2} 100%
            )`,
          }} />

          {/* ── TOP BAR ── */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "24px 24px 0", zIndex: 10,
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: GREEN, letterSpacing: 3.5, opacity: 0.92 }}>MYTAZKI</span>
            <span style={{ fontSize: 11, color: TEXT, opacity: 0.45, letterSpacing: 1.5, fontWeight: 300 }}>7:41 PM</span>
          </div>

          {/* ── ARABIC VERSE — pure text, no card ── */}
          <div style={{
            position: "absolute", top: "30%", left: 0, right: 0,
            padding: "0 32px", textAlign: "center", zIndex: 5,
          }}>
            {/* Decorative hairline */}
            <div style={{
              width: 24, height: 1,
              background: "linear-gradient(to right, transparent, rgba(184,148,106,0.45), transparent)",
              margin: "0 auto 16px",
            }} />

            {/* Arabic — Amiri, warm cream, floating directly over image */}
            <div style={{
              fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', Georgia, serif",
              fontSize: 24,
              color: CREAM,
              direction: "rtl",
              lineHeight: 1.85,
              letterSpacing: 0.5,
              textShadow: "0 2px 24px rgba(0,0,0,0.95), 0 0 48px rgba(0,0,0,0.70)",
              marginBottom: 14,
              fontWeight: 400,
            }}>
              أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ
            </div>

            {/* Translation — calm, readable */}
            <div style={{
              fontSize: 12,
              color: "rgba(240,228,204,0.68)",
              letterSpacing: 0.4,
              lineHeight: 1.65,
              fontWeight: 300,
              textShadow: "0 1px 16px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.95)",
            }}>
              Verily, in the remembrance of Allah do hearts find rest
            </div>

            {/* Source */}
            <div style={{
              fontSize: 10, color: "rgba(184,148,106,0.45)",
              marginTop: 9, letterSpacing: 1.5, fontWeight: 400,
              textShadow: "0 1px 8px rgba(0,0,0,0.95)",
            }}>
              Surah Ar-Ra'd · 13:28
            </div>

            {/* Decorative hairline */}
            <div style={{
              width: 24, height: 1,
              background: "linear-gradient(to right, transparent, rgba(184,148,106,0.45), transparent)",
              margin: "16px auto 0",
            }} />
          </div>
        </div>

        {/* ══════════════════════════════════
             DASHBOARD — emerges from image
        ══════════════════════════════════ */}
        <div style={{
          flex: 1, padding: "0 22px 28px",
          display: "flex", flexDirection: "column",
          position: "relative", zIndex: 2,
          marginTop: -4,
        }}>

          {/* ── GREETING ── */}
          <div style={{ paddingTop: 12, marginBottom: 32 }}>
            <div style={{
              fontSize: 10, color: GOLD, letterSpacing: 3, marginBottom: 10,
              fontWeight: 500, textTransform: "uppercase", opacity: 0.85,
            }}>
              Good evening · 14 Dhul-Hijjah
            </div>
            <div style={{
              fontSize: 28, fontFamily: "DM Sans, sans-serif",
              fontWeight: 700, lineHeight: 1.05, marginBottom: 10,
              letterSpacing: -0.3,
            }}>
              Ahmad
            </div>
            <div style={{
              fontSize: 14, color: "rgba(184,148,106,0.80)",
              fontWeight: 300, lineHeight: 1.55, letterSpacing: 0.2,
            }}>
              You've been carrying joy in your heart.
            </div>
          </div>

          {/* ── FOCUS SESSION CARD ── */}
          <div
            className="session-card"
            style={{
              background: `linear-gradient(145deg, ${CARD} 0%, ${SURFACE} 100%)`,
              border: "1px solid rgba(52,201,122,0.18)",
              borderRadius: 22,
              padding: "22px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 14,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Subtle inner light */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(to right, transparent, rgba(52,201,122,0.25), transparent)",
            }} />
            <div style={{
              position: "absolute", top: -40, right: -20,
              width: 100, height: 100, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(52,201,122,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{
                fontSize: 10, color: GREEN, textTransform: "uppercase",
                letterSpacing: 2.5, marginBottom: 10, fontWeight: 600,
              }}>
                Your focus now
              </div>
              <div style={{
                fontSize: 18, fontWeight: 600, marginBottom: 6,
                letterSpacing: -0.2, lineHeight: 1.2,
              }}>
                Morning Azkar
              </div>
              <div style={{
                fontSize: 12, color: MUTED, fontWeight: 400,
                letterSpacing: 0.2,
              }}>
                7 min · Begin when ready
              </div>
            </div>

            {/* Play button — luminous + breathing */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="play-ring" />
              <div
                className="play-btn"
                style={{
                  width: 54, height: 54, borderRadius: "50%",
                  background: `linear-gradient(145deg, #3dd680 0%, ${GREEN} 55%, #2ab068 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Inner depth ring */}
                <div style={{
                  position: "absolute", inset: 3, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.18)",
                }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill={BG2} style={{ marginLeft: 2 }}>
                  <polygon points="6,3 20,12 6,21"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ── PRAYER ROW ── */}
          <div style={{
            background: `linear-gradient(145deg, ${CARD} 0%, rgba(26,20,16,0.5) 100%)`,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18, padding: "16px 20px",
            marginBottom: 14,
            boxShadow: "0 4px 16px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{
                  fontSize: 10, color: MUTED, textTransform: "uppercase",
                  letterSpacing: 2, marginBottom: 4, fontWeight: 500,
                }}>
                  Next prayer
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: GREEN, letterSpacing: -0.1 }}>Maghrib</div>
              </div>
              <div style={{
                fontSize: 22, fontWeight: 700, color: GOLD,
                fontFamily: "'SF Mono', 'Fira Mono', monospace",
                letterSpacing: -0.5,
              }}>
                0:43:12
              </div>
            </div>

            {/* 5 prayer mini-row */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}>
              {(["Fajr","Dhuhr","Asr","Maghrib","Isha"] as const).map((p, i) => (
                <div key={p} style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: 9, marginBottom: 4, fontWeight: 500,
                    color: i === 3 ? GREEN : MUTED,
                    textTransform: "uppercase", letterSpacing: 0.8,
                  }}>{p}</div>
                  <div style={{
                    fontSize: 11, fontWeight: i === 3 ? 600 : 400,
                    color: i === 3 ? GOLD : "rgba(234,244,238,0.45)",
                  }}>
                    {["05:12","12:45","16:20","19:48","21:15"][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── EMOTION ROW ── */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 0",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ fontSize: 13, color: SOFT, fontWeight: 300, letterSpacing: 0.2 }}>
              How are you feeling?
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { e: "Calm", c: "rgba(52,201,122,0.18)", b: "rgba(52,201,122,0.35)" },
                { e: "Anxious", c: "rgba(100,160,220,0.18)", b: "rgba(100,160,220,0.35)" },
                { e: "Grateful", c: "rgba(184,148,106,0.18)", b: "rgba(184,148,106,0.35)" },
                { e: "Heavy", c: "rgba(140,120,180,0.18)", b: "rgba(140,120,180,0.35)" },
              ].map(({ e, c, b }) => (
                <div key={e} title={e} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: c, border: `1px solid ${b}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: b }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── STREAK ── */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 0",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ fontSize: 13, color: SOFT, fontWeight: 300 }}>7-day streak</div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {Array(7).fill(null).map((_, i) => (
                <div key={i} style={{
                  width: i === 6 ? 10 : 7, height: i === 6 ? 10 : 7,
                  borderRadius: "50%",
                  background: i === 6
                    ? GREEN
                    : `rgba(52,201,122,${0.25 + i * 0.1})`,
                  boxShadow: i === 6 ? "0 0 8px rgba(52,201,122,0.5)" : "none",
                }} />
              ))}
              <div style={{ marginLeft: 4, fontSize: 12, color: GOLD, fontWeight: 600 }}>🔥</div>
            </div>
          </div>

        </div>

        {/* ── VARIANT LABEL ── */}
        <div style={{ textAlign: "center", padding: "0 0 18px", position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(13,11,8,0.92)",
            border: `1px solid rgba(184,148,106,0.35)`,
            borderRadius: 20, padding: "5px 16px",
            fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 1.2,
          }}>
            A — SANCTUARY MODE
          </div>
          <div style={{ fontSize: 10, color: MUTED, marginTop: 5, letterSpacing: 0.3 }}>
            Image IS the home · One action · All features present
          </div>
        </div>

      </div>
    </>
  );
}
