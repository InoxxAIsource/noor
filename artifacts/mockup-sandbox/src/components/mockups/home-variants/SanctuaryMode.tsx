const D = "de2f6393-bcd1-4102-acd6-af663b52ccb3-00-23eb5b8y7xzyh.pike.replit.dev";
const IMG = (n: string) => `https://${D}/images/${n}`;

const BG      = "#09070400";   // full transparent (image fills hero)
const BG2     = "#09070A";
const CARD    = "#16100a";
const SURFACE = "#120e08";
const GREEN   = "#34c97a";
const GOLD    = "#c9a472";
const CREAM   = "#faf2e2";
const TEXT    = "#f0ece4";
const MUTED   = "#6e5e4c";

export function SanctuaryMode() {
  return (
    <>
      <style>{`
        html,body { margin:0; padding:0; background:${BG2}; }

        .snc {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 14px rgba(52,201,122,0.30), 0 0 28px rgba(52,201,122,0.10); }
          55%      { box-shadow: 0 0 22px rgba(52,201,122,0.55), 0 0 44px rgba(52,201,122,0.18); }
        }
        .btn-ring {
          position:absolute; inset:-6px; border-radius:50%;
          border:1px solid rgba(52,201,122,0.40);
          animation: ring 3s ease-out infinite;
          pointer-events:none;
        }
        .btn-glow { animation: glow 3s ease-in-out infinite; }
        .press:active { opacity:0.85; transform:scale(0.98); }
      `}</style>

      <div className="snc" style={{
        background: BG2, minHeight: "100vh",
        fontFamily: "Inter, -apple-system, sans-serif",
        color: TEXT, display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}>

        {/* ═══════════════════════════════
             CINEMATIC HERO
        ═══════════════════════════════ */}
        <div style={{
          position: "relative", height: "62vh", flexShrink: 0, overflow: "hidden",
          /* isolate so blend-mode overlays don't touch outside layers */
          isolation: "isolate",
        }}>

          {/*
            CSS filter ONLY on the <img> itself — this is safe and does NOT
            blur sibling elements. contrast+brightness = cinematic grade,
            saturate(0.7) = desaturated film look, sepia(0.2) = warm tint.
          */}
          <img
            src={IMG("man-making-dua.png")} alt=""
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 18%",
              display: "block",
              /* cinematic: lifted contrast, preserved brightness, warm desaturate */
              filter: "contrast(1.12) brightness(0.93) saturate(0.70)",
            }}
          />

          {/* Warm amber film grade — candlelight atmosphere */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, rgba(130,74,22,0.32) 0%, rgba(90,44,8,0.20) 55%, rgba(10,6,18,0.14) 100%)",
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }} />

          {/* Soft vignette — open centre, dark edges */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 82% 74% at 50% 34%, transparent 34%, rgba(5,3,1,0.70) 100%)",
            pointerEvents: "none",
          }} />

          {/* Top scrim */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 105,
            background: "linear-gradient(to bottom, rgba(4,3,2,0.80) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />

          {/* Bottom atmospheric melt — multi-stop for smooth transition */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "62%",
            background: `linear-gradient(to bottom,
              transparent          0%,
              rgba(9,7,10,0.15)   20%,
              rgba(9,7,10,0.55)   48%,
              rgba(9,7,10,0.90)   72%,
              ${BG2}             100%)`,
            pointerEvents: "none",
          }} />

          {/* ── TOP BAR ── */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "22px 22px 0",
          }}>
            <span style={{
              fontSize: 12, fontWeight: 800, color: GREEN, letterSpacing: 4,
            }}>MYTAZKI</span>
            <span style={{
              fontSize: 11, color: TEXT, opacity: 0.36,
              letterSpacing: 1.5, fontWeight: 300,
            }}>7:41 PM</span>
          </div>

          {/* ── ARABIC VERSE ──
               isolation:isolate so it is a separate compositing layer.
               Text shadows are SHORT (max 6px blur) = crisp, never glowing.
          ── */}
          <div style={{
            position: "absolute", top: "30%", left: 0, right: 0, zIndex: 8,
            padding: "0 28px", textAlign: "center",
            isolation: "isolate",
          }}>

            {/* Gold hairline above */}
            <div style={{
              width: 30, height: 1, margin: "0 auto 18px",
              background: "linear-gradient(to right, transparent, rgba(201,164,114,0.65), transparent)",
            }} />

            {/*
              Arabic text:
              - font: system Arabic serifs, always available — no web-font dependency
              - color: #faf2e2 (warm cream, high contrast)
              - textShadow: hard 0-spread stacked at 1/2/5px blur — CRISP legibility
              - NO large-blur glows
            */}
            <div style={{
              fontFamily: "'Scheherazade New', 'Traditional Arabic', 'Noto Naskh Arabic', Georgia, serif",
              fontSize: 32,
              fontWeight: 700,
              color: CREAM,
              direction: "rtl",
              lineHeight: 1.7,
              letterSpacing: 1,
              /* stacked tight shadows — crisp edge, NOT a large blur */
              textShadow:
                "0 1px 2px rgba(0,0,0,1)," +
                "0 2px 4px rgba(0,0,0,1)," +
                "0 3px 6px rgba(0,0,0,0.95)",
              marginBottom: 14,
            }}>
              ألا بذكر الله تطمئن القلوب
            </div>

            {/* Translation */}
            <div style={{
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(250,242,226,0.96)",
              letterSpacing: 0.4,
              lineHeight: 1.7,
              textShadow: "0 1px 2px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)",
            }}>
              Verily, in the remembrance of Allah do hearts find rest
            </div>

            {/* Source */}
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: "rgba(201,164,114,0.92)",
              marginTop: 11, letterSpacing: 2.2,
              textShadow: "0 1px 2px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)",
            }}>
              SURAH AR-RA'D · 13:28
            </div>

            {/* Gold hairline below */}
            <div style={{
              width: 30, height: 1, margin: "18px auto 0",
              background: "linear-gradient(to right, transparent, rgba(201,164,114,0.65), transparent)",
            }} />

          </div>
        </div>

        {/* ═══════════════════════════════
             DASHBOARD
        ═══════════════════════════════ */}
        <div style={{
          flex: 1, padding: "0 20px 22px",
          display: "flex", flexDirection: "column",
          position: "relative", zIndex: 2,
        }}>

          {/* Greeting */}
          <div style={{ paddingTop: 16, marginBottom: 24 }}>
            <div style={{
              fontSize: 10, color: GOLD, letterSpacing: 3.5,
              fontWeight: 600, textTransform: "uppercase",
              opacity: 0.85, marginBottom: 8,
            }}>Good evening · 14 Dhul-Hijjah</div>

            <div style={{
              fontSize: 26, fontFamily: "DM Sans, sans-serif",
              fontWeight: 700, lineHeight: 1.05,
              letterSpacing: -0.4, marginBottom: 7,
            }}>Ahmad</div>

            <div style={{
              fontSize: 13, fontWeight: 400, lineHeight: 1.55,
              color: "rgba(201,164,114,0.72)",
            }}>You've been carrying joy in your heart.</div>
          </div>

          {/* Focus card */}
          <div className="press" style={{
            background: `linear-gradient(148deg, ${CARD} 0%, ${SURFACE} 100%)`,
            border: "1px solid rgba(52,201,122,0.14)",
            borderRadius: 20, padding: "19px 17px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 11, cursor: "pointer",
            boxShadow: "0 6px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)",
            position: "relative", overflow: "hidden",
            transition: "opacity 0.15s, transform 0.15s",
          }}>
            <div style={{
              position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
              background: "linear-gradient(to right, transparent, rgba(52,201,122,0.30), transparent)",
            }} />

            <div style={{ flex: 1, paddingRight: 14 }}>
              <div style={{
                fontSize: 9, color: GREEN, textTransform: "uppercase",
                letterSpacing: 2.5, marginBottom: 9, fontWeight: 700,
              }}>Your focus now</div>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 5, color: TEXT }}>
                Morning Azkar
              </div>
              <div style={{ fontSize: 12, color: MUTED, fontWeight: 400 }}>
                7 min · Begin when ready
              </div>
            </div>

            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="btn-ring" />
              <div className="btn-glow" style={{
                width: 52, height: 52, borderRadius: "50%",
                background: `linear-gradient(145deg, #44e48a 0%, ${GREEN} 60%, #27a060 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", inset: 3, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.22)",
                }} />
                <svg width="15" height="15" viewBox="0 0 24 24" fill={BG2} style={{ marginLeft: 2 }}>
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>
            </div>
          </div>

          {/* Prayer card */}
          <div style={{
            background: `linear-gradient(148deg, ${CARD} 0%, ${SURFACE} 100%)`,
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 18, padding: "15px 17px", marginBottom: 11,
            boxShadow: "0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.025)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
              <div>
                <div style={{
                  fontSize: 9, color: MUTED, textTransform: "uppercase",
                  letterSpacing: 2.2, marginBottom: 4, fontWeight: 600,
                }}>Next prayer</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: GREEN }}>Maghrib</div>
              </div>
              <div style={{
                fontSize: 22, fontWeight: 700, color: GOLD,
                fontFamily: "'SF Mono', 'Fira Mono', monospace", letterSpacing: -0.5,
              }}>0:43:12</div>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)",
            }}>
              {["Fajr","Dhuhr","Asr","Maghrib","Isha"].map((p, i) => (
                <div key={p} style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: 8, marginBottom: 3, fontWeight: 600,
                    color: i === 3 ? GREEN : MUTED,
                    textTransform: "uppercase", letterSpacing: 0.5,
                  }}>{p}</div>
                  <div style={{
                    fontSize: 10, fontWeight: i === 3 ? 700 : 400,
                    color: i === 3 ? GOLD : "rgba(240,236,228,0.38)",
                  }}>
                    {["05:12","12:45","16:20","19:48","21:15"][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feeling */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: 13, color: "rgba(240,236,228,0.72)", fontWeight: 400 }}>
              How are you feeling?
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              {[GREEN, "#6aaee0", GOLD, "#a08ec0"].map(c => (
                <div key={c} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: `${c}1A`, border: `1.5px solid ${c}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${c}99` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Streak */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: 13, color: "rgba(240,236,228,0.72)", fontWeight: 400 }}>
              7-day streak
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {Array(7).fill(null).map((_, i) => (
                <div key={i} style={{
                  width: i === 6 ? 9 : 6, height: i === 6 ? 9 : 6,
                  borderRadius: "50%",
                  background: i === 6 ? GREEN : `rgba(52,201,122,${0.18 + i * 0.10})`,
                  boxShadow: i === 6 ? `0 0 7px ${GREEN}80` : "none",
                }} />
              ))}
              <span style={{ marginLeft: 4, fontSize: 12, color: GOLD }}>🔥</span>
            </div>
          </div>

        </div>

        {/* Label */}
        <div style={{ textAlign: "center", paddingBottom: 14, zIndex: 2 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(9,7,10,0.95)",
            border: "1px solid rgba(201,164,114,0.28)",
            borderRadius: 20, padding: "4px 14px",
            fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 1,
          }}>A — SANCTUARY MODE</div>
        </div>

      </div>
    </>
  );
}
