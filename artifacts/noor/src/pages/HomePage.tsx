import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";
import { useNotifications } from "../hooks/useNotifications";
import { Sun, Moon, Heart, BookOpen, RotateCcw, Building2, Sparkles, Compass, MapPin, Calculator, Calendar, BookMarked, Droplets, Star, Gift, Baby } from "lucide-react";

interface PrayerTime { name: string; time: string; }
interface HijriData { day: string; month: { number: number; en: string }; year: string; }
interface Session {
  id: string; title: string; category: string; durationSeconds: number; audioUrl?: string;
}
interface StreakData { currentStreak: number; weeklyCompleted: number; weeklyGoal: number; }
interface NameOfAllah { arabic: string; nameEnglish: string; meaningEnglish: string; }
interface Hadith { textEnglish: string; source: string; }

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function parseTimeToDate(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number) as [number, number];
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const CATEGORY_ICONS: Record<string, typeof Sun> = {
  azkar: Sun, quran: BookOpen, dhikr: RotateCcw,
  sleep: Moon, dua60: Heart, dua: Heart, salah: Building2, healing: Sparkles,
};

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [hijri, setHijri] = useState<HijriData | null>(null);
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, weeklyCompleted: 0, weeklyGoal: 5 });
  const [nameOfAllah, setNameOfAllah] = useState<NameOfAllah>({ arabic: "الرَّحْمَن", nameEnglish: "Ar-Rahman", meaningEnglish: "The Most Merciful" });
  const [hadith, setHadith] = useState<Hadith>({ textEnglish: "The best of you are those who learn the Quran and teach it.", source: "Sahih Bukhari" });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [healingSessions, setHealingSessions] = useState<Session[]>([]);
  const [countdown, setCountdown] = useState("--:--:--");
  const [iftarCountdown, setIftarCountdown] = useState("--:--:--");
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string }>({ name: "Fajr", time: "04:43" });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ sessions: Session[]; duas: { id: string; title: string; category: string }[]; names: { nameEnglish: string; nameArabic: string; meaningEnglish: string }[] }>({ sessions: [], duas: [], names: [] });
  const [allSessions, setAllSessions] = useState<Session[]>([]);

  const { subscribed, subscribe, unsubscribe, loading: notifLoading, prefs: notifPrefs, updatePrefs, sendTest, permission: notifPermission, supported: notifSupported } = useNotifications();

  const particleKeys = useRef(Array.from({ length: 8 }, (_, i) => i));
  const token = typeof window !== "undefined" ? localStorage.getItem("tazki_token") : null;
  const u = user as Record<string, unknown> | null;
  const city = (u?.["city"] as string) || "Delhi";
  const isRamadan = hijri?.month?.number === 9;
  const isMuharram = hijri?.month?.number === 1;

  // Fetch all sessions once for search
  useEffect(() => {
    fetch("/api/sessions?limit=100").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setAllSessions(d as Session[]);
    }).catch(() => null);
  }, []);

  // Live search across sessions, duas, names
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setSearchResults({ sessions: [], duas: [], names: [] }); return; }
    const matchedSessions = allSessions.filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)).slice(0, 5);
    Promise.all([
      fetch(`/api/duas`).then(r => r.json()).catch(() => []),
      fetch(`/api/names?q=${encodeURIComponent(q)}&limit=5`).then(r => r.json()).catch(() => []),
    ]).then(([duasData, namesData]) => {
      const filteredDuas = (Array.isArray(duasData) ? duasData : []).filter(
        (d: { title: string; category: string }) => d.title?.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q)
      ).slice(0, 5);
      const filteredNames = (Array.isArray(namesData) ? namesData : []).slice(0, 5);
      setSearchResults({ sessions: matchedSessions, duas: filteredDuas, names: filteredNames });
    });
  }, [searchQuery, allSessions]);

  useEffect(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    Promise.all([
      fetch(`/api/prayer/times?city=${encodeURIComponent(city)}`).then(r => r.json()).catch(() => null),
      fetch("/api/prayer/hijri").then(r => r.json()).catch(() => null),
      token ? fetch("/api/streak/me", { headers }).then(r => r.json()).catch(() => null) : Promise.resolve(null),
      fetch("/api/names-of-allah/today").then(r => r.json()).catch(() => null),
      fetch("/api/hadith/today").then(r => r.json()).catch(() => null),
      fetch("/api/sessions?limit=4").then(r => r.json()).catch(() => null),
      fetch("/api/sessions?category=HEALING&limit=2").then(r => r.json()).catch(() => null),
    ]).then(([prayerData, hijriData, streakData, nameData, hadithData, sessionsData, healingData]) => {
      if (prayerData?.times) setPrayerTimes(prayerData.times);
      if (hijriData?.day) setHijri(hijriData as HijriData);
      if (streakData?.currentStreak !== undefined) setStreak(streakData as StreakData);
      if (nameData?.arabic) setNameOfAllah(nameData as NameOfAllah);
      if (hadithData?.textEnglish) setHadith(hadithData as Hadith);
      if (Array.isArray(sessionsData)) setSessions((sessionsData as Session[]).slice(0, 4));
      if (Array.isArray(healingData)) {
        const filtered = (healingData as Session[]).filter(s => s.category === "HEALING").slice(0, 2);
        setHealingSessions(filtered);
      }
    });
  }, [city, token]);

  useEffect(() => {
    if (!prayerTimes.length) return;
    const now = new Date();
    for (const p of prayerTimes) {
      const pt = parseTimeToDate(p.time);
      if (pt > now) { setNextPrayer({ name: p.name, time: p.time }); return; }
    }
    const first = prayerTimes[0];
    if (first) setNextPrayer({ name: first.name, time: first.time });
  }, [prayerTimes]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!nextPrayer.time) return;
      const target = parseTimeToDate(nextPrayer.time);
      const now = new Date();
      if (target <= now) target.setDate(target.getDate() + 1);
      setCountdown(formatCountdown(target.getTime() - now.getTime()));

      const maghrib = prayerTimes.find(p => p.name === "Maghrib");
      if (maghrib) {
        const iftar = parseTimeToDate(maghrib.time);
        if (iftar <= now) iftar.setDate(iftar.getDate() + 1);
        setIftarCountdown(formatCountdown(iftar.getTime() - now.getTime()));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer, prayerTimes]);

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekday = weekDays[new Date().getDay()] ?? "";
  const hijriLine = hijri ? `${weekday}, ${hijri.day} ${hijri.month.en} ${hijri.year} AH` : `${weekday}`;

  const weekDots = Array(7).fill(null).map((_, i) => {
    if (i < streak.weeklyCompleted - 1) return "filled";
    if (i === streak.weeklyCompleted - 1) return "today";
    return "empty";
  });

  return (
    <div style={{
      background: "#001a00", minHeight: "100vh", color: "#e8f5e8",
      position: "relative", overflow: "hidden", paddingBottom: 80,
    }}>
      <style>{`
        @keyframes crescentGlow {
          0%,100% { filter: drop-shadow(0 0 8px rgba(0,165,80,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(0,165,80,0.7)); }
        }
        @keyframes floatUp {
          0% { opacity:0; transform:translateY(0); }
          20% { opacity:.8; }
          80% { opacity:.3; }
          100% { opacity:0; transform:translateY(-150px); }
        }
      `}</style>

      {/* Floating particles */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        {particleKeys.current.map((i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${30 + (i * 5.7) % 40}%`,
            bottom: `${10 + (i * 9.3) % 30}%`,
            width: 2, height: 2,
            background: "#ffd700", borderRadius: "50%",
            animation: `floatUp ${3 + (i % 4)}s ${(i * 0.8) % 5}s linear infinite`,
            opacity: 0,
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Section 1: Islamic Banner */}
        {isRamadan ? (
          <div style={{
            background: "rgba(255,215,0,0.12)", borderBottom: "0.5px solid rgba(255,215,0,0.25)",
            padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "#ffd700" }}>Ramadan Mubarak</span>
            <span style={{ fontFamily: "Amiri, serif", fontSize: 14, color: "#ffd700", direction: "rtl" }}>رمضان مبارك</span>
          </div>
        ) : isMuharram ? (
          <div style={{
            background: "rgba(42,74,106,0.3)", borderBottom: "0.5px solid rgba(100,149,237,0.25)",
            padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "#c8e8c8" }}>Month of Muharram</span>
            <span style={{ fontFamily: "Amiri, serif", fontSize: 14, color: "#c8e8c8", direction: "rtl" }}>مُحَرَّم</span>
          </div>
        ) : hijri ? (
          <div style={{
            background: "rgba(0,165,80,0.08)", borderBottom: "0.5px solid rgba(0,165,80,0.15)",
            padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "#4a7a4a" }}>{hijri.day} {hijri.month.en} {hijri.year} AH</span>
            <span style={{ fontSize: 16, color: "#4a7a4a" }}>☪</span>
          </div>
        ) : null}

        {/* Section 2: Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#00a550", letterSpacing: 4, fontFamily: "Cinzel, serif" }}>
            MYTAZKI
          </div>
          <div style={{ display: "flex", gap: 16, color: "#4a7a4a" }}>
            <span style={{ fontSize: 20, cursor: "pointer" }} onClick={() => { setShowNotifications(v => !v); setShowSearch(false); setShowMenu(false); }}>🔔</span>
            <span style={{ fontSize: 20, cursor: "pointer" }} onClick={() => { setShowSearch(v => !v); setShowNotifications(false); setShowMenu(false); setSearchQuery(""); }}>🔍</span>
            <span style={{ fontSize: 20, cursor: "pointer" }} onClick={() => { setShowMenu(v => !v); setShowNotifications(false); setShowSearch(false); }}>☰</span>
          </div>
        </div>

        {/* Section 3: Greeting */}
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ fontSize: 17, fontWeight: 500 }}>
            As-salamu alaykum, {(u?.["name"] as string) || "Guest"}
          </div>
          <div style={{ fontSize: 12, color: "#4a7a4a", marginTop: 3 }}>
            {hijriLine}
          </div>
        </div>

        {/* Section 4: Prayer Times Card */}
        <div
          onClick={() => void navigate("/prayer-times")}
          style={{
            margin: "0 16px 14px", background: "rgba(0,165,80,0.08)",
            border: "0.5px solid rgba(0,165,80,0.25)", borderRadius: 12, padding: 14, cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                Next prayer
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, color: "#00a550" }}>
                {nextPrayer.name}
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 500, color: "#ffd700", fontVariantNumeric: "tabular-nums", fontFamily: "monospace" }}>
              {countdown}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "0.5px solid rgba(0,165,80,0.15)" }}>
            {PRAYER_ORDER.map(name => {
              const p = prayerTimes.find(pt => pt.name === name);
              const isNext = name === nextPrayer.name;
              return (
                <div key={name} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: isNext ? "#00a550" : "#4a7a4a", marginBottom: 2 }}>
                    {name}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: isNext ? "#ffd700" : "#e8f5e8" }}>
                    {p?.time ?? "--:--"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Crescent SVG */}
        <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 10px", position: "relative" }}>
          <svg
            style={{ animation: "crescentGlow 3s ease-in-out infinite" }}
            width="60" height="60" viewBox="0 0 60 60"
          >
            <circle cx="30" cy="30" r="28" fill="rgba(0,165,80,0.08)" />
            <path d="M38 10 A20 20 0 1 1 38 50 A14 14 0 1 0 38 10Z" fill="#00a550" opacity="0.85" />
            <circle cx="42" cy="16" r="2" fill="#ffd700" opacity="0.8" />
            <circle cx="48" cy="22" r="1.2" fill="#ffd700" opacity="0.6" />
            <circle cx="46" cy="30" r="1.5" fill="#ffd700" opacity="0.5" />
          </svg>
        </div>

        {/* Section 6: Ibadah Streak */}
        <div style={{
          margin: "0 16px 14px", background: "rgba(0,165,80,0.06)",
          border: "0.5px solid rgba(0,165,80,0.2)", borderRadius: 12,
          padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 36, color: "#ffd700", fontWeight: 500, lineHeight: 1, marginBottom: 2 }}>
              {streak.currentStreak}
            </div>
            <div style={{ fontSize: 11, color: "#4a7a4a" }}>Ibadah streak</div>
            <div style={{ fontSize: 12, color: "#00a550", marginTop: 2 }}>
              {streak.weeklyCompleted} / {streak.weeklyGoal} this week
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {weekDots.map((d, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: d === "today" ? "#ffd700" : d === "filled" ? "#00a550" : "#002800",
                boxShadow: d === "today" ? "0 0 6px rgba(255,215,0,0.5)" : d === "filled" ? "0 0 4px rgba(0,165,80,0.4)" : "none",
              }} />
            ))}
          </div>
        </div>

        {/* Section 7: Daily Cards horizontal scroll */}
        <div style={{ display: "flex", gap: 10, padding: "0 16px 14px", overflowX: "auto", scrollbarWidth: "none" }}>
          {/* Name of Allah */}
          <div style={{
            flexShrink: 0, width: 140, background: "rgba(0,165,80,0.06)",
            border: "0.5px solid rgba(0,165,80,0.2)", borderRadius: 10, padding: 11,
          }}>
            <div style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
              Name of Allah
            </div>
            <div style={{ fontFamily: "Amiri, serif", fontSize: 18, color: "#ffd700", direction: "rtl", textAlign: "right", marginBottom: 3 }}>
              {nameOfAllah.arabic}
            </div>
            <div style={{ fontSize: 11, color: "#c8e8c8", lineHeight: 1.4 }}>
              {nameOfAllah.nameEnglish}, {nameOfAllah.meaningEnglish}
            </div>
          </div>

          {/* Hadith */}
          <div style={{
            flexShrink: 0, width: 160, background: "rgba(0,165,80,0.06)",
            border: "0.5px solid rgba(0,165,80,0.2)", borderRadius: 10, padding: 11,
          }}>
            <div style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
              Hadith today
            </div>
            <div style={{ fontSize: 11, color: "#c8e8c8", lineHeight: 1.5 }}>
              "{hadith.textEnglish.slice(0, 100)}{hadith.textEnglish.length > 100 ? "…" : ""}"
            </div>
            <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 4 }}>
             , {hadith.source}
            </div>
          </div>

          {/* Iftar countdown (Ramadan only) */}
          {isRamadan && (
            <div style={{
              flexShrink: 0, width: 130, background: "rgba(255,215,0,0.06)",
              border: "0.5px solid rgba(255,215,0,0.2)", borderRadius: 10, padding: 11, textAlign: "center",
            }}>
              <div style={{ fontSize: 10, color: "#ffd700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
                Iftar in
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#ffd700", fontVariantNumeric: "tabular-nums" }}>
                {iftarCountdown}
              </div>
              <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 3 }}>
                Maghrib {prayerTimes.find(p => p.name === "Maghrib")?.time ?? ""}
              </div>
            </div>
          )}
        </div>

        {/* Section 8: Quick Start Grid */}
        <div style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, padding: "0 16px", marginBottom: 8 }}>
          Start your ibadah
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 16px", marginBottom: 14 }}>
          {sessions.length === 0 ? (
            [0, 1, 2, 3].map(i => (
              <div key={i} style={{
                background: "rgba(0,165,80,0.04)", border: "0.5px solid rgba(0,165,80,0.1)",
                borderRadius: 10, padding: 12, height: 72,
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))
          ) : sessions.map((s) => {
            const catKey = s.category.toLowerCase();
            const IconComp = CATEGORY_ICONS[catKey] ?? Heart;
            return (
              <div
                key={s.id}
                onClick={() => void navigate(`/player/${s.id}`)}
                style={{
                  background: "rgba(0,165,80,0.07)", border: "0.5px solid rgba(0,165,80,0.2)",
                  borderRadius: 10, padding: 12, cursor: "pointer",
                }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.15)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.07)"; }}
              >
                <IconComp size={20} color="#00a550" style={{ display: "block", marginBottom: 6 }} />
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: "#4a7a4a" }}>
                  {Math.floor(s.durationSeconds / 60)} min · {s.category}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 9: Mood Button */}
        <div
          onClick={() => void navigate("/mood")}
          style={{
            margin: "0 16px 14px", background: "rgba(255,215,0,0.07)",
            border: "0.5px solid rgba(255,215,0,0.25)", borderRadius: 10, padding: "13px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: "#ffd700", fontWeight: 500 }}>What do you need today?</div>
            <div style={{ fontSize: 11, color: "#4a7a4a", marginTop: 2 }}>Find the right dua for this moment</div>
          </div>
          <span style={{ fontSize: 20, color: "#ffd700" }}>→</span>
        </div>

        {/* Section 10: Quick Tasbih Row */}
        <div style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, padding: "0 16px", marginBottom: 8 }}>
          Quick tasbih
        </div>
        <div style={{ display: "flex", gap: 8, padding: "0 16px", marginBottom: 16 }}>
          {[
            { arabic: "سُبْحَانَ اللَّهِ", english: "SubhanAllah", dhikr: "subhanallah" },
            { arabic: "اَلْحَمْدُ لِلَّهِ", english: "Alhamdulillah", dhikr: "alhamdulillah" },
            { arabic: "اللَّهُ أَكْبَرُ", english: "Allahu Akbar", dhikr: "allahuakbar" },
          ].map(t => (
            <div
              key={t.dhikr}
              onClick={() => void navigate(`/tasbih?dhikr=${t.dhikr}`)}
              style={{
                flex: 1, background: "rgba(0,165,80,0.06)", border: "0.5px solid rgba(0,165,80,0.2)",
                borderRadius: 8, padding: 9, textAlign: "center", cursor: "pointer",
              }}
            >
              <div style={{ fontFamily: "Amiri, serif", fontSize: 13, color: "#ffd700", direction: "rtl" }}>
                {t.arabic}
              </div>
              <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 2 }}>{t.english}</div>
            </div>
          ))}
        </div>

        {/* Section 11: Islamic Tools Grid */}
        <div style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, padding: "0 16px", marginBottom: 8 }}>
          Islamic Tools
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 16px", marginBottom: 20 }}>
          {[
            { icon: BookOpen,   label: "Quran",           path: "/quran" },
            { icon: Compass,    label: "Qibla",           path: "/qibla" },
            { icon: MapPin,     label: "Masjid Finder",   path: "/masjid-finder" },
            { icon: Calculator, label: "Zakat",           path: "/zakat-calculator" },
            { icon: Calendar,   label: "Calendar",        path: "/islamic-calendar" },
            { icon: Star,       label: "99 Names",        path: "/99-names" },
            { icon: BookMarked, label: "Farz Guide",      path: "/farz-guide" },
            { icon: Droplets,   label: "Wudu Guide",      path: "/wudu-guide" },
            { icon: Building2,  label: "Salah Guide",     path: "/salah-guide" },
            { icon: Gift,       label: "Sadqa",           path: "/sadqa-guide" },
            { icon: Heart,      label: "Qurbani",         path: "/qurbani-guide" },
            { icon: Baby,       label: "Baby Names",      path: "/names" },
          ].map(({ icon: Icon, label, path }) => (
            <div
              key={path}
              onClick={() => void navigate(path)}
              style={{
                background: "rgba(0,165,80,0.06)",
                border: "0.5px solid rgba(0,165,80,0.18)",
                borderRadius: 10, padding: "12px 8px",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 6, cursor: "pointer", textAlign: "center",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.14)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.06)"; }}
            >
              <Icon size={20} color="#00a550" />
              <div style={{ fontSize: 11, color: "#e8f5e8", fontWeight: 500, lineHeight: 1.2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Section 12: Healing Sessions */}
        {healingSessions.length > 0 && (
          <>
            <div style={{ padding: "0 16px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <Sparkles size={13} color="#ffd700" />
                <span style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1 }}>
                  Healing sessions
                </span>
              </div>
              <div style={{ fontFamily: "Amiri, serif", fontSize: 13, color: "rgba(255,215,0,0.45)", direction: "rtl", textAlign: "right" }}>
                وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 16px", marginBottom: 20 }}>
              {healingSessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => void navigate(`/player/${s.id}`)}
                  style={{
                    background: "linear-gradient(135deg, rgba(0,38,0,0.9) 0%, rgba(0,55,25,0.7) 100%)",
                    border: "0.5px solid rgba(255,215,0,0.15)",
                    borderRadius: 12, padding: "13px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,215,0,0.3)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,215,0,0.15)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(255,215,0,0.12) 0%, rgba(0,165,80,0.08) 100%)",
                      border: "0.5px solid rgba(255,215,0,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Sparkles size={16} color="#ffd700" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#e8f5e8", marginBottom: 2 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: "#4a7a4a" }}>
                        {Math.floor(s.durationSeconds / 60)} min · Healing
                      </div>
                    </div>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(0,165,80,0.15)", border: "0.5px solid rgba(0,165,80,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 11, color: "#00a550", marginLeft: 2 }}>▶</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* ── NOTIFICATION PANEL ── */}
      {showNotifications && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200 }} onClick={() => setShowNotifications(false)}>
          <div
            style={{
              position: "absolute", top: 56, left: 12, right: 12,
              background: "#001500", border: "1px solid rgba(0,165,80,0.25)",
              borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.7)", overflow: "hidden",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "14px 16px 10px", borderBottom: "0.5px solid rgba(0,165,80,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e8f5e8" }}>🔔 Notifications</span>
              <span style={{ fontSize: 11, color: "#00a550", cursor: "pointer" }} onClick={() => setShowNotifications(false)}>Close</span>
            </div>

            {/* Live summary items */}
            {[
              { icon: "🕌", title: `Next: ${nextPrayer.name}`, sub: `Prayer in ${countdown}`, action: () => { void navigate("/prayer-times"); setShowNotifications(false); } },
              { icon: "🔥", title: `Day ${streak.currentStreak} streak`, sub: `${streak.weeklyCompleted}/${streak.weeklyGoal} days this week`, action: null },
              { icon: "✦", title: nameOfAllah.nameEnglish, sub: nameOfAllah.meaningEnglish, action: () => { void navigate("/99-names"); setShowNotifications(false); } },
              { icon: "📖", title: "Today's Hadith", sub: hadith.textEnglish.slice(0, 58) + "…", action: null },
            ].map((n, i) => (
              <div key={i} onClick={n.action ?? undefined} style={{ display: "flex", gap: 12, padding: "11px 16px", borderBottom: "0.5px solid rgba(0,165,80,0.07)", cursor: n.action ? "pointer" : "default", alignItems: "center" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e8f5e8" }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: "#4a7a4a", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.sub}</div>
                </div>
              </div>
            ))}

            {/* Push notification controls */}
            <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(0,165,80,0.12)", background: "rgba(0,165,80,0.04)" }}>
              <div style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 600 }}>Push Notifications</div>

              {!notifSupported ? (
                <div style={{ fontSize: 12, color: "#4a7a4a" }}>Not supported in this browser.</div>
              ) : notifPermission === "denied" ? (
                <div style={{ fontSize: 12, color: "#b8946a" }}>Notifications blocked. Enable in browser settings.</div>
              ) : !subscribed ? (
                <button
                  onClick={() => { void subscribe(); }}
                  disabled={notifLoading}
                  style={{ width: "100%", padding: "10px", background: notifLoading ? "rgba(0,165,80,0.3)" : "#00a550", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: notifLoading ? "default" : "pointer", fontFamily: "inherit" }}
                >
                  {notifLoading ? "Enabling…" : "Enable Push Notifications"}
                </button>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    {([
                      { key: "notifyPrayer", label: "🕌 Prayer Times" },
                      { key: "notifyDua", label: "🤲 Daily Duas" },
                      { key: "notifyHadith", label: "📖 Hadith" },
                      { key: "notifyStreak", label: "🔥 Streak" },
                    ] as { key: keyof typeof notifPrefs; label: string }[]).map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => void updatePrefs({ [key]: !notifPrefs[key] })}
                        style={{
                          padding: "8px 6px", borderRadius: 8, border: `1px solid ${notifPrefs[key] ? "#00a550" : "rgba(0,165,80,0.2)"}`,
                          background: notifPrefs[key] ? "rgba(0,165,80,0.15)" : "transparent",
                          color: notifPrefs[key] ? "#00a550" : "#4a7a4a", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
                          textAlign: "center",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => void sendTest()}
                      style={{ flex: 1, padding: "8px", background: "rgba(0,165,80,0.1)", border: "1px solid rgba(0,165,80,0.25)", borderRadius: 8, color: "#00a550", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Send Test
                    </button>
                    <button
                      onClick={() => void unsubscribe()}
                      disabled={notifLoading}
                      style={{ flex: 1, padding: "8px", background: "transparent", border: "1px solid rgba(165,0,0,0.3)", borderRadius: 8, color: "#a05050", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      {notifLoading ? "…" : "Turn Off"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SEARCH OVERLAY ── */}
      {showSearch && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(0,10,0,0.97)", display: "flex", flexDirection: "column",
        }}>
          {/* Search header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 12px", borderBottom: "0.5px solid rgba(0,165,80,0.15)" }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sessions, duas, names…"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#e8f5e8", fontSize: 15, fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => { setShowSearch(false); setSearchQuery(""); }}
              style={{ background: "transparent", border: "none", color: "#4a7a4a", fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
            >
              Cancel
            </button>
          </div>

          {/* Results */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
            {!searchQuery && (
              <div>
                <div style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Quick access</div>
                {[
                  { label: "Prayer Times", path: "/prayer-times", icon: "🕌" },
                  { label: "Quran Reader", path: "/quran", icon: "📖" },
                  { label: "Duas Library", path: "/duas", icon: "🤲" },
                  { label: "Baby Names", path: "/names", icon: "👶" },
                  { label: "Tasbih Counter", path: "/tasbih", icon: "📿" },
                  { label: "Qibla Compass", path: "/qibla", icon: "🧭" },
                  { label: "99 Names of Allah", path: "/99-names", icon: "✨" },
                  { label: "Zakat Calculator", path: "/zakat-calculator", icon: "💰" },
                ].map(item => (
                  <div
                    key={item.path}
                    onClick={() => { void navigate(item.path); setShowSearch(false); setSearchQuery(""); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "0.5px solid rgba(0,165,80,0.08)", cursor: "pointer" }}
                  >
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, color: "#e8f5e8" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && (
              <>
                {searchResults.sessions.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#00a550", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Sessions</div>
                    {searchResults.sessions.map(s => (
                      <div key={s.id} onClick={() => { void navigate(`/player/${s.id}`); setShowSearch(false); setSearchQuery(""); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid rgba(0,165,80,0.08)", cursor: "pointer" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#e8f5e8" }}>{s.title}</div>
                          <div style={{ fontSize: 11, color: "#4a7a4a", marginTop: 2 }}>{s.category} · {Math.floor(s.durationSeconds / 60)} min</div>
                        </div>
                        <span style={{ fontSize: 14, color: "#00a550" }}>▶</span>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.duas.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#00a550", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Duas</div>
                    {searchResults.duas.map((d, i) => (
                      <div key={i} onClick={() => { void navigate("/duas"); setShowSearch(false); setSearchQuery(""); }}
                        style={{ padding: "10px 0", borderBottom: "0.5px solid rgba(0,165,80,0.08)", cursor: "pointer" }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#e8f5e8" }}>{d.title}</div>
                        <div style={{ fontSize: 11, color: "#4a7a4a", marginTop: 2 }}>{d.category}</div>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.names.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "#00a550", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Names</div>
                    {searchResults.names.map((n: { nameEnglish: string; nameArabic: string; meaningEnglish: string }, i) => (
                      <div key={i} onClick={() => { void navigate("/names"); setShowSearch(false); setSearchQuery(""); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid rgba(0,165,80,0.08)", cursor: "pointer" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#e8f5e8" }}>{n.nameEnglish}</div>
                          <div style={{ fontSize: 11, color: "#4a7a4a", marginTop: 2 }}>{n.meaningEnglish}</div>
                        </div>
                        <span style={{ fontFamily: "Amiri, serif", fontSize: 16, color: "#4a7a4a", direction: "rtl" }}>{n.nameArabic}</span>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.sessions.length === 0 && searchResults.duas.length === 0 && searchResults.names.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#4a7a4a", fontSize: 14 }}>
                    No results for "{searchQuery}"
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── MENU DRAWER ── */}
      {showMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400 }} onClick={() => setShowMenu(false)}>
          <div
            style={{
              position: "absolute", top: 0, right: 0, bottom: 0, width: "78%", maxWidth: 320,
              background: "#001500", borderLeft: "1px solid rgba(0,165,80,0.2)",
              overflowY: "auto", display: "flex", flexDirection: "column",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div style={{ padding: "20px 20px 16px", borderBottom: "0.5px solid rgba(0,165,80,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#00a550", fontFamily: "Cinzel, serif", letterSpacing: 2 }}>MYTAZKI</div>
                <div style={{ fontSize: 12, color: "#4a7a4a", marginTop: 2 }}>As-salamu alaykum, {(u?.["name"] as string) || "Guest"}</div>
              </div>
              <button onClick={() => setShowMenu(false)} style={{ background: "rgba(0,165,80,0.1)", border: "1px solid rgba(0,165,80,0.2)", borderRadius: 8, color: "#4a7a4a", fontSize: 18, cursor: "pointer", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Menu sections */}
            {[
              {
                section: "Daily Practice",
                items: [
                  { icon: "🕌", label: "Prayer Times", path: "/prayer-times" },
                  { icon: "📖", label: "Quran Reader", path: "/quran" },
                  { icon: "🤲", label: "Duas Library", path: "/duas" },
                  { icon: "📿", label: "Tasbih Counter", path: "/tasbih" },
                  { icon: "🌙", label: "Azkar Sessions", path: "/home" },
                ],
              },
              {
                section: "Islamic Tools",
                items: [
                  { icon: "🧭", label: "Qibla Compass", path: "/qibla" },
                  { icon: "📍", label: "Masjid Finder", path: "/masjid-finder" },
                  { icon: "💰", label: "Zakat Calculator", path: "/zakat-calculator" },
                  { icon: "📅", label: "Islamic Calendar", path: "/islamic-calendar" },
                  { icon: "✨", label: "99 Names of Allah", path: "/99-names" },
                  { icon: "👶", label: "Baby Names", path: "/names" },
                ],
              },
              {
                section: "Guides",
                items: [
                  { icon: "🙏", label: "Salah Guide", path: "/salah-guide" },
                  { icon: "💧", label: "Wudu Guide", path: "/wudu-guide" },
                  { icon: "📋", label: "Farz Guide", path: "/farz-guide" },
                  { icon: "💚", label: "Sadqa Guide", path: "/sadqa-guide" },
                  { icon: "🐑", label: "Qurbani Guide", path: "/qurbani-guide" },
                ],
              },
              {
                section: "Growth",
                items: [
                  { icon: "📈", label: "My Growth", path: "/growth" },
                  { icon: "📓", label: "Journal", path: "/journal" },
                  { icon: "🤝", label: "Halaqah Groups", path: "/halaqah" },
                  { icon: "😌", label: "Mood Check-in", path: "/mood" },
                ],
              },
              {
                section: "Account",
                items: [
                  { icon: "👤", label: "My Profile", path: "/profile" },
                  { icon: "🎁", label: "Gift Premium", path: "/gift/token" },
                ],
              },
            ].map(group => (
              <div key={group.section}>
                <div style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1.5, padding: "14px 20px 6px", fontWeight: 600 }}>{group.section}</div>
                {group.items.map(item => (
                  <div
                    key={item.path}
                    onClick={() => { void navigate(item.path); setShowMenu(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 20px", cursor: "pointer", borderBottom: "0.5px solid rgba(0,165,80,0.06)" }}
                    onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.08)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 17, width: 24, textAlign: "center" }}>{item.icon}</span>
                    <span style={{ fontSize: 14, color: "#e8f5e8" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ padding: "16px 20px", marginTop: "auto", borderTop: "0.5px solid rgba(0,165,80,0.1)" }}>
              <div style={{ fontSize: 11, color: "#2a3a2a", textAlign: "center" }}>MyTazki · Grow Spiritually Every Day</div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
