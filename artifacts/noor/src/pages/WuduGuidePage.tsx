import React, { useState } from "react";

type Tab = "wudu" | "ghusl" | "tayammum";
type Mode = "read" | "audio";

const WUDU_STEPS = [
  {
    step: 1, title: "Niyyah (Intention)",
    arabic: "نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ",
    transliteration: "Nawaytul wudu'a li raf'il hadath",
    instruction: "Make intention in your heart to purify yourself for salah.",
  },
  {
    step: 2, title: "Basmala",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    transliteration: "Bismillahir rahmanir rahim",
    instruction: "Begin in the name of Allah.",
  },
  {
    step: 3, title: "Wash Hands (3×)",
    arabic: "اللَّهُمَّ احْفَظْ يَدَيَّ",
    transliteration: "Allahumma ihfaz yadayya",
    instruction: "Wash both hands up to the wrists, 3 times.",
  },
  {
    step: 4, title: "Rinse Mouth (3×)",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى تِلَاوَةِ الْقُرْآنِ",
    transliteration: "Allahumma a'inni 'ala tilawatil Quran",
    instruction: "Take water in the right hand and rinse your mouth 3 times.",
  },
  {
    step: 5, title: "Clean Nostrils (3×)",
    arabic: "اللَّهُمَّ لَا تَحْرِمْنِي رَائِحَةَ الْجَنَّةِ",
    transliteration: "Allahumma la tahrimni ra'ihatal jannah",
    instruction: "Sniff water into the nostrils and blow out 3 times.",
  },
  {
    step: 6, title: "Wash Face (3×)",
    arabic: "اللَّهُمَّ بَيِّضْ وَجْهِي يَوْمَ تَبْيَضُّ وُجُوهٌ",
    transliteration: "Allahumma bayyid wajhi yawma tabyadu wujuh",
    instruction: "Wash the entire face 3 times, from hairline to chin.",
  },
  {
    step: 7, title: "Wash Right Arm (3×)",
    arabic: "اللَّهُمَّ أَعْطِنِي كِتَابِي بِيَمِينِي",
    transliteration: "Allahumma a'tini kitabi biyamini",
    instruction: "Wash the right arm up to and including the elbow, 3 times.",
  },
  {
    step: 8, title: "Wash Left Arm (3×)",
    arabic: "اللَّهُمَّ لَا تُعْطِنِي كِتَابِي بِشِمَالِي",
    transliteration: "Allahumma la tu'tini kitabi bishimali",
    instruction: "Wash the left arm up to and including the elbow, 3 times.",
  },
  {
    step: 9, title: "Wipe Head (1×)",
    arabic: "اللَّهُمَّ حَرِّمْ شَعَرِي وَبَشَرِي عَلَى النَّارِ",
    transliteration: "Allahumma harrim sha'ri wa bashari 'alan nar",
    instruction: "Wet both hands and wipe the top of the head from front to back once.",
  },
  {
    step: 10, title: "Clean Ears (1×)",
    arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ",
    transliteration: "Allahumma ij'alni minal ladhina yastami'unal qawl",
    instruction: "Insert wet index fingers into the ears and wipe outside with thumbs.",
  },
  {
    step: 11, title: "Wash Feet (3×)",
    arabic: "اللَّهُمَّ ثَبِّتْ قَدَمَيَّ عَلَى الصِّرَاطِ",
    transliteration: "Allahumma thabbit qadamayya 'alas sirat",
    instruction: "Wash both feet up to and including the ankles, right then left, 3 times.",
  },
];

const GHUSL_STEPS = [
  { step: 1, title: "Niyyah", instruction: "Make intention for ghusl (ritual purification).", arabic: "نَوَيْتُ الْغُسْلَ لِرَفْعِ الْجَنَابَةِ", transliteration: "Nawaytul ghusla li raf'il janabah" },
  { step: 2, title: "Wash Hands (3×)", instruction: "Wash both hands to the wrists three times.", arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah" },
  { step: 3, title: "Remove Impurity", instruction: "Wash away any visible impurity from the body.", arabic: "", transliteration: "" },
  { step: 4, title: "Perform Wudu", instruction: "Perform complete wudu as normal (except washing the feet, do at the end).", arabic: "", transliteration: "" },
  { step: 5, title: "Pour Water, Head", instruction: "Pour water over the head three times, ensuring it reaches the roots of hair.", arabic: "", transliteration: "" },
  { step: 6, title: "Pour Water, Right Side", instruction: "Pour water over the right side of the body three times.", arabic: "", transliteration: "" },
  { step: 7, title: "Pour Water, Left Side", instruction: "Pour water over the left side of the body three times.", arabic: "", transliteration: "" },
  { step: 8, title: "Wash Feet", instruction: "Move to a clean area and wash both feet.", arabic: "", transliteration: "" },
];

const TAYAMMUM_STEPS = [
  { step: 1, title: "Niyyah", instruction: "Make intention for tayammum due to absence of water or valid excuse.", arabic: "نَوَيْتُ التَّيَمُّمَ", transliteration: "Nawaytut tayammum" },
  { step: 2, title: "Strike Clean Earth", instruction: "Strike clean earth or dust once with both palms.", arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah" },
  { step: 3, title: "Wipe Face", instruction: "Wipe the entire face once with both palms.", arabic: "", transliteration: "" },
  { step: 4, title: "Strike Again", instruction: "Strike the earth again with both palms.", arabic: "", transliteration: "" },
  { step: 5, title: "Wipe Arms", instruction: "Wipe the right arm to the elbow with the left palm, then the left arm with the right palm.", arabic: "", transliteration: "" },
];

const WuduGuidePage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("wudu");
  const [mode, setMode] = useState<Mode>("read");
  const [activeStep, setActiveStep] = useState(0);

  const steps = tab === "wudu" ? WUDU_STEPS : tab === "ghusl" ? GHUSL_STEPS : TAYAMMUM_STEPS;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)] space-y-3">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Purification Guide</h1>
        <div className="flex bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1 gap-1">
          {(["wudu","ghusl","tayammum"] as Tab[]).map((t) => (
            <button key={t} onClick={() => { setTab(t); setActiveStep(0); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-[var(--green)] text-white" : "text-[var(--muted)]"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex bg-[var(--card)] border border-[var(--border)] rounded-xl p-1 gap-1 w-48 mx-auto">
          {(["read","audio"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${mode === m ? "bg-[var(--green)] text-white" : "text-[var(--muted)]"}`}>
              {m === "read" ? "📖 Read" : "🔊 Audio"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {mode === "read" ? (
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className={`bg-[var(--surface)] border rounded-2xl p-4 transition-colors ${
                i === activeStep ? "border-[var(--green)]" : "border-[var(--border)]"
              }`} onClick={() => setActiveStep(i)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    i === activeStep ? "bg-[var(--green)] text-white" : "bg-[var(--card)] text-[var(--gold)]"
                  }`}>{s.step}</div>
                  <h3 className="font-semibold text-[var(--text)]">{s.title}</h3>
                </div>
                <p className="text-sm text-[var(--muted)] mb-3 leading-relaxed">{s.instruction}</p>
                {s.arabic && (
                  <div className="bg-[var(--card)] rounded-xl p-3 space-y-1">
                    <p className="font-amiri text-xl text-[var(--gold)] text-right" dir="rtl">{s.arabic}</p>
                    <p className="text-xs italic text-[var(--muted)]">{s.transliteration}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 flex flex-col items-center">
            <div className="bg-[var(--surface)] border-2 border-[var(--green)] rounded-3xl p-8 w-full text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--green)] flex items-center justify-center text-2xl font-cinzel text-white font-bold mx-auto mb-4">
                {steps[activeStep]?.step}
              </div>
              <h2 className="font-cinzel text-2xl text-[var(--gold)] mb-3">{steps[activeStep]?.title}</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-4">{steps[activeStep]?.instruction}</p>
              {steps[activeStep]?.arabic && (
                <>
                  <p className="font-amiri text-3xl text-[var(--gold)] leading-loose mb-2" dir="rtl">{steps[activeStep].arabic}</p>
                  <p className="text-sm italic text-[var(--muted)]">{steps[activeStep].transliteration}</p>
                </>
              )}
            </div>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                disabled={activeStep === 0}
                className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--muted)] disabled:opacity-40"
              >← Previous</button>
              <button
                onClick={() => setActiveStep((p) => Math.min(steps.length - 1, p + 1))}
                disabled={activeStep === steps.length - 1}
                className="flex-1 py-3 rounded-xl bg-[var(--green)] text-white font-semibold disabled:opacity-40"
              >Next →</button>
            </div>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeStep ? "bg-[var(--green)] w-6" : "bg-[var(--border)]"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WuduGuidePage;
