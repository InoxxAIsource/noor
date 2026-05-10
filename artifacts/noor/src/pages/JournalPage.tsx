import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

interface JournalEntry {
  sessionId: string;
  sessionTitle: string;
  contentText: string;
  moodBefore: string | null;
  moodAfter: string | null;
  timestamp: number;
}

const MOOD_EMOJIS: Record<string, string> = {
  Anxious: "😰", Grateful: "🙏", Grieving: "💔", Frustrated: "😤",
  Joyful: "😊", Lonely: "😔", Overwhelmed: "😵", Peaceful: "😌",
};

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const token = localStorage.getItem("noor_token");

  useEffect(() => {
    fetch("/api/journal/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data: JournalEntry[]) => setEntries(data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <div className="p-4 flex items-center gap-3 border-b border-[var(--border)]">
        <button onClick={() => navigate(-1)} className="text-[var(--muted)]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-cinzel text-xl text-[var(--gold)]">My Journal</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8 text-[var(--muted)]">Loading entries...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📓</p>
            <p className="font-cinzel text-[var(--gold)] mb-2">No journal entries yet</p>
            <p className="text-[var(--muted)] text-sm max-w-xs mx-auto">
              Complete a session to write your first reflection.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <div
                key={i}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full p-4 text-left flex items-start justify-between gap-3"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.moodBefore && (
                        <span className="text-lg">{MOOD_EMOJIS[entry.moodBefore] || "😶"}</span>
                      )}
                      {entry.moodAfter && entry.moodAfter !== entry.moodBefore && (
                        <>
                          <span className="text-xs text-[var(--muted)]">→</span>
                          <span className="text-lg">{MOOD_EMOJIS[entry.moodAfter] || "😶"}</span>
                        </>
                      )}
                      <span className="text-xs text-[var(--muted)] ml-auto">
                        {format(new Date(entry.timestamp), "MMM d, yyyy")}
                      </span>
                    </div>
                    {entry.sessionTitle && (
                      <p className="text-xs text-[var(--green)] mb-1 truncate">{entry.sessionTitle}</p>
                    )}
                    <p className="text-sm text-[var(--muted)] line-clamp-2">
                      {entry.contentText.substring(0, 100)}
                      {entry.contentText.length > 100 ? "..." : ""}
                    </p>
                  </div>
                  <div className="text-[var(--muted)] shrink-0 mt-1">
                    {expanded === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {expanded === i && (
                  <div className="px-4 pb-4 border-t border-[var(--border)] pt-3">
                    <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                      {entry.contentText}
                    </p>
                    {entry.moodBefore && entry.moodAfter && (
                      <p className="text-xs text-[var(--muted)] mt-3">
                        Mood: {entry.moodBefore} → {entry.moodAfter}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
