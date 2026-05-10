import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";

const DHIKR_OPTIONS = [
  { id: "SubhanAllah", arabic: "سُبْحَانَ ٱللَّٰهِ" },
  { id: "Alhamdulillah", arabic: "ٱلْحَمْدُ لِلَّٰهِ" },
  { id: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ" },
];

const TasbihPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDhikr = searchParams.get("dhikr") || "SubhanAllah";
  
  const [activeDhikr, setActiveDhikr] = useState(initialDhikr);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  const activeArabic = DHIKR_OPTIONS.find(d => d.id === activeDhikr)?.arabic || "";

  const handleTap = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 150);
    
    if (count === 33) {
      setCount(1);
      setRounds(r => r + 1);
    } else {
      setCount(c => c + 1);
    }
  };

  const handleReset = () => {
    setCount(0);
    setRounds(0);
  };

  const handleSelectDhikr = (id: string) => {
    setActiveDhikr(id);
    setSearchParams({ dhikr: id });
    setCount(0);
    setRounds(0);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col animate-fade-in">
      <div className="pt-8 px-6">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center mb-6">Digital Tasbih</h1>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-8 justify-center">
          {DHIKR_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSelectDhikr(opt.id)}
              className={`px-5 py-3 rounded-full whitespace-nowrap text-sm font-semibold transition-colors border ${
                activeDhikr === opt.id 
                  ? 'bg-[var(--green)] border-[var(--green)] text-white' 
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)]'
              }`}
            >
              {opt.id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-4 right-6 text-right">
          <p className="text-[var(--muted)] text-sm uppercase tracking-wider">Rounds</p>
          <p className="font-cinzel text-2xl text-[var(--gold)]">{rounds}</p>
        </div>

        <button 
          onClick={handleReset}
          className="absolute top-4 left-6 p-2 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
        >
          <RotateCcw size={24} />
        </button>

        <div className="text-center mb-12 h-32 flex flex-col justify-end">
          <p className="font-amiri text-5xl text-white mb-4 rtl">{activeArabic}</p>
          <p className="text-xl text-[var(--muted)]">{activeDhikr}</p>
        </div>

        <button 
          onClick={handleTap}
          className={`w-64 h-64 rounded-full bg-[var(--surface)] border-[4px] border-[var(--green)] flex items-center justify-center shadow-[0_0_40px_rgba(0,165,80,0.15)] transition-transform duration-150 ${isPulsing ? 'scale-95 shadow-[0_0_60px_rgba(0,165,80,0.4)] border-[var(--gold)]' : 'scale-100 hover:scale-[1.02]'}`}
        >
          <span className="font-cinzel text-8xl text-[var(--gold)] select-none">{count}</span>
        </button>
        
        <p className="text-[var(--muted)] mt-12 text-sm">Tap anywhere in the circle to count</p>
      </div>
    </div>
  );
};

export default TasbihPage;