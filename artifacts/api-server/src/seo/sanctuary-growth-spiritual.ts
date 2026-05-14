import { Router } from "express";
import { seoHead, page, faqHtml, faqSchema, breadcrumb, breadcrumbSchema, esc } from "./shared.js";
import { quickAnswerBox, relatedArticlesGrid, emotionalCTA } from "./seo-components.js";

const router = Router();
const TODAY = new Date().toISOString().split("T")[0]!;

function art(title: string, desc: string, slug: string): object {
  return { "@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "author": { "@type": "Organization", "name": "MyTazki" }, "publisher": { "@type": "Organization", "name": "MyTazki", "url": "https://mytazki.com" }, "datePublished": "2026-01-01", "dateModified": TODAY, "mainEntityOfPage": { "@type": "WebPage", "@id": `https://mytazki.com${slug}` } };
}

function hero(gradient: string, mood: string, h1: string, sub: string, cta = "Start Today →", ctaHref = "/download", cta2 = "Explore Sessions", cta2Href = "/sessions"): string {
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

function stepList(steps: Array<{ n: string; title: string; desc: string }>): string {
  return `<div style="margin:24px 0">${steps.map(s => `<div style="display:flex;gap:16px;margin-bottom:18px;align-items:flex-start">
    <div style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:rgba(52,201,122,0.1);border:1px solid rgba(52,201,122,0.25);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:#34c97a">${s.n}</div>
    <div><strong style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:15px;display:block;margin-bottom:4px">${esc(s.title)}</strong><span style="color:#6e5e4c;font-size:14px;line-height:1.75;font-family:Inter,sans-serif">${s.desc}</span></div>
  </div>`).join("")}</div>`;
}

const RELATED_GROWTH = [
  { href: "/morning-routine-muslim", label: "Muslim Morning Routine", tag: "Routine" },
  { href: "/daily-muslim-routine", label: "Daily Muslim Routine", tag: "Habits" },
  { href: "/dhikr-daily-habit", label: "Dhikr as a Daily Habit", tag: "Dhikr" },
  { href: "/islamic-self-improvement", label: "Islamic Self-Improvement", tag: "Growth" },
  { href: "/evening-azkar-routine", label: "Evening Azkar Routine", tag: "Dhikr" },
  { href: "/7-day-inner-peace-journey", label: "7-Day Inner Peace Journey", tag: "Journey" },
];

// ─── GROWTH CLUSTER ───────────────────────────────────────────────────────────

// 27. /islamic-morning-routine
router.get("/islamic-morning-routine", (_req, res) => {
  const slug = "/islamic-morning-routine";
  const title = "Islamic Morning Routine — The Prophet's Fajr to Sunrise Practice";
  const desc = "The complete Islamic morning routine based on the Prophet's ﷺ authentic practice. From Fajr to sunrise: what to recite, what to do, and how to start every day with barakah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Habits & Growth", item: "/islamic-habits" }, { name: "Islamic Morning Routine" }];
  const faqs = [
    { q: "What is the Islamic morning routine?", a: "Based on authentic Sunnah: (1) Wake before Fajr with intention. (2) Tahajjud if possible. (3) Wudu mindfully. (4) Fajr salah on time. (5) Morning azkar after Fajr — Ayatul Kursi, three Quls × 3, the comprehensive morning duas. (6) Quran recitation. (7) Remain seated until sunrise, then pray two rakaat Duha. (8) Begin daily work." },
    { q: "What time should Muslims wake up?", a: "The Sunnah is to wake for Fajr — which varies by season and location. In the MyTazki prayer times tool, you can find your exact local Fajr time. The Prophet ﷺ said: 'O Allah, bless my ummah in their early rising.' Waking for Fajr and staying awake until sunrise is the highest-barakah morning practice." },
    { q: "How do I build an Islamic morning routine?", a: "Start with the non-negotiable: Fajr on time. Add one practice per week. Week 1: Fajr on time. Week 2: Morning azkar after Fajr. Week 3: 10 minutes Quran after azkar. Week 4: Duha prayer. Build incrementally — the Prophet ﷺ preferred consistent small deeds over sporadic large ones." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0e0c07 0%,#09070a 45%,#080c08 100%)", "Fajr · Barakah · Morning", "Islamic Morning Routine", "The Prophet ﷺ asked Allah for barakah in the early morning. The morning is where the day's barakah lives.", "Get Prayer Times →", "/prayer-times", "Start Morning Sessions", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What is the Islamic morning routine step by step?", "Fajr to sunrise: (1) Wake before Fajr, say: 'Alhamdulillahil-ladhi ahyana ba'da ma amatana.' (2) Wudu — slowly, mindfully. (3) Fajr salah — the two sunnah rakaat before fard, then fard. (4) Morning azkar — 15 minutes. (5) Quran — at least one page. (6) Remain seated until sunrise. (7) Two rakaat Duha — 'better than the world and all it contains.' (8) Begin your day.")}
${duaCard("الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", "Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur", "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.", "Sahih Bukhari 6312 — the first thing to say upon waking. Sets the frame: this is a resurrection, a gift.")}
<h2 style="color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:1.4rem;margin:36px 0 16px">The Complete Morning Routine</h2>
${stepList([
  { n: "1", title: "Wake with intention", desc: "Before getting up, say the waking dua. Remind yourself: this day is a gift. Your rizq for today is already written. Your task is to live it with presence." },
  { n: "2", title: "Wudu as meditation", desc: "Wash slowly. Feel each part. Begin with 'Bismillah.' End with: 'Ashhadu an la ilaha illallah wa ashhadu anna Muhammadan 'abduhu wa rasuluh.' The Prophet ﷺ said wudu removes sins the way water removes dirt." },
  { n: "3", title: "Fajr — the anchor prayer", desc: "Two sunnah rakaat before fard — these are so important the Prophet ﷺ prayed them even when traveling. Then fard. Make it slow. This salah carries special barakah — the Quran says: 'The dawn prayer is witnessed.' (17:78)" },
  { n: "4", title: "Morning azkar — the spiritual seal", desc: "After Fajr: Ayatul Kursi once, then three Quls × 3 with blowing on palms. Then specific morning duas for protection, gratitude, and guidance. This takes 10-15 minutes and seals you spiritually for the day." },
  { n: "5", title: "Quran — feed the soul", desc: "Even one page. Read with understanding — look up the meaning of one verse. The Prophet ﷺ said the best of you is the one who learns and teaches the Quran. The morning Quran is the most barakah-rich reading of the day." },
  { n: "6", title: "Duha prayer — sunrise investment", desc: "Remain seated after Fajr until sunrise (approximately 20 minutes). Then pray 2-12 rakaat of Duha. The Prophet ﷺ said: 'Whoever prays Fajr in congregation and remains until sunrise, then prays two rakaat, has the reward of a complete Hajj and Umrah.' This is the morning's highest-yield practice." },
])}
${quranRef("أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا", "Establish prayer at the decline of the sun until the darkness of night and the Fajr recitation. Indeed, the Fajr recitation is witnessed.", "Quran 17:78 — the Fajr prayer is specifically witnessed by the angels of the night and day during their shift change")}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_GROWTH)}
${emotionalCTA({ title: "Start Your Islamic Morning with MyTazki", subtitle: "Prayer times, morning azkar, Quran, and AI companion — all free.", href: "/prayer-times", btnText: "Get Prayer Times →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 28. /morning-azkar
router.get("/morning-azkar", (_req, res) => {
  const slug = "/morning-azkar";
  const title = "Morning Azkar — Complete Guide to Morning Dhikr After Fajr";
  const desc = "The complete morning azkar (morning adhkar) after Fajr prayer. Arabic text, transliteration, translation, how many times to recite, and the spiritual benefit of each remembrance.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Duas Library", item: "/duas" }, { name: "Morning Azkar" }];
  const faqs = [
    { q: "What are the morning azkar?", a: "Morning azkar (adhkar al-sabah) are specific remembrances recited after Fajr prayer. Core morning azkar from Hisnul Muslim and authentic hadith include: Ayatul Kursi, three Quls × 3, 'Subhanallaahi wa bihamdih' × 100, the comprehensive morning protection dua, and Sayyidul Istighfar. They take 10-20 minutes and seal you spiritually for the day." },
    { q: "When should morning azkar be recited?", a: "After Fajr salah until the sun rises, or at any point in the morning before Duha. The Prophet ﷺ said whoever recites certain morning azkar is protected from harm until evening. The optimal window is immediately after Fajr salah." },
    { q: "What is the most important morning dhikr?", a: "Sayyidul Istighfar — the master of all forgiveness prayers. Also: 'La ilaha illallah wahdahu la sharika lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadir' × 100 in the morning — forgives 100 sins, equivalent to freeing 10 slaves. Ayatul Kursi — once — grants protection until evening." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0f0d07 0%,#09070a 45%,#07100a 100%)", "Morning Dhikr · Fajr Practice", "Morning Azkar — The Spiritual Seal of the Day", "After Fajr, before the world starts, there is a window. These are the words that belong in it.", "Open Duas →", "/duas", "Get Prayer Times", "/prayer-times")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What should I recite in the morning azkar?", "Core morning azkar (in order): (1) Ayatul Kursi — once. (2) Al-Ikhlas, Al-Falaq, An-Nas × 3 each. (3) 'Subhanallaahi wa bihamdih' × 100. (4) 'La ilaha illallah wahdahu...' × 100. (5) Sayyidul Istighfar once. (6) Morning protection duas from Hisnul Muslim. Total time: 15-20 minutes. This is not a checklist — it is conversation with Allah.")}
${duaCard("سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "Subhanallaahi wa bihamdih", "Glory be to Allah and praise be to Him.", "Bukhari/Muslim — × 100 in the morning: sins forgiven even if like sea foam. The most efficient dhikr per minute.")}
${duaCard("اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ", "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana 'abduka wa ana 'ala 'ahdika wa wa'dika mastata'tu", "O Allah, You are my Lord, there is no god but You. You created me and I am Your servant and I abide by Your covenant and promise as best I can.", "Sahih Bukhari 6306 — Sayyidul Istighfar. The Prophet ﷺ said: whoever says this with certainty in the morning, if he dies that day, he enters Jannah.")}
${card("Why Morning Azkar Is Different from Random Dhikr", "Morning azkar is structured protection — like a pre-flight checklist for your soul. Each dhikr has a specific function: Ayatul Kursi secures against spiritual attack until evening (confirmed hadith). The three Quls provide comprehensive protection. Sayyidul Istighfar guarantees Jannah for those who believe it and die that day. These are not inspirational phrases — they are protection protocols.")}
${card("The Science and Spirit of Morning Dhikr", "Morning dhikr creates cognitive priming — the thoughts you hold in the first 30 minutes after waking set the emotional register for the entire day. Secular psychology recommends gratitude journaling for the same reason. Morning azkar is gratitude, protection, connection, and forgiveness compressed into 15 minutes of structured conversation with Allah.")}
${card("Building the Morning Azkar Habit", "Start with just Ayatul Kursi and the three Quls — 5 minutes. Do this for 14 days without exception. Then add Sayyidul Istighfar. Then add Subhanallaahi wa bihamdih × 100. The Prophet ﷺ preferred consistent small deeds. One morning azkar performed consistently for a year is worth more than occasional full sets.")}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_GROWTH)}
${emotionalCTA({ title: "Morning Azkar Counter in MyTazki", subtitle: "Complete azkar library, tasbih counter, and guided morning sessions — free.", href: "/duas", btnText: "Open Duas →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 29. /daily-islamic-habits
router.get("/daily-islamic-habits", (_req, res) => {
  const slug = "/daily-islamic-habits";
  const title = "Daily Islamic Habits — 10 Sunnah Practices That Transform Your Life";
  const desc = "The ten most impactful daily Islamic habits from authentic Sunnah. Not burdensome rituals — small, consistent practices the Prophet ﷺ never abandoned that compound into spiritual transformation.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Habits & Growth", item: "/islamic-habits" }, { name: "Daily Islamic Habits" }];
  const faqs = [
    { q: "What are the daily habits of a good Muslim?", a: "Based on Sunnah: (1) Fajr on time — daily anchor. (2) Morning and evening azkar — spiritual protection. (3) Quran daily — even one page. (4) Salawat on the Prophet × 10+ — barakah. (5) Sadqa — even a smile is charity. (6) Dhikr between tasks. (7) Night prayer — even two rakaat. (8) Istighfar before sleeping. (9) Reading before sleeping instead of screens. (10) Gratitude — naming three specific blessings daily." },
    { q: "How do I build Islamic habits?", a: "The Prophet ﷺ principle: 'The most beloved deeds to Allah are those that are consistent, even if small.' The Islamic habit-building system: (1) Attach new habits to existing prayers (prayer is the anchor). (2) Start absurdly small — one Quran page, not one juz. (3) Make it visible — a habit tracker, a Tasbih counter, a reminder. (4) Connect to meaning — why does this matter to you specifically?" },
  ];
  const body = `
${hero("linear-gradient(150deg,#0c0a08 0%,#09070a 45%,#090c0a 100%)", "Daily Practice · Sunnah Habits", "Daily Islamic Habits That Actually Stick", "The Prophet ﷺ was consistent. Small practices, every day, without exception. That is the system.", "Start Tracking →", "/download", "Explore Sessions", "/sessions")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What daily habits should a Muslim have?", "The minimum viable Islamic day: (1) Fajr on time. (2) Morning azkar after Fajr. (3) One page of Quran. (4) One act of sadqa — even removing something from the road. (5) Dhikr between Asr and Maghrib. (6) Evening azkar. (7) Istighfar × 100 before sleeping. This is 30-40 minutes of intentional practice embedded across the day. Everything else builds from here.")}
${card("Habit 1: Fajr on Time — The Master Habit", "Every other Islamic habit is easier when Fajr is consistent. Research on Muslim practice shows that Fajr regularity is the highest predictor of overall Islamic habit compliance. If you fix one thing, fix this. Use MyTazki's prayer time notifications.")}
${card("Habit 2: Morning Azkar — The Spiritual Seal", "15 minutes after Fajr. Ayatul Kursi, three Quls × 3, Sayyidul Istighfar, morning protection duas. This is the spiritual checklist that seals your day. Do it before opening your phone — the first inputs of the morning set the emotional register for the day.")}
${card("Habit 3: One Page of Quran Daily", "At the pace of one page per day, you complete the Quran in approximately 600 days — less than two years. The Prophet ﷺ completed the Quran with Jibril AS every Ramadan. The goal is not speed but consistency. One page, every day, with tadabbur (reflection).")}
${duaCard("اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik", "O Allah, help me to remember You, be grateful to You, and worship You well.", "Abu Dawud 1522 — the Prophet's own dua for consistency in worship. Make it your daily habit intention.")}
${card("Habit 4: Sadqa — The Daily Investment", "The Prophet ﷺ said: 'Every day two angels descend and one says: O Allah, compensate the one who spends. The other says: O Allah, destroy the wealth of the one who withholds.' Even £1 daily is sadqa. Even a smile. Even removing harm from the road. The habit of giving changes you more than it helps others.")}
${card("Habit 5: Istighfar — 100× Before Sleeping", "The Prophet ﷺ made istighfar 70-100 times daily despite being sinless. Istighfar is not just sin-removal — it opens doors of provision, removes hardship, and clarifies the heart. Make it the last intentional thing before sleep: 'Astaghfirullah' × 100 while lying down.")}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_GROWTH)}
${emotionalCTA({ title: "Track Islamic Habits with MyTazki", subtitle: "Streak tracker, habit dashboard, guided sessions — free.", href: "/download", btnText: "Start Tracking →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 30. /productive-muslim-routine
router.get("/productive-muslim-routine", (_req, res) => {
  const slug = "/productive-muslim-routine";
  const title = "Productive Muslim Routine — Islam's Framework for a High-Output Day";
  const desc = "The Islamic framework for a productive day — not just productivity tips, but the Prophet's actual daily structure and how it creates barakah-filled output. Grounded in Sunnah.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Habits & Growth", item: "/islamic-habits" }, { name: "Productive Muslim Routine" }];
  const faqs = [
    { q: "What is a productive Muslim routine?", a: "A productive Muslim day follows the salah structure as natural work blocks: (1) Pre-Fajr — Tahajjud and deep work. (2) Fajr to Duha — morning azkar, Quran, and intentional morning work. (3) Duha to Dhuhr — sustained focus work. (4) Dhuhr break — reset and reconnect. (5) Asr to Maghrib — complete remaining work. (6) Maghrib to Isha — family and rest. (7) Isha and after — reflection and sleep." },
    { q: "Did the Prophet have a productive routine?", a: "Yes. The Prophet ﷺ had a structured day: He woke before Fajr (Tahajjud), prayed Fajr, stayed awake until sunrise, then began his affairs. He took a midday rest (Qailulah). He engaged community affairs between Dhuhr and Asr. He had specific times for learning, teaching, family, and rest. Modern time-blocking was practiced by him 1,400 years ago." },
    { q: "How does salah make you more productive?", a: "Salah creates five forced work sessions with natural breaks. Each salah is a context switch that prevents burnout. Wudu resets the nervous system. The bow and prostration reduce cortisol. Modern research on 'ultradian rhythm' (90-minute focus cycles with breaks) mirrors the salah structure almost exactly." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0c0b08 0%,#09070a 45%,#090c09 100%)", "Islamic Productivity · Focus", "Productive Muslim Routine", "The salah structure is a world-class time management system. Five built-in context switches, built-in rest, built-in purpose.", "Build Your Routine →", "/download", "Get Prayer Times", "/prayer-times")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How does a Muslim structure a productive day?", "Use salah as time blocks: Pre-Fajr: deep work or Tahajjud. Post-Fajr to Duha: morning azkar + Quran + first work sprint. Duha to Dhuhr: second work sprint. Dhuhr: break + salah + reset. Asr to Maghrib: final work session. Maghrib: family + rest. After Isha: reflection, gratitude, early sleep. The Prophet ﷺ said: 'O Allah, bless my ummah in their early rising.' Start early.")}
${card("The Prophet's Daily Schedule — Reconstructed", "From authentic hadith and seerah: Pre-Fajr → Tahajjud. Fajr → community prayer + post-Fajr dhikr. Sunrise → Duha prayer. Morning → community affairs, teaching, and governance. Dhuhr → midday rest (Qailulah) then prayer. Afternoon → continued affairs and consultations. Asr → prayer. After Asr → dedicated family time. Maghrib → prayer + light meal. Isha → prayer + limited nighttime activity. Sleep before midnight.")}
${card("Salah as Focus Blocks — The Science", "Research on sustained attention shows optimal focus cycles of 60-90 minutes followed by meaningful breaks. Fajr to Dhuhr is 5-7 hours — enough for 3-4 deep work blocks with natural salah breaks. Salah breaks include physical movement (wudu, prostration), mental context switch, and spiritual re-centering — a more complete break than coffee.")}
${duaCard("اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً وَرِزْقاً طَيِّباً وَعَمَلاً مُتَقَبَّلاً", "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbala", "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.", "Ibn Majah 925 — said after Fajr salah. The Islamic productivity dua: knowledge, provision, accepted work.")}
${card("Qailulah — The Sunnah Nap", "The Prophet ﷺ took a midday rest before Dhuhr. Modern sleep research confirms that a 20-minute nap between 1-3pm improves afternoon cognitive performance by 34% (NASA study). The Sunnah is not just spiritually wise — it is biologically optimal. Keep it under 30 minutes to avoid deep sleep cycles.")}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_GROWTH)}
${emotionalCTA({ title: "Build Your Muslim Routine with MyTazki", subtitle: "Prayer times, habit tracker, streak counter, and guided sessions — free.", href: "/download", btnText: "Start Building →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 31. /fajr-routine
router.get("/fajr-routine", (_req, res) => {
  const slug = "/fajr-routine";
  const title = "Fajr Routine — How to Wake Up for Fajr and Make It the Best Part of Your Day";
  const desc = "A complete guide to building a consistent Fajr routine. How to wake up, what to do after Fajr prayer, and how the Prophet ﷺ used the pre-dawn hours to shape his day.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Habits & Growth", item: "/islamic-habits" }, { name: "Fajr Routine" }];
  const faqs = [
    { q: "How do I build a Fajr routine?", a: "Start with just showing up: set an alarm 10 minutes before Fajr. Sleep with wudu so waking feels continuous with worship. Put your alarm across the room. Say 'Alhamdulillah' before getting up. After 21 days of Fajr on time, add the morning azkar. After another 21 days, add Quran. Stack gradually — willpower is not the answer, systems are." },
    { q: "What to do after Fajr prayer?", a: "The highest-value post-Fajr sequence: (1) Morning azkar — 15 minutes. (2) Quran — minimum one page. (3) Remain seated facing qibla until sunrise — do not open your phone. (4) Pray two rakaat Duha after sunrise. (5) Make your daily intention. This sequence is worth, according to multiple hadith, more than the world and all it contains." },
    { q: "Why is Fajr so important in Islam?", a: "Fajr is specifically mentioned in the Quran: 'The Fajr recitation is witnessed' (17:78) — witnessed by the angels of night and day during their shift change. The Prophet ﷺ said: 'Whoever prays Fajr is under the protection of Allah for that day.' It is not just a prayer — it is the key that unlocks the day's barakah." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0f0d07 0%,#09070a 45%,#070f09 100%)", "Fajr · Dawn · Barakah", "Fajr Routine — The Hour That Shapes the Day", "The Prophet ﷺ asked Allah for barakah in the morning. It is the hour the angels shift. It is the hour the day's provision is distributed.", "Get Fajr Time →", "/prayer-times", "Morning Sessions", "/download")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What is the complete Fajr routine?", "Pre-Fajr: Wake, say waking dua, wudu, two sunnah rakaat. Fajr prayer: two fard rakaat with full presence. Post-Fajr: Morning azkar (15 min), Quran (one page minimum), sit facing qibla until sunrise without phone. Sunrise: two rakaat Duha — the Prophet ﷺ said this equals Hajj and Umrah reward. Then begin your day. Total: 45-60 minutes that determine the barakah of the remaining 23 hours.")}
${duaCard("اللَّهُمَّ بَارِكْ لَنَا فِي شَهْرِنَا هَذَا وَفِي يَوْمِنَا هَذَا", "Allahumma barik lana fi shahrihim hadha wa fi yawmina hadha", "O Allah, bless us in this morning of ours.", "Adapted from various morning duas — make this your personal Fajr intention every single morning")}
${quranRef("إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا", "Indeed, the Fajr recitation is witnessed.", "Quran 17:78 — the angels of night and day both witness Fajr. Every salah you pray at Fajr is witnessed by this changing of the heavenly guard.")}
${card("The Window Between Fajr and Sunrise", "This is the most underutilized spiritual window in the day. The Prophet ﷺ would remain in the masjid after Fajr, in dhikr and dua, until sunrise. He called this period blessed. Research on circadian rhythms shows the early morning is optimal for focused learning and spiritual practice. Do not waste it on your phone.")}
${card("How to Wake Up for Fajr Consistently", "The Prophet ﷺ slept early. This is the primary Fajr habit. Secondary: sleep with wudu — the body remains in a state of purity and waking feels connected to worship. Third: the night intention — 'I intend to wake for Fajr' said before sleeping. Fourth: accountability — a family member, friend, or alarm system. Fifth: make the post-Fajr time worth getting up for.")}
${card("The Duha Prayer — The Most Underrated Sunnah", "After Fajr, sit until sunrise (approximately 20 minutes depending on season), then pray 2-12 rakaat of Duha. The Prophet ﷺ said: 'Whoever prays Fajr in congregation then sits in his place of prayer until he prays Duha — they will receive the reward of a complete and accepted Hajj and Umrah.' This is repeatable every single day.")}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_GROWTH)}
${emotionalCTA({ title: "Never Miss Fajr with MyTazki", subtitle: "Accurate local prayer times, Fajr notifications, and morning azkar guide — free.", href: "/prayer-times", btnText: "Get Fajr Time →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 32. /muslim-mindfulness
router.get("/muslim-mindfulness", (_req, res) => {
  const slug = "/muslim-mindfulness";
  const title = "Muslim Mindfulness — Islamic Presence Practice Rooted in Sunnah";
  const desc = "What mindfulness means in Islam, how it differs from secular mindfulness, and the specific Islamic practices of muraqabah, dhikr, and tafakkur for present-moment awareness.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Habits & Growth", item: "/islamic-habits" }, { name: "Muslim Mindfulness" }];
  const faqs = [
    { q: "Is mindfulness allowed in Islam?", a: "The concept of mindfulness is deeply rooted in Islam through specific practices: muraqabah (awareness that Allah is watching), tafakkur (deep reflection on creation), and ihsan (worshipping Allah as if you see Him). Islamic mindfulness is not about emptying the mind — it is filling it with awareness of Allah's presence." },
    { q: "What is muraqabah in Islam?", a: "Muraqabah means 'watchfulness' or 'awareness of Allah's observation.' It is the practice of maintaining continuous awareness that Allah sees everything — your actions, your thoughts, your intentions. The Prophet ﷺ defined ihsan as: 'To worship Allah as though you see Him; for even if you do not see Him, He surely sees you.' This is Islamic mindfulness at its highest." },
    { q: "How do Muslims practice mindfulness?", a: "Through: (1) Dhikr — intentional remembrance with presence (not mechanical). (2) Tafakkur — reflection on creation, the self, and Allah's signs. (3) Muraqabah — awareness of Allah's gaze in every moment. (4) Presence in salah — khushu. (5) Mindful eating (saying Bismillah and tasting). (6) Mindful wudu — feeling each wash rather than rushing." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0b0a09 0%,#09070a 45%,#090b0a 100%)", "Presence · Muraqabah · Awareness", "Muslim Mindfulness — Awareness of Allah in Every Moment", "Secular mindfulness empties the mind. Islamic mindfulness fills it — with the One who fills everything.", "Practice Now →", "/download", "Explore Sessions", "/sessions")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What is Islamic mindfulness?", "Islamic mindfulness is muraqabah — the continuous awareness that Allah is present and observing. It is not meditation for relaxation but presence for worship. The Prophet ﷺ defined its highest form as ihsan: 'Worship Allah as though you see Him; for if you do not see Him, He sees you.' This is more rigorous and more transformative than secular mindfulness — it anchors presence not to breath but to Allah.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">Secular mindfulness observes thoughts without judgment. Islamic mindfulness does more: it brings every thought, emotion, and action into the awareness of being seen by Allah. This is not anxiety-inducing — it is liberating. When you know Allah sees you, the opinions of others lose their grip. When you know He hears you, anxiety about unheard prayers dissolves.</p>
${quranRef("وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", "And He is with you wherever you are.", "Quran 57:4 — the Quranic basis of muraqabah. Not a metaphor — a literal statement of divine presence in every moment.")}
${card("Tafakkur — Islamic Contemplative Reflection", "Tafakkur is deep reflection on the signs of Allah in creation. The Prophet ﷺ would spend hours in quiet reflection. One hour of tafakkur on Allah's creation is described in some narrations as better than 70 years of optional worship. It is not passive daydreaming — it is active movement from the created thing to the Creator.")}
${duaCard("اللَّهُمَّ آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", "Allahumma atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar", "O Allah, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", "Quran 2:201 — the Prophet's ﷺ most frequently recited dua. A mindfulness anchor: present good, future good, protection from harm.")}
${card("Khushu in Salah — The Practice Ground", "Khushu (presence in prayer) is the highest form of Islamic mindfulness. The Quran says: 'Successful are the believers who in their prayer have khushu.' (23:1-2). Practice: before each salah, pause for 30 seconds. Say: 'I am about to stand before Allah.' Feel what that means. Enter the prayer with this awareness. Khushu is trained, not found.")}
${card("Mindful Dhikr — Quality Over Quantity", "The Prophet ﷺ preferred consistent small deeds. For dhikr: 'Subhanallah' said once with full presence — feeling the meaning of Allah's perfection — is worth more than 100 fast repetitions. Slow down. One Subhanallah per breath. Feel the meaning: 'Allah is far above any imperfection.' This is mindfulness applied to remembrance.")}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_GROWTH)}
${emotionalCTA({ title: "Daily Mindfulness Practice in MyTazki", subtitle: "Guided muraqabah sessions, AI companion, and dhikr tracker — free.", href: "/download", btnText: "Open MyTazki →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 33. /daily-tazkiyah
router.get("/daily-tazkiyah", (_req, res) => {
  const slug = "/daily-tazkiyah";
  const title = "Daily Tazkiyah — Purifying the Soul One Day at a Time";
  const desc = "What tazkiyah is, why it is a Quranic obligation, and how to build a daily soul-purification practice that compounds over time. A complete Islamic framework for spiritual growth.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Habits & Growth", item: "/islamic-habits" }, { name: "Daily Tazkiyah" }];
  const faqs = [
    { q: "What is tazkiyah in Islam?", a: "Tazkiyah (تزكية) means purification and growth of the soul. It has two dimensions: (1) Tazkiyatun nafs — purifying the soul of spiritual diseases (arrogance, jealousy, greed, envy, riya). (2) Tazkiyah through growth — developing positive qualities (tawadu, ihsan, tawakkul, shukr). The Quran calls this a primary mission of the Prophet ﷺ: 'He purifies them and teaches them.' (2:129)" },
    { q: "How do I do tazkiyah daily?", a: "Daily tazkiyah practice: (1) Morning: Identify one nafs disease you want to work on this week. (2) During the day: notice when it appears. (3) Make istighfar immediately when you act from it. (4) Evening: reflect — did you improve? Make dua for strength. (5) Weekly: read one page of Ibn Qayyim or Al-Ghazali on the disease you're addressing." },
    { q: "What are the stages of tazkiyah?", a: "Classical scholars identify: (1) Tawbah — sincere repentance and return to Allah. (2) Taqwa — God-consciousness in all actions. (3) Zuhd — non-attachment to the dunya. (4) Sabr — patient endurance. (5) Shukr — deep gratitude. (6) Khawf wa raja — fear and hope in balance. (7) Tawakkul — complete reliance on Allah. These are cumulative — each stage builds on the previous." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0b0a09 0%,#09070a 48%,#080c0a 100%)", "Soul Purification · Tazkiyah", "Daily Tazkiyah — Growing Your Soul", "The soul that is not being purified is being cluttered. Tazkiyah is the daily maintenance of the most important thing you own.", "Begin Tazkiyah →", "/download", "Explore Sessions", "/sessions")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What is daily tazkiyah?", "Daily tazkiyah is the intentional practice of soul-purification across three dimensions: (1) Cleaning — removing spiritual diseases through istighfar, reflection, and accountability. (2) Planting — cultivating positive qualities through deliberate practice. (3) Watering — nourishing the soul through Quran, dhikr, and salah. One practice from each dimension daily compounds into profound character transformation over months and years.")}
${quranRef("قَدْ أَفْلَحَ مَن زَكَّاهَا وَقَدْ خَابَ مَن دَسَّاهَا", "Indeed he has succeeded who purifies the soul, and indeed he has failed who corrupts it.", "Quran 91:9-10 — tazkiyah is the definition of success in the Quran. Not wealth, status, or intelligence — purification.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">The Prophet ﷺ's mission is described in the Quran as: <em style="color:#c9a472">"He recites to them His verses, purifies them, and teaches them the Book and wisdom."</em> (2:129). Purification (tazkiyah) is listed before teaching. The soul that is not purified cannot hold knowledge properly. Tazkiyah is not optional for serious Muslims — it is the prerequisite for everything else.</p>
${card("The Five Daily Tazkiyah Practices", "1. Morning reflection — one question: 'Which quality of my nafs do I want to improve today?' 2. Istighfar × 100 — the primary spiritual cleaning agent. 3. One page of Islamic character literature — Ibn Qayyim's Madarij al-Salikin, or Al-Ghazali's Ihya. 4. Evening muhasabah — five minutes of self-accounting: what was good, what needs repair. 5. Dua for character — 'Allahumma ahsin khalqi kama ahsanta khalqi' (O Allah, perfect my character as You perfected my creation).")}
${duaCard("اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا وَزَكِّهَا أَنْتَ خَيْرُ مَن زَكَّاهَا", "Allahumma ati nafsi taqwaha wa zakkiha anta khayru man zakkaha", "O Allah, grant my soul its righteousness and purify it — You are the best of those who purify.", "Sahih Muslim 2722 — the Prophet's own tazkiyah dua. Ask Allah directly to purify you — He is the best purifier.")}
${card("The Nafs and Its Three States", "The Quran describes the nafs in three states: (1) Ammara bis-su (commanding toward evil, 12:53) — the unpurified default state. (2) Lawwama (self-reproaching, 75:2) — the state of awareness and accountability. (3) Mutma'inna (tranquil, 89:27) — the purified state that Allah calls toward Him at death. Tazkiyah is the path from the first to the third.")}
${faqHtml(faqs)}
${relatedArticlesGrid(RELATED_GROWTH)}
${emotionalCTA({ title: "Guided Tazkiyah Sessions in MyTazki", subtitle: "Structured spiritual growth sessions, character development, and AI Islamic companion — free.", href: "/sessions", btnText: "Begin Tazkiyah →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 34. /healing-with-dhikr
router.get("/healing-with-dhikr", (_req, res) => {
  const slug = "/healing-with-dhikr";
  const title = "Healing with Dhikr — How Islamic Remembrance Heals the Heart and Mind";
  const desc = "The healing power of dhikr in Islam — spiritually, emotionally, and physiologically. Which dhikr to use for what healing, and how consistent remembrance transforms anxiety, grief, and disconnection.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Healing with Dhikr" }];
  const faqs = [
    { q: "Does dhikr really heal?", a: "Yes — on multiple levels. Spiritually: dhikr is the prescribed cure for heart disease (spiritual diseases like arrogance, envy, anxiety about the dunya). Psychologically: focused repetition interrupts rumination loops and creates states of calm. Physiologically: slow, rhythmic verbal or mental repetition activates the parasympathetic nervous system, reducing cortisol." },
    { q: "Which dhikr is best for healing?", a: "For emotional healing: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin' (the dua of Yunus ﷺ). For anxiety: 'Hasbunallahu wa ni'mal wakil.' For grief: 'Inna lillahi wa inna ilayhi raji'un.' For spiritual disconnection: 'Subhanallahi wa bihamdih' × 100. Each targets a specific dimension of the healing need." },
    { q: "How long should I do dhikr for healing?", a: "Consistency matters more than duration. 15 minutes of focused dhikr daily (not mechanical) is more healing than 2 hours done occasionally. Start with 7 minutes: Subhanallaahi wa bihamdih × 100 (takes approximately 5-7 minutes when said with full presence). Add more as the practice deepens." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0a0b09 0%,#09070a 45%,#080c0a 100%)", "Dhikr Therapy · Heart Healing", "Healing with Dhikr — The Medicine in Remembrance", "Allah said hearts find rest in His remembrance. This is not a promise for later. It is happening now, as you recite.", "Start Dhikr →", "/download", "Browse Duas", "/duas")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("How does dhikr heal emotionally?", "Dhikr heals through three mechanisms: (1) Interruption — it breaks the rumination loop (the 'what if' mental replay) by replacing it with a meaningful phrase. (2) Grounding — repetitive focus on a phrase anchors you to the present moment, reducing projection anxiety. (3) Connection — dhikr is communication with Allah, and the knowledge that you are heard by the Most Powerful Being in existence fundamentally changes the emotional experience of difficulty.")}
${quranRef("أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", "Verily, in the remembrance of Allah do hearts find rest.", "Quran 13:28 — the primary Islamic statement on dhikr as healing. Not comfort — tatma'inn: settled, complete, deep rest.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">Ibn Qayyim al-Jawziyyah wrote an entire treatise on dhikr as medicine for the heart. He identified over 70 benefits of dhikr, including: removing grief and anxiety, bringing happiness, illuminating the face and heart, drawing divine protection, and — at the deepest level — making the heart alive in the way that silence makes it die slowly.</p>
${duaCard("سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ", "Subhanallaahi wa bihamdih, subhanallaahil-'adhim", "Glory be to Allah and praise be to Him. Glory be to Allah, the Magnificent.", "Bukhari/Muslim — described as 'two phrases light on the tongue, heavy in the scales, beloved to the Most Merciful.' The most efficient healing dhikr.")}
${card("The Dhikr Protocol for Healing Anxiety", "Morning: 'Hasbunallahu wa ni'mal wakil' × 100 — protection and release of control. Midday: 'Subhanallaahi wa bihamdih' × 100 — grounding in Allah's perfection. Evening: 'La ilaha illallah wahdahu la sharika lah' × 100 — recalibration of what is real. Night: 'Astaghfirullah' × 100 — clearing the day's spiritual residue. This 4-part daily dhikr protocol addresses anxiety at every level.")}
${card("Dhikr for Grief — The Specific Prescription", "The dua of Yunus ﷺ: 'La ilaha illa anta subhanaka inni kuntu minadh-dhalimin' — was said from inside a whale, in complete darkness, after a mistake. It contains: the affirmation that Allah alone is God, the recognition of His perfection, and honest acknowledgment of human failure. Grief and this dua: recite it × 40 while naming your specific grief to Allah. The hadith says it is answered.")}
${faqHtml(faqs)}
${relatedArticlesGrid([...RELATED_GROWTH, { href: "/tasbih", label: "Digital Tasbih Counter", tag: "Tool" }])}
${emotionalCTA({ title: "Daily Dhikr Practice in MyTazki", subtitle: "Tasbih counter, guided dhikr sessions, and AI Islamic companion — free.", href: "/tasbih", btnText: "Open Tasbih →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

// 35. /spiritual-burnout-islam
router.get("/spiritual-burnout-islam", (_req, res) => {
  const slug = "/spiritual-burnout-islam";
  const title = "Spiritual Burnout in Islam — When You Feel Disconnected from Allah";
  const desc = "What spiritual burnout is in Islam, why it happens even to committed Muslims, and the Islamic path back to connection when worship feels empty and faith feels distant.";
  const bcs = [{ name: "Home", item: "/" }, { name: "Mental Wellness", item: "/mental-wellness" }, { name: "Spiritual Burnout in Islam" }];
  const faqs = [
    { q: "What is spiritual burnout in Islam?", a: "Spiritual burnout is the state where worship feels mechanical, connection with Allah feels absent, and the motivation to perform religious duties is depleted. It is not the same as loss of faith — it is exhaustion of the spiritual muscle. It happens when the soul is being given lots of religious activity but little genuine nourishment." },
    { q: "Is feeling spiritually disconnected a sign of weak iman?", a: "Not necessarily. The companions experienced periods of decreased spiritual enthusiasm — the Prophet ﷺ described this as normal cycles of faith: 'Faith wears out in your heart as clothes wear out, so ask Allah to renew faith in your hearts.' (Al-Hakim). Spiritual burnout is often the signal that your practice has become performance rather than presence." },
    { q: "How do I recover from spiritual burnout islamically?", a: "1. Stop adding more religious activities — quality over quantity. 2. Return to the minimum: Fajr, Maghrib, Isha — just these, done with presence. 3. Read Quran for only 5 minutes, slowly, with meaning. 4. Spend time in nature with tafakkur (reflection). 5. Talk to Allah honestly: 'Ya Allah, I feel nothing. I am still here. Help me feel again.' 6. Give sadqa — action when motivation is absent." },
  ];
  const body = `
${hero("linear-gradient(150deg,#0d0a0c 0%,#09070a 45%,#08090c 100%)", "Spiritual Recovery · Reconnection", "Spiritual Burnout in Islam — The Return to Allah", "You did not lose Allah. You lost your way back. These are the directions.", "Find the Way Back →", "/download", "Guided Sessions", "/sessions")}
<div style="max-width:740px;margin:0 auto;padding:0 20px">
${breadcrumb(bcs)}
${quickAnswerBox("What do I do when I feel spiritually empty as a Muslim?", "The Prophet ﷺ said faith increases and decreases — this cycle is normal. When spiritually empty: (1) Do not stop the minimum (Fajr, Maghrib, Isha). (2) Make one sincere dua per day, no more. (3) Read one ayah with its meaning — not a page, one ayah. (4) Give sadqa even £1. (5) Be honest with Allah: 'I feel nothing but I am still here.' Allah honors the one who keeps showing up even when they feel nothing.")}
<p style="color:#6e5e4c;line-height:1.85;font-size:15px;font-family:Inter,sans-serif;margin:24px 0">Hanzalah RA came to the Prophet ﷺ distressed. He said: <em style="color:#c9a472">"Hanzalah has become a hypocrite, O Messenger of Allah." The Prophet asked why. He said: "When we are with you, we are reminded of Jannah and Jahannam, but when we go home to our families, we forget." The Prophet ﷺ said: "By the One in Whose hand is my soul, if you were to remain as you are when you are with me, the angels would shake hands with you in your homes. But, O Hanzalah, there is a time for this and a time for that."</em> The cycle of spiritual highs and lows is acknowledged by the Prophet himself.</p>
${quranRef("الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", "Those who believed and whose hearts are assured by the remembrance of Allah. Verily, in the remembrance of Allah do hearts find rest.", "Quran 13:28 — the path back from spiritual burnout is always the same: remembrance. Not more lectures, not more guilt. Dhikr.")}
${duaCard("يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ", "Ya muqallibal-qulub, thabbit qalbi 'ala dinik", "O Turner of hearts, keep my heart firm upon Your religion.", "Tirmidhi 3522 — the Prophet ﷺ recited this frequently. The heart is turned by Allah — ask Him directly to turn yours back.")}
${card("The Difference Between Burnout and Hypocrisy", "Spiritual burnout is exhaustion — the tank is empty. Hypocrisy (nifaq) is deliberate concealment of disbelief. If you are worried that you are becoming a hypocrite, you are almost certainly not one — hypocrites do not worry about being hypocrites. Your concern itself is the evidence of your faith. What you have is burnout, and burnout has a cure.")}
${card("The Minimum Viable Islamic Practice for Burnout Recovery", "During burnout: stop adding. Start protecting the minimum. The minimum is: (1) Fajr on time. (2) Maghrib on time. (3) Isha on time. Just these three, done with presence. Not perfectly — just honestly. Once you can do this consistently for a week, add morning azkar. Then Dhuhr. Then Asr. Rebuild the structure one brick at a time. Do not try to return to your peak all at once.")}
${card("Nature and Tafakkur — The Burnout Antidote", "When religious activity itself has become exhausting, return to the signs of Allah in creation. Walk outside. Look at the sky. Watch the trees. The Quran instructs this: 'Do they not look at the camels, how they were created?' (88:17). Creation is the primary classroom of faith before any masjid was built. Tafakkur in nature rekindles what religious performance has exhausted.")}
${faqHtml(faqs)}
${relatedArticlesGrid([...RELATED_GROWTH, { href: "/reconnect-with-allah-journey", label: "Reconnect with Allah Journey", tag: "Journey" }])}
${emotionalCTA({ title: "Rebuild Your Connection with MyTazki", subtitle: "Gentle guided sessions for spiritual recovery — not overwhelming, just healing.", href: "/sessions", btnText: "Begin Recovery →" })}
</div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(page(seoHead({ title: `${title} | MyTazki`, description: desc, canonical: slug, schema: [art(title, desc, slug), faqSchema(faqs), breadcrumbSchema(bcs)] }), body));
});

export default router;
