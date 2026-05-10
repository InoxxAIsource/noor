import { setAllNames } from "../lib/db.js";
import { nanoid } from "nanoid";

const NAME_DATA = [
  // Boys
  { nameEnglish: "Muhammad", nameArabic: "مُحَمَّد", nameUrdu: "محمد", gender: "boy", meaningEnglish: "Praised one", meaningUrdu: "تعریف کیا گیا", origin: "Arabic", quranReference: null, prophetConnection: "The Prophet's name", popularityRank: 1, trending2025: true },
  { nameEnglish: "Ahmed", nameArabic: "أَحْمَد", nameUrdu: "احمد", gender: "boy", meaningEnglish: "Most praiseworthy", meaningUrdu: "سب سے زیادہ قابل تعریف", origin: "Arabic", quranReference: "61:6", prophetConnection: "Another name of the Prophet", popularityRank: 2, trending2025: true },
  { nameEnglish: "Ibrahim", nameArabic: "إِبْرَاهِيم", nameUrdu: "ابراہیم", gender: "boy", meaningEnglish: "Father of nations", meaningUrdu: "قوموں کا باپ", origin: "Arabic/Hebrew", quranReference: "2:124", prophetConnection: "Prophet Ibrahim AS", popularityRank: 3, trending2025: false },
  { nameEnglish: "Yusuf", nameArabic: "يُوسُف", nameUrdu: "یوسف", gender: "boy", meaningEnglish: "God increases", meaningUrdu: "اللہ زیادہ کرتا ہے", origin: "Arabic/Hebrew", quranReference: "12:4", prophetConnection: "Prophet Yusuf AS", popularityRank: 4, trending2025: true },
  { nameEnglish: "Omar", nameArabic: "عُمَر", nameUrdu: "عمر", gender: "boy", meaningEnglish: "Flourishing, long-lived", meaningUrdu: "خوشحال، طویل عمر", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 5, trending2025: false },
  { nameEnglish: "Ali", nameArabic: "عَلِيّ", nameUrdu: "علی", gender: "boy", meaningEnglish: "High, elevated, noble", meaningUrdu: "اعلی، بلند، شریف", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 6, trending2025: false },
  { nameEnglish: "Adam", nameArabic: "آدَم", nameUrdu: "آدم", gender: "boy", meaningEnglish: "First man", meaningUrdu: "پہلا انسان", origin: "Arabic/Hebrew", quranReference: "2:31", prophetConnection: "Prophet Adam AS", popularityRank: 7, trending2025: true },
  { nameEnglish: "Musa", nameArabic: "مُوسَى", nameUrdu: "موسیٰ", gender: "boy", meaningEnglish: "Saved from water", meaningUrdu: "پانی سے بچایا گیا", origin: "Arabic/Hebrew", quranReference: "2:51", prophetConnection: "Prophet Musa AS", popularityRank: 8, trending2025: false },
  { nameEnglish: "Isa", nameArabic: "عِيسَى", nameUrdu: "عیسیٰ", gender: "boy", meaningEnglish: "Jesus", meaningUrdu: "عیسیٰ", origin: "Arabic/Hebrew", quranReference: "3:45", prophetConnection: "Prophet Isa AS", popularityRank: 9, trending2025: false },
  { nameEnglish: "Yahya", nameArabic: "يَحْيَى", nameUrdu: "یحییٰ", gender: "boy", meaningEnglish: "He shall live", meaningUrdu: "وہ جیئے گا", origin: "Arabic/Hebrew", quranReference: "19:7", prophetConnection: "Prophet Yahya AS", popularityRank: 10, trending2025: false },
  { nameEnglish: "Dawud", nameArabic: "دَاوُد", nameUrdu: "داؤد", gender: "boy", meaningEnglish: "Beloved", meaningUrdu: "محبوب", origin: "Arabic/Hebrew", quranReference: "4:163", prophetConnection: "Prophet Dawud AS", popularityRank: 11, trending2025: false },
  { nameEnglish: "Sulayman", nameArabic: "سُلَيْمَان", nameUrdu: "سلیمان", gender: "boy", meaningEnglish: "Man of peace", meaningUrdu: "امن کا آدمی", origin: "Arabic/Hebrew", quranReference: "27:15", prophetConnection: "Prophet Sulayman AS", popularityRank: 12, trending2025: false },
  { nameEnglish: "Zayd", nameArabic: "زَيْد", nameUrdu: "زید", gender: "boy", meaningEnglish: "Abundance, growth", meaningUrdu: "فراوانی، نشوونما", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 13, trending2025: true },
  { nameEnglish: "Bilal", nameArabic: "بِلَال", nameUrdu: "بلال", gender: "boy", meaningEnglish: "Moisture, one who refreshes", meaningUrdu: "نمی", origin: "Arabic", quranReference: null, prophetConnection: "Bilal ibn Rabah, Companion", popularityRank: 14, trending2025: false },
  { nameEnglish: "Hamza", nameArabic: "حَمْزَة", nameUrdu: "حمزہ", gender: "boy", meaningEnglish: "Strong, steadfast", meaningUrdu: "مضبوط، ثابت قدم", origin: "Arabic", quranReference: null, prophetConnection: "Hamza ibn Abd al-Muttalib, uncle of the Prophet", popularityRank: 15, trending2025: true },
  { nameEnglish: "Hassan", nameArabic: "حَسَن", nameUrdu: "حسن", gender: "boy", meaningEnglish: "Handsome, good", meaningUrdu: "خوبصورت، اچھا", origin: "Arabic", quranReference: null, prophetConnection: "Grandson of the Prophet", popularityRank: 16, trending2025: false },
  { nameEnglish: "Hussain", nameArabic: "حُسَيْن", nameUrdu: "حسین", gender: "boy", meaningEnglish: "Good, handsome", meaningUrdu: "اچھا، خوبصورت", origin: "Arabic", quranReference: null, prophetConnection: "Grandson of the Prophet", popularityRank: 17, trending2025: false },
  { nameEnglish: "Idris", nameArabic: "إِدْرِيس", nameUrdu: "ادریس", gender: "boy", meaningEnglish: "Interpreter", meaningUrdu: "مفسر", origin: "Arabic", quranReference: "19:56", prophetConnection: "Prophet Idris AS", popularityRank: 18, trending2025: true },
  { nameEnglish: "Yunus", nameArabic: "يُونُس", nameUrdu: "یونس", gender: "boy", meaningEnglish: "Dove", meaningUrdu: "کبوتر", origin: "Arabic/Hebrew", quranReference: "10:98", prophetConnection: "Prophet Yunus AS", popularityRank: 19, trending2025: false },
  { nameEnglish: "Luqman", nameArabic: "لُقْمَان", nameUrdu: "لقمان", gender: "boy", meaningEnglish: "Wise", meaningUrdu: "دانا", origin: "Arabic", quranReference: "31:12", prophetConnection: null, popularityRank: 20, trending2025: false },
  // Girls
  { nameEnglish: "Fatima", nameArabic: "فَاطِمَة", nameUrdu: "فاطمہ", gender: "girl", meaningEnglish: "Abstaining, weaning", meaningUrdu: "دودھ چھڑانے والی", origin: "Arabic", quranReference: null, prophetConnection: "Daughter of the Prophet", popularityRank: 1, trending2025: true },
  { nameEnglish: "Aisha", nameArabic: "عَائِشَة", nameUrdu: "عائشہ", gender: "girl", meaningEnglish: "She who lives, lively", meaningUrdu: "زندہ رہنے والی", origin: "Arabic", quranReference: null, prophetConnection: "Wife of the Prophet", popularityRank: 2, trending2025: true },
  { nameEnglish: "Khadija", nameArabic: "خَدِيجَة", nameUrdu: "خدیجہ", gender: "girl", meaningEnglish: "Early baby", meaningUrdu: "وقت سے پہلے پیدا ہونے والی", origin: "Arabic", quranReference: null, prophetConnection: "First wife of the Prophet", popularityRank: 3, trending2025: false },
  { nameEnglish: "Maryam", nameArabic: "مَرْيَم", nameUrdu: "مریم", gender: "girl", meaningEnglish: "Lady, beloved", meaningUrdu: "خاتون، محبوب", origin: "Arabic/Hebrew", quranReference: "19:16", prophetConnection: "Mother of Prophet Isa AS", popularityRank: 4, trending2025: true },
  { nameEnglish: "Zainab", nameArabic: "زَيْنَب", nameUrdu: "زینب", gender: "girl", meaningEnglish: "Father's precious jewel", meaningUrdu: "باپ کا قیمتی جوہر", origin: "Arabic", quranReference: null, prophetConnection: "Daughter of the Prophet", popularityRank: 5, trending2025: false },
  { nameEnglish: "Sara", nameArabic: "سَارَة", nameUrdu: "سارہ", gender: "girl", meaningEnglish: "Princess, lady of high rank", meaningUrdu: "شہزادی", origin: "Arabic/Hebrew", quranReference: null, prophetConnection: "Wife of Prophet Ibrahim AS", popularityRank: 6, trending2025: true },
  { nameEnglish: "Asma", nameArabic: "أَسْمَاء", nameUrdu: "اسماء", gender: "girl", meaningEnglish: "Excellent, prestigious", meaningUrdu: "بہترین، معزز", origin: "Arabic", quranReference: null, prophetConnection: "Daughter of Abu Bakr", popularityRank: 7, trending2025: false },
  { nameEnglish: "Hawa", nameArabic: "حَوَّاء", nameUrdu: "حوا", gender: "girl", meaningEnglish: "Life, living", meaningUrdu: "زندگی", origin: "Arabic/Hebrew", quranReference: null, prophetConnection: "Wife of Prophet Adam AS", popularityRank: 8, trending2025: false },
  { nameEnglish: "Ruqayyah", nameArabic: "رُقَيَّة", nameUrdu: "رقیہ", gender: "girl", meaningEnglish: "Rising, moving upward", meaningUrdu: "اوپر اٹھنا", origin: "Arabic", quranReference: null, prophetConnection: "Daughter of the Prophet", popularityRank: 9, trending2025: false },
  { nameEnglish: "Hafsa", nameArabic: "حَفْصَة", nameUrdu: "حفصہ", gender: "girl", meaningEnglish: "Gathering, young lioness", meaningUrdu: "جمع کرنے والی", origin: "Arabic", quranReference: null, prophetConnection: "Wife of the Prophet", popularityRank: 10, trending2025: false },
  { nameEnglish: "Sumaya", nameArabic: "سُمَيَّة", nameUrdu: "سمیہ", gender: "girl", meaningEnglish: "High above, exalted", meaningUrdu: "بلند، برتر", origin: "Arabic", quranReference: null, prophetConnection: "First martyr in Islam", popularityRank: 11, trending2025: true },
  { nameEnglish: "Noor", nameArabic: "نُور", nameUrdu: "نور", gender: "girl", meaningEnglish: "Light", meaningUrdu: "روشنی", origin: "Arabic", quranReference: "24:35", prophetConnection: null, popularityRank: 12, trending2025: true },
  { nameEnglish: "Layla", nameArabic: "لَيْلَى", nameUrdu: "لیلیٰ", gender: "girl", meaningEnglish: "Night, dark beauty", meaningUrdu: "رات، تاریک خوبصورتی", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 13, trending2025: true },
  { nameEnglish: "Amira", nameArabic: "أَمِيرَة", nameUrdu: "امیرہ", gender: "girl", meaningEnglish: "Princess, commander", meaningUrdu: "شہزادی", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 14, trending2025: true },
  { nameEnglish: "Safiya", nameArabic: "صَفِيَّة", nameUrdu: "صفیہ", gender: "girl", meaningEnglish: "Pure, clear", meaningUrdu: "خالص، صاف", origin: "Arabic", quranReference: null, prophetConnection: "Wife of the Prophet", popularityRank: 15, trending2025: false },
  { nameEnglish: "Aminah", nameArabic: "آمِنَة", nameUrdu: "آمنہ", gender: "girl", meaningEnglish: "Truthful, trustworthy", meaningUrdu: "سچی، قابل بھروسہ", origin: "Arabic", quranReference: null, prophetConnection: "Mother of the Prophet", popularityRank: 16, trending2025: false },
  { nameEnglish: "Imaan", nameArabic: "إِيمَان", nameUrdu: "ایمان", gender: "girl", meaningEnglish: "Faith, belief", meaningUrdu: "ایمان", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 17, trending2025: true },
  { nameEnglish: "Sana", nameArabic: "سَنَاء", nameUrdu: "ثناء", gender: "girl", meaningEnglish: "Brilliance, radiance", meaningUrdu: "چمک، تابانی", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 18, trending2025: false },
  { nameEnglish: "Hana", nameArabic: "هَنَاء", nameUrdu: "ہنا", gender: "girl", meaningEnglish: "Happiness, bliss", meaningUrdu: "خوشی، سعادت", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 19, trending2025: true },
  { nameEnglish: "Yara", nameArabic: "يَارَا", nameUrdu: "یارا", gender: "girl", meaningEnglish: "Small butterfly, strength", meaningUrdu: "چھوٹی تتلی", origin: "Arabic", quranReference: null, prophetConnection: null, popularityRank: 20, trending2025: true },
];

export async function seedNames() {
  const names = NAME_DATA.map((n) => ({
    id: nanoid(),
    categories: [],
    pronunciationAudioUrl: null,
    isForbidden: false,
    similarNames: [],
    isFavorite: false,
    ...n,
  }));

  await setAllNames(names);
  console.log(`Seeded ${names.length} baby names`);
}
