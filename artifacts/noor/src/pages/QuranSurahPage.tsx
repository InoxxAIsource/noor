import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Pause, Bookmark, SkipForward } from "lucide-react";

interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  translations: Array<{ text: string }>;
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
const ayahAudioUrl = (surah: number, ayah: number) =>
  `https://everyayah.com/data/Alafasy_128kbps/${pad(surah, 3)}${pad(ayah, 3)}.mp3`;

const QuranSurahPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const num = parseInt(number ?? "1", 10);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isSequential, setIsSequential] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`bookmarks:${num}`) ?? "[]")); }
    catch { return new Set(); }
  });
  const [ayahsRead, setAyahsRead] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`ayahsRead:${num}`) ?? "[]")); }
    catch { return new Set(); }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const versesRef = useRef<Verse[]>([]);
  versesRef.current = verses;

  useEffect(() => {
    localStorage.setItem("lastSurah", String(num));
    setLoading(true);
    setError(false);
    setPlayingAyah(null);
    setIsSequential(false);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    fetch(
      `https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,en.asad`,
      { signal: controller.signal }
    )
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        clearTimeout(timer);
        const editions: Array<{ edition: { identifier: string }; ayahs: Array<{ numberInSurah: number; text: string }> }> = data.data ?? [];
        const arabicEd = editions.find(e => e.edition.identifier === "quran-uthmani");
        const transEd  = editions.find(e => e.edition.identifier === "en.asad");
        const mapped: Verse[] = (arabicEd?.ayahs ?? []).map((a, i) => ({
          id: a.numberInSurah,
          verse_number: a.numberInSurah,
          verse_key: `${num}:${a.numberInSurah}`,
          text_uthmani: a.text,
          translations: [{ text: transEd?.ayahs[i]?.text ?? "" }],
        }));
        setVerses(mapped);
        setLoading(false);
      })
      .catch(err => {
        clearTimeout(timer);
        if (err.name === "AbortError") {
          setError(true);
        } else {
          setError(true);
        }
        setLoading(false);
      });

    return () => { clearTimeout(timer); controller.abort(); };
  }, [num]);

  const markRead = useCallback((ayahNum: number) => {
    setAyahsRead(prev => {
      if (prev.has(ayahNum)) return prev;
      const next = new Set(prev);
      next.add(ayahNum);
      localStorage.setItem(`ayahsRead:${num}`, JSON.stringify([...next]));
      localStorage.setItem(`lastAyah:${num}`, String(ayahNum));
      return next;
    });
  }, [num]);

  const stopAll = useCallback(() => {
    if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.onended = null; audioRef.current = null; }
    setPlayingAyah(null);
    setIsSequential(false);
  }, []);

  const playAyahAt = useCallback((ayahNum: number, sequential: boolean) => {
    if (gapTimerRef.current) clearTimeout(gapTimerRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.onended = null; audioRef.current = null; }

    const url = ayahAudioUrl(num, ayahNum);
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingAyah(ayahNum);
    setIsSequential(sequential);
    markRead(ayahNum);

    audio.play().catch(() => { setPlayingAyah(null); });

    audio.onended = () => {
      if (!sequential) {
        setPlayingAyah(null);
        setIsSequential(false);
        return;
      }
      const allVerses = versesRef.current;
      const nextAyah = ayahNum + 1;
      if (nextAyah > allVerses.length) {
        setPlayingAyah(null);
        setIsSequential(false);
        return;
      }
      gapTimerRef.current = setTimeout(() => {
        playAyahAt(nextAyah, true);
      }, 4000);
    };
  }, [num, markRead]);

  useEffect(() => () => stopAll(), [stopAll]);

  const handlePlayButton = (ayahNum: number) => {
    if (playingAyah === ayahNum) { stopAll(); return; }
    playAyahAt(ayahNum, false);
  };

  const handlePlayAll = (fromAyah: number) => {
    if (isSequential && playingAyah !== null) { stopAll(); return; }
    playAyahAt(fromAyah, true);
  };

  const toggleBookmark = (ayahNum: number) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(ayahNum) ? next.delete(ayahNum) : next.add(ayahNum);
      localStorage.setItem(`bookmarks:${num}`, JSON.stringify([...next]));
      return next;
    });
  };

  const progressPct = verses.length > 0 ? Math.round((ayahsRead.size / verses.length) * 100) : 0;
  const surahName = SURAH_NAMES[num] ?? `Surah ${num}`;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1411", paddingBottom: 80 }}>

      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(13,20,17,0.97)", backdropFilter: "blur(12px)",
        borderBottom: "0.5px solid rgba(52,201,122,0.15)",
        padding: "14px 16px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <button onClick={() => navigate("/quran")}
            style={{ background: "transparent", border: "none", color: "#6a9878", cursor: "pointer", padding: 4, display: "flex" }}>
            <ChevronLeft size={22} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#eaf4ee", fontFamily: "DM Sans, Inter, sans-serif" }}>{surahName}</div>
            <div style={{ fontSize: 11, color: "#6a9878", marginTop: 1, fontFamily: "Inter, sans-serif" }}>
              Surah {num} · {verses.length} ayahs · {ayahsRead.size} read
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { stopAll(); navigate(`/quran/read/${num - 1}`); }} disabled={num <= 1}
              style={{ background: "rgba(52,201,122,0.08)", border: "1px solid rgba(52,201,122,0.2)", borderRadius: 8, padding: "5px 10px", color: num > 1 ? "#34c97a" : "#2a3830", cursor: num > 1 ? "pointer" : "default" }}>
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => { stopAll(); navigate(`/quran/read/${num + 1}`); }} disabled={num >= 114}
              style={{ background: "rgba(52,201,122,0.08)", border: "1px solid rgba(52,201,122,0.2)", borderRadius: 8, padding: "5px 10px", color: num < 114 ? "#34c97a" : "#2a3830", cursor: num < 114 ? "pointer" : "default" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        {verses.length > 0 && (
          <div style={{ height: 3, background: "#1c2d21", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "#34c97a", borderRadius: 99, transition: "width 0.4s" }} />
          </div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "#6a9878" }}>
          <div style={{ fontFamily: "Amiri, 'Arabic Typesetting', 'Traditional Arabic', serif", fontSize: 36, color: "#b8946a", marginBottom: 16 }}>بِسْمِ ٱللَّهِ</div>
          <div style={{ fontSize: 14, fontFamily: "Inter, sans-serif" }}>Loading {surahName}...</div>
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
            <div style={{ textAlign: "center", padding: "28px 20px 16px" }}>
              <div style={{
                fontFamily: "Amiri, 'Arabic Typesetting', 'Traditional Arabic', serif",
                fontSize: 28,
                color: "#b8946a",
                lineHeight: 2,
                direction: "rtl",
              }}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </div>
              <div style={{ width: 60, height: 1, background: "rgba(184,148,106,0.3)", margin: "12px auto 0" }} />
            </div>
          )}

          {/* Play All / Stop button */}
          <div style={{ padding: "0 20px 16px", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => handlePlayAll(playingAyah && isSequential ? playingAyah : 1)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 20,
                background: isSequential ? "rgba(184,148,106,0.15)" : "rgba(52,201,122,0.12)",
                border: `1px solid ${isSequential ? "rgba(184,148,106,0.4)" : "rgba(52,201,122,0.3)"}`,
                color: isSequential ? "#b8946a" : "#34c97a",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {isSequential ? <Pause size={13} /> : <SkipForward size={13} />}
              {isSequential ? "Stop" : "Play All"}
            </button>
          </div>

          {/* Ayah list */}
          <div>
            {verses.map((v) => {
              const translation = v.translations?.[0]?.text?.replace(/<[^>]+>/g, "").replace(/\[\d+\]/g, "").trim() ?? "";
              const isPlaying = playingAyah === v.verse_number;
              const isBookmarked = bookmarks.has(v.verse_number);
              const isRead = ayahsRead.has(v.verse_number);

              return (
                <div key={v.id} data-ayah={v.verse_number}
                  style={{
                    padding: "20px 20px",
                    borderBottom: "0.5px solid rgba(52,201,122,0.08)",
                    background: isPlaying ? "rgba(52,201,122,0.05)" : "transparent",
                    transition: "background 0.3s",
                  }}
                >
                  {/* Arabic text */}
                  <div style={{ marginBottom: 14, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 10 }}>
                    {/* Verse number badge */}
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isRead ? "rgba(52,201,122,0.2)" : "rgba(184,148,106,0.12)",
                      border: `1px solid ${isRead ? "rgba(52,201,122,0.5)" : "rgba(184,148,106,0.35)"}`,
                      fontSize: 11, fontWeight: 700,
                      color: isRead ? "#34c97a" : "#b8946a",
                      fontFamily: "Inter, sans-serif",
                    }}>
                      {v.verse_number}
                    </div>
                    {/* Arabic */}
                    <div
                      dir="rtl"
                      lang="ar"
                      style={{
                        flex: 1,
                        fontFamily: "Amiri, 'Arabic Typesetting', 'Traditional Arabic', serif",
                        fontSize: 26,
                        lineHeight: 2.2,
                        color: isPlaying ? "#34c97a" : "#f0ede8",
                        textAlign: "right",
                        transition: "color 0.3s",
                        wordSpacing: 6,
                      }}
                    >
                      {v.text_uthmani}
                    </div>
                  </div>

                  {/* Translation + controls row */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    {/* Translation */}
                    <div style={{ flex: 1 }}>
                      {translation ? (
                        <p style={{
                          margin: 0,
                          fontSize: 13,
                          lineHeight: 1.7,
                          color: "#a8c8b0",
                          fontFamily: "Inter, sans-serif",
                        }}>
                          {translation}
                        </p>
                      ) : null}
                    </div>
                    {/* Controls */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                      <button
                        onClick={() => handlePlayButton(v.verse_number)}
                        title={isPlaying ? "Pause" : "Play this ayah"}
                        style={{
                          width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: isPlaying ? "#34c97a" : "rgba(52,201,122,0.12)",
                          color: isPlaying ? "#fff" : "#6a9878",
                          transition: "all 0.2s",
                        }}
                      >
                        {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                      <button
                        onClick={() => toggleBookmark(v.verse_number)}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                        style={{
                          width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
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

          {/* End of Surah */}
          <div style={{ textAlign: "center", padding: "32px 20px 20px", color: "#6a9878" }}>
            <div style={{ fontFamily: "Amiri, 'Arabic Typesetting', serif", fontSize: 20, color: "#b8946a", marginBottom: 8 }}>
              صَدَقَ ٱللَّهُ ٱلْعَظِيمُ
            </div>
            <div style={{ fontSize: 12, marginBottom: 24, fontFamily: "Inter, sans-serif" }}>End of {surahName}</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {num > 1 && (
                <button onClick={() => { stopAll(); navigate(`/quran/read/${num - 1}`); }}
                  style={{ padding: "10px 18px", background: "rgba(52,201,122,0.1)", border: "1px solid rgba(52,201,122,0.2)", borderRadius: 12, color: "#34c97a", fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                  &larr; {SURAH_NAMES[num - 1] ?? `Surah ${num - 1}`}
                </button>
              )}
              {num < 114 && (
                <button onClick={() => { stopAll(); navigate(`/quran/read/${num + 1}`); }}
                  style={{ padding: "10px 18px", background: "rgba(52,201,122,0.12)", border: "1px solid rgba(52,201,122,0.25)", borderRadius: 12, color: "#34c97a", fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  {SURAH_NAMES[num + 1] ?? `Surah ${num + 1}`} &rarr;
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuranSurahPage;
