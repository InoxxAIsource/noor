import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  useGetPrayerTimes, 
  useGetMyStreak, 
  useGetSessions,
  useGetDailyContent
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { PlayCircle, CheckCircle2, Compass, BookOpen, Calculator, Calendar, Star, Droplets, MapPin, Church, TrendingUp, Users, ChevronRight, X } from "lucide-react";

interface HadithData {
  id: number;
  textEnglish: string;
  textArabic?: string;
  narrator: string;
  source: string;
  book?: string;
  hadithNumber?: number;
  category?: string;
}

const RAMADAN_DUAS = [
  { day: 1, arabic: "اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ صِيَامَ الصَّائِمِينَ", transliteration: "Allahumma aj'al siyami fihi siyamas-sa'imeen", meaning: "O Allah, make my fast in it the fast of those who truly fast" },
  { day: 2, arabic: "اللَّهُمَّ قَرِّبْنِي فِيهِ إِلَى مَرْضَاتِكَ", transliteration: "Allahumma qaribni fihi ila mardhatik", meaning: "O Allah, bring me closer in it to Your pleasure" },
  { day: 3, arabic: "اللَّهُمَّ ارْزُقْنِي فِيهِ الذِّهْنَ وَالتَّنْبِيهَ", transliteration: "Allahumma urzuqni fihi az-zihna wa at-tanbih", meaning: "O Allah, grant me in it wisdom and awareness" },
  { day: 27, arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni", meaning: "O Allah, You are the Pardoner, You love to pardon, so pardon me" },
];

const QURAN_PORTION_SURAHS: Record<number, number> = {
  1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
  11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20,
  21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 114,
};

function parseTimeToDate(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number) as [number, number];
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatCountdown(secs: number): string {
  if (secs <= 0) return "It's Iftar time! 🌙";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hijriDate, setHijriDate] = useState("");
  const [hijriMonth, setHijriMonth] = useState("");
  const [hijriDay, setHijriDay] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [iftarCountdown, setIftarCountdown] = useState("");
  const [showIftarDua, setShowIftarDua] = useState(false);
  const [hadithModalOpen, setHadithModalOpen] = useState(false);
  const [hadithData, setHadithData] = useState<HadithData | null>(null);
  const [nextPrayerName, setNextPrayerName] = useState("");
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState("");

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayFormat = format(new Date(), "dd-MM-yyyy");

  const { data: prayerData } = useGetPrayerTimes({ city: user?.city || 'London', date: todayStr });
  const { data: streakData } = useGetMyStreak();
  const { data: dailyContent } = useGetDailyContent();
  const { data: sessions } = useGetSessions();

  const maghribTimeRef = useRef<string>("");
  const fajrTimeRef = useRef<string>("");
  const allPrayerTimesRef = useRef<Array<{ name: string; time: string }>>([]);

  useEffect(() => {
    if (prayerData?.times) {
      const maghrib = prayerData.times.find(t => t.name === "Maghrib");
      const fajr = prayerData.times.find(t => t.name === "Fajr");
      if (maghrib) maghribTimeRef.current = maghrib.time;
      if (fajr) fajrTimeRef.current = fajr.time;
      allPrayerTimesRef.current = prayerData.times.map(t => ({ name: t.name, time: t.time }));
    }
  }, [prayerData]);

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${todayFormat}`);
        const data = await res.json();
        if (data?.data?.hijri) {
          const h = data.data.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year}`);
          setHijriMonth(h.month.en);
          setHijriDay(parseInt(h.day, 10));
        }
      } catch { /* ignore */ }
    };
    fetchHijri();
  }, [todayFormat]);

  // Fetch hadith from daily content
  useEffect(() => {
    if (dailyContent?.hadith) {
      setHadithData({
        id: 1,
        textEnglish: dailyContent.hadith.text,
        narrator: "",
        source: dailyContent.hadith.source,
      });
    }
  }, [dailyContent]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (hijriMonth === "Ramadan" && maghribTimeRef.current) {
        const maghribDate = parseTimeToDate(maghribTimeRef.current);
        const secsLeft = Math.floor((maghribDate.getTime() - now.getTime()) / 1000);
        setIftarCountdown(formatCountdown(Math.max(0, secsLeft)));
        setShowIftarDua(secsLeft > 0 && secsLeft <= 600);
      }

      // Next prayer countdown (always on)
      if (allPrayerTimesRef.current.length > 0) {
        const upcoming = allPrayerTimesRef.current
          .map(pt => ({ name: pt.name, date: parseTimeToDate(pt.time) }))
          .filter(pt => pt.date.getTime() > now.getTime())
          .sort((a, b) => a.date.getTime() - b.date.getTime());
        const next = upcoming[0];
        if (next) {
          const secs = Math.floor((next.date.getTime() - now.getTime()) / 1000);
          const h = Math.floor(secs / 3600);
          const m = Math.floor((secs % 3600) / 60);
          const s = secs % 60;
          setNextPrayerName(next.name);
          setNextPrayerCountdown(h > 0 ? `${h}h ${m.toString().padStart(2,"0")}m` : `${m}m ${s.toString().padStart(2,"0")}s`);
        } else {
          setNextPrayerName("Fajr");
          setNextPrayerCountdown("Tomorrow");
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [hijriMonth]);

  const isRamadan = hijriMonth === "Ramadan";
  const isEid = hijriMonth === "Shawwal" && hijriDay === 1;
  const isLast10 = isRamadan && hijriDay >= 21;
  const isNight27 = isRamadan && hijriDay === 27;
  const u = user as Record<string, unknown> | null;
  const isShia = u?.["madhab"] === "shia";

  const ramadanDua = RAMADAN_DUAS.find(d => d.day === hijriDay) || RAMADAN_DUAS[0]!;
  const ramadanPortionSurah = QURAN_PORTION_SURAHS[hijriDay] || 1;

  const getBannerGradient = () => {
    if (isEid) return "linear-gradient(135deg, #ffd700, #ff6b00)";
    if (isNight27) return "linear-gradient(135deg, #ffd700, #ff9900)";
    if (isLast10) return "linear-gradient(135deg, #8b6914, #ffd700)";
    if (isRamadan) return "linear-gradient(135deg, #8b6914, #ffd700)";
    if (hijriMonth === "Muharram") return "linear-gradient(135deg, #006666, #004444)";
    if (hijriMonth === "Dhul Hijjah") return "linear-gradient(135deg, #00a550, #004400)";
    return "linear-gradient(135deg, var(--surface), var(--card))";
  };

  const sessionList = sessions as Array<Record<string, unknown>> | undefined;
  const quickSessions = sessionList?.filter(s => 
    ["Morning Azkar", "Evening Azkar", "Dua", "Quran"].includes(s["category"] as string)
  ).slice(0, 4) || [];

  return (
    <div className={`min-h-screen ${isRamadan ? "bg-[#030a00]" : "bg-[var(--bg)]"} text-[var(--text)] pb-24 animate-fade-in transition-colors duration-1000`}>
      
      {/* Ramadan gold particle overlay */}
      {isRamadan && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-[var(--gold)] rounded-full opacity-40 animate-bounce"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.4}s`, animationDuration: `${2 + i * 0.3}s` }}
            />
          ))}
        </div>
      )}

      {/* Eid banner */}
      {isEid && (
        <div className="relative z-10 py-4 px-6 text-center animate-fade-in" style={{ background: "linear-gradient(135deg, #ffd700, #ff6b00)" }}>
          <p className="font-amiri text-2xl text-white mb-1">عيد مبارك</p>
          <p className="font-cinzel text-white font-bold">🌙 Eid Mubarak!</p>
          <button
            onClick={() => {
              const canvas = document.createElement("canvas");
              canvas.width = 640; canvas.height = 400;
              const ctx = canvas.getContext("2d")!;
              const grd = ctx.createLinearGradient(0, 0, 640, 400);
              grd.addColorStop(0, "#2a1800"); grd.addColorStop(1, "#001a00");
              ctx.fillStyle = grd; ctx.fillRect(0, 0, 640, 400);
              ctx.strokeStyle = "rgba(255,215,0,0.4)"; ctx.lineWidth = 4;
              ctx.strokeRect(16, 16, 608, 368);
              ctx.fillStyle = "#ffd700"; ctx.font = "bold 52px serif"; ctx.textAlign = "center";
              ctx.fillText("عيد مبارك", 320, 120);
              ctx.fillStyle = "#e8f5e8"; ctx.font = "bold 30px system-ui";
              ctx.fillText("Eid Mubarak!", 320, 178);
              ctx.fillStyle = "#00a550"; ctx.font = "20px system-ui";
              ctx.fillText(`This Ramadan I prayed ${(streakData as unknown as Record<string,unknown>)?.["totalMinutes"] ?? 0} minutes`, 320, 240);
              ctx.fillStyle = "#ffd700"; ctx.font = "18px system-ui";
              ctx.fillText(`🔥 Streak: ${streakData?.currentStreak ?? 0} days`, 320, 282);
              ctx.fillStyle = "#4a7a4a"; ctx.font = "13px system-ui";
              ctx.fillText("Noor app — noorapp.com", 320, 370);
              const link = document.createElement("a");
              link.download = "my-ramadan-journey.png";
              link.href = canvas.toDataURL("image/png");
              link.click();
            }}
            className="mt-3 inline-block bg-white/20 border border-white/40 text-white text-xs font-semibold px-4 py-1.5 rounded-full"
          >
            📊 Share my Ramadan Journey
          </button>
        </div>
      )}

      {/* Ramadan night 27 pulse banner */}
      {isNight27 && !isEid && (
        <div className="relative z-10 py-3 px-6 text-center font-cinzel font-bold text-[#001a00] animate-pulse" style={{ background: "linear-gradient(135deg, #ffd700, #ffaa00)" }}>
          ✨ Night 27 — Seek Laylatul Qadr ✨
        </div>
      )}

      {/* Last 10 nights banner */}
      {isLast10 && !isNight27 && !isEid && (
        <div className="relative z-10 py-2.5 px-6 text-center" style={{ background: "linear-gradient(135deg, #8b6914, #ffd700)" }}>
          <p className="font-cinzel text-sm text-[#001a00] font-semibold">✨ Last 10 Nights — Seek Laylatul Qadr</p>
        </div>
      )}

      {/* Ramadan mubarak banner */}
      {isRamadan && !isLast10 && !isEid && (
        <div className="relative z-10 py-3 px-6 text-center" style={{ background: "linear-gradient(135deg, #6b4f00, #ffd700)" }}>
          <p className="font-amiri text-xl text-white">رمضان مبارك</p>
          <p className="font-cinzel text-[10px] text-white/80 tracking-widest mt-0.5">RAMADAN MUBARAK</p>
        </div>
      )}

      {/* Regular hijri banner */}
      {!isRamadan && !isEid && (
        <div className="relative z-10 w-full py-3 px-6 flex justify-center items-center shadow-lg" style={{ background: getBannerGradient() }}>
          <span className="font-cinzel text-sm text-white font-semibold">{hijriDate || "Loading..."}</span>
        </div>
      )}

      <div className="relative z-10 p-6 space-y-6">
        {/* Greeting + Crescent */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="font-cinzel text-3xl text-[var(--gold)]">
              As-salamu alaykum, {user?.name?.split(' ')[0] || 'Friend'}!
            </h1>
            <p className="text-[var(--muted)] text-sm">{format(new Date(), "EEEE, MMMM d")}{isRamadan ? ` · Day ${hijriDay} of Ramadan` : ""}</p>
          </div>

          {/* SVG crescent with floating gold particles */}
          <div className="relative w-14 h-14 flex-shrink-0" style={{ filter: "drop-shadow(0 0 10px rgba(0,165,80,0.5))" }}>
            <svg viewBox="0 0 60 60" width="56" height="56">
              <defs>
                <radialGradient id="crescentGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00a550" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="30" cy="30" r="28" fill="url(#crescentGlow)" />
              <path
                d="M30 6 A24 24 0 1 1 30 54 A16 16 0 1 0 30 6 Z"
                fill="#ffd700"
                opacity="0.9"
              />
            </svg>
            {[
              { x: 8, y: 4, d: "0s", dur: "2.2s" },
              { x: 42, y: 8, d: "0.4s", dur: "2.8s" },
              { x: 20, y: 2, d: "0.8s", dur: "2.4s" },
              { x: 50, y: 20, d: "1.2s", dur: "3s" },
              { x: 14, y: 18, d: "1.6s", dur: "2.6s" },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[var(--gold)] rounded-full opacity-70 noor-float-particle"
                style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: p.d, animationDuration: p.dur }}
              />
            ))}
          </div>
        </div>

        {/* Iftar countdown — Ramadan only */}
        {isRamadan && prayerData?.times && (
          <div className="bg-gradient-to-br from-[#2a1800] to-[#1a0d00] border border-[var(--gold)]/40 rounded-2xl p-5 text-center shadow-lg">
            <p className="text-xs text-[var(--gold)]/70 uppercase tracking-widest mb-2">Iftar Countdown</p>
            <p className="font-cinzel text-3xl text-[var(--gold)] mb-1">{iftarCountdown || "..."}</p>
            {fajrTimeRef.current && (
              <p className="text-xs text-[var(--muted)]">Suhoor ends at {fajrTimeRef.current} (Fajr)</p>
            )}
            {showIftarDua && (
              <div className="mt-4 pt-4 border-t border-[var(--gold)]/20">
                <p className="text-xs text-[var(--gold)] mb-2">Iftar Dua</p>
                <p className="font-amiri text-xl text-[var(--gold)] rtl mb-1">اللَّهُمَّ لَكَ صُمْتُ</p>
                <p className="text-xs text-[var(--muted)]">Allahumma laka sumtu — O Allah, for You I fasted</p>
              </div>
            )}
          </div>
        )}

        {/* Ramadan daily dua */}
        {isRamadan && (
          <div className="bg-[#1a0d00] border border-[var(--gold)]/30 rounded-2xl p-5">
            <p className="text-xs text-[var(--gold)]/70 uppercase tracking-wider mb-2">Dua for Day {hijriDay}</p>
            <p className="font-amiri text-xl text-[var(--gold)] rtl text-right mb-2 leading-relaxed">{ramadanDua.arabic}</p>
            <p className="text-xs text-[var(--muted)] italic mb-1">{ramadanDua.transliteration}</p>
            <p className="text-xs text-[var(--text)]/80">{ramadanDua.meaning}</p>
          </div>
        )}

        {/* Shia Ramadan extras */}
        {isRamadan && isShia && (
          <div className="bg-[#1a0d00] border border-[var(--gold)]/40 rounded-2xl p-5 space-y-3">
            <p className="font-cinzel text-[var(--gold)] text-sm">Shia Amaal for Night {hijriDay}</p>

            {/* Dua Iftitah reminder every night */}
            <div className="bg-[var(--card)]/60 rounded-xl p-3">
              <p className="text-xs text-[var(--green)] font-medium mb-1">Dua Iftitah — Tonight</p>
              <p className="font-amiri text-lg text-[var(--gold)] rtl text-right leading-relaxed">اللَّهُمَّ إِنِّي أَفْتَتِحُ الثَّنَاءَ بِحَمْدِكَ</p>
              <p className="text-[10px] text-[var(--muted)] mt-1">Recommended every night of Ramadan — recite after Isha</p>
            </div>

            {/* Special amaal for specific nights */}
            {[1, 19, 21, 23, 27].includes(hijriDay) && (
              <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl p-3">
                <p className="text-xs text-[var(--gold)] font-semibold mb-1">
                  Special Night {hijriDay} Amaal
                </p>
                <p className="text-xs text-[var(--text)]/80">
                  {hijriDay === 1 && "Recite Dua Iftitah, Dua Jawshan Kabeer and perform 2 rak'at nafilah"}
                  {hijriDay === 19 && "Night of Qadr possibility — perform ghusl, recite Ziyarat Imam Ali (AS), 100× Astaghfirullah"}
                  {hijriDay === 21 && "Probable Laylatul Qadr — recite Dua Jawshan Kabir and Surah Ankabut (29), Rum (30), Dukhan (44)"}
                  {hijriDay === 23 && "Another probable Laylatul Qadr — recite Dua Iftitah and 1000× Astaghfirullah after midnight"}
                  {hijriDay === 27 && "Laylatul Qadr — stay awake, perform ghusl, recite Surah Qadr 1000×, Dua Jawshan Sagheer"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Laylatul Qadr dua — Night 27 */}
        {isNight27 && (
          <div className="bg-gradient-to-br from-[#2a1800] to-[#001a00] border-2 border-[var(--gold)] rounded-2xl p-5 animate-pulse">
            <p className="font-cinzel text-[var(--gold)] text-center mb-3">Dua for Laylatul Qadr</p>
            <p className="font-amiri text-2xl text-[var(--gold)] rtl text-center mb-2 leading-relaxed">
              اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
            </p>
            <p className="text-xs text-[var(--muted)] text-center italic mb-1">Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni</p>
            <p className="text-xs text-center text-[var(--text)]/80">O Allah, You are the Pardoner, You love to pardon, so pardon me</p>
          </div>
        )}

        {/* Ramadan Quran portion */}
        {isRamadan && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Today's Quran Portion</p>
              <p className="font-cinzel text-[var(--gold)]">Day {hijriDay} of 30</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">Surah {ramadanPortionSurah}</p>
            </div>
            <Link
              to={`/quran/${ramadanPortionSurah}`}
              className="bg-[var(--gold)] text-[#001a00] px-4 py-2 rounded-xl text-sm font-bold"
            >
              Read →
            </Link>
          </div>
        )}

        {/* Prayer Times */}
        <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-20 pointer-events-none">
            <div className="w-40 h-40 rounded-full border-[10px] border-[var(--gold)]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-cinzel text-[var(--gold)] text-lg">Today's Salah</h3>
            <Link to="/prayer-times" className="text-xs text-[var(--green)] flex items-center gap-1">
              Full view <ChevronRight size={12} />
            </Link>
          </div>
          {nextPrayerName && (
            <div className="flex items-center justify-between bg-[var(--card)] rounded-xl px-4 py-2.5 mb-3 border border-[var(--green)]/20">
              <div>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Next Prayer</p>
                <p className="font-cinzel text-[var(--green)] text-sm font-bold">{nextPrayerName}</p>
              </div>
              <p className="font-mono text-[var(--gold)] text-base font-bold">{nextPrayerCountdown}</p>
            </div>
          )}
          <div className="space-y-3 relative z-10">
            {prayerData?.times?.map((pt) => (
              <div key={pt.name} className="flex items-center justify-between p-2 rounded-lg">
                <div className="flex flex-col w-1/3">
                  <span className="font-amiri text-lg rtl">{pt.arabicName}</span>
                  <span className="text-xs text-[var(--muted)]">{pt.name}</span>
                </div>
                <span className="font-mono text-sm">{pt.time}</span>
                <Link to="/prayer-times" className="p-2 text-[var(--muted)] hover:text-[var(--green)] transition-colors">
                  <CheckCircle2 size={22} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Tracker */}
        {streakData && (
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] flex items-center justify-between">
            <div>
              <div className="flex items-end gap-2">
                <span className="font-cinzel text-4xl text-[var(--gold)]">{streakData.currentStreak}</span>
                <span className="text-sm text-[var(--muted)] mb-1">day streak 🔥</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i < streakData.weeklyCompleted ? 'bg-[var(--green)]' : 'border border-[var(--muted)]'}`} />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="var(--card)" strokeWidth="4" />
                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="var(--green)" strokeWidth="4" 
                    strokeDasharray={`${2 * Math.PI * 28}`} 
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - (streakData.weeklyCompleted / Math.max(1, streakData.weeklyGoal)))}`} 
                  />
                </svg>
                <span className="absolute text-xs font-bold text-[var(--green)]">{streakData.weeklyCompleted}/{streakData.weeklyGoal}</span>
              </div>
              <Link to="/growth" className="text-xs text-[var(--green)] flex items-center gap-1 hover:underline">
                <TrendingUp size={11} /> View growth
              </Link>
            </div>
          </div>
        )}

        {/* Hadith of the Day */}
        {hadithData && (
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] cursor-pointer hover:border-[var(--gold)]/40 transition-colors" onClick={() => setHadithModalOpen(true)}>
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Hadith of the Day</p>
            <p className="text-sm italic text-[var(--text)] leading-relaxed mb-3 line-clamp-2">
              "{hadithData.textEnglish.substring(0, 120)}..."
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--green)]">{hadithData.source}</p>
              <span className="text-xs text-[var(--muted)]">Tap to read →</span>
            </div>
          </div>
        )}

        {/* Daily Dua Card */}
        {dailyContent?.dua && (
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">Dua of the Day</p>
            <p className="font-amiri text-xl text-[var(--gold)] rtl text-right mb-2 line-clamp-1">{dailyContent.dua.arabic.substring(0, 50)}</p>
            <p className="text-sm font-semibold mb-3">{dailyContent.dua.title}</p>
            <Link to="/duas" className="text-xs text-[var(--green)] hover:underline">Read full dua →</Link>
          </div>
        )}

        {/* Mood Check */}
        <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--green)] text-center shadow-lg">
          <h3 className="text-xl font-cinzel text-[var(--gold)] mb-3">What do you need today?</h3>
          <Link to="/mood" className="inline-block bg-[var(--green)] text-white px-6 py-2 rounded-full font-semibold hover:bg-[var(--green)]/90 transition-colors">
            Find Guidance
          </Link>
        </div>

        {/* Quick Sessions */}
        {quickSessions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-cinzel text-lg text-[var(--gold)]">Quick Sessions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickSessions.map(session => (
                <Link key={session["id"] as string} to={`/player/${session["id"] as string}`} className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] hover:border-[var(--green)] transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--green)] bg-[var(--green)]/10 px-2 py-1 rounded">{session["category"] as string}</span>
                    <PlayCircle size={16} className="text-[var(--muted)] group-hover:text-[var(--gold)]" />
                  </div>
                  <p className="font-semibold text-sm mb-1 line-clamp-1">{session["title"] as string}</p>
                  <p className="text-xs text-[var(--muted)]">{Math.ceil((session["durationSeconds"] as number) / 60)} min</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Dhikr */}
        <div className="space-y-3">
          <h3 className="font-cinzel text-lg text-[var(--gold)]">Quick Dhikr</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar'].map(dhikr => (
              <Link key={dhikr} to={`/tasbih?dhikr=${dhikr}`}
                className="bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-full whitespace-nowrap text-sm font-semibold hover:bg-[var(--card)] hover:border-[var(--gold)] transition-colors">
                {dhikr}
              </Link>
            ))}
          </div>
        </div>

        {/* Islamic Tools grid */}
        <div className="space-y-3">
          <h3 className="font-cinzel text-lg text-[var(--gold)]">Islamic Tools</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { to: "/quran", icon: <BookOpen size={22} />, label: "Quran" },
              { to: "/99-names", icon: <Star size={22} />, label: "99 Names" },
              { to: "/qibla", icon: <Compass size={22} />, label: "Qibla" },
              { to: "/tasbih", icon: <span className="text-xl">📿</span>, label: "Tasbih" },
              { to: "/masjid-finder", icon: <MapPin size={22} />, label: "Masjid" },
              { to: "/zakat-calculator", icon: <Calculator size={22} />, label: "Zakat" },
              { to: "/islamic-calendar", icon: <Calendar size={22} />, label: "Calendar" },
              { to: "/wudu-guide", icon: <Droplets size={22} />, label: "Wudu" },
              { to: "/salah-guide", icon: <Church size={22} />, label: "Salah" },
              { to: "/growth", icon: <TrendingUp size={22} />, label: "Growth" },
              { to: "/halaqah", icon: <Users size={22} />, label: "Halaqah" },
              { to: "/farz-guide", icon: <span className="text-xl">📖</span>, label: "Farz" },
            ].map(({ to, icon, label }) => (
              <Link key={to} to={to}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-[var(--green)]/60 hover:bg-[var(--card)] transition-colors text-center">
                <span className="text-[var(--green)]">{icon}</span>
                <span className="text-[10px] text-[var(--muted)] font-medium leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Halaqah promo card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-cinzel text-[var(--gold)] mb-1">Pray Together</p>
            <p className="text-xs text-[var(--muted)]">Join or create a Halaqah group</p>
          </div>
          <Link to="/halaqah" className="bg-[var(--green)] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
            <Users size={13} /> Join
          </Link>
        </div>

      </div>

      {/* Hadith modal */}
      {hadithModalOpen && hadithData && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-0 animate-fade-in" onClick={() => setHadithModalOpen(false)}>
          <div className="bg-[var(--surface)] border-t border-[var(--border)] rounded-t-3xl w-full max-w-lg p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Hadith of the Day</p>
              <button onClick={() => setHadithModalOpen(false)} className="text-[var(--muted)]"><X size={20} /></button>
            </div>
            <p className="text-base italic text-[var(--text)] leading-relaxed mb-4">
              "{hadithData.textEnglish}"
            </p>
            <p className="text-sm text-[var(--green)] font-semibold">{hadithData.source}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
