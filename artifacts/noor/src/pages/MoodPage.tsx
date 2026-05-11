import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOODS = [
  { label: "Anxious", emoji: "😰" },
  { label: "Grateful", emoji: "🙏" },
  { label: "Grieving", emoji: "💔" },
  { label: "Frustrated", emoji: "😤" },
  { label: "Joyful", emoji: "😊" },
  { label: "Lonely", emoji: "😔" },
  { label: "Overwhelmed", emoji: "😵" },
  { label: "Peaceful", emoji: "😌" },
];

const INTENSITIES = ["Mild", "Moderate", "Intense"];

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

  const token = localStorage.getItem("deen_token");

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
    <div style={{ minHeight: "100vh", background: "#001a00", color: "#e8f5e8", paddingBottom: 80 }}>
      <div style={{ padding: "24px 16px 0" }}>
        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: 26, color: "#ffd700", marginBottom: 4 }}>
          What do you need right now?
        </h1>
        <p style={{ fontSize: 13, color: "#4a7a4a", marginBottom: 24 }}>
          {step === 1 && "Find the perfect dua for this moment"}
          {step === 2 && `You feel ${mood}. How intense is this feeling?`}
          {(step === 3 || loading) && "Finding your dua..."}
          {step === 4 && "Your personalised guidance:"}
        </p>

        {error && (
          <div style={{
            background: "rgba(192,72,72,0.15)", border: "0.5px solid rgba(192,72,72,0.4)",
            borderRadius: 10, padding: "12px 16px", marginBottom: 16, textAlign: "center",
          }}>
            <p style={{ fontSize: 13, color: "#ff9999", marginBottom: 8 }}>{error}</p>
            <button onClick={reset} style={{ fontSize: 12, color: "#00a550", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
              Try again
            </button>
          </div>
        )}

        {/* Step 1: Mood selection */}
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {MOODS.map((m) => (
              <div
                key={m.label}
                onClick={() => handleMoodSelect(m.label)}
                style={{
                  background: "rgba(0,165,80,0.06)", border: "0.5px solid rgba(0,165,80,0.2)",
                  borderRadius: 12, padding: 16, cursor: "pointer", textAlign: "center",
                  transition: "border-color .2s, background .2s",
                }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#00a550"; }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,165,80,0.2)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{m.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Intensity + Find button */}
        {step === 2 && (
          <div style={{ maxWidth: 340, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>{MOODS.find(m => m.label === mood)?.emoji}</span>
              <span style={{ fontSize: 17, fontWeight: 500 }}>{mood}</span>
            </div>

            <div style={{ fontSize: 13, color: "#4a7a4a", marginBottom: 12, textAlign: "center" }}>
              How intense is this feeling?
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {INTENSITIES.map((i) => (
                <div
                  key={i}
                  onClick={() => handleIntensitySelect(i)}
                  style={{
                    background: intensity === i ? "rgba(0,165,80,0.2)" : "rgba(0,165,80,0.06)",
                    border: intensity === i ? "2px solid #00a550" : "0.5px solid rgba(0,165,80,0.2)",
                    borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "center",
                    fontSize: 15, fontWeight: 500, transition: "all .2s",
                  }}
                >
                  {i === "Mild" ? "🌱 Mild" : i === "Moderate" ? "🌿 Moderate" : "🌊 Intense"}
                </div>
              ))}
            </div>

            {intensity && (
              <button
                onClick={() => void fetchRecommendations()}
                style={{
                  width: "100%", background: "#00a550", color: "#001a00",
                  border: "none", borderRadius: 12, padding: "14px 16px",
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  marginBottom: 10,
                }}
              >
                Find my dua →
              </button>
            )}

            <button
              onClick={reset}
              style={{ width: "100%", background: "none", border: "none", color: "#4a7a4a", fontSize: 13, cursor: "pointer", padding: 8 }}
            >
              ← Choose different mood
            </button>
          </div>
        )}

        {/* Step 3: Loading */}
        {step === 3 && loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 20 }}>
            <div style={{ fontSize: 56, animation: "pulse 1.5s ease-in-out infinite" }}>☪️</div>
            <p style={{ fontFamily: "Cinzel, serif", fontSize: 18, color: "#ffd700", animation: "pulse 1.5s ease-in-out infinite" }}>
              Finding your dua...
            </p>
            <p style={{ fontSize: 13, color: "#4a7a4a", textAlign: "center", maxWidth: 240 }}>
              Searching through guided sessions for {mood.toLowerCase()} hearts
            </p>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && recommendations.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>{MOODS.find(m => m.label === mood)?.emoji}</span>
              <span style={{ fontSize: 13, color: "#4a7a4a" }}>{mood} · {intensity}</span>
              <button
                onClick={reset}
                style={{ marginLeft: "auto", background: "none", border: "none", color: "#00a550", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
              >
                Start over
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recommendations.map((rec, i) => {
                const s = rec.session as unknown as Record<string, unknown>;
                const sessionId = (s?.["id"] as string) ?? (rec.id as string) ?? String(i);
                return (
                  <div
                    key={i}
                    style={{
                      background: "rgba(0,165,80,0.06)", border: "0.5px solid rgba(0,165,80,0.2)",
                      borderRadius: 10, padding: 14,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                      {s?.["title"] as string}
                    </div>
                    <div style={{ fontSize: 12, color: "#4a7a4a", marginBottom: 6 }}>
                      {Math.ceil(((s?.["durationSeconds"] as number) || 0) / 60)} min · {s?.["category"] as string}
                    </div>
                    <div style={{ fontSize: 12, color: "#4a7a4a", fontStyle: "italic", marginBottom: 12 }}>
                      "{rec.reason}"
                    </div>
                    <button
                      onClick={() => void navigate(`/player/${sessionId}`)}
                      style={{
                        width: "100%", background: "#00a550", color: "#001a00",
                        border: "none", borderRadius: 8, padding: 10,
                        fontSize: 13, fontWeight: 500, cursor: "pointer",
                      }}
                    >
                      Begin this session →
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                onClick={reset}
                style={{ background: "none", border: "none", color: "#4a7a4a", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default MoodPage;
