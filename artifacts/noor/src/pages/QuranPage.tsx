import React from "react";
import { BookOpen } from "lucide-react";

const QuranPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="relative mb-12">
        <div className="w-48 h-48 rounded-full border-[8px] border-[var(--gold)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', animation: 'crescent-glow 4s infinite alternate' }}></div>
        <BookOpen size={80} className="text-[var(--green)] relative z-10" />
      </div>
      
      <h1 className="font-cinzel text-5xl text-[var(--gold)] mb-4">Al-Quran</h1>
      <div className="w-16 h-1 bg-[var(--green)] mx-auto mb-6"></div>
      
      <p className="text-xl text-[var(--muted)] max-w-md mx-auto leading-relaxed">
        Full Quran recitation and study coming soon.<br/>
        <span className="italic">In sha Allah.</span>
      </p>
    </div>
  );
};

export default QuranPage;