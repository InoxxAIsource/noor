import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";
import {
  BookOpen, Compass, MapPin, Calculator, Calendar,
  Star, BookMarked, Droplets, Building2, Heart, Baby, Gift,
  Bell, Search, Menu, X, ChevronRight,
} from "lucide-react";

interface PrayerTime { name: string; time: string; }
interface HijriData { day: string; month: { number: number; en: string }; year: string; }
interface StreakData { currentStreak: number; weeklyCompleted: number; weeklyGoal: number; }
interface MoodData { emotion: string | null; completedMorning: boolean; morningStreak: number; }
interface Session { id: string; title: string; category: string; durationSeconds: number; }
interface NameOfAllah { arabic: string; nameEnglish: string; meaningEnglish: string; }

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

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

function getTimeGreeting(): { greeting: string; sub: string } {
  const h = new Date().getHours();
  if (h >= 4 && h < 12) return { greeting: "Good morning", sub: "Begin your day with intention." };
  if (h >= 12 && h < 15) return { greeting: "Good afternoon", sub: "Stay grounded in Allah's remembrance." };
  if (h >= 15 && h < 19) return { greeting: "Good evening", sub: "Reflect on the blessings of today." };
  return { greeting: "Good night", sub: "End your day in peace and gratitude." };
}

const TOOLS = [
  { icon: BookOpen, label: "Quran", path: "/quran" },
  { icon: Compass, label: "Qibla", path: "/qibla" },
  { icon: MapPin, label: "Masjid", path: "/masjid-finder" },
  { icon: Calculator, label: "Zakat", path: "/zakat-calculator" },
  { icon: Calendar, label: "Calendar", path: "/islamic-calendar" },
  { icon: Star, label: "99 Names", path: "/99-names" },
  { icon: BookMarked, label: "Farz", path: "/farz-guide" },
  { icon: Droplets, label: "Wudu", path: "/wudu-guide" },
  { icon: Building2, label: "Salah", path: "/salah-guide" },
  { icon: Gift, label: "Sadqa", path: "/sadqa-guide" },
  { icon: Heart, label: "Qurbani", path: "/qurbani-guide" },
  { icon: Baby, label: "Names", path: "/names" },
];

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
  const [nameOfAllah, setNameOfAllah] = useState<NameOfAllah | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string }>({ name: "Fajr", time: "04:43" });
  const [countdown, setCountdown] = useState("--:--:--");
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [searchResults, setSearchResults] = useState<Session[]>([]);
  const [isRamadan, setIsRamadan] = useState(false);

  const { greeting, sub } = getTimeGreeting();
  const authHeaders = token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : {};

  useEffect(() => {
    Promise.all([
      fetch(`/api/prayer/times?city=${encodeURIComponent(city)}`).then(r => r.json()).catch(() => null),
      fetch("/api/prayer/hijri").then(r => r.json()).catch(() => null),
      token ? fetch("/api/streak/me", { headers: authHeaders }).then(r => r.json()).catch(() => null) : null,
      token ? fetch("/api/mood/today", { headers: authHeaders }).then(r => r.json()).catch(() => null) : null,
      fetch("/api/sessions?limit=10").then(r => r.json()).catch(() => []),
      fetch("/api/names-of-allah/today").then(r => r.json()).catch(() => null),
    ]).then(([prayerData, hijriData, streakData, moodData, sessionsData, nameData]) => {
      if (prayerData?.times) setPrayerTimes(prayerData.times as PrayerTime[]);
      if (hijriData?.day) {
        setHijri(hijriData as HijriData);
        setIsRamadan((hijriData as HijriData).month?.number === 9);
      }
      if (streakData?.currentStreak !== undefined) setStreak(streakData as StreakData);
      if (moodData) setMood(moodData as MoodData);
      if (Array.isArray(sessionsData) && (sessionsData as Session[]).length > 0) {
        setAllSessions(sessionsData as Session[]);
        const h = new Date().getHours();
        const preferred = h < 12 ? "azkar" : h < 17 ? "quran" : "sleep";
        const match = (sessionsData as Session[]).find(s => s.category?.toLowerCase() === preferred)
          ?? (sessionsData as Session[])[0];
        if (match) setFeaturedSession(match);
      }
      if (nameData?.arabic) setNameOfAllah(nameData as NameOfAllah);
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

  const hijriLine = hijri ? `${hijri.day} ${hijri.month.en} ${hijri.year} AH` : "";

  const streakLabel = streak.currentStreak === 0
    ? "Start your journey today"
    : streak.currentStreak === 1
      ? "1 day of ibadah"
      : `${streak.currentStreak} days of ibadah`;

  return (
    <div style={{ background: "#0d1411", minHeight: "100vh", color: "#eaf4ee", paddingBottom: 80 }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#34c97a", letterSpacing: 3, fontFamily: "DM Sans, sans-serif" }}>
          MYTAZKI
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Search size={18} color="#6a9878" style={{ cursor: "pointer" }}
            onClick={() => { setShowSearch(v => !v); setShowMenu(false); setSearchQuery(""); }} />
          <Bell size={18} color="#6a9878" style={{ cursor: "pointer" }}
            onClick={() => void navigate("/profile")} />
          <Menu size={18} color="#6a9878" style={{ cursor: "pointer" }}
            onClick={() => { setShowMenu(v => !v); setShowSearch(false); }} />
        </div>
      </div>

      {/* Search panel */}
      {showSearch && (
        <div style={{ margin: "12px 20px 0", animation: "fadeDown 0.2s ease" }}>
          <div style={{ position: "relative" }}>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sessions, duas, guides..."
              style={{
                width: "100%", background: "#152019", border: "1px solid rgba(52,201,122,0.2)",
                borderRadius: 12, padding: "12px 40px 12px 16px", color: "#eaf4ee",
                fontSize: 14, outline: "none", boxSizing: "border-box",
              }}
            />
            <X size={16} color="#6a9878" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              onClick={() => { setShowSearch(false); setSearchQuery(""); }} />
          </div>
          {searchResults.length > 0 && (
            <div style={{ background: "#152019", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 12, marginTop: 6, overflow: "hidden" }}>
              {searchResults.map(s => (
                <div key={s.id}
                  onClick={() => void navigate(`/player/${s.id}`)}
                  style={{ padding: "12px 16px", borderBottom: "1px solid rgba(52,201,122,0.08)", cursor: "pointer", fontSize: 14 }}
                >
                  {s.title}
                  <span style={{ fontSize: 11, color: "#6a9878", marginLeft: 8 }}>{s.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Side menu */}
      {showMenu && (
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 260,
          background: "#152019", borderLeft: "1px solid rgba(52,201,122,0.15)",
          zIndex: 100, padding: 24, animation: "slideLeft 0.2s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#34c97a" }}>Menu</span>
            <X size={18} color="#6a9878" style={{ cursor: "pointer" }} onClick={() => setShowMenu(false)} />
          </div>
          {[
            { label: "Sessions", path: "/sessions" }, { label: "Duas", path: "/duas" },
            { label: "Prayer Times", path: "/prayer-times" }, { label: "Journal", path: "/journal" },
            { label: "Growth", path: "/growth" }, { label: "Profile", path: "/profile" },
          ].map(item => (
            <div key={item.path}
              onClick={() => { void navigate(item.path); setShowMenu(false); }}
              style={{ padding: "14px 0", borderBottom: "1px solid rgba(52,201,122,0.08)", cursor: "pointer", fontSize: 15, color: "#eaf4ee" }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
      {showMenu && <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setShowMenu(false)} />}

      <div style={{ padding: "24px 20px 0" }}>

        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          {hijriLine && (
            <div style={{ fontSize: 11, color: "#6a9878", letterSpacing: 1, marginBottom: 6 }}>
              {hijriLine}{isRamadan && " · Ramadan Mubarak 🌙"}
            </div>
          )}
          <h1 style={{ fontSize: 22, fontFamily: "DM Sans, sans-serif", fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: 13, color: "#6a9878" }}>{sub}</p>
        </div>

        {/* Morning Flow CTA — primary retention loop */}
        {!mood.completedMorning ? (
          <div
            onClick={() => void navigate("/morning")}
            style={{
              background: "linear-gradient(135deg, #152019 0%, #1c2d21 100%)",
              border: "1px solid rgba(52,201,122,0.3)", borderRadius: 20,
              padding: "20px", marginBottom: 16, cursor: "pointer",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 12, right: 16, fontSize: 32, opacity: 0.15 }}>🌿</div>
            <div style={{ fontSize: 11, color: "#34c97a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              Peaceful morning
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, fontFamily: "DM Sans, sans-serif", marginBottom: 4 }}>
              Begin your day with intention
            </div>
            <div style={{ fontSize: 13, color: "#6a9878", marginBottom: 16 }}>
              A 3-minute guided morning ritual
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#34c97a", color: "#0d1411", borderRadius: 20,
              padding: "8px 16px", fontSize: 13, fontWeight: 600,
            }}>
              Begin now <ChevronRight size={14} />
            </div>
          </div>
        ) : (
          <div style={{
            background: "#152019", border: "1px solid rgba(52,201,122,0.2)",
            borderRadius: 20, padding: "16px 20px", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ fontSize: 24 }}>🌿</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#34c97a" }}>
                Alhamdulillah — morning complete
              </div>
              <div style={{ fontSize: 12, color: "#6a9878", marginTop: 2 }}>
                {mood.morningStreak > 1 ? `${mood.morningStreak} peaceful mornings` : "Your first peaceful morning"}
              </div>
            </div>
          </div>
        )}

        {/* Emotional check-in — if no mood today */}
        {!mood.emotion && mood.completedMorning === false && (
          <div style={{
            background: "#152019", border: "1px solid rgba(184,148,106,0.2)",
            borderRadius: 16, padding: 16, marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: "#b8946a", marginBottom: 10 }}>How are you feeling?</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { key: "peaceful", emoji: "🌿" }, { key: "grateful", emoji: "✨" },
                { key: "anxious", emoji: "🌊" }, { key: "distracted", emoji: "☁️" },
                { key: "overwhelmed", emoji: "🌧️" }, { key: "tired", emoji: "🌙" },
              ].map(em => (
                <button
                  key={em.key}
                  onClick={() => {
                    setMood(prev => ({ ...prev, emotion: em.key }));
                    void fetch("/api/mood/checkin", {
                      method: "POST", headers: authHeaders as Record<string, string>,
                      body: JSON.stringify({ emotion: em.key }),
                    });
                  }}
                  style={{
                    background: "#1c2d21", border: "1px solid rgba(52,201,122,0.15)",
                    borderRadius: 20, padding: "6px 12px", cursor: "pointer",
                    fontSize: 13, color: "#eaf4ee", display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  {em.emoji} {em.key}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prayer times */}
        <div
          onClick={() => void navigate("/prayer-times")}
          style={{
            background: "#152019", border: "1px solid rgba(52,201,122,0.15)",
            borderRadius: 16, padding: "16px", marginBottom: 16, cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#6a9878", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                Next prayer
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#34c97a" }}>{nextPrayer.name}</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#b8946a", fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(52,201,122,0.08)" }}>
            {PRAYER_ORDER.map(name => {
              const p = prayerTimes.find(pt => pt.name === name);
              const isNext = name === nextPrayer.name;
              return (
                <div key={name} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: isNext ? "#34c97a" : "#6a9878", marginBottom: 3 }}>{name}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: isNext ? "#b8946a" : "#eaf4ee" }}>{p?.time ?? "--:--"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak — warm language */}
        <div style={{
          background: "#152019", border: "1px solid rgba(52,201,122,0.15)",
          borderRadius: 16, padding: "16px", marginBottom: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#b8946a", fontFamily: "DM Sans, sans-serif", lineHeight: 1 }}>
              {streak.currentStreak}
            </div>
            <div style={{ fontSize: 12, color: "#6a9878", marginTop: 4 }}>{streakLabel}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", gap: 5, justifyContent: "flex-end", marginBottom: 6 }}>
              {Array(7).fill(null).map((_, i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i < streak.weeklyCompleted ? "#34c97a" : "#2a3830",
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#6a9878" }}>{streak.weeklyCompleted} of {streak.weeklyGoal} this week</div>
          </div>
        </div>

        {/* Today's spiritual focus */}
        {featuredSession && (
          <>
            <div style={{ fontSize: 11, color: "#6a9878", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
              Today's focus
            </div>
            <div
              onClick={() => void navigate(`/player/${featuredSession.id}`)}
              style={{
                background: "#152019", border: "1px solid rgba(52,201,122,0.15)",
                borderRadius: 16, padding: 16, marginBottom: 16, cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{featuredSession.title}</div>
                <div style={{ fontSize: 12, color: "#6a9878" }}>
                  {Math.floor(featuredSession.durationSeconds / 60)} min · {featuredSession.category}
                </div>
              </div>
              <div style={{
                background: "#34c97a", color: "#0d1411", borderRadius: "50%",
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                ▶
              </div>
            </div>
          </>
        )}

        {/* Name of Allah */}
        {nameOfAllah && (
          <div style={{
            background: "#152019", border: "1px solid rgba(184,148,106,0.15)",
            borderRadius: 16, padding: 16, marginBottom: 16, textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "#6a9878", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
              Name of Allah today
            </div>
            <div style={{ fontFamily: "Amiri, serif", fontSize: 24, color: "#b8946a", direction: "rtl", marginBottom: 6 }}>
              {nameOfAllah.arabic}
            </div>
            <div style={{ fontSize: 13, color: "#eaf4ee" }}>{nameOfAllah.nameEnglish}</div>
            <div style={{ fontSize: 12, color: "#6a9878", marginTop: 2 }}>{nameOfAllah.meaningEnglish}</div>
          </div>
        )}

        {/* Quick dhikr row */}
        <div style={{ fontSize: 11, color: "#6a9878", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
          Quick dhikr
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { arabic: "سُبْحَانَ اللَّهِ", english: "SubhanAllah", dhikr: "subhanallah" },
            { arabic: "اَلْحَمْدُ لِلَّهِ", english: "Alhamdulillah", dhikr: "alhamdulillah" },
            { arabic: "اللَّهُ أَكْبَرُ", english: "Allahu Akbar", dhikr: "allahuakbar" },
          ].map(t => (
            <div
              key={t.dhikr}
              onClick={() => void navigate(`/tasbih?dhikr=${t.dhikr}`)}
              style={{
                flex: 1, background: "#152019", border: "1px solid rgba(52,201,122,0.15)",
                borderRadius: 12, padding: 10, textAlign: "center", cursor: "pointer",
              }}
            >
              <div style={{ fontFamily: "Amiri, serif", fontSize: 14, color: "#b8946a", direction: "rtl" }}>{t.arabic}</div>
              <div style={{ fontSize: 10, color: "#6a9878", marginTop: 4 }}>{t.english}</div>
            </div>
          ))}
        </div>

        {/* Explore more */}
        <div
          onClick={() => void navigate("/mood")}
          style={{
            background: "#152019", border: "1px solid rgba(184,148,106,0.15)",
            borderRadius: 16, padding: "14px 18px", marginBottom: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#b8946a" }}>What do you need today?</div>
            <div style={{ fontSize: 12, color: "#6a9878", marginTop: 2 }}>Find the right dua for this moment</div>
          </div>
          <ChevronRight size={16} color="#6a9878" />
        </div>

        {/* Islamic Tools */}
        <div style={{ fontSize: 11, color: "#6a9878", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
          Islamic tools
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
          {TOOLS.map(({ icon: Icon, label, path }) => (
            <div
              key={path}
              onClick={() => void navigate(path)}
              style={{
                background: "#152019", border: "1px solid rgba(52,201,122,0.1)",
                borderRadius: 14, padding: "12px 6px", textAlign: "center", cursor: "pointer",
              }}
            >
              <Icon size={18} color="#6a9878" style={{ margin: "0 auto 6px", display: "block" }} />
              <div style={{ fontSize: 10, color: "#6a9878" }}>{label}</div>
            </div>
          ))}
        </div>

      </div>

      <BottomNav />

      <style>{`
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
