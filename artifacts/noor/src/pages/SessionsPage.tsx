import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetSessions } from "@workspace/api-client-react";
import { useAuth } from "../contexts/AuthContext";
import { Play, Radio } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Azkar", "Quran", "Dhikr", "Sleep", "Duas", "Salah"];

const CATEGORY_ICONS: Record<string, string> = {
  Azkar: "📿",
  Quran: "📖",
  Dhikr: "🤲",
  Sleep: "🌙",
  Duas: "🌿",
  Salah: "🕌",
  All: "✨",
};

function matchesCategory(sessionCategory: string, filter: string): boolean {
  if (filter === "All") return true;
  return sessionCategory.toLowerCase().includes(filter.toLowerCase());
}

const SessionsPage: React.FC = () => {
  const { data: sessions, isLoading } = useGetSessions();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [madhab, setMadhab] = useState("all");

  const filtered = (sessions as Array<Record<string, unknown>> | undefined)?.filter((s) => {
    const catMatch = matchesCategory(s["category"] as string, activeCategory);
    const madhabMatch =
      madhab === "all" ||
      !s["madhab"] ||
      s["madhab"] === "both" ||
      s["madhab"] === madhab;
    return catMatch && madhabMatch;
  }) ?? [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <div className="p-4 flex items-center gap-3 border-b border-[var(--border)]">
        <button onClick={() => navigate(-1)} className="text-[var(--muted)] hover:text-[var(--gold)]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-cinzel text-xl text-[var(--gold)]">Sessions</h1>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar p-4 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors shrink-0 ${
              activeCategory === cat
                ? "bg-[var(--green)] text-white border-[var(--green)]"
                : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--green)]/50"
            }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      {/* Madhab filter */}
      <div className="flex gap-2 px-4 pb-4">
        {["all", "sunni", "shia"].map((m) => (
          <button
            key={m}
            onClick={() => setMadhab(m)}
            className={`px-3 py-1 rounded-full text-xs capitalize border transition-colors ${
              madhab === m
                ? "bg-[var(--gold)] text-black border-[var(--gold)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)]/50"
            }`}
          >
            {m === "all" ? "All Traditions" : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-[var(--muted)]">Loading sessions...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-12">
          <p className="text-4xl mb-4">🌙</p>
          <p className="text-[var(--muted)]">No sessions found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {filtered.map((session) => {
            const hasAudio = !!(session["audioUrl"] as string);
            return (
              <Link
                key={session["id"] as string}
                to={`/player/${session["id"]}`}
                className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--green)]/60 rounded-2xl p-4 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--green)] bg-[var(--green)]/10 px-2 py-0.5 rounded-full">
                    {session["category"] as string}
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] ${hasAudio ? "text-[var(--green)]" : "text-[var(--muted)]"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasAudio ? "bg-[var(--green)]" : "bg-[var(--muted)]"}`} />
                    {hasAudio ? "Audio" : "Read"}
                  </span>
                </div>
                <p className="font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[var(--gold)] transition-colors">
                  {session["title"] as string}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted)]">
                    {Math.ceil((session["durationSeconds"] as number) / 60)} min
                  </span>
                  <div className="w-7 h-7 bg-[var(--green)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--green)] transition-colors">
                    <Play size={12} className="text-[var(--green)] group-hover:text-white ml-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
