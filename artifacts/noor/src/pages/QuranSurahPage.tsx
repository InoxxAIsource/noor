import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Pause, Bookmark, X } from "lucide-react";

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
      { threshold: 0.6 }
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

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col" onClick={() => setTooltip(null)}>
      <div className="sticky top-0 z-20 bg-[var(--bg)]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/quran")} className="p-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="font-cinzel text-xl text-[var(--gold)]">Surah {num}</h1>
            {verses.length > 0 && (
              <p className="text-xs text-[var(--muted)]">{ayahsRead.size} / {verses.length} ayahs read</p>
            )}
          </div>
        </div>
        {verses.length > 0 && (
          <div className="h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--green)] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-[var(--card)] border border-[var(--green)]/40 rounded-xl px-4 py-3 shadow-2xl max-w-[220px] text-center pointer-events-none"
          style={{
            left: Math.min(Math.max(tooltip.x - 110, 8), window.innerWidth - 228),
            top: Math.max(tooltip.y - 90, 8),
          }}
        >
          {tooltip.transliteration && (
            <p className="text-[var(--green)] text-xs italic mb-1">{tooltip.transliteration}</p>
          )}
          {tooltip.translation && (
            <p className="text-[var(--text)] text-sm font-semibold">{tooltip.translation}</p>
          )}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--card)] border-r border-b border-[var(--green)]/40 rotate-45" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading && (
          <div className="text-center py-20 text-[var(--muted)]">
            <div className="font-amiri text-3xl text-[var(--gold)] mb-4">بِسْمِ ٱللَّهِ</div>
            Loading surah...
          </div>
        )}
        {error && (
          <div className="text-center py-20 text-[var(--muted)]">
            Could not load surah. Check your connection.
          </div>
        )}
        {!loading && !error && (
          <>
            {num !== 9 && (
              <div className="text-center py-4">
                <p className="font-amiri text-3xl text-[var(--gold)]" dir="rtl">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
              </div>
            )}
            {verses.map((v) => {
              const translation = v.translations?.[0]?.text?.replace(/<[^>]+>/g, "") ?? "";
              const words = v.words?.filter((w) => w.char_type_name === "word") ?? [];
              const hasWords = words.length > 0;
              return (
                <div key={v.id} data-ayah={v.verse_number} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[var(--card)] border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${ayahsRead.has(v.verse_number) ? 'bg-[var(--green)]/20 border-[var(--green)]' : 'bg-[var(--green)]/10 border-[var(--green)]/40'}`}>
                        <span className="text-[var(--gold)] text-xs font-bold">{v.verse_number}</span>
                      </div>
                      {ayahsRead.has(v.verse_number) && (
                        <span className="text-[10px] text-[var(--green)]">✓</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => playAyah(v.verse_number)}
                        className={`p-1.5 rounded-full transition-colors ${
                          playingAyah === v.verse_number
                            ? "bg-[var(--green)] text-white"
                            : "text-[var(--muted)] hover:text-[var(--green)]"
                        }`}
                      >
                        {playingAyah === v.verse_number ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={() => toggleBookmark(v.verse_number)}
                        className={`p-1.5 rounded-full transition-colors ${
                          bookmarks.has(v.verse_number)
                            ? "text-[var(--gold)]"
                            : "text-[var(--muted)] hover:text-[var(--gold)]"
                        }`}
                      >
                        <Bookmark size={16} className={bookmarks.has(v.verse_number) ? "fill-[var(--gold)]" : ""} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    {hasWords ? (
                      <p className="font-amiri text-2xl text-[var(--gold)] leading-loose text-right mb-4 select-none" dir="rtl" lang="ar">
                        {words.map((word) => (
                          <span
                            key={word.id}
                            onClick={(e) => handleWordTap(e, word)}
                            className={`cursor-pointer mx-1 px-0.5 rounded transition-colors hover:bg-[var(--green)]/20 hover:text-white ${
                              tooltip?.wordId === word.id ? "bg-[var(--green)]/30 rounded" : ""
                            }`}
                            title={word.translation?.text}
                          >
                            {word.text_uthmani}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p className="font-amiri text-2xl text-[var(--gold)] leading-loose text-right mb-4" dir="rtl" lang="ar">
                        {v.text_uthmani}
                      </p>
                    )}
                    {translation && (
                      <p className="text-sm leading-relaxed text-[#c8e8c8]">{translation}</p>
                    )}
                    {hasWords && (
                      <p className="text-[10px] text-[var(--muted)] mt-2 italic">
                        Tap any Arabic word to see its meaning
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default QuranSurahPage;
