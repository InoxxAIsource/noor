import React, { useState } from "react";
import { useGetDuas, useToggleDuaFavorite } from "@workspace/api-client-react";
import { Search, Heart, X, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["All","Morning","Evening","Protection","Forgiveness","Salah","Daily Life","Sleep","Travel","Hardship","Gratitude","Family","Quran","Food","Anxiety","Grief","Work","Study","Marriage","Children"];

const MOODS = [
  { emoji: "😰", label: "Anxious", tag: "anxiety" },
  { emoji: "🙏", label: "Grateful", tag: "gratitude" },
  { emoji: "💔", label: "Grieving", tag: "grief" },
  { emoji: "😤", label: "Frustrated", tag: "hardship" },
  { emoji: "😊", label: "Joyful", tag: "gratitude" },
  { emoji: "😔", label: "Lonely", tag: "hardship" },
  { emoji: "😵", label: "Overwhelmed", tag: "anxiety" },
  { emoji: "😌", label: "Peaceful", tag: "sleep" },
];

interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration?: string | null;
  meaningEnglish: string;
  source: string;
  category: string;
  tags?: string[];
  audioUrl?: string | null;
  isFavorite: boolean;
}

const DuasPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [selected, setSelected] = useState<Dua | null>(null);

  const { data: duas, isLoading } = useGetDuas(
    activeCategory !== "All" ? { category: activeCategory } : undefined
  );
  const toggleFav = useToggleDuaFavorite();

  const filteredDuas = duas?.filter((dua) => {
    const matchSearch =
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.meaningEnglish.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMood = activeMood
      ? (dua.tags ?? []).some((t) => t.toLowerCase().includes(activeMood)) ||
        dua.category.toLowerCase().includes(activeMood)
      : true;
    return matchSearch && matchMood;
  });

  const handleFav = (dua: Dua, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFav.mutate({ id: dua.id });
  };

  const shareOnWhatsApp = (dua: Dua) => {
    const text = encodeURIComponent(
      `${dua.title}\n${dua.arabic}\n${dua.meaningEnglish}\n\nFrom DeenApp`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-2 px-4 border-b border-[var(--border)] space-y-3">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Duas</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <Input
            placeholder="Search duas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface)] border-[var(--border)] pl-10 py-5 rounded-xl text-md"
          />
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
          {MOODS.map((m) => (
            <button
              key={m.tag + m.label}
              onClick={() => setActiveMood(activeMood === m.tag ? null : m.tag)}
              className={`whitespace-nowrap flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all border flex-shrink-0 ${
                activeMood === m.tag
                  ? "bg-[var(--gold)]/20 border-[var(--gold)] text-[var(--gold)]"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]"
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors border flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-[var(--green)] text-white border-[var(--green)]"
                  : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--green)]/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-[var(--muted)] py-10">Loading duas...</div>
        ) : filteredDuas?.length === 0 ? (
          <div className="text-center text-[var(--muted)] py-10">No duas found.</div>
        ) : (
          filteredDuas?.map((dua) => (
            <div
              key={dua.id}
              onClick={() => setSelected(dua as Dua)}
              className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 space-y-3 shadow-sm cursor-pointer hover:border-[var(--green)]/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-semibold text-base leading-tight">{dua.title}</h3>
                  <span className="text-[10px] text-[var(--green)] bg-[var(--green)]/10 border border-[var(--green)]/20 px-2 py-0.5 rounded-full mt-1 inline-block">{dua.category}</span>
                </div>
                <button
                  onClick={(e) => handleFav(dua as Dua, e)}
                  className="p-2 text-[var(--muted)] hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Heart size={18} className={dua.isFavorite ? "fill-red-400 text-red-400" : ""} />
                </button>
              </div>
              <p className="font-amiri text-xl text-[var(--gold)] rtl text-right leading-loose line-clamp-2" dir="rtl">
                {dua.arabic}
              </p>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div
            className="bg-[var(--surface)] w-full rounded-t-3xl border-t border-[var(--border)] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-1 bg-[var(--border)] rounded flex-1" />
              <button onClick={() => setSelected(null)} className="p-2 text-[var(--muted)]"><X size={20} /></button>
            </div>
            <div>
              <h2 className="font-cinzel text-xl text-[var(--gold)] mb-1">{selected.title}</h2>
              <span className="text-xs text-[var(--green)] bg-[var(--green)]/10 border border-[var(--green)]/20 px-2 py-0.5 rounded-full">{selected.category}</span>
            </div>
            <div className="bg-[var(--card)] rounded-2xl p-5 space-y-4">
              <p className="font-amiri text-3xl text-[var(--gold)] text-right leading-loose" dir="rtl">{selected.arabic}</p>
              {selected.transliteration && (
                <p className="text-sm italic text-[var(--green)] leading-relaxed">{selected.transliteration}</p>
              )}
              <p className="text-sm text-[var(--text)] leading-relaxed">{selected.meaningEnglish}</p>
              <p className="text-xs text-[var(--muted)]">Source: {selected.source}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleFav.mutate({ id: selected.id })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors ${
                  selected.isFavorite
                    ? "border-red-400 text-red-400 bg-red-400/10"
                    : "border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                <Heart size={18} className={selected.isFavorite ? "fill-red-400" : ""} />
                {selected.isFavorite ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => shareOnWhatsApp(selected)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366]"
              >
                <Share2 size={18} />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuasPage;
