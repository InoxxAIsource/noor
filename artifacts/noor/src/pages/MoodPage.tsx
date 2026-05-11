import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

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

interface Recommendation {
  session: Record<string, unknown>;
  reason: string;
}

const MoodPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mood, setMood] = useState("");
  const [intensity, setIntensity] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("deen_token");

  const handleMoodSelect = (m: string) => {
    setMood(m);
    setStep(2);
  };

  const handleIntensitySelect = async (i: string) => {
    setIntensity(i);
    setStep(3);
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mood, intensity: i }),
      });
      const data = await res.json() as { recommendations?: Recommendation[]; error?: string };

      if (data.error) throw new Error(data.error);
      setRecommendations(data.recommendations || []);
      setStep(4);
    } catch (err) {
      setError("Could not load recommendations. Please try again.");
      setStep(1);
      setMood("");
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 animate-fade-in">
      <div className="p-6">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] mb-1">What do you need today?</h1>
        <p className="text-[var(--muted)] text-sm mb-8">
          {step === 1 && "Select how you feel — we'll find your perfect dua."}
          {step === 2 && `You feel ${mood}. How intense?`}
          {step === 3 && "Finding your guidance..."}
          {step === 4 && "Your personalised guidance:"}
        </p>

        {/* Step 1: Mood selection */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => handleMoodSelect(m.label)}
                className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--green)] rounded-3xl p-5 flex flex-col items-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(0,165,80,0.15)] group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">{m.emoji}</span>
                <span className="font-cinzel text-base text-white">{m.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Intensity */}
        {step === 2 && (
          <div className="max-w-sm mx-auto space-y-4">
            <div className="flex items-center gap-3 text-3xl justify-center mb-6">
              <span>{MOODS.find((m) => m.label === mood)?.emoji}</span>
              <span className="font-cinzel text-xl text-white">{mood}</span>
            </div>
            {INTENSITIES.map((i) => (
              <button
                key={i}
                onClick={() => handleIntensitySelect(i)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--green)] hover:bg-[var(--card)] rounded-2xl py-4 font-cinzel text-lg text-white transition-all"
              >
                {i === "Mild" && "🌱 Mild"}
                {i === "Moderate" && "🌿 Moderate"}
                {i === "Intense" && "🌊 Intense"}
              </button>
            ))}
            <button onClick={reset} className="w-full text-[var(--muted)] text-sm py-2">
              ← Choose different mood
            </button>
          </div>
        )}

        {/* Step 3: Loading */}
        {step === 3 && loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="text-6xl animate-pulse">☪️</div>
            <p className="font-cinzel text-[var(--gold)] text-lg animate-pulse">Finding your dua...</p>
            <p className="text-[var(--muted)] text-sm text-center max-w-xs">
              Searching through guided sessions for {mood.toLowerCase()} hearts
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-900/30 rounded-xl p-4 text-center">
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button onClick={reset} className="text-[var(--green)] text-sm underline">Try again</button>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && recommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{MOODS.find((m) => m.label === mood)?.emoji}</span>
              <span className="text-sm text-[var(--muted)]">{mood} · {intensity}</span>
              <button onClick={reset} className="ml-auto text-xs text-[var(--green)] underline">
                Start over
              </button>
            </div>

            {recommendations.map((rec, i) => {
              const s = rec.session;
              return (
                <div
                  key={i}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--green)] bg-[var(--green)]/10 px-2 py-0.5 rounded-full">
                      {s["category"] as string}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {Math.ceil((s["durationSeconds"] as number) / 60)} min
                    </span>
                  </div>
                  <h3 className="font-cinzel text-white mb-2">{s["title"] as string}</h3>
                  <p className="text-xs text-[var(--muted)] italic mb-4">"{rec.reason}"</p>
                  <Link
                    to={`/player/${s["id"]}`}
                    className="flex items-center justify-center gap-2 w-full bg-[var(--green)] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--green)]/90 transition-colors"
                  >
                    <Play size={14} /> Begin this dua →
                  </Link>
                </div>
              );
            })}

            {recommendations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[var(--muted)]">No specific sessions found. Browse all sessions:</p>
                <Link to="/sessions" className="text-[var(--green)] underline text-sm mt-2 block">
                  View all sessions →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodPage;
