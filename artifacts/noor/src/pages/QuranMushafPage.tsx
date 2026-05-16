import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Languages, List, Play, Pause } from "lucide-react";

interface PageAyah {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  juz: number;
}

interface SurahGroup {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  isSurahStart: boolean;
  juz: number;
  ayahs: PageAyah[];
}

// Standard Medina Mushaf — surah → first page number
export const SURAH_PAGE: Record<number, number> = {
  1:1,2:2,3:50,4:77,5:106,6:128,7:151,8:177,9:187,10:208,
  11:221,12:235,13:249,14:255,15:262,16:267,17:282,18:293,19:305,20:312,
  21:322,22:332,23:342,24:350,25:359,26:367,27:377,28:385,29:396,30:404,
  31:411,32:415,33:418,34:428,35:434,36:440,37:446,38:453,39:458,40:467,
  41:477,42:483,43:489,44:496,45:499,46:502,47:507,48:511,49:515,50:518,
  51:520,52:523,53:526,54:528,55:531,56:534,57:537,58:542,59:545,60:549,
  61:551,62:553,63:554,64:556,65:558,66:560,67:562,68:564,69:566,70:568,
  71:570,72:572,73:574,74:575,75:577,76:578,77:580,78:582,79:583,80:585,
  81:586,82:587,83:588,84:589,85:590,86:591,87:591,88:592,89:593,90:594,
  91:595,92:595,93:596,94:596,95:597,96:597,97:598,98:598,99:599,100:599,
  101:600,102:600,103:601,104:601,105:601,106:602,107:602,108:602,109:603,110:603,
  111:603,112:604,113:604,114:604,
};

const pad = (n: number, len: number) => String(n).padStart(len, "0");
const audioUrl = (s: number, a: number) =>
  `https://everyayah.com/data/Alafasy_128kbps/${pad(s, 3)}${pad(a, 3)}.mp3`;

// SVG circle for verse number ornament — encoded once
const CIRCLE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 26'%3E%3Ccircle cx='13' cy='13' r='11.5' fill='none' stroke='%23b8946a' stroke-width='0.8'/%3E%3C/svg%3E") center/contain no-repeat`;

const QuranMushafPage: React.FC = () => {
  const { page } = useParams<{ page: string }>();
  const navigate = useNavigate();
  const pageNum = Math.min(604, Math.max(1, parseInt(page ?? "1", 10)));

  const [groups, setGroups] = useState<SurahGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(20);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (!audioRef.current) audioRef.current = new Audio();

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setPlayingKey(null);
    audioRef.current!.pause();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    // API returns a flat ayahs array per edition — make two parallel requests
    interface RawAyah {
      number: number;
      text: string;
      numberInSurah: number;
      juz: number;
      surah: { number: number; name: string; englishName: string };
    }

    const fetchEdition = (edition: string) =>
      fetch(`https://api.alquran.cloud/v1/page/${pageNum}/${edition}`, { signal: controller.signal })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(d => (d.data?.ayahs ?? []) as RawAyah[]);

    Promise.all([fetchEdition("quran-uthmani"), fetchEdition("en.asad")])
      .then(([arabicAyahs, transAyahs]) => {
        clearTimeout(timer);

        if (!arabicAyahs.length) { setError(true); setLoading(false); return; }

        // Build a translation lookup by global ayah number
        const transMap = new Map<number, string>();
        transAyahs.forEach(a => {
          transMap.set(a.number, a.text.replace(/<[^>]+>/g, "").replace(/\[\d+\]/g, "").trim());
        });

        // Group Arabic ayahs by surah, preserving page order
        const surahMap = new Map<number, { name: string; englishName: string; ayahs: RawAyah[] }>();
        arabicAyahs.forEach(a => {
          if (!surahMap.has(a.surah.number)) {
            surahMap.set(a.surah.number, { name: a.surah.name, englishName: a.surah.englishName, ayahs: [] });
          }
          surahMap.get(a.surah.number)!.ayahs.push(a);
        });

        // Convert to SurahGroup array in surah-number order
        const built: SurahGroup[] = Array.from(surahMap.entries())
          .sort(([a], [b]) => a - b)
          .map(([snum, s]) => ({
            surahNumber: snum,
            surahName: s.name,
            surahEnglishName: s.englishName,
            isSurahStart: s.ayahs[0].numberInSurah === 1,
            juz: s.ayahs[0].juz,
            ayahs: s.ayahs.map(a => ({
              surahNumber: snum,
              surahName: s.name,
              surahEnglishName: s.englishName,
              ayahNumber: a.numberInSurah,
              arabicText: a.text,
              translation: transMap.get(a.number) ?? "",
              juz: a.juz,
            })),
          }));

        setGroups(built);
        setLoading(false);
        localStorage.setItem("lastMushafPage", String(pageNum));
      })
      .catch(err => {
        clearTimeout(timer);
        if (err.name !== "AbortError") setError(true);
        setLoading(false);
      });

    return () => { clearTimeout(timer); controller.abort(); };
  }, [pageNum]);

  const playFromIndex = (index: number, ayahsList: PageAyah[]) => {
    if (index < 0 || index >= ayahsList.length) {
      setPlayingKey(null);
      return;
    }
    const ayah = ayahsList[index];
    const key = `${ayah.surahNumber}:${ayah.ayahNumber}`;
    const audio = audioRef.current!;

    audio.src = audioUrl(ayah.surahNumber, ayah.ayahNumber);
    audio.load();
    audio.play().catch(() => {});
    setPlayingKey(key);

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Surah ${ayah.surahNumber} — Ayah ${ayah.ayahNumber}`,
        artist: "Sheikh Mishary Alafasy",
        album: "Al-Quran Al-Kareem • MyTazki",
        artwork: [{ src: "/favicon.svg", sizes: "512x512", type: "image/svg+xml" }],
      });
    }

    // Auto-advance to next ayah when this one ends
    audio.onended = () => playFromIndex(index + 1, ayahsList);
  };

  const playAyah = (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    const audio = audioRef.current!;
    if (playingKey === key) {
      audio.pause();
      audio.onended = null;
      setPlayingKey(null);
      return;
    }
    audio.pause();
    audio.onended = null;
    const idx = allAyahs.findIndex(a => a.surahNumber === surahNum && a.ayahNumber === ayahNum);
    playFromIndex(idx, allAyahs);
  };

  const goToPage = (n: number) => {
    if (n < 1 || n > 604) return;
    navigate(`/quran/mushaf/${n}`);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null; touchStartY.current = null;
    if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 55) return;
    // RTL book: swipe right → previous page, swipe left → next page
    if (dx > 0) goToPage(pageNum - 1);
    else goToPage(pageNum + 1);
  };

  // Flat ordered list of all ayahs on this page (for flowing audio)
  const allAyahs = groups.flatMap(g => g.ayahs);

  const firstGroup  = groups[0];
  const juzLabel    = firstGroup ? `Juz ${firstGroup.juz}` : "";
  const surahLabel  = groups.map(g => g.surahEnglishName).join(" · ");
  const lineH       = fontSize > 24 ? 2.7 : 2.4;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1411", display: "flex", flexDirection: "column" }}>

      {/* ── Sticky header ───────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 60,
        background: "rgba(13,20,17,0.97)", backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(184,148,106,0.2)",
        padding: "8px 10px", display: "flex", alignItems: "center", gap: 6,
      }}>
        {/* Back */}
        <button onClick={() => navigate("/quran")} style={{
          background: "transparent", border: "none", color: "#b8946a",
          cursor: "pointer", padding: "4px 2px", display: "flex", flexShrink: 0,
        }}>
          <ChevronLeft size={20} />
        </button>

        {/* Prev page */}
        <button
          onClick={() => goToPage(pageNum - 1)}
          disabled={pageNum <= 1}
          title="Previous page"
          style={{
            background: pageNum > 1 ? "rgba(184,148,106,0.12)" : "transparent",
            border: `1px solid ${pageNum > 1 ? "rgba(184,148,106,0.35)" : "rgba(184,148,106,0.1)"}`,
            borderRadius: 7, width: 32, height: 32, cursor: pageNum > 1 ? "pointer" : "default",
            color: pageNum > 1 ? "#b8946a" : "#3a2a1a", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
          <ChevronRight size={16} />
        </button>

        {/* Center — surah + page info */}
        <div style={{ flex: 1, textAlign: "center", overflow: "hidden" }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#e8ddd0",
            fontFamily: "Inter, sans-serif", whiteSpace: "nowrap",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>{surahLabel || "Al-Quran"}</div>
          <div style={{ fontSize: 10, color: "#7a6a58", fontFamily: "Inter, sans-serif" }}>
            p.{pageNum} / 604{juzLabel ? ` · ${juzLabel}` : ""}
          </div>
        </div>

        {/* Next page */}
        <button
          onClick={() => goToPage(pageNum + 1)}
          disabled={pageNum >= 604}
          title="Next page"
          style={{
            background: pageNum < 604 ? "rgba(184,148,106,0.12)" : "transparent",
            border: `1px solid ${pageNum < 604 ? "rgba(184,148,106,0.35)" : "rgba(184,148,106,0.1)"}`,
            borderRadius: 7, width: 32, height: 32, cursor: pageNum < 604 ? "pointer" : "default",
            color: pageNum < 604 ? "#b8946a" : "#3a2a1a", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
          <ChevronLeft size={16} />
        </button>

        {/* Play all from first ayah */}
        <button
          onClick={() => {
            if (playingKey) {
              audioRef.current!.pause();
              audioRef.current!.onended = null;
              setPlayingKey(null);
            } else {
              playFromIndex(0, allAyahs);
            }
          }}
          disabled={allAyahs.length === 0}
          title={playingKey ? "Stop" : "Play all"}
          style={{
            background: playingKey ? "rgba(52,201,122,0.18)" : "rgba(52,201,122,0.08)",
            border: `1px solid ${playingKey ? "rgba(52,201,122,0.5)" : "rgba(52,201,122,0.22)"}`,
            borderRadius: 7, width: 32, height: 32, cursor: "pointer",
            color: "#34c97a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
          {playingKey ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Translation toggle */}
        <button onClick={() => setShowTranslation(v => !v)} title="Toggle translation" style={{
          background: showTranslation ? "rgba(184,148,106,0.18)" : "rgba(184,148,106,0.06)",
          border: `1px solid ${showTranslation ? "rgba(184,148,106,0.55)" : "rgba(184,148,106,0.2)"}`,
          borderRadius: 7, width: 32, height: 32, cursor: "pointer",
          color: "#b8946a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Languages size={14} />
        </button>

        {/* Font size − */}
        <button onClick={() => setFontSize(s => Math.max(14, s - 2))} style={{
          background: "rgba(184,148,106,0.08)", border: "1px solid rgba(184,148,106,0.2)",
          borderRadius: 7, width: 28, height: 28, cursor: "pointer",
          color: "#b8946a", fontSize: 11, fontFamily: "Inter, sans-serif",
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0,
        }}>A−</button>

        {/* Font size + */}
        <button onClick={() => setFontSize(s => Math.min(32, s + 2))} style={{
          background: "rgba(184,148,106,0.08)", border: "1px solid rgba(184,148,106,0.2)",
          borderRadius: 7, width: 28, height: 28, cursor: "pointer",
          color: "#b8946a", fontSize: 14, fontFamily: "Inter, sans-serif",
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0,
        }}>A+</button>

        {/* Switch to list view */}
        <button
          onClick={() => navigate(`/quran/read/${firstGroup?.surahNumber ?? 1}`)}
          title="Switch to list view"
          style={{
            background: "rgba(52,201,122,0.08)", border: "1px solid rgba(52,201,122,0.22)",
            borderRadius: 7, width: 32, height: 32, cursor: "pointer",
            color: "#34c97a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
          <List size={14} />
        </button>
      </div>

      {/* ── Page area ────────────────────────────────────────────── */}
      <div
        style={{ flex: 1, padding: "14px 10px 96px", display: "flex", flexDirection: "column", alignItems: "center" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >

        {loading && (
          <div style={{ padding: "80px 20px", textAlign: "center" }}>
            <div style={{
              fontFamily: "'Amiri Quran', Amiri, serif",
              fontSize: 32, color: "#b8946a", marginBottom: 14, direction: "rtl",
            }}>
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </div>
            <div style={{ fontSize: 13, color: "#6a7a6f", fontFamily: "Inter, sans-serif" }}>
              Loading page {pageNum}…
            </div>
          </div>
        )}

        {error && (
          <div style={{ padding: "80px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "#7a6a58", fontFamily: "Inter, sans-serif", marginBottom: 16 }}>
              Could not load this page. Check your connection.
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 22px", background: "rgba(184,148,106,0.1)",
                border: "1px solid rgba(184,148,106,0.3)", borderRadius: 10,
                color: "#b8946a", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13,
              }}>Try again</button>
          </div>
        )}

        {!loading && !error && (
          <div style={{
            width: "100%", maxWidth: 480,
            background: "linear-gradient(168deg, #fdfaf2 0%, #f8f2e4 100%)",
            borderRadius: 5,
            boxShadow: "0 4px 32px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(184,148,106,0.18)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Outer decorative border */}
            <div style={{
              position: "absolute", inset: 6,
              border: "0.5px solid rgba(184,148,106,0.45)",
              borderRadius: 2, pointerEvents: "none", zIndex: 1,
            }} />
            {/* Inner decorative border */}
            <div style={{
              position: "absolute", inset: 10,
              border: "0.5px solid rgba(184,148,106,0.2)",
              borderRadius: 1, pointerEvents: "none", zIndex: 1,
            }} />

            {/* Top page number / surah indicator */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "13px 24px 4px",
              fontSize: 10, color: "#8a7a62", fontFamily: "Inter, sans-serif",
              letterSpacing: 0.5,
            }}>
              <span>{groups[groups.length - 1]?.surahEnglishName ?? ""}</span>
              <span style={{ fontFamily: "'Amiri Quran', Amiri, serif", fontSize: 12 }}>﴾ {pageNum} ﴿</span>
              <span>{juzLabel}</span>
            </div>

            {/* Thin gold rule */}
            <div style={{
              height: "0.5px",
              background: "linear-gradient(90deg, transparent, rgba(184,148,106,0.4), transparent)",
              margin: "0 22px 4px",
            }} />

            <div style={{ padding: "4px 22px 18px" }}>
              {groups.map((group) => (
                <div key={group.surahNumber}>

                  {/* ── Surah header banner ──────────────────────── */}
                  {group.isSurahStart && (
                    <div style={{ margin: "14px 0 8px" }}>
                      <div style={{
                        background: "linear-gradient(135deg, #1a4016 0%, #2a6022 50%, #1a4016 100%)",
                        borderRadius: 3, padding: "9px 16px",
                        border: "1px solid rgba(184,148,106,0.55)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)",
                        textAlign: "center", position: "relative",
                      }}>
                        <span style={{ position: "absolute", top: 5, left: 8, color: "rgba(184,148,106,0.55)", fontSize: 9 }}>❧</span>
                        <span style={{ position: "absolute", top: 5, right: 8, color: "rgba(184,148,106,0.55)", fontSize: 9 }}>❧</span>
                        <div style={{
                          fontFamily: "'Amiri Quran', Amiri, serif",
                          fontSize: 18, color: "#f0deb0",
                          direction: "rtl", letterSpacing: 2, lineHeight: 1.7,
                        }}>
                          سُورَةُ {group.surahName}
                        </div>
                        <div style={{
                          fontSize: 10, color: "rgba(240,222,176,0.65)",
                          fontFamily: "Inter, sans-serif", marginTop: 1,
                        }}>
                          {group.surahEnglishName}
                        </div>
                      </div>

                      {/* Bismillah — all surahs except At-Tawbah (9) and Al-Fatihah (1, already has it as ayah 1) */}
                      {group.surahNumber !== 9 && group.surahNumber !== 1 && (
                        <div style={{
                          fontFamily: "'Amiri Quran', Amiri, serif",
                          fontSize: 19, color: "#180e02",
                          textAlign: "center", direction: "rtl",
                          margin: "10px 0 4px", lineHeight: 2.1,
                        }}>
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                        </div>
                      )}

                      <div style={{
                        height: "0.5px",
                        background: "linear-gradient(90deg, transparent, rgba(184,148,106,0.3), transparent)",
                        margin: "7px 0 4px",
                      }} />
                    </div>
                  )}

                  {/* ── Arabic text — continuous justified RTL flow ── */}
                  <div
                    dir="rtl"
                    lang="ar"
                    style={{
                      fontFamily: "'Amiri Quran', Amiri, 'Arabic Typesetting', serif",
                      fontSize: fontSize,
                      lineHeight: lineH,
                      color: "#130b01",
                      textAlign: "justify",
                      wordSpacing: 4,
                    }}
                  >
                    {group.ayahs.map((ayah) => {
                      const key = `${ayah.surahNumber}:${ayah.ayahNumber}`;
                      const isPlaying = playingKey === key;
                      return (
                        <span key={key}>
                          <span
                            onClick={() => playAyah(ayah.surahNumber, ayah.ayahNumber)}
                            title={`Ayah ${ayah.ayahNumber} — tap to play`}
                            style={{
                              background: isPlaying ? "rgba(34,140,64,0.16)" : "transparent",
                              borderRadius: 2, padding: "0 1px",
                              cursor: "pointer", transition: "background 0.25s",
                            }}
                          >
                            {ayah.arabicText}
                          </span>
                          {/* Inline verse-number circle ornament */}
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center", justifyContent: "center",
                            width: 24, height: 24,
                            fontSize: 9, fontFamily: "Inter, sans-serif",
                            color: "#7a4f1e", fontWeight: 700,
                            verticalAlign: "middle", margin: "0 3px",
                            direction: "ltr", background: CIRCLE_BG,
                          }}>
                            {ayah.ayahNumber}
                          </span>
                          {" "}
                        </span>
                      );
                    })}
                  </div>

                  {/* ── Translation (toggled) ───────────────────────── */}
                  {showTranslation && group.ayahs.some(a => a.translation) && (
                    <div style={{
                      marginTop: 14,
                      borderTop: "0.5px solid rgba(184,148,106,0.25)",
                      paddingTop: 12,
                    }}>
                      {group.ayahs.map((ayah) => ayah.translation ? (
                        <div key={ayah.ayahNumber} style={{ marginBottom: 9, display: "flex", gap: 7, alignItems: "flex-start" }}>
                          <span style={{
                            fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700,
                            color: "#b8946a", flexShrink: 0, marginTop: 3, minWidth: 18,
                          }}>{ayah.ayahNumber}.</span>
                          <p style={{
                            margin: 0, fontFamily: "Inter, sans-serif",
                            fontSize: 12, lineHeight: 1.7, color: "#3a2a14",
                          }}>
                            {ayah.translation}
                          </p>
                        </div>
                      ) : null)}
                    </div>
                  )}

                  <div style={{ height: 6 }} />
                </div>
              ))}
            </div>

            {/* Bottom rule + page number */}
            <div style={{
              height: "0.5px",
              background: "linear-gradient(90deg, transparent, rgba(184,148,106,0.35), transparent)",
              margin: "0 22px",
            }} />
            <div style={{
              textAlign: "center", padding: "8px 0 14px",
              fontSize: 11, color: "#8a7a62", fontFamily: "Inter, sans-serif", letterSpacing: 1,
            }}>
              ─── {pageNum} ───
            </div>
          </div>
        )}
      </div>

      {/* ── Fixed bottom nav ─────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 60,
        background: "rgba(13,20,17,0.98)", backdropFilter: "blur(16px)",
        borderTop: "0.5px solid rgba(184,148,106,0.2)",
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <button
          onClick={() => goToPage(pageNum - 1)} disabled={pageNum <= 1}
          style={{
            flex: 1, padding: "11px 0", borderRadius: 10,
            background: pageNum > 1 ? "rgba(184,148,106,0.1)" : "transparent",
            border: `1px solid ${pageNum > 1 ? "rgba(184,148,106,0.3)" : "rgba(184,148,106,0.08)"}`,
            color: pageNum > 1 ? "#b8946a" : "#3a2a1a",
            cursor: pageNum > 1 ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 600,
          }}>
          <ChevronRight size={14} /> Prev
        </button>

        <div style={{ textAlign: "center", minWidth: 56 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e8ddd0", fontFamily: "Inter, sans-serif", lineHeight: 1.2 }}>
            {pageNum}
          </div>
          <div style={{ fontSize: 10, color: "#7a6a58", fontFamily: "Inter, sans-serif" }}>/ 604</div>
        </div>

        <button
          onClick={() => goToPage(pageNum + 1)} disabled={pageNum >= 604}
          style={{
            flex: 1, padding: "11px 0", borderRadius: 10,
            background: pageNum < 604 ? "rgba(184,148,106,0.12)" : "transparent",
            border: `1px solid ${pageNum < 604 ? "rgba(184,148,106,0.35)" : "rgba(184,148,106,0.08)"}`,
            color: pageNum < 604 ? "#b8946a" : "#3a2a1a",
            cursor: pageNum < 604 ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 600,
          }}>
          Next <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  );
};

export default QuranMushafPage;
