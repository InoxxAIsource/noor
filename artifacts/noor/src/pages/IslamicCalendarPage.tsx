import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HijriDate {
  day: string;
  month: { en: string; number: string };
  year: string;
}

const SPECIAL_DATES: Record<string, { label: string; color: string }> = {
  "1-1": { label: "Islamic New Year", color: "text-blue-400 bg-blue-400/20" },
  "10-1": { label: "Ashura", color: "text-teal-400 bg-teal-400/20" },
  "12-3": { label: "Mawlid", color: "text-green-400 bg-green-400/20" },
  "27-7": { label: "Isra Miraj", color: "text-blue-300 bg-blue-300/20" },
  "15-8": { label: "Shab-e-Barat", color: "text-purple-400 bg-purple-400/20" },
  "1-9": { label: "Ramadan Begins", color: "text-[var(--gold)] bg-[var(--gold)]/20" },
  "27-9": { label: "Laylatul Qadr", color: "text-yellow-300 bg-yellow-300/20" },
  "1-10": { label: "Eid ul Fitr", color: "text-[var(--gold)] bg-[var(--gold)]/20" },
  "10-12": { label: "Eid ul Adha", color: "text-[var(--gold)] bg-[var(--gold)]/20" },
};

const HIJRI_MONTHS = [
  "Muharram","Safar","Rabi ul Awwal","Rabi ul Thani",
  "Jumada al-Awwal","Jumada al-Thani","Rajab","Sha'ban",
  "Ramadan","Shawwal","Dhul Qa'dah","Dhul Hijjah",
];

const IslamicCalendarPage: React.FC = () => {
  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`)
      .then((r) => r.json())
      .then((d) => { setHijri(d.data?.hijri); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const upcoming = Object.entries(SPECIAL_DATES).map(([key, val]) => {
    const [day, month] = key.split("-").map(Number);
    return { day, month, ...val, key };
  });

  const today = new Date();
  const gregDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)]">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Islamic Calendar</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="text-center py-10 text-[var(--muted)]">Loading calendar...</div>
        ) : (
          <>
            {hijri && (
              <div className="bg-gradient-to-br from-[var(--green)]/20 to-[var(--card)] border-2 border-[var(--gold)]/40 rounded-2xl p-6 text-center">
                <p className="text-xs text-[var(--gold)] uppercase tracking-widest font-cinzel mb-2">Today's Date</p>
                <p className="font-cinzel text-3xl text-[var(--gold)]">
                  {hijri.day} {hijri.month.en} {hijri.year} AH
                </p>
                <p className="text-[var(--muted)] mt-1">
                  {today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <button className="p-2 text-[var(--muted)]"><ChevronLeft size={20} /></button>
                <h2 className="font-cinzel text-lg text-[var(--gold)]">
                  {today.toLocaleDateString("en", { month: "long", year: "numeric" })}
                </h2>
                <button className="p-2 text-[var(--muted)]"><ChevronRight size={20} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                  <div key={d} className="text-center text-xs text-[var(--muted)] font-semibold py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: gregDays }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === today.getDate();
                  return (
                    <div key={day} className={`aspect-square flex items-center justify-center rounded-full text-sm transition-colors ${
                      isToday
                        ? "bg-[var(--green)] text-white font-bold"
                        : "text-[var(--text)] hover:bg-[var(--card)]"
                    }`}>
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-cinzel text-lg text-[var(--gold)]">Islamic Events This Year</h2>
              {upcoming.map(({ key, label, color, month }) => (
                <div key={key} className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3">
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
                    {HIJRI_MONTHS[month - 1]}
                  </div>
                  <span className="text-[var(--text)] text-sm">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IslamicCalendarPage;
