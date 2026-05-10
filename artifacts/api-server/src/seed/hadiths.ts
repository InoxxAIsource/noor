import { setAllHadiths } from "../lib/db.js";
import { nanoid } from "nanoid";

const HADITH_DATA = [
  { text: "Actions are judged by intentions, and every person will get the reward according to what he has intended.", source: "Bukhari & Muslim", arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ" },
  { text: "The best of you is the one who learns the Quran and teaches it.", source: "Bukhari", arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ" },
  { text: "None of you truly believes until he loves for his brother what he loves for himself.", source: "Bukhari & Muslim", arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ" },
  { text: "The strong man is not the one who overcomes people by his strength, but the one who controls himself while in anger.", source: "Bukhari & Muslim", arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ" },
  { text: "Speak good or remain silent.", source: "Bukhari & Muslim", arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْراً أَوْ لِيَصْمُتْ" },
  { text: "Make things easy and do not make them difficult, and give glad tidings and do not make people run away.", source: "Bukhari", arabic: "يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا" },
  { text: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.", source: "Bukhari & Muslim", arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ" },
  { text: "Be in this world as if you were a stranger or a traveler along a path.", source: "Bukhari", arabic: "كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ" },
  { text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", source: "Bukhari", arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْراً أَوْ لِيَصْمُتْ" },
  { text: "The dua of a Muslim for his brother in his absence is answered. Near his head is an angel; every time he makes a dua for good for his brother, the angel says 'Ameen, and for you the same.'", source: "Muslim", arabic: "دَعْوَةُ الْمَرْءِ الْمُسْلِمِ لِأَخِيهِ بِظَهْرِ الْغَيْبِ مُسْتَجَابَةٌ" },
  { text: "Whoever removes a worldly grief from a believer, Allah will remove one of the griefs of the Day of Judgement from him.", source: "Muslim", arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ الْقِيَامَةِ" },
  { text: "Smiling in the face of your brother is an act of charity.", source: "Tirmidhi", arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ" },
  { text: "Whoever wakes up safe in his home, healthy in his body, and has food for the day — it is as if the world has been given to him.", source: "Tirmidhi", arabic: "مَنْ أَصْبَحَ مِنْكُمْ آمِنًا فِي سِرْبِهِ مُعَافًى فِي جَسَدِهِ عِنْدَهُ قُوتُ يَوْمِهِ" },
  { text: "No fatigue, illness, anxiety, sorrow, harm or sadness afflicts a Muslim — even a thorn he is pricked by — except that Allah expiates some of his sins by it.", source: "Bukhari", arabic: "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ" },
  { text: "Allah is gentle and loves gentleness in all affairs.", source: "Bukhari", arabic: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ" },
  { text: "The world is a prison for the believer and a paradise for the disbeliever.", source: "Muslim", arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ" },
  { text: "Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before you become preoccupied, and your life before your death.", source: "Al-Hakim", arabic: "اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ" },
  { text: "Righteousness is good character, and sin is what wavers in your heart and you dislike that people discover it.", source: "Muslim", arabic: "الْبِرُّ حُسْنُ الْخُلُقِ" },
  { text: "Whoever is not grateful to people is not grateful to Allah.", source: "Abu Dawud", arabic: "لَا يَشْكُرُ اللَّهَ مَنْ لَا يَشْكُرُ النَّاسَ" },
  { text: "The seeking of knowledge is obligatory upon every Muslim.", source: "Ibn Majah", arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ" },
  { text: "Indeed, Allah does not look at your forms and your wealth, but He looks at your hearts and your deeds.", source: "Muslim", arabic: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ" },
  { text: "Whoever has no mercy for people, Allah will have no mercy for him.", source: "Bukhari & Muslim", arabic: "مَنْ لَا يَرْحَمِ النَّاسَ لَا يَرْحَمْهُ اللَّهُ" },
  { text: "There is no illness that Allah has created, except that He also has created its treatment.", source: "Bukhari", arabic: "مَا أَنْزَلَ اللَّهُ دَاءً إِلَّا أَنْزَلَ لَهُ شِفَاءً" },
  { text: "Do not belittle any good deed, even meeting your brother with a cheerful face.", source: "Muslim", arabic: "لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا" },
  { text: "If you put your complete trust in Allah, He will arrange for your sustenance in the same way He provides for the birds — they go out empty in the morning and return full in the evening.", source: "Tirmidhi", arabic: "لَوْ أَنَّكُمْ كُنْتُمْ تَوَكَّلُونَ عَلَى اللَّهِ حَقَّ تَوَكُّلِهِ" },
  { text: "Verily, with hardship comes ease.", source: "Quran 94:5", arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا" },
  { text: "The most complete of the believers in faith is the one with the best character.", source: "Abu Dawud", arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا" },
  { text: "Make Du'a to Allah while being certain of a response, and know that Allah does not respond to a du'a from a careless and inattentive heart.", source: "Tirmidhi", arabic: "ادْعُوا اللَّهَ وَأَنْتُمْ مُوقِنُونَ بِالإِجَابَةِ" },
];

export async function seedHadiths() {
  const hadiths = HADITH_DATA.map((h) => ({ ...h, id: nanoid() }));
  await setAllHadiths(hadiths);
  console.log(`Seeded ${hadiths.length} hadiths`);
}
