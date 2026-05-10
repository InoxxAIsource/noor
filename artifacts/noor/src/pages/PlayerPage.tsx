import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSession, useLogProgress, getGetSessionQueryKey } from "@workspace/api-client-react";
import { Play, Pause, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useGetSession(id || "", { query: { enabled: !!id, queryKey: getGetSessionQueryKey(id || "") } });
  const logProgress = useLogProgress();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [showMoodAfter, setShowMoodAfter] = useState(false);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && session) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= session.durationSeconds) {
            setIsPlaying(false);
            setCompleted(true);
            setShowMoodAfter(true);
            return session.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, session]);

  const togglePlay = () => {
    if (moodBefore === null) return; // Force setting mood before play
    setIsPlaying(!isPlaying);
  };

  const handleFinish = () => {
    if (!session || !id) return;
    
    logProgress.mutate(
      { 
        data: {
          sessionId: id,
          durationListened: progress,
          moodBefore,
          moodAfter,
          category: session.category
        }
      },
      {
        onSuccess: (data) => {
          alert(`MashaAllah! Current Streak: ${data.streak.currentStreak} days 🔥`);
          navigate("/home");
        }
      }
    );
  };

  if (isLoading || !session) {
    return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] font-cinzel">Loading...</div>;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col animate-fade-in">
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 text-[var(--muted)] hover:text-[var(--gold)] transition-colors">
          <ChevronLeft size={28} />
        </button>
        <span className="text-xs uppercase tracking-widest text-[var(--green)] bg-[var(--green)]/10 px-3 py-1 rounded-full border border-[var(--green)]/30">
          {session.category}
        </span>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto w-full">
        {session.scriptureArabic && (
          <div className="mb-12 animate-fade-in">
            <p className="font-amiri text-4xl text-[var(--gold)] leading-loose rtl mb-6">
              {session.scriptureArabic}
            </p>
            {session.scriptureText && (
              <p className="text-lg italic text-[var(--muted)] mb-4">
                "{session.scriptureText}"
              </p>
            )}
            {session.scriptureRef && (
              <p className="text-sm text-[var(--green)]">
                — {session.scriptureRef}
              </p>
            )}
          </div>
        )}

        <h1 className="font-cinzel text-3xl font-bold mb-2 text-white">{session.title}</h1>
        {session.guideName && <p className="text-[var(--muted)] mb-12">Guided by {session.guideName}</p>}

        {/* Mood Before Guard */}
        {moodBefore === null ? (
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] w-full max-w-sm mb-8 animate-fade-in">
            <p className="font-cinzel text-[var(--gold)] mb-4">How are you feeling right now?</p>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map(m => (
                <button 
                  key={m}
                  onClick={() => setMoodBefore(m)}
                  className="w-12 h-12 rounded-full bg-[var(--card)] hover:bg-[var(--green)] border border-[var(--border)] transition-colors text-xl"
                >
                  {m === 1 ? '😔' : m === 2 ? '😕' : m === 3 ? '😐' : m === 4 ? '🙂' : '😊'}
                </button>
              ))}
            </div>
          </div>
        ) : showMoodAfter ? (
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--green)] w-full max-w-sm mb-8 animate-fade-in">
            <p className="font-cinzel text-[var(--gold)] mb-4">Alhamdulillah. How do you feel now?</p>
            <div className="flex justify-between gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(m => (
                <button 
                  key={m}
                  onClick={() => setMoodAfter(m)}
                  className={`w-12 h-12 rounded-full ${moodAfter === m ? 'bg-[var(--green)] border-[var(--gold)]' : 'bg-[var(--card)]'} hover:bg-[var(--green)] border border-[var(--border)] transition-colors text-xl`}
                >
                  {m === 1 ? '😔' : m === 2 ? '😕' : m === 3 ? '😐' : m === 4 ? '🙂' : '😊'}
                </button>
              ))}
            </div>
            <Button 
              onClick={handleFinish} 
              disabled={moodAfter === null || logProgress.isPending}
              className="w-full bg-[var(--green)] text-white py-6 text-lg rounded-xl hover:bg-[var(--green)]/90"
            >
              {logProgress.isPending ? "Logging..." : "Complete Session"}
            </Button>
          </div>
        ) : (
          /* Player Controls */
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <input 
                type="range" 
                min="0" 
                max={session.durationSeconds} 
                value={progress}
                readOnly
                className="w-full h-1 bg-[var(--card)] rounded-lg appearance-none cursor-default accent-[var(--green)]"
              />
              <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(session.durationSeconds)}</span>
              </div>
            </div>

            <button 
              onClick={togglePlay}
              className="w-24 h-24 bg-[var(--green)] rounded-full flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(0,165,80,0.3)] hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={40} className="fill-current" /> : <Play size={40} className="ml-2 fill-current" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerPage;