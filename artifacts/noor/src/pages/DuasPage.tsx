import React, { useState } from "react";
import { useGetDuas } from "@workspace/api-client-react";
import { Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["All", "Morning", "Evening", "Protection", "Forgiveness", "Salah", "Daily Life", "Sleep", "Travel", "Hardship", "Gratitude", "Family", "Quran"];

const DuasPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: duas, isLoading } = useGetDuas(
    activeCategory !== "All" ? { category: activeCategory } : undefined
  );

  const filteredDuas = duas?.filter(dua => 
    dua.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    dua.meaningEnglish.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-2 px-4 border-b border-[var(--border)] space-y-4">
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

        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === cat 
                  ? 'bg-[var(--green)] text-white border border-[var(--green)]' 
                  : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--green)]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-[var(--muted)] py-10">Loading duas...</div>
        ) : filteredDuas?.length === 0 ? (
          <div className="text-center text-[var(--muted)] py-10">No duas found.</div>
        ) : (
          filteredDuas?.map(dua => (
            <div key={dua.id} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg w-5/6">{dua.title}</h3>
                <button className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors">
                  <Heart size={20} className={dua.isFavorite ? "fill-[var(--danger)] text-[var(--danger)]" : ""} />
                </button>
              </div>
              
              <div className="bg-[var(--card)] p-4 rounded-xl">
                <p className="font-amiri text-2xl text-[var(--gold)] rtl text-right leading-loose mb-3">
                  {dua.arabic}
                </p>
                {dua.transliteration && (
                  <p className="text-sm italic text-[var(--muted)] mb-3">
                    {dua.transliteration}
                  </p>
                )}
                <p className="text-sm leading-relaxed">
                  {dua.meaningEnglish}
                </p>
              </div>
              
              <div className="flex justify-between items-center text-xs text-[var(--muted)]">
                <span className="bg-[var(--card)] px-2 py-1 rounded text-[var(--green)]">{dua.source}</span>
                <span>{dua.category}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DuasPage;