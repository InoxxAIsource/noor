import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetSession, useGetSessions, getGetSessionQueryKey } from "@workspace/api-client-react";
import { useAuth } from "../contexts/AuthContext";
import { Howl } from "howler";
import { ChevronLeft, Play, Pause, Share2, BookOpen, Gift, Gauge } from "lucide-react";

const MOODS = [
  { label: "Anxious", emoji: "😰" },
  { label: "Grateful", emoji: "🙏" },
  { label: "Grieving", emoji: "💔" },
  { label: "Frustrated", emoji: "😤" },
  { label: "Joyful", emoji: "😊" },
  { label: "Lonely", emoji: "😔" },
  { label: "Overwhelmed", emoji: "😵" },
  { label: "Peaceful", emoji: "😌" },
];

const RAIN_URL = "https://cdn.pixabay.com/audio/2022/03/10/audio_e9b83e60fa.mp3";

function ConfettiEffect() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 0.8 + Math.random() * 0.8,
        color: i % 3 === 0 ? "#ffd700" : i % 3 === 1 ? "#00a550" : "#e8f5e8",
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            backgroundColor: p.color,
            animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: session, isLoading } = useGetSession(id || "", {
    query: { enabled: !!id, queryKey: getGetSessionQueryKey(id || "") },
  });
  const { data: allSessions } = useGetSessions();

  const [moodBefore, setMoodBefore] = useState<string | null>(null);
  const [moodAfter, setMoodAfter] = useState<string | null>(null);
  const [phase, setPhase] = useState<"moodBefore" | "playing" | "complete">("moodBefore");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [rainOn, setRainOn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [journalText, setJournalText] = useState("");
  const [journalPrompts, setJournalPrompts] = useState<string[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [journalSaved, setJournalSaved] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [giftLink, setGiftLink] = useState("");

  const soundRef = useRef<Howl | null>(null);
  const rainRef = useRef<Howl | null>(null);
  const seekInterval = useRef<NodeJS.Timeout | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("noor_token") : null;

  const s = session as Record<string, unknown> | undefined;
  const audioUrl = s?.["audioUrl"] as string | undefined;
  const hasAudio = !!audioUrl;

  useEffect(() => {
    if (hasAudio && audioUrl && phase === "playing") {
      const sound = new Howl({
        src: [audioUrl],
        html5: true,
        onplay: () => {
          setIsPlaying(true);
          seekInterval.current = setInterval(() => {
            setCurrentTime(sound.seek() as number);
          }, 500);
        },
        onpause: () => {
          setIsPlaying(false);
          if (seekInterval.current) clearInterval(seekInterval.current);
        },
        onend: () => {
          setIsPlaying(false);
          if (seekInterval.current) clearInterval(seekInterval.current);
          handleComplete();
        },
        onload: () => setDuration(sound.duration()),
      });
      soundRef.current = sound;
      return () => {
        sound.unload();
        if (seekInterval.current) clearInterval(seekInterval.current);
      };
    }
    return undefined;
  }, [phase, audioUrl, hasAudio]);

  useEffect(() => {
    if (soundRef.current) soundRef.current.rate(playbackRate);
  }, [playbackRate]);

  useEffect(() => {
    if (rainOn) {
      const rain = new Howl({ src: [RAIN_URL], loop: true, volume: 0.3, html5: true });
      rain.play();
      rainRef.current = rain;
    } else {
      rainRef.current?.stop();
      rainRef.current = null;
    }
    return () => { rainRef.current?.stop(); };
  }, [rainOn]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundRef.current?.seek(val);
    setCurrentTime(val);
  };

  const handleComplete = async () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);

    // Log progress
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sessionId: id,
          durationListened: duration || s?.["durationSeconds"] || 0,
          moodBefore: 3,
          moodAfter: 3,
          category: s?.["category"] || "",
        }),
      });
    } catch { /* ignore */ }

    setPhase("complete");
    fetchJournalPrompts();
  };

  const fetchJournalPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const res = await fetch("/api/ai/journal-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sessionTitle: s?.["title"],
          scriptureText: s?.["scriptureText"],
          moodBefore,
          moodAfter,
          userName: user?.name,
        }),
      });
      const data = await res.json() as { questions: string[] };
      setJournalPrompts(data.questions || []);
    } catch {
      setJournalPrompts([
        "What did you notice about your heart during this session?",
        "How does this connect to something you're facing right now?",
        "What one intention will you carry forward tomorrow?",
      ]);
    } finally {
      setLoadingPrompts(false);
    }
  };

  const saveJournal = async () => {
    if (!journalText.trim()) return;
    try {
      await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sessionId: id,
          sessionTitle: s?.["title"],
          contentText: journalText,
          moodBefore,
          moodAfter,
        }),
      });
      setJournalSaved(true);
    } catch { /* ignore */ }
  };

  const generateGiftLink = async () => {
    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sessionId: id,
          senderName: user?.name || "A friend",
          message: giftMessage,
        }),
      });
      const data = await res.json() as { token: string; url: string };
      const base = window.location.origin;
      setGiftLink(`${base}${data.url}`);
    } catch { /* ignore */ }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

  const relatedSessions = (allSessions as Array<Record<string, unknown>> | undefined)
    ?.filter((rs) => rs["category"] === s?.["category"] && rs["id"] !== id)
    .slice(0, 3) || [];

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] font-cinzel text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      {showConfetti && <ConfettiEffect />}

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Header */}
      <div className="p-4 flex items-center justify-between shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 text-[var(--muted)] hover:text-[var(--gold)]">
          <ChevronLeft size={28} />
        </button>
        <span className="text-xs uppercase tracking-widest text-[var(--green)] bg-[var(--green)]/10 px-3 py-1 rounded-full border border-[var(--green)]/30">
          {s?.["category"] as string}
        </span>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto pb-8 px-6">
        {/* Scripture display */}
        {!!(s?.["scriptureArabic"]) && (
          <div className="text-center mb-8">
            <p className="font-amiri text-3xl text-[var(--gold)] leading-loose rtl mb-3" dir="rtl">
              {String(s!["scriptureArabic"])}
            </p>
            {!!(s?.["scriptureText"]) && (
              <p className="text-sm italic text-[var(--green)] mb-2">{String(s!["scriptureText"])}</p>
            )}
            {!!(s?.["scriptureRef"]) && (
              <p className="text-xs text-[var(--muted)]">— {String(s!["scriptureRef"])}</p>
            )}
          </div>
        )}

        <h1 className="font-cinzel text-2xl text-white text-center mb-1">{String(s?.["title"] ?? "")}</h1>
        {!!(s?.["guideName"]) && (
          <p className="text-[var(--muted)] text-sm text-center mb-8">Guided by {String(s!["guideName"])}</p>
        )}

        {/* Phase: Mood Before */}
        {phase === "moodBefore" && (
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] max-w-sm mx-auto animate-fade-in">
            <p className="font-cinzel text-[var(--gold)] text-center mb-5">How are you feeling right now?</p>
            <div className="grid grid-cols-4 gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => { setMoodBefore(m.label); setPhase("playing"); }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-[var(--card)] transition-colors"
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[9px] text-[var(--muted)] text-center leading-tight">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phase: Playing */}
        {phase === "playing" && (
          <div className="max-w-sm mx-auto animate-fade-in">
            {hasAudio ? (
              <>
                <div className="mb-6">
                  <input
                    type="range" min="0" max={duration || 1} step="0.1" value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 accent-[var(--green)] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                    <span>{fmt(currentTime)}</span>
                    <span>{fmt(duration || (s?.["durationSeconds"] as number) || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <button
                    onClick={togglePlay}
                    className="w-20 h-20 bg-[var(--green)] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,165,80,0.4)] hover:scale-105 transition-transform"
                  >
                    {isPlaying
                      ? <Pause size={36} className="fill-white text-white" />
                      : <Play size={36} className="fill-white text-white ml-1" />}
                  </button>
                </div>

                <div className="flex gap-2 justify-center mb-4">
                  {[0.75, 1, 1.25, 1.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setPlaybackRate(r)}
                      className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
                        playbackRate === r
                          ? "bg-[var(--green)] text-white border-[var(--green)]"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--green)]"
                      }`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setRainOn(!rainOn)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${
                      rainOn
                        ? "bg-[var(--card)] border-[var(--green)] text-[var(--green)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {rainOn ? "🌧 Rain on" : "🔇 Silence"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6">
                  <BookOpen size={32} className="text-[var(--muted)] mx-auto mb-3" />
                  <p className="text-[var(--muted)] text-sm mb-1">Audio coming soon — read along below</p>
                  <p className="text-xs text-[var(--muted)]/60">Engage with the Arabic text above</p>
                </div>
                <button
                  onClick={handleComplete}
                  className="bg-[var(--green)] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[var(--green)]/90 transition-colors"
                >
                  Mark as Complete ✓
                </button>
              </div>
            )}
          </div>
        )}

        {/* Phase: Complete */}
        {phase === "complete" && (
          <div className="max-w-sm mx-auto animate-fade-in space-y-6">
            <div className="text-center bg-[var(--card)] border border-[var(--green)] rounded-2xl p-5">
              <p className="font-cinzel text-2xl text-[var(--gold)] mb-1">Alhamdulillah! ✨</p>
              <p className="text-[var(--muted)] text-sm">Your ibadah has been logged.</p>
            </div>

            {/* Mood After */}
            {!moodAfter ? (
              <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)]">
                <p className="font-cinzel text-[var(--gold)] text-center mb-4">How do you feel now?</p>
                <div className="grid grid-cols-4 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setMoodAfter(m.label)}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-[var(--card)] transition-colors"
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="text-[9px] text-[var(--muted)] text-center leading-tight">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-4 text-sm text-[var(--muted)]">
                  <span>Before: <strong>{moodBefore}</strong></span>
                  <span>→</span>
                  <span>After: <strong className="text-[var(--green)]">{moodAfter}</strong></span>
                </div>

                {/* Journal */}
                <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)]">
                  <p className="font-cinzel text-[var(--gold)] mb-3 text-sm">Reflect on your session</p>

                  {loadingPrompts ? (
                    <p className="text-[var(--muted)] text-xs animate-pulse mb-3">Generating reflections...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {journalPrompts.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setJournalText(q + " ")}
                          className="text-xs bg-[var(--green)]/10 border border-[var(--green)]/30 text-[var(--green)] px-3 py-1.5 rounded-full hover:bg-[var(--green)]/20 transition-colors text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value.slice(0, 500))}
                    placeholder="Write your reflection here..."
                    maxLength={500}
                    rows={4}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)] placeholder-[var(--muted)] resize-none focus:outline-none focus:border-[var(--green)] transition-colors"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-[var(--muted)]">{journalText.length}/500</span>
                    {journalSaved ? (
                      <span className="text-xs text-[var(--green)]">✓ Saved</span>
                    ) : (
                      <button
                        onClick={saveJournal}
                        disabled={!journalText.trim()}
                        className="text-xs bg-[var(--green)] text-white px-4 py-1.5 rounded-full disabled:opacity-40 hover:bg-[var(--green)]/90"
                      >
                        Save reflection
                      </button>
                    )}
                  </div>
                </div>

                {/* Gift + Share */}
                <button
                  onClick={() => setShowGiftModal(true)}
                  className="w-full flex items-center justify-center gap-2 border border-[var(--gold)]/40 text-[var(--gold)] py-3 rounded-xl hover:bg-[var(--gold)]/10 transition-colors"
                >
                  <Gift size={18} /> Gift this dua to someone
                </button>

                {/* Related sessions */}
                {relatedSessions.length > 0 && (
                  <div>
                    <p className="font-cinzel text-sm text-[var(--gold)] mb-3">Continue your journey</p>
                    <div className="space-y-2">
                      {relatedSessions.map((rs) => (
                        <Link
                          key={rs["id"] as string}
                          to={`/player/${rs["id"]}`}
                          className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 hover:border-[var(--green)]/50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-semibold">{rs["title"] as string}</p>
                            <p className="text-xs text-[var(--muted)]">
                              {Math.ceil((rs["durationSeconds"] as number) / 60)} min
                            </p>
                          </div>
                          <Play size={16} className="text-[var(--green)]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
          <div className="bg-[var(--surface)] w-full rounded-t-3xl p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-cinzel text-[var(--gold)] text-lg">Gift this Dua</h3>
              <button onClick={() => setShowGiftModal(false)} className="text-[var(--muted)] text-xl">✕</button>
            </div>
            <p className="text-sm text-[var(--muted)]">Share this dua with someone you care about 🤲</p>
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value.slice(0, 100))}
              placeholder="Personal message (optional)..."
              maxLength={100}
              rows={2}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text)] placeholder-[var(--muted)] resize-none focus:outline-none"
            />
            {!giftLink ? (
              <button
                onClick={generateGiftLink}
                className="w-full bg-[var(--green)] text-white py-3 rounded-xl font-semibold"
              >
                Generate gift link
              </button>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    readOnly value={giftLink}
                    className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--muted)]"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(giftLink)}
                    className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl text-xs text-[var(--green)]"
                  >
                    Copy
                  </button>
                </div>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`I prayed this dua for you 🤲\n${giftLink}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold"
                >
                  <Share2 size={16} /> Share on WhatsApp
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
