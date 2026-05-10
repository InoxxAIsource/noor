import React from "react";
import { Link } from "react-router-dom";
import { useGetSessions } from "@workspace/api-client-react";

const MoodPage: React.FC = () => {
  const { data: sessions } = useGetSessions();

  // Find first session of required categories as fallback
  const getSessionId = (category: string) => {
    return sessions?.find(s => s.category.toLowerCase().includes(category.toLowerCase()))?.id || "placeholder";
  };

  const moodCards = [
    { mood: "Peace", icon: "🕊️", desc: "Breathing & Dhikr", link: `/player/${getSessionId('azkar')}` },
    { mood: "Focus", icon: "🧠", desc: "Quran Reflection", link: `/player/${getSessionId('quran')}` },
    { mood: "Strength", icon: "💪", desc: "Dua for Hardship", link: `/duas` },
    { mood: "Gratitude", icon: "🤍", desc: "Gratitude Dhikr", link: `/tasbih?dhikr=Alhamdulillah` },
    { mood: "Sleep", icon: "🌙", desc: "Islamic Stories", link: `/player/${getSessionId('sleep')}` },
    { mood: "Guidance", icon: "🧭", desc: "SubhanAllah x33", link: `/tasbih?dhikr=SubhanAllah` },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 p-6 animate-fade-in flex flex-col">
      <div className="mt-8 mb-12 text-center">
        <h1 className="font-cinzel text-4xl text-[var(--gold)] leading-tight">What do you need today?</h1>
        <p className="text-[var(--muted)] mt-4">Select how you feel to find guidance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {moodCards.map((card, i) => (
          <Link 
            key={i} 
            to={card.link}
            className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--green)] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-[0_0_20px_rgba(0,165,80,0.15)] transition-all group"
          >
            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">{card.icon}</span>
            <h3 className="font-cinzel text-xl font-bold text-white mb-1">{card.mood}</h3>
            <p className="text-xs text-[var(--muted)] group-hover:text-[var(--gold)] transition-colors">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MoodPage;