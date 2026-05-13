import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetSessions } from "@workspace/api-client-react";
import { Play, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Azkar", "Quran", "Dhikr", "Sleep", "Duas", "Salah"];

const CATEGORY_ICONS: Record<string, string> = {
  Azkar: "📿", Quran: "📖", Dhikr: "🤲",
  Sleep: "🌙", Duas: "🌿", Salah: "🕌", All: "✨",
};

interface Pathway {
  id: string;
  emoji: string;
  title: string;
  description: string;
  categories: string[];
  accent: string;
  border: string;
  steps: string[];
}

const PATHWAYS: Pathway[] = [
  {
    id: "anxiety",
    emoji: "🌊",
    title: "Calm Anxiety",
    description: "Still a restless heart with gentle duas and dhikr",
    categories: ["duas", "dhikr", "sleep"],
    accent: "rgba(52,201,122,0.1)",
    border: "rgba(52,201,122,0.25)",
    steps: ["Dua", "Breathing Dhikr", "Peaceful Sleep"],
  },
  {
    id: "morning",
    emoji: "🌅",
    title: "Morning Grounding",
    description: "Begin the day in remembrance and clear intention",
    categories: ["azkar", "quran", "dhikr"],
    accent: "rgba(184,148,106,0.1)",
    border: "rgba(184,148,106,0.3)",
    steps: ["Morning Azkar", "Quran Reflection", "Dhikr"],
  },
  {
    id: "peace",
    emoji: "🌿",
    title: "Find Peace",
    description: "Quran reflections for a quiet, settled heart",
    categories: ["quran", "dhikr", "duas"],
    accent: "rgba(52,201,122,0.07)",
    border: "rgba(52,201,122,0.18)",
    steps: ["Quran", "Dhikr", "Dua"],
  },
  {
    id: "reconnect",
    emoji: "💚",
    title: "Reconnect with Allah",
    description: "Return to salah, presence, and sincere tawbah",
    categories: ["salah", "quran", "azkar"],
    accent: "rgba(184,148,106,0.08)",
    border: "rgba(184,148,106,0.2)",
    steps: ["Salah Guide", "Quran", "Evening Azkar"],
  },
  {
    id: "evening",
    emoji: "🌙",
    title: "Evening Wind-down",
    description: "Close the day with calm, gratitude, and peace",
    categories: ["sleep", "dhikr", "duas"],
    accent: "rgba(80,90,160,0.1)",
    border: "rgba(100,110,200,0.2)",
    steps: ["Sleep Reflection", "Night Dhikr", "Closing Dua"],
  },
  {
    id: "gratitude",
    emoji: "✨",
    title: "Gratitude Practice",
    description: "Open your heart to what Allah has given you",
    categories: ["azkar", "duas", "quran"],
    accent: "rgba(184,148,106,0.1)",
    border: "rgba(184,148,106,0.22)",
    steps: ["Azkar", "Gratitude Dua", "Quran"],
  },
];

function matchesCategory(sessionCategory: string, filter: string): boolean {
  if (filter === "All") return true;
  return sessionCategory.toLowerCase().includes(filter.toLowerCase());
}

const SessionsPage: React.FC = () => {
  const { data: sessions, isLoading } = useGetSessions();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [madhab, setMadhab] = useState("all");
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);

  const allSessions = (sessions as Array<Record<string, unknown>> | undefined) ?? [];

  // Find first real session matching a category (case-insensitive)
  function firstSessionForCategory(cat: string): string | null {
    const match = allSessions.find(
      s => (s["category"] as string)?.toLowerCase() === cat.toLowerCase()
    );
    return match ? (match["id"] as string) : null;
  }

  // Start a pathway — navigate to first available session
  function startPathway(pathway: Pathway) {
    for (const cat of pathway.categories) {
      const id = firstSessionForCategory(cat);
      if (id) { void navigate(`/player/${id}`); return; }
    }
  }

  // Expanded pathway session list
  function pathwaySessions(pathway: Pathway): Array<Record<string, unknown>> {
    const seen = new Set<string>();
    const result: Array<Record<string, unknown>> = [];
    for (const cat of pathway.categories) {
      const matches = allSessions.filter(
        s => (s["category"] as string)?.toLowerCase() === cat.toLowerCase() && !seen.has(s["id"] as string)
      ).slice(0, 2);
      for (const m of matches) { seen.add(m["id"] as string); result.push(m); }
    }
    return result.slice(0, 4);
  }

  const filtered = allSessions.filter((s) => {
    const catMatch = matchesCategory(s["category"] as string, activeCategory);
    const madhabMatch =
      madhab === "all" || !s["madhab"] || s["madhab"] === "both" || s["madhab"] === madhab;
    return catMatch && madhabMatch;
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px 16px 16px",
        borderBottom: "1px solid rgba(52,201,122,0.1)",
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontFamily: "DM Sans, sans-serif", fontWeight: 700, color: "var(--gold)", margin: 0 }}>
            Sessions
          </h1>
          <p style={{ fontSize: 11, color: "var(--muted)", margin: 0 }}>
            {allSessions.length} guided experiences
          </p>
        </div>
      </div>

      {/* ── Emotional Pathways ── */}
      {!isLoading && (
        <div style={{ padding: "20px 16px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2 }}>
              Begin a journey
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>guided paths</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PATHWAYS.map(pathway => {
              const isExpanded = expandedPathway === pathway.id;
              const pSessions = isExpanded ? pathwaySessions(pathway) : [];

              return (
                <div key={pathway.id} style={{
                  background: pathway.accent,
                  border: `1px solid ${pathway.border}`,
                  borderRadius: 18, overflow: "hidden",
                  transition: "all 0.2s ease",
                }}>
                  {/* Pathway header */}
                  <div
                    style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
                    onClick={() => setExpandedPathway(isExpanded ? null : pathway.id)}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                      background: "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22,
                    }}>
                      {pathway.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif", marginBottom: 2 }}>
                        {pathway.title}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                        {pathway.description}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      color="var(--muted)"
                      style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
                    />
                  </div>

                  {/* Step pills */}
                  {!isExpanded && (
                    <div style={{ paddingLeft: 72, paddingBottom: 12, paddingRight: 16, display: "flex", gap: 6 }}>
                      {pathway.steps.map((step, i) => (
                        <React.Fragment key={step}>
                          <span style={{
                            fontSize: 10, color: "var(--muted)",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 20, padding: "2px 8px",
                          }}>
                            {step}
                          </span>
                          {i < pathway.steps.length - 1 && (
                            <ArrowRight size={10} color="var(--muted)" style={{ margin: "auto 0", flexShrink: 0 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Expanded session list */}
                  {isExpanded && (
                    <div style={{ padding: "0 16px 16px" }}>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginBottom: 12 }} />
                      {pSessions.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {pSessions.map((s, idx) => (
                            <div
                              key={s["id"] as string}
                              onClick={() => void navigate(`/player/${s["id"]}`)}
                              style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: 12, padding: "12px 14px",
                                cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                              }}
                            >
                              <div style={{
                                width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                                background: "var(--green)", color: "#0d1411",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10, fontWeight: 700,
                              }}>
                                {idx + 1}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
                                  {s["title"] as string}
                                </div>
                                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                                  {Math.ceil((s["durationSeconds"] as number) / 60)} min · {s["category"] as string}
                                </div>
                              </div>
                              <Play size={14} color="var(--green)" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>Sessions coming soon</p>
                      )}
                      <button
                        onClick={() => startPathway(pathway)}
                        style={{
                          marginTop: 12, width: "100%",
                          background: "var(--green)", color: "#0d1411",
                          border: "none", borderRadius: 12, padding: "12px",
                          fontSize: 13, fontWeight: 700, cursor: "pointer",
                          fontFamily: "DM Sans, sans-serif",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                      >
                        Begin this journey <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Browse all sessions ── */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>
          Browse all sessions
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 4 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                whiteSpace: "nowrap", padding: "8px 14px",
                borderRadius: 20, fontSize: 13, fontWeight: 500,
                border: activeCategory === cat ? "1px solid var(--green)" : "1px solid rgba(52,201,122,0.15)",
                background: activeCategory === cat ? "var(--green)" : "var(--surface)",
                color: activeCategory === cat ? "#0d1411" : "var(--muted)",
                cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
              }}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Madhab filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["all", "sunni", "shia"].map((m) => (
            <button
              key={m}
              onClick={() => setMadhab(m)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 11,
                border: madhab === m ? "1px solid var(--gold)" : "1px solid rgba(184,148,106,0.2)",
                background: madhab === m ? "rgba(184,148,106,0.15)" : "transparent",
                color: madhab === m ? "var(--gold)" : "var(--muted)",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {m === "all" ? "All Traditions" : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Session grid */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40, color: "var(--muted)", fontSize: 13 }}>
          Loading sessions…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🌙</p>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>No sessions found for this filter.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px" }}>
          {filtered.map((session) => {
            const hasAudio = !!(session["audioUrl"] as string);
            const mins = Math.ceil((session["durationSeconds"] as number) / 60);
            return (
              <Link
                key={session["id"] as string}
                to={`/player/${session["id"]}`}
                style={{
                  background: "var(--surface)",
                  border: "1px solid rgba(52,201,122,0.1)",
                  borderRadius: 18, padding: "14px 12px",
                  textDecoration: "none", color: "inherit",
                  display: "block", transition: "border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{
                    fontSize: 9, textTransform: "uppercase", letterSpacing: 1,
                    color: "var(--green)", background: "rgba(52,201,122,0.1)",
                    padding: "2px 8px", borderRadius: 20,
                  }}>
                    {session["category"] as string}
                  </span>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 4, fontSize: 9,
                    color: hasAudio ? "var(--green)" : "var(--muted)",
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: hasAudio ? "var(--green)" : "var(--muted)", display: "inline-block" }} />
                    {hasAudio ? "Audio" : "Read"}
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {session["title"] as string}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{mins} min</span>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(52,201,122,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Play size={11} color="var(--green)" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
