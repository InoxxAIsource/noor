import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Leaf, HeartHandshake, Building2, CircleDot, 
  Brain, Moon, BookOpen, Sparkles, Sun, 
  CloudMoon, Heart, FileText, Scale, CheckCircle, 
  ScrollText, Target, Play, ChevronDown
} from "lucide-react";

const VERSES = [
  { arabic: "اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا", translation: "Remember Allah with much remembrance", ref: "Quran 33:41" },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", translation: "Whoever fears Allah — He will make a way out for him", ref: "Quran 65:2" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Verily, in the remembrance of Allah hearts find rest", ref: "Quran 13:28" },
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
    a: "MyTazki AI is powered by Claude and trained with Islamic adab guidelines. Ask anything about Quran, Sunnah, fiqh, or spiritual struggles, and receive grounded, compassionate guidance 24/7.",
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
    a: "Yes, MyTazki is free forever. Core features including Quran reader, prayer times, Azkar sessions, duas library, and AI companion are fully accessible at no cost.",
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
      name: "MyTazki, AI Islamic Companion",
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

// Cinematic palette
const C = {
  bg:      "#09070A",
  surface: "#16100a",
  card:    "#1a130d",
  green:   "#34c97a",
  gold:    "#c9a472",
  cream:   "#faf2e2",
  text:    "#f0ece4",
  muted:   "#6e5e4c",
  border:  "rgba(52,201,122,0.10)",
  bGold:   "rgba(201,164,114,0.16)",
  bSoft:   "rgba(52,201,122,0.05)",
};

function Divider() {
  return <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(201,164,114,0.20), transparent)`, margin: "0 24px" }} />;
}

function EyebrowLabel({ children }: { children: string }) {
  return (
    <p style={{ textAlign: "center", fontSize: 10, fontWeight: 700, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 14, marginTop: 0 }}>
      {children}
    </p>
  );
}

function SectionH2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: C.text, marginBottom: 14, letterSpacing: "-0.025em", textAlign: "center", ...style }}>
      {children}
    </h2>
  );
}

function HubCard({ icon: Icon, title, desc, href }: { icon: React.ElementType; title: string; desc: string; href: string }) {
  return (
    <a href={href} className="lp-card" style={{ textDecoration: "none", display: "block" }}>
      <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px 20px", height: "100%", transition: "all 0.3s ease", boxShadow: "0 4px 18px rgba(0,0,0,0.35)" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(52,201,122,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: C.green }}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
      </div>
    </a>
  );
}

function EntryCard({ icon: Icon, title, subtitle, href }: { icon: React.ElementType; title: string; subtitle: string; href: string }) {
  return (
    <a href={href} className="lp-card" style={{ textDecoration: "none", display: "block", flex: "1 1 160px" }}>
      <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 18, padding: "24px 18px", textAlign: "center", transition: "all 0.3s ease", boxShadow: "0 4px 18px rgba(0,0,0,0.35)" }}>
        <div style={{ width: 48, height: 48, margin: "0 auto 12px", borderRadius: "50%", background: "rgba(201,164,114,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: C.gold }}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{subtitle}</div>
      </div>
    </a>
  );
}

function JourneyCard({ title, days, desc, href }: { title: string; days: string; desc: string; href: string }) {
  return (
    <a href={href} className="lp-card" style={{ textDecoration: "none", display: "block", flex: "1 1 200px" }}>
      <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 18, padding: "24px", transition: "all 0.3s ease", boxShadow: "0 4px 18px rgba(0,0,0,0.30)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: C.green, textTransform: "uppercase", marginBottom: 10 }}>{days}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </a>
  );
}

function ArrowRightIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
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
      }, 700);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const verse = VERSES[verseIdx]!;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "Inter, DM Sans, system-ui, sans-serif", overflowX: "hidden" }}>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(9,7,10,0.82)", backdropFilter: "blur(22px) saturate(1.2)",
        borderBottom: "1px solid rgba(201,164,114,0.10)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.45)",
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
            <rect width="180" height="180" rx="38" fill="#16100a"/>
            <circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.9"/>
            <circle cx="112" cy="78" r="46" fill="#16100a"/>
            <circle cx="130" cy="58" r="6" fill="#34c97a"/>
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: C.green }}>My</span>
            <span style={{ color: C.text }}>Tazki</span>
          </span>
        </a>
        <div style={{ display: "none", gap: 24, alignItems: "center" }} className="lp-nav-links">
          {[["Wellness", "/mental-wellness"], ["Quran", "/quran"], ["Duas", "/duas"], ["About", "/about"]].map(([l, h]) => (
            <a key={l} href={h} className="lp-nav-link">{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => void navigate("/login")} className="lp-btn-ghost">Sign In</button>
          <button onClick={() => void navigate("/register")} className="lp-btn-primary">Start Free</button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO — full cinematic
      ══════════════════════════════════════ */}
      <header style={{ minHeight: "100svh", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden", isolation: "isolate" }}>

        {/* Cinematic image */}
        <img src="/images/woman-praying-night.png" alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 0, filter: "contrast(1.12) brightness(0.90) saturate(0.72)" }}
        />

        {/* Warm amber film grade overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(130,74,22,0.30) 0%, rgba(90,44,8,0.20) 55%, rgba(8,5,14,0.10) 100%)", mixBlendMode: "multiply", pointerEvents: "none" }} />

        {/* Cinematic vignette */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "radial-gradient(ellipse 88% 70% at 50% 30%, transparent 30%, rgba(5,3,1,0.72) 100%)", pointerEvents: "none" }} />

        {/* Top dark scrim (for nav readability) */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140, zIndex: 3, background: "linear-gradient(to bottom, rgba(5,3,2,0.85) 0%, transparent 100%)", pointerEvents: "none" }} />

        {/* Bottom melt into page */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "62%", zIndex: 3, background: `linear-gradient(to bottom, transparent 0%, rgba(9,7,10,0.18) 20%, rgba(9,7,10,0.62) 46%, rgba(9,7,10,0.92) 68%, ${C.bg} 100%)`, pointerEvents: "none" }} />

        {/* ── VERSE — floating in center of image ── */}
        <div style={{ position: "absolute", top: "22%", left: 0, right: 0, zIndex: 10, padding: "0 28px", textAlign: "center", opacity: verseVisible ? 1 : 0, transition: "opacity 0.8s ease-in-out", pointerEvents: "none" }}>
          <div style={{ width: 32, height: 1, margin: "0 auto 18px", background: "linear-gradient(to right, transparent, rgba(201,164,114,0.65), transparent)" }} />
          <div style={{
            fontFamily: "'Scheherazade New', 'Traditional Arabic', 'Noto Naskh Arabic', Georgia, serif",
            fontSize: "clamp(24px, 5.5vw, 34px)",
            fontWeight: 700, color: C.cream, direction: "rtl", lineHeight: 1.75, letterSpacing: 0.5,
            textShadow: "0 1px 2px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.95)",
            marginBottom: 14,
          }}>
            {verse.arabic}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(250,242,226,0.90)", letterSpacing: 0.3, textShadow: "0 1px 4px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.95)", marginBottom: 8 }}>
            {verse.translation}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(201,164,114,0.90)", letterSpacing: 2.5, textShadow: "0 1px 4px rgba(0,0,0,1)" }}>
            {verse.ref.toUpperCase()}
          </div>
          <div style={{ width: 32, height: 1, margin: "18px auto 0", background: "linear-gradient(to right, transparent, rgba(201,164,114,0.65), transparent)" }} />
        </div>

        {/* ── HERO HEADLINE + CTA — in the lower third ── */}
        <div style={{ position: "relative", zIndex: 10, marginTop: "auto", padding: "0 24px 80px", textAlign: "center", maxWidth: 640, margin: "auto auto 0", width: "100%" }}>
          <h1 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(32px, 8vw, 58px)", fontWeight: 800, color: C.text, margin: "0 0 18px", lineHeight: 1.06, letterSpacing: "-0.03em" }}>
            AI Islamic Companion<br />
            <span style={{ color: C.green }}>for Daily Muslim Growth</span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 2.5vw, 17px)", color: "rgba(250,242,226,0.78)", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.78, fontWeight: 400 }}>
            Guided Quran reflections, Azkar, Duas, and AI-powered spiritual journeys designed for modern Muslims seeking peace, purpose, and closeness to Allah.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => void navigate("/register")} className="lp-hero-primary">
              Start Your Journey
            </button>
            <a href="/start-here" className="lp-hero-secondary">
              Where do I start?
            </a>
          </div>
          <p style={{ fontSize: 12, color: "rgba(110,94,76,0.80)", marginTop: 20, letterSpacing: 0.5 }}>
            Free forever · No credit card · Works on any device
          </p>
        </div>
      </header>

      <Divider />

      {/* ══════════════════════════════════════
          EMOTIONAL ENTRY POINTS
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "88px 24px" }}>
        <EyebrowLabel>Where are you today?</EyebrowLabel>
        <SectionH2>Find Peace Through Guided Islamic Wellness</SectionH2>
        <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 44, lineHeight: 1.75, maxWidth: 580, margin: "0 auto 44px" }}>
          Wherever you are on your journey — struggling with anxiety, missing salah, or wanting to reconnect — MyTazki meets you there with compassion and guidance rooted in Quran and Sunnah.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <EntryCard icon={Leaf} title="Find Peace in Islam" subtitle="Calm anxiety through Quran & Dhikr" href="/find-peace-in-islam" />
          <EntryCard icon={HeartHandshake} title="Reconnect With Allah" subtitle="Gentle 7-step return guide" href="/reconnect-with-allah" />
          <EntryCard icon={Building2} title="Start Praying Again" subtitle="No guilt, just a fresh start" href="/start-praying-again" />
          <EntryCard icon={CircleDot} title="Build Islamic Habits" subtitle="Small daily actions, big spiritual growth" href="/build-islamic-habits" />
        </div>
        <p style={{ textAlign: "center", marginTop: 36, fontSize: 14, color: C.muted }}>
          Not sure where to begin?{" "}
          <a href="/start-here" style={{ color: C.green, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
            Take the Start Here path <ArrowRightIcon />
          </a>
        </p>
      </section>

      {/* ══════════════════════════════════════
          ATMOSPHERIC BREAK — second image
      ══════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "110px 24px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", isolation: "isolate" }}>
        <img src="/images/man-making-dua.png" alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0, filter: "contrast(1.10) brightness(0.88) saturate(0.65)" }}
        />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(120,68,18,0.28) 0%, rgba(80,38,6,0.18) 55%, transparent 100%)", mixBlendMode: "multiply", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: `linear-gradient(to bottom, ${C.bg} 0%, rgba(9,7,10,0.55) 30%, rgba(9,7,10,0.55) 70%, ${C.bg} 100%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 3, maxWidth: 580 }}>
          <div style={{ width: 28, height: 1, margin: "0 auto 20px", background: "linear-gradient(to right, transparent, rgba(201,164,114,0.55), transparent)" }} />
          <p style={{ fontFamily: "'Scheherazade New', 'Traditional Arabic', Georgia, serif", fontSize: "clamp(22px,4vw,32px)", color: C.cream, direction: "rtl", marginBottom: 14, lineHeight: 1.65, fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.95)" }}>
            ادْعُونِي أَسْتَجِبْ لَكُمْ
          </p>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(16px,3vw,22px)", fontStyle: "italic", color: "rgba(250,242,226,0.88)", marginBottom: 10, textShadow: "0 1px 4px rgba(0,0,0,1)" }}>
            "Call upon Me; I will respond to you."
          </p>
          <p style={{ fontSize: 11, color: "rgba(201,164,114,0.85)", letterSpacing: 2.5, textTransform: "uppercase", textShadow: "0 1px 4px rgba(0,0,0,1)" }}>Quran 40:60</p>
          <div style={{ width: 28, height: 1, margin: "20px auto 0", background: "linear-gradient(to right, transparent, rgba(201,164,114,0.55), transparent)" }} />
        </div>
      </section>

      {/* ══════════════════════════════════════
          AUTHORITY HUB GRID
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px" }}>
        <EyebrowLabel>Explore All Topics</EyebrowLabel>
        <SectionH2>Build Better Islamic Habits Every Day</SectionH2>
        <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 44, lineHeight: 1.75, maxWidth: 580, margin: "0 auto 44px" }}>
          MyTazki is structured as a complete Islamic growth system — covering mental wellness, salah consistency, daily Quran engagement, and AI-powered spiritual coaching.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <HubCard icon={Brain} title="Mental Wellness" desc="Duas for anxiety, healing sessions, Quran for the overwhelmed mind." href="/mental-wellness" />
          <HubCard icon={Building2} title="Salah" desc="Prayer guides, khushoo tips, Fajr routines, and salah habit building." href="/salah" />
          <HubCard icon={BookOpen} title="Quran Reflections" desc="All 114 surahs with audio, translation, and guided tadabbur reflections." href="/quran-reflections" />
          <HubCard icon={CircleDot} title="Islamic Habits" desc="Gratitude, sleep routines, time management, 30-day challenges." href="/islamic-habits" />
          <HubCard icon={Sparkles} title="AI Islamic Tools" desc="AI companion, AI Quran reflection, AI tafsir and dua generator." href="/ai-islamic-tools" />
          <HubCard icon={Moon} title="Guided Journeys" desc="7-day inner peace, salah reset, tahajjud transformation journeys." href="/7-day-inner-peace-journey" />
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          QURAN SESSIONS PREVIEW
      ══════════════════════════════════════ */}
      <section style={{ background: `linear-gradient(180deg, rgba(22,16,10,0.60) 0%, rgba(9,7,10,0.40) 100%)`, borderTop: `1px solid ${C.bSoft}`, borderBottom: `1px solid ${C.bSoft}`, padding: "88px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(/images/quran-pages.png)`, backgroundSize: "cover", opacity: 0.025, zIndex: 0, pointerEvents: "none" }} />
        <div style={{ maxWidth: 740, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <EyebrowLabel>Quran</EyebrowLabel>
          <SectionH2>Guided Quran Reflections for Modern Muslims</SectionH2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 44, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 44px" }}>
            Read, listen, and reflect on all 114 surahs with Arabic text, English translation, verse-by-verse audio by Sheikh Alafasy, and AI-guided reflection prompts tailored to your spiritual state.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SESSIONS.map(sess => (
              <div key={sess.label} className="lp-session-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: 16, padding: "18px 22px", transition: "all 0.3s ease", boxShadow: "0 6px 24px rgba(0,0,0,0.35)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(52,201,122,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: C.green }}>
                    <Play size={17} fill="currentColor" style={{ marginLeft: 2 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.text }}>{sess.label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.muted, marginTop: 3 }}>{sess.duration}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.8, color: C.green, background: "rgba(52,201,122,0.09)", padding: "4px 10px", borderRadius: 8 }}>{sess.tag}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 36, flexWrap: "wrap", alignItems: "center" }}>
            <a href="/quran" style={{ color: C.green, fontSize: 14, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>Browse all 114 Surahs <ArrowRightIcon /></a>
            <span style={{ color: C.muted, fontSize: 14 }}>·</span>
            <a href="/quran-reflections" style={{ color: C.muted, fontSize: 14, textDecoration: "none" }}>Reflection guides</a>
            <span style={{ color: C.muted, fontSize: 14 }}>·</span>
            <a href="/surah-fatiha-reflection" style={{ color: C.muted, fontSize: 14, textDecoration: "none" }}>Surah Al-Fatiha</a>
            <span style={{ color: C.muted, fontSize: 14 }}>·</span>
            <a href="/surah-mulk-reflection" style={{ color: C.muted, fontSize: 14, textDecoration: "none" }}>Surah Al-Mulk</a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DAILY AZKAR
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "88px 24px" }}>
        <EyebrowLabel>Daily practice</EyebrowLabel>
        <SectionH2>Daily Azkar, Duas &amp; Spiritual Routines</SectionH2>
        <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 44, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 44px" }}>
          Build a consistent morning and evening spiritual routine with 110+ authentic duas from Quran and Hadith, 35+ guided audio Azkar sessions, and a digital Tasbih counter — all offline-ready.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {[
            { icon: Sun, label: "Morning Azkar", sub: "Start every day with barakah", href: "/duas" },
            { icon: Moon, label: "Evening Azkar", sub: "Seal your day with gratitude", href: "/evening-azkar-routine" },
            { icon: BookOpen, label: "Duas Library", sub: "110+ duas for every moment", href: "/duas" },
            { icon: CircleDot, label: "Digital Tasbih", sub: "33/34/33 dhikr tracker", href: "/register" },
            { icon: CloudMoon, label: "Sleep Sessions", sub: "Ayatul Kursi before bed", href: "/register" },
            { icon: Heart, label: "Healing Sessions", sub: "Dua for anxiety & grief", href: "/dua-for-anxiety" },
          ].map(card => {
            const Icon = card.icon;
            return (
              <a key={card.label} href={card.href} className="lp-card" style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 18px", transition: "all 0.3s ease", boxShadow: "0 4px 18px rgba(0,0,0,0.30)" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(52,201,122,0.09)", color: C.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <Icon size={19} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>{card.sub}</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          AI COMPANION DIFFERENTIATOR
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "88px 24px", textAlign: "center" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(201,164,114,0.08)", border: `1px solid ${C.bGold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", color: C.gold }}>
          <Sparkles size={30} strokeWidth={1.5} />
        </div>
        <EyebrowLabel>AI Islamic Companion</EyebrowLabel>
        <SectionH2>AI-Powered Islamic Growth Journeys</SectionH2>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, marginBottom: 20, maxWidth: 540, margin: "0 auto 20px" }}>
          MyTazki AI is the first Islamic companion built with Claude AI and guided by Quranic adab. It provides personalised Islamic growth coaching, emotional wellness support, Quran reflection prompts, and answers grounded in authentic Islamic scholarship — not opinions.
        </p>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 36, maxWidth: 540, margin: "0 auto 36px" }}>
          Unlike generic AI chatbots, MyTazki AI understands Islamic context, observes limits (no fatwa), and guides you with compassion — optimised for <em style={{ color: C.text }}>Muslim growth</em>, not just answers.
        </p>
        {/* Chat demo */}
        <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 20, padding: "24px", textAlign: "left", marginBottom: 32, boxShadow: "0 10px 40px rgba(0,0,0,0.40)" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.07)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, flexShrink: 0, fontSize: 13 }}>U</div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0 14px 14px 14px", padding: "12px 16px", fontSize: 14, color: C.muted, flexGrow: 1, lineHeight: 1.65 }}>
              I feel disconnected from Allah. Where do I start?
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <div style={{ background: `rgba(201,164,114,0.07)`, border: `1px solid ${C.bGold}`, borderRadius: "14px 0 14px 14px", padding: "14px 18px", fontSize: 14, color: C.text, maxWidth: "85%", lineHeight: 1.75 }}>
              That feeling is itself a sign of iman — the heart recognising its distance from its Creator. Begin with two rakaat of voluntary prayer, recite Surah Ad-Duha (93), and say:<br /><br />
              <em style={{ color: C.gold }}>"Rabbi inni limas-sani ad-durru wa-anta arhamur-rahimeen."</em>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(201,164,114,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: C.gold, flexShrink: 0 }}><Sparkles size={15} /></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <a href="/ai-islamic-companion" style={{ color: C.green, fontSize: 14, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>How the AI works <ArrowRightIcon /></a>
          <a href="/ai-quran-reflection" style={{ color: C.muted, fontSize: 14, textDecoration: "none" }}>AI Quran reflections</a>
          <a href="/ai-islamic-tools" style={{ color: C.muted, fontSize: 14, textDecoration: "none" }}>All AI tools</a>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          GUIDED JOURNEYS
      ══════════════════════════════════════ */}
      <section style={{ background: `linear-gradient(180deg, rgba(22,16,10,0.55) 0%, rgba(9,7,10,0.35) 100%)`, borderTop: `1px solid ${C.bSoft}`, borderBottom: `1px solid ${C.bSoft}`, padding: "88px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <EyebrowLabel>Guided Journeys</EyebrowLabel>
          <SectionH2>Start Your Spiritual Journey With MyTazki</SectionH2>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 44, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 44px" }}>
            Structured multi-day Islamic journeys that guide you step by step — no overwhelm, no guilt. Just consistent, compassionate spiritual growth.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <JourneyCard title="7-Day Inner Peace Journey" days="7 days" desc="Rebuild calm and reconnect with Allah through daily Azkar, Quran, and reflection." href="/7-day-inner-peace-journey" />
            <JourneyCard title="Reconnect With Allah Journey" days="Guided path" desc="A compassionate return — step by step, with no judgement and full Quranic support." href="/reconnect-with-allah-journey" />
            <JourneyCard title="7-Day Salah Reset" days="7 days" desc="Rebuild your prayer habit from scratch with gentle daily goals and khushoo tips." href="/7-day-salah-reset" />
            <JourneyCard title="Tahajjud Transformation" days="30 nights" desc="Establish the night prayer habit with gradual rakaat goals and spiritual milestones." href="/tahajjud-transformation-journey" />
          </div>
          <p style={{ textAlign: "center", marginTop: 36, fontSize: 14, color: C.muted }}>
            Also:{" "}
            <a href="/morning-barakah-routine" style={{ color: C.green, textDecoration: "none" }}>Morning Barakah Routine</a>{" · "}
            <a href="/7-day-salah-reset" style={{ color: C.muted, textDecoration: "none" }}>Salah Reset</a>{" · "}
            <a href="/islamic-habits" style={{ color: C.muted, textDecoration: "none" }}>Islamic Habits hub</a>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ISLAMIC WELLNESS
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "88px 24px" }}>
        <EyebrowLabel>Emotional wellness</EyebrowLabel>
        <SectionH2>Find Peace Through Guided Islamic Wellness</SectionH2>
        <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 44, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 44px" }}>
          Islam provides a complete framework for emotional healing — not as a substitute for professional help, but as a spiritual foundation. MyTazki makes that framework accessible, personal, and daily.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          {[
            { icon: Heart,         label: "Dua for Anxiety",    href: "/dua-for-anxiety" },
            { icon: HeartHandshake, label: "Islamic Healing",   href: "/emotional-healing-in-islam" },
            { icon: CloudMoon,     label: "Dua for Grief",      href: "/dua-for-grief" },
            { icon: Sun,           label: "Dua for Sadness",    href: "/dua-for-sadness" },
            { icon: Brain,         label: "Stop Overthinking",  href: "/how-to-stop-overthinking-islam" },
            { icon: Leaf,          label: "Burnout in Islam",   href: "/islamic-cure-for-burnout" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <a key={item.label} href={item.href} className="lp-card" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14, background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px", transition: "all 0.3s ease", boxShadow: "0 4px 18px rgba(0,0,0,0.30)" }}>
                <div style={{ color: C.green, background: "rgba(52,201,122,0.09)", width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.label}</span>
              </a>
            );
          })}
        </div>
        <p style={{ textAlign: "center", marginTop: 36, fontSize: 14, color: C.muted }}>
          <a href="/mental-wellness" style={{ color: C.green, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>Explore the full Mental Wellness hub <ArrowRightIcon /></a>
        </p>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          TRUST + ENTITY
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "88px 24px" }}>
        <EyebrowLabel>Trust &amp; transparency</EyebrowLabel>
        <SectionH2>Islamic Guidance You Can Trust</SectionH2>
        <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 44, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 44px" }}>
          Every dua, reflection, and AI response on MyTazki is grounded in authenticated Islamic sources — Quran, Hadith, and classical scholarship. We are transparent about what AI can and cannot do in an Islamic context.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { label: "About MyTazki",          sub: "Our mission & team",            href: "/about",                     icon: Leaf },
            { label: "Editorial Standards",    sub: "How we verify content",         href: "/editorial-guidelines",      icon: FileText },
            { label: "AI Ethics",              sub: "Our limits & principles",        href: "/ai-ethics",                 icon: Scale },
            { label: "Content Verification",   sub: "6-step review process",         href: "/content-verification",      icon: CheckCircle },
            { label: "Islamic Guidance Policy",sub: "Scholars vs AI, clearly stated", href: "/islamic-guidance-policy",   icon: ScrollText },
            { label: "Our Mission",            sub: "Why we built MyTazki",          href: "/mission",                   icon: Target },
          ].map(card => {
            const Icon = card.icon;
            return (
              <a key={card.label} href={card.href} className="lp-card" style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${C.bGold}`, borderRadius: 16, padding: "18px", transition: "all 0.3s ease", boxShadow: "0 4px 18px rgba(0,0,0,0.28)" }}>
                  <Icon size={20} color={C.muted} style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{card.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{card.sub}</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: 740, margin: "0 auto", padding: "88px 24px" }}>
        <EyebrowLabel>Common questions</EyebrowLabel>
        <SectionH2>People Also Ask</SectionH2>
        <p style={{ textAlign: "center", color: C.muted, fontSize: 15, marginBottom: 44 }}>
          Quick answers about MyTazki, Islamic wellness, and AI-powered spiritual growth.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} style={{ background: `linear-gradient(148deg, ${C.card} 0%, ${C.surface} 100%)`, border: `1px solid ${openFaq === i ? C.bGold : C.border}`, borderRadius: 16, overflow: "hidden", transition: "all 0.3s ease", boxShadow: openFaq === i ? "0 6px 28px rgba(0,0,0,0.40)" : "0 4px 16px rgba(0,0,0,0.28)" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", background: "transparent", border: "none", color: openFaq === i ? C.gold : C.text, textAlign: "left", padding: "20px 22px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", transition: "color 0.2s", gap: 12 }}>
                <span>{faq.q}</span>
                <ChevronDown size={18} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.3s ease", color: C.muted, flexShrink: 0 }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 22px 20px", fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════
          BOTTOM CTA — cinematic
      ══════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", isolation: "isolate", padding: "120px 24px", textAlign: "center" }}>
        <img src="/images/woman-reading-quran.png" alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0, filter: "contrast(1.10) brightness(0.88) saturate(0.65)", opacity: 0.40 }}
        />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(to bottom, ${C.bg} 0%, rgba(9,7,10,0.72) 40%, rgba(9,7,10,0.72) 60%, ${C.bg} 100%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 580, margin: "0 auto" }}>
          <div style={{ width: 32, height: 1, margin: "0 auto 24px", background: "linear-gradient(to right, transparent, rgba(201,164,114,0.55), transparent)" }} />
          <div style={{ fontFamily: "'Scheherazade New', 'Traditional Arabic', serif", fontSize: "clamp(24px,5vw,34px)", color: C.gold, direction: "rtl", marginBottom: 18, lineHeight: 1.65, textShadow: "0 1px 3px rgba(0,0,0,1)" }}>
            وَاذْكُرُوا اللَّهَ كَثِيرًا
          </div>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 44, fontStyle: "italic", letterSpacing: 0.5 }}>
            "And remember Allah often" — Quran 62:10
          </p>
          <h2 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 800, color: C.text, marginBottom: 14, letterSpacing: "-0.025em" }}>
            Begin your growth journey today.
          </h2>
          <p style={{ color: C.muted, fontSize: 15, marginBottom: 44, lineHeight: 1.65 }}>
            Join thousands of Muslims building better spiritual habits with MyTazki — the AI Islamic companion built for daily growth.
          </p>
          <button onClick={() => void navigate("/register")} className="lp-cta-primary">
            Start Your Journey
          </button>
          <p style={{ fontSize: 12, color: "rgba(110,94,76,0.70)", marginTop: 22, letterSpacing: 0.5 }}>Free forever · No ads · No subscription required</p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ borderTop: `1px solid rgba(201,164,114,0.09)`, padding: "60px 24px 36px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 56 }}>
          {/* Brand */}
          <div style={{ gridColumn: "1 / -1", maxWidth: 300, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <svg width="24" height="24" viewBox="0 0 180 180" fill="none">
                <rect width="180" height="180" rx="38" fill="#16100a"/>
                <circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.9"/>
                <circle cx="112" cy="78" r="46" fill="#16100a"/>
                <circle cx="130" cy="58" r="6" fill="#34c97a"/>
              </svg>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 800 }}>
                <span style={{ color: C.green }}>My</span>
                <span style={{ color: C.text }}>Tazki</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>AI Islamic Companion designed for the modern Muslim's daily spiritual growth.</p>
          </div>

          {/* Wellness */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 18, letterSpacing: 1.5, textTransform: "uppercase" }}>Wellness</div>
            {[["Find Peace in Islam","/find-peace-in-islam"],["Dua for Anxiety","/dua-for-anxiety"],["Emotional Healing","/emotional-healing-in-islam"],["Dua for Grief","/dua-for-grief"],["Islamic Mental Health","/islamic-mental-health"],["Stop Overthinking","/how-to-stop-overthinking-islam"]].map(([l, h]) => (
              <a key={l} href={h} className="lp-footer-link" style={{ display: "block", fontSize: 13, color: C.muted, textDecoration: "none", marginBottom: 11 }}>{l}</a>
            ))}
          </div>

          {/* Quran */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 18, letterSpacing: 1.5, textTransform: "uppercase" }}>Quran</div>
            {[["Quran Reader","/quran"],["Quran Reflections","/quran-reflections"],["Surah Al-Fatiha","/surah-fatiha-reflection"],["Surah Al-Mulk","/surah-mulk-reflection"],["Surah Ad-Duha","/surah-duha-reflection"],["Quran for Anxiety","/quran-about-anxiety"]].map(([l, h]) => (
              <a key={l} href={h} className="lp-footer-link" style={{ display: "block", fontSize: 13, color: C.muted, textDecoration: "none", marginBottom: 11 }}>{l}</a>
            ))}
          </div>

          {/* Journeys */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 18, letterSpacing: 1.5, textTransform: "uppercase" }}>Journeys</div>
            {[["Start Here","/start-here"],["7-Day Inner Peace","/7-day-inner-peace-journey"],["Reconnect With Allah","/reconnect-with-allah-journey"],["7-Day Salah Reset","/7-day-salah-reset"],["Tahajjud Journey","/tahajjud-transformation-journey"],["Morning Barakah","/morning-barakah-routine"]].map(([l, h]) => (
              <a key={l} href={h} className="lp-footer-link" style={{ display: "block", fontSize: 13, color: C.muted, textDecoration: "none", marginBottom: 11 }}>{l}</a>
            ))}
          </div>

          {/* Salah & Habits */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 18, letterSpacing: 1.5, textTransform: "uppercase" }}>Salah &amp; Habits</div>
            {[["Salah Guide","/salah"],["Tahajjud Guide","/tahajjud-prayer-guide"],["Fajr Tips","/fajr-prayer-tips"],["Islamic Habits","/islamic-habits"],["30-Day Challenge","/30-day-islamic-challenge"],["Evening Azkar","/evening-azkar-routine"]].map(([l, h]) => (
              <a key={l} href={h} className="lp-footer-link" style={{ display: "block", fontSize: 13, color: C.muted, textDecoration: "none", marginBottom: 11 }}>{l}</a>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 18, letterSpacing: 1.5, textTransform: "uppercase" }}>Company</div>
            {[["About","/about"],["Our Mission","/mission"],["AI Ethics","/ai-ethics"],["Editorial Guidelines","/editorial-guidelines"],["Content Verification","/content-verification"],["Islamic Guidance Policy","/islamic-guidance-policy"]].map(([l, h]) => (
              <a key={l} href={h} className="lp-footer-link" style={{ display: "block", fontSize: 13, color: C.muted, textDecoration: "none", marginBottom: 11 }}>{l}</a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid rgba(201,164,114,0.09)`, paddingTop: 22, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
            © 2026 <a href="/" style={{ color: C.text, textDecoration: "none", fontWeight: 500 }}>MyTazki</a> · AI Islamic Companion
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[["Prayer Times","/prayer-times"],["Duas","/duas"],["Baby Names","/names"],["Zakat","/zakat-calculator"],["Qibla","/qibla"],["Privacy","/privacy"],["Terms","/terms"]].map(([l, h]) => (
              <a key={l} href={h} className="lp-footer-link" style={{ fontSize: 12, color: C.muted, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 640px) { .lp-nav-links { display: flex !important; } }

        .lp-nav-link {
          color: ${C.muted}; text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s;
        }
        .lp-nav-link:hover { color: ${C.text}; }

        .lp-btn-primary {
          background: ${C.green}; border: none; color: #09070A; border-radius: 10px; padding: 10px 20px;
          font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; letter-spacing: -0.01em;
          transition: opacity 0.2s;
        }
        .lp-btn-primary:hover { opacity: 0.9; }

        .lp-btn-ghost {
          background: transparent; border: 1px solid rgba(201,164,114,0.22); color: ${C.muted}; border-radius: 10px;
          padding: 10px 18px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit;
          transition: color 0.2s, border-color 0.2s;
        }
        .lp-btn-ghost:hover { color: ${C.text}; border-color: rgba(201,164,114,0.42); }

        .lp-hero-primary {
          background: ${C.green}; border: none; color: #09070A; border-radius: 16px;
          padding: 17px 38px; font-size: 16px; font-weight: 700; cursor: pointer; font-family: inherit;
          letter-spacing: -0.01em; box-shadow: 0 0 40px rgba(52,201,122,0.35);
          transition: transform 0.2s, box-shadow 0.2s; display: inline-block; text-decoration: none;
        }
        .lp-hero-primary:hover { transform: scale(1.02); box-shadow: 0 0 56px rgba(52,201,122,0.45); }

        .lp-hero-secondary {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.18); color: ${C.text};
          border-radius: 16px; padding: 17px 38px; font-size: 16px; font-weight: 500; text-decoration: none;
          display: inline-flex; align-items: center; backdrop-filter: blur(14px);
          transition: background 0.2s, border-color 0.2s;
        }
        .lp-hero-secondary:hover { background: rgba(201,164,114,0.08); border-color: rgba(201,164,114,0.30); }

        .lp-cta-primary {
          background: ${C.green}; border: none; color: #09070A; border-radius: 16px;
          padding: 19px 56px; font-size: 17px; font-weight: 700; cursor: pointer; font-family: inherit;
          box-shadow: 0 0 40px rgba(52,201,122,0.25); transition: transform 0.2s, box-shadow 0.2s;
        }
        .lp-cta-primary:hover { transform: scale(1.02); box-shadow: 0 0 56px rgba(52,201,122,0.38); }

        .lp-card > div:hover {
          border-color: rgba(201,164,114,0.32) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.50) !important;
        }

        .lp-session-row:hover {
          border-color: rgba(52,201,122,0.26) !important;
          transform: translateX(4px);
        }

        .lp-footer-link:hover { color: ${C.green} !important; }
      `}</style>
    </div>
  );
}
