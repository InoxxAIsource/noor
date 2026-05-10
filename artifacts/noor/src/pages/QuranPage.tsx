import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const SURAHS = [
  { n: 1, ar: "الفاتحة", en: "Al-Fatihah", ayahs: 7, type: "Meccan" },
  { n: 2, ar: "البقرة", en: "Al-Baqarah", ayahs: 286, type: "Medinan" },
  { n: 3, ar: "آل عمران", en: "Ali 'Imran", ayahs: 200, type: "Medinan" },
  { n: 4, ar: "النساء", en: "An-Nisa", ayahs: 176, type: "Medinan" },
  { n: 5, ar: "المائدة", en: "Al-Ma'idah", ayahs: 120, type: "Medinan" },
  { n: 6, ar: "الأنعام", en: "Al-An'am", ayahs: 165, type: "Meccan" },
  { n: 7, ar: "الأعراف", en: "Al-A'raf", ayahs: 206, type: "Meccan" },
  { n: 8, ar: "الأنفال", en: "Al-Anfal", ayahs: 75, type: "Medinan" },
  { n: 9, ar: "التوبة", en: "At-Tawbah", ayahs: 129, type: "Medinan" },
  { n: 10, ar: "يونس", en: "Yunus", ayahs: 109, type: "Meccan" },
  { n: 11, ar: "هود", en: "Hud", ayahs: 123, type: "Meccan" },
  { n: 12, ar: "يوسف", en: "Yusuf", ayahs: 111, type: "Meccan" },
  { n: 13, ar: "الرعد", en: "Ar-Ra'd", ayahs: 43, type: "Medinan" },
  { n: 14, ar: "إبراهيم", en: "Ibrahim", ayahs: 52, type: "Meccan" },
  { n: 15, ar: "الحجر", en: "Al-Hijr", ayahs: 99, type: "Meccan" },
  { n: 16, ar: "النحل", en: "An-Nahl", ayahs: 128, type: "Meccan" },
  { n: 17, ar: "الإسراء", en: "Al-Isra", ayahs: 111, type: "Meccan" },
  { n: 18, ar: "الكهف", en: "Al-Kahf", ayahs: 110, type: "Meccan" },
  { n: 19, ar: "مريم", en: "Maryam", ayahs: 98, type: "Meccan" },
  { n: 20, ar: "طه", en: "Ta-Ha", ayahs: 135, type: "Meccan" },
  { n: 21, ar: "الأنبياء", en: "Al-Anbiya", ayahs: 112, type: "Meccan" },
  { n: 22, ar: "الحج", en: "Al-Hajj", ayahs: 78, type: "Medinan" },
  { n: 23, ar: "المؤمنون", en: "Al-Mu'minun", ayahs: 118, type: "Meccan" },
  { n: 24, ar: "النور", en: "An-Nur", ayahs: 64, type: "Medinan" },
  { n: 25, ar: "الفرقان", en: "Al-Furqan", ayahs: 77, type: "Meccan" },
  { n: 26, ar: "الشعراء", en: "Ash-Shu'ara", ayahs: 227, type: "Meccan" },
  { n: 27, ar: "النمل", en: "An-Naml", ayahs: 93, type: "Meccan" },
  { n: 28, ar: "القصص", en: "Al-Qasas", ayahs: 88, type: "Meccan" },
  { n: 29, ar: "العنكبوت", en: "Al-'Ankabut", ayahs: 69, type: "Meccan" },
  { n: 30, ar: "الروم", en: "Ar-Rum", ayahs: 60, type: "Meccan" },
  { n: 31, ar: "لقمان", en: "Luqman", ayahs: 34, type: "Meccan" },
  { n: 32, ar: "السجدة", en: "As-Sajdah", ayahs: 30, type: "Meccan" },
  { n: 33, ar: "الأحزاب", en: "Al-Ahzab", ayahs: 73, type: "Medinan" },
  { n: 34, ar: "سبأ", en: "Saba", ayahs: 54, type: "Meccan" },
  { n: 35, ar: "فاطر", en: "Fatir", ayahs: 45, type: "Meccan" },
  { n: 36, ar: "يس", en: "Ya-Sin", ayahs: 83, type: "Meccan" },
  { n: 37, ar: "الصافات", en: "As-Saffat", ayahs: 182, type: "Meccan" },
  { n: 38, ar: "ص", en: "Sad", ayahs: 88, type: "Meccan" },
  { n: 39, ar: "الزمر", en: "Az-Zumar", ayahs: 75, type: "Meccan" },
  { n: 40, ar: "غافر", en: "Ghafir", ayahs: 85, type: "Meccan" },
  { n: 41, ar: "فصلت", en: "Fussilat", ayahs: 54, type: "Meccan" },
  { n: 42, ar: "الشورى", en: "Ash-Shura", ayahs: 53, type: "Meccan" },
  { n: 43, ar: "الزخرف", en: "Az-Zukhruf", ayahs: 89, type: "Meccan" },
  { n: 44, ar: "الدخان", en: "Ad-Dukhan", ayahs: 59, type: "Meccan" },
  { n: 45, ar: "الجاثية", en: "Al-Jathiyah", ayahs: 37, type: "Meccan" },
  { n: 46, ar: "الأحقاف", en: "Al-Ahqaf", ayahs: 35, type: "Meccan" },
  { n: 47, ar: "محمد", en: "Muhammad", ayahs: 38, type: "Medinan" },
  { n: 48, ar: "الفتح", en: "Al-Fath", ayahs: 29, type: "Medinan" },
  { n: 49, ar: "الحجرات", en: "Al-Hujurat", ayahs: 18, type: "Medinan" },
  { n: 50, ar: "ق", en: "Qaf", ayahs: 45, type: "Meccan" },
  { n: 51, ar: "الذاريات", en: "Adh-Dhariyat", ayahs: 60, type: "Meccan" },
  { n: 52, ar: "الطور", en: "At-Tur", ayahs: 49, type: "Meccan" },
  { n: 53, ar: "النجم", en: "An-Najm", ayahs: 62, type: "Meccan" },
  { n: 54, ar: "القمر", en: "Al-Qamar", ayahs: 55, type: "Meccan" },
  { n: 55, ar: "الرحمن", en: "Ar-Rahman", ayahs: 78, type: "Medinan" },
  { n: 56, ar: "الواقعة", en: "Al-Waqi'ah", ayahs: 96, type: "Meccan" },
  { n: 57, ar: "الحديد", en: "Al-Hadid", ayahs: 29, type: "Medinan" },
  { n: 58, ar: "المجادلة", en: "Al-Mujadila", ayahs: 22, type: "Medinan" },
  { n: 59, ar: "الحشر", en: "Al-Hashr", ayahs: 24, type: "Medinan" },
  { n: 60, ar: "الممتحنة", en: "Al-Mumtahanah", ayahs: 13, type: "Medinan" },
  { n: 61, ar: "الصف", en: "As-Saf", ayahs: 14, type: "Medinan" },
  { n: 62, ar: "الجمعة", en: "Al-Jumu'ah", ayahs: 11, type: "Medinan" },
  { n: 63, ar: "المنافقون", en: "Al-Munafiqun", ayahs: 11, type: "Medinan" },
  { n: 64, ar: "التغابن", en: "At-Taghabun", ayahs: 18, type: "Medinan" },
  { n: 65, ar: "الطلاق", en: "At-Talaq", ayahs: 12, type: "Medinan" },
  { n: 66, ar: "التحريم", en: "At-Tahrim", ayahs: 12, type: "Medinan" },
  { n: 67, ar: "الملك", en: "Al-Mulk", ayahs: 30, type: "Meccan" },
  { n: 68, ar: "القلم", en: "Al-Qalam", ayahs: 52, type: "Meccan" },
  { n: 69, ar: "الحاقة", en: "Al-Haqqah", ayahs: 52, type: "Meccan" },
  { n: 70, ar: "المعارج", en: "Al-Ma'arij", ayahs: 44, type: "Meccan" },
  { n: 71, ar: "نوح", en: "Nuh", ayahs: 28, type: "Meccan" },
  { n: 72, ar: "الجن", en: "Al-Jinn", ayahs: 28, type: "Meccan" },
  { n: 73, ar: "المزمل", en: "Al-Muzzammil", ayahs: 20, type: "Meccan" },
  { n: 74, ar: "المدثر", en: "Al-Muddaththir", ayahs: 56, type: "Meccan" },
  { n: 75, ar: "القيامة", en: "Al-Qiyamah", ayahs: 40, type: "Meccan" },
  { n: 76, ar: "الإنسان", en: "Al-Insan", ayahs: 31, type: "Medinan" },
  { n: 77, ar: "المرسلات", en: "Al-Mursalat", ayahs: 50, type: "Meccan" },
  { n: 78, ar: "النبأ", en: "An-Naba", ayahs: 40, type: "Meccan" },
  { n: 79, ar: "النازعات", en: "An-Nazi'at", ayahs: 46, type: "Meccan" },
  { n: 80, ar: "عبس", en: "'Abasa", ayahs: 42, type: "Meccan" },
  { n: 81, ar: "التكوير", en: "At-Takwir", ayahs: 29, type: "Meccan" },
  { n: 82, ar: "الانفطار", en: "Al-Infitar", ayahs: 19, type: "Meccan" },
  { n: 83, ar: "المطففين", en: "Al-Mutaffifin", ayahs: 36, type: "Meccan" },
  { n: 84, ar: "الانشقاق", en: "Al-Inshiqaq", ayahs: 25, type: "Meccan" },
  { n: 85, ar: "البروج", en: "Al-Buruj", ayahs: 22, type: "Meccan" },
  { n: 86, ar: "الطارق", en: "At-Tariq", ayahs: 17, type: "Meccan" },
  { n: 87, ar: "الأعلى", en: "Al-A'la", ayahs: 19, type: "Meccan" },
  { n: 88, ar: "الغاشية", en: "Al-Ghashiyah", ayahs: 26, type: "Meccan" },
  { n: 89, ar: "الفجر", en: "Al-Fajr", ayahs: 30, type: "Meccan" },
  { n: 90, ar: "البلد", en: "Al-Balad", ayahs: 20, type: "Meccan" },
  { n: 91, ar: "الشمس", en: "Ash-Shams", ayahs: 15, type: "Meccan" },
  { n: 92, ar: "الليل", en: "Al-Layl", ayahs: 21, type: "Meccan" },
  { n: 93, ar: "الضحى", en: "Ad-Duha", ayahs: 11, type: "Meccan" },
  { n: 94, ar: "الشرح", en: "Ash-Sharh", ayahs: 8, type: "Meccan" },
  { n: 95, ar: "التين", en: "At-Tin", ayahs: 8, type: "Meccan" },
  { n: 96, ar: "العلق", en: "Al-'Alaq", ayahs: 19, type: "Meccan" },
  { n: 97, ar: "القدر", en: "Al-Qadr", ayahs: 5, type: "Meccan" },
  { n: 98, ar: "البينة", en: "Al-Bayyinah", ayahs: 8, type: "Medinan" },
  { n: 99, ar: "الزلزلة", en: "Az-Zalzalah", ayahs: 8, type: "Medinan" },
  { n: 100, ar: "العاديات", en: "Al-'Adiyat", ayahs: 11, type: "Meccan" },
  { n: 101, ar: "القارعة", en: "Al-Qari'ah", ayahs: 11, type: "Meccan" },
  { n: 102, ar: "التكاثر", en: "At-Takathur", ayahs: 8, type: "Meccan" },
  { n: 103, ar: "العصر", en: "Al-'Asr", ayahs: 3, type: "Meccan" },
  { n: 104, ar: "الهمزة", en: "Al-Humazah", ayahs: 9, type: "Meccan" },
  { n: 105, ar: "الفيل", en: "Al-Fil", ayahs: 5, type: "Meccan" },
  { n: 106, ar: "قريش", en: "Quraysh", ayahs: 4, type: "Meccan" },
  { n: 107, ar: "الماعون", en: "Al-Ma'un", ayahs: 7, type: "Meccan" },
  { n: 108, ar: "الكوثر", en: "Al-Kawthar", ayahs: 3, type: "Meccan" },
  { n: 109, ar: "الكافرون", en: "Al-Kafirun", ayahs: 6, type: "Meccan" },
  { n: 110, ar: "النصر", en: "An-Nasr", ayahs: 3, type: "Medinan" },
  { n: 111, ar: "المسد", en: "Al-Masad", ayahs: 5, type: "Meccan" },
  { n: 112, ar: "الإخلاص", en: "Al-Ikhlas", ayahs: 4, type: "Meccan" },
  { n: 113, ar: "الفلق", en: "Al-Falaq", ayahs: 5, type: "Meccan" },
  { n: 114, ar: "الناس", en: "An-Nas", ayahs: 6, type: "Meccan" },
];

const QuranPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const lastSurah = localStorage.getItem("lastSurah");

  const filtered = SURAHS.filter(
    (s) =>
      s.en.toLowerCase().includes(search.toLowerCase()) ||
      s.ar.includes(search) ||
      String(s.n).includes(search)
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)] space-y-3">
        <div className="flex items-center gap-3">
          <BookOpen className="text-[var(--gold)]" size={28} />
          <h1 className="font-cinzel text-3xl text-[var(--gold)]">Al-Quran</h1>
          <span className="ml-auto text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-1 rounded-full">114 Surahs</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <Input
            placeholder="Search surah by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--surface)] border-[var(--border)] pl-10 py-5 rounded-xl"
          />
        </div>
        {lastSurah && (
          <button
            onClick={() => navigate(`/quran/${lastSurah}`)}
            className="w-full text-left flex items-center gap-2 bg-[var(--green)]/10 border border-[var(--green)]/30 rounded-xl px-4 py-2 text-sm text-[var(--green)]"
          >
            <span>↩ Continue reading: Surah {lastSurah}</span>
            <ChevronRight size={14} className="ml-auto" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
        {filtered.map((s) => (
          <button
            key={s.n}
            onClick={() => navigate(`/quran/${s.n}`)}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-[var(--surface)] transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
              <span className="text-[var(--gold)] text-xs font-cinzel font-bold">{s.n}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--text)]">{s.en}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                  s.type === "Meccan"
                    ? "border-[var(--gold)]/40 text-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--green)]/40 text-[var(--green)] bg-[var(--green)]/10"
                }`}>{s.type}</span>
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5">{s.ayahs} ayahs</div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-amiri text-2xl text-[var(--gold)]">{s.ar}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuranPage;
