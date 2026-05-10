import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NameOfAllah {
  id: string;
  number: number;
  arabic: string;
  transliteration: string;
  meaningEnglish: string;
  explanation?: string;
}

const NamesOfAllahPage: React.FC = () => {
  const [names, setNames] = useState<NameOfAllah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<NameOfAllah | null>(null);

  useEffect(() => {
    fetch("/api/names-of-allah")
      .then((r) => r.json())
      .then((data) => { setNames(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const dayIndex = Math.floor(Date.now() / 86400000) % 99;
  const todayName = names[dayIndex] ?? null;

  const filtered = names.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      n.meaningEnglish.toLowerCase().includes(search.toLowerCase()) ||
      n.arabic.includes(search)
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)]">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center mb-3">99 Names of Allah</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <Input
            placeholder="Search by meaning or transliteration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--surface)] border-[var(--border)] pl-10 py-5 rounded-xl"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-10 text-[var(--muted)]">Loading names...</div>
        ) : (
          <>
            {!search && todayName && (
              <div
                className="bg-gradient-to-br from-[var(--green)]/20 to-[var(--card)] border-2 border-[var(--gold)]/40 rounded-2xl p-6 text-center cursor-pointer"
                onClick={() => setSelected(todayName)}
              >
                <p className="text-xs text-[var(--gold)] uppercase tracking-widest mb-3 font-cinzel">Today's Name</p>
                <p className="font-amiri text-5xl text-[var(--gold)] mb-3" dir="rtl">{todayName.arabic}</p>
                <p className="text-xl font-semibold text-[var(--green)] italic mb-1">{todayName.transliteration}</p>
                <p className="text-[var(--text)] text-sm leading-relaxed">{todayName.meaningEnglish}</p>
                {todayName.explanation && (
                  <p className="text-[var(--muted)] text-xs mt-3 italic leading-relaxed">{todayName.explanation.slice(0, 150)}...</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {filtered.map((name) => (
                <button
                  key={name.id}
                  onClick={() => setSelected(name)}
                  className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-left hover:border-[var(--gold)]/40 transition-colors w-full"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--card)] flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
                    <span className="text-[var(--gold)] text-xs font-cinzel font-bold">{name.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[var(--green)]">{name.transliteration}</div>
                    <div className="text-xs text-[var(--muted)] truncate">{name.meaningEnglish}</div>
                  </div>
                  <div className="font-amiri text-2xl text-[var(--gold)] flex-shrink-0" dir="rtl">{name.arabic}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div className="bg-[var(--surface)] w-full rounded-t-3xl border-t border-[var(--border)] p-6 space-y-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-[var(--border)] rounded mx-auto mb-2" />
            <div className="text-center">
              <p className="text-xs text-[var(--muted)] font-cinzel mb-1">Name #{selected.number}</p>
              <p className="font-amiri text-6xl text-[var(--gold)] mb-2" dir="rtl">{selected.arabic}</p>
              <p className="text-2xl font-semibold text-[var(--green)] italic mb-1">{selected.transliteration}</p>
              <p className="text-[var(--text)] leading-relaxed">{selected.meaningEnglish}</p>
            </div>
            {selected.explanation && (
              <div className="bg-[var(--card)] rounded-xl p-4">
                <p className="text-sm text-[var(--muted)] leading-relaxed">{selected.explanation}</p>
              </div>
            )}
            <button onClick={() => setSelected(null)} className="w-full py-3 rounded-xl bg-[var(--green)] text-white font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesOfAllahPage;
