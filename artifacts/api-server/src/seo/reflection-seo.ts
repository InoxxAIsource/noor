import { Router } from "express";
import { seoHead, page, ctaBlock, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc } from "./shared.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function articleSchema(title: string, desc: string, slug: string, date: string): object {
  return { "@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "author": { "@type": "Organization", "name": "MyTazki" }, "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" }, "datePublished": date, "dateModified": TODAY, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` } };
}
function speakableSchema(slug: string): object {
  return { "@context": "https://schema.org", "@type": "WebPage", "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".ai-summary", "h1"] }, "url": `https://mytazki.com${slug}` };
}

function reflectionPage(opts: {
  title: string; desc: string; slug: string; h1: string; date: string;
  aiSummary: string; intro: string; mainHtml: string;
  keyVerses: Array<{ arabic: string; trans: string; ref: string; lesson: string }>;
  faqs: Array<{ q: string; a: string }>;
  internalLinks: Array<{ href: string; label: string }>;
  relatedArticles: Array<{ href: string; label: string }>;
  breadcrumbs: Array<{ name: string; item?: string }>;
}): string {
  const head = seoHead({ title: opts.title, description: opts.desc, canonical: opts.slug, schema: [articleSchema(opts.title, opts.desc, opts.slug, opts.date), speakableSchema(opts.slug), faqSchema(opts.faqs), breadcrumbSchema(opts.breadcrumbs)] });
  const body = `
${breadcrumb(opts.breadcrumbs)}
<h1>${esc(opts.h1)}</h1>
<div class="ai-summary" style="background:rgba(52,201,122,0.07);border-left:4px solid #34c97a;border-radius:0 10px 10px 0;padding:16px 20px;margin:20px 0;font-size:15px;line-height:1.7;color:#eaf4ee">
<strong style="color:#34c97a">Quick Answer:</strong> ${opts.aiSummary}
</div>
<p style="font-size:16px;line-height:1.8;color:#a0c8a0;margin-bottom:20px">${opts.intro}</p>
${opts.mainHtml}
<h2>Key Verses & Reflections</h2>
${opts.keyVerses.map(v => `<div style="background:rgba(52,201,122,0.05);border-radius:12px;padding:20px;margin:16px 0;border:1px solid rgba(52,201,122,0.12)">
  <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.6em;line-height:2;margin:0 0 10px">${v.arabic}</p>
  <p style="color:#34c97a;font-style:italic;margin:0 0 6px;font-size:14px">${esc(v.trans)}</p>
  <p style="color:#6a9878;font-size:13px;margin:0 0 10px">${esc(v.ref)}</p>
  <p style="color:#a0c8a0;font-size:14px;margin:0;line-height:1.7"><strong style="color:#eaf4ee">Reflection:</strong> ${esc(v.lesson)}</p>
</div>`).join("")}
${faqHtml(opts.faqs)}
<h2>Read & Listen in MyTazki</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0">
${opts.internalLinks.map(l => `<a href="${l.href}" class="card" style="text-decoration:none;color:#eaf4ee;display:block;padding:14px;border-radius:10px"><strong style="color:#34c97a;font-size:14px">${esc(l.label)}</strong></a>`).join("")}
</div>
<h2>Related Reflections</h2>
<div style="display:flex;flex-direction:column;gap:10px;margin:12px 0 24px">
${opts.relatedArticles.map(a => `<a href="${a.href}" style="color:#34c97a;text-decoration:none;font-size:15px">→ ${esc(a.label)}</a>`).join("")}
</div>
${ctaBlock()}
`;
  return page(head, body);
}

router.get("/surah-rahman-reflection", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(reflectionPage({
    slug: "/surah-rahman-reflection", date: "2026-02-20",
    title: "Surah Ar-Rahman Reflection, The Most Merciful's Love Letter",
    desc: "Deep reflection on Surah Ar-Rahman (55), its repeated refrain, its lessons on gratitude, and why Allah names His mercy 31 times in this surah.",
    h1: "Surah Ar-Rahman Reflection, Allah's 31-Fold Declaration of Mercy",
    aiSummary: "Surah Ar-Rahman (Chapter 55) is structured around a single repeated question: 'Fabi ayyi ala'i rabbikuma tukadhdhiban', Which of your Lord's favors will you both deny? Repeated 31 times, it is a divine invitation to inventory all of Allah's gifts. Its primary lesson: gratitude is the prerequisite for spiritual perception.",
    intro: "Surah Ar-Rahman is unique in the Quran. It is the only surah that addresses two audiences simultaneously, humans and jinn. Its refrain is repeated 31 times, not for emphasis alone, but as a technique: each time it follows a different blessing, asking you to consider that specific gift. It is a guided meditation on gratitude.",
    mainHtml: `<h2>The Structure of Mercy</h2>
<p style="color:#a0c8a0;line-height:1.8">The surah opens with 'Ar-Rahman', the Most Merciful, as its very name. It then describes creation itself as an act of mercy: He created man, taught him speech, set the stars and trees in balance. Every element of existence is framed as a divine gift. Then the refrain: 'Which of your Lord's favors will you deny?'</p>
<h2>The 31 Favors of Allah</h2>
<p style="color:#a0c8a0;line-height:1.8">Scholars have counted the blessings mentioned between each recurrence of the refrain: the Quran, the creation of man, the creation of jinn, the balance of the cosmos, the provision of food, the promise of Jannah. By the 31st occurrence, you have been walked through the entirety of Allah's generosity, from creation to the afterlife.</p>`,
    keyVerses: [
      { arabic: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ", trans: "Ar-Rahman. 'Allamal-Qur'an. Khalaqal-insan. 'Allamahul-bayan.", ref: "The Most Merciful, taught the Quran, created man, taught him eloquent speech, Quran 55:1-4", lesson: "Allah's first introduction of Himself in this surah is as Ar-Rahman, Mercy. Before describing power, before describing judgment, Allah leads with mercy. This is how He wants to be known by you." },
      { arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", trans: "Fabi ayyi ala'i rabbikuma tukadhdhiban", ref: "Which of your Lord's favors will you both deny?, Quran 55:13 (and 30 more times)", lesson: "This question is not rhetorical. It demands an answer. Sit with it: in the last 24 hours, which blessings have you named? Which have you taken for granted? The surah's purpose is to make the invisible visible." },
    ],
    faqs: [
      { q: "What is the main message of Surah Ar-Rahman?", a: "Gratitude (shukr) is the appropriate response to existence. Allah presents His blessings systematically and asks 31 times which of them we would deny. The message: ingratitude (kufran) is the root of spiritual blindness; gratitude (shukr) is the beginning of spiritual sight." },
      { q: "Why is Surah Ar-Rahman repeated 31 times?", a: "The refrain 'Which of your Lord's favors will you deny?' is not simply repeated, it follows a different divine blessing each time. The repetition is a Quranic technique to ensure each blessing lands in the heart individually, not as a blur of general thankfulness." },
    ],
    internalLinks: [
      { href: "/quran/surah-rahman", label: "Read Surah Ar-Rahman" },
      { href: "/sessions", label: "Quran Reflection Sessions" },
      { href: "/99-names", label: "Ar-Rahman, 99 Names" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-mulk-reflection", label: "Surah Al-Mulk Reflection" },
      { href: "/surah-fatiha-reflection", label: "Surah Al-Fatiha Reflection" },
      { href: "/quran-about-anxiety", label: "What Quran Says About Anxiety" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Surah Ar-Rahman Reflection" }],
  }));
});

router.get("/surah-mulk-reflection", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(reflectionPage({
    slug: "/surah-mulk-reflection", date: "2026-02-22",
    title: "Surah Al-Mulk Reflection, Deep Meaning & Why Read Before Sleep",
    desc: "Deep reflection on Surah Al-Mulk (67), its themes of sovereignty, death, life, and why the Prophet ﷺ never slept without reciting it.",
    h1: "Surah Al-Mulk Reflection, Allah's Absolute Sovereignty",
    aiSummary: "Surah Al-Mulk (Chapter 67) opens by asserting absolute sovereignty (mulk) belongs to Allah alone. It reminds us that death and life were created as a test. It asks: do you trust that the Creator of the cosmos has your affairs in hand? Recited before sleep, it intercedes for the reciter in the grave, according to authentic hadith (Tirmidhi).",
    intro: "Surah Al-Mulk is one of the most frequently memorized surahs in Islam, and for good reason. Its 30 verses cover life, death, sovereignty, creation, judgment, and the question of whether we truly trust the One who holds all of it. Recited every night, it builds a worldview that radically reduces anxiety.",
    mainHtml: `<h2>Why Read Surah Al-Mulk Every Night?</h2>
<p style="color:#a0c8a0;line-height:1.8">The Prophet ﷺ said: 'There is a surah in the Quran of thirty verses that will intercede for its companion until he is forgiven, Tabarakallathi biyadihil-mulk' (Tirmidhi, declared hasan). This is not just a protection strategy, it's a nightly reminder that Allah holds your past, present, and future in His hands.</p>
<h2>The Surah's Central Question</h2>
<p style="color:#a0c8a0;line-height:1.8">Verses 20-21 present a rhetorical challenge: 'Who is there who could be an army for you to help you other than the Most Merciful?' The question cuts through our reliance on anything other than Allah, our plans, our relationships, our wealth. Surah Al-Mulk systematically dismantles every false sense of security except one: trust in Allah.</p>`,
    keyVerses: [
      { arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", trans: "Tabarakalladhi biyadihil-mulku wa huwa 'ala kulli shay'in qadeer", ref: "Blessed is He in Whose hand is the dominion, and He is over all things competent, Quran 67:1", lesson: "This opening verse immediately reorients perspective. Every anxiety you carry is about something within the 'dominion' of Allah. He is competent over ALL things, including your situation." },
      { arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا", trans: "Alladhi khalaqal-mawta wal-hayata liyabluwakum ayyukum ahsanu 'amala", ref: "Who created death and life to test you as to which of you is best in deed, Quran 67:2", lesson: "Death was created, it is not the absence of life but an intentional creation. And both death and life exist for a purpose: to see who is best in deed. This transforms every hardship into an opportunity." },
    ],
    faqs: [
      { q: "What is Surah Al-Mulk about?", a: "Surah Al-Mulk is about the absolute sovereignty (mulk) of Allah over all creation. It covers: Allah's complete control, the creation of death and life as a test, the perfection of creation, the fate of disbelievers, the provision Allah controls, and ends with the question: who else can you rely on?" },
      { q: "Is it Sunnah to read Surah Al-Mulk before sleep?", a: "Yes. The Prophet ﷺ recited Surah As-Sajdah and Surah Al-Mulk every night before sleeping (Tirmidhi). He said Al-Mulk would intercede for its reciter in the grave. Multiple hadiths confirm this practice." },
    ],
    internalLinks: [
      { href: "/quran/surah-mulk", label: "Read Surah Al-Mulk" },
      { href: "/sessions", label: "Sleep Sessions with Quran" },
      { href: "/surah-for-peace", label: "Surahs for Peace" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-rahman-reflection", label: "Surah Ar-Rahman Reflection" },
      { href: "/surah-fatiha-reflection", label: "Surah Al-Fatiha Reflection" },
      { href: "/surah-for-peace", label: "Surah for Peace of Mind" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Surah Al-Mulk Reflection" }],
  }));
});

router.get("/surah-fatiha-reflection", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(reflectionPage({
    slug: "/surah-fatiha-reflection", date: "2026-02-24",
    title: "Surah Al-Fatiha Reflection, The Opening That Changes Everything",
    desc: "Deep reflection on Surah Al-Fatiha, the surah recited in every rakaat of every salah. Its 7 verses contain the entire Quran's message in condensed form.",
    h1: "Surah Al-Fatiha Reflection, Why Every Prayer Begins Here",
    aiSummary: "Surah Al-Fatiha is the most repeated passage in all of Islamic worship, recited in every rakaat of salah. Its 7 verses cover: praising Allah, affirming His mercy, declaring His sovereignty over Judgment, pledging exclusive worship, and asking for guidance on the straight path. The Prophet ﷺ called it 'the Greatest Surah in the Quran' (Bukhari).",
    intro: "You have recited Surah Al-Fatiha more than any other passage in your life. Yet how often have you paused to reflect on each of its 7 verses? The Prophet ﷺ said no prayer is valid without it, because no connection with Allah is complete without it. It is simultaneously a prayer, a praise, and a declaration.",
    mainHtml: `<h2>Al-Fatiha as a Dialogue with Allah</h2>
<p style="color:#a0c8a0;line-height:1.8">In a beautiful hadith qudsi, Allah says: 'I have divided the prayer between Myself and My servant into two halves.' When you say 'Alhamdulillahi rabbil-'alameen,' Allah says: 'My servant has praised Me.' When you say 'Iyyaka na'budu wa iyyaka nasta'een,' Allah says: 'This is between Me and My servant, My servant will have what he asks.' Al-Fatiha is not a monologue. It is a conversation.</p>`,
    keyVerses: [
      { arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", trans: "Iyyaka na'budu wa iyyaka nasta'een", ref: "It is You alone we worship, and You alone we ask for help, Quran 1:5", lesson: "This verse is the axis of the entire surah. The Arabic structure places 'You' (iyyaka) before the verb, a deliberate emphasis: it is YOU, not anyone or anything else, that we worship. Every time you say this verse with understanding, you are renewing your covenant with Allah." },
      { arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", trans: "Ihdinas-sirata al-mustaqeem", ref: "Guide us to the straight path, Quran 1:6", lesson: "This is the most repeated dua in human history. Every Muslim who has ever prayed has made this request. Allah guides us to the straight path, and then, in the very next verse, describes it as the path of those He blessed, not those who earned anger or those who went astray." },
    ],
    faqs: [
      { q: "What is the meaning of Surah Al-Fatiha?", a: "Al-Fatiha (The Opening) encompasses: praise of Allah (verses 1-4), the covenant of worship (verse 5), and the most important dua in Islam, asking for guidance on the straight path (verses 6-7). Scholars consider it a condensed version of the entire Quran's message." },
      { q: "How many times is Surah Al-Fatiha recited in salah?", a: "In a day of 5 obligatory prayers with 17 rakaats, Al-Fatiha is recited 17 times minimum. Adding Sunnah prayers brings it to 34+. Over a lifetime of prayer, it becomes the most memorized and recited text in human experience." },
    ],
    internalLinks: [
      { href: "/quran/surah-fatiha", label: "Read Surah Al-Fatiha" },
      { href: "/salah-guide", label: "Salah Guide" },
      { href: "/how-to-focus-in-salah", label: "Focus in Salah" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-rahman-reflection", label: "Surah Ar-Rahman Reflection" },
      { href: "/surah-mulk-reflection", label: "Surah Al-Mulk Reflection" },
      { href: "/how-to-focus-in-salah", label: "How to Focus in Salah" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Surah Al-Fatiha Reflection" }],
  }));
});

router.get("/surah-duha-reflection", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(reflectionPage({
    slug: "/surah-duha-reflection", date: "2026-02-26",
    title: "Surah Ad-Duha Reflection, Allah's Response to Your Darkest Moment",
    desc: "Deep reflection on Surah Ad-Duha (93). Why it was revealed, what it means for Muslims in dark periods, and how Allah's response to the Prophet's grief speaks to yours.",
    h1: "Surah Ad-Duha Reflection, For When You Feel Forgotten",
    aiSummary: "Surah Ad-Duha was revealed after a period of silence (the Prophet ﷺ felt abandoned). Allah's response: 'Your Lord has not forsaken you, nor has He become resentful.' Then five promises follow: the future will be better than the past; Allah will give until you are satisfied; He found you orphaned and gave shelter; He found you lost and guided you. This surah is Allah's response to every grieving heart.",
    intro: "Revelation stopped for a period after the first few surahs. The Prophet ﷺ was deeply distressed, some accounts suggest he feared he had been abandoned by Allah. Surah Ad-Duha was the divine response. Understanding the historical context transforms every verse into a personal message from Allah to anyone who has ever felt forgotten.",
    mainHtml: `<h2>The Context That Changes Everything</h2>
<p style="color:#a0c8a0;line-height:1.8">When the Prophet ﷺ experienced the pause in revelation, an enemy mocked him: 'Your god has abandoned you.' Allah's response was Surah Ad-Duha. The first words directly refute that accusation: 'Your Lord has not abandoned you.' If you have ever felt that Allah has moved away from you, this surah is His direct address to that feeling.</p>`,
    keyVerses: [
      { arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", trans: "Ma wadda'aka rabbuka wa ma qala", ref: "Your Lord has not abandoned you, nor has He become resentful, Quran 93:3", lesson: "This is one of the most personal verses in the Quran. Allah is saying: I did not leave you. I am not angry with you. The silence was not abandonment. What silences in your life have you misread as abandonment?" },
      { arabic: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ", trans: "Wa lal-akhiratu khayrun laka minal-oola", ref: "And the Hereafter is better for you than the first life, Quran 93:4", lesson: "This verse contains a promise about the trajectory of the believer's life, both the life of this world (things will get better) and the afterlife (it is better than this world). Every difficulty exists on a timeline that ends in better." },
    ],
    faqs: [
      { q: "Why was Surah Ad-Duha revealed?", a: "Surah Ad-Duha was revealed after a period of pause in revelation (called the Fatra), during which the Prophet ﷺ was deeply distressed. Allah revealed it to reassure him: the pause was not abandonment, the future would be better than the past, and Allah's favors were already countless." },
      { q: "When should I read Surah Ad-Duha?", a: "Surah Ad-Duha is especially powerful during dark periods of life, when you feel abandoned, when grief is heavy, when hope is low. Many scholars recommend reciting it in the Duha prayer (after sunrise), which is named after this surah." },
    ],
    internalLinks: [
      { href: "/quran/surah-duha", label: "Read Surah Ad-Duha" },
      { href: "/quran-for-depression", label: "Quran for Depression" },
      { href: "/how-to-connect-with-allah", label: "Reconnect with Allah" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-rahman-reflection", label: "Surah Ar-Rahman Reflection" },
      { href: "/quran-for-depression", label: "Quran for Depression" },
      { href: "/dua-for-hardship", label: "Dua for Hardship" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Surah Ad-Duha Reflection" }],
  }));
});

router.get("/surah-kahf-reflection", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(reflectionPage({
    slug: "/surah-kahf-reflection", date: "2026-02-28",
    title: "Surah Al-Kahf Reflection, 4 Stories, 4 Trials, One Answer",
    desc: "Deep reflection on Surah Al-Kahf (18), the four stories and their connection to the four major trials of life: religion, wealth, knowledge, and power.",
    h1: "Surah Al-Kahf Reflection, Why the Prophet ﷺ Read It Every Friday",
    aiSummary: "Surah Al-Kahf contains four stories that correspond to four trials every human faces: (1) trial of religion/faith, the Companions of the Cave; (2) trial of wealth, the man with two gardens; (3) trial of knowledge, Musa and Khidr; (4) trial of power, Dhul-Qarnayn. Reading it every Friday protects from the Dajjal according to authentic hadith.",
    intro: "Why does the Prophet ﷺ specifically recommend reading Surah Al-Kahf every Friday, and link it to protection from the Dajjal (Antichrist)? Because the Dajjal's primary tools are the four things this surah addresses: false religion, false wealth, false knowledge, and false power. The surah is an antidote to the 4 trials of the end times, and the 4 trials of every time.",
    mainHtml: `<h2>The Four Stories and Their Trials</h2>
<p style="color:#a0c8a0;line-height:1.8"><strong style="color:#eaf4ee">1. Companions of the Cave, Trial of Faith:</strong> Young men who preserved their religion by withdrawing from a corrupt society. For you: How do you maintain your faith when society pushes against it?</p>
<p style="color:#a0c8a0;line-height:1.8"><strong style="color:#eaf4ee">2. The Man with Two Gardens, Trial of Wealth:</strong> A wealthy man who forgot that his garden was Allah's gift and treated it as his own achievement. For you: How attached are you to your possessions?</p>
<p style="color:#a0c8a0;line-height:1.8"><strong style="color:#eaf4ee">3. Musa and Khidr, Trial of Knowledge:</strong> Even a prophet struggled to accept wisdom that exceeded his understanding. For you: Where does your knowledge end and your need for trust in Allah begin?</p>
<p style="color:#a0c8a0;line-height:1.8"><strong style="color:#eaf4ee">4. Dhul-Qarnayn, Trial of Power:</strong> A powerful king who used his authority only to serve others and attributed all success to Allah. For you: How do you use your influence?</p>`,
    keyVerses: [
      { arabic: "إِنَّا جَعَلْنَا مَا عَلَى الْأَرْضِ زِينَةً لَّهَا لِنَبْلُوَهُمْ أَيُّهُمْ أَحْسَنُ عَمَلًا", trans: "Inna ja'alna ma 'alal-ardi zeenatan laha linabluwahum ayyuhum ahsanu 'amala", ref: "Indeed, We have made what is on earth an adornment for it so We may test them as to which of them is best in deed, Quran 18:7", lesson: "The entire world is a test, its beauty is designed to test whether we are drawn to it or to Allah. Every possession, every pleasure, every comfort is a question: does this bring you closer to Allah or further away?" },
    ],
    faqs: [
      { q: "Why is Surah Al-Kahf read on Friday?", a: "The Prophet ﷺ said: 'Whoever reads Surah Al-Kahf on Friday will have a light between him and the House of Allah illuminating the space between two Fridays' (Al-Hakim). It is also said to protect from the Dajjal's trials." },
      { q: "What is the main lesson of Surah Al-Kahf?", a: "The main lesson: every human faces four primary trials (faith, wealth, knowledge, and power), and in each story, the solution is the same, humility before Allah, gratitude, and the acknowledgment that all good comes from Him alone." },
    ],
    internalLinks: [
      { href: "/quran/surah-kahf", label: "Read Surah Al-Kahf" },
      { href: "/sessions", label: "Quran Reflection Sessions" },
      { href: "/quran", label: "Quran Hub" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-mulk-reflection", label: "Surah Al-Mulk Reflection" },
      { href: "/surah-rahman-reflection", label: "Surah Ar-Rahman Reflection" },
      { href: "/surah-yusuf-reflection", label: "Surah Yusuf Reflection" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Surah Al-Kahf Reflection" }],
  }));
});

router.get("/surah-yusuf-reflection", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(reflectionPage({
    slug: "/surah-yusuf-reflection", date: "2026-03-02",
    title: "Surah Yusuf Reflection, The Most Beautiful Story of Hope",
    desc: "Deep reflection on Surah Yusuf (12), the story of Prophet Yusuf (Joseph) as a guide through jealousy, betrayal, imprisonment, and ultimate victory through patience.",
    h1: "Surah Yusuf Reflection, The Story Allah Called 'The Best of Stories'",
    aiSummary: "Allah called Surah Yusuf 'the best of stories' (12:3). It follows Yusuf (AS) from a child thrown into a well, enslaved, falsely accused, imprisoned, to becoming Aziz of Egypt and reuniting his family. Its central message: tawakkul (complete trust in Allah's plan) transforms every disaster into a stepping stone. No situation is so dark that Allah cannot reverse it.",
    intro: "Allah calls Surah Yusuf 'ahsanal-qasas', the best of stories (12:3). Why? Not because it has the happiest ending (though it does). But because the journey from the well to the palace is the human journey made explicit: betrayal, loss, false accusation, imprisonment, and ultimately, complete reversal through trust in Allah.",
    mainHtml: `<h2>Yusuf's Timeline of Trials</h2>
<p style="color:#a0c8a0;line-height:1.8">At approximately 7-17 years old: thrown into a well by his brothers, sold into slavery. As a young man: falsely accused by Aziz's wife, imprisoned without trial. After years in prison: forgotten by the one person who could have helped him. Then: a single dream interpretation that reverses everything. The lesson is not 'good things take time', it is 'Allah's timing is perfect.'</p>`,
    keyVerses: [
      { arabic: "إِنَّهُ مَن يَتَّقِ وَيَصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", trans: "Innahu man yattaqi wa yasbir fa-innallaha la yudee'u ajral-muhsineen", ref: "Indeed, whoever fears Allah and is patient, then indeed, Allah does not allow to be lost the reward of those who do good, Quran 12:90", lesson: "This is Yusuf's own explanation of his story. Two things: taqwa (consciousness of Allah) and sabr (patience). These two qualities, combined, produce outcomes that no human plan could engineer." },
    ],
    faqs: [
      { q: "What is the main lesson of Surah Yusuf?", a: "The main lessons are: tawakkul (trust in Allah's plan even when it seems to be falling apart), that injustice does not have the final word, that Allah can reverse any situation completely, and that forgiveness of those who wronged you is one of the highest acts of character." },
      { q: "Why is Surah Yusuf called the best of stories?", a: "Allah calls it 'ahsanal-qasas' (the best of stories) because it contains every human trial within one narrative: family betrayal, slavery, sexual temptation, false accusation, imprisonment, and ultimate victory, making it universally relatable and timeless in its lessons." },
    ],
    internalLinks: [
      { href: "/quran/surah-yusuf", label: "Read Surah Yusuf" },
      { href: "/sessions", label: "Guided Sessions" },
      { href: "/dua-for-hardship", label: "Dua for Hardship" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-duha-reflection", label: "Surah Ad-Duha Reflection" },
      { href: "/quran-for-depression", label: "Quran for Depression" },
      { href: "/how-to-connect-with-allah", label: "Reconnecting with Allah" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Surah Yusuf Reflection" }],
  }));
});

router.get("/ayatul-kursi-reflection", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(reflectionPage({
    slug: "/ayatul-kursi-reflection", date: "2026-03-04",
    title: "Ayatul Kursi Reflection, The Greatest Verse in the Quran",
    desc: "Deep reflection on Ayatul Kursi (Quran 2:255), why it is the greatest verse, its 10 divine attributes, and how to recite it with full presence and understanding.",
    h1: "Ayatul Kursi Reflection, 10 Divine Attributes in One Verse",
    aiSummary: "Ayatul Kursi (Quran 2:255) is called the greatest verse in the Quran by the Prophet ﷺ himself. It contains 10 attributes of Allah in one verse: His eternal existence, His sovereignty, His ownership of the heavens and earth, His intercession authority, His all-encompassing knowledge, and His kursi (footstool) that encompasses all creation. Recite it after every salah and before sleep for full protection.",
    intro: "When the Prophet ﷺ asked Ubayy ibn Ka'b: 'What is the greatest verse in the Book of Allah?' Ubayy replied: 'Allahu la ilaha illa huwal-hayyul-qayyoom.' The Prophet ﷺ struck him on the chest and said: 'May knowledge delight you, O Abu Mundhir!', an expression of joy. This is the only verse where the Prophet ﷺ responded to its recitation with such specific celebration.",
    mainHtml: `<h2>Why Ayatul Kursi is the Greatest Verse</h2>
<p style="color:#a0c8a0;line-height:1.8">Scholars explain that Ayatul Kursi is the greatest because it contains the greatest concentration of divine names and attributes in any single verse of the Quran. Ten attributes in one verse: (1) Al-Hayy (the Ever-Living), (2) Al-Qayyum (the Self-Sustaining), (3) no slumber takes Him, (4) no sleep takes Him, (5) He owns all in heavens and earth, (6) intercession only by His permission, (7) He knows what is before and behind us, (8) we encompass nothing of His knowledge except what He wills, (9) His Kursi encompasses heavens and earth, (10) guarding them causes Him no burden. Ten facts about Allah that, when internalized, eliminate every category of existential anxiety.</p>`,
    keyVerses: [
      { arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", trans: "Allahu la ilaha illa huwal-hayyul-qayyoom. La ta'khudhuhu sinatun wa la nawm", ref: "Allah, there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep, Quran 2:255", lesson: "Allah never sleeps, never becomes tired, never gets distracted from you. While you sleep, He maintains the cosmos and maintains you. The anxiety of 'what happens while I'm not watching' dissolves before this verse." },
    ],
    faqs: [
      { q: "When should I recite Ayatul Kursi?", a: "After every obligatory salah (the Prophet ﷺ said nothing separates you from Paradise except death, for those who recite it consistently after each prayer, Al-Nasai). Before sleep (for protection throughout the night, Bukhari). When leaving the house. When anxious or afraid." },
      { q: "What is the meaning of the Kursi?", a: "The Kursi (literally: footstool/seat) of Allah encompasses the heavens and earth. It is a created object that is itself vast, and yet it is only the footstool, not the Throne (Arsh) itself. Ibn Abbas said the Kursi is merely the footstool of the Throne. The scale of this reminds us of the incomprehensible greatness of Allah." },
    ],
    internalLinks: [
      { href: "/quran/ayatul-kursi", label: "Read Ayatul Kursi" },
      { href: "/sessions", label: "Guided Quran Sessions" },
      { href: "/duas/protection", label: "Protection Duas" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/surah-mulk-reflection", label: "Surah Al-Mulk Reflection" },
      { href: "/surah-fatiha-reflection", label: "Surah Al-Fatiha Reflection" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Ayatul Kursi Reflection" }],
  }));
});

router.get("/quran-about-anxiety", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(reflectionPage({
    slug: "/quran-about-anxiety", date: "2026-03-06",
    title: "What the Quran Says About Anxiety, A Complete Guide",
    desc: "A complete guide to what the Quran says about anxiety, worry, and stress. Key verses, their context, and how Islam's Quranic framework addresses modern anxiety.",
    h1: "What the Quran Says About Anxiety, Complete Islamic Guide",
    aiSummary: "The Quran addresses anxiety (hamma/hazan) directly and repeatedly. Key teachings: anxiety comes from distance from Allah (20:124); remembrance of Allah is the cure (13:28); no one is burdened beyond capacity (2:286); hardship always comes with ease (94:5-6); Allah is closer than your jugular vein (50:16). The Quran's framework for anxiety is both spiritual and practical.",
    intro: "The Quran does not pretend anxiety doesn't exist. It acknowledges it, describes it, and then provides a framework for understanding and addressing it that is remarkably complete. This guide collects the Quran's most direct teachings on anxiety and explains their practical application.",
    mainHtml: `<h2>The Quran's Root Cause Analysis of Anxiety</h2>
<p style="color:#a0c8a0;line-height:1.8">Surah Ta-Ha (20:124) provides what may be the Quran's most direct statement about anxiety's root cause: 'And whoever turns away from My remembrance, indeed, he will have a depressed/constrained life.' The Arabic word 'ma'ishatan danka' literally means a tight, constrained, pressured existence. The Quran diagnoses anxiety as the condition of the heart turned away from Allah.</p>
<h2>The Quran's Treatment for Anxiety</h2>
<p style="color:#a0c8a0;line-height:1.8">If the cause is distance from Allah, the treatment is return to Allah. Specifically: dhikr (remembrance, 13:28), consistent salah (2:45), reading the Quran with understanding (10:57), seeking help through sabr and salah (2:153), and trust in Allah's knowledge over our own (2:216). These are not abstract spiritual platitudes, they are practical neurological reset mechanisms.</p>`,
    keyVerses: [
      { arabic: "وَمَنْ أَعْرَضَ عَن ذِكْرِي فَإِنَّ لَهُ مَعِيشَةً ضَنكًا", trans: "Wa man a'rada 'an dhikri fa-inna lahu ma'eeshatan danka", ref: "And whoever turns away from My remembrance, indeed, he will have a depressed, constrained life, Quran 20:124", lesson: "This verse is the Quran's diagnosis of anxiety at its root. A constrained, anxious life is the natural consequence of turning away from Allah's remembrance. The inverse is equally true: a life filled with dhikr is a life of expansion and peace." },
      { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", trans: "Ya ayyuhal-ladhina amanu ista'eenu bis-sabri was-salah", ref: "O you who believe, seek help through patience and prayer, Quran 2:153", lesson: "Two tools, named together: sabr (patience/endurance) and salah (prayer). Sabr is internal, it's the quality of holding steady in difficulty. Salah is external, it's the action of turning to Allah. Together, they form the complete Islamic anxiety management system." },
    ],
    faqs: [
      { q: "What does the Quran say about worry and anxiety?", a: "The Quran: acknowledges that worry (hamm) and grief (hazan) are part of human experience; identifies distance from Allah as a root cause of chronic anxiety (20:124); promises that Allah's remembrance brings peace (13:28); provides practical tools (sabr + salah, 2:153); and assures us nothing is beyond Allah's capacity to reverse." },
      { q: "Is anxiety a sign of weak faith?", a: "No. Many prophets experienced acute anxiety and distress, the Prophet ﷺ, Ibrahim (AS), Musa (AS), Yunus (AS), Yusuf (AS). Islam does not equate emotional difficulty with weak faith. What distinguishes the believer is not the absence of anxiety but the direction they turn in when it comes, toward Allah." },
    ],
    internalLinks: [
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
      { href: "/surah-for-peace", label: "Surah for Peace" },
      { href: "/quran", label: "Quran Reader" },
      { href: "/home", label: "Open MyTazki" },
    ],
    relatedArticles: [
      { href: "/quran-verses-about-stress", label: "Quran Verses About Stress" },
      { href: "/how-islam-brings-peace", label: "How Islam Brings Peace" },
      { href: "/dua-for-anxiety", label: "Dua for Anxiety" },
    ],
    breadcrumbs: [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Quran About Anxiety" }],
  }));
});

export default router;
