import React, { useState } from "react";
import { useGetBabyNames } from "@workspace/api-client-react";
import { Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";

const NamesPage: React.FC = () => {
  const [activeGender, setActiveGender] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: names, isLoading } = useGetBabyNames({ 
    gender: activeGender,
    search: searchQuery || undefined
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-4 px-4 border-b border-[var(--border)] space-y-4">
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

        <div className="flex justify-center bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)] w-full max-w-xs mx-auto">
          {[
            { id: undefined, label: "All" },
            { id: "boy", label: "Boys" },
            { id: "girl", label: "Girls" }
          ].map(opt => (
            <button
              key={opt.id || 'all'}
              onClick={() => setActiveGender(opt.id)}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                activeGender === opt.id 
                  ? 'bg-[var(--green)] text-white shadow-sm' 
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-[var(--muted)] py-10">Loading names...</div>
        ) : names?.length === 0 ? (
          <div className="text-center text-[var(--muted)] py-10">No names found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {names?.map(name => (
              <div key={name.id} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--card)] rounded-bl-full -z-0"></div>
                
                <div className="flex justify-between items-start relative z-10 mb-3">
                  <div>
                    <h3 className="font-cinzel text-xl text-[var(--green)] font-bold">{name.nameEnglish}</h3>
                    <p className="font-amiri text-3xl text-[var(--gold)] rtl mt-1">{name.nameArabic}</p>
                  </div>
                  <button className="p-2 text-[var(--muted)] hover:text-[var(--danger)] transition-colors">
                    <Heart size={20} className={name.isFavorite ? "fill-[var(--danger)] text-[var(--danger)]" : ""} />
                  </button>
                </div>
                
                <p className="text-sm leading-relaxed mb-4 text-[var(--text)] relative z-10">
                  {name.meaningEnglish}
                </p>
                
                <div className="flex flex-wrap gap-2 relative z-10">
                  <span className="text-[10px] bg-[var(--card)] border border-[var(--border)] px-2 py-1 rounded text-[var(--muted)] uppercase tracking-wider">
                    {name.gender}
                  </span>
                  <span className="text-[10px] bg-[var(--card)] border border-[var(--border)] px-2 py-1 rounded text-[var(--muted)] uppercase tracking-wider">
                    {name.origin}
                  </span>
                  {name.prophetConnection && (
                    <span className="text-[10px] bg-[var(--green)]/20 border border-[var(--green)] px-2 py-1 rounded text-[var(--gold)] uppercase tracking-wider">
                      Prophetic
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NamesPage;