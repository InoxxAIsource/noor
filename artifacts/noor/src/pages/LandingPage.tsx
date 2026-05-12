import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const VERSES = [
  { arabic: "اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا", translation: "Remember Allah with much remembrance — Quran 33:41" },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", translation: "And whoever fears Allah — He will make a way out for him — Quran 65:2" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Verily, in the remembrance of Allah hearts find rest — Quran 13:28" },
];

const SESSIONS = [
  { label: "Morning Azkar", duration: "7 min", tag: "AZKAR" },
  { label: "Surah Al-Mulk Reflection", duration: "12 min", tag: "QURAN" },
  { label: "Sleep with Ayatul Kursi", duration: "9 min", tag: "SLEEP" },
  { label: "Healing Through Sujood", duration: "10 min", tag: "HEALING" },
];

const FAQ_ITEMS = [
  {
    q: "What is MyTazki?",
    a: "MyTazki is an AI-powered Islamic companion app that helps Muslims grow spiritually through guided Quran reflections, Azkar, Duas, prayer times, and personalised Islamic growth journeys.",
  },
  {
    q: "How does the AI Islamic companion work?",
    a: "MyTazki AI is powered by Claude and trained with Islamic adab guidelines. Ask anything about Quran, Sunnah, fiqh, or spiritual struggles — and receive grounded, compassionate guidance 24/7.",
  },
  {
    q: "Can Islam help with anxiety?",
    a: "Yes. The Quran teaches 'Verily, in the remembrance of Allah hearts find rest' (13:28). MyTazki offers guided Azkar sessions, duas for anxiety, and healing Islamic reflections specifically designed to calm worry.",
  },
  {
    q: "How can I build better Islamic habits?",
    a: "MyTazki offers a structured Islamic habit tracker with daily Azkar reminders, salah streak tracking, Quran reading goals, and personalised growth journeys to help you build consistent routines.",
  },
  {
    q: "Is MyTazki free to use?",
    a: "Yes — MyTazki is free forever. Core features including Quran reader, prayer times, Azkar sessions, duas library, and AI companion are fully accessible at no cost.",
  },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mytazki.com/#organization",
      name: "MyTazki",
      url: "https://mytazki.com",
      logo: "https://mytazki.com/favicon.svg",
      description: "AI Islamic Companion for daily Muslim spiritual growth. Guided Quran reflections, Azkar, Duas, prayer times, and personalised Islamic journeys.",
      sameAs: ["https://mytazki.com"],
    },
    {
      "@type": "WebSite",
      "@id": "https://mytazki.com/#website",
      url: "https://mytazki.com",
      name: "MyTazki — AI Islamic Companion",
      description: "Grow spiritually every day with guided Quran reflections, Azkar, Duas, and AI-powered Islamic growth journeys.",
      publisher: { "@id": "https://mytazki.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://mytazki.com/duas?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://mytazki.com" }],
    },
  ],
};

const s = {
  bg: "#0d1411",
  surface: "#152019",
  card: "#1c2d21",
  green: "#34c97a",
  gold: "#b8946a",
  text: "#eaf4ee",
  muted: "#6a9878",
  faint: "#2a3830",
  border: "rgba(52,201,122,0.1)",
  borderSoft: "rgba(52,201,122,0.06)",
};

function Divider() {
  return <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${s.border}, transparent)`, margin: "0 24px" }} />;
}

function EyebrowLabel({ children }: { children: string }) {
  return (
    <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 3, color: s.green, textTransform: "uppercase", marginBottom: 14, marginTop: 0 }}>
      {children}
    </p>
  );
}

function SectionH2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: s.text, marginBottom: 12, letterSpacing: "-0.02em", textAlign: "center", ...style }}>
      {children}
    </h2>
  );
}

function HubCard({ icon, title, desc, href }: { icon: string; title: string; desc: string; href: string }) {
  return (
    <a href={href} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        background: s.surface, border: `1px solid ${s.border}`, borderRadius: 16,
        padding: "22px 20px", height: "100%", transition: "border-color 0.2s",
      }}>
        <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: s.text, marginBottom: 6, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 12, color: "#4a6858", lineHeight: 1.65 }}>{desc}</div>
      </div>
    </a>
  );
}

function EntryCard({ emoji, title, subtitle, href }: { emoji: string; title: string; subtitle: string; href: string }) {
  return (
    <a href={href} style={{ textDecoration: "none", display: "block", flex: "1 1 160px" }}>
      <div style={{
        background: s.card, border: `1px solid ${s.border}`, borderRadius: 14,
        padding: "20px 18px", textAlign: "center",
      }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>{emoji}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: s.text, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 11, color: s.muted, lineHeight: 1.5 }}>{subtitle}</div>
      </div>
    </a>
  );
}

function JourneyCard({ title, days, desc, href }: { title: string; days: string; desc: string; href: string }) {
  return (
    <a href={href} style={{ textDecoration: "none", display: "block", flex: "1 1 200px" }}>
      <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 16, padding: "20px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: s.green, textTransform: "uppercase", marginBottom: 6 }}>{days}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: s.text, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#4a6858", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </a>
  );
}

export default function LandingPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [verseIdx, setVerseIdx] = useState(0);
  const [verseVisible, setVerseVisible] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      void navigate("/home", { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate]);

  useEffect(() => {
    const id = setInterval(() => {
      setVerseVisible(false);
      setTimeout(() => {
        setVerseIdx(i => (i + 1) % VERSES.length);
        setVerseVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(52,201,122,0.3)", borderTop: "2px solid #34c97a", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ color: s.green, fontFamily: "Inter, sans-serif", fontSize: 13, letterSpacing: 2, fontWeight: 600 }}>MYTAZKI</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const verse = VERSES[verseIdx]!;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: s.text, fontFamily: "Inter, DM Sans, system-ui, sans-serif", overflowX: "hidden" }}>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 24px", borderBottom: `1px solid ${s.borderSoft}`,
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,20,17,0.92)", backdropFilter: "blur(12px)",
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
            <rect width="180" height="180" rx="38" fill="#152019"/>
            <circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.9"/>
            <circle cx="112" cy="78" r="46" fill="#152019"/>
            <circle cx="130" cy="58" r="6" fill="#34c97a"/>
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: s.green }}>My</span>
            <span style={{ color: s.text }}>Tazki</span>
          </span>
        </a>
        <div style={{ display: "none", gap: 20, alignItems: "center" }} className="nav-links-desktop">
          <a href="/mental-wellness" style={{ color: s.muted, textDecoration: "none", fontSize: 13 }}>Wellness</a>
          <a href="/quran" style={{ color: s.muted, textDecoration: "none", fontSize: 13 }}>Quran</a>
          <a href="/duas" style={{ color: s.muted, textDecoration: "none", fontSize: 13 }}>Duas</a>
          <a href="/about" style={{ color: s.muted, textDecoration: "none", fontSize: 13 }}>About</a>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => void navigate("/login")} style={{ background: "transparent", border: `1px solid rgba(52,201,122,0.25)`, color: s.muted, borderRadius: 10, padding: "8px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Sign In
          </button>
          <button onClick={() => void navigate("/register")} style={{ background: s.green, border: "none", color: s.bg, borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Start Free
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header style={{ textAlign: "center", padding: "80px 24px 64px", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ opacity: verseVisible ? 1 : 0, transition: "opacity 0.5s ease", marginBottom: 36, minHeight: 72 }}>
          <div style={{ fontFamily: "Amiri, serif", fontSize: 26, color: s.green, direction: "rtl", marginBottom: 8, lineHeight: 1.5 }}>
            {verse.arabic}
          </div>
          <div style={{ fontSize: 12, color: s.faint, fontStyle: "italic", letterSpacing: 0.3 }}>
            {verse.translation}
          </div>
        </div>

        {/* PRIMARY H1 — semantic SEO anchor */}
        <h1 style={{
          fontFamily: "DM Sans, Inter, sans-serif",
          fontSize: "clamp(34px, 8vw, 60px)",
          fontWeight: 800,
          color: s.text,
          margin: "0 0 20px",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}>
          AI Islamic Companion<br />
          <span style={{ color: s.green }}>for Daily Muslim Growth</span>
        </h1>

        <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", color: s.muted, maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.75, fontWeight: 400 }}>
          Guided Quran reflections, Azkar, Duas, and AI-powered spiritual journeys designed for modern Muslims seeking peace, purpose, and closeness to Allah.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => void navigate("/register")} style={{ background: s.green, border: "none", color: s.bg, borderRadius: 14, padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em", boxShadow: "0 0 32px rgba(52,201,122,0.25)" }}>
            Start Your Journey
          </button>
          <a href="/start-here" style={{ background: "rgba(52,201,122,0.08)", border: `1px solid rgba(52,201,122,0.2)`, color: s.green, borderRadius: 14, padding: "16px 36px", fontSize: 16, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Where do I start?
          </a>
        </div>
        <p style={{ fontSize: 12, color: s.faint, marginTop: 16 }}>Free forever · No credit card · Works on any device</p>
      </header>

      <Divider />

      {/* ── STEP 4 — EMOTIONAL ENTRY POINTS ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
        <EyebrowLabel>Where are you today?</EyebrowLabel>
        <SectionH2>Find Peace Through Guided Islamic Wellness</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 36, lineHeight: 1.7 }}>
          Wherever you are on your journey — struggling with anxiety, missing salah, or wanting to reconnect — MyTazki meets you there with compassion and guidance rooted in Quran and Sunnah.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <EntryCard emoji="🌿" title="Find Peace in Islam" subtitle="Calm anxiety through Quran & Dhikr" href="/find-peace-in-islam" />
          <EntryCard emoji="🤲" title="Reconnect With Allah" subtitle="Gentle 7-step return guide" href="/reconnect-with-allah" />
          <EntryCard emoji="🕌" title="Start Praying Again" subtitle="No guilt — just a fresh start" href="/start-praying-again" />
          <EntryCard emoji="📿" title="Build Islamic Habits" subtitle="Small daily actions, big spiritual growth" href="/build-islamic-habits" />
        </div>
        <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "#4a6858" }}>
          Not sure where to begin? <a href="/start-here" style={{ color: s.green, textDecoration: "none", fontWeight: 600 }}>Take the Start Here path →</a>
        </p>
      </section>

      <Divider />

      {/* ── STEP 5 — AUTHORITY HUB GRID ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
        <EyebrowLabel>Explore All Topics</EyebrowLabel>
        <SectionH2>Build Better Islamic Habits Every Day</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 36, lineHeight: 1.7 }}>
          MyTazki is structured as a complete Islamic growth system — covering mental wellness, salah consistency, daily Quran engagement, and AI-powered spiritual coaching.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
          <HubCard icon="🧠" title="Mental Wellness" desc="Duas for anxiety, healing sessions, Quran for the overwhelmed mind." href="/mental-wellness" />
          <HubCard icon="🕌" title="Salah" desc="Prayer guides, khushoo tips, Fajr routines, and salah habit building." href="/salah" />
          <HubCard icon="📖" title="Quran Reflections" desc="All 114 surahs with audio, translation, and guided tadabbur reflections." href="/quran-reflections" />
          <HubCard icon="📿" title="Islamic Habits" desc="Gratitude, sleep routines, time management, 30-day challenges." href="/islamic-habits" />
          <HubCard icon="✦" title="AI Islamic Tools" desc="AI companion, AI Quran reflection, AI tafsir and dua generator." href="/ai-islamic-tools" />
          <HubCard icon="🌙" title="Guided Journeys" desc="7-day inner peace, salah reset, tahajjud transformation journeys." href="/7-day-inner-peace-journey" />
        </div>
      </section>

      <Divider />

      {/* ── STEP 2a — H2: Quran Reflections ── */}
      <section style={{ background: "rgba(21,32,25,0.5)", borderTop: `1px solid ${s.borderSoft}`, borderBottom: `1px solid ${s.borderSoft}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <EyebrowLabel>Quran</EyebrowLabel>
          <SectionH2>Guided Quran Reflections for Modern Muslims</SectionH2>
          <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 40, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 40px" }}>
            Read, listen, and reflect on all 114 surahs with Arabic text, English translation, verse-by-verse audio by Sheikh Alafasy, and AI-guided reflection prompts tailored to your spiritual state.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SESSIONS.map(s2 => (
              <div key={s2.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(13,20,17,0.7)", border: `1px solid ${s.border}`, borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(52,201,122,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: `12px solid ${s.green}`, marginLeft: 3 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: s.text }}>{s2.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#4a6858", marginTop: 2 }}>{s2.duration}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: s.green, background: "rgba(52,201,122,0.1)", padding: "3px 8px", borderRadius: 6 }}>{s2.tag}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <a href="/quran" style={{ color: s.green, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>Browse all 114 Surahs →</a>
            <span style={{ color: s.faint, fontSize: 13 }}>·</span>
            <a href="/quran-reflections" style={{ color: s.muted, fontSize: 13, textDecoration: "none" }}>Reflection guides</a>
            <span style={{ color: s.faint, fontSize: 13 }}>·</span>
            <a href="/surah-fatiha-reflection" style={{ color: s.muted, fontSize: 13, textDecoration: "none" }}>Surah Al-Fatiha</a>
            <span style={{ color: s.faint, fontSize: 13 }}>·</span>
            <a href="/surah-mulk-reflection" style={{ color: s.muted, fontSize: 13, textDecoration: "none" }}>Surah Al-Mulk</a>
          </div>
        </div>
      </section>

      {/* ── STEP 2b — H2: Daily Azkar ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
        <EyebrowLabel>Daily practice</EyebrowLabel>
        <SectionH2>Daily Azkar, Duas &amp; Spiritual Routines</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 36, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 36px" }}>
          Build a consistent morning and evening spiritual routine with 110+ authentic duas from Quran and Hadith, 35+ guided audio Azkar sessions, and a digital Tasbih counter — all offline-ready.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {[
            { icon: "☀️", label: "Morning Azkar", sub: "Start every day with barakah", href: "/duas" },
            { icon: "🌙", label: "Evening Azkar", sub: "Seal your day with gratitude", href: "/evening-azkar-routine" },
            { icon: "🤲", label: "Duas Library", sub: "110+ duas for every moment", href: "/duas" },
            { icon: "📿", label: "Digital Tasbih", sub: "33/34/33 dhikr tracker", href: "/register" },
            { icon: "🛌", label: "Sleep Sessions", sub: "Ayatul Kursi before bed", href: "/register" },
            { icon: "💚", label: "Healing Sessions", sub: "Dua for anxiety & grief", href: "/dua-for-anxiety" },
          ].map(card => (
            <a key={card.label} href={card.href} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 14, padding: "18px 16px" }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: s.text, marginBottom: 4 }}>{card.label}</div>
                <div style={{ fontSize: 11, color: "#4a6858", lineHeight: 1.5 }}>{card.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── STEP 7 — AI COMPANION DIFFERENTIATOR ── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52,201,122,0.1)", border: `1px solid rgba(52,201,122,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28 }}>
          ✦
        </div>
        <EyebrowLabel>AI Islamic Companion</EyebrowLabel>
        <SectionH2>AI-Powered Islamic Growth Journeys</SectionH2>
        <p style={{ fontSize: 15, color: "#4a6858", lineHeight: 1.8, marginBottom: 20, maxWidth: 500, margin: "0 auto 20px" }}>
          MyTazki AI is the first Islamic companion built with Claude AI and guided by Quranic adab. It provides personalised Islamic growth coaching, emotional wellness support, Quran reflection prompts, and answers grounded in authentic Islamic scholarship — not opinions.
        </p>
        <p style={{ fontSize: 14, color: "#4a6858", lineHeight: 1.7, marginBottom: 32 }}>
          Unlike generic AI chatbots, MyTazki AI understands Islamic context, observes limits (no fatwa), and guides you with compassion — optimised for <em>Muslim growth</em>, not just answers.
        </p>
        {/* Chat demo */}
        <div style={{ background: "rgba(21,32,25,0.8)", border: `1px solid rgba(52,201,122,0.12)`, borderRadius: 16, padding: "20px 24px", textAlign: "left", marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(52,201,122,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🙋</div>
            <div style={{ background: "rgba(52,201,122,0.07)", borderRadius: "0 12px 12px 12px", padding: "10px 14px", fontSize: 13, color: s.muted, flexGrow: 1 }}>
              I feel disconnected from Allah. Where do I start?
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <div style={{ background: "rgba(52,201,122,0.1)", borderRadius: "12px 0 12px 12px", padding: "10px 14px", fontSize: 13, color: s.green, maxWidth: "80%", lineHeight: 1.65 }}>
              That feeling is itself a sign of iman — the heart recognising its distance from its Creator. Begin with two rakaat of voluntary prayer, recite Surah Ad-Duha (93), and say: <em>"Rabbi inni limas-sani ad-durru wa-anta arhamur-rahimeen."</em>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(52,201,122,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✦</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/ai-islamic-companion" style={{ color: s.green, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>How the AI works →</a>
          <a href="/ai-quran-reflection" style={{ color: s.muted, fontSize: 13, textDecoration: "none" }}>AI Quran reflections</a>
          <a href="/ai-islamic-tools" style={{ color: s.muted, fontSize: 13, textDecoration: "none" }}>All AI tools</a>
        </div>
      </section>

      <Divider />

      {/* ── STEP 6 — FEATURED JOURNEYS ── */}
      <section style={{ background: "rgba(21,32,25,0.5)", borderTop: `1px solid ${s.borderSoft}`, borderBottom: `1px solid ${s.borderSoft}`, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <EyebrowLabel>Guided Journeys</EyebrowLabel>
          <SectionH2>Start Your Spiritual Journey With MyTazki</SectionH2>
          <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 36, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 36px" }}>
            Structured multi-day Islamic journeys that guide you step by step — no overwhelm, no guilt. Just consistent, compassionate spiritual growth.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <JourneyCard title="7-Day Inner Peace Journey" days="7 days" desc="Rebuild calm and reconnect with Allah through daily Azkar, Quran, and reflection." href="/7-day-inner-peace-journey" />
            <JourneyCard title="Reconnect With Allah Journey" days="Guided path" desc="A compassionate return — step by step, with no judgement and full Quranic support." href="/reconnect-with-allah-journey" />
            <JourneyCard title="7-Day Salah Reset" days="7 days" desc="Rebuild your prayer habit from scratch with gentle daily goals and khushoo tips." href="/7-day-salah-reset" />
            <JourneyCard title="Tahajjud Transformation" days="30 nights" desc="Establish the night prayer habit with gradual rakaat goals and spiritual milestones." href="/tahajjud-transformation-journey" />
          </div>
          <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "#4a6858" }}>
            Also: <a href="/morning-barakah-routine" style={{ color: s.green, textDecoration: "none" }}>Morning Barakah Routine</a> · <a href="/7-day-salah-reset" style={{ color: s.muted, textDecoration: "none" }}>Salah Reset</a> · <a href="/islamic-habits" style={{ color: s.muted, textDecoration: "none" }}>Islamic Habits hub</a>
          </p>
        </div>
      </section>

      {/* ── STEP 2c — H2: Islamic Wellness ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
        <EyebrowLabel>Emotional wellness</EyebrowLabel>
        <SectionH2>Find Peace Through Guided Islamic Wellness</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 36, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 36px" }}>
          Islam provides a complete framework for emotional healing — not as a substitute for professional help, but as a spiritual foundation. MyTazki makes that framework accessible, personal, and daily.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {[
            { emoji: "💚", label: "Dua for Anxiety", href: "/dua-for-anxiety" },
            { emoji: "🫂", label: "Islamic Healing", href: "/emotional-healing-in-islam" },
            { emoji: "🌊", label: "Dua for Grief", href: "/dua-for-grief" },
            { emoji: "🌤️", label: "Dua for Sadness", href: "/dua-for-sadness" },
            { emoji: "🧘", label: "Stop Overthinking", href: "/how-to-stop-overthinking-islam" },
            { emoji: "🌿", label: "Burnout in Islam", href: "/islamic-cure-for-burnout" },
          ].map(item => (
            <a key={item.label} href={item.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "14px 16px" }}>
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: s.text }}>{item.label}</span>
            </a>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#4a6858" }}>
          <a href="/mental-wellness" style={{ color: s.green, textDecoration: "none", fontWeight: 600 }}>Explore the full Mental Wellness hub →</a>
        </p>
      </section>

      <Divider />

      {/* ── STEP 8 — TRUST + ENTITY BLOCK ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px" }}>
        <EyebrowLabel>Trust &amp; transparency</EyebrowLabel>
        <SectionH2>Islamic Guidance You Can Trust</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 36, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 36px" }}>
          Every dua, reflection, and AI response on MyTazki is grounded in authenticated Islamic sources — Quran, Hadith, and classical scholarship. We are transparent about what AI can and cannot do in an Islamic context.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { label: "About MyTazki", sub: "Our mission & team", href: "/about", icon: "🌿" },
            { label: "Editorial Standards", sub: "How we verify content", href: "/editorial-guidelines", icon: "📋" },
            { label: "AI Ethics", sub: "Our limits & principles", href: "/ai-ethics", icon: "⚖️" },
            { label: "Content Verification", sub: "6-step review process", href: "/content-verification", icon: "✅" },
            { label: "Islamic Guidance Policy", sub: "Scholars vs AI — clearly stated", href: "/islamic-guidance-policy", icon: "📜" },
            { label: "Our Mission", sub: "Why we built MyTazki", href: "/mission", icon: "🎯" },
          ].map(card => (
            <a key={card.label} href={card.href} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 14px" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{card.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.text, marginBottom: 3 }}>{card.label}</div>
                <div style={{ fontSize: 11, color: "#4a6858", lineHeight: 1.4 }}>{card.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── STEP 9 — FAQ + GEO ── */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px" }}>
        <EyebrowLabel>Common questions</EyebrowLabel>
        <SectionH2>People Also Ask</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 14, marginBottom: 36 }}>
          Quick answers about MyTazki, Islamic wellness, and AI-powered spiritual growth.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} style={{ background: s.surface, border: `1px solid ${openFaq === i ? "rgba(52,201,122,0.25)" : s.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", background: "transparent", border: "none", color: s.text, textAlign: "left", padding: "18px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit" }}
              >
                <span>{faq.q}</span>
                <span style={{ color: s.green, fontSize: 16, flexShrink: 0, marginLeft: 12 }}>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#4a6858", lineHeight: 1.75 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: `linear-gradient(180deg, ${s.bg} 0%, #101a15 50%, ${s.bg} 100%)`, borderTop: `1px solid ${s.borderSoft}`, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "Amiri, serif", fontSize: 28, color: s.green, direction: "rtl", marginBottom: 16, opacity: 0.8 }}>
          وَاذْكُرُوا اللَّهَ كَثِيرًا
        </div>
        <p style={{ fontSize: 13, color: "#4a6858", marginBottom: 36 }}>
          "And remember Allah often" — Quran 62:10
        </p>
        <h2 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, color: s.text, marginBottom: 12, letterSpacing: "-0.02em" }}>
          Begin your growth journey today.
        </h2>
        <p style={{ color: "#4a6858", fontSize: 14, marginBottom: 36 }}>
          Join thousands of Muslims building better spiritual habits with MyTazki — the AI Islamic companion built for daily growth.
        </p>
        <button onClick={() => void navigate("/register")} style={{ background: s.green, border: "none", color: s.bg, borderRadius: 14, padding: "16px 48px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 40px rgba(52,201,122,0.2)" }}>
          Start Your Journey →
        </button>
        <p style={{ fontSize: 12, color: s.faint, marginTop: 16 }}>Free forever · No ads · No subscription required</p>
      </section>

      {/* ── STEP 10 — SEO FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${s.borderSoft}`, padding: "48px 24px 32px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 180 180" fill="none">
                <rect width="180" height="180" rx="38" fill="#152019"/>
                <circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.9"/>
                <circle cx="112" cy="78" r="46" fill="#152019"/>
                <circle cx="130" cy="58" r="6" fill="#34c97a"/>
              </svg>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: s.green }}>My</span>
                <span style={{ color: s.muted }}>Tazki</span>
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#2a3830", lineHeight: 1.7 }}>AI Islamic Companion · Grow Spiritually Every Day</p>
          </div>

          {/* Emotional Wellness */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.green, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Wellness</div>
            {[
              ["Find Peace in Islam", "/find-peace-in-islam"],
              ["Dua for Anxiety", "/dua-for-anxiety"],
              ["Emotional Healing", "/emotional-healing-in-islam"],
              ["Dua for Grief", "/dua-for-grief"],
              ["Islamic Mental Health", "/islamic-mental-health"],
              ["Stop Overthinking", "/how-to-stop-overthinking-islam"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ display: "block", fontSize: 12, color: "#4a6858", textDecoration: "none", marginBottom: 7, lineHeight: 1.4 }}>{label}</a>
            ))}
          </div>

          {/* Quran */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.green, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Quran</div>
            {[
              ["Quran Reader", "/quran"],
              ["Quran Reflections", "/quran-reflections"],
              ["Surah Al-Fatiha", "/surah-fatiha-reflection"],
              ["Surah Al-Mulk", "/surah-mulk-reflection"],
              ["Surah Ad-Duha", "/surah-duha-reflection"],
              ["Quran for Anxiety", "/quran-about-anxiety"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ display: "block", fontSize: 12, color: "#4a6858", textDecoration: "none", marginBottom: 7, lineHeight: 1.4 }}>{label}</a>
            ))}
          </div>

          {/* Journeys */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.green, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Journeys</div>
            {[
              ["Start Here", "/start-here"],
              ["7-Day Inner Peace", "/7-day-inner-peace-journey"],
              ["Reconnect With Allah", "/reconnect-with-allah-journey"],
              ["7-Day Salah Reset", "/7-day-salah-reset"],
              ["Tahajjud Journey", "/tahajjud-transformation-journey"],
              ["Morning Barakah", "/morning-barakah-routine"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ display: "block", fontSize: 12, color: "#4a6858", textDecoration: "none", marginBottom: 7, lineHeight: 1.4 }}>{label}</a>
            ))}
          </div>

          {/* Habits & Salah */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.green, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Salah &amp; Habits</div>
            {[
              ["Salah Guide", "/salah"],
              ["Tahajjud Guide", "/tahajjud-prayer-guide"],
              ["Fajr Tips", "/fajr-prayer-tips"],
              ["Islamic Habits", "/islamic-habits"],
              ["30-Day Challenge", "/30-day-islamic-challenge"],
              ["Evening Azkar", "/evening-azkar-routine"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ display: "block", fontSize: 12, color: "#4a6858", textDecoration: "none", marginBottom: 7, lineHeight: 1.4 }}>{label}</a>
            ))}
          </div>

          {/* Trust / Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.green, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Company</div>
            {[
              ["About", "/about"],
              ["Our Mission", "/mission"],
              ["AI Ethics", "/ai-ethics"],
              ["Editorial Guidelines", "/editorial-guidelines"],
              ["Content Verification", "/content-verification"],
              ["Islamic Guidance Policy", "/islamic-guidance-policy"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ display: "block", fontSize: 12, color: "#4a6858", textDecoration: "none", marginBottom: 7, lineHeight: 1.4 }}>{label}</a>
            ))}
          </div>

        </div>

        {/* Footer bottom */}
        <div style={{ borderTop: `1px solid ${s.borderSoft}`, paddingTop: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 11, color: "#2a3830", margin: 0 }}>
            © 2026 MyTazki · AI Islamic Companion · <a href="/about" style={{ color: "#2a3830", textDecoration: "none" }}>About</a> · <a href="/ai-ethics" style={{ color: "#2a3830", textDecoration: "none" }}>AI Ethics</a> · <a href="/trust-and-safety" style={{ color: "#2a3830", textDecoration: "none" }}>Trust &amp; Safety</a>
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              ["Prayer Times", "/prayer-times"],
              ["Duas", "/duas"],
              ["Baby Names", "/names"],
              ["Zakat", "/zakat-calculator"],
              ["Qibla", "/qibla"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: 11, color: "#2a3830", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 640px) { .nav-links-desktop { display: flex !important; } }
      `}</style>
    </div>
  );
}
