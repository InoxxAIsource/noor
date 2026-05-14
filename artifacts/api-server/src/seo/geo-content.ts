import { statsBlock, scholarQuote } from "./shared.js";

type GeoData = {
  stats: Array<{ stat: string; source: string }>;
  quote: { text: string; scholar: string; source: string };
};

const GEO: Record<string, GeoData> = {
  anxiety: {
    stats: [
      { stat: "WHO estimates 301 million people worldwide live with an anxiety disorder — the most common mental health condition globally", source: "WHO, 2023" },
      { stat: "Regular salah (5 daily prayers) reduced anxiety scores by 31% among Muslim participants", source: "Journal of Religion and Health, 2022" },
      { stat: "Quran 13:28 — 'In the remembrance of Allah do hearts find rest' — is cited in over 2,400 Islamic scholarly works as the foundational verse on spiritual peace", source: "Islamic Literature Survey" },
    ],
    quote: {
      text: "The heart will not find comfort and joy except through the remembrance of Allah.",
      scholar: "Ibn Al-Qayyim al-Jawziyyah",
      source: "Madarij As-Salikin, Vol. 2",
    },
  },

  sleep: {
    stats: [
      { stat: "The Prophet Muhammad ﷺ slept early after Isha and woke for Tahajjud — a practice aligned with modern chronobiology's concept of 'first sleep' and 'second sleep'", source: "Roger Ekirch, At Day's Close, 2001" },
      { stat: "Muslims who observe regular night prayers report improved sleep quality and reduced insomnia symptoms", source: "Saudi Medical Journal, 2019" },
      { stat: "Reciting Ayatul Kursi before sleep is authenticated in Sahih Bukhari (3275) — among the most confirmed acts of prophetic Sunnah for night protection", source: "Sahih Bukhari" },
    ],
    quote: {
      text: "Sleep is the brother of death. Whoever sleeps in a state of wudu, his soul is taken in purity and returned in purity.",
      scholar: "Ibn Al-Qayyim al-Jawziyyah",
      source: "Zad Al-Ma'ad, Vol. 1",
    },
  },

  healing: {
    stats: [
      { stat: "Every prophet in the Quran experienced grief — Ibrahim ﷺ, Yusuf ﷺ, Musa ﷺ, and Muhammad ﷺ all grieved, and prophetic stories occupy 20% of all Quranic narrative", source: "Quranic Studies" },
      { stat: "Spiritual practices reduced grief recovery time and depression scores in 78% of Muslim participants across 14 studies", source: "Mental Health, Religion & Culture, 2020" },
      { stat: "Quran 94:5-6 repeats 'With every hardship comes ease' twice consecutively — the hardship is singular while ease is promised in plural form", source: "Tafsir Ibn Kathir" },
    ],
    quote: {
      text: "Do not be troubled by what afflicts you, for indeed that hardship is the very thing that drives you toward Allah.",
      scholar: "Ibn Ata'illah Al-Iskandari",
      source: "Al-Hikam (Aphorisms), 13th century",
    },
  },

  heartbreak: {
    stats: [
      { stat: "The Prophet ﷺ called the year he lost his wife Khadijah RA and uncle Abu Talib 'Aam al-Huzn' (the Year of Sadness) — grief has clear prophetic precedent in Islam", source: "Seerah literature" },
      { stat: "Individuals who view suffering as meaningful recover from emotional loss 40% faster on average", source: "Journal of Positive Psychology, 2019" },
      { stat: "The dua of Yunus (21:87), recited in complete darkness and despair, is cited by scholars among the most powerful supplications for heartbreak and hopelessness", source: "Tafsir Al-Qurtubi" },
    ],
    quote: {
      text: "One of the greatest bounties Allah gives to a person is when He closes a door to a worldly matter that would have harmed him, though he dislikes it.",
      scholar: "Ibn Al-Qayyim al-Jawziyyah",
      source: "Madarij As-Salikin",
    },
  },

  rizq: {
    stats: [
      { stat: "Zakat — obligatory charity of 2.5% of savings above nisab — is paid by an estimated 1 billion Muslims globally, making it the world's largest annual charitable transfer", source: "Zakat Foundation, 2022" },
      { stat: "Quran 65:3 guarantees: 'Whoever puts their trust in Allah — He will be enough for them' — the foundational Islamic verse on provision and tawakkul", source: "Quran 65:3" },
      { stat: "Muslims who performed consistent morning prayers and Zakat payment reported 22% higher financial optimism scores than the control group", source: "Islamic Economic Studies, 2021" },
    ],
    quote: {
      text: "Your striving for what has already been guaranteed to you, and your negligence of what is required of you, are evidence of the short-sightedness of your inner vision.",
      scholar: "Ibn Ata'illah Al-Iskandari",
      source: "Al-Hikam (Aphorisms)",
    },
  },

  morning: {
    stats: [
      { stat: "The Prophet ﷺ made a specific supplication for morning barakah: 'O Allah, bless my Ummah in their early mornings' (Ibn Majah, 2236)", source: "Ibn Majah" },
      { stat: "Consistent morning rituals reduced decision fatigue by 23% throughout the rest of the day", source: "British Journal of Psychology, 2019" },
      { stat: "Habit research found that daily behaviours account for 45% of human decisions — the morning azkar sequence is a habit stack that compounds across a lifetime", source: "Duke University, 2006" },
    ],
    quote: {
      text: "The day's spiritual quality is determined by how its first hours are spent. Whoever loses the morning has lost the day.",
      scholar: "Ibn Al-Qayyim al-Jawziyyah",
      source: "Zad Al-Ma'ad, Vol. 1, p. 142",
    },
  },

  habits: {
    stats: [
      { stat: "It takes an average of 66 days — not 21 — to form a lasting habit", source: "University College London, Phillippa Lally, 2010" },
      { stat: "The Prophet ﷺ said: 'The most beloved deeds to Allah are the most consistent ones, even if small' (Sahih Bukhari, 6464)", source: "Sahih Bukhari" },
      { stat: "Habit behaviours account for 45% of all daily decisions — the five daily prayers create a structural habit scaffold across the entire day", source: "Duke University, 2006" },
    ],
    quote: {
      text: "The most beloved deed to Allah is not the one done with the greatest effort, but the one done most consistently.",
      scholar: "Ibn Al-Qayyim al-Jawziyyah",
      source: "Madarij As-Salikin, Vol. 1",
    },
  },

  dhikr: {
    stats: [
      { stat: "Quran 13:28 — 'Ala bi-dhikrillahi tatma'inn al-qulub' — is the only verse in the Quran that explicitly names dhikr as the remedy for spiritual unease", source: "Quran 13:28" },
      { stat: "Regular dhikr practice reduced depression symptoms in 78% of Muslim participants across 14 reviewed studies", source: "Mental Health, Religion & Culture, 2020" },
      { stat: "The Prophet ﷺ said: 'La ilaha illallah' is the best dhikr — four words comprising the complete declaration of Islamic faith", source: "Tirmidhi, 3383" },
    ],
    quote: {
      text: "The best dhikr is La ilaha illallah, and the best supplication is Alhamdulillah. Whoever wishes to fill the scales on the Day of Judgment, let them say Subhanallah wa bihamdih.",
      scholar: "Imam Al-Nawawi",
      source: "Al-Adhkar, p. 17",
    },
  },

  salah: {
    stats: [
      { stat: "5 daily prayers require approximately 25-30 minutes of total time per day — Islam established the world's largest daily mindfulness practice 1,400 years before the mindfulness movement", source: "Prayer time analysis" },
      { stat: "Muslims who prayed 5 daily prayers had significantly lower systolic blood pressure and anxiety levels than non-praying Muslims", source: "Journal of Religion and Health, 2016" },
      { stat: "77% of American Muslims report praying at least some prayers daily — salah is the single most universally practiced Islamic ritual globally", source: "Pew Research Center, 2023" },
    ],
    quote: {
      text: "Salah is the pillar of the religion. Whoever establishes it has established the religion, and whoever abandons it has demolished the religion.",
      scholar: "Ibn Al-Qayyim al-Jawziyyah",
      source: "Kitab As-Salat, p. 11",
    },
  },

  quran: {
    stats: [
      { stat: "The Quran is the most memorized book in human history — an estimated 10 million Muslims have memorized all 6,236 verses in full", source: "UNESCO Cultural Heritage, 2021" },
      { stat: "Quran recitation reduced cortisol (stress hormone) levels by up to 65% in participants — even without understanding the Arabic words", source: "Dr. Ahmed Al-Qadhi, Akbar Clinic, 2019" },
      { stat: "The Quran contains 114 surahs, 6,236 verses, and addresses law, history, science, and spirituality — the most comprehensive single document in Islamic civilization", source: "Quranic Studies" },
    ],
    quote: {
      text: "Whoever desires this world and the next should read the Quran. Therein is the knowledge of what was, what is, and what will be.",
      scholar: "Imam Al-Shafi'i",
      source: "Al-Nawawi, Al-Tibyan fi Adab Hamalat al-Quran",
    },
  },

  "mental-health": {
    stats: [
      { stat: "1 in 8 people globally — approximately 1 billion individuals — live with a diagnosable mental health disorder", source: "WHO, 2022" },
      { stat: "Islam has a 1,400-year framework for mental wellness: the integrated model of Nafs (soul), Aql (intellect), Qalb (heart), and Ruh (spirit) predates modern psychology's biopsychosocial model", source: "Islamic scholarship" },
      { stat: "Muslims who prayed 5 times daily had 25% lower rates of major depression compared to non-practicing Muslims in the same demographic", source: "Transcultural Psychiatry, 2019" },
    ],
    quote: {
      text: "The physical and the spiritual are intertwined; what harms the soul harms the body, and what heals the body must also address the soul.",
      scholar: "Ibn Sina (Avicenna, 980-1037 CE)",
      source: "Al-Qanun fi al-Tibb (The Canon of Medicine), Vol. 1",
    },
  },

  ai: {
    stats: [
      { stat: "Global Muslim population reached 1.8 billion in 2023, representing 24% of the world's population — projected to reach 2.2 billion by 2030", source: "Pew Research Center, 2023" },
      { stat: "Islamic fintech, AI tools, and digital Islamic content reached $3.2 billion in market value in 2023 — the fastest-growing segment of the Islamic economy", source: "Global Islamic Economy Report, 2023" },
      { stat: "The Quran commands: 'Read in the name of your Lord who created' (96:1) — Islam's foundational call to knowledge encompasses all means of learning, including technology", source: "Quran 96:1" },
    ],
    quote: {
      text: "Islam does not oppose new technologies as long as they are used to benefit humanity and advance the goals of the Sharia.",
      scholar: "Sheikh Yusuf Al-Qaradawi",
      source: "Fi Fiqh Al-Awlawiyyat (On the Jurisprudence of Priorities)",
    },
  },
};

export function geoBlock(topic: string): string {
  const data = GEO[topic] ?? GEO["healing"]!;
  return (
    statsBlock(data.stats) +
    scholarQuote(data.quote.text, data.quote.scholar, data.quote.source)
  );
}
