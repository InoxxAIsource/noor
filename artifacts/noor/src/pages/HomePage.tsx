import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";
import {
  BookOpen, Compass, MapPin, Calculator, Calendar,
  Star, BookMarked, Droplets, Building2, Heart, Baby, Gift,
  Bell, Search, Menu, X, ChevronRight, Play, ChevronDown,
  Waves, Leaf, CloudRain, User, Sparkles, Flame, Sun, Sunrise, FileText
} from "lucide-react";

interface PrayerTime { name: string; time: string; }
interface HijriData { day: string; month: { number: number; en: string }; year: string; }
interface StreakData { currentStreak: number; weeklyCompleted: number; weeklyGoal: number; }
interface MoodData { emotion: string | null; completedMorning: boolean; morningStreak: number; }
interface Session { id: string; title: string; category: string; durationSeconds: number; audioUrl?: string | null; }
interface NameOfAllah { arabic: string; nameEnglish: string; meaningEnglish: string; }
interface RecentProgress { sessionId: string; category: string; timestamp: number; durationListened: number; }

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const EMOTIONS = [
  { key: "anxious",     icon: Waves,      label: "Anxious" },
  { key: "peaceful",    icon: Leaf,       label: "Peaceful" },
  { key: "overwhelmed", icon: CloudRain,  label: "Overwhelmed" },
  { key: "lonely",      icon: User,       label: "Lonely" },
  { key: "grateful",    icon: Sparkles,   label: "Grateful" },
  { key: "frustrated",  icon: Flame,      label: "Frustrated" },
  { key: "grieving",    icon: Heart,      label: "Grieving" },
  { key: "joyful",      icon: Sun,        label: "Joyful" },
];

const TOOLS = [
  { icon: BookOpen,   label: "Quran",     path: "/quran" },
  { icon: Compass,    label: "Qibla",     path: "/qibla" },
  { icon: MapPin,     label: "Masjid",    path: "/masjid-finder" },
  { icon: Calculator, label: "Zakat",     path: "/zakat-calculator" },
  { icon: Calendar,   label: "Calendar",  path: "/islamic-calendar" },
  { icon: Star,       label: "99 Names",  path: "/99-names" },
  { icon: BookMarked, label: "Farz",      path: "/farz-guide" },
  { icon: Droplets,   label: "Wudu",      path: "/wudu-guide" },
  { icon: Building2,  label: "Salah",     path: "/salah-guide" },
  { icon: Gift,       label: "Sadqa",     path: "/sadqa-guide" },
  { icon: Heart,      label: "Qurbani",   path: "/qurbani-guide" },
  { icon: Baby,       label: "Names",     path: "/names" },
];

const SESSION_NAMES: Record<string, string> = {
  azkar: "Morning Azkar",
  quran: "Quran Reflection",
  sleep: "Evening Calm",
  dua: "Guided Dua",
  healing: "Healing Session",
};

function parseTimeToDate(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number) as [number, number];
  const d = new Date(); d.setHours(h, m, 0, 0); return d;
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getTimeGreeting(name: string): { greeting: string; sub: string } {
  const h = new Date().getHours();
  if (h >= 4 && h < 12) return { greeting: `Good morning, ${name}`, sub: "Begin your day with intention." };
  if (h >= 12 && h < 15) return { greeting: `Peace be with you, ${name}`, sub: "Stay grounded in Allah's remembrance." };
  if (h >= 15 && h < 19) return { greeting: `Good evening, ${name}`, sub: "Reflect on the blessings of today." };
  return { greeting: `Assalamu Alaikum, ${name}`, sub: "End your day in peace and gratitude." };
}

const EMOTION_INSIGHTS: Record<string, string> = {
  peaceful:    "You've been finding moments of peace recently.",
  anxious:     "You've been navigating some challenges lately.",
  grateful:    "Your heart has been full of gratitude.",
  overwhelmed: "You've been carrying a lot recently.",
  lonely:      "You've been on a journey of seeking connection.",
  frustrated:  "You've been working through some difficulties.",
  grieving:    "You've been walking through a tender time.",
  joyful:      "You've been carrying joy in your heart.",
};

// Session recommendations by emotional state
const EMOTION_SESSIONS: Record<string, string[]> = {
  anxious:     ["healing", "sleep", "dua"],
  overwhelmed: ["healing", "azkar", "sleep"],
  lonely:      ["dua", "quran", "azkar"],
  frustrated:  ["azkar", "healing", "quran"],
  grieving:    ["dua", "healing", "sleep"],
  peaceful:    ["quran", "azkar", "dua"],
  grateful:    ["azkar", "quran", "dua"],
  joyful:      ["quran", "azkar", "dua"],
};

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const u = user as Record<string, unknown> | null;
  const firstName = ((u?.["name"] as string) ?? "friend").split(" ")[0]!;
  const city = (u?.["city"] as string) ?? "Delhi";
  const token = typeof window !== "undefined" ? localStorage.getItem("tazki_token") : null;

  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [hijri, setHijri] = useState<HijriData | null>(null);
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, weeklyCompleted: 0, weeklyGoal: 5 });
  const [mood, setMood] = useState<MoodData>({ emotion: null, completedMorning: false, morningStreak: 0 });
  const [featuredSession, setFeaturedSession] = useState<Session | null>(null);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [nameOfAllah, setNameOfAllah] = useState<NameOfAllah | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string }>({ name: "Fajr", time: "04:43" });
  const [countdown, setCountdown] = useState("--:--:--");
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Session[]>([]);
  const [isRamadan, setIsRamadan] = useState(false);
  const [emotionInsight, setEmotionInsight] = useState<string | null>(null);
  const [recentProgress, setRecentProgress] = useState<RecentProgress | null>(null);
  const [recentSessionTitle, setRecentSessionTitle] = useState<string | null>(null);
  const [showAllTools, setShowAllTools] = useState(false);

  const { greeting, sub } = getTimeGreeting(firstName);
  const authHeaders: Record<string, string> = token
    ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    : {};

  useEffect(() => {
    Promise.all([
      fetch(`/api/prayer/times?city=${encodeURIComponent(city)}`).then(r => r.json()).catch(() => null),
      fetch("/api/prayer/hijri").then(r => r.json()).catch(() => null),
      token ? fetch("/api/streak/me", { headers: authHeaders }).then(r => r.json()).catch(() => null) : null,
      token ? fetch("/api/mood/today", { headers: authHeaders }).then(r => r.json()).catch(() => null) : null,
      fetch("/api/sessions?limit=20").then(r => r.json()).catch(() => []),
      fetch("/api/names-of-allah/today").then(r => r.json()).catch(() => null),
      token ? fetch("/api/mood/history", { headers: authHeaders }).then(r => r.json()).catch(() => null) : null,
      token ? fetch("/api/progress/recent", { headers: authHeaders }).then(r => r.json()).catch(() => null) : null,
    ]).then(([prayerData, hijriData, streakData, moodData, sessionsData, nameData, moodHistory, progressData]) => {
      if (prayerData?.times) setPrayerTimes(prayerData.times as PrayerTime[]);
      if (hijriData?.day) {
        setHijri(hijriData as HijriData);
        setIsRamadan((hijriData as HijriData).month?.number === 9);
      }
      if (streakData?.currentStreak !== undefined) setStreak(streakData as StreakData);
      if (moodData) setMood(moodData as MoodData);

      if (Array.isArray(sessionsData) && (sessionsData as Session[]).length > 0) {
        const sessions = sessionsData as Session[];
        setAllSessions(sessions);

        // Pick featured session based on current emotion or time of day
        const currentEmotion = (moodData as MoodData | null)?.emotion;
        const preferredCats = currentEmotion
          ? (EMOTION_SESSIONS[currentEmotion] ?? [])
          : (() => {
              const h = new Date().getHours();
              return h < 12 ? ["azkar"] : h < 17 ? ["quran"] : ["sleep"];
            })();

        let match: Session | undefined;
        for (const cat of preferredCats) {
          match = sessions.find(s => s.category?.toLowerCase() === cat);
          if (match) break;
        }
        setFeaturedSession(match ?? sessions[0] ?? null);
      }

      if (nameData?.arabic) setNameOfAllah(nameData as NameOfAllah);

      // Emotional insight from mood history
      if (moodHistory?.insight) {
        setEmotionInsight(moodHistory.insight as string);
      } else if (moodHistory?.history?.length >= 2) {
        const emotions = (moodHistory.history as Array<{ emotion: string }>).map(h => h.emotion);
        const dominant = emotions[0];
        if (dominant) setEmotionInsight(EMOTION_INSIGHTS[dominant] ?? null);
      }

      // Journey continuity from last session
      if (progressData?.recent) {
        const prog = progressData.recent as RecentProgress;
        setRecentProgress(prog);
        if (Array.isArray(sessionsData)) {
          const matchedSession = (sessionsData as Session[]).find(s => s.id === prog.sessionId);
          setRecentSessionTitle(
            matchedSession?.title
            ?? SESSION_NAMES[prog.category]
            ?? prog.category
          );
        }
      }
    });
  }, [city, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!prayerTimes.length) return;
    const now = new Date();
    for (const p of prayerTimes) {
      if (parseTimeToDate(p.time) > now) { setNextPrayer({ name: p.name, time: p.time }); return; }
    }
    if (prayerTimes[0]) setNextPrayer({ name: prayerTimes[0].name, time: prayerTimes[0].time });
  }, [prayerTimes]);

  useEffect(() => {
    const iv = setInterval(() => {
      const target = parseTimeToDate(nextPrayer.time);
      const now = new Date();
      if (target <= now) target.setDate(target.getDate() + 1);
      setCountdown(formatCountdown(target.getTime() - now.getTime()));
    }, 1000);
    return () => clearInterval(iv);
  }, [nextPrayer]);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSearchResults([]); return; }
    setSearchResults(
      allSessions
        .filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
        .slice(0, 6)
    );
  }, [searchQuery, allSessions]);

  const hijriLine = hijri ? `${hijri.day} ${hijri.month.en} ${hijri.year} AH` : "";

  const handleEmotionSelect = async (emotion: string) => {
    setMood(prev => ({ ...prev, emotion }));
    if (token) {
      await fetch("/api/mood/checkin", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ emotion }),
      }).catch(() => {});
    }
    // Re-pick session based on new emotion
    if (allSessions.length > 0) {
      const preferredCats = EMOTION_SESSIONS[emotion] ?? [];
      let match: Session | undefined;
      for (const cat of preferredCats) {
        match = allSessions.find(s => s.category?.toLowerCase() === cat);
        if (match) break;
      }
      if (match) setFeaturedSession(match);
    }
  };

  const visibleTools = showAllTools ? TOOLS : TOOLS.slice(0, 4);

  // Streak messaging — identity-reinforcing, never guilt-based
  const streakLabel = streak.currentStreak === 0
    ? "Your journey begins today"
    : streak.currentStreak === 1
      ? "Day 1 of your journey"
      : `${streak.currentStreak} days of consistent remembrance`;

  const streakSub = streak.currentStreak >= 7
    ? "Masha'Allah — you're building a beautiful habit"
    : streak.weeklyCompleted > 0
      ? `${streak.weeklyCompleted} of ${streak.weeklyGoal} sessions this week`
      : "Each moment of remembrance counts";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", paddingBottom: 100, position: "relative" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(52,201,122,0.15); }
          50% { box-shadow: 0 0 32px rgba(52,201,122,0.3); }
        }
        .main-content {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* Atmospheric Header Background */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, height: 200,
        backgroundImage: `url(/images/man-praying-moon.png)`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        opacity: 0.15,
        zIndex: 0,
        pointerEvents: "none",
        maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
      }} />

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 20px 0", position: "relative", zIndex: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--green)", letterSpacing: 3, fontFamily: "DM Sans, sans-serif" }}>
          MYTAZKI
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Search size={20} color="var(--muted)" style={{ cursor: "pointer" }}
            onClick={() => { setShowSearch(v => !v); setShowMenu(false); setSearchQuery(""); }} />
          <Bell size={20} color="var(--muted)" style={{ cursor: "pointer" }}
            onClick={() => void navigate("/profile")} />
          <Menu size={20} color="var(--muted)" style={{ cursor: "pointer" }}
            onClick={() => { setShowMenu(v => !v); setShowSearch(false); }} />
        </div>
      </div>

      {/* Search panel */}
      {showSearch && (
        <div style={{ margin: "16px 20px 0", animation: "fadeDown 0.2s ease", position: "relative", zIndex: 10 }}>
          <div style={{ position: "relative" }}>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sessions, duas, guides..."
              style={{
                width: "100%", background: "var(--surface)", border: "1px solid rgba(52,201,122,0.2)",
                borderRadius: 12, padding: "14px 40px 14px 16px", color: "var(--text)",
                fontSize: 15, outline: "none", boxSizing: "border-box",
              }}
            />
            <X size={18} color="var(--muted)" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              onClick={() => { setShowSearch(false); setSearchQuery(""); }} />
          </div>
          {searchResults.length > 0 && (
            <div style={{ background: "var(--surface)", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 12, marginTop: 8, overflow: "hidden" }}>
              {searchResults.map(s => (
                <div key={s.id}
                  onClick={() => void navigate(`/player/${s.id}`)}
                  style={{ padding: "14px 16px", borderBottom: "1px solid rgba(52,201,122,0.08)", cursor: "pointer", fontSize: 14 }}
                >
                  {s.title}
                  <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>{s.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Side menu */}
      {showMenu && (
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 280,
          background: "var(--surface)", borderLeft: "1px solid rgba(52,201,122,0.15)",
          zIndex: 100, padding: 32, animation: "slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", letterSpacing: 1, textTransform: "uppercase" }}>Menu</span>
            <X size={20} color="var(--muted)" style={{ cursor: "pointer" }} onClick={() => setShowMenu(false)} />
          </div>
          {[
            { label: "Sessions", path: "/sessions", icon: Play },
            { label: "Duas Library", path: "/duas", icon: BookOpen },
            { label: "Prayer Times", path: "/prayer-times", icon: Building2 },
            { label: "Journal", path: "/journal", icon: FileText },
            { label: "Growth", path: "/growth", icon: Leaf },
            { label: "AI Companion", path: "/companion", icon: Sparkles },
            { label: "Profile", path: "/profile", icon: User },
          ].map(item => {
            const Icon = item.icon;
            return (
            <div key={item.path}
              onClick={() => { void navigate(item.path); setShowMenu(false); }}
              style={{ padding: "16px 0", borderBottom: "1px solid rgba(52,201,122,0.08)", cursor: "pointer", fontSize: 16, color: "var(--text)", display: "flex", alignItems: "center", gap: 14 }}
            >
              <Icon size={18} color="var(--muted)" />
              {item.label}
            </div>
          )})}
        </div>
      )}
      {showMenu && <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }} onClick={() => setShowMenu(false)} />}

      <div className="main-content" style={{ padding: "32px 20px 0", position: "relative", zIndex: 10 }}>

        {/* ── Greeting ── */}
        <div style={{ marginBottom: 32 }}>
          {hijriLine && (
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gold)", letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>
              {hijriLine}{isRamadan && " · Ramadan Mubarak"}
            </div>
          )}
          <h1 style={{ fontSize: 28, fontFamily: "DM Sans, sans-serif", fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>
            {greeting}
          </h1>
          <p style={{ fontSize: 14, color: emotionInsight ? "var(--gold)" : "var(--muted)", lineHeight: 1.5 }}>
            {emotionInsight ?? sub}
          </p>
        </div>

        {/* ── Emotional check-in — shown when no emotion logged today ── */}
        {!mood.emotion && (
          <div style={{
            background: `linear-gradient(160deg, var(--surface) 0%, rgba(21,32,25,0.8) 100%)`,
            border: "1px solid rgba(184,148,106,0.2)",
            borderRadius: 24, padding: "24px 20px", marginBottom: 24,
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 6, fontFamily: "DM Sans, sans-serif" }}>
              What do you need right now?
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
              Your answer shapes everything that follows.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {EMOTIONS.map(em => {
                const Icon = em.icon;
                return (
                <button
                  key={em.key}
                  onClick={() => void handleEmotionSelect(em.key)}
                  style={{
                    background: `linear-gradient(to bottom, var(--card), rgba(28,45,33,0.6))`,
                    border: "1px solid rgba(52,201,122,0.1)",
                    borderRadius: 16, padding: "14px 4px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  <Icon size={22} color="var(--green)" strokeWidth={1.5} />
                  <span style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.2, fontWeight: 500 }}>{em.label}</span>
                </button>
              )})}
            </div>
          </div>
        )}

        {/* ── Emotional check-in — confirmed state ── */}
        {mood.emotion && (
          <div style={{
            background: "var(--surface)",
            border: "1px solid rgba(52,201,122,0.15)",
            borderRadius: 20, padding: "16px 20px", marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(52,201,122,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)" }}>
                {(() => {
                  const Icon = EMOTIONS.find(e => e.key === mood.emotion)?.icon ?? Leaf;
                  return <Icon size={20} />;
                })()}
              </div>
              <div>
                <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>
                  Feeling {mood.emotion}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  Sessions are matched to your state
                </div>
              </div>
            </div>
            <button
              onClick={() => setMood(prev => ({ ...prev, emotion: null }))}
              style={{ background: "rgba(52,201,122,0.1)", border: "none", color: "var(--green)", borderRadius: 12, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}
            >
              Edit
            </button>
          </div>
        )}

        {/* ── Morning flow CTA ── */}
        {!mood.completedMorning ? (
          <div
            onClick={() => void navigate("/morning")}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(21,32,25,0.9) 0%, rgba(21,32,25,0.8) 100%), url(/images/woman-reading-quran.png)`,
              backgroundSize: "cover", backgroundPosition: "center",
              border: "1px solid rgba(52,201,122,0.25)", borderRadius: 24,
              padding: "24px", marginBottom: 24, cursor: "pointer",
              position: "relative", overflow: "hidden",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ position: "absolute", top: 16, right: 20, color: "var(--green)", opacity: 0.15 }}>
              <Sunrise size={48} />
            </div>
            <div style={{ fontSize: 11, color: "var(--green)", textTransform: "uppercase", letterSpacing: 2.5, fontWeight: 700, marginBottom: 10 }}>
              Morning ritual
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "DM Sans, sans-serif", marginBottom: 6, color: "var(--text)" }}>
              Begin your day with intention
            </div>
            <div style={{ fontSize: 14, color: "rgba(234,244,238,0.7)", marginBottom: 20 }}>
              A 3-minute guided morning grounding
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--green)", color: "#0d1411", borderRadius: 20,
              padding: "10px 20px", fontSize: 14, fontWeight: 700,
            }}>
              Begin now <ChevronRight size={16} strokeWidth={2.5} />
            </div>
          </div>
        ) : (
          <div style={{
            background: "var(--surface)", border: "1px solid rgba(52,201,122,0.2)",
            borderRadius: 20, padding: "18px 20px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(52,201,122,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)" }}>
              <Leaf size={20} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--green)" }}>
                Alhamdulillah — morning complete
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                {mood.morningStreak > 1
                  ? `${mood.morningStreak} peaceful mornings — keep going`
                  : "Your first peaceful morning"}
              </div>
            </div>
          </div>
        )}

        {/* ── Journey continuity card ── */}
        {recentProgress && recentSessionTitle && (
          <div style={{
            background: `linear-gradient(to right, var(--surface), rgba(184,148,106,0.05))`,
            borderLeft: "3px solid var(--gold)",
            borderTop: "1px solid rgba(184,148,106,0.15)",
            borderRight: "1px solid rgba(184,148,106,0.15)",
            borderBottom: "1px solid rgba(184,148,106,0.15)",
            borderRadius: 20, padding: "20px", marginBottom: 24,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
            onClick={() => void navigate(`/player/${recentProgress.sessionId}`)}
          >
            <div style={{ fontSize: 11, color: "var(--gold)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>
              Continue your journey
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{recentSessionTitle}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  You returned for another moment of reflection
                </div>
              </div>
              <div style={{
                background: "rgba(184,148,106,0.15)",
                border: "1px solid rgba(184,148,106,0.3)",
                borderRadius: "50%", width: 44, height: 44,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Play size={18} color="var(--gold)" fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 1, background: "rgba(52,201,122,0.1)", margin: "32px 0" }} />

        {/* ── Prayer times ── */}
        <div
          onClick={() => void navigate("/prayer-times")}
          style={{
            background: "var(--surface)", border: "1px solid rgba(52,201,122,0.15)",
            borderRadius: 24, padding: "24px", marginBottom: 24, cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>
                Next prayer
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--green)" }}>{nextPrayer.name}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--gold)", fontFamily: "Menlo, monospace", letterSpacing: 1, fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(52,201,122,0.08)" }}>
            {PRAYER_ORDER.map(name => {
              const p = prayerTimes.find(pt => pt.name === name);
              const isNext = name === nextPrayer.name;
              return (
                <div key={name} style={{ 
                  textAlign: "center", 
                  background: isNext ? "rgba(184,148,106,0.1)" : "transparent",
                  padding: "6px 10px", borderRadius: 10,
                }}>
                  <div style={{ fontSize: 11, color: isNext ? "var(--green)" : "var(--muted)", marginBottom: 4, fontWeight: isNext ? 600 : 400 }}>{name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isNext ? "var(--gold)" : "var(--text)" }}>{p?.time ?? "--:--"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Streak — identity-reinforcing ── */}
        <div style={{
          background: "var(--surface)", border: "1px solid rgba(52,201,122,0.15)",
          borderRadius: 24, padding: "24px", marginBottom: 32,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "var(--gold)", fontFamily: "DM Sans, sans-serif", lineHeight: 1 }}>
              {streak.currentStreak}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginTop: 6 }}>{streakLabel}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, opacity: 0.8 }}>{streakSub}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginBottom: 8 }}>
              {Array(7).fill(null).map((_, i) => {
                const completed = i < streak.weeklyCompleted;
                return (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: completed ? "var(--green)" : "var(--faint)",
                  boxShadow: completed ? "0 0 8px rgba(52,201,122,0.4)" : "none",
                }} />
              )})}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {streak.weeklyCompleted} of {streak.weeklyGoal} this week
            </div>
          </div>
        </div>

        {/* ── Today's emotionally-matched session ── */}
        {featuredSession && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>
              {mood.emotion ? `For when you feel ${mood.emotion}` : "Today's focus"}
            </div>
            <div
              onClick={() => void navigate(`/player/${featuredSession.id}`)}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(21,32,25,0.9) 0%, rgba(21,32,25,0.85) 100%), url(/images/quran-pages.png)`,
                backgroundSize: "cover", backgroundPosition: "center",
                border: "1px solid rgba(52,201,122,0.2)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6, background: "rgba(52,201,122,0.1)", padding: "4px 10px", borderRadius: 8, display: "inline-block" }}>
                  {featuredSession.category}
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, fontFamily: "DM Sans, sans-serif", marginBottom: 6 }}>{featuredSession.title}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  {featuredSession.audioUrl
                    ? `${Math.floor(featuredSession.durationSeconds / 60)} min guided audio`
                    : `Guided reading reflection`}
                </div>
              </div>
              <div style={{
                background: "var(--green)", color: "#0d1411", borderRadius: "50%",
                width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, animation: "glowPulse 3s infinite",
              }}>
                <Play size={20} fill="currentColor" style={{ marginLeft: 3 }} />
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 1, background: "rgba(52,201,122,0.1)", margin: "32px 0" }} />

        {/* ── Name of Allah ── */}
        {nameOfAllah && (
          <div style={{
            background: "var(--surface)", 
            borderTop: "1px solid rgba(184,148,106,0.15)",
            borderBottom: "1px solid rgba(184,148,106,0.15)",
            padding: "32px 20px", marginBottom: 32, textAlign: "center",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "radial-gradient(circle, rgba(184,148,106,0.4) 0%, transparent 100%)" }} />
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2.5, fontWeight: 700, marginBottom: 16 }}>
              Name of Allah today
            </div>
            <div style={{ fontFamily: "Amiri, serif", fontSize: 34, color: "var(--gold)", direction: "rtl", marginBottom: 12, textShadow: "0 2px 10px rgba(184,148,106,0.2)" }}>
              {nameOfAllah.arabic}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{nameOfAllah.nameEnglish}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>{nameOfAllah.meaningEnglish}</div>
            <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 1, background: "radial-gradient(circle, rgba(184,148,106,0.4) 0%, transparent 100%)" }} />
          </div>
        )}

        {/* ── Quick dhikr ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ height: 1, flex: 1, background: "rgba(52,201,122,0.1)" }} />
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>
            Quick dhikr
          </div>
          <div style={{ height: 1, flex: 1, background: "rgba(52,201,122,0.1)" }} />
        </div>
        
        <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
          {[
            { arabic: "سُبْحَانَ اللَّهِ", english: "SubhanAllah", dhikr: "subhanallah" },
            { arabic: "اَلْحَمْدُ لِلَّهِ", english: "Alhamdulillah", dhikr: "alhamdulillah" },
            { arabic: "اللَّهُ أَكْبَرُ", english: "Allahu Akbar", dhikr: "allahuakbar" },
          ].map(t => (
            <div
              key={t.dhikr}
              onClick={() => void navigate(`/tasbih?dhikr=${t.dhikr}`)}
              style={{
                flex: 1, background: "var(--surface)", border: "1px solid rgba(52,201,122,0.15)",
                borderRadius: 16, padding: "16px 10px", textAlign: "center", cursor: "pointer",
                transition: "transform 0.15s, border-color 0.2s",
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.96)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ fontFamily: "Amiri, serif", fontSize: 18, color: "var(--gold)", direction: "rtl", marginBottom: 6 }}>{t.arabic}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{t.english}</div>
            </div>
          ))}
        </div>

        {/* ── AI companion prompt ── */}
        <div
          onClick={() => void navigate("/companion")}
          style={{
            background: "linear-gradient(145deg, var(--surface) 0%, rgba(21,32,25,0.6) 100%)", 
            border: "1px solid rgba(184,148,106,0.3)",
            borderRadius: 20, padding: "20px 24px", marginBottom: 32,
            display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(184,148,106,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
              <Sparkles size={22} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--gold)", marginBottom: 4 }}>Talk to your companion</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                Reflect, seek guidance, or find calm
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--gold)" opacity={0.7} />
        </div>

        {/* ── Islamic tools — demoted, collapsible ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>
            Islamic tools
          </div>
          <button
            onClick={() => setShowAllTools(v => !v)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "var(--muted)", fontWeight: 500,
            }}
          >
            {showAllTools ? "Show less" : "See all"}
            <ChevronDown size={14} style={{ transform: showAllTools ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {visibleTools.map(({ icon: Icon, label, path }) => (
            <div
              key={path}
              onClick={() => void navigate(path)}
              style={{
                background: "var(--surface)", border: "1px solid rgba(52,201,122,0.1)",
                borderRadius: 16, padding: "16px 8px", textAlign: "center", cursor: "pointer",
              }}
            >
              <Icon size={20} color="var(--green)" strokeWidth={1.5} style={{ margin: "0 auto 8px", display: "block" }} />
              <div style={{ fontSize: 11, color: "var(--text)", fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}