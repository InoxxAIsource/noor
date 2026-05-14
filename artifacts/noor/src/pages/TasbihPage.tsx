import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";

const DHIKR_OPTIONS = [
  { id: "SubhanAllah",   arabic: "سُبْحَانَ ٱللَّٰهِ",   target: 33 },
  { id: "Alhamdulillah",arabic: "ٱلْحَمْدُ لِلَّٰهِ",   target: 33 },
  { id: "Allahu Akbar", arabic: "ٱللَّٰهُ أَكْبَرُ",    target: 34 },
];

const BEAD_COUNT = 33;

const TasbihPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDhikr = searchParams.get("dhikr") || "SubhanAllah";
  const [activeDhikr, setActiveDhikr] = useState(initialDhikr);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const active = DHIKR_OPTIONS.find((d) => d.id === activeDhikr) ?? DHIKR_OPTIONS[0];
  const target = active.target;
  const progress = count / target;

  const handleTap = useCallback(() => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 150);
    setCount((c) => {
      const next = c + 1;
      setSessionTotal((s) => s + 1);
      if (next >= target) {
        setRounds((r) => r + 1);
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 800);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        return 0;
      }
      return next;
    });
  }, [target]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === "Space") handleTap(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleTap]);

  const handleReset = () => { setCount(0); setRounds(0); setSessionTotal(0); };

  const handleSelectDhikr = (id: string) => {
    setActiveDhikr(id);
    setSearchParams({ dhikr: id });
    setCount(0);
    setRounds(0);
  };

  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 100;
  const circumference = 2 * Math.PI * r;
  const strokeDash = circumference * progress;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col animate-fade-in select-none">
      <div className="pt-8 px-6">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center mb-6">Digital Tasbih</h1>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4 justify-center">
          {DHIKR_OPTIONS.map((opt) => (
            <button key={opt.id} onClick={() => handleSelectDhikr(opt.id)}
              className={`px-5 py-3 rounded-full whitespace-nowrap text-sm font-semibold transition-colors border ${
                activeDhikr === opt.id
                  ? "bg-[var(--green)] border-[var(--green)] text-white"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]"
              }`}>
              {opt.id}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        <div className="absolute top-0 right-6 text-right">
          <p className="text-[var(--muted)] text-xs uppercase tracking-wider">Rounds</p>
          <p className="font-cinzel text-2xl text-[var(--gold)]">{rounds}</p>
        </div>
        <div className="absolute top-0 left-6">
          <p className="text-[var(--muted)] text-xs uppercase tracking-wider">Total</p>
          <p className="font-cinzel text-2xl text-[var(--gold)]">{sessionTotal}</p>
        </div>
        <button onClick={handleReset} className="absolute top-0 left-1/2 -translate-x-1/2 mt-1 p-2 text-[var(--muted)] hover:text-[var(--danger)] transition-colors">
          <RotateCcw size={20} />
        </button>

        <div className="text-center mb-6 h-24 flex flex-col justify-end">
          <p className="font-amiri text-4xl text-white mb-2 rtl" dir="rtl">{active.arabic}</p>
          <p className="text-[var(--muted)] text-sm">{active.id}</p>
        </div>

        <div className="relative" style={{ width: size, height: size }}>
          {Array.from({ length: BEAD_COUNT }).map((_, i) => {
            const angle = (i / BEAD_COUNT) * 2 * Math.PI - Math.PI / 2;
            const beadR = 128;
            const bx = cx + beadR * Math.cos(angle);
            const by = cy + beadR * Math.sin(angle);
            const lit = i < count;
            return (
              <div key={i} className="absolute w-3 h-3 rounded-full transition-all duration-100"
                style={{
                  left: bx - 6, top: by - 6,
                  backgroundColor: lit ? "var(--green)" : "rgba(52,201,122,0.15)",
                  boxShadow: lit ? "0 0 6px rgba(52,201,122,0.6)" : "none",
                }}
              />
            );
          })}

          <svg width={size} height={size} className="absolute inset-0">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(52,201,122,0.1)" strokeWidth="8" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--green)" strokeWidth="8"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: "stroke-dasharray 0.15s ease" }}
            />
          </svg>

          <button
            onClick={handleTap}
            className={`absolute inset-0 m-8 rounded-full bg-[var(--surface)] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(52,201,122,0.15)] transition-all duration-150 border-2 ${
              isPulsing
                ? "scale-95 shadow-[0_0_60px_rgba(52,201,122,0.5)] border-[var(--gold)]"
                : justCompleted
                ? "scale-105 border-[var(--gold)] bg-[var(--gold)]/10"
                : "scale-100 border-[var(--green)]/40"
            }`}
          >
            <span className="font-cinzel text-7xl text-[var(--gold)]">{count}</span>
            <span className="text-[var(--muted)] text-sm mt-1">{count} / {target}</span>
          </button>
        </div>

        <p className="text-[var(--muted)] mt-8 text-xs">Tap the circle or press Space to count</p>
      </div>
    </div>
  );
};

export default TasbihPage;
