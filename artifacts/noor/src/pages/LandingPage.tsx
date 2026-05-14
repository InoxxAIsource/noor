import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Leaf, HeartHandshake, Building2, CircleDot, 
  Brain, Moon, BookOpen, Sparkles, Sun, 
  CloudMoon, Heart, FileText, Scale, CheckCircle, 
  ScrollText, Target, Play, ChevronDown, ChevronRight
} from "lucide-react";

const VERSES = [
  { arabic: "اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا", translation: "Remember Allah with much remembrance, Quran 33:41" },
  { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", translation: "And whoever fears Allah, He will make a way out for him, Quran 65:2" },
  { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", translation: "Verily, in the remembrance of Allah hearts find rest, Quran 13:28" },
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
    <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 4, color: s.green, textTransform: "uppercase", marginBottom: 16, marginTop: 0 }}>
      {children}
    </p>
  );
}

function SectionH2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 700, color: s.text, marginBottom: 16, letterSpacing: "-0.02em", textAlign: "center", ...style }}>
      {children}
    </h2>
  );
}

function HubCard({ icon: Icon, title, desc, href }: { icon: React.ElementType; title: string; desc: string; href: string }) {
  return (
    <a href={href} className="premium-card" style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        background: `linear-gradient(145deg, ${s.surface} 0%, rgba(21,32,25,0.4) 100%)`, 
        border: `1px solid ${s.border}`, borderRadius: 16,
        padding: "24px 20px", height: "100%", transition: "all 0.3s ease",
      }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(52,201,122,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: s.green }}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: s.text, marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontSize: 13, color: "#4a6858", lineHeight: 1.65 }}>{desc}</div>
      </div>
    </a>
  );
}

function EntryCard({ icon: Icon, title, subtitle, href }: { icon: React.ElementType; title: string; subtitle: string; href: string }) {
  return (
    <a href={href} className="premium-card" style={{ textDecoration: "none", display: "block", flex: "1 1 160px" }}>
      <div style={{
        background: `linear-gradient(145deg, ${s.card} 0%, ${s.surface} 100%)`, 
        border: `1px solid ${s.border}`, borderRadius: 16,
        padding: "24px 18px", textAlign: "center", transition: "all 0.3s ease",
      }}>
        <div style={{ width: 48, height: 48, margin: "0 auto 12px", borderRadius: "50%", background: "rgba(52,201,122,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: s.green }}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: s.text, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12, color: s.muted, lineHeight: 1.5 }}>{subtitle}</div>
      </div>
    </a>
  );
}

function JourneyCard({ title, days, desc, href }: { title: string; days: string; desc: string; href: string }) {
  return (
    <a href={href} className="premium-card" style={{ textDecoration: "none", display: "block", flex: "1 1 200px" }}>
      <div style={{ 
        background: `linear-gradient(145deg, ${s.surface} 0%, rgba(21,32,25,0.4) 100%)`, 
        border: `1px solid ${s.border}`, borderRadius: 16, padding: "24px", transition: "all 0.3s ease" 
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: s.green, textTransform: "uppercase", marginBottom: 10 }}>{days}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: s.text, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#4a6858", lineHeight: 1.6 }}>{desc}</div>
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

  if (isLoading) { /* render full page below — H1 must be visible on first paint for SEO */ }

  const verse = VERSES[verseIdx]!;

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: s.text, fontFamily: "Inter, DM Sans, system-ui, sans-serif", overflowX: "hidden" }}>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* ── NAV ── */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 24px", borderBottom: `1px solid rgba(52,201,122,0.15)`,
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,20,17,0.85)", backdropFilter: "blur(20px)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.3)"
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
        <div style={{ display: "none", gap: 24, alignItems: "center" }} className="nav-links-desktop">
          <a href="/mental-wellness" className="nav-link">Wellness</a>
          <a href="/quran" className="nav-link">Quran</a>
          <a href="/duas" className="nav-link">Duas</a>
          <a href="/about" className="nav-link">About</a>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => void navigate("/login")} className="nav-btn-outline">
            Sign In
          </button>
          <button onClick={() => void navigate("/register")} className="nav-btn-primary">
            Start Free
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header style={{ 
        textAlign: "center", 
        padding: "120px 24px 80px", 
        minHeight: "100svh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {/* Cinematic Background Image */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(/images/woman-praying-night.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0
        }} />
        {/* Dark Gradient Overlay */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(to bottom, rgba(13,20,17,0.3) 0%, rgba(13,20,17,1) 100%)`,
          zIndex: 1
        }} />
        
        <div style={{ position: "relative", zIndex: 2, maxWidth: 680, width: "100%" }}>
          <div style={{ opacity: verseVisible ? 1 : 0, transition: "opacity 0.8s ease-in-out", marginBottom: 48, minHeight: 80 }}>
            <div style={{ fontFamily: "Amiri, serif", fontSize: 32, color: s.green, direction: "rtl", marginBottom: 12, lineHeight: 1.5, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              {verse.arabic}
            </div>
            <div style={{ fontSize: 13, color: s.text, fontStyle: "italic", letterSpacing: 0.5, opacity: 0.8 }}>
              {verse.translation}
            </div>
          </div>

          {/* PRIMARY H1, semantic SEO anchor */}
          <h1 style={{
            fontFamily: "DM Sans, Inter, sans-serif",
            fontSize: "clamp(40px, 8vw, 68px)",
            fontWeight: 800,
            color: s.text,
            margin: "0 0 24px",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)"
          }}>
            AI Islamic Companion<br />
            <span style={{ color: s.green }}>for Daily Muslim Growth</span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2.5vw, 19px)", color: s.text, opacity: 0.9, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7, fontWeight: 400 }}>
            Guided Quran reflections, Azkar, Duas, and AI-powered spiritual journeys designed for modern Muslims seeking peace, purpose, and closeness to Allah.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => void navigate("/register")} style={{ 
              background: s.green, border: "none", color: s.bg, borderRadius: 16, 
              padding: "18px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", 
              fontFamily: "inherit", letterSpacing: "-0.01em", 
              boxShadow: "0 0 40px rgba(52,201,122,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }} className="hero-primary-btn">
              Start Your Journey
            </button>
            <a href="/start-here" style={{ 
              background: "rgba(52,201,122,0.05)", border: `1px solid rgba(52,201,122,0.3)`, 
              color: s.text, borderRadius: 16, padding: "18px 40px", fontSize: 16, fontWeight: 500,
              textDecoration: "none", display: "inline-flex", alignItems: "center",
              backdropFilter: "blur(10px)", transition: "background 0.2s"
            }} className="hero-secondary-btn">
              Where do I start?
            </a>
          </div>
          <p style={{ fontSize: 13, color: s.text, opacity: 0.5, marginTop: 24, letterSpacing: 0.5 }}>Free forever · No credit card · Works on any device</p>
        </div>
      </header>

      <Divider />

      {/* ── STEP 4, EMOTIONAL ENTRY POINTS ── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <EyebrowLabel>Where are you today?</EyebrowLabel>
        <SectionH2>Find Peace Through Guided Islamic Wellness</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 15, marginBottom: 48, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 48px" }}>
          Wherever you are on your journey, struggling with anxiety, missing salah, or wanting to reconnect, MyTazki meets you there with compassion and guidance rooted in Quran and Sunnah.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <EntryCard icon={Leaf} title="Find Peace in Islam" subtitle="Calm anxiety through Quran & Dhikr" href="/find-peace-in-islam" />
          <EntryCard icon={HeartHandshake} title="Reconnect With Allah" subtitle="Gentle 7-step return guide" href="/reconnect-with-allah" />
          <EntryCard icon={Building2} title="Start Praying Again" subtitle="No guilt, just a fresh start" href="/start-praying-again" />
          <EntryCard icon={CircleDot} title="Build Islamic Habits" subtitle="Small daily actions, big spiritual growth" href="/build-islamic-habits" />
        </div>
        <p style={{ textAlign: "center", marginTop: 40, fontSize: 14, color: "#4a6858" }}>
          Not sure where to begin? <a href="/start-here" style={{ color: s.green, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>Take the Start Here path <ArrowRightIcon /></a>
        </p>
      </section>

      {/* ── ATMOSPHERIC BREAK ── */}
      <section style={{
        position: "relative",
        padding: "100px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(/images/man-making-dua.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: 0
        }} />
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: `linear-gradient(to bottom, ${s.bg} 0%, rgba(13,20,17,0.75) 50%, ${s.bg} 100%)`,
          zIndex: 1
        }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
          <p style={{ fontFamily: "Amiri, serif", fontSize: 34, color: s.gold, marginBottom: 16, lineHeight: 1.4 }}>
            "Call upon Me; I will respond to you."
          </p>
          <p style={{ fontSize: 14, color: s.text, opacity: 0.7, letterSpacing: 2, textTransform: "uppercase" }}>Quran 40:60</p>
        </div>
      </section>

      {/* ── STEP 5, AUTHORITY HUB GRID ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px" }}>
        <EyebrowLabel>Explore All Topics</EyebrowLabel>
        <SectionH2>Build Better Islamic Habits Every Day</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 15, marginBottom: 48, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 48px" }}>
          MyTazki is structured as a complete Islamic growth system, covering mental wellness, salah consistency, daily Quran engagement, and AI-powered spiritual coaching.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          <HubCard icon={Brain} title="Mental Wellness" desc="Duas for anxiety, healing sessions, Quran for the overwhelmed mind." href="/mental-wellness" />
          <HubCard icon={Building2} title="Salah" desc="Prayer guides, khushoo tips, Fajr routines, and salah habit building." href="/salah" />
          <HubCard icon={BookOpen} title="Quran Reflections" desc="All 114 surahs with audio, translation, and guided tadabbur reflections." href="/quran-reflections" />
          <HubCard icon={CircleDot} title="Islamic Habits" desc="Gratitude, sleep routines, time management, 30-day challenges." href="/islamic-habits" />
          <HubCard icon={Sparkles} title="AI Islamic Tools" desc="AI companion, AI Quran reflection, AI tafsir and dua generator." href="/ai-islamic-tools" />
          <HubCard icon={Moon} title="Guided Journeys" desc="7-day inner peace, salah reset, tahajjud transformation journeys." href="/7-day-inner-peace-journey" />
        </div>
      </section>

      <Divider />

      {/* ── STEP 2a, H2: Quran Reflections ── */}
      <section style={{ background: "rgba(21,32,25,0.4)", borderTop: `1px solid ${s.borderSoft}`, borderBottom: `1px solid ${s.borderSoft}`, padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        {/* Subtle texture */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(/images/quran-pages.png)`, backgroundSize: "cover", opacity: 0.03, zIndex: 0
        }} />
        <div style={{ maxWidth: 740, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <EyebrowLabel>Quran</EyebrowLabel>
          <SectionH2>Guided Quran Reflections for Modern Muslims</SectionH2>
          <p style={{ textAlign: "center", color: "#4a6858", fontSize: 15, marginBottom: 48, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 48px" }}>
            Read, listen, and reflect on all 114 surahs with Arabic text, English translation, verse-by-verse audio by Sheikh Alafasy, and AI-guided reflection prompts tailored to your spiritual state.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {SESSIONS.map(s2 => (
              <div key={s2.label} className="session-preview-card" style={{ 
                display: "flex", alignItems: "center", justifyContent: "space-between", 
                background: "rgba(13,20,17,0.85)", border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.green}`,
                borderRadius: 16, padding: "20px 24px", transition: "all 0.3s ease",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(52,201,122,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: s.green }}>
                    <Play size={18} fill="currentColor" style={{ marginLeft: 3 }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: s.text }}>{s2.label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#4a6858", marginTop: 4 }}>{s2.duration}</p>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: s.green, background: "rgba(52,201,122,0.1)", padding: "4px 10px", borderRadius: 8 }}>{s2.tag}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40, flexWrap: "wrap", alignItems: "center" }}>
            <a href="/quran" style={{ color: s.green, fontSize: 14, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>Browse all 114 Surahs <ArrowRightIcon /></a>
            <span style={{ color: s.faint, fontSize: 14 }}>·</span>
            <a href="/quran-reflections" style={{ color: s.muted, fontSize: 14, textDecoration: "none" }}>Reflection guides</a>
            <span style={{ color: s.faint, fontSize: 14 }}>·</span>
            <a href="/surah-fatiha-reflection" style={{ color: s.muted, fontSize: 14, textDecoration: "none" }}>Surah Al-Fatiha</a>
            <span style={{ color: s.faint, fontSize: 14 }}>·</span>
            <a href="/surah-mulk-reflection" style={{ color: s.muted, fontSize: 14, textDecoration: "none" }}>Surah Al-Mulk</a>
          </div>
        </div>
      </section>

      {/* ── STEP 2b, H2: Daily Azkar ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "100px 24px" }}>
        <EyebrowLabel>Daily practice</EyebrowLabel>
        <SectionH2>Daily Azkar, Duas &amp; Spiritual Routines</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 15, marginBottom: 48, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 48px" }}>
          Build a consistent morning and evening spiritual routine with 110+ authentic duas from Quran and Hadith, 35+ guided audio Azkar sessions, and a digital Tasbih counter, all offline-ready.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
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
            <a key={card.label} href={card.href} className="premium-card" style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: `linear-gradient(145deg, ${s.surface} 0%, rgba(21,32,25,0.4) 100%)`, border: `1px solid ${s.border}`, borderRadius: 16, padding: "24px 20px", transition: "all 0.3s ease" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(52,201,122,0.1)", color: s.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: s.text, marginBottom: 6 }}>{card.label}</div>
                <div style={{ fontSize: 13, color: "#4a6858", lineHeight: 1.5 }}>{card.sub}</div>
              </div>
            </a>
          )})}
        </div>
      </section>

      <Divider />

      {/* ── STEP 7, AI COMPANION DIFFERENTIATOR ── */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(52,201,122,0.08)", border: `1px solid rgba(52,201,122,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", color: s.green }}>
          <Sparkles size={32} strokeWidth={1.5} />
        </div>
        <EyebrowLabel>AI Islamic Companion</EyebrowLabel>
        <SectionH2>AI-Powered Islamic Growth Journeys</SectionH2>
        <p style={{ fontSize: 16, color: "#4a6858", lineHeight: 1.8, marginBottom: 24, maxWidth: 560, margin: "0 auto 24px" }}>
          MyTazki AI is the first Islamic companion built with Claude AI and guided by Quranic adab. It provides personalised Islamic growth coaching, emotional wellness support, Quran reflection prompts, and answers grounded in authentic Islamic scholarship, not opinions.
        </p>
        <p style={{ fontSize: 15, color: "#4a6858", lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
          Unlike generic AI chatbots, MyTazki AI understands Islamic context, observes limits (no fatwa), and guides you with compassion, optimised for <em>Muslim growth</em>, not just answers.
        </p>
        {/* Chat demo */}
        <div style={{ background: "rgba(21,32,25,0.6)", border: `1px solid rgba(52,201,122,0.15)`, borderRadius: 20, padding: "28px", textAlign: "left", marginBottom: 36, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(234,244,238,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: s.muted, flexShrink: 0 }}>U</div>
            <div style={{ background: "rgba(234,244,238,0.03)", borderRadius: "0 14px 14px 14px", padding: "14px 18px", fontSize: 14, color: s.muted, flexGrow: 1, border: "1px solid rgba(234,244,238,0.05)" }}>
              I feel disconnected from Allah. Where do I start?
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "flex-end" }}>
            <div style={{ background: "rgba(52,201,122,0.08)", border: "1px solid rgba(52,201,122,0.15)", borderRadius: "14px 0 14px 14px", padding: "16px 20px", fontSize: 14, color: s.text, maxWidth: "85%", lineHeight: 1.7 }}>
              That feeling is itself a sign of iman, the heart recognising its distance from its Creator. Begin with two rakaat of voluntary prayer, recite Surah Ad-Duha (93), and say: <br/><br/><em style={{color: s.green}}>"Rabbi inni limas-sani ad-durru wa-anta arhamur-rahimeen."</em>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(52,201,122,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: s.green, flexShrink: 0 }}><Sparkles size={16} /></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <a href="/ai-islamic-companion" style={{ color: s.green, fontSize: 14, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>How the AI works <ArrowRightIcon /></a>
          <a href="/ai-quran-reflection" style={{ color: s.muted, fontSize: 14, textDecoration: "none" }}>AI Quran reflections</a>
          <a href="/ai-islamic-tools" style={{ color: s.muted, fontSize: 14, textDecoration: "none" }}>All AI tools</a>
        </div>
      </section>

      <Divider />

      {/* ── STEP 6, FEATURED JOURNEYS ── */}
      <section style={{ background: "rgba(21,32,25,0.4)", borderTop: `1px solid ${s.borderSoft}`, borderBottom: `1px solid ${s.borderSoft}`, padding: "100px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <EyebrowLabel>Guided Journeys</EyebrowLabel>
          <SectionH2>Start Your Spiritual Journey With MyTazki</SectionH2>
          <p style={{ textAlign: "center", color: "#4a6858", fontSize: 15, marginBottom: 48, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px" }}>
            Structured multi-day Islamic journeys that guide you step by step, no overwhelm, no guilt. Just consistent, compassionate spiritual growth.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <JourneyCard title="7-Day Inner Peace Journey" days="7 days" desc="Rebuild calm and reconnect with Allah through daily Azkar, Quran, and reflection." href="/7-day-inner-peace-journey" />
            <JourneyCard title="Reconnect With Allah Journey" days="Guided path" desc="A compassionate return, step by step, with no judgement and full Quranic support." href="/reconnect-with-allah-journey" />
            <JourneyCard title="7-Day Salah Reset" days="7 days" desc="Rebuild your prayer habit from scratch with gentle daily goals and khushoo tips." href="/7-day-salah-reset" />
            <JourneyCard title="Tahajjud Transformation" days="30 nights" desc="Establish the night prayer habit with gradual rakaat goals and spiritual milestones." href="/tahajjud-transformation-journey" />
          </div>
          <p style={{ textAlign: "center", marginTop: 40, fontSize: 14, color: "#4a6858" }}>
            Also: <a href="/morning-barakah-routine" style={{ color: s.green, textDecoration: "none" }}>Morning Barakah Routine</a> · <a href="/7-day-salah-reset" style={{ color: s.muted, textDecoration: "none" }}>Salah Reset</a> · <a href="/islamic-habits" style={{ color: s.muted, textDecoration: "none" }}>Islamic Habits hub</a>
          </p>
        </div>
      </section>

      {/* ── STEP 2c, H2: Islamic Wellness ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "100px 24px" }}>
        <EyebrowLabel>Emotional wellness</EyebrowLabel>
        <SectionH2>Find Peace Through Guided Islamic Wellness</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 15, marginBottom: 48, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 48px" }}>
          Islam provides a complete framework for emotional healing, not as a substitute for professional help, but as a spiritual foundation. MyTazki makes that framework accessible, personal, and daily.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { icon: Heart, label: "Dua for Anxiety", href: "/dua-for-anxiety" },
            { icon: HeartHandshake, label: "Islamic Healing", href: "/emotional-healing-in-islam" },
            { icon: CloudMoon, label: "Dua for Grief", href: "/dua-for-grief" },
            { icon: Sun, label: "Dua for Sadness", href: "/dua-for-sadness" },
            { icon: Brain, label: "Stop Overthinking", href: "/how-to-stop-overthinking-islam" },
            { icon: Leaf, label: "Burnout in Islam", href: "/islamic-cure-for-burnout" },
          ].map(item => {
            const Icon = item.icon;
            return (
            <a key={item.label} href={item.href} className="premium-card" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 16, background: s.surface, border: `1px solid ${s.border}`, borderRadius: 16, padding: "20px", transition: "all 0.3s ease" }}>
              <div style={{ color: s.green, background: "rgba(52,201,122,0.1)", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: s.text }}>{item.label}</span>
            </a>
          )})}
        </div>
        <p style={{ textAlign: "center", marginTop: 40, fontSize: 14, color: "#4a6858" }}>
          <a href="/mental-wellness" style={{ color: s.green, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>Explore the full Mental Wellness hub <ArrowRightIcon /></a>
        </p>
      </section>

      <Divider />

      {/* ── STEP 8, TRUST + ENTITY BLOCK ── */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "100px 24px" }}>
        <EyebrowLabel>Trust &amp; transparency</EyebrowLabel>
        <SectionH2>Islamic Guidance You Can Trust</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 15, marginBottom: 48, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 48px" }}>
          Every dua, reflection, and AI response on MyTazki is grounded in authenticated Islamic sources, Quran, Hadith, and classical scholarship. We are transparent about what AI can and cannot do in an Islamic context.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { label: "About MyTazki", sub: "Our mission & team", href: "/about", icon: Leaf },
            { label: "Editorial Standards", sub: "How we verify content", href: "/editorial-guidelines", icon: FileText },
            { label: "AI Ethics", sub: "Our limits & principles", href: "/ai-ethics", icon: Scale },
            { label: "Content Verification", sub: "6-step review process", href: "/content-verification", icon: CheckCircle },
            { label: "Islamic Guidance Policy", sub: "Scholars vs AI, clearly stated", href: "/islamic-guidance-policy", icon: ScrollText },
            { label: "Our Mission", sub: "Why we built MyTazki", href: "/mission", icon: Target },
          ].map(card => {
            const Icon = card.icon;
            return (
            <a key={card.label} href={card.href} className="premium-card" style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 16, padding: "20px", transition: "all 0.3s ease" }}>
                <Icon size={22} color={s.muted} style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: s.text, marginBottom: 4 }}>{card.label}</div>
                <div style={{ fontSize: 12, color: "#4a6858", lineHeight: 1.5 }}>{card.sub}</div>
              </div>
            </a>
          )})}
        </div>
      </section>

      <Divider />

      {/* ── STEP 9, FAQ + GEO ── */}
      <section style={{ maxWidth: 740, margin: "0 auto", padding: "100px 24px" }}>
        <EyebrowLabel>Common questions</EyebrowLabel>
        <SectionH2>People Also Ask</SectionH2>
        <p style={{ textAlign: "center", color: "#4a6858", fontSize: 15, marginBottom: 48 }}>
          Quick answers about MyTazki, Islamic wellness, and AI-powered spiritual growth.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} style={{ 
              background: s.surface, 
              border: `1px solid ${openFaq === i ? "rgba(52,201,122,0.3)" : s.border}`, 
              borderRadius: 16, overflow: "hidden", transition: "all 0.3s ease",
              boxShadow: openFaq === i ? "0 4px 20px rgba(0,0,0,0.2)" : "none"
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", background: "transparent", border: "none", color: openFaq === i ? s.green : s.text, textAlign: "left", padding: "22px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", transition: "color 0.2s" }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={20} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.3s ease", color: s.muted }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 24px 24px", fontSize: 14, color: "#6a9878", lineHeight: 1.8 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── BOTTOM CTA ── */}
      <section style={{ 
        position: "relative",
        background: `linear-gradient(180deg, ${s.bg} 0%, rgba(16,26,21,1) 50%, ${s.bg} 100%)`, 
        borderTop: `1px solid ${s.borderSoft}`, padding: "120px 24px", textAlign: "center",
        overflow: "hidden"
      }}>
        {/* Decorative glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(52,201,122,0.05) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontFamily: "Amiri, serif", fontSize: 36, color: s.green, direction: "rtl", marginBottom: 20, opacity: 0.9 }}>
            وَاذْكُرُوا اللَّهَ كَثِيرًا
          </div>
          <p style={{ fontSize: 14, color: "#4a6858", marginBottom: 48, fontStyle: "italic", letterSpacing: 0.5 }}>
            "And remember Allah often", Quran 62:10
          </p>
          <h2 style={{ fontFamily: "DM Sans, Inter, sans-serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, color: s.text, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Begin your growth journey today.
          </h2>
          <p style={{ color: s.muted, fontSize: 16, marginBottom: 48, lineHeight: 1.6 }}>
            Join thousands of Muslims building better spiritual habits with MyTazki, the AI Islamic companion built for daily growth.
          </p>
          <button onClick={() => void navigate("/register")} style={{ 
            background: s.green, border: "none", color: s.bg, borderRadius: 16, 
            padding: "20px 56px", fontSize: 17, fontWeight: 700, cursor: "pointer", 
            fontFamily: "inherit", boxShadow: "0 0 40px rgba(52,201,122,0.25)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }} className="hero-primary-btn">
            Start Your Journey
          </button>
          <p style={{ fontSize: 13, color: s.faint, marginTop: 24, letterSpacing: 0.5 }}>Free forever · No ads · No subscription required</p>
        </div>
      </section>

      {/* ── STEP 10, SEO FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${s.borderSoft}`, padding: "64px 24px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 64 }}>

          {/* Brand */}
          <div style={{ gridColumn: "1 / -1", maxWidth: 300, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="24" height="24" viewBox="0 0 180 180" fill="none">
                <rect width="180" height="180" rx="38" fill="#152019"/>
                <circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.9"/>
                <circle cx="112" cy="78" r="46" fill="#152019"/>
                <circle cx="130" cy="58" r="6" fill="#34c97a"/>
              </svg>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 800 }}>
                <span style={{ color: s.green }}>My</span>
                <span style={{ color: s.text }}>Tazki</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#4a6858", lineHeight: 1.7 }}>AI Islamic Companion designed for the modern Muslim's daily spiritual growth.</p>
          </div>

          {/* Emotional Wellness */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.text, marginBottom: 20 }}>Wellness</div>
            {[
              ["Find Peace in Islam", "/find-peace-in-islam"],
              ["Dua for Anxiety", "/dua-for-anxiety"],
              ["Emotional Healing", "/emotional-healing-in-islam"],
              ["Dua for Grief", "/dua-for-grief"],
              ["Islamic Mental Health", "/islamic-mental-health"],
              ["Stop Overthinking", "/how-to-stop-overthinking-islam"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="footer-link" style={{ display: "block", fontSize: 13, color: "#4a6858", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}>{label}</a>
            ))}
          </div>

          {/* Quran */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.text, marginBottom: 20 }}>Quran</div>
            {[
              ["Quran Reader", "/quran"],
              ["Quran Reflections", "/quran-reflections"],
              ["Surah Al-Fatiha", "/surah-fatiha-reflection"],
              ["Surah Al-Mulk", "/surah-mulk-reflection"],
              ["Surah Ad-Duha", "/surah-duha-reflection"],
              ["Quran for Anxiety", "/quran-about-anxiety"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="footer-link" style={{ display: "block", fontSize: 13, color: "#4a6858", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}>{label}</a>
            ))}
          </div>

          {/* Journeys */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.text, marginBottom: 20 }}>Journeys</div>
            {[
              ["Start Here", "/start-here"],
              ["7-Day Inner Peace", "/7-day-inner-peace-journey"],
              ["Reconnect With Allah", "/reconnect-with-allah-journey"],
              ["7-Day Salah Reset", "/7-day-salah-reset"],
              ["Tahajjud Journey", "/tahajjud-transformation-journey"],
              ["Morning Barakah", "/morning-barakah-routine"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="footer-link" style={{ display: "block", fontSize: 13, color: "#4a6858", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}>{label}</a>
            ))}
          </div>

          {/* Habits & Salah */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.text, marginBottom: 20 }}>Salah &amp; Habits</div>
            {[
              ["Salah Guide", "/salah"],
              ["Tahajjud Guide", "/tahajjud-prayer-guide"],
              ["Fajr Tips", "/fajr-prayer-tips"],
              ["Islamic Habits", "/islamic-habits"],
              ["30-Day Challenge", "/30-day-islamic-challenge"],
              ["Evening Azkar", "/evening-azkar-routine"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="footer-link" style={{ display: "block", fontSize: 13, color: "#4a6858", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}>{label}</a>
            ))}
          </div>

          {/* Trust / Company */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: s.text, marginBottom: 20 }}>Company</div>
            {[
              ["About", "/about"],
              ["Our Mission", "/mission"],
              ["AI Ethics", "/ai-ethics"],
              ["Editorial Guidelines", "/editorial-guidelines"],
              ["Content Verification", "/content-verification"],
              ["Islamic Guidance Policy", "/islamic-guidance-policy"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="footer-link" style={{ display: "block", fontSize: 13, color: "#4a6858", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}>{label}</a>
            ))}
          </div>

        </div>

        {/* Footer bottom */}
        <div style={{ borderTop: `1px solid ${s.borderSoft}`, paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "#4a6858", margin: 0 }}>
            © 2026 <a href="/" style={{ color: s.text, textDecoration: "none", fontWeight: 500 }}>MyTazki</a> · AI Islamic Companion
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              ["Prayer Times", "/prayer-times"],
              ["Duas", "/duas"],
              ["Baby Names", "/names"],
              ["Zakat", "/zakat-calculator"],
              ["Qibla", "/qibla"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="footer-link" style={{ fontSize: 12, color: "#4a6858", textDecoration: "none", transition: "color 0.2s" }}>{label}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 640px) { .nav-links-desktop { display: flex !important; } }
        
        /* Premium interactive states */
        .premium-card:hover > div {
          border-color: rgba(52,201,122,0.3) !important;
          background: linear-gradient(145deg, #1c2d21 0%, rgba(21,32,25,0.8) 100%) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 0 20px rgba(52,201,122,0.03);
          transform: translateY(-2px);
        }
        
        .session-preview-card:hover {
          background: rgba(28,45,33,0.9) !important;
          border-color: rgba(52,201,122,0.3) !important;
          transform: translateX(4px);
        }
        
        .hero-primary-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 0 50px rgba(52,201,122,0.4) !important;
        }
        
        .hero-secondary-btn:hover {
          background: rgba(52,201,122,0.1) !important;
          border-color: rgba(52,201,122,0.4) !important;
        }
        
        .nav-btn-primary:hover {
          opacity: 0.9;
        }
        
        .nav-btn-outline:hover {
          background: rgba(52,201,122,0.05) !important;
          color: #eaf4ee !important;
        }
        
        .nav-link {
          color: #6a9878;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #eaf4ee;
        }
        
        .footer-link:hover {
          color: #34c97a !important;
        }
      `}</style>
    </div>
  );
}

function ArrowRightIcon() {
  return <ArrowRight size={14} style={{ display: "inline-block", verticalAlign: "middle" }} />;
}
function ArrowRight({ size, style }: { size: number; style?: React.CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
}