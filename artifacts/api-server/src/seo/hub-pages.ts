import { Router } from "express";
import { seoHead, page, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, ctaBlock, esc } from "./shared.js";
import {
  hubHero, clusterNavBar, articleGrid, mostReadSection, startHereBox,
  guidedJourneysBlock, peopleAlsoAsk, conversationalBlock, emotionalCTA, quickAnswerBox,
} from "./seo-components.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function hubSchema(title: string, desc: string, slug: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": desc,
    "url": `https://mytazki.com${slug}`,
    "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" },
    "dateModified": TODAY,
  };
}

// ─── Hub 1: Mental Wellness ──────────────────────────────────────────────────
router.get("/mental-wellness", (_req, res) => {
  const slug = "/mental-wellness";
  const title = "Islamic Mental Wellness, Quran & Sunnah for the Anxious Heart";
  const desc = "Everything Islam teaches about anxiety, depression, grief, overthinking, and emotional healing. Duas, Quran verses, and guided practices for inner peace.";

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Mental Wellness" },
  ];

  const allArticles = [
    { href: "/dua-for-anxiety", label: "Dua for Anxiety & Stress", desc: "The Prophet's ﷺ duas for worry and fear", tag: "Dua" },
    { href: "/quran-for-depression", label: "Quran for Depression", desc: "Verses that lift the heaviest hearts", tag: "Quran" },
    { href: "/tahajjud-for-anxiety", label: "Tahajjud for Anxiety", desc: "Night prayer as a cure for overwhelm", tag: "Prayer" },
    { href: "/dua-for-overthinking", label: "Dua for Overthinking", desc: "Stop the spiral with remembrance", tag: "Dua" },
    { href: "/surah-for-peace", label: "Best Surah for Inner Peace", desc: "Which surahs bring the deepest calm", tag: "Quran" },
    { href: "/how-to-connect-with-allah", label: "How to Connect with Allah", desc: "Practical steps to feel close to Allah again", tag: "Guide" },
    { href: "/quran-verses-about-stress", label: "Quran Verses About Stress", desc: "Allah's words for the overwhelmed soul", tag: "Quran" },
    { href: "/how-islam-brings-peace", label: "How Islam Brings Peace", desc: "The science and spirituality of Islamic calm", tag: "Guide" },
    { href: "/dua-for-loneliness", label: "Dua for Loneliness", desc: "Finding companionship through Allah", tag: "Dua" },
    { href: "/islamic-healing-from-heartbreak", label: "Islamic Healing from Heartbreak", desc: "The Islamic path through loss and pain", tag: "Healing" },
    { href: "/dua-for-grief", label: "Dua for Grief", desc: "Words of comfort for the bereaved heart", tag: "Dua" },
    { href: "/quran-verses-about-patience", label: "Quran on Sabr (Patience)", desc: "Allah's promise to those who are patient", tag: "Quran" },
    { href: "/emotional-healing-in-islam", label: "Emotional Healing in Islam", desc: "A complete guide to healing your heart", tag: "Guide" },
    { href: "/islamic-cure-for-burnout", label: "Islamic Cure for Burnout", desc: "When exhaustion meets tawakkul", tag: "Guide" },
    { href: "/dua-for-sadness", label: "Dua for Sadness", desc: "Prophetic supplications for grief and sorrow", tag: "Dua" },
    { href: "/quran-for-hopelessness", label: "Quran for Hopelessness", desc: "Never lose hope in Allah's mercy", tag: "Quran" },
    { href: "/islamic-mental-health", label: "Islamic Mental Health Guide", desc: "Islam's complete framework for wellbeing", tag: "Guide" },
    { href: "/dua-for-healing", label: "Dua for Healing", desc: "The prophetic prayer for body and soul", tag: "Dua" },
    { href: "/how-to-stop-overthinking-islam", label: "How to Stop Overthinking, Islamic Method", desc: "Practical dhikr-based techniques", tag: "Guide" },
    { href: "/quran-verses-about-hope", label: "Quran Verses About Hope", desc: "Allah's promises to the hopeful believer", tag: "Quran" },
  ];

  const body = `
${breadcrumb(breadcrumbs)}
${hubHero({
  title: "Islamic Mental Wellness",
  arabicText: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
  arabicMeaning: "Verily, in the remembrance of Allah do hearts find rest, Quran 13:28",
  subtitle: "Islam doesn't ask you to suppress your pain, it gives you a direct line to the One who heals all things. Duas, Quran verses, guided practices, and spiritual tools for the anxious, grieving, and overwhelmed soul.",
  stats: [
    { n: "20+", label: "Guides & Articles" },
    { n: "50+", label: "Duas for Emotional Healing" },
    { n: "114", label: "Surahs Available" },
  ],
})}

${clusterNavBar([
  { href: "/mental-wellness", label: "All Topics" },
  { href: "/dua-for-anxiety", label: "Anxiety" },
  { href: "/quran-for-depression", label: "Depression" },
  { href: "/dua-for-grief", label: "Grief" },
  { href: "/dua-for-loneliness", label: "Loneliness" },
  { href: "/emotional-healing-in-islam", label: "Healing" },
], "/mental-wellness")}

${quickAnswerBox(
  "Can Islam help with anxiety and mental health?",
  "Yes. Islam provides a complete framework for emotional wellbeing, from specific duas the Prophet ﷺ taught for worry and grief, to Quran verses that speak directly to the anxious heart, to practices like tahajjud and dhikr that calm the nervous system. The Quran states: 'Verily, in the remembrance of Allah do hearts find rest' (13:28). MyTazki brings all of this together in one guided app."
)}

${startHereBox([
  { label: "Read: Dua for Anxiety (Start Here)", href: "/dua-for-anxiety" },
  { label: "Explore: Quran Verses for Peace", href: "/surah-for-peace" },
  { label: "Practice: Tahajjud for Anxiety", href: "/tahajjud-for-anxiety" },
  { label: "Journey: 7-Day Inner Peace Journey", href: "/7-day-inner-peace-journey" },
  { label: "Download MyTazki, Guided Azkar & Duas", href: "/download" },
])}

<h2>All Mental Wellness Guides</h2>
${articleGrid(allArticles, 3)}

${mostReadSection([
  { href: "/dua-for-anxiety", label: "Dua for Anxiety and Stress", desc: "The most-read guide on our site" },
  { href: "/quran-for-depression", label: "Quran for Depression", desc: "Verses that millions have found healing in" },
  { href: "/how-to-connect-with-allah", label: "How to Connect with Allah Again", desc: "For those who feel spiritually disconnected" },
  { href: "/tahajjud-for-anxiety", label: "Tahajjud for Anxiety", desc: "The night prayer that changes everything" },
  { href: "/emotional-healing-in-islam", label: "Complete Guide to Emotional Healing in Islam", desc: "Our most comprehensive resource" },
])}

${guidedJourneysBlock([
  { href: "/7-day-inner-peace-journey", title: "7-Day Inner Peace Journey", subtitle: "A guided daily program using Quran, dua, and dhikr to restore peace to an anxious heart.", days: "7 Days", icon: "☮️" },
  { href: "/reconnect-with-allah-journey", title: "Reconnect with Allah Journey", subtitle: "Step-by-step spiritual rebuilding for those who feel distant from their deen.", days: "14 Days", icon: "🌙" },
])}

${peopleAlsoAsk([
  { q: "What does Islam say about anxiety and depression?", a: "Islam acknowledges that sadness, anxiety, and grief are natural human experiences. The Prophet ﷺ himself experienced deep grief and Allah revealed Surah Ad-Duha to comfort him. Islam offers duas, dhikr, salah, and community as tools for healing, not a command to suppress emotion." },
  { q: "Which dua calms the heart immediately?", a: "The most recommended is: 'Allahumma inni a'udhu bika minal-hammi wal-hazan' (O Allah, I seek refuge in You from worry and grief). Also powerful: 'Hasbunallahu wa ni'mal wakil' (Allah is sufficient for us, and He is the best disposer of affairs), Quran 3:173." },
  { q: "Can reading Quran help with depression?", a: "Yes. The Quran contains verses that speak directly to hopelessness, grief, and anxiety. Surah Ad-Duha (93), Surah Al-Inshirah (94), and Surah Al-Fatiha are particularly healing. Regular recitation has been linked to reduced cortisol levels and increased feelings of peace." },
  { q: "Is it haram to feel anxious or depressed in Islam?", a: "No. Feeling anxious, sad, or depressed is not a sin in Islam. What matters is how we respond, turning to Allah, seeking help, making dua, and avoiding despair. The Prophet ﷺ said: 'No fatigue, disease, sorrow, sadness or harm befalls a Muslim, even a thorn that pricks him, except that Allah expiates some of his sins.' (Bukhari)" },
])}

${conversationalBlock(["Can Islam help anxiety", "which dua calms the heart", "what surah gives peace", "Islamic cure for depression", "how to stop worrying Islam", "dua for sad feelings", "Quran mental health", "how to feel close to Allah again"])}

${emotionalCTA({
  title: "Start Your Healing Journey with MyTazki",
  subtitle: "Guided duas, azkar, and spiritual sessions, designed for the overwhelmed, anxious, and heartbroken Muslim.",
  href: "/download",
  btnText: "Download MyTazki Free →",
})}

${faqHtml([
  { q: "Is Islamic mental wellness different from regular therapy?", a: "Islamic wellness complements therapy, it adds the spiritual dimension: connection to Allah, belief in qadr, dua, salah, and community. Many Muslims find that combining Islamic practices with professional support gives the most complete healing." },
  { q: "How does MyTazki help with mental wellness?", a: "MyTazki offers guided audio sessions (including a HEALING category), a curated duas library with 110+ authentic duas, daily azkar, AI Islamic companion for questions, and streak-based habit building, all in one app." },
])}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [hubSchema(title, desc, slug), breadcrumbSchema(breadcrumbs), faqSchema([{ q: "Is Islamic mental wellness different from regular therapy?", a: "Islamic wellness complements therapy." }])] }), body));
});

// ─── Hub 2: Salah ────────────────────────────────────────────────────────────
router.get("/salah", (_req, res) => {
  const slug = "/salah";
  const title = "Salah, Complete Islamic Prayer Guide, Tips & Motivation";
  const desc = "Everything about salah: how to pray, how to focus, how to never miss Fajr again, how to build a consistent prayer habit, and how salah heals the heart.";

  const breadcrumbs = [{ name: "Home", item: "/" }, { name: "Salah" }];

  const body = `
${breadcrumb(breadcrumbs)}
${hubHero({
  title: "Salah, The Pillar That Holds Everything",
  arabicText: "إِنَّ الصَّلَاةَ تَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنكَرِ",
  arabicMeaning: "Indeed, prayer prevents immorality and wrongdoing, Quran 29:45",
  subtitle: "Salah is not a ritual. It is the direct conversation between you and Allah, five times a day, every day. Whether you're starting, struggling, or want to go deeper, this is your complete guide.",
  stats: [{ n: "5", label: "Daily Prayers" }, { n: "17+", label: "Prayer Guides" }, { n: "24/7", label: "Prayer Times" }],
})}

${clusterNavBar([
  { href: "/salah", label: "All" },
  { href: "/how-to-wake-up-for-fajr", label: "Fajr" },
  { href: "/tahajjud-prayer-guide", label: "Tahajjud" },
  { href: "/how-to-focus-in-salah", label: "Focus" },
  { href: "/missed-prayers-qada", label: "Missed Prayers" },
  { href: "/prayer-times", label: "Prayer Times" },
], "/salah")}

${quickAnswerBox("How do I build a consistent salah habit?", "Start with one prayer you currently miss most (usually Fajr) and commit to it for 21 days. Set two alarms, one 15 minutes before, one at the time. Make wudu the night before for Fajr. Keep your prayer mat out. Track your streak in MyTazki. The Prophet ﷺ said the most beloved deeds to Allah are those done consistently, even if small.")}

${startHereBox([
  { label: "How to Stop Missing Salah", href: "/how-to-stop-missing-salah" },
  { label: "How to Wake Up for Fajr (7 Methods)", href: "/how-to-wake-up-for-fajr" },
  { label: "How to Focus in Salah (Khushu Guide)", href: "/how-to-focus-in-salah" },
  { label: "7-Day Salah Reset Journey", href: "/7-day-salah-reset" },
  { label: "Track Your Prayers in MyTazki", href: "/download" },
])}

${articleGrid([
  { href: "/how-to-stop-missing-salah", label: "How to Stop Missing Salah", desc: "The system that actually works", tag: "Habit" },
  { href: "/how-to-wake-up-for-fajr", label: "How to Wake Up for Fajr", desc: "7 proven methods for the early prayer", tag: "Fajr" },
  { href: "/how-to-focus-in-salah", label: "How to Focus in Salah", desc: "Achieving khushu in every rakaat", tag: "Khushu" },
  { href: "/why-salah-is-important", label: "Why Salah is Important", desc: "The purpose behind the five pillars", tag: "Foundation" },
  { href: "/salah-benefits", label: "Benefits of Salah", desc: "Scientific + spiritual evidence", tag: "Proof" },
  { href: "/how-to-make-salah-habit", label: "Making Salah a Daily Habit", desc: "Habit science meets Islamic practice", tag: "Habit" },
  { href: "/missed-prayers-qada", label: "How to Make Up Missed Prayers", desc: "Qada salah, your complete guide", tag: "Fiqh" },
  { href: "/dua-before-salah", label: "Duas Before and After Salah", desc: "Prophetic supplications for prayer", tag: "Dua" },
  { href: "/tahajjud-prayer-guide", label: "Tahajjud Prayer Guide", desc: "The night prayer that transforms lives", tag: "Tahajjud" },
  { href: "/how-to-pray-tahajjud", label: "How to Pray Tahajjud Step by Step", desc: "A beginner's complete walkthrough", tag: "Tahajjud" },
  { href: "/fajr-prayer-tips", label: "Fajr Prayer Tips", desc: "Never miss Fajr again", tag: "Fajr" },
  { href: "/khushu-in-salah", label: "Khushu in Salah, Deep Focus Guide", desc: "The heart of every prayer", tag: "Khushu" },
  { href: "/salah-and-mental-health", label: "Salah and Mental Health", desc: "How prayer heals the mind", tag: "Wellness" },
  { href: "/salah-motivation", label: "Islamic Salah Motivation", desc: "For when you feel too tired to pray", tag: "Motivation" },
  { href: "/night-prayer-benefits", label: "Benefits of Night Prayer", desc: "Why the last third of the night is special", tag: "Tahajjud" },
], 3)}

${guidedJourneysBlock([
  { href: "/7-day-salah-reset", title: "7-Day Salah Reset", subtitle: "A guided week to rebuild your prayer habit from the ground up, with daily intentions and reflection prompts.", days: "7 Days", icon: "🕌" },
  { href: "/morning-barakah-routine", title: "Morning Barakah Routine", subtitle: "Start every morning with Fajr, adhkar, and intention-setting for a blessed day.", days: "Daily", icon: "🌅" },
])}

${peopleAlsoAsk([
  { q: "What to do if I keep missing salah?", a: "Start with sincere tawbah (repentance), Allah forgives all sins. Then identify which prayer you miss most and make it your single focus for 2 weeks. Use an app like MyTazki to log each prayer and build a streak. The habit compound effect is powerful." },
  { q: "How many rakaats is each prayer?", a: "Fajr: 2 fard. Dhuhr: 4 fard. Asr: 4 fard. Maghrib: 3 fard. Isha: 4 fard. Each has additional Sunnah and Nafl prayers. MyTazki's Salah Guide walks through each prayer step by step." },
  { q: "Can I pray Tahajjud every night?", a: "Yes, Tahajjud is a Sunnah Mu'akkadah (strongly encouraged voluntary prayer) that the Prophet ﷺ almost never left. The best time is the last third of the night, before Fajr. Even 2 rakaats count." },
  { q: "What is khushu in salah?", a: "Khushu is the state of humble concentration, presence, and awe in salah. It means your heart is attentive to Allah while your body is in prayer. The Quran says the successful believers are those 'who are humble in their prayers' (23:2)." },
])}

${conversationalBlock(["how to stop missing salah", "how to wake up for fajr tips", "tahajjud prayer benefits", "how to focus in prayer Islam", "salah habit building", "why is salah important", "how many rakaats in fajr", "can I make up missed prayers"])}

${emotionalCTA({ title: "Track Every Prayer. Build Your Streak. Grow.", subtitle: "Log salah, rate your khushu, set prayer time reminders, and build the habit of a lifetime.", href: "/download", btnText: "Start Tracking Salah Free →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [hubSchema(title, desc, slug), breadcrumbSchema(breadcrumbs)] }), body));
});

// ─── Hub 3: Quran Reflections ─────────────────────────────────────────────────
router.get("/quran-reflections", (_req, res) => {
  const slug = "/quran-reflections";
  const title = "Quran Reflections, Deep Tafsir, Verses & Daily Recitation";
  const desc = "Deep reflections on Quran surahs and verses. Tafsir, meanings, Arabic text, and guided daily reading. Surah Rahman, Mulk, Kahf, Yusuf, and more.";
  const breadcrumbs = [{ name: "Home", item: "/" }, { name: "Quran Reflections" }];

  const body = `
${breadcrumb(breadcrumbs)}
${hubHero({
  title: "Quran Reflections",
  arabicText: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ",
  arabicMeaning: "A blessed Book We revealed to you so that they may reflect upon its verses, Quran 38:29",
  subtitle: "The Quran is not just recitation, it is meant to be pondered, felt, and lived. These reflections go beyond translation to help you hear what Allah is saying to your heart, specifically, today.",
  stats: [{ n: "114", label: "Surahs" }, { n: "6,236", label: "Verses" }, { n: "20+", label: "Deep Reflections" }],
})}

${articleGrid([
  { href: "/surah-rahman-reflection", label: "Surah Rahman Reflection", desc: "Which of Allah's favours will you deny?", tag: "Surah 55" },
  { href: "/surah-mulk-reflection", label: "Surah Mulk, Nightly Shield", desc: "Protection from the grave", tag: "Surah 67" },
  { href: "/surah-fatiha-reflection", label: "Surah Al-Fatiha Deep Reflection", desc: "The 7 verses that contain the whole Quran", tag: "Surah 1" },
  { href: "/surah-duha-reflection", label: "Surah Ad-Duha, When Darkness Lifts", desc: "Allah's comfort to the Prophet ﷺ (and you)", tag: "Surah 93" },
  { href: "/surah-kahf-reflection", label: "Surah Al-Kahf, Friday Surah", desc: "The four stories that define the believer", tag: "Surah 18" },
  { href: "/surah-yusuf-reflection", label: "Surah Yusuf, The Beautiful Story", desc: "Patience, betrayal, and divine plan", tag: "Surah 12" },
  { href: "/ayatul-kursi-reflection", label: "Ayatul Kursi Deep Reflection", desc: "The greatest verse in the Quran", tag: "Verse 2:255" },
  { href: "/quran-about-anxiety", label: "What the Quran Says About Anxiety", desc: "Divine answers for worried hearts", tag: "Theme" },
  { href: "/quran-verses-about-hope", label: "Quran Verses About Hope", desc: "Never despair of Allah's mercy", tag: "Theme" },
  { href: "/quran-verses-about-mercy", label: "Quran on Allah's Mercy", desc: "His mercy exceeds all things", tag: "Theme" },
  { href: "/quran-verses-about-healing", label: "Quran Verses for Healing", desc: "The Quran as shifa for body and soul", tag: "Theme" },
  { href: "/quran-verses-about-gratitude", label: "Quran on Gratitude (Shukr)", desc: "If you are grateful, I will increase you", tag: "Theme" },
  { href: "/quran-on-patience", label: "Quran on Sabr, Patience", desc: "Allah is with the patient", tag: "Theme" },
  { href: "/surah-baqarah-reflection", label: "Surah Al-Baqarah Highlights", desc: "Key verses from the longest surah", tag: "Surah 2" },
  { href: "/surah-inshirah-reflection", label: "Surah Al-Inshirah, Relief Always Comes", desc: "For every hardship, two reliefs", tag: "Surah 94" },
  { href: "/quran-for-forgiveness", label: "Quran on Forgiveness & Tawbah", desc: "Allah's open door for the repentant", tag: "Theme" },
  { href: "/best-surahs-for-morning", label: "Best Surahs to Read in the Morning", desc: "Start your day with these powerful surahs", tag: "Practice" },
  { href: "/quran-daily-reading-guide", label: "Daily Quran Reading Guide", desc: "How to read Quran every day", tag: "Habit" },
], 3)}

${guidedJourneysBlock([
  { href: "/reconnect-with-allah-journey", title: "Reconnect with Allah Journey", subtitle: "14 days of guided Quran reflection, dua, and spiritual practice to feel close to Allah again.", days: "14 Days", icon: "📖" },
])}

${peopleAlsoAsk([
  { q: "Which surah should I read daily?", a: "Scholars recommend: Surah Al-Fatiha (in every prayer), Surah Al-Kahf (every Friday), Surah Al-Mulk (every night before sleep), and Ayatul Kursi (after every fard prayer). For morning: Surahs Ikhlas, Falaq, and Nas, 3 times each." },
  { q: "How do I understand Quran if I don't speak Arabic?", a: "Read a transliteration alongside a clear English translation (Sahih International or Dr. Mustafa Khattab). Focus on meaning verse by verse. Use MyTazki's Quran reader which shows Arabic, transliteration, and translation together. Attend Tafsir circles when possible." },
  { q: "What is the best surah for healing?", a: "Surah Al-Fatiha is called 'Umm al-Kitab' (the mother of the Book) and is known as a complete healing. The Prophet ﷺ described reciting Surah Al-Fatiha over someone as ruqyah (spiritual healing). Ayatul Kursi also provides protection and peace." },
])}

${emotionalCTA({ title: "Read the Quran Daily, With Reflection", subtitle: "All 114 surahs with Arabic, transliteration, translation, audio, and bookmarks in MyTazki.", href: "/download", btnText: "Open the Quran in MyTazki →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [hubSchema(title, desc, slug), breadcrumbSchema(breadcrumbs)] }), body));
});

// ─── Hub 4: Islamic Habits ───────────────────────────────────────────────────
router.get("/islamic-habits", (_req, res) => {
  const slug = "/islamic-habits";
  const title = "Islamic Habits, Build a Life of Barakah, Discipline & Spiritual Growth";
  const desc = "Build powerful Islamic daily habits: morning routine, azkar, Quran reading, salah tracking, dhikr, and evening reflection. The Muslim productivity framework.";
  const breadcrumbs = [{ name: "Home", item: "/" }, { name: "Islamic Habits" }];

  const body = `
${breadcrumb(breadcrumbs)}
${hubHero({
  title: "Islamic Habits for a Blessed Life",
  arabicText: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
  arabicMeaning: "The most beloved deeds to Allah are those done consistently, even if small, Prophet ﷺ (Bukhari)",
  subtitle: "You don't need a perfect day, you need consistent small acts. Islam is built on daily habits: salah, azkar, Quran, fasting. This hub shows you how to make them automatic.",
  stats: [{ n: "5", label: "Daily Prayers" }, { n: "33x", label: "Morning Dhikr" }, { n: "20+", label: "Habit Guides" }],
})}

${articleGrid([
  { href: "/daily-muslim-routine", label: "Complete Daily Muslim Routine", desc: "From Fajr to Isha, a blessed structure", tag: "Routine" },
  { href: "/morning-routine-muslim", label: "Islamic Morning Routine", desc: "The first 90 minutes that define your day", tag: "Morning" },
  { href: "/islamic-night-routine", label: "Islamic Night Routine", desc: "Evening azkar and sleep duas", tag: "Evening" },
  { href: "/islamic-habit-tracker", label: "Islamic Habit Tracker Guide", desc: "Track salah, azkar, Quran daily", tag: "Tracking" },
  { href: "/muslim-productivity-habits", label: "Muslim Productivity Habits", desc: "Halal productivity science meets sunnah", tag: "Productivity" },
  { href: "/dhikr-daily-habit", label: "Making Dhikr a Daily Habit", desc: "The 99 names, tasbeeh, and more", tag: "Dhikr" },
  { href: "/quran-daily-habit", label: "Daily Quran Habit Guide", desc: "Read one page a day, finish the Quran in a year", tag: "Quran" },
  { href: "/islamic-self-improvement", label: "Islamic Self-Improvement Framework", desc: "Deen-first personal development", tag: "Growth" },
  { href: "/islamic-discipline", label: "Islamic Discipline Guide", desc: "Willpower, nafs, and tawbah cycle", tag: "Discipline" },
  { href: "/gratitude-in-islam", label: "Gratitude in Islam (Shukr)", desc: "The habit of thankfulness that multiplies blessings", tag: "Gratitude" },
  { href: "/islamic-sleep-routine", label: "Islamic Sleep Routine", desc: "Sunnah sleep practices for rest and protection", tag: "Sleep" },
  { href: "/islamic-time-management", label: "Islamic Time Management", desc: "Barakah in your hours and days", tag: "Time" },
  { href: "/30-day-islamic-challenge", label: "30-Day Islamic Growth Challenge", desc: "One month to transform your deen", tag: "Challenge" },
  { href: "/halal-productivity", label: "Halal Productivity Guide", desc: "Ali Huda principles for modern Muslims", tag: "Productivity" },
  { href: "/evening-azkar-routine", label: "Evening Azkar Routine", desc: "The prophetic evening remembrances", tag: "Azkar" },
], 3)}

${guidedJourneysBlock([
  { href: "/morning-barakah-routine", title: "Morning Barakah Routine", subtitle: "A 30-day guided morning practice: Fajr, azkar, Quran, and intention-setting for a blessed day.", days: "30 Days", icon: "🌅" },
  { href: "/tahajjud-transformation-journey", title: "Tahajjud Transformation Journey", subtitle: "21 nights of guided tahajjud practice to reshape your relationship with Allah in the quiet hours.", days: "21 Nights", icon: "🌙" },
])}

${peopleAlsoAsk([
  { q: "What habits do successful Muslims practice daily?", a: "The five daily prayers (salah), morning and evening azkar, daily Quran recitation (even one page), dhikr after prayers, and regular charity. Studies of Islamic daily structure show these habits reduce anxiety, increase focus, and build a sense of purpose." },
  { q: "How do I build a consistent Islamic daily routine?", a: "Start with your anchor: salah. Build everything else around prayer times. Use habit stacking, attach new habits (Quran, azkar) to existing ones (after prayer). Track progress in MyTazki. Celebrate streaks. Start with 2-3 habits, not 20." },
])}

${emotionalCTA({ title: "Build Your Islamic Habit System in MyTazki", subtitle: "Salah tracker, Quran reader, tasbih counter, azkar library, everything for your daily deen in one app.", href: "/download", btnText: "Start Building Habits →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [hubSchema(title, desc, slug), breadcrumbSchema(breadcrumbs)] }), body));
});

// ─── Hub 5: AI Islamic Tools ──────────────────────────────────────────────────
router.get("/ai-islamic-tools", (_req, res) => {
  const slug = "/ai-islamic-tools";
  const title = "AI Islamic Tools, AI Quran, Dua, Tafsir & Islamic Assistant";
  const desc = "The best AI tools for Muslims: AI Quran explainer, AI tafsir, AI dua generator, AI Islamic coach, and the MyTazki AI companion. Ask any Islamic question.";
  const breadcrumbs = [{ name: "Home", item: "/" }, { name: "AI Islamic Tools" }];

  const body = `
${breadcrumb(breadcrumbs)}
${hubHero({
  title: "AI Islamic Tools for the Modern Muslim",
  arabicText: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
  arabicMeaning: "Read in the name of your Lord who created, Quran 96:1 (The first revelation)",
  subtitle: "Islam has always embraced knowledge. Today, AI gives every Muslim access to instant Islamic guidance, Quran explanations, fatwa guidance, dua suggestions, and a personal Islamic coach. Grounded in authentic scholarship.",
  stats: [{ n: "20 req", label: "Daily AI Queries Free" }, { n: "Claude AI", label: "Powered By" }, { n: "15+", label: "AI Islamic Pages" }],
})}

${articleGrid([
  { href: "/ai-islamic-assistant", label: "AI Islamic Assistant", desc: "Ask any Islamic question, answered with adab", tag: "AI Tool" },
  { href: "/ai-quran-explainer", label: "AI Quran Explainer", desc: "Deep verse explanations powered by AI", tag: "Quran AI" },
  { href: "/ask-islam-ai", label: "Ask Islam, AI Q&A", desc: "Instant answers to Islamic questions", tag: "AI Tool" },
  { href: "/islamic-ai-companion", label: "Islamic AI Companion", desc: "Your personal guide to Islamic living", tag: "AI Tool" },
  { href: "/quran-ai-reflection", label: "AI Quran Reflection Tool", desc: "Personalized Quran reflections with AI", tag: "Quran AI" },
  { href: "/ai-fatwa-guide", label: "AI Fatwa Guide", desc: "Understanding Islamic rulings with AI assistance", tag: "Fiqh AI" },
  { href: "/ai-tafsir", label: "AI Tafsir, Quran Commentary", desc: "Classical tafsir made accessible through AI", tag: "Tafsir" },
  { href: "/ai-islamic-coach", label: "AI Islamic Life Coach", desc: "Personalized guidance for your spiritual journey", tag: "Coaching" },
  { href: "/ai-dua-generator", label: "AI Dua Suggestion Tool", desc: "Find the right dua for any situation", tag: "Dua AI" },
  { href: "/best-islamic-ai-apps", label: "Best AI Apps for Muslims in 2026", desc: "Comparison of Islamic AI tools", tag: "Comparison" },
  { href: "/ai-for-muslims", label: "How Muslims Are Using AI", desc: "The rise of Islamic AI tools", tag: "Insight" },
  { href: "/chatgpt-for-islamic-questions", label: "ChatGPT for Islamic Questions, Is It Safe?", desc: "What to use and what to avoid", tag: "Guide" },
], 3)}

${quickAnswerBox("Is it permissible to use AI for Islamic questions?", "Using AI for Islamic guidance is permissible with the right approach. AI should assist in learning and exploration, not replace qualified scholars for formal rulings (fatawa). MyTazki's AI companion is designed with Islamic adab guidelines, it cites Quran and hadith, avoids controversial rulings, and always recommends consulting a scholar for complex matters. Think of it as a knowledgeable study companion, not a mufti.")}

${peopleAlsoAsk([
  { q: "Can I use ChatGPT to ask Islamic questions?", a: "You can use AI tools for general Islamic learning, understanding concepts, finding Quran verses, learning about Islamic history. For specific legal rulings (fatawa), always consult a qualified scholar. AI may have errors in fiqh. MyTazki's AI is specifically trained with Islamic guidelines and adab." },
  { q: "What is the best AI app for Muslims?", a: "MyTazki offers the most complete Islamic AI experience: AI companion powered by Claude, 20 free queries per day, Islamic adab guidelines, plus prayer times, Quran, duas, and habits, all integrated. Other apps offer AI features but lack the complete Islamic lifestyle context." },
  { q: "How does AI explain the Quran?", a: "AI can explain Quran verses by drawing from classical tafsir sources (Ibn Kathir, Al-Tabari, Al-Qurtubi), linguistic analysis, and contextual understanding. MyTazki's AI Quran explainer does this in accessible, emotionally resonant language while citing authentic sources." },
])}

${emotionalCTA({ title: "Try the MyTazki AI Companion, Free", subtitle: "20 Islamic questions per day. Powered by Claude. Guided by Islamic adab. Ask anything.", href: "/download", btnText: "Try AI Companion Free →" })}
`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [hubSchema(title, desc, slug), breadcrumbSchema(breadcrumbs)] }), body));
});

export default router;
