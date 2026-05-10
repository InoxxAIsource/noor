import { setAllDuas } from "../lib/db.js";
import { nanoid } from "nanoid";

const DUA_DATA = [
  // Morning
  { title: "Waking Up", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur", meaningEnglish: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.", source: "Bukhari", category: "Morning", isPopular: true },
  { title: "After Waking Up (Short)", arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", transliteration: "La ilaha illallahu wahdahu la sharika lah", meaningEnglish: "There is no god but Allah alone, with no partner.", source: "Bukhari", category: "Morning", isPopular: true },
  { title: "Morning Supplication", arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur", meaningEnglish: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is our resurrection.", source: "Tirmidhi", category: "Morning", isPopular: true },
  { title: "Dua for Good Day", arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا", transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbalan", meaningEnglish: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.", source: "Ibn Majah", category: "Morning", isPopular: true },
  { title: "Sayyid al-Istighfar", arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ", transliteration: "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana 'abduk", meaningEnglish: "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am your servant.", source: "Bukhari", category: "Forgiveness", isPopular: true },
  // Evening
  { title: "Evening Supplication", arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir", meaningEnglish: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.", source: "Tirmidhi", category: "Evening", isPopular: true },
  { title: "Protection from Evil", arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", transliteration: "A'udhu bikalimati-llahit-tammati min sharri ma khalaq", meaningEnglish: "I seek refuge in the perfect words of Allah from the evil of what He has created.", source: "Muslim", category: "Protection", isPopular: true },
  { title: "Ayatul Kursi for Protection", arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", transliteration: "Allahu la ilaha illa huwal-hayyul-qayyum", meaningEnglish: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.", source: "Quran 2:255", category: "Evening", isPopular: true },
  // Forgiveness
  { title: "Seeking Forgiveness", arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ", transliteration: "Astaghfiru-llahul-'adhimal-ladhi la ilaha illa huwal-hayyul-qayyumu wa atubu ilayh", meaningEnglish: "I seek forgiveness from Allah, the Magnificent, beside whom there is no god, the Ever-Living, the Eternal, and I repent to Him.", source: "Tirmidhi", category: "Forgiveness", isPopular: true },
  { title: "Repentance", arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ", transliteration: "Rabbighfir li wa tub 'alayya innaka anta-ttawwabur-rahim", meaningEnglish: "My Lord, forgive me and accept my repentance. You are the Accepter of repentance, the Merciful.", source: "Abu Dawud", category: "Forgiveness", isPopular: false },
  // Protection
  { title: "Dua for Protection from Hardship", arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan", meaningEnglish: "O Allah, I seek refuge in You from anxiety and sorrow.", source: "Bukhari", category: "Protection", isPopular: true },
  { title: "The Three Quls for Protection", arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", transliteration: "Qul Huwa Allahu Ahad", meaningEnglish: "Say: He is Allah, the One. (Recite Surahs Ikhlas, Falaq, Nas 3x)", source: "Quran 112-114", category: "Protection", isPopular: true },
  // Food
  { title: "Before Eating", arabic: "بِسْمِ اللَّهِ", transliteration: "Bismillah", meaningEnglish: "In the name of Allah.", source: "Abu Dawud", category: "Daily Life", isPopular: true },
  { title: "After Eating", arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ", transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin", meaningEnglish: "Praise be to Allah who fed us and gave us drink and made us Muslims.", source: "Abu Dawud", category: "Daily Life", isPopular: true },
  // Sleep
  { title: "Before Sleeping", arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", transliteration: "Bismika Allahumma amutu wa ahya", meaningEnglish: "In Your name, O Allah, I die and I live.", source: "Bukhari", category: "Sleep", isPopular: true },
  { title: "Dua for Good Sleep", arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak", meaningEnglish: "O Allah, save me from Your punishment on the Day You resurrect Your servants.", source: "Abu Dawud", category: "Sleep", isPopular: false },
  // Travel
  { title: "Before Travel", arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin", meaningEnglish: "Glory be to Him who has subjected this to us, and we could not have [otherwise] subdued it.", source: "Quran 43:13", category: "Travel", isPopular: true },
  // Anxiety & hardship
  { title: "Dua for Anxiety", arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", transliteration: "La ilaha illa anta subhanaka inni kuntu minadh-dhalimin", meaningEnglish: "There is no god but You, Glory be to You, truly I was among the wrongdoers.", source: "Quran 21:87", category: "Hardship", isPopular: true },
  { title: "Dua of Yunus AS", arabic: "لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ ٱلظَّـٰلِمِينَ", transliteration: "La ilaha illa anta subhanaka inni kuntu minadh-dhalimin", meaningEnglish: "None has the right to be worshipped but You, Glorified are You. Truly, I have been of the wrongdoers.", source: "Quran 21:87", category: "Hardship", isPopular: true },
  { title: "Dua for Strength", arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", transliteration: "Rabbish-rah li sadri wa yassir li amri", meaningEnglish: "My Lord, expand for me my breast and ease for me my task.", source: "Quran 20:25-26", category: "Hardship", isPopular: true },
  // Gratitude
  { title: "Dua of Gratitude", arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ", transliteration: "Rabbi awzi'ni an ashkura ni'mataka", meaningEnglish: "My Lord, enable me to be grateful for Your favor.", source: "Quran 27:19", category: "Gratitude", isPopular: false },
  // Salah
  { title: "Before Salah (Iqamah)", arabic: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ", transliteration: "Allahumma-j'alni minat-tawwabin wa-j'alni minal-mutatahhirin", meaningEnglish: "O Allah, make me among those who repent and among those who purify themselves.", source: "Tirmidhi", category: "Salah", isPopular: false },
  { title: "After Salah", arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ", transliteration: "Allahumma anta-s-salamu wa minka-s-salam", meaningEnglish: "O Allah, You are Peace and from You is peace.", source: "Muslim", category: "Salah", isPopular: true },
  // Quran
  { title: "Before Reciting Quran", arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", transliteration: "A'udhu billahi minash-shaytanir-rajim", meaningEnglish: "I seek refuge with Allah from the accursed devil.", source: "Quran 16:98", category: "Quran", isPopular: true },
  // Family
  { title: "Dua for Parents", arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", transliteration: "Rabbir-hamhuma kama rabbayani saghira", meaningEnglish: "My Lord, have mercy upon them as they brought me up when I was small.", source: "Quran 17:24", category: "Family", isPopular: true },
  { title: "Dua for Righteous Spouse", arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun", meaningEnglish: "Our Lord, grant us from among our wives and offspring comfort to our eyes.", source: "Quran 25:74", category: "Family", isPopular: true },
];

export async function seedDuas() {
  const duas = DUA_DATA.map((d) => ({
    id: nanoid(),
    madhab: null,
    audioUrl: null,
    tags: [d.category.toLowerCase()],
    isFavorite: false,
    ...d,
  }));

  await setAllDuas(duas);
  console.log(`Seeded ${duas.length} duas`);
}
