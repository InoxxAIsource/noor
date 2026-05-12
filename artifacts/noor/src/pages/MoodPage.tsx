import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BottomNav from "../components/BottomNav";

const MOODS = [
  { label: "Anxious", emoji: "🌊" },
  { label: "Grateful", emoji: "✨" },
  { label: "Grieving", emoji: "💔" },
  { label: "Frustrated", emoji: "🔥" },
  { label: "Joyful", emoji: "😊" },
  { label: "Lonely", emoji: "🌙" },
  { label: "Overwhelmed", emoji: "🌧️" },
  { label: "Peaceful", emoji: "🌿" },
];

const INTENSITIES = [
  { label: "Mild", emoji: "🌱", desc: "A gentle feeling in the background" },
  { label: "Moderate", emoji: "🌿", desc: "Present and noticeable" },
  { label: "Intense", emoji: "🌊", desc: "Hard to ignore right now" },
];

interface Session { id: string; title: string; category: string; durationSeconds: number; }
interface Recommendation { session: Session; reason: string; id?: string; }

const MoodPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mood, setMood] = useState("");
  const [intensity, setIntensity] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("tazki_token");
  const selectedMood = MOODS.find(m => m.label === mood);

  const handleMoodSelect = (m: string) => {
    setMood(m);
    setIntensity("");
    setStep(2);
  };

  const handleIntensitySelect = (i: string) => {
    setIntensity(i);
  };

  const fetchRecommendations = async () => {
    setStep(3);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mood, intensity }),
      });
      const data = await res.json() as { recommendations?: Recommendation[]; error?: string };
      if (data.error) throw new Error(data.error);
      setRecommendations(data.recommendations || []);
      setStep(4);
    } catch {
      setError("Could not load recommendations. Please try again.");
      setStep(1);
      setMood("");
      setIntensity("");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setMood("");
    setIntensity("");
    setRecommendations([]);
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", paddingBottom: 88 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 20px 0", marginBottom: 4 }}>
        <button
          onClick={() => step > 1 ? reset() : navigate(-1)}
          style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4 }}
        >
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 style={{ fontFamily: "DM Sans, sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>
            What do you need right now?
          </h1>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: 0, marginTop: 2 }}>
            {step === 1 && "Your heart guides you to the right session"}
            {step === 2 && `You feel ${mood} — how intense?`}
            {(step === 3 && loading) && "Finding your guidance..."}
            {step === 4 && "Your personalised guidance"}
          </p>
        </div>
      </div>

      {/* Step progress dots */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "16px 0 20px" }}>
        {[1, 2, 4].map(s => (
          <div key={s} style={{
            width: step >= s ? 24 : 8, height: 8, borderRadius: 4,
            background: step >= s ? "var(--green)" : "var(--faint)",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      <div style={{ padding: "0 20px" }}>

        {error && (
          <div style={{
            background: "rgba(192,72,72,0.1)", border: "1px solid rgba(192,72,72,0.3)",
            borderRadius: 12, padding: "12px 16px", marginBottom: 16, textAlign: "center",
          }}>
            <p style={{ fontSize: 13, color: "#ff9999", margin: "0 0 8px" }}>{error}</p>
            <button onClick={reset} style={{ fontSize: 12, color: "var(--green)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Try again
            </button>
          </div>
        )}

        {/* Step 1: Mood grid */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => handleMoodSelect(m.label)}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 16, padding: "18px 12px", cursor: "pointer", textAlign: "center",
                  transition: "all 0.2s", outline: "none",
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--green)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--card)";
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--surface)";
                }}
              >
                <div style={{ fontSize: 34, marginBottom: 8 }}>{m.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{m.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Intensity */}
        {step === 2 && (
          <div style={{ maxWidth: 360, margin: "0 auto" }}>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 20,
            }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>{selectedMood?.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{mood}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {INTENSITIES.map((i) => (
                <button
                  key={i.label}
                  onClick={() => handleIntensitySelect(i.label)}
                  style={{
                    background: intensity === i.label ? "rgba(52,201,122,0.12)" : "var(--surface)",
                    border: intensity === i.label ? "1.5px solid var(--green)" : "1px solid var(--border)",
                    borderRadius: 14, padding: "14px 18px", cursor: "pointer", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s", outline: "none",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{i.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: intensity === i.label ? "var(--green)" : "var(--text)" }}>
                      {i.label}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{i.desc}</div>
                  </div>
                  {intensity === i.label && (
                    <div style={{ marginLeft: "auto", color: "var(--green)" }}>✓</div>
                  )}
                </button>
              ))}
            </div>

            {intensity && (
              <button
                onClick={() => void fetchRecommendations()}
                style={{
                  width: "100%", background: "var(--green)", color: "#0d1411",
                  border: "none", borderRadius: 14, padding: "15px 16px",
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                Find my guidance <ChevronRight size={16} />
              </button>
            )}

            <button
              onClick={reset}
              style={{ width: "100%", background: "none", border: "none", color: "var(--muted)", fontSize: 13, cursor: "pointer", padding: "12px 8px", marginTop: 4 }}
            >
              ← Change mood
            </button>
          </div>
        )}

        {/* Step 3: Loading */}
        {step === 3 && loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 20 }}>
            <div style={{ fontSize: 60, animation: "float 2s ease-in-out infinite" }}>🌿</div>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 18, fontWeight: 600, color: "var(--green)" }}>
              Finding your guidance...
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", maxWidth: 240 }}>
              Searching through sessions for {mood.toLowerCase()} hearts
            </p>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && recommendations.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>{selectedMood?.emoji}</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{mood} · {intensity}</span>
              <button
                onClick={reset}
                style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--green)", fontSize: 12, cursor: "pointer" }}
              >
                Start over
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recommendations.map((rec, i) => {
                const s = rec.session as unknown as Record<string, unknown>;
                const sessionId = (s?.["id"] as string) ?? (rec.id as string) ?? String(i);
                const mins = Math.ceil(((s?.["durationSeconds"] as number) || 0) / 60);
                return (
                  <div
                    key={i}
                    style={{
                      background: "var(--surface)", border: "1px solid var(--border)",
                      borderRadius: 16, padding: "16px",
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                      {s?.["title"] as string}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                      {mins > 0 ? `${mins} min` : "Guided"} · {s?.["category"] as string}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", marginBottom: 14, lineHeight: 1.5 }}>
                      "{rec.reason}"
                    </div>
                    <button
                      onClick={() => void navigate(`/player/${sessionId}`)}
                      style={{
                        width: "100%", background: "var(--green)", color: "#0d1411",
                        border: "none", borderRadius: 10, padding: "11px 16px",
                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      Begin this session <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={reset}
                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 13, cursor: "pointer" }}
              >
                Try again with a different mood
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <BottomNav />
    </div>
  );
};

export default MoodPage;
