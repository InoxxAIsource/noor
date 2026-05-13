import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../hooks/useLanguage";
import type { Lang } from "../contexts/LanguageContext";
import { useGetMyStreak } from "@workspace/api-client-react";
import { LogOut, Save, MapPin, BookOpen, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

const LANG_LABELS: Record<Lang, string> = { en: "English", ur: "اردو", ar: "العربية" };

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { data: streakData } = useGetMyStreak();
  const token = localStorage.getItem("tazki_token");

  const u = user as Record<string, unknown> | null;

  const [city, setCity] = useState((u?.["city"] as string) || "");
  const [madhab, setMadhab] = useState((u?.["madhab"] as string) || "sunni");
  const [sunniMadhab, setSunniMadhab] = useState((u?.["sunniMadhab"] as string) || "hanafi");
  const [reminderHour, setReminderHour] = useState((u?.["reminderHour"] as number) ?? 7);
  const [weeklyGoal, setWeeklyGoal] = useState((u?.["weeklyGoal"] as number) ?? 5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [langToast, setLangToast] = useState<string | null>(null);

  const handleLanguageChange = (lang: Lang) => {
    setLanguage(lang);
    setLangToast(`Language set to ${LANG_LABELS[lang]}`);
    setTimeout(() => setLangToast(null), 2500);
  };

  const getInitials = (name?: string) => {
    if (!name) return "N";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const detectGPS = () => {
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const data = await res.json() as { city?: string; locality?: string };
          setCity(data.city || data.locality || "");
        } catch { /* ignore */ }
        setDetectingGps(false);
      },
      () => setDetectingGps(false)
    );
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ city, madhab, sunniMadhab, language, reminderHour, weeklyGoal }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const fmt2 = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:00 ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 animate-fade-in">
      {/* Language toast */}
      {langToast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, background: "var(--green)", color: "#0d1411",
          padding: "10px 22px", borderRadius: 24, fontWeight: 600, fontSize: 14,
          boxShadow: "0 4px 20px rgba(52,201,122,0.45)",
          transition: "opacity 0.3s",
        }}>
          {langToast}
        </div>
      )}
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center gap-5 mb-6 bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)]">
          <div className="w-16 h-16 rounded-full bg-[var(--green)] flex items-center justify-center font-cinzel text-xl font-bold border-[3px] border-[var(--gold)] shrink-0">
            {getInitials(u?.["name"] as string)}
          </div>
          <div>
            <h1 className="font-cinzel text-xl text-[var(--gold)]">{u?.["name"] as string}</h1>
            <p className="text-[var(--muted)] text-sm">{u?.["email"] as string}</p>
            <p className="text-xs text-[var(--green)] mt-1">Beta, Free for now ✓</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Streak", value: `${streakData?.currentStreak || 0}🔥`, color: "text-[var(--gold)]" },
            { label: "Longest", value: `${streakData?.longestStreak || 0} days`, color: "text-[var(--green)]" },
            { label: "Total Sessions", value: streakData?.totalPrayers || 0, color: "text-white" },
            { label: "Minutes Listened", value: streakData?.totalMinutes || 0, color: "text-white" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] text-center">
              <p className="text-[var(--muted)] text-[10px] uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`font-cinzel text-2xl ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link to="/journal" className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--green)]/50 transition-colors">
            <BookOpen size={20} className="text-[var(--green)]" />
            <div>
              <p className="text-sm font-semibold">My Journal</p>
              <p className="text-[10px] text-[var(--muted)]">Reflections</p>
            </div>
          </Link>
          <Link to="/rooms" className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--green)]/50 transition-colors">
            <span className="text-xl">🕌</span>
            <div>
              <p className="text-sm font-semibold">Prayer Rooms</p>
              <p className="text-[10px] text-[var(--muted)]">Pray together</p>
            </div>
          </Link>
        </div>

        {/* Settings form */}
        <h2 className="font-cinzel text-lg text-[var(--gold)] mb-4">Settings</h2>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-5 mb-6">
          {/* Language */}
          <div>
            <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">Language</label>
            <div className="flex gap-2">
              {([ ["en", "English"], ["ur", "Urdu"], ["ar", "Arabic"] ] as [Lang, string][]).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    language === code
                      ? "bg-[var(--green)] text-white border-[var(--green)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--green)]/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Islamic tradition */}
          <div>
            <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">Islamic Tradition</label>
            <div className="flex gap-2">
              {[["sunni", "Sunni"], ["shia", "Shia"], ["general", "Just Muslim"]].map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => setMadhab(code)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    madhab === code
                      ? "bg-[var(--green)] text-white border-[var(--green)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--green)]/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Madhab (if Sunni) */}
          {madhab === "sunni" && (
            <div>
              <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">Madhab</label>
              <div className="grid grid-cols-2 gap-2">
                {[["hanafi", "Hanafi"], ["shafii", "Shafi'i"], ["maliki", "Maliki"], ["hanbali", "Hanbali"]].map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => setSunniMadhab(code)}
                    className={`py-2 rounded-xl text-sm border transition-colors ${
                      sunniMadhab === code
                        ? "bg-[var(--green)] text-white border-[var(--green)]"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--green)]/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* City */}
          <div>
            <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">City</label>
            <div className="flex gap-2">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. London"
                className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--green)]"
              />
              <button
                onClick={detectGPS}
                disabled={detectingGps}
                className="w-10 h-10 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--green)] disabled:opacity-50 hover:border-[var(--green)] transition-colors"
                title="Detect from GPS"
              >
                {detectingGps ? <span className="animate-spin text-xs">⌛</span> : <MapPin size={16} />}
              </button>
            </div>
          </div>

          {/* Reminder time */}
          <div>
            <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">
              Daily reminder, {fmt2(reminderHour)}
            </label>
            <input
              type="range" min="4" max="23" value={reminderHour}
              onChange={(e) => setReminderHour(parseInt(e.target.value))}
              className="w-full accent-[var(--green)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1">
              <span>4 AM</span><span>11 PM</span>
            </div>
          </div>

          {/* Weekly goal */}
          <div>
            <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">
              Weekly goal, {weeklyGoal} day{weeklyGoal !== 1 ? "s" : ""}
            </label>
            <input
              type="range" min="1" max="7" value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
              className="w-full accent-[var(--gold)]"
            />
            <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1">
              <span>1</span><span>7</span>
            </div>
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full bg-[var(--green)] text-white py-4 rounded-2xl font-cinzel text-base font-semibold mb-4 flex items-center justify-center gap-2 hover:bg-[var(--green)]/90 transition-colors disabled:opacity-60"
        >
          {saved ? "✓ Saved!" : saving ? "Saving..." : <><Save size={18} /> Save Settings</>}
        </button>

        <button
          onClick={logout}
          className="w-full py-4 rounded-2xl border border-red-900/40 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-900/10 transition-colors"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
