import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, AlertTriangle, Search } from "lucide-react";

interface ForbiddenName {
  name: string;
  arabic?: string;
  reason: string;
  ruling: "haram" | "makrooh" | "discouraged";
  source?: string;
}

const FORBIDDEN_NAMES: ForbiddenName[] = [
  { name: "Shaitan", arabic: "شَيْطَان", reason: "Name of the devil, absolutely forbidden in Islam", ruling: "haram", source: "Scholarly consensus" },
  { name: "Malaak ul Mawt", arabic: "مَلَكُ الْمَوْت", reason: "Name of the Angel of Death, not permissible for humans", ruling: "haram" },
  { name: "Jibreel", arabic: "جِبْرِيل", reason: "Name of a senior angel, using angels' proper names as human names is discouraged", ruling: "makrooh", source: "Ibn Qayyim, Tuhfat al-Mawdud" },
  { name: "Azrael", arabic: "عَزْرَائِيل", reason: "Popular name for Angel of Death, using angelic names is makrooh", ruling: "makrooh" },
  { name: "Abd al-Nabi", arabic: "عَبْدُ النَّبِي", reason: "Slave of the Prophet, only Allah deserves worship; 'Abd' names must only refer to Allah's attributes", ruling: "haram", source: "Majority scholarly opinion" },
  { name: "Abd al-Husain", arabic: "عَبْدُ الْحُسَيْن", reason: "'Slave of Husain', bondage belongs only to Allah", ruling: "haram", source: "Scholarly consensus" },
  { name: "Abd al-Rasool", arabic: "عَبْدُ الرَّسُول", reason: "'Slave of the Messenger', servitude is for Allah alone", ruling: "haram" },
  { name: "Pharaoh / Fir'awn", arabic: "فِرْعَوْن", reason: "Name of the tyrant who denied Allah, forbidden to use", ruling: "haram", source: "Scholarly consensus" },
  { name: "Haman", arabic: "هَامَان", reason: "Name of Fir'awn's vizier who oppressed the Israelites", ruling: "haram" },
  { name: "Qaaroon / Korah", arabic: "قَارُون", reason: "The arrogant man of Musa's time destroyed for his pride", ruling: "discouraged" },
  { name: "Lucifera / Lucifer", reason: "Western name for Satan, clearly forbidden", ruling: "haram" },
  { name: "Dybbuk", reason: "Name associated with evil spirits in Jewish-Islamic tradition", ruling: "haram" },
  { name: "Malik al-Amlak", arabic: "مَالِكُ الْأَمْلَاك", reason: "'King of Kings', only Allah holds this title; giving it to humans is forbidden", ruling: "haram", source: "Sahih Muslim 2143" },
  { name: "Qahhar", arabic: "الْقَهَّار", reason: "Attribute name of Allah used without 'Abd' prefix is makrooh", ruling: "makrooh", source: "Ibn Qayyim" },
  { name: "Hayyaan / Haiwaan", arabic: "حَيَوَان", reason: "'Animal' in Arabic, names that demean a person are discouraged", ruling: "discouraged" },
  { name: "Harb", arabic: "حَرْب", reason: "'War', names with negative meanings are discouraged by the Prophet ﷺ", ruling: "discouraged", source: "Abu Dawud 4952" },
  { name: "Murra", arabic: "مُرَّة", reason: "'Bitter', the Prophet ﷺ changed names with negative meanings", ruling: "discouraged", source: "Abu Dawud 4952" },
  { name: "Aflah", arabic: "أَفْلَح", reason: "'He succeeded', the Prophet ﷺ discouraged names that assume goodness in reply to a question", ruling: "makrooh", source: "Muslim 2137" },
  { name: "Naafi'", arabic: "نَافِع", reason: "'Beneficial', same category of names where absence could imply the opposite", ruling: "makrooh", source: "Muslim 2137" },
  { name: "Barakah", arabic: "بَرَكَة", reason: "'Blessing', the Prophet ﷺ was concerned answering 'Is Blessing present?'", ruling: "makrooh", source: "Muslim 2137" },
  { name: "Yassaar", arabic: "يَسَار", reason: "Names where the reply when absent could be unfortunate", ruling: "makrooh", source: "Sahih Muslim" },
  { name: "Rabbaah", arabic: "رَبَّاح", reason: "Similar makrooh names as above", ruling: "makrooh", source: "Muslim 2137" },
  { name: "Waahid", arabic: "الْوَاحِد", reason: "'The One' without 'Abd', this is an exclusive attribute of Allah", ruling: "makrooh", source: "Scholarly consensus" },
  { name: "Rabb", arabic: "رَبّ", reason: "'Lord', exclusive title for Allah; naming a child 'Lord' is forbidden", ruling: "haram" },
];

const RULINGS: Record<string, { label: string; color: string; bg: string }> = {
  haram:      { label: "Forbidden",    color: "#c04848", bg: "rgba(192,72,72,0.15)" },
  makrooh:    { label: "Disliked",     color: "#ff9900", bg: "rgba(255,153,0,0.12)" },
  discouraged:{ label: "Discouraged",  color: "#6e5e4c", bg: "rgba(110,94,76,0.12)" },
};

const ForbiddenNamesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "haram" | "makrooh" | "discouraged">("all");

  const filtered = FORBIDDEN_NAMES.filter((n) => {
    const matchSearch =
      !search ||
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      (n.arabic ?? "").includes(search) ||
      n.reason.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || n.ruling === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md px-4 pt-6 pb-3 border-b border-[var(--border)] space-y-3">
        <div className="flex items-center gap-3">
          <Link to="/names" className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="font-cinzel text-xl text-[#c04848]">Forbidden &amp; Discouraged Names</h1>
        </div>

        <div className="bg-[#c04848]/10 border border-[#c04848]/30 rounded-xl p-3 flex gap-2 items-start">
          <AlertTriangle size={16} className="text-[#c04848] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text)]/80 leading-relaxed">
            Islam prohibits names that demean a person, belong exclusively to Allah or His angels, or are associated with evil figures. When in doubt, consult a qualified Islamic scholar.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
          <input
            type="text"
            placeholder="Search names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {(["all", "haram", "makrooh", "discouraged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border flex-shrink-0 transition-all ${
                filter === f
                  ? f === "all"
                    ? "bg-[var(--green)] text-white border-[var(--green)]"
                    : `text-white border-transparent`
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted)]"
              }`}
              style={filter === f && f !== "all" ? { backgroundColor: RULINGS[f]!.color } : {}}
            >
              {f === "all" ? "All" : RULINGS[f]!.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filtered.map((n, i) => {
          const r = RULINGS[n.ruling]!;
          return (
            <div
              key={i}
              className="rounded-2xl border p-4 space-y-2"
              style={{ borderColor: `${r.color}40`, backgroundColor: r.bg }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-cinzel font-bold text-[var(--text)] text-base">{n.name}</p>
                  {n.arabic && (
                    <p className="font-amiri text-xl text-[var(--gold)] text-right" dir="rtl">{n.arabic}</p>
                  )}
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
                  style={{ color: r.color, backgroundColor: `${r.color}20`, border: `1px solid ${r.color}50` }}
                >
                  {r.label}
                </span>
              </div>
              <p className="text-sm text-[var(--text)]/80 leading-relaxed">{n.reason}</p>
              {n.source && (
                <p className="text-xs text-[var(--muted)] italic">Source: {n.source}</p>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--muted)]">No names match your search.</div>
        )}

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 mt-4">
          <p className="font-cinzel text-[var(--gold)] text-sm mb-2">General Rule</p>
          <p className="text-xs text-[var(--text)]/80 leading-relaxed">
            The Prophet ﷺ said: "You will be called by your names and the names of your fathers on the Day of Resurrection, so give yourselves good names." (Abu Dawud 4948). Names that praise Allah, reflect His attributes (with 'Abd'), mention the prophets, or carry beautiful meanings are recommended.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenNamesPage;
