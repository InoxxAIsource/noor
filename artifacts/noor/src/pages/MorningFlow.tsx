import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const QURAN_INSIGHTS = [
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Quran 13:28" },
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "Verily, with every hardship comes ease.", ref: "Quran 94:6" },
  { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", translation: "And He is with you wherever you are.", ref: "Quran 57:4" },
  { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", translation: "Our Lord, grant us good in this world and good in the hereafter.", ref: "Quran 2:201" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", translation: "Indeed, Allah is with the patient.", ref: "Quran 2:153" },
];

const EMOTIONS = [
  { key: "peaceful", label: "Peaceful", emoji: "🌿" },
  { key: "grateful", label: "Grateful", emoji: "✨" },
  { key: "anxious", label: "Anxious", emoji: "🌊" },
  { key: "distracted", label: "Distracted", emoji: "☁️" },
  { key: "overwhelmed", label: "Overwhelmed", emoji: "🌧️" },
  { key: "tired", label: "Tired", emoji: "🌙" },
];

const EMOTION_ACTIONS: Record<string, { dua: string; arabic: string; label: string }> = {
  peaceful: { label: "Morning Dua", arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا", dua: "Allahumma bika asbahna wa bika amsayna — O Allah, by You we enter the morning and by You we enter the evening." },
  grateful: { label: "Gratitude Dhikr", arabic: "الْحَمْدُ لِلَّهِ", dua: "Alhamdulillah — All praise is for Allah. Repeat this with intention and feel the blessing of this moment." },
  anxious: { label: "Dua for Relief", arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", dua: "Hasbunallahu wa ni'mal wakeel — Allah is enough for us, and He is the best Disposer of affairs." },
  distracted: { label: "Focus Dhikr", arabic: "بِسْمِ اللَّهِ", dua: "Begin with Bismillah. Say it slowly, let it anchor you. Every blessed beginning starts here." },
  overwhelmed: { label: "Dua for Ease", arabic: "رَبِّ اشْرَحْ لِي صَدْرِي", dua: "Rabbi ishrah li sadri — My Lord, open my heart. Breathe deeply and trust that Allah hears you." },
  tired: { label: "Morning Blessing", arabic: "اللَّهُمَّ أَعِنِّي", dua: "Allahumma a'inni — O Allah, help me. Even in tiredness, showing up is an act of worship." },
};

const token = () => localStorage.getItem("tazki_token");

export default function MorningFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const u = user as Record<string, unknown> | null;
  const name = (u?.["name"] as string)?.split(" ")[0] ?? "friend";

  const [step, setStep] = useState(0);
  const [emotion, setEmotion] = useState("");
  const [reflection, setReflection] = useState("");
  const [loadingReflection, setLoadingReflection] = useState(false);
  const [morningStreak, setMorningStreak] = useState(0);
  const [insight] = useState(() => QURAN_INSIGHTS[Math.floor(Math.random() * QURAN_INSIGHTS.length)]!);

  const totalSteps = 5;

  async function handleEmotionSelect(em: string) {
    setEmotion(em);
    await saveCheckin(em);
    setStep(3);
    setLoadingReflection(true);
    try {
      const res = await fetch("/api/mood/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
        body: JSON.stringify({ emotion: em }),
      });
      const data = await res.json() as { reflection?: string };
      setReflection(data.reflection ?? "");
    } catch {
      setReflection("Turn your heart to Allah. He is closer to you than you know, and this moment of intention is already worship.");
    }
    setLoadingReflection(false);
  }

  async function saveCheckin(em: string) {
    await fetch("/api/mood/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
      body: JSON.stringify({ emotion: em }),
    }).catch(() => null);
  }

  async function handleComplete() {
    try {
      const res = await fetch("/api/morning/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
      });
      const data = await res.json() as { morningStreak?: number };
      setMorningStreak(data.morningStreak ?? 1);
    } catch {
      setMorningStreak(1);
    }
    setStep(5);
  }

  const action = EMOTION_ACTIONS[emotion] ?? EMOTION_ACTIONS["peaceful"]!;

  return (
    <div style={{
      background: "#09070A", minHeight: "100vh", color: "#f0ece4",
      display: "flex", flexDirection: "column", position: "relative",
    }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/home")}
          style={{ background: "none", border: "none", color: "#6e5e4c", cursor: "pointer", fontSize: 14 }}
        >
          ← Back
        </button>
        {step < 5 && (
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                background: i <= step ? "#34c97a" : "#241a10",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        )}
        <button
          onClick={() => navigate("/home")}
          style={{ background: "none", border: "none", color: "#6e5e4c", cursor: "pointer", fontSize: 14 }}
        >
          Skip
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px", maxWidth: 480, margin: "0 auto", width: "100%" }}>

        {/* Step 0: Greeting */}
        {step === 0 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontFamily: "Amiri, serif", fontSize: 28, color: "#c9a472", textAlign: "center", marginBottom: 16, direction: "rtl" }}>
              بِسْمِ اللَّهِ
            </div>
            <h1 style={{ fontSize: 26, fontFamily: "DM Sans, sans-serif", fontWeight: 600, textAlign: "center", marginBottom: 8, lineHeight: 1.3 }}>
              Assalamu Alaikum,<br />{name}.
            </h1>
            <p style={{ fontSize: 15, color: "#6e5e4c", textAlign: "center", lineHeight: 1.6, marginBottom: 40 }}>
              Let's begin your day peacefully,<br />one breath at a time.
            </p>
            <button onClick={() => setStep(1)} style={btnStyle}>
              Begin peacefully →
            </button>
          </div>
        )}

        {/* Step 1: Quran Insight */}
        {step === 1 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <p style={{ fontSize: 11, color: "#6e5e4c", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 32 }}>
              Morning reflection
            </p>
            <div style={{
              background: "#16100a", border: "1px solid rgba(52,201,122,0.15)",
              borderRadius: 20, padding: 28, marginBottom: 32, textAlign: "center",
            }}>
              <div style={{ fontFamily: "Amiri, serif", fontSize: 24, color: "#c9a472", direction: "rtl", lineHeight: 1.6, marginBottom: 20 }}>
                {insight.arabic}
              </div>
              <p style={{ fontSize: 15, color: "#f0ece4", lineHeight: 1.7, fontStyle: "italic", marginBottom: 10 }}>
                "{insight.translation}"
              </p>
              <p style={{ fontSize: 12, color: "#6e5e4c" }}>{insight.ref}</p>
            </div>
            <button onClick={() => setStep(2)} style={btnStyle}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Emotional Check-In */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <p style={{ fontSize: 11, color: "#6e5e4c", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 16 }}>
              Emotional check-in
            </p>
            <h2 style={{ fontSize: 22, fontFamily: "DM Sans, sans-serif", fontWeight: 600, textAlign: "center", marginBottom: 8 }}>
              How are you feeling this morning?
            </h2>
            <p style={{ fontSize: 14, color: "#6e5e4c", textAlign: "center", marginBottom: 32 }}>
              Be honest — all feelings are welcome here.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {EMOTIONS.map(em => (
                <button
                  key={em.key}
                  onClick={() => void handleEmotionSelect(em.key)}
                  style={{
                    background: "#16100a", border: "1px solid rgba(52,201,122,0.2)",
                    borderRadius: 14, padding: "16px 12px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1a130d"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(52,201,122,0.5)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "#16100a"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(52,201,122,0.2)"; }}
                >
                  <span style={{ fontSize: 28 }}>{em.emoji}</span>
                  <span style={{ fontSize: 13, color: "#f0ece4", fontWeight: 500 }}>{em.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: AI Reflection */}
        {step === 3 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <p style={{ fontSize: 11, color: "#6e5e4c", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 16 }}>
              A reflection for you
            </p>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>{EMOTIONS.find(e => e.key === emotion)?.emoji}</span>
              <div style={{ fontSize: 14, color: "#6e5e4c", marginTop: 6 }}>
                Feeling {emotion}
              </div>
            </div>
            <div style={{
              background: "#16100a", border: "1px solid rgba(52,201,122,0.15)",
              borderRadius: 20, padding: 24, marginBottom: 32, minHeight: 100,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {loadingReflection ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🌿</div>
                  <p style={{ fontSize: 13, color: "#6e5e4c" }}>Preparing your reflection...</p>
                </div>
              ) : (
                <p style={{ fontSize: 15, color: "#f0ece4", lineHeight: 1.75, textAlign: "center", fontStyle: "italic" }}>
                  {reflection}
                </p>
              )}
            </div>
            {!loadingReflection && (
              <button onClick={() => setStep(4)} style={btnStyle}>
                Continue →
              </button>
            )}
          </div>
        )}

        {/* Step 4: Tiny Spiritual Action */}
        {step === 4 && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <p style={{ fontSize: 11, color: "#6e5e4c", textTransform: "uppercase", letterSpacing: 2, textAlign: "center", marginBottom: 16 }}>
              Your moment of ibadah
            </p>
            <h2 style={{ fontSize: 20, fontFamily: "DM Sans, sans-serif", fontWeight: 600, textAlign: "center", marginBottom: 24 }}>
              {action.label}
            </h2>
            <div style={{
              background: "#16100a", border: "1px solid rgba(184,148,106,0.2)",
              borderRadius: 20, padding: 28, marginBottom: 32, textAlign: "center",
            }}>
              <div style={{ fontFamily: "Amiri, serif", fontSize: 26, color: "#c9a472", direction: "rtl", marginBottom: 16, lineHeight: 1.7 }}>
                {action.arabic}
              </div>
              <p style={{ fontSize: 14, color: "#f0ece4", lineHeight: 1.7 }}>
                {action.dua}
              </p>
            </div>
            <button onClick={() => void handleComplete()} style={btnStyle}>
              I've done this →
            </button>
          </div>
        )}

        {/* Step 5: Completion */}
        {step === 5 && (
          <div style={{ animation: "fadeIn 0.5s ease", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🌿</div>
            <h1 style={{ fontSize: 26, fontFamily: "DM Sans, sans-serif", fontWeight: 600, marginBottom: 12 }}>
              Alhamdulillah
            </h1>
            <p style={{ fontSize: 15, color: "#6e5e4c", lineHeight: 1.7, marginBottom: 8 }}>
              You've completed your peaceful morning.
            </p>
            {morningStreak > 0 && (
              <div style={{
                display: "inline-block", background: "#16100a",
                border: "1px solid rgba(52,201,122,0.3)", borderRadius: 40,
                padding: "10px 24px", margin: "16px 0 32px",
              }}>
                <span style={{ fontSize: 14, color: "#34c97a", fontWeight: 500 }}>
                  {morningStreak === 1 ? "Your first peaceful morning 🌱" : `${morningStreak} peaceful mornings 🌿`}
                </span>
              </div>
            )}
            <p style={{ fontSize: 13, color: "#6e5e4c", marginBottom: 40 }}>
              May Allah bless your day with ease and clarity.
            </p>
            <button onClick={() => navigate("/home")} style={btnStyle}>
              Return home
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: "100%", padding: "16px", background: "#34c97a",
  color: "#09070A", border: "none", borderRadius: 14, fontSize: 15,
  fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
  transition: "opacity 0.2s",
};
