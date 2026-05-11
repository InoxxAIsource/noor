import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGetMyStreak, useGetDailyContent } from "@workspace/api-client-react";
import {
  Bell, Search, Menu, ChevronRight, Sun, Moon, Heart, BookOpen,
  Compass, Calculator, CalendarDays, Droplets, MapPin, Star
} from "lucide-react";

interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

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

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string }>({ name: "Asr", time: "15:58" });
  const [countdown, setCountdown] = useState("--:--:--");
  const [iftarCountdown, setIftarCountdown] = useState("--:--:--");
  const [hijriDate, setHijriDate] = useState("");
  const [isRamadan, setIsRamadan] = useState(false);
  const particleKeys = useRef(Array.from({ length: 10 }, () => Math.random()));

  const { data: streakData } = useGetMyStreak();
  const { data: dailyContent } = useGetDailyContent();

  const streak = {
    current: streakData?.currentStreak ?? 0,
    weekly: streakData?.weeklyCompleted ?? 0,
    weeklyGoal: streakData?.weeklyGoal ?? 5,
  };

  const dailyName = dailyContent?.nameOfAllah
    ? { arabic: dailyContent.nameOfAllah.arabic, english: `${dailyContent.nameOfAllah.transliteration} — ${dailyContent.nameOfAllah.meaningEnglish}` }
    : { arabic: "الرَّحْمَن", english: "Ar-Rahman — The Most Merciful" };

  const dailyHadith = dailyContent?.hadith
    ? { text: dailyContent.hadith.text, source: dailyContent.hadith.source }
    : { text: "The best of you are those who learn the Quran and teach it.", source: "Sahih Bukhari" };

  // Fetch prayer times from aladhan.com
  useEffect(() => {
    const city = (user as Record<string, unknown> | null)?.["city"] as string || "London";
    const method = (user as Record<string, unknown> | null)?.["madhab"] === "shia" ? 0 : 3;
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=IN&method=${method}`)
      .then(r => r.json())
      .then((d: { data?: { timings?: PrayerTimings } }) => {
        if (d.data?.timings) {
          const t = d.data.timings;
          const clean: PrayerTimings = {
            Fajr: t.Fajr?.split(" ")[0] ?? "04:43",
            Dhuhr: t.Dhuhr?.split(" ")[0] ?? "12:11",
            Asr: t.Asr?.split(" ")[0] ?? "15:58",
            Maghrib: t.Maghrib?.split(" ")[0] ?? "18:54",
            Isha: t.Isha?.split(" ")[0] ?? "20:23",
          };
          setPrayerTimes(clean);
          calculateNextPrayer(clean);
        }
      })
      .catch(() => {});
  }, [user]);

  // Fetch Hijri date
  useEffect(() => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`)
      .then(r => r.json())
      .then((d: { data?: { hijri?: { day: string; month: { en: string; number: number }; year: string } } }) => {
        const h = d.data?.hijri;
        if (h) {
          setHijriDate(`${days[now.getDay()]} · ${h.day} ${h.month.en} ${h.year} AH`);
          if (h.month.number === 9) setIsRamadan(true);
        }
      })
      .catch(() => {
        const days2 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        setHijriDate(days2[new Date().getDay()] ?? "");
      });
  }, []);

  function calculateNextPrayer(times: PrayerTimings) {
    const now = new Date();
    for (const name of PRAYER_KEYS) {
      const pt = parseTimeToDate(times[name] ?? "");
      if (pt > now) {
        setNextPrayer({ name, time: times[name] ?? "" });
        return;
      }
    }
    setNextPrayer({ name: "Fajr", time: times.Fajr ?? "04:43" });
  }

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!nextPrayer.time) return;
      const target = parseTimeToDate(nextPrayer.time);
      const now = new Date();
      if (target <= now) target.setDate(target.getDate() + 1);
      setCountdown(formatCountdown(target.getTime() - now.getTime()));

      if (prayerTimes?.Maghrib) {
        const iftar = parseTimeToDate(prayerTimes.Maghrib);
        if (iftar <= now) iftar.setDate(iftar.getDate() + 1);
        setIftarCountdown(formatCountdown(iftar.getTime() - now.getTime()));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer, prayerTimes]);

  const prayers = PRAYER_KEYS.map(key => ({
    key,
    time: prayerTimes?.[key] ?? "--:--",
  }));

  const weekDots = Array(7).fill(null).map((_, i) => {
    if (i < streak.weekly - 1) return "filled";
    if (i === streak.weekly - 1) return "today";
    return "empty";
  });

  const quickSessions = [
    { id: "morning-azkar", Icon: Sun, title: "Morning Azkar", meta: "10 min · Arabic + English" },
    { id: "evening-azkar", Icon: Moon, title: "Evening Azkar", meta: "10 min · Guided" },
    { id: "dua-anxiety-60", Icon: Heart, title: "60s Dua", meta: "1 min · For right now" },
    { id: "quran-al-kahf", Icon: BookOpen, title: "Surah Al-Kahf", meta: "14 min · Friday" },
  ];

  const tools = [
    { path: "/qibla", Icon: Compass, label: "Qibla" },
    { path: "/zakat-calculator", Icon: Calculator, label: "Zakat" },
    { path: "/islamic-calendar", Icon: CalendarDays, label: "Calendar" },
    { path: "/wudu-guide", Icon: Droplets, label: "Wudu" },
    { path: "/masjid-finder", Icon: MapPin, label: "Masjid" },
    { path: "/99-names", Icon: Star, label: "99 Names" },
  ];

  return (
    <div style={{
      background: "#001a00", minHeight: "100vh", color: "#e8f5e8",
      position: "relative", overflow: "hidden", paddingBottom: 20,
    }}>

      {/* Floating gold particles */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        {particleKeys.current.map((k, i) => (
          <div key={k} style={{
            position: "absolute",
            left: `${20 + (i * 7.3) % 60}%`,
            bottom: `${5 + (i * 11.7) % 40}%`,
            width: `${1 + (i % 2)}px`,
            height: `${1 + (i % 2)}px`,
            background: "#ffd700",
            borderRadius: "50%",
            animation: `noor-float-up ${3 + (i % 4)}s ${(i * 0.7) % 5}s linear infinite`,
            opacity: 0,
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Ramadan banner */}
        {isRamadan && (
          <div style={{
            background: "rgba(255,215,0,0.1)", borderBottom: "0.5px solid rgba(255,215,0,0.2)",
            padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "#ffd700" }}>Ramadan Mubarak</span>
            <span style={{ fontFamily: "Amiri, serif", fontSize: 14, color: "#ffd700", direction: "rtl" }}>رمضان مبارك</span>
          </div>
        )}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#00a550", letterSpacing: 4, fontFamily: "Cinzel, serif" }}>
            NOOR
          </div>
          <div style={{ display: "flex", gap: 16, color: "#4a7a4a" }}>
            <Bell size={20} />
            <Search size={20} />
            <Menu size={20} />
          </div>
        </div>

        {/* Greeting */}
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ fontSize: 17, fontWeight: 500 }}>
            As-salamu alaykum, {(user as Record<string, unknown> | null)?.["name"] as string || "friend"}
          </div>
          <div style={{ fontSize: 12, color: "#4a7a4a", marginTop: 3 }}>
            {hijriDate || "Loading..."}
          </div>
        </div>

        {/* Prayer Times Card */}
        <div style={{
          margin: "0 16px 14px", background: "rgba(0,165,80,0.08)",
          border: "0.5px solid rgba(0,165,80,0.25)", borderRadius: 12, padding: 14,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                Next prayer
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, color: "#00a550" }}>
                {nextPrayer.name}
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 500, color: "#ffd700", fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "0.5px solid rgba(0,165,80,0.15)" }}>
            {prayers.map(p => (
              <div key={p.key} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: p.key === nextPrayer.name ? "#00a550" : "#4a7a4a", marginBottom: 2 }}>
                  {p.key}{p.key === nextPrayer.name ? " ▸" : ""}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: p.key === nextPrayer.name ? "#ffd700" : "#e8f5e8" }}>
                  {p.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crescent SVG */}
        <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 10px" }}>
          <svg style={{ animation: "noor-crescent-glow 3s ease-in-out infinite" }} width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" fill="rgba(0,165,80,0.08)" />
            <path d="M38 10 A20 20 0 1 1 38 50 A14 14 0 1 0 38 10Z" fill="#00a550" opacity="0.85" />
            <circle cx="42" cy="16" r="2" fill="#ffd700" opacity="0.8" />
            <circle cx="48" cy="22" r="1.2" fill="#ffd700" opacity="0.6" />
            <circle cx="46" cy="30" r="1.5" fill="#ffd700" opacity="0.5" />
          </svg>
        </div>

        {/* Streak */}
        <div style={{
          margin: "0 16px 14px", background: "rgba(0,165,80,0.06)",
          border: "0.5px solid rgba(0,165,80,0.2)", borderRadius: 12,
          padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 36, fontWeight: 500, color: "#ffd700", lineHeight: 1 }}>
              {streak.current}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#4a7a4a", marginBottom: 2 }}>Ibadah streak</div>
              <div style={{ fontSize: 12, color: "#00a550" }}>
                {streak.weekly} / {streak.weeklyGoal} this week
              </div>
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

        {/* Daily cards horizontal scroll */}
        <div style={{ display: "flex", gap: 10, padding: "0 16px 14px", overflowX: "auto", scrollbarWidth: "none" }}>
          {/* Name of Allah */}
          <div style={{
            flexShrink: 0, width: 148, background: "rgba(0,165,80,0.06)",
            border: "0.5px solid rgba(0,165,80,0.2)", borderRadius: 10, padding: 11,
          }}>
            <div style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
              Name of Allah
            </div>
            <div style={{ fontFamily: "Amiri, serif", fontSize: 18, color: "#ffd700", direction: "rtl", textAlign: "right", marginBottom: 3 }}>
              {dailyName.arabic}
            </div>
            <div style={{ fontSize: 11, color: "#c8e8c8", lineHeight: 1.4 }}>
              {dailyName.english}
            </div>
          </div>

          {/* Hadith */}
          <div style={{
            flexShrink: 0, width: 168, background: "rgba(0,165,80,0.06)",
            border: "0.5px solid rgba(0,165,80,0.2)", borderRadius: 10, padding: 11,
          }}>
            <div style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
              Hadith today
            </div>
            <div style={{ fontSize: 11, color: "#c8e8c8", lineHeight: 1.5 }}>
              "{dailyHadith.text.slice(0, 100)}{dailyHadith.text.length > 100 ? "…" : ""}"
            </div>
            <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 4 }}>
              — {dailyHadith.source}
            </div>
          </div>

          {/* Iftar countdown (Ramadan only) */}
          {isRamadan && (
            <div style={{
              flexShrink: 0, width: 130, background: "rgba(255,215,0,0.06)",
              border: "0.5px solid rgba(255,215,0,0.2)", borderRadius: 10, padding: 11, textAlign: "center",
            }}>
              <div style={{ fontSize: 10, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
                Iftar in
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#ffd700", fontVariantNumeric: "tabular-nums" }}>
                {iftarCountdown}
              </div>
              <div style={{ fontSize: 10, color: "#4a7a4a", marginTop: 3 }}>
                Maghrib {prayerTimes?.Maghrib ?? "18:54"}
              </div>
            </div>
          )}
        </div>

        {/* Quick start sessions */}
        <div style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, padding: "0 16px", marginBottom: 8 }}>
          Start your ibadah
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 16px", marginBottom: 14 }}>
          {quickSessions.map(s => (
            <div
              key={s.id}
              onClick={() => void navigate(`/player/${s.id}`)}
              style={{
                background: "rgba(0,165,80,0.07)", border: "0.5px solid rgba(0,165,80,0.2)",
                borderRadius: 10, padding: 12, cursor: "pointer", transition: "background .2s",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.15)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.07)"; }}
            >
              <s.Icon size={20} color="#00a550" style={{ display: "block", marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: "#4a7a4a" }}>{s.meta}</div>
            </div>
          ))}
        </div>

        {/* Mood button */}
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
          <ChevronRight size={20} color="#ffd700" />
        </div>

        {/* Quick tasbih row */}
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

        {/* Islamic Tools grid */}
        <div style={{ fontSize: 11, color: "#4a7a4a", textTransform: "uppercase", letterSpacing: 1, padding: "0 16px", marginBottom: 8 }}>
          Islamic Tools
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "0 16px", marginBottom: 8 }}>
          {tools.map(t => (
            <div
              key={t.path}
              onClick={() => void navigate(t.path)}
              style={{
                background: "rgba(0,165,80,0.06)", border: "0.5px solid rgba(0,165,80,0.18)",
                borderRadius: 10, padding: "12px 8px", textAlign: "center", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}
              onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.13)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,165,80,0.06)"; }}
            >
              <t.Icon size={22} color="#00a550" />
              <span style={{ fontSize: 11, color: "#c8e8c8" }}>{t.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
