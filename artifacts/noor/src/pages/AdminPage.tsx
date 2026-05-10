import { useState, useEffect, useCallback } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const api = (path: string) => `${BASE}${path}`;

interface Session { id: string; title: string; category: string; duration: string; audioUrl?: string }
interface Dua { id?: string; title: string; audioUrl?: string }
interface AllaName { number: number; transliteration: string; arabic: string; audioUrl?: string }
interface BlogPost { slug: string; title: string; wordCount?: number; content_html?: string }
interface Stats { totalUsers: number; totalSessions: number; totalDuas: number; totalNames: number; aiRequestsToday: number; estimatedCostUSD: number }

const TABS = ["Stats", "Sessions", "Duas", "Blog", "Names", "Allah Names", "Waitlist"] as const;
type Tab = typeof TABS[number];

function StatusDot({ ok }: { ok: boolean }) {
  return <span style={{ color: ok ? "#00a550" : "#ff4444", marginRight: 6 }}>{ok ? "🟢" : "🔴"}</span>;
}

function Spinner() {
  return <span style={{ color: "#4a7a4a" }}>Loading…</span>;
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("Stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [allahNames, setAllahNames] = useState<AllaName[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [names, setNames] = useState<unknown[]>([]);
  const [waitlist, setWaitlist] = useState<string[]>([]);
  const [audioInputs, setAudioInputs] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState("");

  const loadStats = useCallback(async () => {
    const r = await fetch(api("/api/admin/stats"));
    if (r.ok) setStats(await r.json() as Stats);
  }, []);

  const loadSessions = useCallback(async () => {
    const r = await fetch(api("/api/sessions"));
    if (r.ok) setSessions(await r.json() as Session[]);
  }, []);

  const loadDuas = useCallback(async () => {
    const r = await fetch(api("/api/duas"));
    if (r.ok) setDuas(await r.json() as Dua[]);
  }, []);

  const loadAllahNames = useCallback(async () => {
    const r = await fetch(api("/api/names-of-allah"));
    if (r.ok) setAllahNames(await r.json() as AllaName[]);
  }, []);

  const loadNames = useCallback(async () => {
    const r = await fetch(api("/api/names"));
    if (r.ok) setNames(await r.json() as unknown[]);
  }, []);

  const loadWaitlist = useCallback(async () => {
    const r = await fetch(api("/api/admin/waitlist"));
    if (r.ok) { const d = await r.json() as { emails: string[] }; setWaitlist(d.emails); }
  }, []);

  const loadBlogPosts = useCallback(async () => {
    setBlogPosts(BLOG_STUB_LIST as BlogPost[]);
  }, []);

  useEffect(() => { void loadStats(); }, [loadStats]);
  useEffect(() => {
    if (tab === "Sessions") void loadSessions();
    if (tab === "Duas") void loadDuas();
    if (tab === "Allah Names") void loadAllahNames();
    if (tab === "Names") void loadNames();
    if (tab === "Waitlist") void loadWaitlist();
  }, [tab, loadSessions, loadDuas, loadAllahNames, loadNames, loadWaitlist]);

  async function saveSessionAudio(id: string) {
    const url = audioInputs[id];
    if (!url) return;
    setGenerating(g => ({ ...g, [id]: true }));
    const r = await fetch(api(`/api/admin/sessions/${id}/audio`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioUrl: url }),
    });
    if (r.ok) {
      setMsg(`✅ Saved audio for session ${id}`);
      await loadSessions();
    } else setMsg("❌ Failed to save");
    setGenerating(g => ({ ...g, [id]: false }));
  }

  async function saveDuaAudio(id: string) {
    const url = audioInputs[`dua_${id}`];
    if (!url) return;
    setGenerating(g => ({ ...g, [`dua_${id}`]: true }));
    const r = await fetch(api(`/api/admin/duas/${encodeURIComponent(id)}/audio`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioUrl: url }),
    });
    if (r.ok) { setMsg(`✅ Saved audio for dua ${id}`); await loadDuas(); }
    else setMsg("❌ Failed");
    setGenerating(g => ({ ...g, [`dua_${id}`]: false }));
  }

  async function generateBlog(slug: string, title: string, category: string) {
    setGenerating(g => ({ ...g, [slug]: true }));
    const r = await fetch(api("/api/admin/blog/generate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title, category, targetKeyword: title }),
    });
    const d = await r.json() as { wordCount?: number };
    if (r.ok) setMsg(`✅ Generated blog "${slug}" (${d.wordCount ?? "?"} words)`);
    else setMsg("❌ Blog generation failed");
    setGenerating(g => ({ ...g, [slug]: false }));
    await loadBlogPosts();
  }

  async function generateNames(gender: string) {
    setGenerating(g => ({ ...g, names_gen: true }));
    const r = await fetch(api("/api/admin/names/generate-batch"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gender, count: 20, categories: ["quranic", "prophet", "sahaba"] }),
    });
    const d = await r.json() as { added?: number; total?: number };
    if (r.ok) setMsg(`✅ Added ${d.added ?? 0} ${gender} names. Total: ${d.total ?? "?"}`);
    else setMsg("❌ Generation failed");
    setGenerating(g => ({ ...g, names_gen: false }));
    await loadNames();
  }

  const css: React.CSSProperties = { background: "#001a00", minHeight: "100vh", padding: "0 0 80px" };
  const card: React.CSSProperties = { background: "#002800", border: "1px solid rgba(0,165,80,0.2)", borderRadius: 10, padding: 16, marginBottom: 12 };
  const input: React.CSSProperties = { background: "#001a00", border: "1px solid rgba(0,165,80,0.3)", color: "#e8f5e8", borderRadius: 6, padding: "6px 10px", width: 280, fontSize: 13 };
  const btn: React.CSSProperties = { background: "#00a550", color: "#001a00", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontWeight: "bold", fontSize: 13, marginLeft: 8 };
  const btnSm: React.CSSProperties = { ...btn, padding: "4px 10px", fontSize: 12, background: "#003800", color: "#00a550", border: "1px solid rgba(0,165,80,0.3)" };

  return (
    <div style={css}>
      <div style={{ background: "#002800", padding: "16px 20px", borderBottom: "1px solid rgba(0,165,80,0.2)", position: "sticky", top: 0, zIndex: 10 }}>
        <h1 style={{ color: "#ffd700", fontFamily: "Cinzel,serif", fontSize: "1.2rem", margin: 0 }}>Noor Admin Panel</h1>
        {msg && <p style={{ color: "#00a550", fontSize: 13, margin: "6px 0 0" }}>{msg}</p>}
      </div>

      <div style={{ display: "flex", gap: 4, padding: "12px 16px", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ ...btnSm, background: tab === t ? "#00a550" : "#002800", color: tab === t ? "#001a00" : "#00a550", whiteSpace: "nowrap" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* STATS */}
        {tab === "Stats" && (
          <div>
            {!stats ? <Spinner /> : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginTop: 12 }}>
                {[
                  ["Total Users", stats.totalUsers],
                  ["Sessions", stats.totalSessions],
                  ["Duas", stats.totalDuas],
                  ["Names", stats.totalNames],
                  ["AI Requests Today", stats.aiRequestsToday],
                  ["Est. Cost (USD)", `$${(stats.estimatedCostUSD ?? 0).toFixed(4)}`],
                ].map(([label, val]) => (
                  <div key={String(label)} style={card}>
                    <p style={{ color: "#4a7a4a", fontSize: 11, margin: "0 0 4px", textTransform: "uppercase" }}>{label}</p>
                    <p style={{ color: "#ffd700", fontSize: "1.5rem", fontFamily: "Cinzel,serif", margin: 0 }}>{val}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => void loadStats()} style={{ ...btn, marginTop: 12 }}>Refresh</button>
          </div>
        )}

        {/* SESSIONS */}
        {tab === "Sessions" && (
          <div>
            {sessions.length === 0 ? <Spinner /> : sessions.map(s => (
              <div key={s.id} style={card}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <StatusDot ok={!!s.audioUrl} />
                    <span style={{ color: "#e8f5e8", fontSize: 14, fontWeight: "bold" }}>{s.title}</span>
                    <span style={{ color: "#4a7a4a", fontSize: 12, marginLeft: 8 }}>{s.category} · {s.duration}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      style={input}
                      placeholder="Paste Cloudinary audio URL…"
                      value={audioInputs[s.id] ?? ""}
                      onChange={e => setAudioInputs(a => ({ ...a, [s.id]: e.target.value }))}
                    />
                    <button onClick={() => void saveSessionAudio(s.id)} disabled={generating[s.id]} style={btn}>
                      {generating[s.id] ? "…" : "Save"}
                    </button>
                  </div>
                </div>
                {s.audioUrl && <p style={{ color: "#4a7a4a", fontSize: 11, margin: "6px 0 0", wordBreak: "break-all" }}>✅ {s.audioUrl}</p>}
              </div>
            ))}
          </div>
        )}

        {/* DUAS */}
        {tab === "Duas" && (
          <div>
            {duas.length === 0 ? <Spinner /> : duas.slice(0, 50).map((d, i) => {
              const key = String(d.id ?? d.title ?? i);
              return (
                <div key={key} style={{ ...card, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <StatusDot ok={!!d.audioUrl} />
                      <span style={{ color: "#e8f5e8", fontSize: 13 }}>{d.title}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        style={{ ...input, width: 220 }}
                        placeholder="Audio URL…"
                        value={audioInputs[`dua_${key}`] ?? ""}
                        onChange={e => setAudioInputs(a => ({ ...a, [`dua_${key}`]: e.target.value }))}
                      />
                      <button onClick={() => void saveDuaAudio(key)} disabled={generating[`dua_${key}`]} style={btnSm}>
                        {generating[`dua_${key}`] ? "…" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {duas.length > 50 && <p style={{ color: "#4a7a4a", fontSize: 13 }}>Showing 50 of {duas.length}</p>}
          </div>
        )}

        {/* BLOG */}
        {tab === "Blog" && (
          <div>
            <p style={{ color: "#4a7a4a", fontSize: 13, marginBottom: 12 }}>40 blog post stubs — generate AI content per post using Claude.</p>
            {BLOG_STUB_LIST.map(b => (
              <div key={b.slug} style={{ ...card, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <StatusDot ok={false} />
                    <span style={{ color: "#e8f5e8", fontSize: 13, fontWeight: "bold" }}>{b.slug}</span>
                    <span style={{ color: "#4a7a4a", fontSize: 12, marginLeft: 8 }}>{b.category}</span>
                  </div>
                  <button
                    onClick={() => void generateBlog(b.slug, b.title, b.category)}
                    disabled={generating[b.slug]}
                    style={btn}
                  >
                    {generating[b.slug] ? "Generating…" : "Generate"}
                  </button>
                </div>
                <p style={{ color: "#4a7a4a", fontSize: 12, margin: "4px 0 0" }}>{b.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* NAMES */}
        {tab === "Names" && (
          <div>
            <div style={card}>
              <p style={{ color: "#ffd700", fontFamily: "Cinzel,serif", margin: "0 0 8px" }}>Name Database</p>
              <p style={{ color: "#e8f5e8", margin: "0 0 12px" }}>{names.length} names loaded</p>
              <div style={{ background: "#001a00", borderRadius: 6, height: 12, marginBottom: 16, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (names.length / 5000) * 100)}%`, height: "100%", background: "#00a550" }} />
              </div>
              <p style={{ color: "#4a7a4a", fontSize: 13, margin: "0 0 12px" }}>{names.length} / 5000 target</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => void generateNames("boy")} disabled={generating["names_gen"]} style={btn}>
                  {generating["names_gen"] ? "…" : "+ 20 Boy Names (AI)"}
                </button>
                <button onClick={() => void generateNames("girl")} disabled={generating["names_gen"]} style={btn}>
                  {generating["names_gen"] ? "…" : "+ 20 Girl Names (AI)"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALLAH NAMES */}
        {tab === "Allah Names" && (
          <div>
            {allahNames.length === 0 ? <Spinner /> : allahNames.map(n => (
              <div key={n.number} style={{ ...card, padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <StatusDot ok={!!n.audioUrl} />
                    <span style={{ color: "#e8f5e8", fontSize: 13 }}>{n.number}. {n.transliteration}</span>
                    <span dir="rtl" lang="ar" style={{ fontFamily: "Amiri,serif", color: "#ffd700", marginLeft: 12, fontSize: "1.1em" }}>{n.arabic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WAITLIST */}
        {tab === "Waitlist" && (
          <div>
            <div style={card}>
              <p style={{ color: "#ffd700", fontFamily: "Cinzel,serif", margin: "0 0 8px" }}>{waitlist.length} on waitlist</p>
              <ul style={{ margin: 0, padding: "0 0 0 16px", color: "#a0c8a0", fontSize: 13 }}>
                {waitlist.map(e => <li key={e}>{e}</li>)}
              </ul>
              {waitlist.length === 0 && <p style={{ color: "#4a7a4a", fontSize: 13 }}>No signups yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline stub list for the admin blog tab
const BLOG_STUB_LIST = [
  { slug: "morning-azkar-guide", title: "Complete Morning Azkar Guide", category: "Dhikr" },
  { slug: "dua-for-anxiety", title: "Dua for Anxiety and Stress", category: "Duas" },
  { slug: "how-to-pray-namaz", title: "How to Pray Namaz", category: "Prayer" },
  { slug: "best-muslim-baby-names-2025", title: "Best Muslim Baby Names 2025", category: "Names" },
  { slug: "quran-surah-fatiha-benefits", title: "Surah Al-Fatiha Benefits", category: "Quran" },
  { slug: "zakat-gold-india-2026", title: "Zakat on Gold India 2026", category: "Zakat" },
  { slug: "wudu-step-by-step", title: "Wudu Step by Step", category: "Prayer" },
  { slug: "dua-for-parents", title: "Dua for Parents", category: "Duas" },
  { slug: "ramadan-preparation-guide", title: "Ramadan 2026 Preparation", category: "Ramadan" },
  { slug: "99-names-of-allah-meanings", title: "99 Names of Allah", category: "Dhikr" },
  { slug: "tahajjud-prayer-guide", title: "Tahajjud Prayer Guide", category: "Prayer" },
  { slug: "dua-after-salah", title: "Duas After Salah", category: "Duas" },
  { slug: "how-to-make-dua", title: "How to Make Dua", category: "Duas" },
  { slug: "quran-surah-yasin-benefits", title: "Surah Yasin Benefits", category: "Quran" },
  { slug: "istikhara-prayer-guide", title: "Salatul Istikhara Guide", category: "Prayer" },
  { slug: "sadqa-jariyah-guide", title: "Sadqa Jariyah Guide", category: "Charity" },
  { slug: "baby-names-quran", title: "Baby Names in the Quran", category: "Names" },
  { slug: "friday-jumma-guide", title: "Friday Jumma Guide", category: "Prayer" },
  { slug: "dua-for-marriage", title: "Dua for Marriage", category: "Duas" },
  { slug: "islamic-calendar-2026-india", title: "Islamic Calendar 2026 India", category: "Calendar" },
  { slug: "quran-surah-kahf-benefits", title: "Surah Al-Kahf Benefits", category: "Quran" },
  { slug: "namaz-times-india", title: "Namaz Times in India", category: "Prayer" },
  { slug: "ayatul-kursi-benefits", title: "Ayatul Kursi Benefits", category: "Quran" },
  { slug: "dua-for-protection", title: "Dua for Protection", category: "Duas" },
  { slug: "muslim-names-meaning-light", title: "Muslim Names Meaning Light", category: "Names" },
  { slug: "how-to-choose-muslim-name", title: "How to Choose a Muslim Name", category: "Names" },
  { slug: "salah-mistakes-to-avoid", title: "10 Common Salah Mistakes", category: "Prayer" },
  { slug: "surah-mulk-benefits", title: "Surah Al-Mulk Benefits", category: "Quran" },
  { slug: "dua-for-rizq", title: "Dua for Rizq (Sustenance)", category: "Duas" },
  { slug: "eid-ul-adha-2026", title: "Eid ul Adha 2026", category: "Events" },
  { slug: "hajj-guide-2026", title: "Hajj 2026 Guide", category: "Events" },
  { slug: "islamic-finance-zakat", title: "Islamic Finance & Zakat", category: "Zakat" },
  { slug: "duas-for-students", title: "Duas for Students", category: "Duas" },
  { slug: "masjid-etiquette", title: "Masjid Etiquette in Islam", category: "Prayer" },
  { slug: "quran-reading-plan", title: "Quran 30-Day Reading Plan", category: "Quran" },
  { slug: "dua-for-sick-person", title: "Dua for Sick Person", category: "Duas" },
  { slug: "islamic-baby-shower", title: "Islamic Baby Shower & Aqiqah", category: "Family" },
  { slug: "prayer-times-ramadan-2026", title: "Prayer Times Ramadan 2026", category: "Ramadan" },
  { slug: "noor-app-guide", title: "Noor App Complete Guide", category: "App" },
  { slug: "surah-ikhlas-falaq-nas", title: "Three Quls Guide", category: "Quran" },
];
