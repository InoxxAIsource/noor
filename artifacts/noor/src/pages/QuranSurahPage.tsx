import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Pause, Bookmark } from "lucide-react";

interface Verse {
  id: number;
  verse_number: number;
  text_uthmani: string;
  translations: Array<{ text: string }>;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[var(--border)] flex items-center gap-3">
        <button onClick={() => navigate("/quran")} className="p-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-cinzel text-xl text-[var(--gold)]">Surah {num}</h1>
          {verses.length > 0 && (
            <p className="text-xs text-[var(--muted)]">{verses.length} ayahs</p>
          )}
        </div>
      </div>

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
              return (
                <div key={v.id} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[var(--card)] border-b border-[var(--border)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--green)]/20 border border-[var(--green)]/40 flex items-center justify-center">
                      <span className="text-[var(--gold)] text-xs font-bold">{v.verse_number}</span>
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
                    <p
                      className="font-amiri text-2xl text-[var(--gold)] leading-loose text-right mb-4"
                      dir="rtl"
                      lang="ar"
                    >
                      {v.text_uthmani}
                    </p>
                    {translation && (
                      <p className="text-sm leading-relaxed text-[#c8e8c8]">{translation}</p>
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
