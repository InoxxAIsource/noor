import React, { useState } from "react";
import { 
  useGetPrayerTimes, 
  useGetSalahLog, 
  useLogSalah 
} from "@workspace/api-client-react";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrayerTimesPage: React.FC = () => {
  const { user } = useAuth();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  
  const { data: prayerData, isLoading: loadingPrayers } = useGetPrayerTimes({ city: user?.city || 'London', date: todayStr });
  const { data: logData, refetch: refetchLog } = useGetSalahLog({ date: todayStr });
  const logSalahMutation = useLogSalah();

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState("");

  const handleTogglePrayer = (prayerName: string, isLogged: boolean) => {
    if (isLogged) return; // For MVP, we don't un-log easily
    setSelectedPrayer(prayerName);
    setRatingModalOpen(true);
  };

  const submitLog = (rating: number) => {
    logSalahMutation.mutate(
      { data: { prayer: selectedPrayer, date: todayStr, khushooRating: rating } },
      {
        onSuccess: () => {
          refetchLog();
          setRatingModalOpen(false);
        }
      }
    );
  };

  const loggedCount = logData?.prayers.length || 0;

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
            
            return (
              <div 
                key={pt.name} 
                className={`bg-[var(--surface)] p-5 rounded-2xl border ${isLogged ? 'border-[var(--green)]/50' : 'border-[var(--border)]'} flex items-center justify-between transition-colors`}
              >
                <div className="flex flex-col flex-1">
                  <span className="font-amiri text-2xl text-[var(--gold)] rtl text-left pr-4">{pt.arabicName}</span>
                  <span className="font-semibold text-lg">{pt.name}</span>
                </div>
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
            );
          })}
        </div>
      )}

      {/* Khushoo Rating Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-cinzel text-xl text-[var(--gold)] text-center mb-2">Log {selectedPrayer}</h3>
            <p className="text-center text-[var(--muted)] text-sm mb-6">How was your focus (Khushoo) during this prayer?</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map(rating => (
                <button 
                  key={rating}
                  onClick={() => submitLog(rating)}
                  className="w-12 h-12 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--gold)] hover:bg-[var(--green)] hover:text-white hover:border-[var(--green)] transition-colors text-xl"
                >
                  ⭐
                </button>
              ))}
            </div>
            
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