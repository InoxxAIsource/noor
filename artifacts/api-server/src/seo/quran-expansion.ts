import { Router } from "express";
import { seoHead, page, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, ctaBlock, esc } from "./shared.js";
import { quickAnswerBox, peopleAlsoAsk, emotionalCTA, relatedArticlesGrid, conversationalBlock } from "./seo-components.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function articleSchema(title: string, desc: string, slug: string): object {
  return { "@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "author": { "@type": "Organization", "name": "MyTazki" }, "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" }, "datePublished": "2026-01-01", "dateModified": TODAY, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` } };
}

function speakable(slug: string): object {
  return { "@context": "https://schema.org", "@type": "WebPage", "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ai-summary", "h1"] }, "url": `https://mytazki.com${slug}` };
}

function quranBlock(arabic: string, trans: string, ref: string): string {
  return `<div style="background:rgba(52,201,122,0.05);border-radius:10px;padding:16px 20px;margin:14px 0;border:1px solid rgba(52,201,122,0.12)">
  <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.5em;line-height:2;margin:0 0 8px">${arabic}</p>
  <p style="color:#34c97a;font-style:italic;margin:0 0 6px;font-size:14px;font-family:Inter,sans-serif">${esc(trans)}</p>
  <p style="color:#6a9878;font-size:13px;margin:0;font-family:Inter,sans-serif">${esc(ref)}</p>
</div>`;
}

const QURAN_RELATED = [
  { href: "/quran-reflections", label: "Quran Reflections Hub", tag: "Hub" },
  { href: "/quran", label: "Read the Quran", tag: "Quran" },
  { href: "/ayatul-kursi-reflection", label: "Ayatul Kursi Reflection", tag: "Verse" },
  { href: "/surah-rahman-reflection", label: "Surah Rahman Reflection", tag: "Surah 55" },
  { href: "/surah-kahf-reflection", label: "Surah Al-Kahf Guide", tag: "Surah 18" },
  { href: "/reconnect-with-allah-journey", label: "Reconnect with Allah Journey", tag: "Journey" },
];

// ─── 1. Quran Verses About Hope ────────────────────────────────────────────────
router.get("/quran-verses-about-mercy", (_req, res) => {
  const slug = "/quran-verses-about-mercy"; const title = "Quran Verses About Allah's Mercy, Rahma Beyond Imagination"; const desc = "The most beautiful Quran verses about Allah's rahma (mercy). How Allah's mercy encompasses all things, and how to access it through sincere repentance and ibadah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Quran on Allah's Mercy" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What does the Quran say about Allah's mercy?", "Allah's mercy is beyond human comprehension. The Prophet ﷺ said: 'Allah has 100 parts of mercy. He sent 1 part to the world, with it, creation shows mercy to one another. He kept 99 parts for the Day of Judgement.' (Bukhari). The Quran says: 'My mercy encompasses all things' (7:156). Allah describes Himself as Ar-Rahman (the Most Merciful) and Ar-Rahim (the Continuously Merciful), these are the first two names in Al-Fatiha, which we recite at least 17 times daily.")}
${quranBlock("وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", "Wa rahmati wasi'at kulla shay'", "My mercy encompasses all things, Quran 7:156")}
${quranBlock("قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَى أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", "La taqnatu min rahmatillah. Innallaha yaghfiru adh-dhunuba jami'a", "Do not despair of Allah's mercy, indeed Allah forgives all sins, Quran 39:53")}
${quranBlock("إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ", "Innallaha la yaghfiru an yushraka bihi wa yaghfiru ma duna dhalika liman yasha'", "Indeed, Allah does not forgive association with Him, but He forgives what is less than that for whom He wills, Quran 4:48")}
<h2>Ar-Rahman vs Ar-Rahim, Understanding the Two Names</h2>
<p style="color:#a0c8a0;line-height:1.8">Both names come from the root rahma (mercy) but differ in scope: Ar-Rahman is the extensive, all-encompassing mercy that covers everyone, believers and disbelievers, humans and animals, this world and the next. Ar-Rahim is the specific, ongoing mercy reserved for believers, the mercy that continues in the next life. Every time you say Bismillah, you invoke both: extensive mercy and ongoing mercy.</p>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Read the Quran and Feel Allah's Mercy", subtitle: "All 114 surahs with translation and audio in MyTazki. Start with Surah Rahman, 78 verses of divine mercy.", href: "/download", btnText: "Read Surah Rahman in MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 2. Quran Verses About Healing ────────────────────────────────────────────
router.get("/quran-verses-about-healing", (_req, res) => {
  const slug = "/quran-verses-about-healing"; const title = "Quran Verses for Healing, Shifa of Body and Soul"; const desc = "Quranic verses for healing, physical, emotional, and spiritual. How the Quran is described as shifa (healing), which surahs and verses to recite, and how to do ruqyah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Quran for Healing" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("Which Quran verses are for healing?", "Allah describes the Quran itself as healing: 'We send down of the Quran that which is healing and mercy for the believers' (17:82). Specific healing verses: Surah Al-Fatiha (called 'Al-Shifa' by the Prophet ﷺ), Ayatul Kursi (2:255) for protection, the Mu'awwidhat (Surahs 112-114) for physical healing. The Prophet ﷺ used to blow on his hands and wipe his body with Surahs 112, 113, 114 before sleeping.")}
${quranBlock("وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", "Wa nunazzilu minal-qur'ani ma huwa shifa'un wa rahmatun lil-mu'minin", "We send down of the Quran that which is healing and mercy for the believers, Quran 17:82")}
${quranBlock("وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ", "Wa idha maridtu fa huwa yashfin", "And when I am ill, it is He who cures me, Quran 26:80 (Dua of Ibrahim ﷺ)")}
<h2>How to Use the Quran for Healing</h2>
<ol style="padding-left:20px;color:#a0c8a0;font-family:Inter,sans-serif;line-height:2.2">
  <li>Recite Surah Al-Fatiha 7 times over water, then drink it, authenticated prophetic practice (Sahih al-Bukhari)</li>
  <li>Recite Ayatul Kursi before sleep for comprehensive protection</li>
  <li>Blow on the palms and wipe the body with Surahs 112, 113, 114, the Prophet's ﷺ bedtime practice</li>
  <li>Recite the healing dua: "Allahumma Rabban-nas, adhibil-ba'sa, ashfi anta ash-shafi", 3 or 7 times over the place of pain</li>
  <li>Increase Quran recitation during illness, the Quran is shifa for whatever you face</li>
</ol>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Access Healing Quran in MyTazki", subtitle: "Surah Al-Fatiha, Ayatul Kursi, and all healing surahs with audio recitation by Sheikh Alafasy.", href: "/download", btnText: "Open Quran in MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 3. Quran Verses About Gratitude ──────────────────────────────────────────
router.get("/quran-verses-about-gratitude", (_req, res) => {
  const slug = "/quran-verses-about-gratitude"; const title = "Quran Verses About Gratitude, Shukr and the Promise of More"; const desc = "Allah's promise: 'If you are grateful, I will give you more.' The most powerful Quran verses on shukr (gratitude) and how to cultivate a grateful heart.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Quran on Gratitude" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What does the Quran say about gratitude?", "Allah makes an extraordinary promise in the Quran: 'If you are grateful, I will certainly give you more' (14:7). This is the only place where Allah directly promises an increase in response to a specific action. Gratitude (shukr) in Islam is: (1) Recognition of Allah's gifts with the heart, (2) Acknowledgement with the tongue (Alhamdulillah), and (3) Use of those gifts in obedience to Allah.")}
${quranBlock("لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ", "La'in shakartum la'azidannakum", "If you are grateful, I will certainly give you more, Quran 14:7")}
${quranBlock("فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", "Fadhkuruni adhkurkum washkuru li wa la takfurun", "Remember Me, I will remember you. Be grateful to Me and never be ungrateful, Quran 2:152")}
${quranBlock("فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", "Fabi'ayyi ala'i rabbikuma tukadhdhibaan", "So which of the favours of your Lord would you deny?, Quran 55 (repeated 31 times in Surah Rahman)")}
<h2>Why Surah Rahman Is the Gratitude Surah</h2>
<p style="color:#a0c8a0;line-height:1.8">Allah asks the same question 31 times in Surah Rahman: 'Which of the favours of your Lord would you deny?' Each time, He lists a different blessing. Scholars note that the repetition itself is the lesson: we tend to deny Allah's favours by forgetting them. The repetition forces awareness. Traditional practice: when you reach each 'Fabi'ayyi ala'i rabbikuma tukadhdhibaan', respond: 'La bi shay'in min ala'ika rabbana nukadhdhibu' (We deny none of Your favours, our Lord).</p>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Read Surah Rahman with Reflection", subtitle: "All 78 verses of Surah Rahman with Arabic, translation, and Alafasy audio in MyTazki.", href: "/download", btnText: "Open Surah Rahman →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 4. Quran on Patience ─────────────────────────────────────────────────────
router.get("/quran-on-patience", (_req, res) => {
  const slug = "/quran-on-patience"; const title = "Quran on Sabr, Every Verse About Patience Explained"; const desc = "A complete guide to what the Quran says about sabr (patience). All major verses explained with Arabic, meaning, and how to apply them when tested.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Quran on Patience (Sabr)" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is sabr in Islam and what does the Quran say about it?", "Sabr (صبر) means patient perseverance, not passive resignation but active trust in Allah's plan. The Quran mentions sabr in over 90 verses, making it the most emphasized virtue after iman. Key Quranic teachings: Allah is WITH the patient (2:153), patience earns unlimited reward (39:10), every hardship comes with ease (94:5-6), and Allah tests those He loves (2:155-157).")}
${quranBlock("يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", "Ya ayyuhalladhina amanus-ta'inu bis-sabri was-salah", "O believers, seek help through patience and prayer, Quran 2:153")}
${quranBlock("إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", "Innama yuwaffas-sabirun ajrahum bi ghayri hisab", "The patient will be given their reward without account, Quran 39:10")}
${quranBlock("وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ", "Wa la nabluwan-nakum bi shay'im minal-khawfi wal-ju'i wa naqsim minal-amwali wal-anfusi wath-thamarat. Wa bashshiris-sabirin", "We will surely test you with fear, hunger, loss of wealth and lives, and give good tidings to the patient, Quran 2:155")}
<h2>The 3 Types of Sabr in Islamic Scholarship</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:16px 0">
${[
  ["Sabr 'Ala At-Ta'ah", "Patience in performing acts of obedience, waking for Fajr when tired, fasting when hungry, praying when busy. The ongoing effort of worship."],
  ["Sabr 'An Al-Ma'siyah", "Patience in refraining from sins, resisting temptation, holding the tongue, lowering the gaze. The ongoing restraint of nafs."],
  ["Sabr 'Ala Al-Musibah", "Patience through trials and calamities, illness, loss, grief, failure. The ongoing acceptance of Allah's qadar."],
].map(([t, d]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:16px">
  <strong style="color:#34c97a;font-size:14px;font-family:DM Sans,sans-serif;display:block;margin-bottom:8px">${t}</strong>
  <p style="color:#6a9878;font-size:13px;margin:0;line-height:1.5;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Practice Sabr with Daily Quranic Guidance", subtitle: "Daily Quran reading, azkar for patience, and guided sessions on tawakkul in MyTazki.", href: "/download", btnText: "Open MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 5. Surah Al-Baqarah Reflection ───────────────────────────────────────────
router.get("/surah-baqarah-reflection", (_req, res) => {
  const slug = "/surah-baqarah-reflection"; const title = "Surah Al-Baqarah, Key Verses, Reflection & Why It Protects the Home"; const desc = "Deep reflection on Surah Al-Baqarah: its themes, most important verses, the promise of protection, Ayatul Kursi, and how to engage with the longest surah of the Quran.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Surah Al-Baqarah Reflection" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is Surah Al-Baqarah about and why is it so important?", "Surah Al-Baqarah (The Cow) is the longest surah in the Quran, 286 verses. It covers: Islamic law, the story of Banu Israel, the nature of hypocrites, the greatest verse (Ayatul Kursi, 2:255), marriage and divorce laws, fasting, zakat, and ends with the most comprehensive dua in the Quran (2:285-286). The Prophet ﷺ said: 'Recite Surah Al-Baqarah in your houses, for Shaytan does not enter a house in which Surah Al-Baqarah is recited.' (Muslim)")}
<h2>Must-Know Verses from Surah Al-Baqarah</h2>
${quranBlock("اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", "Allahu la ilaha illa huw, al-Hayyu al-Qayyum", "Ayatul Kursi, The Greatest Verse in the Quran, 2:255")}
${quranBlock("وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ", "Wa la nabluwan-nakum bi shay'im minal-khawf", "We will test you with hardship, Quran 2:155")}
${quranBlock("لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", "La yukallifu Allahu nafsan illa wus'aha", "Allah does not burden a soul beyond what it can bear, Quran 2:286")}
<p style="color:#a0c8a0;line-height:1.8">Surah Al-Baqarah ends with perhaps the most beautiful dua in the Quran (2:285-286): 'Amana ar-Rasul...', the Messenger believes in what was revealed, and so do the believers... Our Lord, do not hold us accountable if we forget or make mistakes. Our Lord, do not burden us beyond our capacity... You are our Master, so give us victory over the disbelieving people.' The Prophet ﷺ said: 'Whoever recites the last two verses of Al-Baqarah at night, they will be sufficient for him.' (Bukhari)</p>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Read Surah Al-Baqarah in MyTazki", subtitle: "All 286 verses with Arabic, transliteration, translation, and verse-by-verse audio.", href: "/download", btnText: "Open Surah Al-Baqarah →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 6. Surah Al-Inshirah Reflection ──────────────────────────────────────────
router.get("/surah-inshirah-reflection", (_req, res) => {
  const slug = "/surah-inshirah-reflection"; const title = "Surah Al-Inshirah, Relief Always Comes After Hardship"; const desc = "Deep reflection on Surah Al-Inshirah (94): the promise of ease after hardship, the opening of the Prophet's chest, and how 8 verses changed everything.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Surah Al-Inshirah Reflection" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is the message of Surah Al-Inshirah?", "Surah Al-Inshirah (The Opening of the Chest, also called Ash-Sharh) was revealed to comfort the Prophet ﷺ after a difficult period. Its 8 verses carry one of the most powerful promises in the Quran: 'With hardship comes ease', said TWICE (verses 5 and 6). Scholars note that in Arabic, the word 'hardship' (al-'usr) is specific (definite article) but 'ease' (yusra) is general (indefinite), meaning one hardship is accompanied by multiple eases.")}
${quranBlock("أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", "Alam nashrah laka sadrak", "Did We not expand your chest for you?, Quran 94:1")}
${quranBlock("فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۞ إِنَّ مَعَ الْعُسْرِ يُسْرًا", "Fa inna ma'al-'usri yusra. Inna ma'al-'usri yusra", "For indeed, with hardship will be ease. Indeed, with hardship will be ease, Quran 94:5-6")}
<h2>The Mathematical Mercy of 94:5-6</h2>
<p style="color:#a0c8a0;line-height:1.8">In Arabic, a definite noun repeated is still one instance. But an indefinite noun repeated becomes two separate instances. Therefore: al-'usr (the hardship, definite, specific) appears once. Yusra (ease, indefinite) appears twice. The Arabic mathematics: one specific hardship, two separate eases. Ibn Mas'ud RA said: 'Even if hardship entered a hole, ease would enter it and overcome it twice over.'</p>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Read Surah Al-Inshirah Today", subtitle: "All 8 verses with Arabic, transliteration, audio, and reflection prompts in MyTazki.", href: "/download", btnText: "Open MyTazki Quran →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 7. Quran for Forgiveness ──────────────────────────────────────────────────
router.get("/quran-for-forgiveness", (_req, res) => {
  const slug = "/quran-for-forgiveness"; const title = "Quran on Forgiveness, Allah's Open Door for the Repentant"; const desc = "What the Quran says about seeking forgiveness, tawbah (repentance), and Allah's promise to forgive. The duas, verses, and process of Islamic repentance.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Quran on Forgiveness" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How does the Quran describe Allah's forgiveness?", "Allah describes His forgiveness using multiple names: Al-Ghafur (The All-Forgiving), Al-Ghaffar (The Repeatedly Forgiving), Al-'Afu (The Pardoner), At-Tawwab (The Acceptor of Repentance). Allah says: 'He forgives all sins' (39:53), 'My mercy encompasses all things' (7:156), and 'I am the Accepting of Repentance, the Merciful' (2:37). The Prophet ﷺ said: 'Allah stretches out His hand at night to accept the repentance of the one who sinned during the day, and He stretches out His hand by day to accept the repentance of the one who sinned during the night.' (Muslim)")}
${quranBlock("إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", "Innallaha yaghfiru adh-dhunuba jami'a", "Indeed, Allah forgives all sins, Quran 39:53")}
${quranBlock("وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنفُسَهُمْ ذَكَرُوا اللَّهَ فَاسْتَغْفَرُوا لِذُنُوبِهِمْ", "Walladhina idha fa'alu fahishatan aw zalamu anfusahum dhakarul-laha fastagfaru lidhunubihim", "Those who, when they commit an immorality or wrong themselves, remember Allah and seek forgiveness, Quran 3:135")}
<h2>How to Make Tawbah (Sincere Repentance)</h2>
<ol style="padding-left:20px;color:#a0c8a0;font-family:Inter,sans-serif;line-height:2.2">
  <li><strong style="color:#eaf4ee">Genuine remorse</strong>, Feel the wrongness of the sin, not just fear of consequences</li>
  <li><strong style="color:#eaf4ee">Immediate cessation</strong>, Stop the sin right now</li>
  <li><strong style="color:#eaf4ee">Firm resolve</strong>, Commit to not returning to the sin</li>
  <li><strong style="color:#eaf4ee">Restore rights</strong>, If the sin involved another person, seek their forgiveness and/or restore what was taken</li>
  <li><strong style="color:#eaf4ee">Make istighfar</strong>, Astaghfirullah, or the Sayyidul Istighfar (the Master Supplication for Forgiveness)</li>
</ol>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Allah's Door Is Always Open", subtitle: "Find duas for tawbah, forgiveness, and renewal in MyTazki's duas library. 110+ authentic supplications.", href: "/download", btnText: "Open Duas Library →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 8. Best Surahs for Morning ───────────────────────────────────────────────
router.get("/best-surahs-for-morning", (_req, res) => {
  const slug = "/best-surahs-for-morning"; const title = "Best Surahs to Read in the Morning, Prophetic Morning Quran Routine"; const desc = "Which surahs to read in the morning for barakah, protection, and spiritual clarity. The Prophet's ﷺ morning Quran routine and why specific surahs are recommended at dawn.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Best Surahs for Morning" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("Which surahs should I read every morning?", "The Prophet ﷺ recommended specific morning recitations: (1) Ayatul Kursi after Fajr prayer (protection for the day). (2) Surahs Al-Ikhlas, Al-Falaq, Al-Nas, 3 times each (complete spiritual protection). (3) The last 2 verses of Al-Baqarah (2:285-286), 'sufficient for him.' (4) Surah Al-Mulk (before sleep but also recommended in the morning). The Quran of Fajr is specifically mentioned in the Quran (17:78): 'The Quran of Fajr is witnessed' by the angels.")}
${quranBlock("وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا", "Wa qur'anal-fajr. Inna qur'anal-fajri kana mashhuda", "And the Quran of Fajr, indeed, the Quran of Fajr is witnessed, Quran 17:78")}
<h2>Morning Surah Routine</h2>
<div style="display:flex;flex-direction:column;gap:12px;margin:16px 0">
${[
  ["After Fajr, Ayatul Kursi", "Recite once. The Prophet ﷺ said: 'Whoever recites Ayatul Kursi after every obligatory prayer, nothing prevents him from entering Paradise except death.' (An-Nasa'i)"],
  ["After Fajr, Al-Ikhlas, Al-Falaq, Al-Nas (×3)", "Three times each. The Prophet ﷺ said these three surahs cover everything (the oneness of Allah, protection from external evil, protection from internal whispers)."],
  ["Morning Dhikr Session, Quran of Your Choice", "Read from where you left off in your daily Quran reading. Consistency matters more than quantity. One page daily finishes the Quran."],
  ["Surah Yasin (Optional)", "Some scholars recommend Surah Yasin in the morning. While the specific hadith is disputed, the general principle of Quran recitation at dawn is firmly established."],
].map(([t, d]) => `<div style="background:#1c2d21;border-left:3px solid rgba(52,201,122,0.4);border-radius:0 10px 10px 0;padding:14px 16px">
  <strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:6px">${t}</strong>
  <p style="color:#6a9878;font-size:13px;margin:0;line-height:1.6;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Build Your Morning Quran Routine", subtitle: "Quran reader with audio, morning azkar, and streak tracker, your complete morning deen companion.", href: "/download", btnText: "Start Morning Routine →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 9. Quran Daily Reading Guide ─────────────────────────────────────────────
router.get("/quran-daily-reading-guide", (_req, res) => {
  const slug = "/quran-daily-reading-guide"; const title = "Daily Quran Reading Guide, How to Read Quran Every Day and Finish It"; const desc = "A practical guide to building a daily Quran reading habit: how many pages per day to finish in 1 year, tips for consistency, and the spiritual benefits of regular tilawah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran Reflections", item: "/quran-reflections" }, { name: "Daily Quran Reading Guide" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How can I read Quran every day and finish it in a year?", "The Quran has 604 pages (in standard Uthmani script, 15 lines per page). Reading 2 pages after each prayer (10 pages daily) finishes the Quran in 60 days. Reading 1.65 pages per day finishes in 1 year. A simpler formula: read 4 pages after Fajr, 4 after Dhuhr, 4 after Asr, 4 after Maghrib, 4 after Isha = 20 pages = 1 Juz daily = full Quran in 30 days (Ramadan style).")}
<h2>Choose Your Quran Reading Plan</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0">
${[["🌙 30-Day Plan", "1 Juz (20 pages) per day, the Ramadan pace. Intense but transformative."], ["📅 3-Month Plan", "~7 pages per day. Manageable with 2 sittings, morning and evening."], ["📆 6-Month Plan", "~3-4 pages per day. One sitting after Fajr. Consistent and sustainable."], ["🗓 1-Year Plan", "~2 pages per day. Just 10 minutes after Fajr. The most sustainable beginner plan."]].map(([t, d]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:16px;text-align:center">
  <strong style="color:#34c97a;font-size:15px;font-family:DM Sans,sans-serif;display:block;margin-bottom:8px">${t}</strong>
  <p style="color:#6a9878;font-size:13px;margin:0;line-height:1.5;font-family:Inter,sans-serif">${d}</p>
</div>`).join("")}
</div>
<h2>7 Tips for Daily Quran Consistency</h2>
<ol style="padding-left:20px;color:#a0c8a0;font-family:Inter,sans-serif;line-height:2.2">
  <li>Attach Quran reading to an existing habit (after Fajr is most powerful)</li>
  <li>Use a bookmark and never lose your place, MyTazki saves your position automatically</li>
  <li>Read with translation for at least one page daily, understanding deepens motivation</li>
  <li>Never break the chain, even one verse on a busy day maintains the streak</li>
  <li>Track your progress, MyTazki shows your reading streak</li>
  <li>Listen to Alafasy recitation while reading, the audio helps pronunciation</li>
  <li>Set a 'Quran corner', a consistent physical place for reading creates a habit cue</li>
</ol>
${relatedArticlesGrid(QURAN_RELATED)}
${emotionalCTA({ title: "Read the Quran Daily in MyTazki", subtitle: "All 114 surahs, bookmark sync, translation, and verse-by-verse Alafasy audio. Your daily Quran companion.", href: "/download", btnText: "Start Reading Today →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

export default router;
