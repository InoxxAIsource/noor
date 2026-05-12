import { setAllSessions } from "../lib/db.js";
import { nanoid } from "nanoid";

const SESSIONS = [
  // AZKAR
  { category: "AZKAR", title: "Morning Azkar Full", durationSeconds: 600, scriptureRef: "Quran 3:41", scriptureArabic: "وَسَبِّحْ بِٱلْعَشِىِّ وَٱلْإِبْكَـٰرِ", scriptureText: "And glorify Him in the evening and in the morning." },
  { category: "AZKAR", title: "Dua After Fajr", durationSeconds: 480, scriptureRef: "Hadith - Abu Dawud", scriptureArabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا", scriptureText: "O Allah, I ask You for beneficial knowledge." },
  { category: "AZKAR", title: "Dua for Rizq", durationSeconds: 420, scriptureRef: "Quran 65:3", scriptureArabic: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ", scriptureText: "Whoever relies upon Allah, then He is sufficient for him." },
  { category: "AZKAR", title: "Ayatul Kursi Explained", durationSeconds: 540, scriptureRef: "Quran 2:255", scriptureArabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", scriptureText: "Allah, there is no deity except Him, the Ever-Living, the Sustainer of existence." },
  { category: "AZKAR", title: "Evening Azkar Full", durationSeconds: 600, scriptureRef: "Quran 33:42", scriptureArabic: "وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا", scriptureText: "And exalt Him morning and afternoon." },
  // QURAN
  { category: "QURAN", title: "Surah Fatiha Reflection", durationSeconds: 720, scriptureRef: "Quran 1:1-7", scriptureArabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", scriptureText: "All praise is due to Allah, Lord of all worlds." },
  { category: "QURAN", title: "Ayatul Kursi Deep Dive", durationSeconds: 780, scriptureRef: "Quran 2:255", scriptureArabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", scriptureText: "Allah, there is no deity except Him." },
  { category: "QURAN", title: "Surah Ar-Rahman", durationSeconds: 900, scriptureRef: "Quran 55:13", scriptureArabic: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ", scriptureText: "So which of the favors of your Lord would you deny?" },
  { category: "QURAN", title: "Last Three Surahs", durationSeconds: 600, scriptureRef: "Quran 112-114", scriptureArabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", scriptureText: "Say: He is Allah, the One." },
  { category: "QURAN", title: "Surah Al-Kahf", durationSeconds: 840, scriptureRef: "Quran 18:10", scriptureArabic: "رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً", scriptureText: "Our Lord, grant us from Yourself mercy." },
  // DHIKR
  { category: "DHIKR", title: "SubhanAllah 33x with Meaning", durationSeconds: 600, scriptureRef: "Hadith - Muslim", scriptureArabic: "سُبْحَانَ ٱللَّهِ", scriptureText: "Glory be to Allah." },
  { category: "DHIKR", title: "Salawat on the Prophet", durationSeconds: 540, scriptureRef: "Quran 33:56", scriptureArabic: "إِنَّ ٱللَّهَ وَمَلَـٰٓئِكَتَهُۥ يُصَلُّونَ عَلَى ٱلنَّبِىِّ", scriptureText: "Indeed, Allah and His angels send blessing upon the Prophet." },
  { category: "DHIKR", title: "La ilaha illallah Meditation", durationSeconds: 720, scriptureRef: "Hadith - Tirmidhi", scriptureArabic: "لَا إِلَهَ إِلَّا اللَّهُ", scriptureText: "There is no god but Allah." },
  { category: "DHIKR", title: "Istighfar Session", durationSeconds: 600, scriptureRef: "Quran 71:10", scriptureArabic: "فَقُلْتُ ٱسْتَغْفِرُوا۟ رَبَّكُمْ إِنَّهُۥ كَانَ غَفَّارًا", scriptureText: "I said: Ask forgiveness of your Lord. Indeed, He is ever a Perpetual Forgiver." },
  // SLEEP
  { category: "SLEEP", title: "Ibrahim AS and the Fire", durationSeconds: 1200, scriptureRef: "Quran 21:69", scriptureArabic: "يَـٰنَارُ كُونِى بَرْدًا وَسَلَـٰمًا", scriptureText: "O fire, be cool and safe for Ibrahim." },
  { category: "SLEEP", title: "Yunus AS in the Whale", durationSeconds: 1080, scriptureRef: "Quran 21:87", scriptureArabic: "لَّآ إِلَـٰهَ إِلَّآ أَنتَ سُبْحَـٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّـٰلِمِينَ", scriptureText: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." },
  { category: "SLEEP", title: "Musa AS and the Sea", durationSeconds: 1140, scriptureRef: "Quran 26:63", scriptureArabic: "فَأَوْحَيْنَآ إِلَىٰ مُوسَىٰٓ أَنِ ٱضْرِب بِّعَصَاكَ ٱلْبَحْرَ", scriptureText: "We inspired Moses: Strike the sea with your staff." },
  { category: "SLEEP", title: "The Night Journey: Isra and Miraj", durationSeconds: 1200, scriptureRef: "Quran 17:1", scriptureArabic: "سُبْحَـٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًا", scriptureText: "Exalted is He who took His Servant by night." },
  // DUA60
  { category: "DUA60", title: "60s Dua for Anxiety", durationSeconds: 60, scriptureRef: "Quran 13:28", scriptureArabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", scriptureText: "Verily, in the remembrance of Allah do hearts find rest." },
  { category: "DUA60", title: "60s Morning Fiat", durationSeconds: 60, scriptureRef: "Hadith - Abu Dawud", scriptureArabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا", scriptureText: "O Allah, by Your grace we have reached morning." },
  { category: "DUA60", title: "60s Dua for Gratitude", durationSeconds: 60, scriptureRef: "Quran 14:7", scriptureArabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", scriptureText: "If you are grateful, I will surely increase you in favor." },
  { category: "DUA60", title: "60s Dua Before Sleep", durationSeconds: 60, scriptureRef: "Hadith - Bukhari", scriptureArabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", scriptureText: "In Your name, O Allah, I die and I live." },
  // SALAH
  { category: "SALAH", title: "Understanding Fatiha in Salah", durationSeconds: 720, scriptureRef: "Quran 1:1-7", scriptureArabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", scriptureText: "All praise is due to Allah, Lord of all worlds." },
  { category: "SALAH", title: "Khushoo Guide", durationSeconds: 840, scriptureRef: "Quran 23:2", scriptureArabic: "ٱلَّذِينَ هُمْ فِى صَلَاتِهِمْ خَـٰشِعُونَ", scriptureText: "Those who are during their prayer humbly submissive." },
  { category: "SALAH", title: "Post-Salah Dhikr", durationSeconds: 600, scriptureRef: "Hadith - Muslim", scriptureArabic: "سُبْحَانَ ٱللَّهِ ×33 اَلْحَمْدُ لِلَّهِ ×33 اَللهُ أَكْبَرُ ×33", scriptureText: "SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 33x." },
  // HEALING
  { category: "HEALING", title: "Healing Through Sujood", durationSeconds: 600, scriptureRef: "Quran 96:19", scriptureArabic: "وَٱسْجُدْ وَٱقْتَرِب", scriptureText: "Prostrate and draw near [to Allah]." },
  { category: "HEALING", title: "Dua for Overthinking", durationSeconds: 480, scriptureRef: "Quran 13:28", scriptureArabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", scriptureText: "Verily, in the remembrance of Allah do hearts find rest." },
  { category: "HEALING", title: "Surah Ad-Duha Reflection", durationSeconds: 720, scriptureRef: "Quran 93:5", scriptureArabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", scriptureText: "And your Lord is going to give you, and you will be satisfied." },
  { category: "HEALING", title: "Trusting Allah in Hard Times", durationSeconds: 600, scriptureRef: "Quran 65:3", scriptureArabic: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ", scriptureText: "Whoever relies upon Allah, then He is sufficient for him." },
  { category: "HEALING", title: "Slowing Down in Salah", durationSeconds: 540, scriptureRef: "Quran 2:45", scriptureArabic: "وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ", scriptureText: "And seek help through patience and prayer." },
  { category: "HEALING", title: "Sleep with Ayatul Kursi", durationSeconds: 900, scriptureRef: "Quran 2:255", scriptureArabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", scriptureText: "Allah, there is no deity except Him, the Ever-Living, the Sustainer of existence." },
  { category: "HEALING", title: "Letting Go with Tawakkul", durationSeconds: 600, scriptureRef: "Quran 3:159", scriptureArabic: "فَتَوَكَّلْ عَلَى ٱللَّهِ ۚ إِنَّ ٱللَّهَ يُحِبُّ ٱلْمُتَوَكِّلِينَ", scriptureText: "And rely upon Allah. Indeed, Allah loves those who rely upon Him." },
  { category: "HEALING", title: "Tahajjud Companion", durationSeconds: 1200, scriptureRef: "Quran 17:79", scriptureArabic: "وَمِنَ ٱلَّيْلِ فَتَهَجَّدْ بِهِۦ نَافِلَةً لَّكَ", scriptureText: "And rise from sleep for prayer as an extra offering for you." },
  { category: "HEALING", title: "Rizq Anxiety Session", durationSeconds: 480, scriptureRef: "Quran 11:6", scriptureArabic: "وَمَا مِن دَآبَّةٍۢ فِى ٱلْأَرْضِ إِلَّا عَلَى ٱللَّهِ رِزْقُهَا", scriptureText: "There is no creature on earth but that upon Allah is its provision." },
  { category: "HEALING", title: "Finding Peace After Isha", durationSeconds: 600, scriptureRef: "Quran 93:11", scriptureArabic: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ", scriptureText: "And speak of the favor of your Lord." },
];

export async function seedSessions() {
  const sessions = SESSIONS.map((s) => ({
    id: nanoid(),
    slug: s.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    guideName: "MyTazki Team",
    audioUrl: null,
    isPremium: false,
    language: "en",
    tags: [s.category.toLowerCase()],
    madhab: null,
    playCount: 0,
    description: `A ${Math.floor(s.durationSeconds / 60)}-minute ${s.category.toLowerCase()} session.`,
    ...s,
  }));

  await setAllSessions(sessions);
  console.log(`Seeded ${sessions.length} sessions`);
}

export const HEALING_SESSIONS = SESSIONS.filter(s => s.category === "HEALING");
