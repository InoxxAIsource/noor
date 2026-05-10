import React, { useState } from "react";
import { ChevronDown, ChevronUp, Play } from "lucide-react";

const EID_ADHA_2026 = new Date("2026-06-16");
const daysUntil = Math.max(0, Math.ceil((EID_ADHA_2026.getTime() - Date.now()) / 86400000));

const DUAS = [
  {
    title: "Niyyah (Intention)",
    arabic: "اللَّهُمَّ إِنَّ هَذِهِ مِنْكَ وَإِلَيْكَ فَتَقَبَّلْ مِنِّي",
    transliteration: "Allahumma inna hadhihi minka wa ilayka fataqabbal minni",
    meaning: "O Allah, this is from You and for You, so accept it from me.",
  },
  {
    title: "Dua at Slaughter",
    arabic: "بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ",
    transliteration: "Bismillahi Allahu Akbar",
    meaning: "In the name of Allah, Allah is the Greatest.",
  },
  {
    title: "Post-Slaughter Dua",
    arabic: "اللَّهُمَّ تَقَبَّلْ مِنَّا كَمَا تَقَبَّلْتَ مِنْ إِبْرَاهِيمَ خَلِيلِكَ",
    transliteration: "Allahumma taqabbal minna kama taqabbalta min Ibrahima khalilika",
    meaning: "O Allah, accept from us as You accepted from Ibrahim, Your close friend.",
  },
];

const SECTIONS = [
  {
    title: "What is Qurbani?",
    content: `Qurbani (Udhiyah) is the act of slaughtering a livestock animal during the days of Eid ul Adha to commemorate the sacrifice of Prophet Ibrahim (AS). It is wajib (obligatory) for every Muslim who possesses nisab (the minimum amount of wealth) and is not a traveller.\n\nWho must perform it: A sane, adult Muslim who owns wealth equal to or above nisab on the days of Eid ul Adha.`,
  },
  {
    title: "Animals Accepted",
    content: `• Goat or sheep — 1 share (for 1 person)\n• Cow or buffalo — 7 shares (for up to 7 people)\n• Camel — 7 shares (for up to 7 people)\n\nAll animals must be healthy, without any apparent defect.`,
  },
  {
    title: "Minimum Age Requirements",
    content: `• Goat/Sheep: At least 1 year old (6 months if very large)\n• Cow/Buffalo: At least 2 years old\n• Camel: At least 5 years old\n\nAnimals younger than required age are not valid for Qurbani.`,
  },
  {
    title: "Days of Qurbani",
    content: `Qurbani must be performed on:\n• 10th Dhul Hijjah (Eid day) — after Eid prayer\n• 11th Dhul Hijjah\n• 12th Dhul Hijjah (last day)\n\nIt is best to perform on the 10th after the Eid prayer. It is not valid before the Eid prayer.`,
  },
  {
    title: "Meat Distribution",
    content: `The meat must be divided into three equal parts:\n• 1/3 for yourself and your family\n• 1/3 for relatives and friends\n• 1/3 for the poor and needy\n\nAll three portions must come from the same animal.`,
  },
  {
    title: "Animal Inspection Checklist",
    content: `✅ Valid: Healthy, full sight, four complete legs, both ears intact, no broken horn (small chip ok)\n\n❌ Invalid: Blind in one eye, lame (cannot walk to slaughter place), missing more than 1/3 of ear or tail, thin/emaciated, sick, toothless`,
  },
  {
    title: "Frequently Asked Questions",
    content: `Q: Can I give money instead of slaughtering?\nA: You may pay a charity to do it on your behalf, but you must ensure they slaughter an actual animal.\n\nQ: Is Qurbani valid outside the home country?\nA: Yes, you may appoint someone in another country to perform it.\n\nQ: Can the slaughterer eat from Qurbani meat?\nA: Only if they are not being paid for their work.\n\nQ: Does Qurbani cover the whole family?\nA: One animal covers the entire household (Sunnah Qurbani). Wajib Qurbani is per eligible adult.\n\nQ: What about hair and nails?\nA: From 1st Dhul Hijjah until after slaughter, do not cut hair or nails if you intend to perform Qurbani.`,
  },
  {
    title: "Online Qurbani Services",
    content: `• Islamic Relief — islamicrelief.org.uk/qurbani\n• Human Appeal — humanappeal.org.uk/qurbani\n• Muslim Aid — muslimaid.org/qurbani\n• Penny Appeal — pennyappeal.org/qurbani`,
  },
];

const QurbaniGuidePage: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  const [playingDua, setPlayingDua] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)]">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Qurbani Guide</h1>
        {daysUntil > 0 && (
          <div className="mt-2 text-center">
            <span className="bg-[var(--gold)]/20 border border-[var(--gold)]/40 text-[var(--gold)] text-sm px-4 py-1 rounded-full font-cinzel">
              Eid ul Adha in {daysUntil} days
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {SECTIONS.map((s, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-semibold text-[var(--text)]">{s.title}</span>
              {open === i ? <ChevronUp size={18} className="text-[var(--gold)]" /> : <ChevronDown size={18} className="text-[var(--muted)]" />}
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line border-t border-[var(--border)] pt-4">
                {s.content}
              </div>
            )}
          </div>
        ))}

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
          <h2 className="font-cinzel text-lg text-[var(--gold)]">Duas for Qurbani</h2>
          {DUAS.map((d, i) => (
            <div key={i} className="bg-[var(--card)] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[var(--green)]">{d.title}</h3>
                <button
                  onClick={() => setPlayingDua(playingDua === i ? null : i)}
                  className="p-2 rounded-full bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--green)] transition-colors"
                >
                  <Play size={14} />
                </button>
              </div>
              <p className="font-amiri text-2xl text-[var(--gold)] text-right leading-loose" dir="rtl">{d.arabic}</p>
              <p className="text-xs italic text-[var(--muted)]">{d.transliteration}</p>
              <p className="text-xs text-[var(--text)]">{d.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QurbaniGuidePage;
