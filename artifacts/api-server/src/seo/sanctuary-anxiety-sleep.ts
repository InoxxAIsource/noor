import { Router } from "express";
import { geoBlock } from "./geo-content.js";
import { seoHead, page, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc } from "./shared.js";
import { quickAnswerBox, relatedArticlesGrid, emotionalCTA } from "./seo-components.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function art(title: string, desc: string, slug: string): object {
  return { "@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "author": { "@type": "Organization", "name": "MyTazki" }, "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" }, "datePublished": "2026-01-01", "dateModified": TODAY, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` } };
}

function hero(gradient: string, mood: string, h1: string, sub: string, cta = "Find Peace Now →", ctaHref = "/download"): string {
  return `<section style="position:relative;min-height:500px;display:flex;align-items:center;justify-content:center;padding:90px 24px 72px;background:${gradient};overflow:hidden">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,rgba(201,164,114,0.07) 0%,transparent 55%),radial-gradient(ellipse at 75% 25%,rgba(52,201,122,0.05) 0%,transparent 50%)"></div>
    <div style="position:relative;max-width:660px;margin:0 auto;text-align:center">
      <p style="font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.18em;color:#c9a472;text-transform:uppercase;margin:0 0 20px;opacity:0.85">${mood}</p>
      <h1 style="font-family:'DM Sans',Inter,sans-serif;font-size:clamp(1.85rem,4.2vw,2.9rem);font-weight:800;line-height:1.12;color:#f0ece4;margin:0 0 20px;letter-spacing:-0.025em">${h1}</h1>
      <p style="font-family:Inter,sans-serif;font-size:1.05rem;color:rgba(240,236,228,0.52);margin:0 auto 36px;line-height:1.78;max-width:490px">${sub}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="${ctaHref}" style="background:#34c97a;color:#09070a;padding:14px 30px;border-radius:100px;font-weight:700;text-decoration:none;font-size:14px;font-family:Inter,sans-serif">${esc(cta)}</a>
        <a href="/duas" style="background:rgba(201,164,114,0.1);color:#c9a472;padding:14px 26px;border-radius:100px;font-weight:600;text-decoration:none;font-size:14px;font-family:Inter,sans-serif;border:1px solid rgba(201,164,114,0.22)">Browse Duas</a>
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

function sectionCard(title: string, body: string): string {
  return `<div style="background:rgba(22,16,10,0.6);border:1px solid rgba(201,164,114,0.1);border-radius:14px;padding:24px 22px;margin:20px 0">
    <h3 style="color:#f0ece4;font-family:'DM Sans',Inter,sans-serif;font-size:1.05rem;font-weight:700;margin:0 0 12px">${esc(title)}</h3>
    <p style="color:#6e5e4c;font-size:14px;line-height:1.78;margin:0;font-family:Inter,sans-serif">${body}</p>
  </div>`;
}

const RELATED_ANXIETY = [
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Dua" },
  { href: "/how-to-stop-overthinking-islam", label: "Stop Overthinking in Islam", tag: "Guide" },
  { href: "/islamic-mental-health", label: "Islamic Mental Health", tag: "Wellness" },
  { href: "/quran-for-depression", label: "Quran for Depression", tag: "Quran" },
  { href: "/emotional-healing-in-islam", label: "Emotional Healing in Islam", tag: "Guide" },
  { href: "/7-day-inner-peace-journey", label: "7-Day Inner Peace Journey", tag: "Journey" },
];

const RELATED_SLEEP = [
  { href: "/dua-for-anxiety", label: "Dua for Anxiety", tag: "Dua" },
  { href: "/night-prayer-benefits", label: "Night Prayer Benefits", tag: "Guide" },
  { href: "/islamic-sleep-routine", label: "Islamic Sleep Routine", tag: "Routine" },
  { href: "/quran-for-depression", label: "Quran for Depression", tag: "Quran" },
  { href: "/7-day-inner-peace-journey", label: "7-Day Inner Peace Journey", tag: "Journey" },
  { href: "/evening-azkar-routine", label: "Evening Azkar Routine", tag: "Dhikr" },
];

// ─── ANXIETY CLUSTER ──────────────────────────────────────────────────────────

// 1. /ruqyah-for-anxiety
router.get("/ruqyah-for-anxiety", (_req, res) => {
  const slug = "/ruqyah-for-anxiety";
  const title = "Ruqyah for Anxiety — Quran Healing for Worry and Fear";
  const desc = "How to perform ruqyah for anxiety using authentic Quran verses and duas from the Sunnah. A step-by-step spiritual healing practice for Muslims experiencing worry, fear, and distress.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Ruqyah for Anxiety" }];
  const faqs = [
    { q: "What is ruqyah for anxiety?", a: "Ruqyah is the Islamic practice of reciting specific Quran verses and duas for healing. For anxiety, it involves reciting Ayatul Kursi, Surah Al-Fatiha, Surah Al-Ikhlas, Al-Falaq, and An-Nas with sincerity and full focus, placing your hand on your chest and seeking Allah's protection from whispers and fear." },
    { q: "Is ruqyah for anxiety permissible?", a: "Yes. Ruqyah ash-shar'iyyah (Quran-based ruqyah) is fully permissible and encouraged. The Prophet ﷺ performed ruqyah on himself and others. It uses only Quran and authentic duas — no unknown words, no rituals outside of Sunnah." },
    { q: "How often should I do ruqyah for anxiety?", a: "Daily is recommended, especially morning and evening. Recite Ayatul Kursi, the three Quls (Al-Ikhlas, Al-Falaq, An-Nas), and the dua of Yunus three times each morning and evening. You may also do it whenever anxiety strikes." },
    { q: "Can ruqyah cure anxiety completely?", a: "Ruqyah addresses the spiritual dimension of anxiety — waswasa (whispers) and spiritual unease. For clinical anxiety disorder, combine ruqyah with professional mental health support. Islam encourages both spiritual and practical means (tawakkul + asbab)." },
  ];
  const body = `
${hero("linear-gradient(155deg,#0a0807 0%,#09070a 45%,#090808 100%)", "Spiritual Healing · Protection", "Ruqyah for Anxiety", "The Quran is healing. When anxiety wraps around your chest and fear silences your thoughts, these verses cut through the darkness.", "Begin Ruqyah Practice →", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What ruqyah should I read for anxiety?", "Recite Ayatul Kursi (2:255), then the three Quls (Al-Ikhlas, Al-Falaq, An-Nas) three times each, blowing on your palms and wiping over your body. Follow with: 'A'udhu bikalimatillahit-tammati min sharri ma khalaq' three times. Do this every morning and evening for consistent spiritual protection from anxiety and waswasa.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">Allah describes the Quran as healing: <em style="color:#c9a472">"And We send down of the Quran that which is healing and mercy for the believers"</em> (17:82). Ruqyah is not a ritual of desperation — it is a daily conversation with the One who created your nervous system and knows exactly why it trembles.</p>

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">The Ruqyah Protocol for Anxiety</h2>
${duaCard("أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ شَرِّ مَا خَلَقَ", "A'udhu bikalimatillahit-tammati min sharri ma khalaq", "I seek refuge in the perfect words of Allah from the evil of what He has created.", "Sahih Muslim — recite 3× for protection from all harm including anxiety")}
${duaCard("بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ", "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'", "In the name of Allah with whose name nothing is harmed on earth or in the heavens.", "Abu Dawud — recite 3× morning and evening to seal yourself from harm")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">Quran Verses for the Ruqyah Session</h2>
${quranRef("اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.", "Ayatul Kursi — Quran 2:255 — the greatest verse in the Quran, known to repel fear")}
${quranRef("وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ", "And if Allah should touch you with adversity, there is no remover of it except Him.", "Quran 6:17 — the foundation of tawakkul during anxiety")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">How to Perform Ruqyah for Anxiety Step by Step</h2>
${sectionCard("Step 1 — Make wudu and find quiet", "Purity heightens spiritual awareness. Sit or lie comfortably in a quiet space, facing qibla if possible. Intention (niyyah): you are seeking healing from Allah alone.")}
${sectionCard("Step 2 — Recite Ayatul Kursi slowly", "Read verse 2:255 with full presence. Feel each Name of Allah — Al-Hayy (the Ever-Living), Al-Qayyum (the Self-Sustaining). Anxiety is the fear that things are out of control. This verse reminds you Who controls everything.")}
${sectionCard("Step 3 — Recite the three Quls × 3", "Al-Ikhlas, Al-Falaq, An-Nas. Blow gently on your palms after each set and wipe over your face, chest, and arms. This is the exact method the Prophet ﷺ used before sleeping.")}
${sectionCard("Step 4 — Make personal dua", "After the formal ruqyah, speak to Allah in your own words about your exact anxiety. What are you afraid of? Tell Him. He is Al-Sami' (the Hearer).")}

${geoBlock('anxiety')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_ANXIETY, "More Islamic Wellness Guides")}
${emotionalCTA({ title: "Guided Ruqyah Sessions in MyTazki", subtitle: "Audio-guided spiritual healing sessions, duas library, and AI Islamic companion — free.", href: "/download", btnText: "Open MyTazki →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 2. /islamic-anxiety-help
router.get("/islamic-anxiety-help", (_req, res) => {
  const slug = "/islamic-anxiety-help";
  const title = "Islamic Anxiety Help — What Islam Says About Anxiety and Fear";
  const desc = "Comprehensive Islamic guidance for anxiety. Duas, Quran verses, Prophet's wisdom, and a spiritual framework for Muslims struggling with anxiety, worry, and chronic stress.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Islamic Anxiety Help" }];
  const faqs = [
    { q: "What does Islam say about anxiety?", a: "Islam acknowledges anxiety as a real human experience — even the Prophet ﷺ experienced distress and the Quran was revealed in part to comfort him (Surah Ad-Duha, 93:3). Islam provides spiritual tools: dua, dhikr, tawakkul, and community. But it also encourages practical means — consulting physicians is sunnah." },
    { q: "Is having anxiety a sin in Islam?", a: "No. Anxiety is not a sin. It is a human experience that even prophets and companions experienced. What Islam guides is not the removal of difficult feelings but turning to Allah within them, and seeking help when needed." },
    { q: "What is the best dua for anxiety in Islam?", a: "The dua of Prophet Yunus ﷺ: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin' — this was spoken from the depths of a whale in complete darkness and was answered. The Prophet ﷺ said whoever reads it in distress, Allah will relieve them." },
    { q: "Does dhikr help with anxiety?", a: "Yes — and neuroscience supports this. Repetitive, rhythmic phrases lower cortisol and activate the parasympathetic nervous system. Allah says: 'Verily in the remembrance of Allah do hearts find rest' (13:28). This is not metaphor. This is a prescription." },
  ];
  const body = `
${hero("linear-gradient(155deg,#0d0a08 0%,#09070a 40%,#08090a 100%)", "Mental Peace · Islamic Guidance", "Islamic Help for Anxiety", "Islam does not promise a life without worry. It promises that you are never alone inside it.", "Get Islamic Support →", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What Islamic help exists for anxiety?", "Islam offers a complete framework: (1) Dua — direct conversation with Allah about your fear. (2) Dhikr — remembrance that physiologically calms the nervous system. (3) Tawakkul — placing trust in Allah while still taking action. (4) Community — the ummah as a support structure. (5) Seeking help — consulting doctors and therapists is sunnah, not weakness.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Quran was revealed to a community under tremendous pressure — persecution, loss, uncertainty. Allah did not say "stop being afraid." He said: <em style="color:#c9a472">"Do not be sad, Allah is with us"</em> (9:40). The help that Islam offers for anxiety is not denial of the pain, but the presence of the One who holds all pain in His hands.</p>

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">The Islamic Dua for Anxiety</h2>
${duaCard("اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", "Allahumma inni a'udhu bika minal-hammi wal-hazani", "O Allah, I seek refuge in You from anxiety and grief.", "Sahih al-Bukhari — the Prophet ﷺ taught this dua for worry and sadness")}
${duaCard("لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ", "La ilaha illa anta subhanaka inni kuntu minadh-dhalimin", "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.", "Quran 21:87 — the dua of Prophet Yunus ﷺ, answered from the darkest place")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">Five Islamic Principles for Managing Anxiety</h2>
${sectionCard("1. Tawakkul — Active trust in Allah", "Tawakkul is not passivity. It is doing everything within your ability and then releasing the outcome to Allah. Anxiety often comes from trying to control what we cannot. Tawakkul redraws the boundary between your responsibility and Allah's.")}
${sectionCard("2. Salah — The built-in anxiety reset", "Five times a day, you stop. You ground. You bow. Salah is the most researched spiritual practice for anxiety in Islamic scholarship — every unit contains physical movement (reduces cortisol), focused breath, and conversation with Allah.")}
${sectionCard("3. Dhikr — The nervous system's friend", "Allah says hearts find rest in His remembrance (13:28). Subhanallah, Alhamdulillah, Allahu Akbar — each is a grounding mechanism that interrupts the anxiety thought loop and returns you to presence.")}
${sectionCard("4. Seeking help — The Prophet's prescription", "The Prophet ﷺ said: 'Make use of medical treatment, for Allah has not made a disease without appointing a remedy.' Seeing a therapist, taking prescribed medication, or calling a friend is sunnah action — not weakness.")}
${sectionCard("5. Quran recitation — Healing at the cellular level", "Reciting and listening to Quran measurably reduces anxiety markers. Start with Surah Ad-Duha (93) — it was revealed specifically when the Prophet felt abandoned and afraid. Then Surah Al-Inshirah (94). Then Ayatul Kursi.")}

${quranRef("أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", "Verily, in the remembrance of Allah do hearts find rest.", "Quran 13:28 — this is the primary Islamic prescription for anxiety")}

${geoBlock('anxiety')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_ANXIETY, "Continue Your Healing")}
${emotionalCTA({ title: "Islamic Anxiety Support, Daily", subtitle: "Guided duas, AI companion, and spiritual growth tools — available free in MyTazki.", href: "/download", btnText: "Try MyTazki Free →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 3. /panic-attack-dua
router.get("/panic-attack-dua", (_req, res) => {
  const slug = "/panic-attack-dua";
  const title = "Dua for Panic Attack — Islamic Relief When Fear Overwhelms You";
  const desc = "Specific duas and Islamic practices for panic attacks. What to recite when you feel overwhelmed, heart racing, and unable to breathe. Rooted in authentic Sunnah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Dua for Panic Attack" }];
  const faqs = [
    { q: "What dua should I read during a panic attack?", a: "Start with: 'Hasbunallahu wa ni'mal wakil' (3:173) repeated slowly. This was what the companions of the Prophet ﷺ said when facing overwhelming fear, and Allah responded with sakina (tranquility). Also: 'La hawla wa la quwwata illa billah' — this breaks the feeling of helplessness." },
    { q: "Can dua stop a panic attack?", a: "Dua combined with breath regulation can significantly reduce a panic attack's intensity. Recite slowly while breathing: inhale 4 counts, hold 4, exhale 6. The slow exhale activates the vagus nerve. The dua anchors your mind to something greater than the fear." },
    { q: "What surah is best for panic attacks?", a: "Surah Ad-Duha (93), Al-Inshirah (94), and Al-Baqarah 2:286 ('Allah does not burden a soul beyond that it can bear'). Keep these short verses memorised — panic attacks don't give you time to look something up." },
  ];
  const body = `
${hero("linear-gradient(155deg,#0c0809 0%,#09070a 50%,#08080b 100%)", "Panic Relief · Emergency Dua", "When Fear Takes Over — A Dua for Panic", "Your heart is racing. Your chest is tight. This is not the end. Recite. Breathe. He is closer than your next breath.", "Emergency Duas →", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What to do during a panic attack as a Muslim?", "1. Say: 'Hasbunallahu wa ni'mal wakil' slowly × 7. 2. Breathe: inhale 4, hold 2, exhale 6 — slow exhale activates calm. 3. Place your hand on your heart and say: 'La hawla wa la quwwata illa billah'. 4. Ground yourself: name 5 things you can see. 5. Recite Ayatul Kursi slowly. The panic will pass — it always does.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">A panic attack feels like the world is ending. Your body is sending emergency signals your mind cannot override. But there is something your mind can hold onto — a Name, a phrase, a certainty that cuts through the noise. These are not magical words. They are anchors to reality: to the One who holds the universe together while your nervous system fires in all directions.</p>

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">The Panic Attack Dua Protocol</h2>
${duaCard("حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", "Hasbunallahu wa ni'mal wakil", "Allah is sufficient for us, and He is the best disposer of affairs.", "Quran 3:173 — the companions recited this when facing an army. It brings sakina (divine tranquility).")}
${duaCard("لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", "La hawla wa la quwwata illa billah", "There is no might nor power except with Allah.", "Sahih Bukhari — called the 'treasure from the treasures of Jannah'. Breaks the feeling of powerlessness.")}
${quranRef("لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", "Allah does not burden a soul beyond that it can bear.", "Quran 2:286 — read this when panic convinces you that you cannot survive this moment. You can.")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">During the Panic: A Step-by-Step Guide</h2>
${sectionCard("Immediately: Recite and breathe together", "Recite 'Hasbunallahu wa ni'mal wakil' on the exhale. Slow the exhale to 6 counts. This is not coincidence — slow exhalation activates the parasympathetic nervous system. The dua gives your mind something to hold while your body resets.")}
${sectionCard("After 2 minutes: Ground with the senses", "Name aloud: 5 things you see, 4 you can touch, 3 you hear. This uses the prefrontal cortex (thinking brain) to override the amygdala (panic brain). The recitation continues between each.")}
${sectionCard("When calmer: Recite Ayatul Kursi", "Verse 2:255 in full. The rhythm and meaning — Al-Hayy (the Ever-Living), Al-Qayyum (the Sustainer) — rebuilds the truth that the universe has not collapsed, you are still held.")}

${geoBlock('anxiety')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_ANXIETY, "Related Islamic Mental Peace Guides")}
${emotionalCTA({ title: "Islamic Support When You Need It Most", subtitle: "Guided duas, breathing sessions, and AI Islamic companion available any time.", href: "/download", btnText: "Open MyTazki →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 4. /quran-verses-for-anxiety
router.get("/quran-verses-for-anxiety", (_req, res) => {
  const slug = "/quran-verses-for-anxiety";
  const title = "Quran Verses for Anxiety — Ayat That Calm the Heart";
  const desc = "The most powerful Quran verses for anxiety and stress. Arabic, transliteration, translation, and reflection for each ayat. Collected from across the Quran for those struggling with worry and fear.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Quran Verses for Anxiety" }];
  const faqs = [
    { q: "Which Quran verse is best for anxiety?", a: "Quran 13:28 — 'Verily, in the remembrance of Allah do hearts find rest.' This verse is the Quran's direct prescription for anxiety. For recitation during anxiety, Ayatul Kursi (2:255) and Surah Ad-Duha (93) are most recommended by scholars." },
    { q: "What surah should I read for anxiety?", a: "Surah Ad-Duha (93), Surah Al-Inshirah (94), and Surah Al-Baqarah (especially 2:155-157 on sabr, and 2:286 on Allah not overburdening). For sleep anxiety: Surah Al-Mulk (67) each night." },
    { q: "Can listening to Quran help anxiety?", a: "Yes. Studies from Egypt (Cairo University) and Saudi Arabia have documented measurable reductions in cortisol levels among patients who listened to Quran recitation, especially Surah Al-Baqarah and Ayatul Kursi." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0a090c 0%,#09070a 45%,#080a09 100%)", "Quran · Healing Verses", "Quran Verses That Quiet the Anxious Heart", "These are not motivational quotes. These are words from the Creator of the human nervous system, speaking directly to its most vulnerable state.", "Read the Quran →", "/quran")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("Which Quran verse is best for anxiety?", "13:28 — 'Verily, in the remembrance of Allah do hearts find rest' — is the Quran's direct statement on anxiety. For active recitation during distress: Ayatul Kursi (2:255). For when you feel abandoned: Surah Ad-Duha (93:3) — 'Your Lord has not forsaken you.' For when overwhelmed: 2:286 — 'Allah does not burden a soul beyond that it can bear.'")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">The Core Verse: Quran 13:28</h2>
${quranRef("أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", "Verily, in the remembrance of Allah do hearts find rest.", "Quran 13:28 — this is the primary Quranic prescription for anxiety. Not a metaphor — a statement of reality.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:16px 0">The Arabic word <em style="color:#c9a472">tatma'innu</em> (find rest) is used specifically for a kind of deep, settled peace — not just temporary relief. The heart that remembers Allah moves from turbulence to stillness. This is the Quran's thesis on anxiety.</p>

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">When You Feel Abandoned — Surah Ad-Duha</h2>
${quranRef("مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", "Your Lord has not forsaken you, nor has He detested [you].", "Quran 93:3 — revealed when the Prophet ﷺ felt Allah had abandoned him. For when anxiety whispers that you are alone.")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">When You Feel Overwhelmed — Quran 2:286</h2>
${quranRef("لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", "Allah does not burden a soul beyond that it can bear.", "Quran 2:286 — anxiety often convinces you the weight is too much. This verse corrects that lie.")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">When You Need Protection — Ayatul Kursi</h2>
${quranRef("اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", "Allah — there is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness overtakes Him nor sleep.", "Quran 2:255 — the greatest verse in the Quran. Recite for protection, grounding, and presence.")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">When Facing an Uncertain Future — Quran 65:3</h2>
${quranRef("وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "And whoever relies upon Allah — then He is sufficient for him.", "Quran 65:3 — for anxiety about the future, this verse resets the calculation: if Allah is your provider, what exactly are you afraid of?")}

${geoBlock('anxiety')}
${faqHtml(faqs)}
${relatedArticlesGrid([...RELATED_ANXIETY, { href: "/quran", label: "Read the Quran", tag: "Quran" }], "Explore More")}
${emotionalCTA({ title: "Read Quran Daily with MyTazki", subtitle: "Audio Quran, verse reflections, and guided sessions — free.", href: "/quran", btnText: "Open Quran →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 5. /how-to-calm-anxiety-islam
router.get("/how-to-calm-anxiety-islam", (_req, res) => {
  const slug = "/how-to-calm-anxiety-islam";
  const title = "How to Calm Anxiety in Islam — 7 Islamic Methods That Work";
  const desc = "Seven practical Islamic methods to calm anxiety rooted in Quran, Sunnah, and Islamic wisdom. Step-by-step guidance for Muslims experiencing worry, fear, and overthinking.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "How to Calm Anxiety in Islam" }];
  const faqs = [
    { q: "How do Muslims deal with anxiety?", a: "Through a combination of: (1) Salah — structured interruption of the anxiety cycle 5× daily. (2) Dua — direct conversation with Allah about the specific fear. (3) Dhikr — repetitive remembrance that physiologically calms. (4) Tawakkul — releasing outcomes to Allah. (5) Community (seeking support). (6) Professional help when needed." },
    { q: "Does Islam have a cure for anxiety?", a: "Islam provides both spiritual and practical tools. Spiritually: dhikr, dua, salah, tawakkul, and Quran recitation. Practically: the Prophet ﷺ said to seek medical treatment. For diagnosed anxiety disorders, Islam encourages professional mental health care alongside spiritual practice." },
  ];
  const body = `
${hero("linear-gradient(155deg,#0b090a 0%,#09070a 45%,#080908 100%)", "Islamic Method · Calm & Peace", "7 Islamic Ways to Calm Anxiety", "Not one method, not a single verse, but a complete system built for human fragility.", "Start the Journey →", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How do I calm anxiety using Islamic methods?", "The most effective combination: (1) Wudu — the physical act of washing resets the nervous system. (2) Recite 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin' × 40. (3) Pray two rakaat with full presence. (4) Recite Surah Ad-Duha. (5) Write down your fear and make dua about it specifically. Studies show this sequence reduces acute anxiety significantly.")}
${sectionCard("Method 1 — Wudu as a Reset Ritual", "Wudu is not just ritual purity. The act of washing the face, hands, and feet systematically activates the parasympathetic nervous system. Cold water on the face triggers the dive reflex, immediately slowing heart rate. The Prophet ﷺ made wudu when angry — the same mechanism applies to anxiety.")}
${sectionCard("Method 2 — The Dua of Yunus ﷺ × 40", "Repeat: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin' forty times. This is not folk practice — the repetition creates a meditative state while the meaning restructures the thought pattern from 'I am overwhelmed' to 'I acknowledge my limitation before the One who has no limitation.'")}
${sectionCard("Method 3 — Two Rakaat with Full Khushu", "The physical posture of salah — standing upright, bowing, prostrating — progressively moves blood from the extremities (fight-flight mode) back to the core. Sajda specifically, with forehead to the ground, is measurably associated with reduced anxiety markers.")}
${duaCard("اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah", "O Allah, I ask You for wellbeing in this world and the next.", "Sunan Ibn Majah — ask for 'afiyah (wellness, protection, ease) — the most comprehensive dua for relief")}
${sectionCard("Method 4 — Tawakkul Journaling", "Write down: what you are afraid of, what you have control over, what you don't. For everything you don't control, write: 'This is in Allah's hands.' Then make dua about each item. This is the practical application of tawakkul — not passive resignation but active delegation to Allah.")}
${sectionCard("Method 5 — Evening Azkar Routine", "The morning and evening azkar (remembrances) are a daily anxiety management system. They include specific duas for protection, provision, and peace. Doing them consistently reduces background anxiety over 2-4 weeks. Find them in MyTazki's Duas section.")}
${sectionCard("Method 6 — Community and Honest Conversation", "The Prophet ﷺ had companions who supported him in distress. Islam's cure for isolation-fueled anxiety is community. Tell a trusted Muslim friend what you are struggling with. Concealed anxiety compounds. Shared anxiety reduces.")}
${sectionCard("Method 7 — Seek Professional Help", "Islam explicitly endorses seeking medical treatment. If anxiety is affecting your daily life, sleep, work, or relationships for more than two weeks, see a therapist or doctor. This is not weak iman. This is following the Prophet's guidance: make use of treatment.")}
${geoBlock('anxiety')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_ANXIETY)}
${emotionalCTA({ title: "Daily Islamic Anxiety Tools", subtitle: "Guided duas, breathing sessions, morning azkar, and AI companion.", href: "/download", btnText: "Try MyTazki Free →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 6. /negative-thoughts-in-islam
router.get("/negative-thoughts-in-islam", (_req, res) => {
  const slug = "/negative-thoughts-in-islam";
  const title = "Negative Thoughts in Islam — What Is Waswasa and How to Stop It";
  const desc = "The Islamic explanation for intrusive and negative thoughts (waswasa). What it is, why it happens, who causes it, and the exact duas and practices to overcome it from Quran and Sunnah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Negative Thoughts in Islam" }];
  const faqs = [
    { q: "What are negative thoughts called in Islam?", a: "Waswasa (وسواس) — whispers from Shaytan. The word appears in the Quran (114:4-5) as 'al-waswasil-khannas' — the retreating whisperer. Shaytan whispers doubt, self-hatred, hopelessness, and forbidden thoughts. The key: they are from outside you, not your true self." },
    { q: "Do intrusive thoughts break iman?", a: "No. The Prophet ﷺ said: 'A man came to the Prophet and complained about waswas. The Prophet said: That is clear faith.' Intrusive thoughts you hate are a sign that your faith is rejecting them. A person without iman would not feel the conflict." },
    { q: "How do I get rid of negative thoughts islamically?", a: "1. Recognise they are waswasa, not your true thoughts. 2. Say 'A'udhu billahi minash-shaytanir-rajim' and change what you're doing. 3. Do not engage, debate, or reason with them — this feeds waswasa. 4. Increase dhikr, especially Surah An-Nas. 5. If obsessive, seek professional help (OCD is a medical condition)." },
  ];
  const body = `
${hero("linear-gradient(155deg,#09080b 0%,#09070a 45%,#080a09 100%)", "Waswasa · Spiritual Protection", "Negative Thoughts in Islam — You Are Not Your Waswasa", "The thought arrived uninvited. You did not choose it. That is the first thing to understand.", "Find Protection →", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("Why do I get negative thoughts as a Muslim?", "Islam identifies two sources of negative thoughts: (1) Waswasa — whispers from Shaytan (114:4), which you did not generate and are not responsible for. (2) Nafs ammara (the commanding self, 12:53) — lower desires whispering. The key distinction: a thought you hate and resist is almost always waswasa. A thought you entertain and enjoy is nafs. You are only accountable for what you choose, not what arrives unbidden.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Prophet ﷺ said: <em style="color:#c9a472">"Allah has forgiven my ummah for what they think in their hearts, as long as they do not speak of it or act upon it."</em> (Bukhari & Muslim). You are not judged for the dark thought that passed through your mind like an unwanted guest. You are judged for whether you opened the door and invited it to stay.</p>

${quranRef("مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", "From the evil of the retreating whisperer — who whispers in the hearts of people.", "Quran 114:4-5 — Allah confirms waswasa is real and is the exact nature of Shaytan's attack")}

${duaCard("أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", "A'udhu billahi minash-shaytanir-rajim", "I seek refuge in Allah from the accursed Shaytan.", "The primary protection against waswasa — recite immediately when a negative thought arrives")}

${sectionCard("Why You Should Never Argue with Waswasa", "Engaging with a waswasa thought — trying to reason with it, disprove it, or understand it — strengthens it. This is true in Islamic scholarship and confirmed in cognitive behavioral therapy (OCD treatment). The cure is non-engagement: acknowledge it as waswasa, recite the isti'adha, and redirect your attention immediately.")}
${sectionCard("The Difference Between Waswasa and Sin", "A thought is not a sin until you (1) act on it, (2) say it approvingly, or (3) deliberately hold and cherish it. A horrifying thought that repulses you is, paradoxically, a sign of strong faith. The Prophet ﷺ explicitly said this is 'clear faith.'")}
${sectionCard("When Negative Thoughts Might Be OCD", "If negative thoughts are intrusive, repetitive, cause intense guilt, and are followed by compulsive behaviors (excessive wudu, repeated prayers, endless seeking of reassurance), this may be OCD — a medical condition, not spiritual failure. See a mental health professional. Islamic scholars endorse treatment.")}
${geoBlock('anxiety')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_ANXIETY)}
${emotionalCTA({ title: "Daily Spiritual Protection in MyTazki", subtitle: "Morning azkar, evening ruqyah, and AI Islamic companion to help with waswasa.", href: "/download", btnText: "Get Protected →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 7. /trust-allah-and-stop-overthinking
router.get("/trust-allah-and-stop-overthinking", (_req, res) => {
  const slug = "/trust-allah-and-stop-overthinking";
  const title = "Trust Allah and Stop Overthinking — Tawakkul as a Cure for Anxiety";
  const desc = "How tawakkul (trust in Allah) practically stops the overthinking cycle. Not passive resignation — an active Islamic method for releasing control and finding peace.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Trust Allah and Stop Overthinking" }];
  const faqs = [
    { q: "What does Islam say about overthinking?", a: "Islam does not have a single word for overthinking but addresses it through tawakkul (trust), qadar (predestination), and the prohibition of excessive worry. The Quran says: 'Whoever relies upon Allah — then He is sufficient for him' (65:3). Overthinking is often the failure to trust that Allah has the future in hand." },
    { q: "Is overthinking haram in Islam?", a: "Overthinking itself is not haram — it becomes spiritually harmful when it leads to paralysis, doubt in Allah's plan, or neglect of salah and daily obligations. The solution is not to force yourself to stop thinking, but to redirect the mind toward dhikr and tawakkul." },
    { q: "How do I apply tawakkul when I'm overthinking?", a: "1. Write down what you're overthinking. 2. For each item, identify: what is in your control? Do it. 3. For everything not in your control, write: 'I place this with Allah.' 4. Make dua about it once, specifically. 5. Recite: 'Hasbunallahu wa ni'mal wakil' three times. 6. Do not revisit it mentally — redirect to dhikr when it returns." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0a0909 0%,#09070a 45%,#08090b 100%)", "Tawakkul · Release", "Trust Allah and Stop Overthinking", "Overthinking is the mind trying to do Allah's job. Tawakkul is giving it back.", "Learn Tawakkul →", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How does tawakkul stop overthinking?", "Overthinking is the loop of 'what if' — scenarios you are trying to control with your mind. Tawakkul interrupts this by clarifying the boundary: you are responsible for action, Allah is responsible for outcome. Once this distinction is truly felt — not just known — the overthinking loop has no fuel. Tawakkul is not 'don't plan.' It is 'plan, act, then release.'")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Prophet ﷺ said: <em style="color:#c9a472">"Tie your camel, then put your trust in Allah."</em> Tawakkul is not passivity. It is the most sophisticated response to uncertainty: do what is within your ability, then consciously transfer the outcome to the One who actually controls it. Overthinking is the failure to complete this transfer.</p>

${quranRef("وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ", "And whoever relies upon Allah — then He is sufficient for him. Indeed, Allah will accomplish His purpose.", "Quran 65:3 — tawakkul is not hope. It is certainty that Allah will handle what you cannot.")}
${duaCard("اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا", "Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'alul-hazna idha shi'ta sahla", "O Allah, there is no ease except what You make easy, and You make the difficult easy when You will.", "Ibn Hibban — the overthinking mind needs to hear this: ease is not found through planning more, but through Allah's will")}
${sectionCard("The Tawakkul Practice for Overthinkers", "Every evening, write down what occupied your mind that day. For each item: (1) What action can you take? Take it or schedule it. (2) What is beyond your control? Write: 'Ya Allah, I release this to You.' Then do not pick it back up mentally. When the thought returns — because it will — redirect: 'Hasbunallahu wa ni'mal wakil.'")}
${sectionCard("Why the Mind Overthinks (The Islamic View)", "Islam identifies the source of overthinking as Shaytan's waswasa + an untrained nafs (self). Shaytan feeds on uncertainty and amplifies it. The nafs wants control. Tawakkul starves both: it removes uncertainty (outcome is with Allah) and surrenders control (action is yours, result is Allah's).")}
${geoBlock('anxiety')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_ANXIETY)}
${emotionalCTA({ title: "Build Tawakkul Daily with MyTazki", subtitle: "Guided sessions, morning intention setting, and AI Islamic companion.", href: "/download", btnText: "Start Today →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// ─── SLEEP CLUSTER ────────────────────────────────────────────────────────────

// 8. /islamic-sleep-meditation
router.get("/islamic-sleep-meditation", (_req, res) => {
  const slug = "/islamic-sleep-meditation";
  const title = "Islamic Sleep Meditation — Guided Night Routine for Deep Rest";
  const desc = "A guided Islamic sleep meditation combining the Prophet's bedtime sunnah, evening azkar, and breathing practice. For Muslims who struggle to sleep, quiet the mind, and find rest.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Sleep & Night", item: "/mental-wellness" }, { name: "Islamic Sleep Meditation" }];
  const faqs = [
    { q: "What is Islamic sleep meditation?", a: "Islamic sleep meditation combines the Prophet's ﷺ authentic bedtime practices with mindful presence: (1) Evening azkar — reciting Ayatul Kursi, Al-Ikhlas, Al-Falaq, An-Nas. (2) The sleep dua: 'Allahumma bismika amutu wa ahya.' (3) Lying on the right side, as the Prophet ﷺ did. (4) Slow breath synchronized with dhikr. This is not yoga or secular mindfulness — it is Sunnah." },
    { q: "Can Islamic meditation help insomnia?", a: "The evening azkar routine, practiced consistently, has been shown in Islamic psychology research to improve sleep onset and quality. The dhikr reduces mental chatter, the sleep dua signals the mind to transition, and the breathing practice activates the parasympathetic nervous system." },
    { q: "What surah should I read before sleeping?", a: "The Prophet ﷺ's specific practice: blow on both palms after reciting Al-Ikhlas, Al-Falaq, and An-Nas three times each, then wipe over the body. Also: Ayatul Kursi before sleeping. Surah Al-Mulk every night. Ayat 284-286 of Al-Baqarah (the last two verses)." },
  ];
  const body = `
${hero("linear-gradient(160deg,#07080e 0%,#09070a 50%,#090709 100%)", "Night Peace · Sleep Sunnah", "Islamic Sleep Meditation", "The Prophet ﷺ had a bedtime routine. It was not accident that he slept well.", "Sleep Better Tonight →", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How do I do Islamic sleep meditation?", "15 minutes before bed: (1) Make wudu. (2) Recite the three Quls × 3, blowing on palms, wiping over body. (3) Recite Ayatul Kursi once. (4) Lie on your right side. (5) Recite: 'Allahumma bismika amutu wa ahya.' (6) Breathe slowly: 4 in, 2 hold, 6 out. Repeat 'Subhanallah' on each exhale. (7) Let sleep come — do not fight it. This is the Prophet's ﷺ exact practice.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">Modern sleep science is rediscovering what the Prophet ﷺ practiced 1,400 years ago. Consistent pre-sleep ritual, right-side sleeping (reduces acid reflux, improves heart rhythm), slow exhalation breathing — all confirmed by research. The Islamic practice is not a coincidence. It is divine prescription for the human body.</p>

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">The 7-Step Islamic Sleep Meditation</h2>
${sectionCard("Step 1 — Wudu (15 min before sleep)", "The act of washing cools the skin and signals the body that the day is ending. Wudu before sleep is Sunnah. It also ensures spiritual cleanliness — the soul leaves the body during sleep and returns at waking.")}
${sectionCard("Step 2 — The Three Quls × 3", "Recite Al-Ikhlas, Al-Falaq, An-Nas. After each set, blow gently on your palms and wipe over your face, then your entire body. The Prophet ﷺ did this every night without exception. It creates a spiritual seal over you during sleep.")}
${duaCard("اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا", "Allahumma bismika amutu wa ahya", "O Allah, in Your name I die and I live.", "Sahih Bukhari — the exact sleep dua of the Prophet ﷺ. Say it as you close your eyes.")}
${sectionCard("Step 3 — The Breathing Practice", "Inhale: 4 slow counts. Hold: 2. Exhale: 6 counts, reciting 'Subhanallah' internally on the exhale. The extended exhale activates the vagus nerve. Repeat 7-10 times. This is not innovation — it is the body mechanics behind slow dhikr recitation that scholars have practiced for centuries.")}
${sectionCard("Step 4 — Gratitude Before Closing", "Recall three specific things from today that you are grateful to Allah for. Not generic — specific. This shifts the brain's last conscious state from problem-scanning to recognition of blessings, measurably improving sleep quality and morning mood.")}
${quranRef("هُوَ الَّذِي جَعَلَ لَكُمُ اللَّيْلَ لِتَسْكُنُوا فِيهِ", "It is He who made the night for you so that you may rest in it.", "Quran 10:67 — sleep is not a biological accident. It is a mercy designed by Allah for you specifically.")}
${geoBlock('sleep')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_SLEEP, "More Night Wellness Guides")}
${emotionalCTA({ title: "Guided Islamic Sleep Sessions", subtitle: "Evening azkar, breathing practices, and AI companion for a peaceful night.", href: "/download", btnText: "Sleep Better →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 9. /quran-for-sleep
router.get("/quran-for-sleep", (_req, res) => {
  const slug = "/quran-for-sleep";
  const title = "Quran for Sleep — Best Surahs and Ayat for a Peaceful Night";
  const desc = "Which Quran verses and surahs to recite before sleeping for peace, protection, and deep rest. Based on authentic hadith and the bedtime practice of the Prophet ﷺ.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Quran for Sleep" }];
  const faqs = [
    { q: "What Quran should I read before sleeping?", a: "Based on authentic hadith: (1) The three Quls (Al-Ikhlas 112, Al-Falaq 113, An-Nas 114) × 3, blowing on palms. (2) Ayatul Kursi (2:255) — provides protection through the night. (3) The last two verses of Al-Baqarah (2:285-286). (4) Surah Al-Mulk (67) — the Prophet ﷺ called it 'the protector from the punishment of the grave.'" },
    { q: "Does listening to Quran help you sleep?", a: "Yes. Research from multiple university hospitals confirms Quran recitation (especially slow, melodic tilawah) significantly reduces sleep latency and improves sleep quality. The rhythm and frequency of Quran recitation influence brain waves in a way similar to ASMR but with additional spiritual benefit." },
    { q: "What is the sleep surah in Islam?", a: "There is no single 'sleep surah' but Surah Al-Mulk (67) is most specifically associated with night and protection. The Prophet ﷺ never slept without reading it. Surah Al-Kafirun (109) is also recommended — the Prophet ﷺ called it 'a quarter of the Quran' and recited it before sleeping." },
  ];
  const body = `
${hero("linear-gradient(160deg,#08070d 0%,#09070a 50%,#07090a 100%)", "Sleep · Quran · Rest", "Quran for Sleep — Verses That Quiet the Night", "Before electricity, before medicine, there were these words. They worked then. They work now.", "Read the Quran →", "/quran")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What Quran verses help with sleep?", "The Prophet's ﷺ night routine included: Three Quls × 3 with blowing on palms, Ayatul Kursi (2:255) once, and Surah Al-Mulk (67) nightly. For racing mind at night: recite Surah Al-Inshirah (94) — 'With every difficulty comes ease' repeated slowly until the mind surrenders. For fear at night: Al-Baqarah 2:286 — 'Allah does not burden a soul beyond what it can bear.'")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">The Prophet's Authentic Sleep Quran Routine</h2>
${quranRef("قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "Say: I seek refuge in the Lord of daybreak.", "Surah Al-Falaq (113) — one of the three Quls the Prophet ﷺ recited × 3 every night")}
${quranRef("قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ", "Say: I seek refuge in the Lord of mankind, the Sovereign of mankind.", "Surah An-Nas (114) — paired with Al-Falaq for complete spiritual protection at night")}
${quranRef("اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", "Allah — there is no deity except Him, the Ever-Living, the Sustainer.", "Ayatul Kursi (2:255) — recite once before sleeping; the Prophet ﷺ said a guardian stays with you until morning")}

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">Surah Al-Mulk — The Nightly Protector</h2>
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:16px 0">The Prophet ﷺ said: <em style="color:#c9a472">"There is a Surah in the Quran of thirty verses which intercedes for its companion until he is forgiven. It is: Blessed is He in Whose hand is the dominion"</em> — Surah Al-Mulk. He never slept without reciting it. It takes approximately 4 minutes to recite slowly. Read or listen to it every night as a non-negotiable.</p>

<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">For Anxiety That Keeps You Awake</h2>
${quranRef("وَمِنْ آيَاتِهِ مَنَامُكُم بِاللَّيْلِ وَالنَّهَارِ", "And of His signs is your sleep by night and by day.", "Quran 30:23 — your ability to sleep is itself a sign of Allah. When sleep doesn't come, remember: even your wakefulness is under His authority.")}
${quranRef("أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", "Verily, in the remembrance of Allah do hearts find rest.", "Quran 13:28 — when the mind races at night, the cure is dhikr. Slowly recite 'Subhanallah' × 33, 'Alhamdulillah' × 33, 'Allahu Akbar' × 34.")}
${geoBlock('sleep')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_SLEEP)}
${emotionalCTA({ title: "Guided Night Quran in MyTazki", subtitle: "Audio Quran recitation, evening azkar, and sleep sessions — free.", href: "/quran", btnText: "Open Quran →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 10. /dua-before-sleep
router.get("/dua-before-sleep", (_req, res) => {
  const slug = "/dua-before-sleep";
  const title = "Dua Before Sleep — The Prophet's Complete Bedtime Supplications";
  const desc = "The complete collection of authentic duas before sleep from Sahih Bukhari, Muslim, Abu Dawud, and Tirmidhi. Arabic, transliteration, and meaning with guidance on practice.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Duas Library", item: "/duas" }, { name: "Dua Before Sleep" }];
  const faqs = [
    { q: "What is the dua before sleeping?", a: "The primary sleep dua from Sahih Bukhari: 'Allahumma bismika amutu wa ahya' (O Allah, in Your name I die and I live). Also from Sahih Bukhari: 'Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk' — O Allah, I submit myself to You, and I entrust my matter to You." },
    { q: "What dua did the Prophet say before sleeping?", a: "Multiple authentic duas: (1) 'Allahumma bismika amutu wa ahya.' (2) 'Subhanak Allahumma wa bihamdika, la ilaha illa ant, astaghfiruka wa atubu ilayk' (said before sleeping as expiation for the day). (3) Al-Ikhlas, Al-Falaq, An-Nas × 3, blowing on palms. (4) Ayatul Kursi. All are in Sahih sources." },
  ];
  const body = `
${hero("linear-gradient(155deg,#070810 0%,#09070a 50%,#090709 100%)", "Bedtime Sunnah · Night Duas", "Dua Before Sleep — The Prophet's Bedtime", "Every night, the Prophet ﷺ placed himself in Allah's hands before closing his eyes. This is how.", "Save These Duas →", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What dua should I read before sleeping?", "Say: 'Allahumma bismika amutu wa ahya' as you close your eyes. Before that: the three Quls (Al-Ikhlas, Al-Falaq, An-Nas) × 3 with blowing on palms and wiping over your body, then Ayatul Kursi once. Also recommended: 'Allahu Akbar' × 34, 'Alhamdulillah' × 33, 'Subhanallah' × 33 (the tasbeeh of Fatima RA — better than a servant for energy and rest).")}
${duaCard("اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا", "Allahumma bismika amutu wa ahya", "O Allah, in Your name I die and I live.", "Sahih Bukhari 6312 — the primary sleep dua. Sleep is a minor death; you place your soul with Allah and He returns it at fajr.")}
${duaCard("اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ وَفَوَّضْتُ أَمْرِي إِلَيْكَ", "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk", "O Allah, I submit myself to You, and I entrust my matter to You.", "Sahih Bukhari 247 — said when lying down. The complete surrender of the day's burdens.")}
${duaCard("سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ لَا إِلَٰهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ", "Subhanak Allahumma wa bihamdika, la ilaha illa anta, astaghfiruka wa atubu ilayk", "Glory be to You, O Allah, and I praise You. There is no god but You. I seek Your forgiveness and repent to You.", "Sahih al-Jami' — said before sleeping as expiation for sins of the day. Closes the day with tawbah.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Prophet ﷺ also recommended: the Tasbeeh of Fatima RA before sleeping — Subhanallah × 33, Alhamdulillah × 33, Allahu Akbar × 34. He taught this to his daughter when she asked for a servant to help with tiredness. He said: <em style="color:#c9a472">"This is better for you than a servant."</em></p>
${geoBlock('sleep')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_SLEEP)}
${emotionalCTA({ title: "All Sleep Duas in MyTazki", subtitle: "Complete duas library with audio, transliteration, and translation.", href: "/duas", btnText: "Open Duas →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 11. /ruqyah-for-sleep
router.get("/ruqyah-for-sleep", (_req, res) => {
  const slug = "/ruqyah-for-sleep";
  const title = "Ruqyah for Sleep — Quran Healing for Insomnia and Night Fear";
  const desc = "How to perform ruqyah for sleep problems, bad dreams, and night anxiety. Authentic Quran verses and duas for spiritual healing and protection through the night.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Sleep & Night", item: "/mental-wellness" }, { name: "Ruqyah for Sleep" }];
  const faqs = [
    { q: "What ruqyah is best for sleep?", a: "The Prophet's ﷺ own practice: (1) Recite Al-Ikhlas, Al-Falaq, An-Nas × 3, blowing on palms, wiping body. (2) Recite Ayatul Kursi. (3) Recite Al-Baqarah 2:285-286. This is the foundational ruqyah for sleep, tested and practiced for 1,400 years." },
    { q: "Can ruqyah cure insomnia?", a: "Ruqyah addresses spiritual causes of insomnia (waswasa, spiritual unease, fear). For physical insomnia (caused by screen exposure, caffeine, or medical conditions), address those alongside ruqyah. Islam uses both means: spiritual and practical." },
    { q: "What to do for bad dreams in Islam?", a: "Bad dreams (from Shaytan): (1) Spit lightly to your left three times. (2) Seek refuge: 'A'udhu billahi minash-shaytanir-rajim.' (3) Change your sleeping position. (4) Do not tell anyone. (5) Resume sleep. The Prophet ﷺ said these exact steps."  },
  ];
  const body = `
${hero("linear-gradient(160deg,#07080d 0%,#09070a 48%,#080a09 100%)", "Night Healing · Spiritual Protection", "Ruqyah for Sleep", "Some nights the darkness is not just the absence of light. Here is what the Prophet ﷺ prescribed for those nights.", "Start Night Routine →", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How do I do ruqyah for sleep?", "Before bed: (1) Wudu. (2) Recite Al-Ikhlas, Al-Falaq, An-Nas × 3, blow on palms, wipe over body. (3) Recite Ayatul Kursi. (4) Say: 'Allahumma bismika amutu wa ahya.' (5) Lie on right side. (6) If waking with fear: say 'A'udhu billahi minash-shaytanir-rajim' and recite Ayatul Kursi again. This is the complete authentic ruqyah-for-sleep protocol.")}
${duaCard("أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِن غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَن يَحْضُرُونِ", "A'udhu bikalimatillahit-tammati min ghadabihi wa 'iqabihi wa sharri 'ibadihi wa min hamazatish-shayatini wa an yahdhurun", "I seek refuge in the perfect words of Allah from His anger and punishment, from the evil of His servants, from the whispers of the devils and their presence.", "Abu Dawud 3893 — specifically for protection from evil during sleep")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Prophet ﷺ taught Abdullah ibn Mas'ud RA to recite Ayatul Kursi before sleeping and said: <em style="color:#c9a472">"A guardian from Allah will remain with you and Shaytan will not come near you until morning."</em> This is not poetry. This is the literal promise of the Prophet ﷺ.</p>
${quranRef("اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", "Allah — there is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness overtakes Him nor sleep.", "Ayatul Kursi (2:255) — 'Neither drowsiness overtakes Him nor sleep' means your sleep is under His watch. He never sleeps, so you can.")}
${geoBlock('sleep')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_SLEEP)}
${emotionalCTA({ title: "Guided Night Ruqyah in MyTazki", subtitle: "Audio-guided evening azkar and spiritual healing for peaceful sleep.", href: "/download", btnText: "Peaceful Sleep →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 12. /surah-for-sleep
router.get("/surah-for-sleep", (_req, res) => {
  const slug = "/surah-for-sleep";
  const title = "Surah for Sleep — Best Surahs to Read Before Bed in Islam";
  const desc = "The best surahs to recite before sleeping according to authentic hadith. Includes Surah Al-Mulk, Al-Kafirun, the three Quls, and their specific benefits for night protection and rest.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Quran", item: "/quran" }, { name: "Surah for Sleep" }];
  const faqs = [
    { q: "Which surah to read before sleeping?", a: "Based on authentic hadith: (1) Al-Mulk (67) — every night without exception; Prophet ﷺ never slept without it. (2) Al-Kafirun (109) — Prophet ﷺ called it 'a quarter of the Quran'; recite and sleep. (3) Al-Ikhlas, Al-Falaq, An-Nas — the three Quls × 3 with blowing on palms. (4) Ayatul Kursi (2:255). Each has specific hadith authentication." },
    { q: "Is Surah Mulk for sleeping?", a: "Surah Al-Mulk is specifically recommended for every night. The Prophet ﷺ said it 'intercedes for its companion until he is forgiven.' It is associated with protection in the grave and at night. It takes 4 minutes to recite slowly — one of the best investments before sleep." },
    { q: "Can I read Surah Yaseen before sleeping?", a: "There is a hadith about Surah Yaseen but it is considered weak by hadith scholars. The stronger, more authentic practice is Al-Mulk nightly, the three Quls × 3, and Ayatul Kursi. Follow the authentic Sunnah for sleep rather than weak narrations." },
  ];
  const body = `
${hero("linear-gradient(155deg,#07070e 0%,#09070a 48%,#08090a 100%)", "Quran Before Sleep · Sunnah", "Surah for Sleep — Nightly Quran Practice", "The Prophet ﷺ did not sleep without these words. Neither should you.", "Read Surahs →", "/quran")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What is the best surah for sleep?", "Surah Al-Mulk (67) nightly — strongest hadith. The three Quls (Al-Ikhlas 112, Al-Falaq 113, An-Nas 114) × 3 — Sahih Bukhari. Surah Al-Kafirun (109) — Sunan Abu Dawud. Ayatul Kursi (2:255) — Sahih Bukhari. In order of importance: Al-Mulk first (cannot be skipped), then the three Quls with the blowing practice, then Ayatul Kursi.")}
${sectionCard("Surah Al-Mulk (67) — Every Single Night", "The Prophet ﷺ: 'There is a surah in the Quran of thirty verses which intercedes for its companion until he is forgiven — it is Tabarak alladhi bi yadihil mulk.' He never slept without it. Listen to or recite it slowly — approximately 4 minutes. This is the most important sleep surah.")}
${sectionCard("Surah Al-Kafirun (109) — Before Closing Your Eyes", "The Prophet ﷺ said: 'Recite Surah Al-Kafirun then sleep at its end, for it is a disavowal of shirk.' It is the declaration that you enter sleep free from all false gods — a clean slate before your soul is held in Allah's hands.")}
${sectionCard("The Three Quls × 3 — The Sleep Shield", "Al-Ikhlas affirms tawhid (oneness). Al-Falaq seeks protection from external evil. An-Nas seeks protection from internal waswasa. Together × 3, blowing on palms and wiping the body, they are the spiritual armor the Prophet ﷺ wore every night. Aisha RA reported this practice in Sahih Bukhari.")}
${quranRef("قُلْ يَا أَيُّهَا الْكَافِرُونَ لَا أَعْبُدُ مَا تَعْبُدُونَ", "Say: O disbelievers, I do not worship what you worship.", "Surah Al-Kafirun 109:1-2 — begin this surah before sleeping as the Prophet ﷺ instructed")}
${geoBlock('sleep')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_SLEEP)}
${emotionalCTA({ title: "Complete Sleep Surah Library", subtitle: "Read or listen to all sleep surahs in MyTazki — audio, Arabic, and translation.", href: "/quran", btnText: "Open Quran →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 13. /night-dhikr
router.get("/night-dhikr", (_req, res) => {
  const slug = "/night-dhikr";
  const title = "Night Dhikr — Bedtime Remembrance for Peace and Protection";
  const desc = "The complete Islamic night dhikr routine from authentic hadith. Evening azkar before sleep, what to recite, how many times, and why night remembrance is a spiritual anchor.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Duas Library", item: "/duas" }, { name: "Night Dhikr" }];
  const faqs = [
    { q: "What is night dhikr in Islam?", a: "Night dhikr (evening azkar) is the collection of remembrances recommended by the Prophet ﷺ after Asr until sleeping. It includes: Ayatul Kursi, the three Quls, the Tasbeeh of Fatima (Subhanallah × 33, Alhamdulillah × 33, Allahu Akbar × 34), and specific duas for protection. Together they form a spiritual evening seal." },
    { q: "Is it sunnah to do dhikr before sleeping?", a: "Yes. Multiple authentic hadith establish specific dhikr for night and before sleeping. The Tasbeeh of Fatima RA is explicitly recommended before sleeping. Ayatul Kursi before sleeping is in Sahih Bukhari. The three Quls are in Sahih Bukhari and Muslim." },
    { q: "What dhikr is best at night?", a: "'La ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir' — recited 100× in the evening equals freeing 10 slaves, 100 hasanah, erasing 100 sayyi'ah, and protection from Shaytan for the rest of that day. (Bukhari 3293)" },
  ];
  const body = `
${hero("linear-gradient(160deg,#070810 0%,#09070a 50%,#08080a 100%)", "Evening Remembrance · Night Healing", "Night Dhikr — Closing the Day with Allah", "The night belongs to Allah. These words are how you hand it back to Him.", "Start Night Dhikr →", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What is the night dhikr routine?", "After Maghrib / before sleep: (1) Ayatul Kursi — once. (2) Three Quls × 3 with blowing on palms. (3) 'La ilaha illallah wahdahu la sharika lah...' × 100 (or × 10 minimum). (4) Subhanallah × 33, Alhamdulillah × 33, Allahu Akbar × 34 (Tasbeeh of Fatima). (5) Sleep dua: 'Allahumma bismika amutu wa ahya.' Total time: 10-15 minutes. Total benefit: immeasurable.")}
${duaCard("لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", "La ilaha illallah wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa huwa 'ala kulli shay'in qadir", "There is no deity except Allah, alone, without partner. To Him belongs the dominion and praise, and He is over all things capable.", "Bukhari 3293 — × 100 in evening: equivalent to freeing 10 slaves, 100 good deeds, protection from Shaytan")}
${sectionCard("The Tasbeeh of Fatima RA — Before Sleeping", "Subhanallah × 33. Alhamdulillah × 33. Allahu Akbar × 34. The Prophet ﷺ taught this to his daughter Fatima RA when she was exhausted and asked for household help. He said this was better for her than a servant. It is a night dhikr for tiredness, for heaviness, for the weight of the day.")}
${sectionCard("Why Night Dhikr Works", "Dhikr before sleep shifts the mind's final conscious state from problem-scanning to gratitude and surrender. Sleep research confirms that the emotional content of pre-sleep thoughts significantly influences sleep quality and morning mood. Night dhikr systematically replaces anxiety (the default pre-sleep state for most people) with remembrance.")}
${quranRef("وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً وَدُونَ الْجَهْرِ مِنَ الْقَوْلِ بِالْغُدُوِّ وَالْآصَالِ", "And remember your Lord within yourself in humility and in fear without loudness in words in the mornings and the evenings.", "Quran 7:205 — morning and evening dhikr is a Quranic command, not just sunnah")}
${geoBlock('sleep')}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_SLEEP)}
${emotionalCTA({ title: "Complete Night Dhikr in MyTazki", subtitle: "Evening azkar with audio, counter, and guided practice — free.", href: "/download", btnText: "Begin Tonight →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

export default router;
