import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

interface ProgressEntry {
  sessionId: string;
  durationListened: number;
  moodBefore: number | null;
  moodAfter: number | null;
  category: string;
  timestamp: number;
}

interface SalahLogEntry {
  prayer: string;
  date: string;
  khushooRating: number | null;
}

interface GrowthData {
  progress: ProgressEntry[];
  streak: {
    currentStreak: number;
    longestStreak: number;
    totalPrayers: number;
    totalMinutes: number;
    weeklyCompleted: number;
    weeklyGoal: number;
  };
  salahLast7: Array<{ date: string; entries: SalahLogEntry[] }>;
  weekReport: {
    sessions: number;
    minutes: number;
    topCategory: string;
    streakDays: number;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  azkar: "#00a550",
  quran: "#ffd700",
  dhikr: "#6495ed",
  sleep: "#9b59b6",
  dua60: "#ff9900",
  salah: "#c04848",
  other: "#4a7a4a",
};

function getCategoryColor(cat: string): string {
  const key = cat.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_COLORS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_COLORS["other"]!;
}

function getHeatColor(minutes: number): string {
  if (minutes === 0) return "#002800";
  if (minutes < 10) return "#004400";
  if (minutes < 30) return "#006600";
  if (minutes < 60) return "#00a550";
  return "#00ff66";
}

const BADGES = [
  { id: "first_dua", label: "First Dua", emoji: "🌱", desc: "Complete your first session", check: (d: GrowthData) => d.progress.length >= 1 },
  { id: "streak7", label: "7-Day Streak", emoji: "🔥", desc: "7 consecutive days", check: (d: GrowthData) => d.streak.longestStreak >= 7 },
  { id: "streak30", label: "30-Day Streak", emoji: "⭐", desc: "30 consecutive days", check: (d: GrowthData) => d.streak.longestStreak >= 30 },
  { id: "sessions100", label: "Century", emoji: "💯", desc: "100 sessions completed", check: (d: GrowthData) => d.progress.length >= 100 },
  { id: "minutes1000", label: "1000 Minutes", emoji: "⏱", desc: "1000 minutes of ibadah", check: (d: GrowthData) => d.streak.totalMinutes >= 1000 },
  { id: "quran", label: "Quran Explorer", emoji: "📖", desc: "Read 10+ Quran sessions", check: (d: GrowthData) => d.progress.filter(p => p.category?.toLowerCase().includes("quran")).length >= 10 },
  { id: "fajr", label: "Fajr Champion", emoji: "🌅", desc: "Log Fajr 7 days this week", check: (d: GrowthData) => d.salahLast7.filter(day => day.entries.some((e) => e.prayer === "Fajr")).length >= 7 },
  { id: "gifted", label: "Gifted", emoji: "🎁", desc: "Gift a dua to someone", check: (_d: GrowthData) => false },
  { id: "perfect", label: "Perfect Day", emoji: "🕌", desc: "All 5 prayers in one day", check: (d: GrowthData) => d.salahLast7.some(day => day.entries.length >= 5) },
  { id: "ramadan", label: "Ramadan Warrior", emoji: "🌙", desc: "Log all 5 prayers for 3+ days in a row", check: (d: GrowthData) => d.salahLast7.filter(day => day.entries.length >= 5).length >= 3 },
  { id: "quran_completer", label: "Quran Completer", emoji: "📗", desc: "Complete all 114 surahs", check: (d: GrowthData) => d.progress.filter(p => p.category?.toLowerCase().includes("quran")).length >= 114 },
];

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const GrowthPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("tazki_token");

  useEffect(() => {
    fetch("/api/growth", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((d: GrowthData) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] font-cinzel text-xl animate-pulse">
        Loading your journey...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-5xl">📊</p>
        <p className="font-cinzel text-[var(--gold)]">Could not load growth data</p>
        <button onClick={() => navigate(-1)} className="text-[var(--green)] underline text-sm">Go back</button>
      </div>
    );
  }

  const { progress, streak, salahLast7, weekReport } = data;

  // This-month count
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthCount = progress.filter(p => {
    const d = new Date(p.timestamp);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  // Category breakdown for doughnut
  const catMap: Record<string, number> = {};
  progress.forEach(p => {
    const c = p.category || "Other";
    catMap[c] = (catMap[c] || 0) + 1;
  });
  const catLabels = Object.keys(catMap);
  const catData = Object.values(catMap);
  const catColors = catLabels.map(getCategoryColor);

  // 365-day heatmap
  const minutesByDay: Record<string, number> = {};
  progress.forEach(p => {
    const dayStr = new Date(p.timestamp).toISOString().split("T")[0]!;
    minutesByDay[dayStr] = (minutesByDay[dayStr] || 0) + Math.floor((p.durationListened || 0) / 60);
  });

  const today = new Date();
  const heatmapDays: Array<{ date: string; minutes: number; label: string }> = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0]!;
    const mins = minutesByDay[ds] || 0;
    heatmapDays.push({ date: ds, minutes: mins, label: `${ds}, ${mins} min` });
  }

  // Pad to full weeks at start
  const startDow = new Date(heatmapDays[0]!.date).getDay();
  const padded = [...Array(startDow).fill(null), ...heatmapDays];
  const weeks: Array<Array<{ date: string; minutes: number; label: string } | null>> = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7) as Array<{ date: string; minutes: number; label: string } | null>);
  }

  // Mood journey (last 30 days)
  const last30 = progress.filter(p => p.timestamp >= Date.now() - 30 * 24 * 60 * 60 * 1000);
  const moodLabels = last30.map(p => new Date(p.timestamp).toLocaleDateString("en", { month: "short", day: "numeric" }));
  const moodBefore = last30.map(p => p.moodBefore || null);
  const moodAfter = last30.map(p => p.moodAfter || null);

  // Khushoo bar chart (last 7 days × 5 prayers)
  const khushooLabels = salahLast7.map(d => {
    const dt = new Date(d.date);
    return dt.toLocaleDateString("en", { weekday: "short" });
  }).reverse();

  const khushooDatasets = PRAYER_ORDER.map((prayer, idx) => ({
    label: prayer,
    data: salahLast7.map(day => {
      const entry = day.entries.find((e) => e.prayer === prayer);
      return entry?.khushooRating || 0;
    }).reverse(),
    backgroundColor: `hsl(${idx * 60}, 70%, 50%)`,
    borderRadius: 4,
  }));

  // Badges
  const unlockedBadges = BADGES.filter(b => b.check(data));
  const lockedBadges = BADGES.filter(b => !b.check(data));

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <div className="p-4 flex items-center gap-3 border-b border-[var(--border)]">
        <button onClick={() => navigate(-1)} className="text-[var(--muted)]"><ChevronLeft size={24} /></button>
        <h1 className="font-cinzel text-xl text-[var(--gold)]">Spiritual Growth</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Sessions", value: progress.length, color: "text-[var(--green)]" },
            { label: "Minutes Prayed", value: Math.floor(streak.totalMinutes || 0), color: "text-[var(--gold)]" },
            { label: "Longest Streak", value: `${streak.longestStreak}🔥`, color: "text-[var(--gold)]" },
            { label: "This Month", value: thisMonthCount, color: "text-white" },
          ].map(s => (
            <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
              <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`font-cinzel text-2xl ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Weekly report */}
        <div className="bg-gradient-to-r from-[var(--surface)] to-[var(--card)] border border-[var(--green)]/30 rounded-2xl p-5">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-3">This week's report</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-cinzel text-2xl text-[var(--gold)]">{weekReport.sessions} sessions</p>
              <p className="text-sm text-[var(--muted)]">{weekReport.minutes} min · {weekReport.streakDays} day streak</p>
              {weekReport.topCategory && (
                <p className="text-xs text-[var(--green)] mt-1">Top: {weekReport.topCategory}</p>
              )}
            </div>
            <Link to="/sessions" className="bg-[var(--green)] text-white px-4 py-2 rounded-xl text-sm font-semibold">
              Keep going →
            </Link>
          </div>
        </div>

        {/* Category breakdown */}
        {catLabels.length > 0 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <p className="font-cinzel text-[var(--gold)] mb-4">Category Breakdown</p>
            <div className="flex items-center gap-4">
              <div className="w-36 h-36 shrink-0">
                <Doughnut
                  data={{
                    labels: catLabels,
                    datasets: [{ data: catData, backgroundColor: catColors, borderWidth: 0 }],
                  }}
                  options={{
                    cutout: "60%",
                    plugins: {
                      legend: { display: false },
                      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}` } },
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {catLabels.map((cat, i) => {
                  const pct = Math.round(((catData[i] || 0) / progress.length) * 100);
                  return (
                    <div key={cat} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: catColors[i] }} />
                      <span className="truncate text-[var(--muted)]">{cat}</span>
                      <span className="ml-auto text-[var(--text)] shrink-0">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 365-day Heatmap */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <p className="font-cinzel text-[var(--gold)] mb-4">Year of Ibadah</p>
          <div className="overflow-x-auto">
            <div className="flex gap-[2px]" style={{ minWidth: `${weeks.length * 12}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className="w-[10px] h-[10px] rounded-sm"
                      style={{ backgroundColor: day ? getHeatColor(day.minutes) : "transparent" }}
                      title={day?.label}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-[10px] text-[var(--muted)]">
            <span>Less</span>
            {["#002800","#004400","#006600","#00a550","#00ff66"].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Mood journey */}
        {last30.length > 1 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <p className="font-cinzel text-[var(--gold)] mb-4">Mood Journey (30 days)</p>
            <Line
              data={{
                labels: moodLabels,
                datasets: [
                  {
                    label: "Before",
                    data: moodBefore,
                    borderColor: "#c04848",
                    borderDash: [4, 4],
                    pointRadius: 2,
                    tension: 0.4,
                    borderWidth: 2,
                    spanGaps: true,
                  },
                  {
                    label: "After",
                    data: moodAfter,
                    borderColor: "#00a550",
                    pointRadius: 2,
                    tension: 0.4,
                    borderWidth: 2,
                    spanGaps: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: { min: 1, max: 5, ticks: { color: "#4a7a4a", stepSize: 1 }, grid: { color: "#004400" } },
                  x: { ticks: { color: "#4a7a4a", maxRotation: 45 }, grid: { display: false } },
                },
                plugins: { legend: { labels: { color: "#e8f5e8", boxWidth: 12 } } },
              }}
            />
          </div>
        )}

        {/* Khushoo chart */}
        {salahLast7.some(d => d.entries.length > 0) && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <p className="font-cinzel text-[var(--gold)] mb-4">Prayer Focus (Khushoo)</p>
            <Bar
              data={{ labels: khushooLabels, datasets: khushooDatasets }}
              options={{
                responsive: true,
                scales: {
                  y: { min: 0, max: 5, ticks: { color: "#4a7a4a", stepSize: 1 }, grid: { color: "#004400" } },
                  x: { ticks: { color: "#4a7a4a" }, grid: { display: false } },
                },
                plugins: { legend: { labels: { color: "#e8f5e8", boxWidth: 10, font: { size: 10 } } } },
              }}
            />
          </div>
        )}

        {/* Khushoo insight */}
        {salahLast7.length >= 4 && (() => {
          const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
          const older = salahLast7.slice(0, Math.floor(salahLast7.length / 2));
          const recent = salahLast7.slice(Math.floor(salahLast7.length / 2));
          let bestPrayer = "";
          let bestDelta = 0;
          let oldAvg = 0;
          let newAvg = 0;
          for (const p of prayers) {
            const o = older.flatMap(d => d.entries).filter(e => e.prayer === p && e.khushooRating);
            const r = recent.flatMap(d => d.entries).filter(e => e.prayer === p && e.khushooRating);
            if (o.length === 0 || r.length === 0) continue;
            const oa = o.reduce((s, e) => s + (e.khushooRating ?? 0), 0) / o.length;
            const ra = r.reduce((s, e) => s + (e.khushooRating ?? 0), 0) / r.length;
            const delta = ra - oa;
            if (delta > bestDelta) { bestDelta = delta; bestPrayer = p; oldAvg = oa; newAvg = ra; }
          }
          if (!bestPrayer) return null;
          return (
            <div className="bg-[var(--gold)]/8 border border-[var(--gold)]/30 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs text-[var(--muted)] mb-0.5">Khushoo Insight</p>
                <p className="text-sm text-[var(--text)] font-medium">
                  Your <span className="text-[var(--gold)] font-semibold">{bestPrayer}</span> focus improved!{" "}
                  Up from{" "}
                  <span className="text-[var(--muted)]">{oldAvg.toFixed(1)}</span>{" "}
                  to{" "}
                  <span className="text-[var(--green)] font-semibold">{newAvg.toFixed(1)}</span> ⭐
                </p>
              </div>
            </div>
          );
        })()}

        {/* Milestones */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <p className="font-cinzel text-[var(--gold)] mb-4">Milestones</p>
          <div className="grid grid-cols-3 gap-3">
            {[...unlockedBadges, ...lockedBadges].map(badge => {
              const unlocked = badge.check(data);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-colors ${
                    unlocked
                      ? "bg-[var(--gold)]/10 border-[var(--gold)]/40"
                      : "bg-[var(--card)] border-[var(--border)] opacity-50"
                  }`}
                >
                  <span className={`text-3xl mb-1.5 ${!unlocked && "grayscale"}`}>{badge.emoji}</span>
                  <p className={`text-[11px] font-semibold leading-tight ${unlocked ? "text-[var(--gold)]" : "text-[var(--muted)]"}`}>
                    {badge.label}
                  </p>
                  {!unlocked && <p className="text-[9px] text-[var(--muted)] mt-0.5 leading-tight">{badge.desc}</p>}
                  {unlocked && <p className="text-[9px] text-[var(--green)] mt-0.5">Unlocked ✓</p>}
                </div>
              );
            })}
          </div>
        </div>

        {progress.length === 0 && (
          <div className="text-center py-10">
            <p className="text-5xl mb-4">🌱</p>
            <p className="font-cinzel text-[var(--gold)] mb-2">Your journey starts now</p>
            <p className="text-[var(--muted)] text-sm mb-6">Complete sessions to see your growth charts</p>
            <Link to="/sessions" className="bg-[var(--green)] text-white px-6 py-3 rounded-xl font-semibold">
              Browse Sessions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthPage;
