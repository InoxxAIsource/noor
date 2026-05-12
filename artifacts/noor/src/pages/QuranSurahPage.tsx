import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Pause, Bookmark, ChevronRight } from "lucide-react";

interface Word {
  id: number;
  position: number;
  char_type_name: string;
  text_uthmani: string;
  translation?: { text: string };
  transliteration?: { text: string };
}

interface Verse {
  id: number;
  verse_number: number;
  text_uthmani: string;
  translations: Array<{ text: string }>;
  words?: Word[];
}

interface WordTooltip {
  wordId: number;
  translation: string;
  transliteration: string;
  x: number;
  y: number;
}

const SURAH_NAMES: Record<number, string> = {
  1:"Al-Fatihah",2:"Al-Baqarah",3:"Ali 'Imran",4:"An-Nisa",5:"Al-Ma'idah",
  6:"Al-An'am",7:"Al-A'raf",8:"Al-Anfal",9:"At-Tawbah",10:"Yunus",
  11:"Hud",12:"Yusuf",13:"Ar-Ra'd",14:"Ibrahim",15:"Al-Hijr",
  16:"An-Nahl",17:"Al-Isra",18:"Al-Kahf",19:"Maryam",20:"Ta-Ha",
  21:"Al-Anbiya",22:"Al-Hajj",23:"Al-Mu'minun",24:"An-Nur",25:"Al-Furqan",
  26:"Ash-Shu'ara",27:"An-Naml",28:"Al-Qasas",29:"Al-'Ankabut",30:"Ar-Rum",
  31:"Luqman",32:"As-Sajdah",33:"Al-Ahzab",34:"Saba",35:"Fatir",
  36:"Ya-Sin",37:"As-Saffat",38:"Sad",39:"Az-Zumar",40:"Ghafir",
  41:"Fussilat",42:"Ash-Shura",43:"Az-Zukhruf",44:"Ad-Dukhan",45:"Al-Jathiyah",
  46:"Al-Ahqaf",47:"Muhammad",48:"Al-Fath",49:"Al-Hujurat",50:"Qaf",
  51:"Adh-Dhariyat",52:"At-Tur",53:"An-Najm",54:"Al-Qamar",55:"Ar-Rahman",
  56:"Al-Waqi'ah",57:"Al-Hadid",58:"Al-Mujadila",59:"Al-Hashr",60:"Al-Mumtahanah",
  61:"As-Saf",62:"Al-Jumu'ah",63:"Al-Munafiqun",64:"At-Taghabun",65:"At-Talaq",
  66:"At-Tahrim",67:"Al-Mulk",68:"Al-Qalam",69:"Al-Haqqah",70:"Al-Ma'arij",
  71:"Nuh",72:"Al-Jinn",73:"Al-Muzzammil",74:"Al-Muddaththir",75:"Al-Qiyamah",
  76:"Al-Insan",77:"Al-Mursalat",78:"An-Naba",79:"An-Nazi'at",80:"'Abasa",
  81:"At-Takwir",82:"Al-Infitar",83:"Al-Mutaffifin",84:"Al-Inshiqaq",85:"Al-Buruj",
  86:"At-Tariq",87:"Al-A'la",88:"Al-Ghashiyah",89:"Al-Fajr",90:"Al-Balad",
  91:"Ash-Shams",92:"Al-Layl",93:"Ad-Duha",94:"Ash-Sharh",95:"At-Tin",
  96:"Al-'Alaq",97:"Al-Qadr",98:"Al-Bayyinah",99:"Az-Zalzalah",100:"Al-'Adiyat",
  101:"Al-Qari'ah",102:"At-Takathur",103:"Al-'Asr",104:"Al-Humazah",105:"Al-Fil",
  106:"Quraysh",107:"Al-Ma'un",108:"Al-Kawthar",109:"Al-Kafirun",110:"An-Nasr",
  111:"Al-Masad",112:"Al-Ikhlas",113:"Al-Falaq",114:"An-Nas",
};

const pad = (n: number, len: number) => String(n).padStart(len, "0");

const QuranSurahPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const num = parseInt(number ?? "1", 10);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(`bookmarks:${num}`);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch { return new Set(); }
  });
  const [ayahsRead, setAyahsRead] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(`ayahsRead:${num}`);
      return new Set(saved ? JSON.parse(saved) : []);
    } catch { return new Set(); }
  });
  const [tooltip, setTooltip] = useState<WordTooltip | null>(null);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    localStorage.setItem("lastSurah", String(num));
    setLoading(true);
    setError(false);
    fetch(
      `https://api.qurancdn.com/api/qdc/verses/by_chapter/${num}?words=true&translation_fields=text&per_page=300&translations=131`
    )
      .then((r) => r.json())
      .then((data) => {
        setVerses(data.verses ?? []);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [num]);

  const markAyahRead = useCallback((ayahNum: number) => {
    setAyahsRead((prev) => {
      if (prev.has(ayahNum)) return prev;
      const next = new Set(prev);
      next.add(ayahNum);
      localStorage.setItem(`ayahsRead:${num}`, JSON.stringify([...next]));
      localStorage.setItem(`lastAyah:${num}`, String(ayahNum));
      return next;
    });
  }, [num]);

  useEffect(() => {
    if (verses.length === 0) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ayahNum = parseInt((entry.target as HTMLElement).dataset["ayah"] ?? "0", 10);
            if (ayahNum) markAyahRead(ayahNum);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-ayah]").forEach((el) => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [verses, markAyahRead]);

  const playAyah = (ayahNum: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playingAyah === ayahNum) {
      setPlayingAyah(null);
      return;
    }
    const url = `https://everyayah.com/data/Alafasy_128kbps/${pad(num, 3)}${pad(ayahNum, 3)}.mp3`;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => {});
    audio.onended = () => setPlayingAyah(null);
    setPlayingAyah(ayahNum);
  };

  const toggleBookmark = (ayahNum: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(ayahNum)) next.delete(ayahNum);
      else next.add(ayahNum);
      localStorage.setItem(`bookmarks:${num}`, JSON.stringify([...next]));
      return next;
    });
  };

  const handleWordTap = (e: React.MouseEvent, word: Word) => {
    e.stopPropagation();
    if (!word.translation?.text && !word.transliteration?.text) return;
    if (tooltip?.wordId === word.id) {
      setTooltip(null);
      return;
    }
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      wordId: word.id,
      translation: word.translation?.text ?? "",
      transliteration: word.transliteration?.text ?? "",
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const progressPct = verses.length > 0
    ? Math.round((ayahsRead.size / verses.length) * 100)
    : 0;

  const surahName = SURAH_NAMES[num] ?? `Surah ${num}`;

  return (
    <div
      style={{ minHeight: "100vh", background: "#0d1411", color: "#eaf4ee", paddingBottom: 80, display: "flex", flexDirection: "column" }}
      onClick={() => { setTooltip(null); setActiveAyah(null); }}
    >
      {/* ── Sticky header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(13,20,17,0.97)", backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(52,201,122,0.15)",
        padding: "14px 16px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <button
            onClick={() => navigate("/quran")}
            style={{ background: "transparent", border: "none", color: "#6a9878", cursor: "pointer", padding: 4, display: "flex" }}
          >
            <ChevronLeft size={22} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#eaf4ee" }}>{surahName}</div>
            <div style={{ fontSize: 11, color: "#6a9878", marginTop: 1 }}>
              Surah {num} · {verses.length} ayahs · {ayahsRead.size} read
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => num > 1 && navigate(`/quran/read/${num - 1}`)}
              disabled={num <= 1}
              style={{ background: "rgba(52,201,122,0.08)", border: "1px solid rgba(52,201,122,0.2)", borderRadius: 8, padding: "5px 10px", color: num > 1 ? "#34c97a" : "#2a3830", cursor: num > 1 ? "pointer" : "default", fontSize: 12 }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => num < 114 && navigate(`/quran/read/${num + 1}`)}
              disabled={num >= 114}
              style={{ background: "rgba(52,201,122,0.08)", border: "1px solid rgba(52,201,122,0.2)", borderRadius: 8, padding: "5px 10px", color: num < 114 ? "#34c97a" : "#2a3830", cursor: num < 114 ? "pointer" : "default", fontSize: 12 }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {verses.length > 0 && (
          <div style={{ height: 3, background: "#1c2d21", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "#34c97a", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        )}
      </div>

      {/* ── Word tooltip ── */}
      {tooltip && (
        <div
          style={{
            position: "fixed", zIndex: 50,
            left: Math.min(Math.max(tooltip.x - 110, 8), (typeof window !== "undefined" ? window.innerWidth : 400) - 228),
            top: Math.max(tooltip.y - 92, 8),
            background: "#1c2d21", border: "1px solid rgba(52,201,122,0.35)",
            borderRadius: 12, padding: "10px 14px", maxWidth: 220, textAlign: "center",
            pointerEvents: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {tooltip.transliteration && (
            <div style={{ color: "#34c97a", fontSize: 11, fontStyle: "italic", marginBottom: 4 }}>{tooltip.transliteration}</div>
          )}
          {tooltip.translation && (
            <div style={{ color: "#eaf4ee", fontSize: 13, fontWeight: 600 }}>{tooltip.translation}</div>
          )}
          <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 11, height: 11, background: "#1c2d21", borderRight: "1px solid rgba(52,201,122,0.35)", borderBottom: "1px solid rgba(52,201,122,0.35)" }} />
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#6a9878" }}>
            <div style={{ fontFamily: "Amiri, serif", fontSize: 36, color: "#b8946a", marginBottom: 16 }}>بِسْمِ ٱللَّهِ</div>
            <div style={{ fontSize: 14 }}>Loading {surahName}…</div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#6a9878", fontSize: 14 }}>
            Could not load surah. Check your connection and try again.
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Bismillah */}
            {num !== 9 && (
              <div style={{ textAlign: "center", padding: "28px 20px 8px" }}>
                <div style={{ fontFamily: "Amiri, serif", fontSize: 30, color: "#b8946a", lineHeight: 1.8 }} dir="rtl">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </div>
                <div style={{ width: 60, height: 1, background: "rgba(184,148,106,0.3)", margin: "14px auto 0" }} />
              </div>
            )}

            {/* ── Flowing Arabic block ── */}
            <div style={{ padding: "20px 20px 8px", direction: "rtl" }}>
              <p
                style={{
                  fontFamily: "Amiri, serif",
                  fontSize: 28,
                  lineHeight: 2.4,
                  color: "#eaf4ee",
                  textAlign: "right",
                  wordSpacing: 4,
                  margin: 0,
                }}
                dir="rtl"
                lang="ar"
              >
                {verses.map((v) => {
                  const words = v.words?.filter((w) => w.char_type_name === "word") ?? [];
                  const hasWords = words.length > 0;
                  return (
                    <span key={v.id}>
                      {hasWords
                        ? words.map((word) => (
                            <span
                              key={word.id}
                              onClick={(e) => handleWordTap(e, word)}
                              style={{
                                cursor: word.translation?.text ? "pointer" : "default",
                                padding: "0 2px",
                                borderRadius: 4,
                                background: tooltip?.wordId === word.id ? "rgba(52,201,122,0.2)" : "transparent",
                                color: activeAyah === v.verse_number ? "#34c97a" : "#eaf4ee",
                                transition: "color 0.2s",
                              }}
                              title={word.translation?.text}
                            >
                              {word.text_uthmani}
                            </span>
                          ))
                        : <span style={{ color: activeAyah === v.verse_number ? "#34c97a" : "#eaf4ee" }}>{v.text_uthmani}</span>
                      }
                      {/* Inline verse number marker */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: ayahsRead.has(v.verse_number) ? "rgba(52,201,122,0.25)" : "rgba(184,148,106,0.15)",
                          border: `1px solid ${ayahsRead.has(v.verse_number) ? "rgba(52,201,122,0.5)" : "rgba(184,148,106,0.4)"}`,
                          fontSize: 11,
                          fontFamily: "system-ui, sans-serif",
                          color: ayahsRead.has(v.verse_number) ? "#34c97a" : "#b8946a",
                          margin: "0 6px",
                          verticalAlign: "middle",
                          cursor: "pointer",
                          flexShrink: 0,
                          direction: "ltr",
                        }}
                        onClick={(e) => { e.stopPropagation(); setActiveAyah(activeAyah === v.verse_number ? null : v.verse_number); }}
                        data-ayah={v.verse_number}
                      >
                        {v.verse_number}
                      </span>
                    </span>
                  );
                })}
              </p>
            </div>

            {/* ── Translations section ── */}
            <div style={{ margin: "24px 0 0" }}>
              <div style={{ height: 1, background: "rgba(52,201,122,0.1)", margin: "0 20px 24px" }} />

              {verses.map((v) => {
                const translation = v.translations?.[0]?.text?.replace(/<[^>]+>/g, "") ?? "";
                const isActive = activeAyah === v.verse_number;
                const isBookmarked = bookmarks.has(v.verse_number);
                const isPlaying = playingAyah === v.verse_number;
                const isRead = ayahsRead.has(v.verse_number);

                return (
                  <div
                    key={v.id}
                    data-ayah={v.verse_number}
                    style={{
                      padding: "14px 20px",
                      borderBottom: "0.5px solid rgba(52,201,122,0.06)",
                      background: isActive ? "rgba(52,201,122,0.04)" : "transparent",
                      transition: "background 0.2s",
                    }}
                    onClick={(e) => { e.stopPropagation(); setActiveAyah(isActive ? null : v.verse_number); }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      {/* Ayah number badge */}
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isRead ? "rgba(52,201,122,0.2)" : "rgba(184,148,106,0.1)",
                        border: `1px solid ${isRead ? "rgba(52,201,122,0.4)" : "rgba(184,148,106,0.3)"}`,
                        fontSize: 11, fontWeight: 700,
                        color: isRead ? "#34c97a" : "#b8946a",
                        marginTop: 2,
                      }}>
                        {v.verse_number}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Translation text */}
                        {translation && (
                          <p style={{
                            fontSize: 14, lineHeight: 1.75,
                            color: isActive ? "#eaf4ee" : "#a8c8b0",
                            margin: 0,
                            transition: "color 0.2s",
                          }}>
                            {translation}
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); playAyah(v.verse_number); }}
                          style={{
                            width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isPlaying ? "#34c97a" : "rgba(52,201,122,0.1)",
                            color: isPlaying ? "#fff" : "#6a9878",
                            transition: "all 0.2s",
                          }}
                        >
                          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(v.verse_number); }}
                          style={{
                            width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isBookmarked ? "rgba(184,148,106,0.15)" : "rgba(52,201,122,0.08)",
                            color: isBookmarked ? "#b8946a" : "#6a9878",
                            transition: "all 0.2s",
                          }}
                        >
                          <Bookmark size={13} style={{ fill: isBookmarked ? "#b8946a" : "transparent" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── End of Surah footer ── */}
            <div style={{ textAlign: "center", padding: "32px 20px 20px", color: "#6a9878" }}>
              <div style={{ fontFamily: "Amiri, serif", fontSize: 20, color: "#b8946a", marginBottom: 8 }}>
                ۝ صَدَقَ ٱللَّهُ ٱلْعَظِيمُ
              </div>
              <div style={{ fontSize: 12, marginBottom: 24 }}>End of {surahName}</div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {num > 1 && (
                  <button
                    onClick={() => navigate(`/quran/read/${num - 1}`)}
                    style={{ padding: "10px 18px", background: "rgba(52,201,122,0.1)", border: "1px solid rgba(52,201,122,0.2)", borderRadius: 12, color: "#34c97a", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    ← {SURAH_NAMES[num - 1] ?? `Surah ${num - 1}`}
                  </button>
                )}
                {num < 114 && (
                  <button
                    onClick={() => navigate(`/quran/read/${num + 1}`)}
                    style={{ padding: "10px 18px", background: "rgba(52,201,122,0.12)", border: "1px solid rgba(52,201,122,0.25)", borderRadius: 12, color: "#34c97a", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                  >
                    {SURAH_NAMES[num + 1] ?? `Surah ${num + 1}`} →
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuranSurahPage;
