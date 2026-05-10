import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  useGetPrayerTimes, 
  useLogSalah, 
  useGetMyStreak, 
  useGetSessions,
  useGetDailyContent
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { PlayCircle, CheckCircle2, Compass, BookOpen, Calculator, Calendar, Star, Droplets, MapPin, Church } from "lucide-react";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hijriDate, setHijriDate] = useState("");
  const [hijriMonth, setHijriMonth] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayFormat = format(new Date(), "dd-MM-yyyy");

  const { data: prayerData } = useGetPrayerTimes({ city: user?.city || 'London', date: todayStr });
  const { data: streakData } = useGetMyStreak();
  const { data: dailyContent } = useGetDailyContent();
  const { data: sessions } = useGetSessions();
  const logSalahMutation = useLogSalah();

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/gToH?date=${todayFormat}`);
        const data = await res.json();
        if (data && data.data && data.data.hijri) {
          setHijriDate(`${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year}`);
          setHijriMonth(data.data.hijri.month.en);
        }
      } catch (e) {
        console.error("Failed to fetch Hijri date", e);
      }
    };
    fetchHijri();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [todayFormat]);

  const handleLogSalah = (prayerName: string) => {
    logSalahMutation.mutate({ data: { prayer: prayerName, date: todayStr } });
    // In a real app we'd open the khushoo rating modal here
  };

  const getBannerGradient = () => {
    if (hijriMonth === "Ramadan") return "linear-gradient(135deg, #ffd700, #ff8c00)";
    if (hijriMonth === "Muharram") return "linear-gradient(135deg, #006666, #004444)";
    if (hijriMonth === "Dhul Hijjah") return "linear-gradient(135deg, #00a550, #004400)";
    return "linear-gradient(135deg, var(--surface), var(--card))";
  };

  const quickSessions = sessions?.filter(s => 
    s.category === "Morning Azkar" || 
    s.category === "Evening Azkar" ||
    s.category === "Dua" ||
    s.category === "Quran"
  ).slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 animate-fade-in">
      {/* Section 1: Islamic Banner */}
      <div 
        className="w-full py-3 px-6 flex justify-center items-center shadow-lg"
        style={{ background: getBannerGradient() }}
      >
        <span className="font-cinzel text-sm text-white font-semibold">{hijriDate || "Loading Hijri Date..."}</span>
      </div>

      <div className="p-6 space-y-8">
        {/* Section 2: Greeting */}
        <div className="space-y-1">
          <h1 className="font-cinzel text-3xl text-[var(--gold)]">
            As-salamu alaykum, {user?.name?.split(' ')[0] || 'Friend'}!
          </h1>
          <p className="text-[var(--muted)] text-sm">{format(new Date(), "EEEE, MMMM d")}</p>
        </div>

        {/* Section 3: Prayer Times */}
        <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] shadow-md relative overflow-hidden">
          {/* Crescent Decoration (Section 4) */}
          <div className="absolute -right-10 -top-10 opacity-20 pointer-events-none">
            <div className="w-40 h-40 rounded-full border-[10px] border-[var(--gold)]" style={{ animation: 'crescent-glow 4s infinite alternate', clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
          </div>
          
          <h3 className="font-cinzel text-[var(--gold)] mb-4 text-lg">Today's Salah</h3>
          <div className="space-y-3 relative z-10">
            {prayerData?.times?.map((pt) => {
              // Simplified active check
              const isActive = false; 
              return (
                <div key={pt.name} className={`flex items-center justify-between p-2 rounded-lg ${isActive ? 'bg-[var(--card)] border border-[var(--green)]/30' : ''}`}>
                  <div className="flex flex-col w-1/3">
                    <span className="font-amiri text-lg rtl">{pt.arabicName}</span>
                    <span className={`text-xs ${isActive ? 'text-[var(--gold)]' : 'text-[var(--muted)]'}`}>{pt.name}</span>
                  </div>
                  <span className={`font-mono text-sm ${isActive ? 'text-[var(--gold)]' : ''}`}>{pt.time}</span>
                  <button 
                    onClick={() => handleLogSalah(pt.name)}
                    className="p-2 text-[var(--muted)] hover:text-[var(--green)] transition-colors"
                  >
                    <CheckCircle2 size={24} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: Streak Tracker */}
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
          </div>
        )}

        {/* Section 6: Daily Content */}
        {dailyContent && (
          <div className="space-y-3">
            <h3 className="font-cinzel text-lg text-[var(--gold)]">Daily Inspiration</h3>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
              <div className="min-w-[280px] bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] snap-center shrink-0">
                <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wider">Name of Allah</p>
                <p className="font-amiri text-3xl text-[var(--gold)] text-right mb-2">{dailyContent.nameOfAllah.arabic}</p>
                <p className="text-sm font-semibold">{dailyContent.nameOfAllah.transliteration}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{dailyContent.nameOfAllah.meaningEnglish}</p>
              </div>
              
              <div className="min-w-[280px] bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] snap-center shrink-0">
                <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wider">Hadith</p>
                <p className="text-sm italic mb-3">"{dailyContent.hadith.text.substring(0, 100)}..."</p>
                <p className="text-xs text-[var(--green)]">{dailyContent.hadith.source}</p>
              </div>

              <div className="min-w-[280px] bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] snap-center shrink-0">
                <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wider">Daily Dua</p>
                <p className="font-amiri text-2xl text-[var(--gold)] text-right mb-2">{dailyContent.dua.arabic.substring(0, 50)}...</p>
                <p className="text-sm font-semibold">{dailyContent.dua.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Section 7: Quick Sessions */}
        {quickSessions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-cinzel text-lg text-[var(--gold)]">Quick Sessions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickSessions.map(session => (
                <Link key={session.id} to={`/player/${session.id}`} className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] hover:border-[var(--green)] transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--green)] bg-[var(--green)]/10 px-2 py-1 rounded">{session.category}</span>
                    <PlayCircle size={16} className="text-[var(--muted)] group-hover:text-[var(--gold)]" />
                  </div>
                  <p className="font-semibold text-sm mb-1 line-clamp-1">{session.title}</p>
                  <p className="text-xs text-[var(--muted)]">{Math.ceil(session.durationSeconds / 60)} min</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section 8: Mood Check */}
        <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--green)] text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
          <h3 className="relative z-10 text-xl font-cinzel text-[var(--gold)] mb-3">What do you need today?</h3>
          <Link to="/mood" className="relative z-10 inline-block bg-[var(--green)] text-white px-6 py-2 rounded-full font-semibold hover:bg-[var(--green)]/90 transition-colors">
            Find Guidance
          </Link>
        </div>

        {/* Section 9: Tasbih */}
        <div className="space-y-3">
          <h3 className="font-cinzel text-lg text-[var(--gold)]">Quick Dhikr</h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar'].map(dhikr => (
              <Link 
                key={dhikr} 
                to={`/tasbih?dhikr=${dhikr}`}
                className="bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-full whitespace-nowrap text-sm font-semibold hover:bg-[var(--card)] hover:border-[var(--gold)] transition-colors"
              >
                {dhikr}
              </Link>
            ))}
          </div>
        </div>

        {/* Section 10: Islamic Tools */}
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
              { to: "/qurbani-guide", icon: <span className="text-xl">🐑</span>, label: "Qurbani" },
              { to: "/farz-guide", icon: <span className="text-xl">📖</span>, label: "Farz" },
              { to: "/sadqa-guide", icon: <span className="text-xl">💚</span>, label: "Sadqa" },
            ].map(({ to, icon, label }) => (
              <Link key={to} to={to}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-[var(--green)]/60 hover:bg-[var(--card)] transition-colors text-center">
                <span className="text-[var(--green)]">{icon}</span>
                <span className="text-[10px] text-[var(--muted)] font-medium leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;