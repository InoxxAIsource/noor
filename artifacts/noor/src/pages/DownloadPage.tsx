import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function DownloadPage() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") setInstalled(true);
  }

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
    await fetch(`${BASE}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setJoined(true);
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <div style={{ background: "#001a00", minHeight: "100vh", padding: "0 0 80px", color: "#e8f5e8" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "48px 20px 32px" }}>
        <div style={{ fontSize: "4rem", marginBottom: 12 }}>🌙</div>
        <h1 style={{ fontFamily: "Cinzel,serif", color: "#ffd700", fontSize: "2rem", margin: "0 0 12px" }}>
          Download MyTazki
        </h1>
        <p style={{ color: "#4a7a4a", fontSize: "1.05rem", maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.6 }}>
          Your personal Islamic companion. Remember Allah, every day. Available as a PWA (Progressive Web App) now.
        </p>

        {/* PWA Install */}
        {installed ? (
          <div style={{ background: "rgba(0,165,80,0.15)", border: "1px solid #00a550", borderRadius: 12, padding: "16px 28px", display: "inline-block" }}>
            <p style={{ color: "#00a550", fontWeight: "bold", margin: 0, fontSize: "1.1rem" }}>✅ MyTazki is installed!</p>
            <p style={{ color: "#4a7a4a", margin: "4px 0 0", fontSize: 14 }}>Open it from your home screen</p>
          </div>
        ) : installPrompt ? (
          <button
            onClick={() => void handleInstall()}
            style={{ background: "#00a550", color: "#001a00", border: "none", borderRadius: 12, padding: "16px 36px", fontSize: "1.05rem", fontWeight: "bold", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}
          >
            📲 Install MyTazki
          </button>
        ) : isIOS ? (
          <div style={{ background: "#002800", border: "1px solid rgba(0,165,80,0.3)", borderRadius: 12, padding: 20, maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
            <p style={{ color: "#ffd700", fontFamily: "Cinzel,serif", margin: "0 0 10px" }}>Install on iPhone / iPad</p>
            <ol style={{ color: "#a0c8a0", fontSize: 14, lineHeight: 2, padding: "0 0 0 18px", margin: 0 }}>
              <li>Tap the <strong style={{ color: "#00a550" }}>Share</strong> button in Safari</li>
              <li>Tap <strong style={{ color: "#00a550" }}>Add to Home Screen</strong></li>
              <li>Tap <strong style={{ color: "#00a550" }}>Add</strong></li>
            </ol>
          </div>
        ) : (
          <div style={{ background: "#002800", border: "1px solid rgba(0,165,80,0.3)", borderRadius: 12, padding: 20, maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
            <p style={{ color: "#ffd700", fontFamily: "Cinzel,serif", margin: "0 0 10px" }}>Install in Chrome / Edge</p>
            <ol style={{ color: "#a0c8a0", fontSize: 14, lineHeight: 2, padding: "0 0 0 18px", margin: 0 }}>
              <li>Click the <strong style={{ color: "#00a550" }}>⋮</strong> menu in the address bar</li>
              <li>Select <strong style={{ color: "#00a550" }}>Install MyTazki…</strong></li>
              <li>Click <strong style={{ color: "#00a550" }}>Install</strong></li>
            </ol>
          </div>
        )}
      </div>

      {/* App Store / Play Store placeholders */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", padding: "0 20px 32px" }}>
        <div style={{ background: "#002800", border: "1px solid rgba(0,165,80,0.2)", borderRadius: 12, padding: "14px 28px", opacity: 0.6, cursor: "not-allowed", textAlign: "center" }}>
          <p style={{ color: "#e8f5e8", fontWeight: "bold", margin: "0 0 4px", fontSize: 14 }}>🍎 App Store</p>
          <p style={{ color: "#4a7a4a", fontSize: 12, margin: 0 }}>Coming soon</p>
        </div>
        <div style={{ background: "#002800", border: "1px solid rgba(0,165,80,0.2)", borderRadius: 12, padding: "14px 28px", opacity: 0.6, cursor: "not-allowed", textAlign: "center" }}>
          <p style={{ color: "#e8f5e8", fontWeight: "bold", margin: "0 0 4px", fontSize: 14 }}>🤖 Google Play</p>
          <p style={{ color: "#4a7a4a", fontSize: 12, margin: 0 }}>Coming soon</p>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 16px" }}>
        <h2 style={{ color: "#00a550", fontFamily: "Cinzel,serif", fontSize: "1.1rem", textAlign: "center", marginBottom: 20 }}>Everything in one app</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["🕌", "Prayer Times", "Live times for 100+ cities"],
            ["📖", "Quran Reader", "All 114 surahs with audio"],
            ["🤲", "Duas Library", "100+ curated supplications"],
            ["🧭", "Qibla Compass", "Accurate direction anywhere"],
            ["📿", "Digital Tasbih", "With progress rings"],
            ["🕌", "Masjid Finder", "Nearby mosques on map"],
            ["🤖", "MyTazki AI", "Personal Islamic companion"],
            ["📊", "Growth Tracker", "Streaks & badges"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "#002800", border: "1px solid rgba(0,165,80,0.15)", borderRadius: 10, padding: 14 }}>
              <p style={{ fontSize: "1.5rem", margin: "0 0 6px" }}>{icon}</p>
              <p style={{ color: "#ffd700", fontFamily: "Cinzel,serif", fontSize: "0.85rem", margin: "0 0 4px" }}>{title}</p>
              <p style={{ color: "#4a7a4a", fontSize: 12, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notify */}
      <div style={{ maxWidth: 420, margin: "32px auto 0", padding: "0 16px" }}>
        <div style={{ background: "#002800", border: "1px solid rgba(0,165,80,0.3)", borderRadius: 14, padding: 24, textAlign: "center" }}>
          <h2 style={{ color: "#ffd700", fontFamily: "Cinzel,serif", fontSize: "1rem", margin: "0 0 8px" }}>Notify me when apps launch</h2>
          {joined ? (
            <p style={{ color: "#00a550", margin: 0 }}>✅ JazakAllah! We'll let you know.</p>
          ) : (
            <form onSubmit={(e) => void joinWaitlist(e)} style={{ display: "flex", gap: 10 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ flex: 1, background: "#001a00", border: "1px solid rgba(0,165,80,0.3)", color: "#e8f5e8", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none" }}
              />
              <button type="submit" style={{ background: "#00a550", color: "#001a00", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: "bold", cursor: "pointer", whiteSpace: "nowrap" }}>
                Notify me
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
