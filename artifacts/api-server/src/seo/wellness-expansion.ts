import { Router } from "express";
import { seoHead, page, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, ctaBlock, esc } from "./shared.js";
import { quickAnswerBox, peopleAlsoAsk, emotionalCTA, relatedArticlesGrid, conversationalBlock, nextStepsBlock } from "./seo-components.js";

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

const WELLNESS_RELATED = [
  { href: "/mental-wellness", label: "Mental Wellness Hub", tag: "Hub" },
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Dua" },
  { href: "/quran-for-depression", label: "Quran for Depression", tag: "Quran" },
  { href: "/7-day-inner-peace-journey", label: "7-Day Inner Peace Journey", tag: "Journey" },
  { href: "/emotional-healing-in-islam", label: "Emotional Healing in Islam", tag: "Guide" },
  { href: "/how-to-connect-with-allah", label: "Connect with Allah", tag: "Guide" },
];

// ─── 1. Dua for Loneliness ────────────────────────────────────────────────────
router.get("/dua-for-loneliness", (_req, res) => {
  const slug = "/dua-for-loneliness"; const title = "Dua for Loneliness — Islamic Relief from Isolation"; const desc = "Powerful duas for loneliness from Quran and Sunnah. Find companionship through Allah when you feel alone, isolated, or disconnected.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Dua for Loneliness" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What dua should I read when I feel lonely?", "Recite: 'Hasbunallahu wa ni'mal wakil' (Allah is sufficient for us, and He is the best disposer of affairs — 3:173). Also: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin' (The dua of Yunus in the whale — 21:87). Allah is Al-Qarib (The Near One) — loneliness in Islam means you have forgotten He is always with you.")}
<p style="color:#a0c8a0;line-height:1.8">Loneliness is one of the most painful human experiences — and the Prophet ﷺ himself experienced moments of isolation. But Islam offers a profound truth: you are never truly alone when you remember Allah. Al-Qarib (The Near One) is His name — closer to you than your jugular vein (50:16).</p>
<h2>The Best Duas for Loneliness</h2>
${quranBlock("حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", "Hasbunallahu wa ni'mal wakil", "Allah is sufficient for us, and He is the best disposer of affairs — Quran 3:173")}
${quranBlock("لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", "La ilaha illa anta subhanaka inni kuntu minadh-dhalimin", "The dua of Prophet Yunus ﷺ — answered in his deepest isolation — Quran 21:87")}
<h2>Why Islam Says You Are Never Truly Alone</h2>
<p style="color:#a0c8a0;line-height:1.8">Allah says: 'We are closer to him than his jugular vein' (50:16). 'And He is with you wherever you are' (57:4). 'Indeed, Allah is with those who are patient' (8:46). Your loneliness is a call — an invitation to turn toward the One who never leaves.</p>
${faqHtml([
  { q: "Is loneliness a sign of weak iman?", a: "No. Even the Prophet ﷺ experienced loneliness and the Sahaba felt isolation during persecution. Loneliness is a human experience. What matters is who you turn to in that loneliness — turn toward Allah, not away from Him." },
  { q: "What surah helps with loneliness?", a: "Surah Ad-Duha (93) was revealed when the Prophet ﷺ felt abandoned — Allah responded with reassurance. Surah Al-Inshirah (94) promises relief. Ayatul Kursi provides peace. Surah Al-Mulk provides protection in the quiet night hours." },
])}
${relatedArticlesGrid(WELLNESS_RELATED, "Related Islamic Wellness Guides")}
${emotionalCTA({ title: "You Are Never Alone with MyTazki", subtitle: "AI companion, guided duas, and spiritual sessions available any time — day or night.", href: "/download", btnText: "Open MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), faqSchema([{ q: "Is loneliness a sign of weak iman?", a: "No." }]), breadcrumbSchema(bcs)] }), body));
});

// ─── 2. Islamic Healing from Heartbreak ──────────────────────────────────────
router.get("/islamic-healing-from-heartbreak", (_req, res) => {
  const slug = "/islamic-healing-from-heartbreak"; const title = "Islamic Healing from Heartbreak — Quran, Dua & Spiritual Recovery"; const desc = "The Islamic path through heartbreak, loss, and romantic grief. Authentic duas, Quran verses, and a practical healing framework rooted in Sunnah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Islamic Healing from Heartbreak" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How does Islam help with heartbreak?", "Islam acknowledges that heartbreak is real and painful — the loss of love, hope, or a future you imagined. Islam's healing framework: (1) Allow the grief — Islam does not forbid tears. (2) Turn to Allah — He is Al-Jabbar, the One who mends broken things. (3) Trust qadar — everything that happens, happens for a reason you may not see yet. (4) Make dua — talk to Allah about the exact pain you feel.")}
<p style="color:#a0c8a0;line-height:1.8">The word 'Al-Jabbar' (الجبار) is one of Allah's 99 Names. It means the One who mends what is broken, the One who restores and sets right. When your heart is broken, you are in the hands of the greatest Healer.</p>
<h2>Quranic Perspective on Grief and Loss</h2>
${quranBlock("عَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", "Asa an takrahu shay'an wa huwa khayrun lakum", "Perhaps you hate something and it is good for you — Quran 2:216")}
${quranBlock("إِنَّ مَعَ الْعُسْرِ يُسْرًا", "Inna ma'al-'usri yusra", "Indeed, with hardship comes ease — Quran 94:6")}
<h2>The 4-Stage Islamic Healing Process</h2>
<ol style="padding-left:20px;line-height:2;color:#a0c8a0">
  <li><strong style="color:#eaf4ee">Al-Alam (The Pain)</strong> — Allow yourself to feel it. Islam does not suppress grief. The Prophet ﷺ wept at loss.</li>
  <li><strong style="color:#eaf4ee">Al-Sabr (The Patience)</strong> — Not passive endurance, but active choice to trust Allah while you hurt.</li>
  <li><strong style="color:#eaf4ee">Al-Tawakkul (The Trust)</strong> — Surrendering the 'why' and 'what now' to Allah who knows what you do not.</li>
  <li><strong style="color:#eaf4ee">Al-Shukr (The Gratitude)</strong> — Finding, eventually, what this loss protected you from or led you toward.</li>
</ol>
${faqHtml([
  { q: "Is it haram to grieve a relationship in Islam?", a: "No. Grief is a human emotion that even prophets experienced. What Islam prohibits is despairing of Allah's mercy, or grieving in ways that harm yourself or others. Feeling pain from loss is natural and acknowledged in the Quran." },
  { q: "What dua helps heal a broken heart?", a: "Ya Jabbar (O Mender of broken things) repeated as dhikr. Also: 'Allahumma inni as'aluka an taj'al qalbi ma'aka' (O Allah, make my heart always be with You). And Ayatul Kursi for peace." },
])}
${relatedArticlesGrid(WELLNESS_RELATED, "Continue Your Healing")}
${emotionalCTA({ title: "Guided Healing Sessions in MyTazki", subtitle: "Our HEALING category has 10+ guided audio sessions for grief, heartbreak, and emotional recovery.", href: "/download", btnText: "Start Healing Journey →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 3. Dua for Grief ─────────────────────────────────────────────────────────
router.get("/dua-for-grief", (_req, res) => {
  const slug = "/dua-for-grief"; const title = "Dua for Grief — Islamic Comfort for the Bereaved Heart"; const desc = "Authentic duas for grief, loss, and bereavement from Quran and Sunnah. Arabic text, transliteration, and meaning. Islamic guidance on mourning.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Dua for Grief" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What duas should I read when grieving a loss?", "The primary dua for grief is: 'Inna lillahi wa inna ilayhi raji'un. Allahumma' jurni fi musibati wakhluf li khayran minha' (We belong to Allah and to Him we return. O Allah, reward me in my affliction and replace it with something better). The Prophet ﷺ said whoever says this, Allah will compensate them with something better.")}
${quranBlock("إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", "Inna lillahi wa inna ilayhi raji'un", "Indeed, to Allah we belong and to Allah we shall return — Quran 2:156")}
<p style="color:#a0c8a0;line-height:1.8">Grief is one of the most honoured emotions in Islam. The Prophet ﷺ wept at the death of his son Ibrahim. He wept at the loss of Khadijah RA. Tears of grief are mercy — the Prophet ﷺ said: 'The eye weeps and the heart grieves, and we only say what pleases our Lord.' (Bukhari)</p>
<h2>Islamic Stages of Grief</h2>
<p style="color:#a0c8a0;line-height:1.8">Islam doesn't give a rigid timeline for grief. What it gives is a framework: Inna lillahi (we belong to Allah) acknowledges loss. Wa inna ilayhi raji'un (we return to Him) restores perspective. Sabr (patience) is not absence of pain — it is choosing trust despite pain. Akhira (the next life) gives ultimate hope — this separation is temporary.</p>
${faqHtml([
  { q: "How long is it acceptable to grieve in Islam?", a: "There is no set limit for grief in Islam (except for widows, who observe a 4-month-10-day iddah of mourning). The Prophet ﷺ said: 'Verily with hardship comes ease' — he didn't say 'be fine by Day 40.' Grief heals at its own pace. What Islam prohibits is prolonged wailing, self-harm, or despair of Allah's mercy." },
  { q: "What does Islam say happens to those who die?", a: "Muslims believe in the akhira (hereafter) — that death is a transition, not an end. The deceased are in the barzakh (a state between death and resurrection). Making dua for them, giving sadaqa jariyah on their behalf, and completing their unfulfilled religious obligations are all forms of ongoing connection." },
])}
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Find Comfort in MyTazki's Healing Sessions", subtitle: "Guided audio sessions for grief, loss, and bereavement. Islamic perspective. Soft and compassionate.", href: "/download", btnText: "Start Healing →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 4. Quran Verses About Patience ──────────────────────────────────────────
router.get("/quran-verses-about-patience", (_req, res) => {
  const slug = "/quran-verses-about-patience"; const title = "Quran Verses About Patience (Sabr) — Allah's Promise to the Patient"; const desc = "The most powerful Quran verses about sabr (patience). Arabic text, transliteration, meaning, and how to apply each verse when life gets hard.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Quran on Patience" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What does the Quran say about patience?", "The Quran mentions sabr (patience) over 90 times — making it one of the most emphasized virtues in Islam. Key promises: 'Allah is with the patient' (2:153), 'Indeed, the patient will be given their reward without account' (39:10), 'Do not lose hope, nor be sad — you will be superior if you are truly believers' (3:139).")}
<h2>10 Most Powerful Quran Verses on Sabr</h2>
${quranBlock("يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", "Ya ayyuhal-ladhina amanu ista'inu bis-sabri was-salah. Innallaha ma'as-sabirin", "O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient — Quran 2:153")}
${quranBlock("إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", "Innama yuwaffas-sabirun ajrahum bi ghayri hisab", "Indeed, the patient will be given their reward without account — Quran 39:10")}
${quranBlock("وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ", "Wa la-nabluwan-nakum bi shay'im-minal-khawfi wal-ju'", "We will test you with fear, hunger, loss of wealth and lives — and give good tidings to the patient — Quran 2:155")}
${quranBlock("فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", "Fa inna ma'al-'usri yusra", "Indeed, with hardship comes ease — Quran 94:5")}
<p style="color:#a0c8a0;line-height:1.8">Scholars note that Allah said 'inna ma'al-'usri yusra' TWICE in Surah Al-Inshirah (94:5 and 94:6) — indicating that one hardship is accompanied by two reliefs. The Arabic uses 'al-'usr' (the hardship, specific) and 'yusra' (ease, without 'al-', meaning general/unlimited). One specific hardship. Unlimited ease.</p>
${faqHtml([
  { q: "What are the three types of sabr in Islam?", a: "Scholars describe sabr as: (1) Sabr 'ala ta'ah — patience in performing acts of obedience to Allah. (2) Sabr 'an ma'siyah — patience in refraining from sins. (3) Sabr 'ala al-musibah — patience with trials and calamities. All three are equally important." },
  { q: "What is the reward for sabr in Islam?", a: "Allah promises multiple rewards for patience: His company ('Allah is with the patient'), unlimited reward ('given without account'), Jannah ('Allah will reward the patient their reward' 39:10), Allah's love ('Allah loves the patient ones' 3:146), and relief after hardship ('with hardship comes ease' 94:5-6)." },
])}
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Practice Sabr Daily with MyTazki", subtitle: "Guided sessions on patience, tawakkul, and emotional healing. Islamic framework for hard times.", href: "/download", btnText: "Open MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 5. Emotional Healing in Islam ────────────────────────────────────────────
router.get("/emotional-healing-in-islam", (_req, res) => {
  const slug = "/emotional-healing-in-islam"; const title = "Emotional Healing in Islam — The Complete Islamic Framework"; const desc = "Islam's complete framework for emotional healing: Quran as shifa, prophetic duas, salah as therapy, dhikr for the heart, and the role of sabr and tawakkul.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Emotional Healing in Islam" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("How does Islam approach emotional healing?", "Islam provides a complete healing ecosystem: Quran as shifa (healing — 17:82), salah as therapy (prevents immorality and gives peace — 29:45), dhikr for the heart (remembrance brings tranquility — 13:28), dua as direct prayer for healing, sabr (patience) as the active response to pain, and community (ummah) as the support system. None of these work in isolation — the Islamic healing model integrates all of them.")}
<h2>The 6 Pillars of Islamic Emotional Healing</h2>
<div style="display:flex;flex-direction:column;gap:14px;margin:20px 0">
${[
  ["📖 Quran as Shifa", "Allah says: 'We send down of the Quran that which is healing and mercy for the believers' (17:82). The Quran is medicine for the soul — not metaphorically, but literally prescribed. Surah Al-Fatiha is used as ruqyah (healing prayer). Regular recitation rewires the heart."],
  ["🕌 Salah as Anchor", "Five times a day, you stand before Allah and lay your troubles before Him. Salah interrupts the anxiety cycle, restores perspective, and provides structure. The Prophet ﷺ would say 'Give us rest, O Bilal' (calling for iqamah) — salah was his rest from the world."],
  ["📿 Dhikr as Medication", "Dhikr (remembrance) is not just spiritual — it activates the body's parasympathetic system. 'SubhanAllah' said slowly, deliberately, 33 times after prayer has measurable calming effects. 'In the remembrance of Allah do hearts find rest' (13:28)."],
  ["🤲 Dua as Direct Line", "Unlike any other tradition, Islam gives you direct access to Allah in dua — no intermediary. You can call on Him in any language, any time, about anything. The Prophet ﷺ taught specific duas for grief, anxiety, loneliness, and fear."],
  ["⏳ Sabr as Active Choice", "Sabr is not passive resignation — it is the active choice to trust Allah's wisdom while you hurt. Allah promises: 'We will certainly test you... but give good tidings to the patient ones' (2:155). Sabr earns unlimited reward (39:10)."],
  ["🌍 Ummah as Community", "The Prophet ﷺ said: 'The believers in their mutual kindness and compassion are like one body — when one limb hurts, the whole body responds' (Bukhari). Isolation worsens pain; Islamic community heals it."],
].map(([title, desc]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:12px;padding:18px 16px">
  <strong style="color:#eaf4ee;font-size:15px;font-family:DM Sans,Inter,sans-serif;display:block;margin-bottom:8px">${title}</strong>
  <p style="color:#6a9878;font-size:14px;margin:0;line-height:1.65;font-family:Inter,sans-serif">${desc}</p>
</div>`).join("")}
</div>
${faqHtml([
  { q: "Can Islam heal trauma?", a: "Islam doesn't promise that all trauma resolves quickly, but it provides a framework: safe emotional expression (dua, journal), meaning-making (qadar, akhira perspective), community support, spiritual practices that regulate the nervous system, and hope (nothing is permanent except Allah's love). Many trauma specialists now integrate faith-based practices. Islam's approach complements professional therapy." },
  { q: "What is the Islamic definition of mental health?", a: "Islamic scholars describe mental health (sihat an-nafs) as: a heart free of major sins (safi), a soul at peace with Allah (mutma'inna), a balanced life (wasatiyyah), strong community connections (silat ur-rahm), and regular ibadah (worship). It is holistic — spiritual, emotional, physical, and social." },
])}
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Your Islamic Healing Companion", subtitle: "Healing sessions, guided duas, azkar, and AI Islamic guidance — all rooted in Quran and Sunnah.", href: "/download", btnText: "Start Healing Today →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 6. Islamic Cure for Burnout ──────────────────────────────────────────────
router.get("/islamic-cure-for-burnout", (_req, res) => {
  const slug = "/islamic-cure-for-burnout"; const title = "Islamic Cure for Burnout — When Exhaustion Meets Tawakkul"; const desc = "Feeling spiritually and emotionally burned out? Islam's answer to modern burnout — tawakkul, rest, dhikr, and the Prophetic model of sustainable living.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Islamic Cure for Burnout" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What does Islam say about burnout and exhaustion?", "Islam explicitly prohibits self-destruction: 'Do not throw yourselves into destruction' (2:195). The Prophet ﷺ modeled sustainable spiritual living — he rested, took breaks, slept, and told his companions: 'Your body has a right over you, your eyes have a right over you, and your wife has a right over you' (Bukhari). Burnout is often a sign of forgetting that you are a trustee of your body, not its owner.")}
<h2>The Prophetic Model of Sustainable Living</h2>
<p style="color:#a0c8a0;line-height:1.8">The Prophet ﷺ worked hard — but he also rested. He took Qaylula (midday naps). He recommended: 'If one of you feels sleepy while praying, let him go sleep until the sleep has gone.' He told Salman Al-Farsi RA: 'Your Lord has a right over you, your body has a right over you, your family has a right over you — give each its right.' Balance is Sunnah.</p>
${quranBlock("لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", "La yukallifu Allahu nafsan illa wus'aha", "Allah does not burden a soul beyond what it can bear — Quran 2:286")}
<h2>5 Islamic Antidotes to Burnout</h2>
<ol style="padding-left:20px;line-height:2;color:#a0c8a0">
  <li><strong style="color:#eaf4ee">Tawakkul (Radical Trust)</strong> — You are not responsible for outcomes, only effort. Allah carries the rest.</li>
  <li><strong style="color:#eaf4ee">Qaylula (Midday Rest)</strong> — The Prophetic siesta. Even 20 minutes restores cognitive function and spiritual energy.</li>
  <li><strong style="color:#eaf4ee">Jumu'ah (Weekly Reset)</strong> — Friday is designated as a collective pause. Use it to reset, not work through.</li>
  <li><strong style="color:#eaf4ee">Dhikr as Decompression</strong> — Rather than social media in moments of exhaustion, try 10 minutes of SubhanAllah. The neuroscience of repetitive, meaningful sound is well-documented.</li>
  <li><strong style="color:#eaf4ee">Delegation (Tafwid)</strong> — The Prophet ﷺ delegated. He had companions for different tasks. You cannot do everything. Ask for help — it is Sunnah.</li>
</ol>
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Rest and Restore with MyTazki", subtitle: "SLEEP and HEALING sessions, gentle azkar, and an AI companion for the exhausted soul.", href: "/download", btnText: "Find Rest in MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 7. Dua for Sadness ───────────────────────────────────────────────────────
router.get("/dua-for-sadness", (_req, res) => {
  const slug = "/dua-for-sadness"; const title = "Dua for Sadness — Islamic Supplication for the Heavy Heart"; const desc = "The most powerful duas for sadness from the Prophet ﷺ. Arabic text, transliteration, and meaning — for when your heart feels too heavy to carry alone.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Dua for Sadness" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What dua removes sadness in Islam?", "The Prophet's ﷺ comprehensive dua for sadness: 'Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayn wa ghalabatir-rijal' — O Allah, I seek refuge in You from worry, grief, inability, laziness, miserliness, cowardice, the burden of debt, and being overpowered by people. This dua covers six specific types of heaviness.")}
${quranBlock("اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", "Allahumma inni a'udhu bika minal-hammi wal-hazan", "O Allah, I seek refuge in You from worry and grief — Prophetic Dua (Bukhari)")}
${quranBlock("وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ", "Wa la tahinu wa la tahzanu wa antumul-a'lawn", "Do not lose hope, nor be sad — you will be superior if you are believers — Quran 3:139")}
<h2>How to Use Dua When Feeling Sad</h2>
<p style="color:#a0c8a0;line-height:1.8">Make wudu — the purification itself signals your intention to your mind and soul. Find a quiet space. Sit facing the qibla. Raise your hands. Say Bismillah. Then speak to Allah honestly — in Arabic, in your language, in tears — He understands all. The Prophet ﷺ said: 'Dua is the weapon of the believer.' Use it.</p>
${faqHtml([
  { q: "Is it normal to feel sad as a Muslim?", a: "Yes. The Prophet ﷺ experienced grief, the Sahaba felt fear and sadness, and Allah revealed Quran in response to prophetic sorrow (Surah Ad-Duha was revealed when the Prophet ﷺ felt abandoned). Sadness is human. What distinguishes the believer is where they take that sadness — to Allah." },
])}
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Find Peace — One Dua at a Time", subtitle: "110+ authentic duas in MyTazki, organized by emotion. With Arabic audio and reflection prompts.", href: "/download", btnText: "Open Duas Library →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 8. Quran for Hopelessness ────────────────────────────────────────────────
router.get("/quran-for-hopelessness", (_req, res) => {
  const slug = "/quran-for-hopelessness"; const title = "Quran for Hopelessness — Never Despair of Allah's Mercy"; const desc = "When you feel like giving up, the Quran speaks directly to your hopelessness. Powerful verses about Allah's mercy, promises, and the prohibition of despair.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Quran for Hopelessness" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What does the Quran say when you feel like giving up?", "Allah says in Surah Az-Zumar (39:53): 'Say: O My servants who have transgressed against themselves, do not despair of Allah's mercy. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.' This verse is considered by scholars to be the most hope-inspiring verse in the entire Quran. Allah prohibits despair (39:53, 12:87) — making hopelessness itself a kind of sin to guard against.")}
${quranBlock("قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَى أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", "Qul ya 'ibadiyalladhina asrafu 'ala anfusihim la taqnatu min rahmatillah", "Say: O My servants who have transgressed, do not despair of Allah's mercy — Quran 39:53")}
${quranBlock("وَلَا يَأْيَئَسُ مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَأْيَئَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ", "Wa la yay'asu min rawhill-lah. Innahu la yay'asu min rawhill-lahi illal-qawmul-kafirun", "None despair of relief from Allah except the disbelieving people — Quran 12:87")}
<p style="color:#a0c8a0;line-height:1.8;margin:20px 0">If you are feeling hopeless, know this: The very fact that you are reading these words, seeking comfort, means your heart is still oriented toward Allah. A truly dead heart doesn't search for life. Your search is itself a sign of faith.</p>
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Hope Is a Practice — MyTazki Can Help", subtitle: "Guided Quran reflections, healing sessions, and an AI companion who reminds you of Allah's promises.", href: "/download", btnText: "Find Hope in MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 9. Islamic Mental Health ─────────────────────────────────────────────────
router.get("/islamic-mental-health", (_req, res) => {
  const slug = "/islamic-mental-health"; const title = "Islamic Mental Health — Islam's Holistic Guide to Psychological Wellbeing"; const desc = "Islam's comprehensive approach to mental health: Quranic guidance, Prophetic practices, the role of iman in wellbeing, and Islamic perspectives on anxiety, depression, and grief.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Islamic Mental Health" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What does Islam say about mental health?", "Islam has always had a holistic understanding of human wellbeing — 1400 years before modern psychology. The Quran describes the nafs (soul/self) in multiple states: nafs al-ammarah (the commanding self that pulls toward ego), nafs al-lawwamah (the self-reproaching conscience), and nafs al-mutma'innah (the soul at peace — 89:27). Islamic mental health is the journey from the first to the third.")}
<h2>Key Islamic Mental Health Concepts</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:16px 0">
${[
  ["Nafs", "The soul/self — the seat of consciousness, emotion, and will in Islamic psychology"],
  ["Qalb", "The heart — the spiritual organ that receives iman or becomes diseased by sins"],
  ["Tawakkul", "Complete trust in Allah — the antidote to anxiety about the future"],
  ["Sabr", "Active patience — the response to pain that earns unlimited divine reward"],
  ["Tawbah", "Repentance — the cleansing act that removes the spiritual weight of guilt"],
  ["Shukr", "Gratitude — the habit that rewires perception and multiplies blessings"],
].map(([term, def]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:14px">
  <strong style="color:#34c97a;font-size:14px;font-family:DM Sans,sans-serif;display:block;margin-bottom:6px">${term}</strong>
  <p style="color:#6a9878;font-size:13px;margin:0;line-height:1.5;font-family:Inter,sans-serif">${def}</p>
</div>`).join("")}
</div>
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Your Islamic Mental Health App", subtitle: "MyTazki integrates salah, azkar, Quran, healing sessions, and AI guidance into one daily practice.", href: "/download", btnText: "Download MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 10. Dua for Healing ──────────────────────────────────────────────────────
router.get("/dua-for-healing", (_req, res) => {
  const slug = "/dua-for-healing"; const title = "Dua for Healing — Prophetic Supplication for Body and Soul"; const desc = "The most authentic duas for healing from sickness, pain, emotional wounds, and spiritual illness. Arabic text, transliteration, meaning, and when to recite.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Dua for Healing" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is the best dua for healing in Islam?", "The Prophet ﷺ taught multiple healing duas. The most comprehensive: 'Allahumma Rabban-nas, adhibil-ba'sa, ashfi anta ash-shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqaman' — O Allah, Lord of people, remove the hardship and heal, for You are the Healer. There is no healing except Your healing — a healing that leaves no illness. (Bukhari & Muslim)")}
${quranBlock("اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنتَ الشَّافِي", "Allahumma Rabban-nas, adhibil-ba'sa, ashfi anta ash-shafi", "O Allah, Lord of people, remove the hardship — You are the Healer — (Bukhari & Muslim)")}
${quranBlock("وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ", "Wa idha maridtu fa huwa yashfin", "And when I am ill, it is He who cures me — Quran 26:80 (Dua of Ibrahim ﷺ)")}
<h2>Ruqyah — Quranic Healing</h2>
<p style="color:#a0c8a0;line-height:1.8">Ruqyah is the Islamic practice of reciting specific Quranic verses and duas for healing and protection. The Prophet ﷺ performed ruqyah on himself and others. Key verses: Al-Fatiha (called 'Umm al-Kitab' and a complete healing), Ayatul Kursi (2:255), the Mu'awwidhat (Surahs 112, 113, 114).</p>
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Healing Sessions in MyTazki", subtitle: "10 guided HEALING audio sessions — from Surah Ad-Duha reflection to Dua for Overthinking.", href: "/download", btnText: "Start Healing Today →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 11. How to Stop Overthinking Islam ──────────────────────────────────────
router.get("/how-to-stop-overthinking-islam", (_req, res) => {
  const slug = "/how-to-stop-overthinking-islam"; const title = "How to Stop Overthinking — The Islamic Method"; const desc = "Overthinking is the mind running without Allah. The Islamic cure: tawakkul, dhikr, and practical steps to break the anxiety spiral using Quran and Sunnah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Stop Overthinking — Islamic Method" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What is the Islamic cure for overthinking?", "Overthinking is the mind trying to control what only Allah controls. The Islamic cure: (1) Tawakkul — consciously transfer your worry to Allah with the phrase 'Hasbunallahu wa ni'mal wakil'. (2) Dhikr — repetitive remembrance interrupts the anxiety loop. (3) Physical salah — the body bowing, prostrating, occupies the mind. (4) Istikharah — for decisions: make the prayer and then act, releasing attachment to outcome.")}
<h2>Why Overthinking Happens — Islamic Perspective</h2>
<p style="color:#a0c8a0;line-height:1.8">Overthinking is, at its root, a crisis of tawakkul. The mind spins because it believes it must solve what only Allah can resolve. Islamic tradition calls this 'waswas' (whispering) — the Shaytan's tool of distraction. The antidote is not silence but replacement: replace the negative loop with positive remembrance.</p>
<h2>The Dhikr Interrupt Technique</h2>
<p style="color:#a0c8a0;line-height:1.8">When you notice an overthinking loop: Stop. Say Audhu billahi minash-shaytanir-rajim. Then say SubhanAllah 10 times slowly. The physical act of speaking dhikr forces the brain to shift from default-mode rumination to focused repetition — a well-documented interruption of the anxiety cycle.</p>
${quranBlock("وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "Wa man yatawakkal 'ala Allahi fa huwa hasbuh", "And whoever relies upon Allah — He is sufficient for him — Quran 65:3")}
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Break the Overthinking Loop with MyTazki", subtitle: "Guided dhikr sessions, tasbih counter, and Dua for Overthinking — all in one app.", href: "/download", btnText: "Start Dhikr Practice →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 12. Quran Verses About Hope ──────────────────────────────────────────────
router.get("/quran-verses-about-hope", (_req, res) => {
  const slug = "/quran-verses-about-hope"; const title = "Quran Verses About Hope — Allah's Promises to the Hopeful"; const desc = "The most uplifting Quran verses about hope, mercy, and Allah's promises to those who believe. For dark times, doubt, and renewal of faith.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Quran Verses About Hope" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("What are the most hopeful verses in the Quran?", "The most hope-inspiring verses: (1) 'Do not despair of Allah's mercy — He forgives all sins' (39:53). (2) 'With hardship comes ease' (94:5-6 — said TWICE for emphasis). (3) 'Allah does not burden a soul beyond what it can bear' (2:286). (4) 'He is with you wherever you are' (57:4). (5) 'And your Lord has not abandoned you' (93:3 — to the Prophet in his darkest moment).")}
${quranBlock("وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَى", "Wa la-sawfa yu'tika rabbuka fatarda", "And your Lord is going to give you, and you will be satisfied — Quran 93:5")}
${quranBlock("فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۞ إِنَّ مَعَ الْعُسْرِ يُسْرًا", "Fa inna ma'al-'usri yusra. Inna ma'al-'usri yusra", "For indeed, with hardship will be ease. Indeed, with hardship will be ease — Quran 94:5-6")}
${quranBlock("لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", "La taqnatu min rahmatillah", "Do not despair of Allah's mercy — Quran 39:53")}
<p style="color:#a0c8a0;line-height:1.8">Notice that Allah said 'with hardship comes ease' twice in two consecutive verses (94:5-6). Arabic grammar scholars note that in Arabic, repeating a definite noun (al-'usr = the hardship) means it is the SAME hardship. But repeating an indefinite noun (yusra = ease) means DIFFERENT instances of ease. One hardship. Two separate eases. This is Allah's mathematics of mercy.</p>
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Carry Hope with You — Open MyTazki", subtitle: "Daily Quran reflections, hope-filled duas, and guided sessions for the heavy-hearted Muslim.", href: "/download", btnText: "Find Hope in MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

// ─── 13. Islamic Self-Care ────────────────────────────────────────────────────
router.get("/islamic-self-care", (_req, res) => {
  const slug = "/islamic-self-care"; const title = "Islamic Self-Care — The Sunnah of Taking Care of Yourself"; const desc = "Self-care is Sunnah. Islam's guide to taking care of your body, mind, and soul — sleep, nutrition, exercise, rest, and spiritual practices. All from Quran and Hadith.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Islamic Self-Care" }];
  const body = `${breadcrumb(bcs)}<h1>${esc(title)}</h1>
${quickAnswerBox("Is self-care allowed in Islam?", "Not only allowed — it is obligatory. The Prophet ﷺ said: 'Your body has a right over you, your eyes have a right over you, and your wife has a right over you' (Bukhari). Allah says: 'Do not throw yourselves into destruction' (2:195). Taking care of your health, sleep, mental wellbeing, and rest is fulfilling an Islamic obligation — your body is an amanah (trust) from Allah.")}
<h2>The Islamic Self-Care Framework</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:16px 0">
${[["🌙 Sleep", "The Prophet ﷺ slept after Isha and woke for tahajjud. Adequate sleep is fard al-kifayah for your cognitive function and iman."], ["🥗 Nutrition", "'Eat and drink, but be not excessive' (7:31). The Prophetic diet: honey, olive oil, dates, black seed. Food is medicine."], ["🚶 Movement", "Walking to the masjid. Walking for dhikr. The Prophet ﷺ walked everywhere. Movement is Sunnah."], ["🤲 Dua", "Speaking to Allah daily is the most powerful mental health practice available to a Muslim."], ["👥 Community", "Silat ur-rahm (family ties) and maintaining friendships is a religious obligation with direct health benefits."], ["🌿 Rest", "The Prophetic Qaylula (midday rest) is backed by modern sleep science. Rest is not laziness — it is Sunnah."]].map(([t, d]) => `<div style="background:#1c2d21;border:1px solid rgba(52,201,122,0.12);border-radius:10px;padding:14px"><strong style="color:#eaf4ee;font-size:14px;font-family:DM Sans,sans-serif;display:block;margin-bottom:6px">${t}</strong><p style="color:#6a9878;font-size:13px;margin:0;line-height:1.5;font-family:Inter,sans-serif">${d}</p></div>`).join("")}
</div>
${relatedArticlesGrid(WELLNESS_RELATED)}
${emotionalCTA({ title: "Build Your Islamic Self-Care Practice", subtitle: "Prayer tracker, morning azkar, healing sessions, and daily dhikr — your complete Islamic wellbeing app.", href: "/download", btnText: "Start Self-Care with MyTazki →" })}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [articleSchema(title, desc, slug), speakable(slug), breadcrumbSchema(bcs)] }), body));
});

export default router;
