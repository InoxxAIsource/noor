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
  azkar: "Morning Azkar", quran: "Quran Reflection",
  sleep: "Evening Calm",  dua: "Guided Dua", healing: "Healing Session",
};

const EMOTION_INSIGHTS: Record<string, string> = {
  peaceful: "You've been finding moments of peace recently.",
  anxious: "You've been navigating some challenges lately.",
  grateful: "Your heart has been full of gratitude.",
  overwhelmed: "You've been carrying a lot recently.",
  lonely: "You've been on a journey of seeking connection.",
  frustrated: "You've been working through some difficulties.",
  grieving: "You've been walking through a tender time.",
  joyful: "You've been carrying joy in your heart.",
};

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

function getTimeGreeting(): { salutation: string; sub: string } {
  const h = new Date().getHours();
  if (h >= 4  && h < 12) return { salutation: "Good morning",    sub: "Begin your day with intention." };
  if (h >= 12 && h < 15) return { salutation: "Peace be with you", sub: "Stay grounded in Allah's remembrance." };
  if (h >= 15 && h < 19) return { salutation: "Good afternoon",  sub: "Reflect on today's blessings." };
  return { salutation: "Good evening", sub: "End your day in peace and gratitude." };
}

// Cinematic palette
const C = {
  bg:      "#09070A",
  surface: "#16100a",
  card:    "#1a130d",
  green:   "#34c97a",
  gold:    "#c9a472",
  cream:   "#faf2e2",
  text:    "#f0ece4",
  muted:   "#6e5e4c",
  border:  "rgba(52,201,122,0.12)",
  bGold:   "rgba(201,164,114,0.18)",
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

  const { salutation, sub } = getTimeGreeting();
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
      if (hijriData?.day) { setHijri(hijriData as HijriData); setIsRamadan((hijriData as HijriData).month?.number === 9); }
      if (streakData?.currentStreak !== undefined) setStreak(streakData as StreakData);
      if (moodData) setMood(moodData as MoodData);
      if (Array.isArray(sessionsData) && (sessionsData as Session[]).length > 0) {
        const sessions = sessionsData as Session[];
        setAllSessions(sessions);
        const currentEmotion = (moodData as MoodData | null)?.emotion;
        const preferredCats = currentEmotion
          ? (EMOTION_SESSIONS[currentEmotion] ?? [])
          : (() => { const h = new Date().getHours(); return h < 12 ? ["azkar"] : h < 17 ? ["quran"] : ["sleep"]; })();
        let match: Session | undefined;
        for (const cat of preferredCats) { match = sessions.find(s => s.category?.toLowerCase() === cat); if (match) break; }
        setFeaturedSession(match ?? sessions[0] ?? null);
      }
      if (nameData?.arabic) setNameOfAllah(nameData as NameOfAllah);
      if (moodHistory?.insight) setEmotionInsight(moodHistory.insight as string);
      else if (moodHistory?.history?.length >= 2) {
        const emotions = (moodHistory.history as Array<{ emotion: string }>).map(h => h.emotion);
        const dominant = emotions[0];
        if (dominant) setEmotionInsight(EMOTION_INSIGHTS[dominant] ?? null);
      }
      if (progressData?.recent) {
        const prog = progressData.recent as RecentProgress;
        setRecentProgress(prog);
        if (Array.isArray(sessionsData)) {
          const matchedSession = (sessionsData as Session[]).find(s => s.id === prog.sessionId);
          setRecentSessionTitle(matchedSession?.title ?? SESSION_NAMES[prog.category] ?? prog.category);
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
    setSearchResults(allSessions.filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)).slice(0, 6));
  }, [searchQuery, allSessions]);

  const hijriLine = hijri ? `${hijri.day} ${hijri.month.en} ${hijri.year} AH${isRamadan ? " · Ramadan Mubarak" : ""}` : "";
  const visibleTools = showAllTools ? TOOLS : TOOLS.slice(0, 8);

  const streakLabel = streak.currentStreak === 0 ? "Your journey begins today"
    : streak.currentStreak === 1 ? "Day 1 of your journey"
    : `${streak.currentStreak} days of remembrance`;

  const handleEmotionSelect = async (emotion: string) => {
    setMood(prev => ({ ...prev, emotion }));
    if (token) await fetch("/api/mood/checkin", { method: "POST", headers: authHeaders, body: JSON.stringify({ emotion }) }).catch(() => {});
    if (allSessions.length > 0) {
      const preferredCats = EMOTION_SESSIONS[emotion] ?? [];
      let match: Session | undefined;
      for (const cat of preferredCats) { match = allSessions.find(s => s.category?.toLowerCase() === cat); if (match) break; }
      if (match) setFeaturedSession(match);
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "Inter, -apple-system, sans-serif", paddingBottom: 100 }}>
      <style>{`
        @keyframes breathe {
          0%,100% { box-shadow: 0 0 14px rgba(52,201,122,0.30), 0 0 28px rgba(52,201,122,0.10); }
          55%      { box-shadow: 0 0 22px rgba(52,201,122,0.55), 0 0 44px rgba(52,201,122,0.18); }
        }
        @keyframes ring {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hp-glow  { animation: breathe 3s ease-in-out infinite; }
        .hp-ring  {
          position: absolute; inset: -6px; border-radius: 50%;
          border: 1px solid rgba(52,201,122,0.40);
          animation: ring 3s ease-out infinite;
          pointer-events: none;
        }
        .hp-tap:active { opacity: 0.85; transform: scale(0.98); }
        .hp-tool:active { opacity: 0.7; }
        -webkit-font-smoothing: antialiased;
      `}</style>

      {/* ═══════ CINEMATIC HERO ═══════ */}
      <div style={{ position: "relative", height: "60vh", flexShrink: 0, overflow: "hidden", isolation: "isolate" }}>

        <img
          src="/images/man-making-dua.png" alt=""
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            objectPosition: "center 20%", display: "block",
            filter: "contrast(1.12) brightness(0.93) saturate(0.70)",
          }}
        />

        {/* Warm amber film grade */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(130,74,22,0.30) 0%, rgba(90,44,8,0.18) 55%, rgba(10,6,18,0.12) 100%)", mixBlendMode: "multiply", pointerEvents: "none" }} />
        {/* Vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 82% 74% at 50% 34%, transparent 34%, rgba(5,3,1,0.68) 100%)", pointerEvents: "none" }} />
        {/* Top scrim */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "linear-gradient(to bottom, rgba(5,3,2,0.80) 0%, transparent 100%)", pointerEvents: "none" }} />
        {/* Bottom melt */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: `linear-gradient(to bottom, transparent 0%, rgba(9,7,10,0.18) 22%, rgba(9,7,10,0.62) 52%, rgba(9,7,10,0.92) 74%, ${C.bg} 100%)`, pointerEvents: "none" }} />

        {/* TOP BAR */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 20px 0" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.green, letterSpacing: 4 }}>MYTAZKI</span>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Search size={19} color={C.text} style={{ cursor: "pointer", opacity: 0.55 }}
              onClick={() => { setShowSearch(v => !v); setShowMenu(false); setSearchQuery(""); }} />
            <Bell size={19} color={C.text} style={{ cursor: "pointer", opacity: 0.55 }}
              onClick={() => void navigate("/profile")} />
            <Menu size={19} color={C.text} style={{ cursor: "pointer", opacity: 0.55 }}
              onClick={() => { setShowMenu(v => !v); setShowSearch(false); }} />
          </div>
        </div>

        {/* VERSE — floating over image */}
        <div style={{ position: "absolute", top: "28%", left: 0, right: 0, zIndex: 8, padding: "0 28px", textAlign: "center", isolation: "isolate" }}>
          <div style={{ width: 28, height: 1, margin: "0 auto 16px", background: "linear-gradient(to right, transparent, rgba(201,164,114,0.60), transparent)" }} />
          <div style={{
            fontFamily: "'Scheherazade New', 'Traditional Arabic', 'Noto Naskh Arabic', Georgia, serif",
            fontSize: 30, fontWeight: 700, color: C.cream, direction: "rtl", lineHeight: 1.75, letterSpacing: 0.5,
            textShadow: "0 1px 2px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1), 0 3px 6px rgba(0,0,0,0.95)",
            marginBottom: 12,
          }}>
            ألا بذكر الله تطمئن القلوب
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(250,242,226,0.92)", letterSpacing: 0.4, textShadow: "0 1px 2px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,1)" }}>
            Verily, in the remembrance of Allah do hearts find rest
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(201,164,114,0.88)", marginTop: 9, letterSpacing: 2, textShadow: "0 1px 2px rgba(0,0,0,1)" }}>
            SURAH AR-RA'D · 13:28
          </div>
          <div style={{ width: 28, height: 1, margin: "16px auto 0", background: "linear-gradient(to right, transparent, rgba(201,164,114,0.60), transparent)" }} />
        </div>

        {/* SEARCH PANEL */}
        {showSearch && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "0 20px 20px", animation: "fadeDown 0.2s ease" }}>
            <div style={{ position: "relative" }}>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search sessions, duas, guides..."
                style={{ width: "100%", background: "rgba(26,19,13,0.95)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 40px 14px 16px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box", backdropFilter: "blur(12px)" }}
              />
              <X size={18} color={C.muted} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                onClick={() => { setShowSearch(false); setSearchQuery(""); }} />
            </div>
            {searchResults.length > 0 && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginTop: 8, overflow: "hidden" }}>
                {searchResults.map(s => (
                  <div key={s.id} onClick={() => void navigate(`/player/${s.id}`)}
                    style={{ padding: "14px 16px", borderBottom: `1px solid rgba(52,201,122,0.06)`, cursor: "pointer", fontSize: 14, color: C.text }}>
                    {s.title}
                    <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>{s.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SIDE MENU */}
      {showMenu && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.6)" }} onClick={() => setShowMenu(false)} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 280, background: C.surface, borderLeft: `1px solid ${C.border}`, zIndex: 100, padding: 32, animation: "slideLeft 0.3s cubic-bezier(0.16,1,0.3,1)", boxShadow: "-12px 0 48px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: 3, textTransform: "uppercase" }}>Menu</span>
              <X size={20} color={C.muted} style={{ cursor: "pointer" }} onClick={() => setShowMenu(false)} />
            </div>
            {[
              { label: "Sessions",     path: "/sessions",   icon: Play },
              { label: "Duas Library", path: "/duas",       icon: BookOpen },
              { label: "Prayer Times", path: "/prayer-times", icon: Building2 },
              { label: "Journal",      path: "/journal",    icon: FileText },
              { label: "Growth",       path: "/growth",     icon: Leaf },
              { label: "AI Companion", path: "/companion",  icon: Sparkles },
              { label: "Profile",      path: "/profile",    icon: User },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.path} onClick={() => { void navigate(item.path); setShowMenu(false); }}
                  style={{ padding: "16px 0", borderBottom: `1px solid rgba(52,201,122,0.07)`, cursor: "pointer", fontSize: 15, color: C.text, display: "flex", alignItems: "center", gap: 14 }}>
                  <Icon size={18} color={C.muted} />
                  {item.label}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ═══════ DASHBOARD CONTENT ═══════ */}
      <div style={{ padding: "0 20px", position: "relative", zIndex: 2 }}>

        {/* GREETING */}
        <div style={{ paddingTop: 20, marginBottom: 24 }}>
          {hijriLine && (
            <div style={{ fontSize: 10, color: C.gold, letterSpacing: 3.5, fontWeight: 600, textTransform: "uppercase", opacity: 0.82, marginBottom: 8 }}>
              {hijriLine}
            </div>
          )}
          <div style={{ fontSize: 10, color: C.gold, letterSpacing: 3, fontWeight: 500, textTransform: "uppercase", opacity: 0.75, marginBottom: 8, display: hijriLine ? "none" : "block" }}>
            {salutation}
          </div>
          <div style={{ fontSize: 27, fontFamily: "DM Sans, sans-serif", fontWeight: 700, lineHeight: 1.05, letterSpacing: -0.4, marginBottom: 7 }}>
            {hijriLine ? `${salutation}, ${firstName}` : firstName}
          </div>
          <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.55, color: "rgba(201,164,114,0.78)" }}>
            {emotionInsight ?? sub}
          </div>
        </div>

        {/* MORNING FLOW */}
        {!mood.completedMorning ? (
          <div className="hp-tap" onClick={() => void navigate("/morning")}
            style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid rgba(52,201,122,0.15)`, borderRadius: 20, padding: "20px 18px", marginBottom: 14, cursor: "pointer", boxShadow: "0 6px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)", position: "relative", overflow: "hidden", transition: "opacity 0.15s, transform 0.15s" }}>
            <div style={{ position: "absolute", top: -30, right: -20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,164,114,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(to right, transparent, rgba(201,164,114,0.30), transparent)" }} />
            <div style={{ fontSize: 9, color: C.gold, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 9, fontWeight: 700 }}>Morning ritual</div>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 5, color: C.text }}>Begin your day with intention</div>
            <div style={{ fontSize: 12, color: C.muted }}>A 3-minute guided morning grounding</div>
          </div>
        ) : (
          <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid rgba(52,201,122,0.14)`, borderRadius: 20, padding: "16px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(52,201,122,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: C.green }}><Leaf size={18} /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.green }}>Alhamdulillah — morning complete</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{mood.morningStreak > 1 ? `${mood.morningStreak} peaceful mornings — keep going` : "Your first peaceful morning"}</div>
            </div>
          </div>
        )}

        {/* FEATURED SESSION */}
        {featuredSession && (
          <div className="hp-tap" onClick={() => void navigate(`/player/${featuredSession.id}`)}
            style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 20, padding: "19px 17px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, cursor: "pointer", boxShadow: "0 6px 24px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.03)", position: "relative", overflow: "hidden", transition: "opacity 0.15s, transform 0.15s" }}>
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(to right, transparent, rgba(52,201,122,0.28), transparent)" }} />
            <div style={{ flex: 1, paddingRight: 14 }}>
              <div style={{ fontSize: 9, color: C.green, textTransform: "uppercase", letterSpacing: 2.5, marginBottom: 9, fontWeight: 700 }}>
                {mood.emotion ? `For when you feel ${mood.emotion}` : "Your focus now"}
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 5, color: C.text }}>{featuredSession.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>
                {featuredSession.audioUrl ? `${Math.floor(featuredSession.durationSeconds / 60)} min · Begin when ready` : "Guided reflection · Begin when ready"}
              </div>
            </div>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="hp-ring" />
              <div className="hp-glow" style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(145deg, #44e48a 0%, ${C.green} 60%, #27a060 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ position: "absolute", inset: 3, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.22)" }} />
                <svg width="15" height="15" viewBox="0 0 24 24" fill={C.bg} style={{ marginLeft: 2 }}><polygon points="6,3 20,12 6,21" /></svg>
              </div>
            </div>
          </div>
        )}

        {/* JOURNEY CONTINUITY */}
        {recentProgress && recentSessionTitle && (
          <div className="hp-tap" onClick={() => void navigate(`/player/${recentProgress.sessionId}`)}
            style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, borderLeft: `3px solid ${C.gold}`, border: `1px solid ${C.bGold}`, borderRadius: 20, padding: "18px", marginBottom: 14, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.40)", transition: "opacity 0.15s, transform 0.15s" }}>
            <div style={{ fontSize: 9, color: C.gold, textTransform: "uppercase", letterSpacing: 2.5, fontWeight: 700, marginBottom: 10 }}>Continue your journey</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: C.text }}>{recentSessionTitle}</div>
                <div style={{ fontSize: 12, color: C.muted }}>You returned for another moment of reflection</div>
              </div>
              <div style={{ background: `rgba(201,164,114,0.12)`, border: `1px solid ${C.bGold}`, borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Play size={16} color={C.gold} fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {/* PRAYER CARD */}
        <div className="hp-tap" onClick={() => void navigate("/prayer-times")}
          style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid rgba(255,255,255,0.05)`, borderRadius: 20, padding: "18px 18px", marginBottom: 14, cursor: "pointer", boxShadow: "0 4px 18px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.025)", transition: "opacity 0.15s, transform 0.15s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 2.2, marginBottom: 4, fontWeight: 600 }}>Next prayer</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.green }}>{nextPrayer.name}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.gold, fontFamily: "'SF Mono', 'Fira Mono', monospace", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {PRAYER_ORDER.map(name => {
              const p = prayerTimes.find(pt => pt.name === name);
              const isNext = name === nextPrayer.name;
              return (
                <div key={name} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, marginBottom: 3, fontWeight: 600, color: isNext ? C.green : C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{name}</div>
                  <div style={{ fontSize: 10, fontWeight: isNext ? 700 : 400, color: isNext ? C.gold : "rgba(240,236,228,0.38)" }}>{p?.time ?? "--:--"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EMOTION CHECK-IN */}
        {!mood.emotion ? (
          <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 20, padding: "20px 18px", marginBottom: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.38)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 5 }}>What do you need right now?</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 18 }}>Your answer shapes everything that follows.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {EMOTIONS.map(em => {
                const Icon = em.icon;
                return (
                  <button key={em.key} onClick={() => void handleEmotionSelect(em.key)}
                    style={{ background: `rgba(26,19,13,0.8)`, border: `1px solid rgba(52,201,122,0.09)`, borderRadius: 14, padding: "12px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, transition: "border-color 0.2s" }}>
                    <Icon size={20} color={C.green} strokeWidth={1.5} />
                    <span style={{ fontSize: 10, color: C.muted, textAlign: "center", lineHeight: 1.2, fontWeight: 500 }}>{em.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>Feeling today</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, textTransform: "capitalize" }}>{mood.emotion}</div>
            </div>
            <button onClick={() => setMood(prev => ({ ...prev, emotion: null }))}
              style={{ background: "rgba(52,201,122,0.08)", border: "none", color: C.green, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
              Edit
            </button>
          </div>
        )}

        {/* STREAK */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.gold, fontFamily: "DM Sans, sans-serif", lineHeight: 1 }}>{streak.currentStreak}</div>
            <div style={{ fontSize: 12, color: C.text, marginTop: 4, fontWeight: 500 }}>{streakLabel}</div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {Array(7).fill(null).map((_, i) => {
              const done = i < streak.weeklyCompleted;
              return <div key={i} style={{ width: i === 6 ? 9 : 7, height: i === 6 ? 9 : 7, borderRadius: "50%", background: done ? C.green : "rgba(255,255,255,0.08)", boxShadow: done ? `0 0 6px ${C.green}70` : "none" }} />;
            })}
            <span style={{ marginLeft: 4, fontSize: 14, color: C.gold }}>🔥</span>
          </div>
        </div>

        {/* NAME OF ALLAH */}
        {nameOfAllah && (
          <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 20, padding: "22px 18px", marginTop: 14, marginBottom: 14, textAlign: "center", boxShadow: "0 4px 18px rgba(0,0,0,0.38)" }}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 2.5, fontWeight: 600, marginBottom: 14 }}>Name of Allah today</div>
            <div style={{ fontFamily: "'Scheherazade New', 'Traditional Arabic', serif", fontSize: 30, color: C.gold, direction: "rtl", marginBottom: 10, textShadow: "0 1px 2px rgba(0,0,0,1)" }}>{nameOfAllah.arabic}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{nameOfAllah.nameEnglish}</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{nameOfAllah.meaningEnglish}</div>
          </div>
        )}

        {/* QUICK DHIKR */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "18px 0 12px" }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.04)" }} />
          <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>Quick dhikr</div>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.04)" }} />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            { arabic: "سُبْحَانَ اللَّهِ", english: "SubhanAllah", dhikr: "subhanallah" },
            { arabic: "اَلْحَمْدُ لِلَّهِ", english: "Alhamdulillah", dhikr: "alhamdulillah" },
            { arabic: "اللَّهُ أَكْبَرُ", english: "Allahu Akbar", dhikr: "allahuakbar" },
          ].map(t => (
            <div key={t.dhikr} onClick={() => void navigate(`/tasbih?dhikr=${t.dhikr}`)}
              style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 8px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontFamily: "'Scheherazade New', serif", fontSize: 16, color: C.gold, direction: "rtl", marginBottom: 5, textShadow: "0 1px 2px rgba(0,0,0,1)" }}>{t.arabic}</div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 500 }}>{t.english}</div>
            </div>
          ))}
        </div>

        {/* AI COMPANION */}
        <div className="hp-tap" onClick={() => void navigate("/companion")}
          style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 20, padding: "18px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", boxShadow: "0 4px 18px rgba(0,0,0,0.38)", transition: "opacity 0.15s, transform 0.15s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(201,164,114,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: C.gold }}><Sparkles size={20} strokeWidth={1.5} /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.gold, marginBottom: 3 }}>Talk to your companion</div>
              <div style={{ fontSize: 12, color: C.muted }}>Reflect, seek guidance, or find calm</div>
            </div>
          </div>
          <ChevronRight size={16} color={C.gold} style={{ opacity: 0.6 }} />
        </div>

        {/* TOOLS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>Islamic tools</div>
          <button onClick={() => setShowAllTools(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted, fontWeight: 500 }}>
            {showAllTools ? "Show less" : "See all"}
            <ChevronDown size={13} style={{ transform: showAllTools ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9 }}>
          {visibleTools.map(({ icon: Icon, label, path }) => (
            <div key={path} className="hp-tool" onClick={() => void navigate(path)}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "15px 6px", textAlign: "center", cursor: "pointer", transition: "opacity 0.15s" }}>
              <Icon size={19} color={C.green} strokeWidth={1.5} style={{ margin: "0 auto 7px", display: "block" }} />
              <div style={{ fontSize: 10, color: C.text, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
