import React, { useState } from "react";
import { 
  useGetPrayerTimes, 
  useGetSalahLog, 
  useLogSalah 
} from "@workspace/api-client-react";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { CheckCircle2, Circle, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const RAKAAT_INFO: Record<string, { rows: Array<{ label: string; count: number; color: string }> }> = {
  Fajr: { rows: [
    { label: "Sunnah (before)", count: 2, color: "text-[var(--gold)]" },
    { label: "Farz", count: 2, color: "text-[var(--green)]" },
  ]},
  Dhuhr: { rows: [
    { label: "Sunnah (before)", count: 4, color: "text-[var(--gold)]" },
    { label: "Farz", count: 4, color: "text-[var(--green)]" },
    { label: "Sunnah (after)", count: 2, color: "text-[var(--gold)]" },
    { label: "Nafl", count: 2, color: "text-[var(--muted)]" },
  ]},
  Asr: { rows: [
    { label: "Sunnah (before)", count: 4, color: "text-[var(--gold)]" },
    { label: "Farz", count: 4, color: "text-[var(--green)]" },
  ]},
  Maghrib: { rows: [
    { label: "Farz", count: 3, color: "text-[var(--green)]" },
    { label: "Sunnah (after)", count: 2, color: "text-[var(--gold)]" },
    { label: "Nafl", count: 2, color: "text-[var(--muted)]" },
  ]},
  Isha: { rows: [
    { label: "Sunnah (before)", count: 4, color: "text-[var(--gold)]" },
    { label: "Farz", count: 4, color: "text-[var(--green)]" },
    { label: "Sunnah (after)", count: 2, color: "text-[var(--gold)]" },
    { label: "Nafl", count: 2, color: "text-[var(--muted)]" },
    { label: "Witr", count: 3, color: "text-[#9b59b6]" },
  ]},
};

const PrayerTimesPage: React.FC = () => {
  const { user } = useAuth();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  
  const { data: prayerData, isLoading: loadingPrayers } = useGetPrayerTimes({ city: user?.city || 'London', date: todayStr });
  const { data: logData, refetch: refetchLog } = useGetSalahLog({ date: todayStr });
  const logSalahMutation = useLogSalah();

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState("");
  const [rating, setRating] = useState(3);
  const [note, setNote] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [expandedPrayer, setExpandedPrayer] = useState<string | null>(null);

  const handleTogglePrayer = (prayerName: string, isLogged: boolean) => {
    if (isLogged) return;
    setSelectedPrayer(prayerName);
    setRating(3);
    setNote("");
    setHoverRating(0);
    setRatingModalOpen(true);
  };

  const submitLog = () => {
    logSalahMutation.mutate(
      { data: { prayer: selectedPrayer, date: todayStr, khushooRating: rating, note: note || undefined } },
      {
        onSuccess: () => {
          refetchLog();
          setRatingModalOpen(false);
        }
      }
    );
  };

  const loggedCount = logData?.prayers.length || 0;

  const PRAYER_LABELS: Record<string, string> = {
    1: "Distracted",
    2: "Somewhat focused",
    3: "Focused",
    4: "Very focused",
    5: "Full khushoo",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6 pb-24 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] mb-2">Daily Salah</h1>
        <p className="text-[var(--muted)] text-sm">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </div>

      <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] mb-8 flex justify-between items-center shadow-lg">
        <div>
          <p className="text-sm text-[var(--muted)]">Completed Today</p>
          <p className="font-cinzel text-2xl text-[var(--gold)]">{loggedCount} / 5</p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-2 h-8 rounded-full ${i < loggedCount ? 'bg-[var(--green)]' : 'bg-[var(--card)]'}`}></div>
          ))}
        </div>
      </div>

      {loadingPrayers ? (
        <div className="text-center text-[var(--muted)] py-10">Loading prayer times...</div>
      ) : (
        <div className="space-y-4">
          {prayerData?.times?.map((pt) => {
            const isLogged = logData?.prayers.includes(pt.name) || false;
            const isExpanded = expandedPrayer === pt.name;
            const rakaatInfo = RAKAAT_INFO[pt.name];
            
            return (
              <div 
                key={pt.name} 
                className={`bg-[var(--surface)] rounded-2xl border ${isLogged ? 'border-[var(--green)]/50' : 'border-[var(--border)]'} overflow-hidden transition-all`}
              >
                <div className="p-5 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedPrayer(isExpanded ? null : pt.name)}
                    className="flex flex-col flex-1 text-left focus:outline-none"
                  >
                    <span className="font-amiri text-2xl text-[var(--gold)] rtl text-left pr-4">{pt.arabicName}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{pt.name}</span>
                      <ChevronDown
                        size={14}
                        className={`text-[var(--muted)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xl">{pt.time}</span>
                    <button 
                      onClick={() => handleTogglePrayer(pt.name, isLogged)}
                      disabled={isLogged}
                      className="p-1 focus:outline-none"
                    >
                      {isLogged ? (
                        <CheckCircle2 size={32} className="text-[var(--green)]" />
                      ) : (
                        <Circle size={32} className="text-[var(--muted)] hover:text-[var(--gold)]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Rakaat breakdown slide-down */}
                {isExpanded && rakaatInfo && (
                  <div className="border-t border-[var(--border)] bg-[var(--card)] px-5 py-4 animate-fade-in">
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">Rakaat Breakdown</p>
                    <div className="space-y-2">
                      {rakaatInfo.rows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text)]">{row.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {Array.from({ length: row.count }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${row.color.replace("text-", "bg-").replace("[var(--gold)]", "[var(--gold)]").replace("[var(--green)]", "[var(--green)]").replace("[var(--muted)]", "[var(--muted)]")}`}
                                  style={{
                                    backgroundColor: row.color.includes("gold") ? "var(--gold)" : row.color.includes("green") ? "var(--green)" : row.color.includes("9b59b6") ? "#9b59b6" : "var(--muted)"
                                  }}
                                />
                              ))}
                            </div>
                            <span className={`text-sm font-semibold ${row.color}`}>{row.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-3">
                      Total: {rakaatInfo.rows.reduce((s, r) => s + r.count, 0)} rakaat
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Khushoo Rating Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-cinzel text-xl text-[var(--gold)] text-center mb-1">Log {selectedPrayer}</h3>
            <p className="text-center text-[var(--muted)] text-sm mb-5">How was your khushoo (focus)?</p>
            
            {/* Star rating */}
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  onMouseEnter={() => setHoverRating(r)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${r <= (hoverRating || rating) ? "text-[var(--gold)] fill-[var(--gold)]" : "text-[var(--muted)]"}`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-[var(--green)] mb-5 h-4">
              {PRAYER_LABELS[hoverRating || rating] || ""}
            </p>

            {/* Note */}
            <div className="mb-5">
              <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">
                What distracted me? (optional)
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Write a short reflection..."
                rows={2}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--green)] resize-none"
              />
            </div>

            <Button
              onClick={submitLog}
              disabled={logSalahMutation.isPending}
              className="w-full bg-[var(--green)] hover:bg-[var(--green)]/90 text-white font-semibold rounded-xl mb-2"
            >
              {logSalahMutation.isPending ? "Saving..." : "Save Prayer"}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-[var(--muted)]"
              onClick={() => setRatingModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerTimesPage;
