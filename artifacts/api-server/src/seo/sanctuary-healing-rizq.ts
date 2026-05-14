import { Router } from "express";
import { geoBlock } from "./geo-content.js";
import { seoHead, page, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc } from "./shared.js";
import { quickAnswerBox, relatedArticlesGrid, emotionalCTA } from "./seo-components.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function art(title: string, desc: string, slug: string): object {
  return { "@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "author": { "@type": "Organization", "name": "MyTazki" }, "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" }, "datePublished": "2026-01-01", "dateModified": TODAY, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` } };
}

function hero(gradient: string, mood: string, h1: string, sub: string, cta = "Find Peace →", ctaHref = "/download", cta2 = "Browse Duas", cta2Href = "/duas"): string {
  return `<section style="position:relative;min-height:500px;display:flex;align-items:center;justify-content:center;padding:90px 24px 72px;background:${gradient};overflow:hidden">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 28% 65%,rgba(201,164,114,0.07) 0%,transparent 55%),radial-gradient(ellipse at 72% 28%,rgba(52,201,122,0.05) 0%,transparent 50%)"></div>
    <div style="position:relative;max-width:660px;margin:0 auto;text-align:center">
      <p style="font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.18em;color:#c9a472;text-transform:uppercase;margin:0 0 20px;opacity:0.85">${mood}</p>
      <h1 style="font-family:'DM Sans',Inter,sans-serif;font-size:clamp(1.85rem,4.2vw,2.9rem);font-weight:800;line-height:1.12;color:#f0ece4;margin:0 0 20px;letter-spacing:-0.025em">${h1}</h1>
      <p style="font-family:Inter,sans-serif;font-size:1.05rem;color:rgba(240,236,228,0.52);margin:0 auto 36px;line-height:1.78;max-width:490px">${sub}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="${ctaHref}" style="background:#34c97a;color:#09070a;padding:14px 30px;border-radius:100px;font-weight:700;text-decoration:none;font-size:14px;font-family:Inter,sans-serif">${esc(cta)}</a>
        <a href="${cta2Href}" style="background:rgba(201,164,114,0.1);color:#c9a472;padding:14px 26px;border-radius:100px;font-weight:600;text-decoration:none;font-size:14px;font-family:Inter,sans-serif;border:1px solid rgba(201,164,114,0.22)">${esc(cta2)}</a>
      </div>
    </div>
  </section>`;
}

function duaCard(arabic: string, trans: string, meaning: string, ref: string): string {
  return `<div style="background:linear-gradient(135deg,rgba(26,19,13,0.97),rgba(22,16,10,0.95));border:1px solid rgba(201,164,114,0.18);border-radius:16px;padding:28px 24px;margin:18px 0">
    <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#c9a472;font-size:1.6em;line-height:2.2;margin:0 0 16px">${arabic}</p>
    <p style="color:#34c97a;font-style:italic;margin:0 0 8px;font-size:14px;font-family:Inter,sans-serif">${esc(trans)}</p>
    <p style="color:#f0ece4;font-size:15px;margin:0 0 10px;font-family:Inter,sans-serif;line-height:1.65">"${esc(meaning)}"</p>
    <p style="color:rgba(110,94,76,0.75);font-size:12px;margin:0;font-family:Inter,sans-serif">${esc(ref)}</p>
  </div>`;
}

function quranRef(arabic: string, trans: string, ref: string): string {
  return `<div style="background:rgba(52,201,122,0.04);border-radius:12px;padding:18px 20px;margin:14px 0;border:1px solid rgba(52,201,122,0.1)">
    <p style="font-family:Amiri,serif;direction:rtl;text-align:right;color:#b8946a;font-size:1.4em;line-height:2;margin:0 0 10px">${arabic}</p>
    <p style="color:#6a9878;font-size:14px;margin:0 0 6px;font-family:Inter,sans-serif;line-height:1.7">${esc(trans)}</p>
    <p style="color:rgba(52,201,122,0.6);font-size:12px;margin:0;font-family:Inter,sans-serif">${esc(ref)}</p>
  </div>`;
}

function card(title: string, body: string): string {
  return `<div style="background:rgba(22,16,10,0.6);border:1px solid rgba(201,164,114,0.1);border-radius:14px;padding:24px 22px;margin:18px 0">
    <h3 style="color:#f0ece4;font-family:'DM Sans',Inter,sans-serif;font-size:1.05rem;font-weight:700;margin:0 0 12px">${esc(title)}</h3>
    <p style="color:#6e5e4c;font-size:14px;line-height:1.8;margin:0;font-family:Inter,sans-serif">${body}</p>
  </div>`;
}

const RELATED_HEALING = [
  { href: "/emotional-healing-in-islam", label: "Emotional Healing in Islam", tag: "Guide" },
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Dua" },
  { href: "/quran-for-depression", label: "Quran for Depression", tag: "Quran" },
  { href: "/islamic-mental-health", label: "Islamic Mental Health", tag: "Wellness" },
  { href: "/7-day-inner-peace-journey", label: "7-Day Inner Peace Journey", tag: "Journey" },
  { href: "/dua-for-sadness", label: "Dua for Sadness", tag: "Dua" },
];

const RELATED_RIZQ = [
  { href: "/zakat-calculator", label: "Zakat Calculator", tag: "Tool" },
  { href: "/sadqa-guide", label: "Sadqa Guide", tag: "Guide" },
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Dua" },
  { href: "/7-day-inner-peace-journey", label: "7-Day Inner Peace Journey", tag: "Journey" },
  { href: "/islamic-morning-routine", label: "Islamic Morning Routine", tag: "Routine" },
  { href: "/fajr-routine", label: "Fajr Routine", tag: "Routine" },
];

// ─── HEALING CLUSTER ──────────────────────────────────────────────────────────

// 14. /dua-for-stress
router.get("/dua-for-stress", (_req, res) => {
  const slug = "/dua-for-stress";
  const title = "Dua for Stress — Best Islamic Supplications for Relief and Calm";
  const desc = "The most powerful duas for stress relief from Quran and authentic Sunnah. Arabic, transliteration, meaning, and guidance on when and how to recite for maximum spiritual benefit.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Duas Library", item: "/duas" }, { name: "Dua for Stress" }];
  const faqs = [
    { q: "What is the best dua for stress?", a: "The Prophet's comprehensive dua: 'Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dal'id-dayni wa ghalabatir-rijal.' (O Allah, I seek refuge in You from anxiety, grief, incapacity, laziness, miserliness, cowardice, debt, and being overpowered by people.) This addresses all dimensions of stress in a single supplication." },
    { q: "Does reciting dua reduce stress?", a: "Yes — through multiple mechanisms. Psychologically: focused attention on a meaningful phrase interrupts the stress thought loop. Physiologically: slow recitation activates the parasympathetic nervous system. Spiritually: the act of calling on Allah acknowledges that you are not alone and not in control of everything." },
    { q: "Which surah to read for stress?", a: "Surah Ad-Duha (93) — revealed when the Prophet ﷺ was under extreme stress, feeling abandoned. Surah Al-Inshirah (94) — 'With hardship comes ease' repeated twice. Surah Al-Baqarah 2:286 — 'Allah does not burden a soul beyond what it can bear.'" },
  ];
  const body = `
${hero("linear-gradient(155deg,#0c0a08 0%,#09070a 45%,#090908 100%)", "Stress Relief · Islamic Healing", "Dua for Stress — When the Weight Becomes Too Heavy", "There is a specific, authentic supplication for exactly this feeling. The Prophet ﷺ taught it.", "Save These Duas →", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What dua relieves stress immediately?", "Recite slowly: 'La hawla wa la quwwata illa billah' (There is no might nor power except with Allah). This single phrase is called the kanz (treasure) from the treasures of Jannah. Scholars say it physiologically and spiritually breaks the feeling of helplessness that underlies most stress. Repeat it until you feel the shift.")}
${duaCard("اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal", "O Allah, I seek refuge in You from anxiety and grief, from incapacity and laziness, from miserliness and cowardice, and from the burden of debt and from being overpowered by others.", "Sahih Bukhari 6369 — the Prophet's own dua for the complete spectrum of stress")}
${duaCard("رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", "Rabbish-rah li sadri wa yassir li amri", "My Lord, expand my chest and ease my affairs.", "Quran 20:25-26 — the dua of Prophet Musa ﷺ before facing Pharaoh. For when the task ahead feels overwhelming.")}
${quranRef("إِنَّ مَعَ الْعُسْرِ يُسْرًا", "Indeed, with hardship comes ease.", "Quran 94:6 — 'with' not 'after.' The ease is already present inside the difficulty. Read this when stress convinces you there is no way through.")}
${card("The Stress Protocol — 5 Minutes", "1. Stop. Put down everything. 2. Recite 'La hawla wa la quwwata illa billah' × 10 slowly. 3. Make wudu if possible. 4. Recite the full stress dua from Bukhari 6369 above. 5. Name the specific thing stressing you and make personal dua about it. 6. Return to your task with a clear beginning. This is not avoidance — it is the reset that makes action possible.")}
${card("What Stress Is Spiritually", "Stress is the gap between what you believe should be happening and what is happening. Islam narrows this gap through qadar (divine decree) — not as resignation, but as the liberating recognition that the universe is running according to a plan you are not required to manage. Your job is action. Allah's job is outcome.")}
${geoBlock('healing')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_HEALING)}
${emotionalCTA({ title: "Islamic Stress Relief Daily", subtitle: "Guided duas, breathing sessions, and AI Islamic companion — free in MyTazki.", href: "/download", btnText: "Try MyTazki →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 15. /healing-through-quran
router.get("/healing-through-quran", (_req, res) => {
  const slug = "/healing-through-quran";
  const title = "Healing Through Quran — The Quran as Spiritual and Emotional Medicine";
  const desc = "How the Quran heals — emotionally, spiritually, and physically. A practical guide to using the Quran for healing grief, anxiety, depression, and spiritual wounds, rooted in Quran and Sunnah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Healing Through Quran" }];
  const faqs = [
    { q: "How does the Quran heal?", a: "Allah explicitly describes the Quran as 'shifa' (healing): 'And We send down of the Quran that which is healing and mercy for the believers' (17:82). Healing occurs on multiple levels: (1) Spiritual — strengthening iman and connection with Allah. (2) Psychological — replacing negative thought patterns with Quranic truths. (3) Physical — measurable physiological changes from recitation rhythm. (4) Emotional — the Quran names and validates every human emotion." },
    { q: "Which Quran surah is for healing?", a: "Surah Al-Fatiha is called 'the mother of healing' — the Prophet ﷺ used it for ruqyah. Al-Baqarah provides complete spiritual protection. Surah Ad-Duha heals abandonment and depression. Surah Al-Inshirah heals hopelessness. Surah Ar-Rahman heals the heart through its repeated reminder of Allah's mercy." },
    { q: "How do I use the Quran for emotional healing?", a: "Select a surah relevant to your emotional state. Read with tadabbur (deep reflection) — slowly, one verse at a time. For grief: Surah Al-Baqarah 2:155-157. For anxiety: 13:28. For abandonment: 93:3. For overwhelm: 94:5-6. Let the meaning sit in your heart before moving to the next verse." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0a0909 0%,#09070a 42%,#090a08 100%)", "Quran Healing · Shifa", "Healing Through Quran", "Allah called it shifa — healing. Not metaphor. Not poetry. A literal description of what happens when these words enter a wounded heart.", "Read the Quran →", "/quran", "Explore Duas", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How does the Quran heal emotionally?", "The Quran heals through three mechanisms: (1) Truth — it corrects the lies anxiety, depression, and grief tell (that you are alone, that there is no hope, that this will never end). (2) Presence — recitation creates a state of focused presence that interrupts rumination. (3) Connection — reading Quran is communication with Allah, the only One who knows the full context of your pain.")}
${quranRef("وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", "And We send down of the Quran that which is healing and mercy for the believers.", "Quran 17:82 — Allah's direct statement. The Quran is medicine. This is not metaphor.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Arabic word <em style="color:#c9a472">shifa'</em> in this verse means cure, remedy, healing — the same word used for medical treatment in classical Arabic. The Quran is not a comfort object. It is described by its Author as active medicine for whatever wounds your soul is carrying.</p>
${card("For Grief — Quran 2:155-157", "Recite slowly: 'We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient — who, when disaster strikes them, say: Indeed we belong to Allah and indeed to Him we will return. Those are the ones upon whom are blessings from their Lord and mercy. And it is those who are rightly guided.' Read this for any loss. Allah named your grief before you felt it.")}
${card("For Anxiety — Quran 13:28", "'Verily, in the remembrance of Allah do hearts find rest.' The key word is tatma'inn — complete, settled stillness, not temporary distraction. Recite this verse and then recite Subhanallah slowly × 33, Alhamdulillah × 33, Allahu Akbar × 34. Feel the word tatma'inn as a promise being fulfilled in real time.")}
${card("For Hopelessness — Surah Ad-Duha", "Read when you feel abandoned: 'Your Lord has not forsaken you, nor has He detested you.' (93:3). This verse was revealed to the Prophet ﷺ during the most painful period of his life. Allah's response to his pain was not explanation — it was presence. The reassurance that He had not left.")}
${card("For Overwhelm — Surah Al-Inshirah", "'For indeed, with hardship will be ease. Indeed, with hardship will be ease.' (94:5-6). Scholars note that 'hardship' is definite (al-'usr) — the same hardship each time. But 'ease' is indefinite (yusr) — a new ease each mention. Two eases for every hardship. This is not optimism. This is Quran.")}
${geoBlock('healing')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_HEALING)}
${emotionalCTA({ title: "Read Quran for Healing Daily", subtitle: "Audio Quran, guided reflections, and healing sessions — free in MyTazki.", href: "/quran", btnText: "Open Quran →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 16. /sadness-in-islam
router.get("/sadness-in-islam", (_req, res) => {
  const slug = "/sadness-in-islam";
  const title = "Sadness in Islam — What Islam Says About Grief and Emotional Pain";
  const desc = "Islam's complete guidance on sadness, grief, and emotional pain. Is sadness forbidden? What did the Prophet ﷺ say about crying? How to process grief the Islamic way.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Sadness in Islam" }];
  const faqs = [
    { q: "Is it haram to feel sad in Islam?", a: "No. Sadness is not haram. The Prophet ﷺ wept when his son Ibrahim died, saying: 'The eye cries and the heart grieves, but we say nothing displeasing to Allah.' (Bukhari). Allah mentions sadness in the Quran without condemning it. What Islam guides is how we respond to sadness — not by demanding its absence." },
    { q: "What does Islam say about crying?", a: "Crying is a mercy. The Prophet ﷺ said: 'These are tears of mercy, and Allah has mercy on those of His servants who are merciful.' He wept in salah, at death, at signs of mercy. Suppressing all tears is not Islamic virtue — it is emotional suppression that causes deeper harm." },
    { q: "How do you deal with sadness Islamically?", a: "1. Allow the feeling — Islam does not demand you perform happiness. 2. Turn to Allah — 'Indeed, I complain of my suffering and my grief only to Allah' (12:86, Yaqub ﷺ). 3. Recite dua for sadness. 4. Seek community. 5. Seek professional help when sadness becomes prolonged. All of these are validated by Sunnah." },
  ];
  const body = `
${hero("linear-gradient(155deg,#0b0909 0%,#09070a 45%,#090908 100%)", "Emotional Truth · Islamic Wisdom", "Sadness in Islam — You Are Allowed to Grieve", "The Prophet ﷺ wept. The Quran names grief. Islam does not ask you to pretend.", "Find Support →", "/download", "Explore Duas", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("Is sadness normal in Islam?", "Yes — completely normal. Every prophet experienced sadness. The Quran calls the year the Prophet ﷺ lost Khadijah RA and Abu Talib 'the year of sadness.' Allah revealed entire surahs (Ad-Duha, Al-Inshirah) as responses to the Prophet's grief. Islam's message is not 'be happy' — it is 'grieve with Allah, not without Him.'")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">Prophet Yaqub ﷺ grieved so deeply for his son Yusuf that he lost his sight from weeping. The Quran does not criticize this. It records it. The Quran records the prophets weeping, despairing, crying out to Allah from their pain — because it is telling the truth about what human life contains, and what faith looks like inside of it.</p>
${quranRef("إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ", "Indeed, I only complain of my suffering and my grief to Allah.", "Quran 12:86 — Prophet Yaqub ﷺ, on grieving his son. The Islamic model: bring sadness to Allah, not away from Him.")}
${duaCard("اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", "Allahumma inni a'udhu bika minal-hammi wal-hazani", "O Allah, I seek refuge in You from anxiety and grief.", "Sahih Bukhari — the Prophet's own prayer during grief. He did not deny the grief; he brought it to Allah.")}
${card("Islam Validates Grief — Do Not Rush Through It", "One of the most harmful misunderstandings in Muslim communities is the expectation to 'be patient' by not showing sadness. True sabr (patience) is not the suppression of feeling. It is the refusal to despair while feeling. Yaqub ﷺ wept and refused to despair simultaneously. That is the Islamic model.")}
${card("The Year of Sadness — Even the Prophet Was Not Exempt", "In one year, the Prophet ﷺ lost his beloved wife Khadijah RA and his protector Abu Talib. Islamic historians named it 'Am al-Huzn' — the Year of Grief. Allah did not remove his sadness immediately. He revealed Surah Ad-Duha to sit with the Prophet ﷺ inside his grief and remind him He had not left.")}
${card("When Sadness Becomes Depression", "Extended sadness that affects daily functioning, sleep, eating, and salah may be clinical depression — a medical condition. The Prophet ﷺ said: 'Seek treatment, for Allah has not sent down any disease without sending down a cure.' Consulting a therapist or doctor is Sunnah action, not spiritual failure.")}
${geoBlock('healing')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_HEALING)}
${emotionalCTA({ title: "Islamic Emotional Support in MyTazki", subtitle: "Guided healing sessions, duas for sadness, and AI Islamic companion — free.", href: "/download", btnText: "Open MyTazki →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 17. /allah-tests-those-he-loves
router.get("/allah-tests-those-he-loves", (_req, res) => {
  const slug = "/allah-tests-those-he-loves";
  const title = "Allah Tests Those He Loves — The Islamic Understanding of Hardship";
  const desc = "Why does Allah test the people He loves most? The Prophet's teaching on trials, what hardship means spiritually, and how to find peace in difficulty through Islamic wisdom.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Allah Tests Those He Loves" }];
  const faqs = [
    { q: "Does Allah test those He loves?", a: "Yes. The Prophet ﷺ said: 'The greatest reward comes with the greatest trial. When Allah loves a people He tests them. Whoever accepts that wins His pleasure and whoever is discontent with that earns His wrath.' (Tirmidhi). The most tested were the prophets, then the righteous, then in descending order." },
    { q: "Why does Allah test good people?", a: "Islam gives multiple reasons: (1) Elevation — trials raise spiritual rank. (2) Expiation — hardship removes sins. (3) Awakening — tests return wandering hearts to Allah. (4) Example — the believers who pass trials become proof for others. (5) Distinction — trials reveal the depth of faith." },
    { q: "What to say when Allah is testing you?", a: "'Inna lillahi wa inna ilayhi raji'un' — Indeed we belong to Allah and to Him we shall return (2:156). This is not resignation. It is the recognition that both you and the thing you lost belong to Allah — and He is the best keeper. Follow with: 'Allahumma ujurni fi musibati wa akhlif li khayran minha.'" },
  ];
  const body = `
${hero("linear-gradient(150deg,#0d0b08 0%,#09070a 45%,#080a09 100%)", "Trials & Tawakkul · Hope", "Allah Tests Those He Loves Most", "The prophets were the most tried. Not because Allah abandoned them — because He trusted them.", "Find Hope →", "/download", "Read Duas", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("Why does Allah test those He loves?", "The Prophet ﷺ said the most severely tested people are the prophets, then the righteous, then those like them in order. Testing is not punishment — it is selection. The hardest gold gets the hottest fire. Allah does not test a soul with more than it can bear (2:286), which means the size of your trial is also a statement about the size of your capacity.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">Prophet Ayyub ﷺ lost his health, his wealth, and his family. He did not lose his tongue. He said: <em style="color:#c9a472">"Harm has befallen me and You are the Most Merciful of the merciful."</em> (21:83). He did not pretend the pain was not real. He brought its full weight to Allah and named Who He was bringing it to.</p>
${quranRef("وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ", "We will surely test you with something of fear and hunger and a loss of wealth, lives, and fruits.", "Quran 2:155 — Allah announces the testing in advance. The difficulty is not a surprise to Him. Only to you.")}
${duaCard("إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا", "Inna lillahi wa inna ilayhi raji'un. Allahumma ujurni fi musibati wa akhlif li khayran minha", "Indeed we belong to Allah and to Him we shall return. O Allah, reward me for my affliction and replace it for me with something better.", "Sahih Muslim 918 — the Prophet ﷺ said whoever says this, Allah will give them something better than what they lost")}
${card("What Trials Actually Do Spiritually", "Ibn Qayyim Al-Jawziyyah wrote: 'Had it not been for the trials of this world, the servant would become arrogant, cruel, and hard-hearted.' Trials do what comfort cannot: they return you to your actual size, remind you of your actual dependencies, and open doors of du'a that success never opens.")}
${card("The Ranking of Trials — A Comforting Truth", "The Prophet ﷺ said: 'The amount of trial a person receives is proportional to their level of faith. If their faith is firm, the trial increases. If there is weakness in their faith, the trial is adjusted accordingly.' This means: your trial is calibrated to you. Allah is not careless with it.")}
${geoBlock('healing')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_HEALING)}
${emotionalCTA({ title: "Navigate Trials with MyTazki", subtitle: "Guided sessions on sabr, tawakkul, and healing — free.", href: "/download", btnText: "Open MyTazki →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 18. /healing-after-breakup-islam
router.get("/healing-after-breakup-islam", (_req, res) => {
  const slug = "/healing-after-breakup-islam";
  const title = "Healing After a Breakup in Islam — The Islamic Path Through Heartbreak";
  const desc = "How Islam guides healing after romantic loss, breakup, or rejection. Authentic duas, Quran verses, and a practical Islamic framework for moving through heartbreak with faith.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Healing After Breakup in Islam" }];
  const faqs = [
    { q: "What does Islam say about heartbreak?", a: "Islam acknowledges romantic love as real and loss of it as painful. The Prophet ﷺ's love for Khadijah RA is described in detail in authentic hadith — and her death broke him deeply. Islam does not dismiss heartbreak. It provides a framework: grieve honestly, turn toward Allah, trust qadar, and know that what was not written for you would have broken you if it had arrived." },
    { q: "How to move on after a breakup islamically?", a: "1. Allow the grief — Islam does not demand cheerfulness. 2. Cut contact that feeds attachment. 3. Make dua: 'Allahumma ihfadhni min sharri ma qadarta 'alayh' (protect me from what You have decreed). 4. Increase worship — loss opens hearts to Allah in ways comfort never does. 5. Trust that Allah's plan for your provision includes your spouse. 6. Seek support — community is sunnah." },
    { q: "Is it allowed to grieve a relationship in Islam?", a: "Yes. Grief is not a sin. The question is what you do inside the grief. If it leads you to haram (forbidden contact, self-harm, despair), redirect it. If it leads you to dua and increased awareness of your need for Allah — that is alchemy. The most spiritually transformative periods in believers' lives are often the most painful ones." },
  ];
  const body = `
${hero("linear-gradient(155deg,#0d090a 0%,#09070a 45%,#090808 100%)", "Heartbreak · Healing · Hope", "Healing After a Breakup in Islam", "What was not written for you could not have stayed. What is written for you cannot be taken.", "Begin Healing →", "/download", "Find Support", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How does Islam help with breakup healing?", "Islam's framework for heartbreak: (1) Qadar — this person was not written for you, and what is not written for you would have harmed you. (2) Tawakkul — release the outcome to Allah. (3) Grief is permitted — the Prophet ﷺ himself experienced profound loss and did not mask it. (4) Dua — bring the specific pain to Allah. (5) Trust — Allah is Al-Wadud (the Most Loving) and knows exactly what your heart needs next.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Prophet ﷺ said about Khadijah RA years after her death: <em style="color:#c9a472">"She believed in me when people disbelieved; she helped me with her wealth when people withheld; and Allah blessed me with children through her."</em> He loved deeply. He lost deeply. Islam does not ask you to not feel. It asks you to trust the One who holds all of it.</p>
${duaCard("اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ", "Allahumma inni as'aluka minal-khayri kullihi", "O Allah, I ask You for all good.", "Abu Dawud — a comprehensive dua for when you don't know what to ask for next, but you trust Allah knows")}
${quranRef("عَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", "Perhaps you hate a thing and it is good for you.", "Quran 2:216 — the verse for every heartbreak. What ended was not your enemy. What you lost may have been what would have harmed you.")}
${card("The 40-Day Healing Practice", "Islamic scholars recommend a 40-day intention for healing. For 40 days: (1) Two rakaat Duha prayer daily, asking Allah to replace what was lost with something better. (2) Recite Ayatul Kursi every morning with intention of healing. (3) Cut all contact with the person. (4) Give sadqa on Fridays for your own healing. (5) Keep a du'a journal — one specific request per day.")}
${card("What Qadar Means for This Loss", "Qadar (divine decree) in relationships means: the person Allah has written for you is written. It cannot be stolen, it cannot arrive late, it cannot be stopped. What was not written for you — no matter how much you loved them — was not yours to keep. This is not cold comfort. It is the most loving architecture imaginable: your perfect provision already decided, already coming.")}
${geoBlock('healing')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_HEALING)}
${emotionalCTA({ title: "Heal with Islamic Guidance Daily", subtitle: "Guided sessions, duas for heartbreak, and AI Islamic companion — free.", href: "/download", btnText: "Begin Healing →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 19. /dua-for-heartbreak
router.get("/dua-for-heartbreak", (_req, res) => {
  const slug = "/dua-for-heartbreak";
  const title = "Dua for Heartbreak — Islamic Supplications for a Broken Heart";
  const desc = "Powerful duas for heartbreak, loss, and romantic grief from Quran and authentic Sunnah. Arabic, transliteration, meaning, and when to recite each for healing.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Duas Library", item: "/duas" }, { name: "Dua for Heartbreak" }];
  const faqs = [
    { q: "What dua should I read for heartbreak?", a: "'Hasbunallahu wa ni'mal wakil' — Allah is sufficient for us, and He is the best disposer of affairs (3:173). This was recited by the companions when facing overwhelming loss. Also: 'Inna lillahi wa inna ilayhi raji'un' with the follow-up: 'Allahumma ujurni fi musibati wa akhlif li khayran minha' — and the Prophet ﷺ promised Allah would replace what was lost with something better." },
    { q: "Is there a specific dua for a broken heart?", a: "The dua of Prophet Yaqub ﷺ comes closest: 'Innama ashku bathhi wa huzni ilallah' — 'I only complain of my suffering and grief to Allah' (12:86). Bring your broken heart specifically to Allah in this way: 'Ya Allah, my heart is broken over [name what you lost]. I am in pain. I trust that You know what I cannot see.'" },
  ];
  const body = `
${hero("linear-gradient(155deg,#0e0809 0%,#09070a 45%,#080909 100%)", "Heartbreak · Healing Duas", "Dua for Heartbreak — Bringing Pain to Allah", "A broken heart brought to Allah is already beginning to heal.", "Save These Duas →", "/duas", "Explore Sessions", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What is the dua for a broken heart in Islam?", "Recite: 'Inna lillahi wa inna ilayhi raji'un. Allahumma ujurni fi musibati wa akhlif li khayran minha.' (We belong to Allah and return to Him. O Allah, reward me in my affliction and replace it with something better.) The Prophet ﷺ guaranteed that whoever says this will receive something better than what was lost — Umm Salamah RA tested this after losing her first husband and gained the Prophet ﷺ himself.")}
${duaCard("إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا", "Inna lillahi wa inna ilayhi raji'un. Allahumma ujurni fi musibati wa akhlif li khayran minha", "We belong to Allah and return to Him. O Allah, reward me in my affliction and replace it with something better.", "Sahih Muslim 918 — Umm Salamah RA said this after losing her husband; Allah gave her the Prophet ﷺ in marriage")}
${duaCard("إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ", "Innama ashku bathhi wa huzni ilallah", "I only complain of my suffering and grief to Allah.", "Quran 12:86 — Prophet Yaqub ﷺ, speaking about his unbearable grief. Bring your pain to Allah by name.")}
${quranRef("وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ", "Perhaps you dislike a thing and it is good for you, and perhaps you love a thing and it is bad for you. Allah knows while you do not know.", "Quran 2:216 — the theological foundation of healing from heartbreak")}
${card("How to Use These Duas for Heartbreak", "Don't recite them mechanically. Recite them as conversation. When you say 'Inna lillahi' — feel what it means that you and the person you lost both belong to Allah. You were always borrowing each other. When you say 'Allahumma akhlif li khayran minha' — believe it. Umm Salamah RA believed it. Allah honored it.")}
${geoBlock('healing')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_HEALING)}
${emotionalCTA({ title: "Heal with MyTazki Daily", subtitle: "Duas library, guided healing sessions, and AI Islamic companion — free.", href: "/download", btnText: "Open MyTazki →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 20. /letting-go-in-islam
router.get("/letting-go-in-islam", (_req, res) => {
  const slug = "/letting-go-in-islam";
  const title = "Letting Go in Islam — Tawakkul, Acceptance, and Emotional Release";
  const desc = "The Islamic practice of letting go — tawakkul, acceptance of qadar, and releasing what you cannot control. A practical guide for Muslims struggling to release pain, loss, or attachment.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Letting Go in Islam" }];
  const faqs = [
    { q: "What does Islam say about letting go?", a: "Letting go is the practical expression of tawakkul (trust in Allah). The Prophet ﷺ said: 'Know that what has passed you by was not going to befall you, and what has befallen you was not going to pass you by.' (Abu Dawud). Letting go in Islam is not denial of loss — it is the recognition that what Allah has decreed is precisely what was meant to happen." },
    { q: "How to let go of someone in Islam?", a: "1. Accept that this person was not written for you in the way you wanted. 2. Make sincere dua for their wellbeing without expectation of return. 3. Cut contact that sustains false hope. 4. Recite: 'Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik' — O Allah help me remember You, be grateful to You, and worship You well. 5. Fill the space they occupied with Allah's remembrance." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0c0a09 0%,#09070a 48%,#080a09 100%)", "Release · Tawakkul · Peace", "Letting Go in Islam — The Art of Releasing", "What you are holding that Allah did not decree for you is hurting both of you. Let it go to Him.", "Begin Releasing →", "/download", "Find Peace", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How do you let go islamically?", "Letting go in Islam is an act of tawhid: recognizing that only Allah is permanent, and that attaching to anything else as if it were permanent is a form of spiritual miscalculation. The practice: (1) Name what you are holding. (2) Say: 'Ya Allah, I acknowledge this is in Your hands, not mine.' (3) Recite 'Hasbunallahu wa ni'mal wakil.' (4) Do not pick it back up in thought. When you do (and you will), repeat.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Prophet ﷺ said: <em style="color:#c9a472">"Know that if the whole nation were to gather together to benefit you, they could only benefit you with something that Allah had already written for you. And if the whole nation were to gather together to harm you, they could only harm you with something Allah had already written against you."</em> (Tirmidhi). This is the physics of letting go.</p>
${duaCard("حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", "Hasbunallahu wa ni'mal wakil", "Allah is sufficient for us, and He is the best disposer of affairs.", "Quran 3:173 — the dua of release. Say it and mean it: Allah is enough. He will handle what you are letting go of.")}
${quranRef("مَا أَصَابَ مِن مُّصِيبَةٍ إِلَّا بِإِذْنِ اللَّهِ وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ", "No disaster strikes except by permission of Allah. And whoever believes in Allah — He will guide his heart.", "Quran 64:11 — belief in Allah's permission is what makes letting go possible. The loss was permitted. It was not random.")}
${card("The Difference Between Letting Go and Giving Up", "Islamic letting go is active. You do everything within your ability — then you release the outcome. Ibrahim ﷺ laid his son down. Musa ﷺ placed the basket in the river. Hajar RA walked between Safa and Marwa. They acted fully, then surrendered the result. That is the model. Not passivity. Not defeat. Faith in action followed by surrender.")}
${geoBlock('healing')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_HEALING)}
${emotionalCTA({ title: "Release and Heal with MyTazki", subtitle: "Guided tawakkul sessions, duas, and AI Islamic companion — free.", href: "/download", btnText: "Begin Releasing →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 21. /allah-heals-broken-hearts
router.get("/allah-heals-broken-hearts", (_req, res) => {
  const slug = "/allah-heals-broken-hearts";
  const title = "Allah Heals Broken Hearts — Al-Jabbar, the Mender of All Things";
  const desc = "How Allah heals broken hearts through His name Al-Jabbar. What this name means, duas for heart healing, and the Islamic truth about how the deepest wounds are mended by the Most Loving.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Allah Heals Broken Hearts" }];
  const faqs = [
    { q: "Does Allah heal broken hearts?", a: "Yes — this is one of Allah's attributes. Al-Jabbar (the Compeller, the Mender) is specifically understood in classical Islamic scholarship to mean 'the One who mends broken things.' Ibn Qayyim writes: 'Al-Jabbar sets broken bones, and He sets broken hearts.' Call on Him by this name directly." },
    { q: "How do I ask Allah to heal my heart?", a: "Say: 'Ya Jabbar, ijbur qalbi' — O Mender, mend my heart. This is du'a by name — the most powerful form. Also: 'Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik.' And: Read Surah Ash-Sharh (94) — it promises that with every hardship comes ease, repeated twice for emphasis." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0e0a0b 0%,#09070a 45%,#08090a 100%)", "Al-Jabbar · The Mender", "Allah Heals Broken Hearts", "He is Al-Jabbar — the One who mends what is broken. Your heart is exactly the kind of thing He does.", "Find Healing →", "/download", "99 Names of Allah", "/99-names")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("Which name of Allah heals the heart?", "Al-Jabbar (الجبار) — the Compeller, the Mender. Classical scholars like Ibn Kathir and Ibn Qayyim explain that this name contains the meaning of 'setting a broken thing right' — as in jabara al-kasir (he set the broken bone). Call on Allah by this name when your heart is broken: 'Ya Jabbar, ijbur qalbi' (O Mender, mend my heart).")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">Ibn Qayyim al-Jawziyyah wrote: <em style="color:#c9a472">"The hearts are in the hand of the Most Merciful, and He turns them as He wills. He breaks the heart of His servant to draw it near to Him, and He mends it with His remembrance."</em> The breaking is not the end. It is the opening through which Al-Jabbar enters.</p>
${duaCard("يَا جَبَّارُ اجْبُرْ قَلْبِي", "Ya Jabbar, ijbur qalbi", "O Mender, mend my heart.", "Not in hadith as a reported dua — but a valid form of du'a by Allah's name, used by Islamic scholars and sufi teachers across centuries of heartbreak")}
${quranRef("أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", "Did We not expand for you your chest?", "Quran 94:1 — Allah healed the Prophet's ﷺ heart. The same Allah who did that is the One you are calling on now.")}
${card("What Al-Jabbar Means for Your Specific Wound", "Al-Jabbar does not heal abstractly. He heals specifically. The same precision He applied to setting the bones of Ibrahim ﷺ after the fire, the same precision He applied to returning Musa ﷺ to his mother — He applies to your wound. Tell Him its specifics. 'Ya Allah, my heart broke here, over this, in this way.' He knows. But the telling is for you.")}
${card("The Healing Timeline in Islam", "Allah healed Yaqub's blindness from grief — after years. He restored Ayyub's health — after a decade. He brought Yusuf to power — twenty years after the pit. Islamic healing is not instant, but it is complete. The question is not if Allah will heal your heart. It is whether you will stay close enough to receive the healing when it arrives.")}
${geoBlock('healing')}
${faqHtml(faqs)}
${relatedArticlesGrid([...RELATED_HEALING, { href: "/99-names", label: "99 Names of Allah", tag: "Asma" }])}
${emotionalCTA({ title: "Call on Allah Daily with MyTazki", subtitle: "99 Names of Allah, guided healing sessions, and AI Islamic companion — free.", href: "/99-names", btnText: "Learn 99 Names →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// ─── RIZQ CLUSTER ─────────────────────────────────────────────────────────────

// 22. /dua-for-rizq
router.get("/dua-for-rizq", (_req, res) => {
  const slug = "/dua-for-rizq";
  const title = "Dua for Rizq — Best Islamic Supplications for Sustenance and Barakah";
  const desc = "The most powerful duas for increasing rizq (sustenance) from Quran and authentic Sunnah. Arabic, transliteration, meaning, and the Islamic framework for attracting barakah in your provision.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Duas Library", item: "/duas" }, { name: "Dua for Rizq" }];
  const faqs = [
    { q: "What is the best dua for rizq?", a: "Multiple strong options: (1) 'Allahumma inni as'aluka rizqan halalan tayyiban mubarak' — for blessed provision. (2) Surah Al-Waqiah daily — the Prophet ﷺ reportedly said whoever recites it will not experience poverty. (3) Istighfar (seeking forgiveness) — Allah links rizq to tawbah in Quran 71:10-12. (4) Salawat on the Prophet — creates barakah in provision." },
    { q: "Which surah to recite for rizq?", a: "Surah Al-Waqiah (56) — the surah of provision. Surah Al-Muzammil (73) — for barakah. Surah Al-Kahf (18) on Fridays — protection from poverty. The last verse of Surah Hud (11:6): 'There is no creature on earth but that upon Allah is its provision.' These are the primary quranic anchors for rizq." },
    { q: "Does salah increase rizq?", a: "Yes. Allah says in Quran 20:132: 'And enjoin prayer upon your family and be steadfast therein. We ask you not for provision; We provide for you.' Consistent salah is the most fundamental Islamic practice for attracting provision. The Prophet ﷺ also said early rising (for Fajr) brings barakah in the day's work." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0d0c08 0%,#09070a 45%,#090a08 100%)", "Rizq · Provision · Barakah", "Dua for Rizq — Calling on the Provider", "Allah is Ar-Razzaq — the Provider. His provision is not limited by your circumstances.", "Save These Duas →", "/duas", "Calculate Zakat", "/zakat-calculator")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What dua should I read for rizq?", "Three proven duas: (1) 'Allahumma inni as'aluka rizqan halalan tayyiban mubaraka' (× 3 after Fajr). (2) Recite Surah Al-Waqiah every night. (3) Increase istighfar — Allah explicitly links forgiveness to increased provision in Quran 71:10-12: 'I said: Ask forgiveness of your Lord... He will send rain upon you in showers, provide you with wealth and children.'")}
${duaCard("اللَّهُمَّ إِنِّي أَسْأَلُكَ رِزْقاً حَلَالاً طَيِّباً مُبَارَكاً", "Allahumma inni as'aluka rizqan halalan tayyiban mubarakan", "O Allah, I ask You for provision that is lawful, pure, and blessed.", "Recite × 3 after Fajr salah — the most important time for rizq dua")}
${duaCard("اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ", "Allahumma-kfini bihalaalika 'an haramika wa aghnini bifadlika 'amman siwak", "O Allah, suffice me with what You have made lawful so that I do not need what is forbidden, and enrich me by Your grace so that I need no one other than You.", "Tirmidhi 3563 — protection from financial sin alongside provision")}
${quranRef("وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", "And whoever fears Allah — He will make for him a way out, and will provide for him from where he does not expect.", "Quran 65:2-3 — the rizq verse. Taqwa (God-consciousness) is a direct cause of provision from unexpected sources.")}
${card("The Three Amplifiers of Rizq in Islam", "(1) Istighfar — seeking forgiveness opens the gates of provision (Quran 71:10-12). (2) Salawat on the Prophet ﷺ — creates barakah that multiplies provision. (3) Sadqa — charity does not decrease wealth; it increases it. (Bukhari 1469). These three practiced daily create a compounding effect on barakah in provision.")}
${card("What Ar-Razzaq Means for Your Situation", "Ar-Razzaq (the Provider) is one of Allah's divine names. His provision is not conditional on the economy, your boss, the market, or your circumstances. 'There is no creature on earth but that upon Allah is its provision' (11:6). This includes you. Your rizq is written and will reach you — the dua is for barakah in it and protection from haram alternatives.")}
${geoBlock('rizq')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_RIZQ)}
${emotionalCTA({ title: "Daily Rizq Duas in MyTazki", subtitle: "Complete duas library, morning azkar for provision, and AI Islamic guide — free.", href: "/duas", btnText: "Open Duas →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 23. /barakah-in-rizq
router.get("/barakah-in-rizq", (_req, res) => {
  const slug = "/barakah-in-rizq";
  const title = "Barakah in Rizq — How to Attract Blessing in Your Income and Wealth";
  const desc = "What barakah in rizq means, how to increase it, and the specific Islamic practices that attract divine blessing in your income, time, and provision. Based on Quran and authentic Sunnah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Duas Library", item: "/duas" }, { name: "Barakah in Rizq" }];
  const faqs = [
    { q: "What is barakah in rizq?", a: "Barakah is divine blessing that causes something to grow beyond its apparent measure. Barakah in rizq means: £500 that feels like £1,000 in sufficiency. Provision that stretches further than it should. Needs met from unexpected sources. The Prophet ﷺ said: 'Barakah is in three things: in the congregation, in tharid (food), and in the early morning.'" },
    { q: "How to increase barakah in income?", a: "Islam identifies specific practices: (1) Begin all work with Bismillah. (2) Pay Zakat — purifies wealth and increases barakah. (3) Give sadqa regularly — the Prophet said it does not decrease wealth. (4) Avoid haram income at all levels — haram removes barakah even from halal portions. (5) Be grateful — 'If you are grateful, I will surely increase you' (14:7)." },
    { q: "Does sadqa increase rizq?", a: "Yes. The Prophet ﷺ said in Sahih Bukhari: 'Charity does not decrease wealth.' In the hadith Qudsi: 'O son of Adam, spend and I will spend on you.' Giving sadqa is not financially risky — it is the Islamic method of increasing provision. Start with consistent small amounts rather than occasional large ones." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0e0c07 0%,#09070a 45%,#090b08 100%)", "Provision · Blessing · Gratitude", "Barakah in Rizq — When Provision Is Blessed", "The goal is not more money. The goal is enough that is blessed. That is a completely different prayer.", "Attract Barakah →", "/download", "Calculate Zakat", "/zakat-calculator")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How do you get barakah in your rizq?", "Five highest-impact practices: (1) Pay Zakat — this is the primary Quranic mechanism for purifying and increasing wealth. (2) Daily sadqa — even small amounts, consistently. (3) Start every task with Bismillah — the Prophet ﷺ said anything without bismillah is cut off from blessing. (4) Avoid haram in income — even a small haram source removes barakah from all income. (5) Make shukr specific — thank Allah for the exact provisions you received today.")}
${duaCard("اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا", "Allahumma barik lana fima razaqtana", "O Allah, bless us in what You have provided for us.", "Ibn Majah — said before eating, but valid for any provision. Ask for barakah in what you have, not just more.")}
${quranRef("لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ", "If you are grateful, I will surely increase you; but if you deny, indeed My punishment is severe.", "Quran 14:7 — gratitude is not just etiquette. It is the mechanism Allah has linked to increase.")}
${card("The Zakat-Barakah Connection", "Zakat (2.5% of qualifying wealth annually) is not charity — it is purification. Allah says: 'Take from their wealth a charity by which you purify them and cause them increase' (9:103). The word for increase here is tuzakkihim — the same root as tazkiyah (purification). Paying Zakat removes the impurity that blocks barakah. Use MyTazki's Zakat calculator to find your exact amount.")}
${card("Why Haram Income Destroys Barakah", "Ibn Abbas RA reported that the Prophet ﷺ said: 'If a person earns haram and gives sadqa from it, it is not accepted. If he spends from it, there is no barakah in it.' A single haram source in your income can remove barakah from all of it — not as punishment, but as physics. Purity is the container that holds blessing.")}
${geoBlock('rizq')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_RIZQ)}
${emotionalCTA({ title: "Track Spiritual Habits with MyTazki", subtitle: "Zakat calculator, daily duas, growth tracker — free Islamic life tool.", href: "/zakat-calculator", btnText: "Calculate Zakat →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 24. /dua-for-job
router.get("/dua-for-job", (_req, res) => {
  const slug = "/dua-for-job";
  const title = "Dua for Job — Islamic Supplications for Employment and Career";
  const desc = "Powerful duas for finding a job, passing an interview, or receiving a career breakthrough. Based on authentic Sunnah with guidance on the Islamic framework for seeking employment.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Duas Library", item: "/duas" }, { name: "Dua for Job" }];
  const faqs = [
    { q: "What is the dua for getting a job?", a: "'Rabbish-rah li sadri wa yassir li amri' (20:25-26) — the dua of Prophet Musa ﷺ before his mission. For specific job: 'Allahumma inni as'aluka rizqan halalan tayyiban mubaraka' with the specific job mentioned in your personal dua. Also: 'Allahumma yassir wa la tu'assir' (O Allah, make things easy, not difficult)." },
    { q: "Which surah to read for job interview?", a: "Surah Al-Inshirah (94) — 'Indeed with hardship comes ease' — read the evening before. Surah Al-Fajr (89) — 'O reassured soul.' Ayatul Kursi before entering the interview location. 'Hasbunallahu wa ni'mal wakil' in the waiting room." },
    { q: "Is it Sunnah to seek employment?", a: "Yes. The Prophet ﷺ said: 'It is better for any of you to carry a load of firewood on his back and sell it than to ask from others.' Working for your provision is a form of worship. The Prophet explicitly discouraged unnecessary dependence when self-sufficiency is possible." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0c0b08 0%,#09070a 45%,#08090c 100%)", "Career · Tawakkul · Provision", "Dua for Job — The Islamic Way to Seek Provision", "The effort is yours. The outcome is His. Make the best CV and the sincerest dua.", "Save These Duas →", "/duas", "Explore Sessions", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What dua should I read for a job?", "Before each application or interview: (1) Two rakaat salah with intention for guidance. (2) Read: 'Rabbish-rah li sadri wa yassir li amri' (20:25-26) × 7. (3) Then make personal dua: 'Ya Allah, You are Ar-Razzaq. Open doors of halal provision for me. Make this path easy if it is good for me and close it if it is not.' (4) Recite Ayatul Kursi before entering.")}
${duaCard("رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي", "Rabbish-rah li sadri wa yassir li amri wahlul 'uqdatan min lisani", "My Lord, expand my chest, ease my affairs, and untie the knot from my tongue.", "Quran 20:25-27 — the dua of Prophet Musa ﷺ before his mission. Perfect for interviews, presentations, and new beginnings.")}
${duaCard("اللَّهُمَّ يَسِّرْ وَلَا تُعَسِّرْ", "Allahumma yassir wa la tu'assir", "O Allah, make it easy and do not make it difficult.", "Widely reported — the simplest dua for ease in any situation including job search and interviews")}
${card("The Islamic Job Search Framework", "Islam teaches: tie your camel (do the action) then trust Allah (release the outcome). For job seeking: (1) Perfect your skills — this is your camel. (2) Research the opportunity thoroughly. (3) Pray Istikhara before committing to a specific role. (4) Make dua but do not let rejection convince you Allah is not providing — He may be redirecting to something better.")}
${card("What Istikhara Means for Career Decisions", "Istikhara is not a divine yes/no signal — it is asking Allah to write the good outcome through your effort. After Istikhara: proceed in the direction you feel inclined toward. If it works, alhamdulillah. If it doesn't, trust that the redirection was the Istikhara being answered — not the answer being wrong.")}
${geoBlock('rizq')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_RIZQ)}
${emotionalCTA({ title: "Islamic Career Guidance in MyTazki", subtitle: "Duas library, guided sessions, and AI Islamic companion for life decisions.", href: "/download", btnText: "Open MyTazki →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 25. /surah-for-rizq
router.get("/surah-for-rizq", (_req, res) => {
  const slug = "/surah-for-rizq";
  const title = "Surah for Rizq — Best Quranic Surahs for Provision and Sustenance";
  const desc = "Which surahs to recite for increased rizq and provision, based on authentic hadith and scholarly guidance. Surah Al-Waqiah, Al-Kahf, Al-Muzammil, and more.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Surah for Rizq" }];
  const faqs = [
    { q: "Which surah is for rizq?", a: "Based on hadith and scholarly consensus: (1) Surah Al-Waqiah (56) — recited nightly, reported to protect from poverty. (2) Surah Al-Muzammil (73) — reported to bring provision and barakah. (3) Surah Al-Kahf (18) every Friday — protection from poverty and fitna. (4) Ayatul Kursi morning/evening — comprehensive protection including provision." },
    { q: "Is Surah Al-Waqiah really for rizq?", a: "There is a weak hadith directly linking Surah Al-Waqiah to protection from poverty. However, the scholars generally recommend it based on its themes (resurrection, provision, Allah's control over sustenance). Even if the specific hadith is weak, the surah's content on rizq and accountability makes it spiritually relevant for this intention." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0d0b07 0%,#09070a 45%,#090c08 100%)", "Provision Surahs · Quran", "Surah for Rizq — Quranic Chapters for Provision", "The Quran contains entire chapters about how Allah provides. Read them with understanding, not just recitation.", "Read the Quran →", "/quran", "Browse Duas", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What surah should I read for rizq?", "Priority order: (1) Surah Al-Waqiah (56) — nightly. (2) Surah Al-Kahf (18) — every Friday. (3) Surah Al-Muzammil (73) — daily or on Thursdays. (4) Surah Al-Jumuah (62) — on Fridays with the intention of barakah in provision. All of these connect to themes of divine provision, gratitude, and trust in Allah as Ar-Razzaq.")}
${card("Surah Al-Waqiah (56) — The Surah of Provision", "Al-Waqiah covers three categories of people on the Day of Judgment, including the 'companions of the right hand' and their provisions in the hereafter. Its themes are: the reality of provision, the test of gratitude, and Allah's ultimate control over sustenance. Recite it every night — regardless of the debate on the hadith, its content anchors the heart in the right relationship with provision.")}
${card("Surah Al-Kahf (18) — Every Friday for Provision", "The Prophet ﷺ said: 'Whoever reads Surah Al-Kahf on Friday, a light will illuminate him between the two Fridays.' The surah contains the story of the People of the Cave (trust in Allah during hardship), Dhul-Qarnayn (provision through effort and guidance), and the rich man who lost his garden (the fragility of provision without gratitude). Powerful rizq content.")}
${quranRef("وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا", "There is no creature on earth but that upon Allah is its provision.", "Quran 11:6 — the foundational statement of Islamic rizq theology. Your provision is Allah's responsibility. Your job is the effort.")}
${card("How to Recite Surahs for Rizq Effectively", "Recitation with understanding is more powerful than fast recitation. For each surah: (1) Read the tafsir of one page before reciting. (2) Recite slowly, reflecting on the provision-related verses. (3) After reciting, make personal dua: 'Ya Razzaq, bless me from what You have written for me.' This transforms recitation from performance to conversation.")}
${geoBlock('rizq')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_RIZQ)}
${emotionalCTA({ title: "Read Quran for Rizq Daily", subtitle: "Audio Quran, verse reflections, and guided sessions — free in MyTazki.", href: "/quran", btnText: "Open Quran →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 26. /islamic-financial-stress
router.get("/islamic-financial-stress", (_req, res) => {
  const slug = "/islamic-financial-stress";
  const title = "Islamic Financial Stress — What Islam Says About Money Anxiety";
  const desc = "The Islamic framework for dealing with financial stress, debt anxiety, and money worry. Duas for provision, the Islamic perspective on financial hardship, and practical spiritual tools.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Islamic Financial Stress" }];
  const faqs = [
    { q: "What does Islam say about financial stress?", a: "Financial stress is addressed throughout the Quran and Sunnah. Key teachings: (1) Your rizq is written — 'No soul will die until it has received its written provision' (Ibn Majah). (2) Debt is serious — the Prophet ﷺ sought refuge from debt daily. (3) Sabr + practical action — address debt practically while maintaining tawakkul. (4) Avoid haram shortcuts — short-term haram income removes barakah from long-term provision." },
    { q: "What dua removes debt?", a: "'Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal' — the Prophet's comprehensive dua includes seeking refuge from 'dala'id-dayn' (the weight of debt). Also: 'Allahumma-kfini bihalaalika 'an haramik' — sufficient me with halal so I need not resort to haram." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0c0b09 0%,#09070a 45%,#090a08 100%)", "Financial Peace · Tawakkul", "Islamic Financial Stress — When Money Anxiety Takes Over", "Your provision is written. The anxiety is telling you it isn't. Islam corrects this.", "Find Peace →", "/download", "Browse Duas", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How does Islam deal with financial stress?", "Islam provides both spiritual and practical tools. Spiritual: daily dua for rizq, increasing istighfar (linked to provision in 71:10-12), sadqa (charity increases barakah). Practical: the Prophet ﷺ modeled debt management — he kept track of debts, prioritized paying them, and sought help from companions. Islam is both spiritual and practical — never one without the other.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Prophet ﷺ sought refuge from debt so frequently that Aisha RA asked why. He said: <em style="color:#c9a472">"A man, when he is in debt, speaks and lies, and makes a promise and breaks it."</em> (Bukhari). He understood that financial pressure creates spiritual pressure. Addressing debt is not just financial — it is protecting your character and your akhira.</p>
${duaCard("اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ", "Allahumma-kfini bihalaalika 'an haramika wa aghnini bifadlika 'amman siwak", "O Allah, suffice me with what You have made lawful so that I need not resort to what is forbidden, and enrich me by Your grace so that I need no one other than You.", "Tirmidhi 3563 — addresses both the spiritual and practical dimensions of financial stress")}
${quranRef("وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", "And whoever fears Allah — He will make for him a way out, and provide for him from where he does not expect.", "Quran 65:2-3 — the Islamic promise for financial hardship: taqwa opens unexpected doors of provision")}
${card("The Prophet's Own Financial Hardship", "The Prophet ﷺ and his companions experienced poverty, hunger, and financial restriction. He tied a stone to his stomach against hunger. His household sometimes went days without cooking. This is not incidental — it is the framework: the best of people experienced financial hardship without it diminishing their rank with Allah. Your hardship is not a sign of His displeasure.")}
${card("Practical Islamic Steps for Financial Stress", "1. List all debts — ambiguity amplifies anxiety. 2. Pay Zakat even in difficulty — purification of what you have. 3. Give consistent small sadqa — the Prophet guaranteed it does not decrease wealth. 4. Seek halal income increase — this is an act of worship. 5. Make dua specifically: 'Ya Razzaq, open a door of halal provision for me from where I do not expect.' Then act.")}
${geoBlock('rizq')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_RIZQ)}
${emotionalCTA({ title: "Spiritual Tools for Financial Peace", subtitle: "Duas for rizq, Zakat calculator, and daily guidance — free in MyTazki.", href: "/zakat-calculator", btnText: "Calculate Zakat →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

export default router;
