import React, { useState, useRef } from "react";
import { useGetBabyNames, useToggleNameFavorite } from "@workspace/api-client-react";
import { Search, Heart, X, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const CATEGORIES = ["All", "Quranic", "Prophet", "Sahaba", "Rare", "Trending"];

interface Name {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  nameUrdu?: string | null;
  gender: string;
  meaningEnglish: string;
  origin: string;
  categories?: string[];
  quranReference?: string | null;
  prophetConnection?: string | null;
  isFavorite: boolean;
  isForbidden?: boolean;
  trending2025?: boolean;
}

const NamesPage: React.FC = () => {
  const [activeGender, setActiveGender] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<Name | null>(null);
  const letterBarRef = useRef<HTMLDivElement>(null);

  const { data: names, isLoading } = useGetBabyNames({
    gender: activeGender,
    search: searchQuery || undefined,
  });

  const toggleFav = useToggleNameFavorite();

  const filtered = names?.filter((n) => {
    const matchLetter = activeLetter ? n.nameEnglish.toUpperCase().startsWith(activeLetter) : true;
    const matchCat =
      activeCategory === "All"
        ? true
        : activeCategory === "Trending"
        ? (n as Name).trending2025
        : (n.categories ?? []).some((c) => c.toLowerCase().includes(activeCategory.toLowerCase()));
    return matchLetter && matchCat;
  });

  const shareNameCard = (n: Name) => {
    const text = encodeURIComponent(`${n.nameArabic} — ${n.nameEnglish}\n${n.meaningEnglish}\n\nFrom Noor app`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)] space-y-3">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Islamic Names</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <Input
            placeholder="Search names or meanings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface)] border-[var(--border)] pl-10 py-5 rounded-xl text-md"
          />
        </div>
        <div className="flex justify-center bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
          {[{ id: undefined, label: "All" }, { id: "boy", label: "Boys" }, { id: "girl", label: "Girls" }].map((opt) => (
            <button key={opt.id ?? "all"} onClick={() => setActiveGender(opt.id)}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${activeGender === opt.id ? "bg-[var(--green)] text-white" : "text-[var(--muted)]"}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border flex-shrink-0 transition-all ${
                activeCategory === c ? "bg-[var(--green)] text-white border-[var(--green)]" : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]"
              }`}>{c}</button>
          ))}
        </div>
        <div ref={letterBarRef} className="flex overflow-x-auto hide-scrollbar gap-1">
          <button onClick={() => setActiveLetter(null)}
            className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${!activeLetter ? "bg-[var(--green)] text-white" : "text-[var(--muted)]"}`}>All</button>
          {LETTERS.map((l) => (
            <button key={l} onClick={() => setActiveLetter(activeLetter === l ? null : l)}
              className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                activeLetter === l ? "bg-[var(--gold)] text-black" : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-[var(--muted)] py-10">Loading names...</div>
        ) : filtered?.length === 0 ? (
          <div className="text-center text-[var(--muted)] py-10">No names found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered?.map((name) => (
              <div
                key={name.id}
                onClick={() => setSelected(name as Name)}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 shadow-sm relative overflow-hidden cursor-pointer hover:border-[var(--green)]/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-cinzel text-base text-[var(--green)] font-bold leading-tight">{name.nameEnglish}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav.mutate({ id: name.id }); }}
                    className="p-1 text-[var(--muted)] hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Heart size={16} className={name.isFavorite ? "fill-red-400 text-red-400" : ""} />
                  </button>
                </div>
                <p className="font-amiri text-2xl text-[var(--gold)] text-right mb-2" dir="rtl">{name.nameArabic}</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">{name.meaningEnglish}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[9px] bg-[var(--card)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--muted)] uppercase">{name.gender}</span>
                  {name.prophetConnection && (
                    <span className="text-[9px] bg-[var(--green)]/20 border border-[var(--green)]/40 px-1.5 py-0.5 rounded text-[var(--gold)] uppercase">Prophetic</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div className="bg-[var(--surface)] w-full rounded-t-3xl border-t border-[var(--border)] p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-1 bg-[var(--border)] rounded flex-1" />
              <button onClick={() => setSelected(null)} className="p-2 text-[var(--muted)]"><X size={20} /></button>
            </div>
            <div className="text-center">
              <p className="font-amiri text-6xl text-[var(--gold)] mb-2" dir="rtl">{selected.nameArabic}</p>
              <h2 className="font-cinzel text-2xl text-[var(--text)]">{selected.nameEnglish}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${
                selected.gender === "boy" ? "border-blue-400/40 text-blue-400 bg-blue-400/10" : "border-pink-400/40 text-pink-400 bg-pink-400/10"
              }`}>{selected.gender}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Meaning", val: selected.meaningEnglish },
                { label: "Origin", val: selected.origin },
                selected.quranReference ? { label: "Quran Ref", val: selected.quranReference } : null,
                selected.prophetConnection ? { label: "Prophet Connection", val: selected.prophetConnection } : null,
              ].filter(Boolean).map((item) => item && (
                <div key={item.label} className="bg-[var(--card)] rounded-xl p-3">
                  <p className="text-xs text-[var(--muted)] mb-1">{item.label}</p>
                  <p className="text-sm text-[var(--text)] leading-relaxed">{item.val}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleFav.mutate({ id: selected.id })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${
                  selected.isFavorite ? "border-red-400 text-red-400 bg-red-400/10" : "border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                <Heart size={18} className={selected.isFavorite ? "fill-red-400" : ""} />
                {selected.isFavorite ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => shareNameCard(selected)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366]"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesPage;
