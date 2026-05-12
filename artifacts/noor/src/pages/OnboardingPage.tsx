import React, { useState, useEffect } from "react";

function NotificationButton() {
  const [status, setStatus] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (!("Notification" in window)) {
      setStatus("unsupported");
    } else {
      setStatus(Notification.permission);
    }
  }, []);

  const request = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setStatus(result);
  };

  if (status === "granted") {
    return (
      <div className="flex items-center gap-2 text-[var(--green)] text-sm font-medium py-2">
        <span className="text-lg">✅</span> Notifications enabled, JazakAllah khair!
      </div>
    );
  }
  if (status === "denied") {
    return (
      <p className="text-xs text-[var(--muted)]">Notifications are blocked. Enable them in your browser settings to receive prayer reminders.</p>
    );
  }
  if (status === "unsupported") {
    return (
      <p className="text-xs text-[var(--muted)]">Push notifications are not supported on this browser.</p>
    );
  }
  return (
    <button
      onClick={request}
      className="w-full py-3 rounded-xl bg-[var(--green)] text-white font-semibold text-sm"
    >
      🔔 Enable Prayer Reminders
    </button>
  );
}
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUpdateMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [madhab, setMadhab] = useState("");
  const [sunniMadhab, setSunniMadhab] = useState("");
  const [city, setCity] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [language, setLanguage] = useState("");
  const [reminderHour, setReminderHour] = useState<number>(5);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(3);
  
  const { setAuthUser } = useAuth();
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMe();

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
          const data = await res.json();
          if (data && data.address) {
            setCity(data.address.city || data.address.town || data.address.village || "");
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  };

  const toggleGoal = (goal: string) => {
    setGoals((prev) => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleComplete = () => {
    updateMeMutation.mutate(
      { 
        data: { 
          madhab, 
          sunniMadhab: sunniMadhab || undefined, 
          city, 
          lat: lat ?? undefined, 
          lng: lng ?? undefined, 
          goals, 
          language, 
          reminderHour, 
          weeklyGoal, 
          onboardingComplete: true 
        } 
      },
      {
        onSuccess: (updatedUser) => {
          // Sync the returned user (onboardingComplete: true) into context
          // BEFORE navigating so ProtectedRoute doesn't bounce us back.
          setAuthUser(updatedUser);
          navigate("/home", { replace: true });
        }
      }
    );
  };

  const progress = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6 animate-fade-in flex flex-col">
      <div className="w-full bg-[var(--surface)] h-2 rounded-full mb-8 overflow-hidden">
        <div className="bg-[var(--green)] h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-cinzel text-[var(--gold)] text-center">Choose your tradition</h2>
            <div className="flex flex-col gap-3">
              {['Sunni', 'Shia', 'Just Muslim'].map(m => (
                <Button 
                  key={m} 
                  variant="outline" 
                  className={`py-8 text-lg rounded-xl border-[var(--border)] ${madhab === m ? 'bg-[var(--green)] text-white border-[var(--green)]' : 'bg-[var(--surface)] hover:bg-[var(--card)]'}`}
                  onClick={() => setMadhab(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
            {madhab === 'Sunni' && (
              <div className="pt-4 animate-fade-in">
                <p className="text-[var(--muted)] text-sm mb-3 text-center">Optional: Select Madhab</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Hanafi', "Shafi'i", 'Maliki', 'Hanbali'].map(sm => (
                    <Button 
                      key={sm} 
                      variant="outline" 
                      size="sm"
                      className={`py-2 rounded-lg border-[var(--border)] ${sunniMadhab === sm ? 'bg-[var(--green)]/20 border-[var(--green)] text-[var(--gold)]' : 'bg-[var(--surface)]'}`}
                      onClick={() => setSunniMadhab(sm)}
                    >
                      {sm}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-cinzel text-[var(--gold)] text-center">Where are you based?</h2>
            <p className="text-center text-[var(--muted)] text-sm">Used to calculate accurate prayer times</p>
            <div className="space-y-4">
              <Input 
                placeholder="e.g. London, UK" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="bg-[var(--surface)] border-[var(--border)] py-6 text-lg"
              />
              <Button 
                variant="outline" 
                onClick={handleGetLocation}
                className="w-full bg-[var(--surface)] border-[var(--border)] py-6 text-[var(--green)] hover:text-[var(--gold)] hover:bg-[var(--card)]"
              >
                Use my location
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-cinzel text-[var(--gold)] text-center">What are your goals?</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Peace of mind', 'Deeper ibadah', 'Learn duas', 'Quran', 'Consistency', 'Ramadan', 'Find mosque', 'Baby names', 'Learn Arabic'].map(g => (
                <button
                  key={g}
                  onClick={() => toggleGoal(g)}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                    goals.includes(g) 
                      ? 'bg-[var(--green)] border-[var(--green)] text-white' 
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:border-[var(--green)]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-cinzel text-[var(--gold)] text-center">Preferred language</h2>
            <div className="grid gap-3">
              {[
                { id: 'en', label: 'English', emoji: '🇬🇧' },
                { id: 'ur', label: 'اردو', emoji: '🇵🇰' },
                { id: 'ar', label: 'العربية', emoji: '🇸🇦' },
              ].map(lang => (
                <Button
                  key={lang.id}
                  variant="outline"
                  onClick={() => setLanguage(lang.id)}
                  className={`py-8 text-xl rounded-xl border-[var(--border)] flex justify-center gap-3 ${
                    language === lang.id ? 'bg-[var(--green)] border-[var(--green)] text-white' : 'bg-[var(--surface)]'
                  }`}
                >
                  <span>{lang.emoji}</span> <span>{lang.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-cinzel text-[var(--gold)] text-center">Build your habit</h2>
            
            <div className="space-y-3 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
              <label className="block text-sm text-[var(--muted)]">Daily Reminder Time</label>
              <Input 
                type="time" 
                value={`${reminderHour.toString().padStart(2, '0')}:00`}
                onChange={(e) => setReminderHour(parseInt(e.target.value.split(':')[0]))}
                className="bg-[var(--card)] border-none text-2xl py-6"
              />
            </div>

            <div className="space-y-3 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
              <p className="text-sm text-[var(--muted)]">Prayer Reminders</p>
              <NotificationButton />
            </div>

            <div className="space-y-3 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)]">
              <div className="flex justify-between items-center">
                <label className="text-sm text-[var(--muted)]">Weekly Goal</label>
                <span className="text-[var(--gold)] font-bold text-xl">{weeklyGoal} days</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="7" 
                value={weeklyGoal} 
                onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
                className="w-full accent-[var(--green)]"
              />
              <div className="flex justify-between text-xs text-[var(--muted)]">
                <span>1</span>
                <span>7</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <Button variant="ghost" onClick={handleBack} className="text-[var(--muted)]">Back</Button>
        ) : <div></div>}
        
        {step < 5 ? (
          <Button onClick={handleNext} disabled={!madhab && step === 1} className="bg-[var(--green)] hover:bg-[var(--green)]/90 text-white px-8">Next</Button>
        ) : (
          <Button 
            onClick={handleComplete} 
            disabled={updateMeMutation.isPending}
            className="bg-[var(--green)] hover:bg-[var(--green)]/90 text-white px-8"
          >
            {updateMeMutation.isPending ? "Saving..." : "Start My Journey"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;