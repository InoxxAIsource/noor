import React, { useState } from "react";

type Prayer = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
type Mode = "read" | "audio";

const PRAYERS: Record<Prayer, { rakaat: number; description: string }> = {
  Fajr:   { rakaat: 2, description: "2 Fard rak'at • Dawn prayer before sunrise" },
  Dhuhr:  { rakaat: 4, description: "4 Fard rak'at • Midday prayer" },
  Asr:    { rakaat: 4, description: "4 Fard rak'at • Afternoon prayer" },
  Maghrib:{ rakaat: 3, description: "3 Fard rak'at • Sunset prayer" },
  Isha:   { rakaat: 4, description: "4 Fard rak'at • Night prayer" },
};

const RAKAAT_STEPS = [
  { title: "Niyyah (Intention)", instruction: "Make intention in your heart for this specific salah.", arabic: "نَوَيْتُ أَنْ أُصَلِّيَ", transliteration: "Nawaitu an usalli..." },
  { title: "Takbir al-Ihram", instruction: "Raise both hands to the ears and say Allahu Akbar.", arabic: "ٱللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar" },
  { title: "Thana (Opening Dua)", instruction: "Fold hands and recite the opening supplication quietly.", arabic: "سُبْحَانَكَ ٱللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ ٱسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَـٰهَ غَيْرُكَ", transliteration: "Subhanakallahumma wa bihamdika wa tabarakasmuka wa ta'ala jadduka wa la ilaha ghayruk" },
  { title: "Ta'awwudh", instruction: "Seek refuge in Allah from Shaytan.", arabic: "أَعُوذُ بِٱللَّهِ مِنَ ٱلشَّيْطَٰنِ ٱلرَّجِيمِ", transliteration: "A'udhu billahi minash shaytanir rajim" },
  { title: "Surah Al-Fatiha", instruction: "Recite Surah Al-Fatiha. After finishing, the imam or worshipper says 'Ameen'.", arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ مَـٰلِكِ يَوْمِ ٱلدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", transliteration: "Bismillahir rahmanir rahim. Alhamdu lillahi rabbil 'alamin. Ar-rahmanir rahim. Maliki yawmid din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas siratal mustaqim. Siratal ladhina an'amta 'alayhim. Ghayril maghdubi 'alayhim wa lad dallin. Ameen." },
  { title: "Additional Surah", instruction: "In 1st and 2nd rak'at (Fard), recite any surah. E.g. Al-Ikhlas:", arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ", transliteration: "Qul huwallahu ahad. Allahus samad. Lam yalid wa lam yulad. Wa lam yakullahu kufuwan ahad." },
  { title: "Ruku' (Bowing)", instruction: "Say Allahu Akbar and bow. Place hands on knees. Recite 3 times:", arabic: "سُبْحَانَ رَبِّيَ ٱلْعَظِيمِ", transliteration: "Subhana rabbiyal 'azim" },
  { title: "Qawmah (Rising from Ruku')", instruction: "Rise saying: Sami'allahu liman hamidah. Then say:", arabic: "رَبَّنَا لَكَ ٱلْحَمْدُ", transliteration: "Rabbana lakal hamd" },
  { title: "First Sujud (Prostration)", instruction: "Say Allahu Akbar and go into sujud. Forehead, nose, both palms, knees, and toes on the ground. Recite 3 times:", arabic: "سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ", transliteration: "Subhana rabbiyal a'la" },
  { title: "Jalsa (Sitting Between Prostrations)", instruction: "Rise from sujud saying Allahu Akbar. Sit briefly and recite:", arabic: "رَبِّ ٱغْفِرْ لِي", transliteration: "Rabbighfir li" },
  { title: "Second Sujud", instruction: "Go into sujud again. Recite 3 times:", arabic: "سُبْحَانَ رَبِّيَ ٱلْأَعْلَىٰ", transliteration: "Subhana rabbiyal a'la" },
  { title: "Qa'dah (Sitting)", instruction: "After the 2nd rak'at (and final rak'at), sit and recite Tashahhud:", arabic: "ٱلتَّحِيَّاتُ لِلَّهِ وَٱلصَّلَوَاتُ وَٱلطَّيِّبَاتُ ٱلسَّلَامُ عَلَيْكَ أَيُّهَا ٱلنَّبِيُّ وَرَحْمَةُ ٱللَّهِ وَبَرَكَاتُهُ ٱلسَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ ٱللَّهِ ٱلصَّالِحِينَ أَشْهَدُ أَن لَّا إِلَـٰهَ إِلَّا ٱللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", transliteration: "Attahiyyatu lillahi was salawatu wat tayyibat. Assalamu 'alayka ayyuhan nabiyyu wa rahmatullahi wa barakatuh. Assalamu 'alayna wa 'ala 'ibadillahis salihin. Ashhadu alla ilaha illallah wa ashhadu anna Muhammadan 'abduhu wa rasuluh." },
  { title: "Salawat Ibrahim", instruction: "In the final sitting, after Tashahhud, recite Salawat on the Prophet ﷺ:", arabic: "ٱللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَّجِيدٌ", transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid." },
  { title: "Salam", instruction: "Turn head to the right saying: Assalamu 'alaykum wa rahmatullah. Then to the left:", arabic: "ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّهِ", transliteration: "Assalamu 'alaykum wa rahmatullah" },
];

const SalahGuidePage: React.FC = () => {
  const [prayer, setPrayer] = useState<Prayer>("Fajr");
  const [mode, setMode] = useState<Mode>("read");
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)] space-y-3">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">How to Pray</h1>
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {(Object.keys(PRAYERS) as Prayer[]).map((p) => (
            <button key={p} onClick={() => { setPrayer(p); setActiveStep(0); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${prayer === p ? "bg-[var(--green)] text-white" : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]"}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="bg-[var(--card)] rounded-xl px-4 py-2 text-xs text-[var(--muted)] text-center">
          {PRAYERS[prayer].description}
        </div>
        <div className="flex bg-[var(--card)] border border-[var(--border)] rounded-xl p-1 gap-1 w-48 mx-auto">
          {(["read","audio"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === m ? "bg-[var(--green)] text-white" : "text-[var(--muted)]"}`}>
              {m === "read" ? "📖 Read" : "🔊 Guide"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {mode === "read" ? (
          <div className="space-y-3">
            {RAKAAT_STEPS.map((s, i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--green)]/20 border border-[var(--green)]/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--gold)] text-xs font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-[var(--text)]">{s.title}</h3>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{s.instruction}</p>
                {s.arabic && (
                  <div className="bg-[var(--card)] rounded-xl p-3 space-y-1">
                    <p className="font-amiri text-xl text-[var(--gold)] text-right leading-loose" dir="rtl">{s.arabic}</p>
                    <p className="text-xs italic text-[var(--muted)]">{s.transliteration}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-[var(--surface)] border-2 border-[var(--green)] rounded-3xl p-8 w-full text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--green)] flex items-center justify-center text-2xl font-cinzel text-white font-bold mx-auto mb-4">
                {activeStep + 1}
              </div>
              <h2 className="font-cinzel text-xl text-[var(--gold)] mb-3">{RAKAAT_STEPS[activeStep]?.title}</h2>
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">{RAKAAT_STEPS[activeStep]?.instruction}</p>
              {RAKAAT_STEPS[activeStep]?.arabic && (
                <>
                  <p className="font-amiri text-2xl text-[var(--gold)] leading-loose mb-2" dir="rtl">{RAKAAT_STEPS[activeStep].arabic}</p>
                  <p className="text-xs italic text-[var(--muted)]">{RAKAAT_STEPS[activeStep].transliteration}</p>
                </>
              )}
            </div>
            <div className="flex gap-4 w-full">
              <button onClick={() => setActiveStep((p) => Math.max(0, p - 1))} disabled={activeStep === 0}
                className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--muted)] disabled:opacity-40">← Previous</button>
              <button onClick={() => setActiveStep((p) => Math.min(RAKAAT_STEPS.length - 1, p + 1))} disabled={activeStep === RAKAAT_STEPS.length - 1}
                className="flex-1 py-3 rounded-xl bg-[var(--green)] text-white font-semibold disabled:opacity-40">Next →</button>
            </div>
            <div className="flex gap-1 flex-wrap justify-center">
              {RAKAAT_STEPS.map((_, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className={`h-2 rounded-full transition-all ${i === activeStep ? "bg-[var(--green)] w-6" : "w-2 bg-[var(--border)]"}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalahGuidePage;
