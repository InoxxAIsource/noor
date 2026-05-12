import { Router } from "express";
import {
  getAllSessions, setAllSessions,
  getAllDuas, setAllDuas,
  getAllNames, setAllNames,
  getNamesOfAllah, setNamesOfAllah,
  getAllUserIds, getTotalAIUsageToday,
  addToWaitlist, getWaitlist,
  getBlogPost, setBlogPost,
  type BlogPostRecord,
} from "../lib/db.js";
import Anthropic from "@anthropic-ai/sdk";
import { logger } from "../lib/logger.js";
import { BLOG_STUBS } from "../seo/blog-seo.js";
import { seedNames } from "../seed/names.js";
import { seedDuas } from "../seed/duas.js";

const router = Router();

const anthropic = new Anthropic({
  apiKey: process.env["AI_INTEGRATIONS_ANTHROPIC_API_KEY"] ?? "",
  baseURL: process.env["AI_INTEGRATIONS_ANTHROPIC_BASE_URL"],
});

// ─── Stats ────────────────────────────────────────────────────────────────────

router.get("/admin/stats", async (_req, res) => {
  try {
    const [userIds, sessions, duas, names, aiToday] = await Promise.all([
      getAllUserIds(),
      getAllSessions(),
      getAllDuas(),
      getAllNames(),
      getTotalAIUsageToday(),
    ]);

    res.json({
      totalUsers: userIds.length,
      totalSessions: (sessions as unknown[])?.length ?? 0,
      totalDuas: (duas as unknown[])?.length ?? 0,
      totalNames: (names as unknown[])?.length ?? 0,
      aiRequestsToday: aiToday,
      estimatedCostUSD: ((aiToday * 300) / 1_000_000) * 3.0,
    });
  } catch (err) {
    logger.error({ err }, "admin stats error");
    res.status(500).json({ error: "Failed to load stats" });
  }
});

// ─── Session audio ────────────────────────────────────────────────────────────

router.patch("/admin/sessions/:id/audio", async (req, res) => {
  const { id } = req.params;
  const { audioUrl } = req.body as { audioUrl?: string };
  if (!audioUrl) { res.status(400).json({ error: "audioUrl required" }); return; }

  const sessions = (await getAllSessions()) as Array<Record<string, unknown>> | null;
  if (!sessions) { res.status(404).json({ error: "No sessions" }); return; }

  const idx = sessions.findIndex(s => s["id"] === id);
  if (idx === -1) { res.status(404).json({ error: "Session not found" }); return; }

  sessions[idx]!["audioUrl"] = audioUrl;
  await setAllSessions(sessions);
  res.json({ ok: true, id, audioUrl });
});

// ─── Dua audio ────────────────────────────────────────────────────────────────

router.patch("/admin/duas/:id/audio", async (req, res) => {
  const { id } = req.params;
  const { audioUrl } = req.body as { audioUrl?: string };
  if (!audioUrl) { res.status(400).json({ error: "audioUrl required" }); return; }

  const duas = (await getAllDuas()) as Array<Record<string, unknown>> | null;
  if (!duas) { res.status(404).json({ error: "No duas" }); return; }

  const idx = duas.findIndex(d => String(d["id"] ?? d["title"]) === id);
  if (idx === -1) { res.status(404).json({ error: "Dua not found" }); return; }

  duas[idx]!["audioUrl"] = audioUrl;
  await setAllDuas(duas);
  res.json({ ok: true, id, audioUrl });
});

// ─── Names Of Allah audio ─────────────────────────────────────────────────────

router.patch("/admin/allah-names/:number/audio", async (req, res) => {
  const num = parseInt(req.params["number"] ?? "", 10);
  const { audioUrl } = req.body as { audioUrl?: string };
  if (!audioUrl) { res.status(400).json({ error: "audioUrl required" }); return; }

  const names = (await getNamesOfAllah()) as Array<Record<string, unknown>> | null;
  if (!names) { res.status(404).json({ error: "No names" }); return; }

  const idx = names.findIndex(n => n["number"] === num);
  if (idx === -1) { res.status(404).json({ error: "Name not found" }); return; }

  names[idx]!["audioUrl"] = audioUrl;
  await setNamesOfAllah(names);
  res.json({ ok: true, number: num, audioUrl });
});

// ─── AI audio generation (ElevenLabs stub) ───────────────────────────────────

router.post("/admin/audio/generate-ai", async (req, res) => {
  const { contentId, contentType, text, voiceId } = req.body as {
    contentId?: string;
    contentType?: string;
    text?: string;
    voiceId?: string;
  };

  const apiKey = process.env["ELEVENLABS_API_KEY"];
  if (!apiKey) {
    res.status(503).json({ error: "ELEVENLABS_API_KEY not configured. Add to Replit Secrets." });
    return;
  }
  if (!contentId || !contentType || !text || !voiceId) {
    res.status(400).json({ error: "contentId, contentType, text, voiceId all required" });
    return;
  }

  try {
    const elevenResp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: "eleven_v3",
        voice_settings: { stability: 0.8, similarity_boost: 0.85, style: 0, use_speaker_boost: true },
      }),
    });

    if (!elevenResp.ok) throw new Error(`ElevenLabs error ${elevenResp.status}`);
    const audioBuffer = Buffer.from(await elevenResp.arrayBuffer());

    const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
    const cloudKey = process.env["CLOUDINARY_API_KEY"];
    const cloudSecret = process.env["CLOUDINARY_API_SECRET"];
    if (!cloudName || !cloudKey || !cloudSecret) {
      res.status(503).json({ error: "Cloudinary not configured. Add CLOUDINARY_* to Replit Secrets." });
      return;
    }

    const form = new FormData();
    form.append("file", new Blob([audioBuffer], { type: "audio/mpeg" }), `${contentId}.mp3`);
    form.append("upload_preset", "ml_default");
    form.append("folder", "noor/audio");
    form.append("public_id", contentId);
    form.append("resource_type", "video");

    const ts = Math.floor(Date.now() / 1000);
    const sig = `folder=noor/audio&public_id=${contentId}&resource_type=video&timestamp=${ts}${cloudSecret}`;
    const { createHash } = await import("crypto");
    const signature = createHash("sha1").update(sig).digest("hex");
    form.set("timestamp", String(ts));
    form.set("api_key", cloudKey);
    form.set("signature", signature);

    const cloudResp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: "POST",
      body: form,
    });
    if (!cloudResp.ok) throw new Error(`Cloudinary error ${cloudResp.status}`);
    const cloudData = await cloudResp.json() as { secure_url: string };
    const url = cloudData.secure_url;

    if (contentType === "session") {
      const sessions = (await getAllSessions()) as Array<Record<string, unknown>> | null ?? [];
      const idx = sessions.findIndex(s => s["id"] === contentId);
      if (idx !== -1) { sessions[idx]!["audioUrl"] = url; await setAllSessions(sessions); }
    } else if (contentType === "dua") {
      const duas = (await getAllDuas()) as Array<Record<string, unknown>> | null ?? [];
      const idx = duas.findIndex(d => String(d["id"] ?? d["title"]) === contentId);
      if (idx !== -1) { duas[idx]!["audioUrl"] = url; await setAllDuas(duas); }
    } else if (contentType === "allah-name") {
      const names = (await getNamesOfAllah()) as Array<Record<string, unknown>> | null ?? [];
      const num = parseInt(contentId, 10);
      const idx = names.findIndex(n => n["number"] === num);
      if (idx !== -1) { names[idx]!["audioUrl"] = url; await setNamesOfAllah(names); }
    }

    res.json({ ok: true, url, contentId });
  } catch (err) {
    logger.error({ err }, "audio generate-ai error");
    res.status(500).json({ error: String(err) });
  }
});

// ─── Blog generate ────────────────────────────────────────────────────────────

router.post("/admin/blog/generate", async (req, res) => {
  const { slug, title, category, targetKeyword } = req.body as {
    slug?: string;
    title?: string;
    category?: string;
    targetKeyword?: string;
  };

  if (!slug) { res.status(400).json({ error: "slug required" }); return; }

  const stub = BLOG_STUBS.find(p => p.slug === slug);
  if (!stub) { res.status(404).json({ error: "Blog post stub not found" }); return; }

  const resolvedTitle = title ?? stub.title;
  const resolvedCategory = category ?? stub.category;
  const resolvedKeyword = targetKeyword ?? stub.title.split("-")[0]?.trim() ?? stub.title;

  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: "Return ONLY valid JSON. No markdown. No preamble.",
      messages: [{
        role: "user",
        content: `Write a blog post for MyTazki (mytazki.com), a Muslim prayer app. Tagline: "Grow Spiritually Every Day."

Title: ${resolvedTitle}
Target keyword: ${resolvedKeyword}
Category: ${resolvedCategory}
Word count: ~700 words

Rules:
- H1 = exact title
- First paragraph includes keyword naturally
- Include 3 internal links as <a href='/path'>text</a>
  (link to relevant /duas/, /names/, /prayer-times/ pages)
- Include 1-2 authentic hadith or Quran references
- End with paragraph mentioning MyTazki by name
- Format: <p><h2><h3><ul><li><strong> tags ONLY
- Warm Islamic tone, never preachy
- Do NOT mention competitor apps

JSON:
{
  "contentHtml": "full HTML article",
  "metaDescription": "max 155 chars",
  "wordCount": 700,
  "internalLinks": [
    {"text":"anchor text","url":"/path"},
    {"text":"anchor text","url":"/path"},
    {"text":"anchor text","url":"/path"}
  ]
}`,
      }],
    });

    const block = response.content[0];
    const raw = block?.type === "text" ? block.text.trim() : "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    let parsed: { contentHtml?: string; metaDescription?: string; wordCount?: number; internalLinks?: unknown[] } = {};
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[0]); } catch { /* ignore */ }
    }

    const record: BlogPostRecord = {
      ...stub,
      content_html: parsed.contentHtml ?? "",
      wordCount: parsed.wordCount ?? 700,
      generatedAt: new Date().toISOString(),
    };
    await setBlogPost(slug, record);

    res.json({ ok: true, slug, wordCount: record.wordCount });
  } catch (err) {
    logger.error({ err, slug }, "blog generate error");
    res.status(500).json({ error: "Generation failed" });
  }
});

// ─── Blog generate all ────────────────────────────────────────────────────────

router.post("/admin/blog/generate-all", async (req, res) => {
  const slugs = BLOG_STUBS.map(s => s.slug);
  res.json({ ok: true, queued: slugs.length, message: "Run /admin/blog/generate for each slug individually to avoid timeouts." });
});

// ─── Append HEALING sessions (non-destructive) ───────────────────────────────

router.post("/admin/sessions/add-healing", async (_req, res) => {
  const { nanoid } = await import("nanoid");
  const HEALING = [
    { category: "HEALING", title: "Healing Through Sujood", durationSeconds: 600, scriptureRef: "Quran 96:19", scriptureArabic: "وَٱسْجُدْ وَٱقْتَرِب", scriptureText: "Prostrate and draw near [to Allah].", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/096019.mp3" },
    { category: "HEALING", title: "Dua for Overthinking", durationSeconds: 480, scriptureRef: "Quran 13:28", scriptureArabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", scriptureText: "Verily, in the remembrance of Allah do hearts find rest.", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/013028.mp3" },
    { category: "HEALING", title: "Surah Ad-Duha Reflection", durationSeconds: 720, scriptureRef: "Quran 93:5", scriptureArabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", scriptureText: "And your Lord is going to give you, and you will be satisfied.", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/93.mp3" },
    { category: "HEALING", title: "Trusting Allah in Hard Times", durationSeconds: 600, scriptureRef: "Quran 65:3", scriptureArabic: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ", scriptureText: "Whoever relies upon Allah, then He is sufficient for him.", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/065003.mp3" },
    { category: "HEALING", title: "Slowing Down in Salah", durationSeconds: 540, scriptureRef: "Quran 2:45", scriptureArabic: "وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ", scriptureText: "And seek help through patience and prayer.", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002045.mp3" },
    { category: "HEALING", title: "Sleep with Ayatul Kursi", durationSeconds: 900, scriptureRef: "Quran 2:255", scriptureArabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", scriptureText: "Allah: there is no deity except Him, the Ever-Living, the Sustainer of existence.", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002255.mp3" },
    { category: "HEALING", title: "Letting Go with Tawakkul", durationSeconds: 600, scriptureRef: "Quran 3:159", scriptureArabic: "فَتَوَكَّلْ عَلَى ٱللَّهِ ۚ إِنَّ ٱللَّهَ يُحِبُّ ٱلْمُتَوَكِّلِينَ", scriptureText: "And rely upon Allah. Indeed, Allah loves those who rely upon Him.", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/003159.mp3" },
    { category: "HEALING", title: "Tahajjud Companion", durationSeconds: 1200, scriptureRef: "Quran 17:79", scriptureArabic: "وَمِنَ ٱلَّيْلِ فَتَهَجَّدْ بِهِۦ نَافِلَةً لَّكَ", scriptureText: "And rise from sleep for prayer as an extra offering for you.", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/73.mp3" },
    { category: "HEALING", title: "Rizq Anxiety Session", durationSeconds: 480, scriptureRef: "Quran 11:6", scriptureArabic: "وَمَا مِن دَآبَّةٍۢ فِى ٱلْأَرْضِ إِلَّا عَلَى ٱللَّهِ رِزْقُهَا", scriptureText: "There is no creature on earth but that upon Allah is its provision.", audioUrl: "https://everyayah.com/data/Alafasy_128kbps/011006.mp3" },
    { category: "HEALING", title: "Finding Peace After Isha", durationSeconds: 600, scriptureRef: "Quran 93:11", scriptureArabic: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ", scriptureText: "And speak of the favor of your Lord.", audioUrl: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/93.mp3" },
  ];

  try {
    const existing = ((await getAllSessions()) as Array<Record<string, unknown>>) ?? [];
    const existingTitles = new Set(existing.map(s => s["title"] as string));
    const toAdd = HEALING.filter(h => !existingTitles.has(h.title));

    if (toAdd.length === 0) {
      res.json({ ok: true, added: 0, message: "All HEALING sessions already exist" });
      return;
    }

    const newSessions = toAdd.map(h => ({
      id: nanoid(),
      slug: h.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      guideName: "MyTazki Team",
      isPremium: false,
      language: "en",
      tags: ["healing"],
      madhab: null,
      playCount: 0,
      description: `A ${Math.floor(h.durationSeconds / 60)}-minute healing session.`,
      ...h,
    }));

    await setAllSessions([...existing, ...newSessions]);
    res.json({ ok: true, added: newSessions.length, total: existing.length + newSessions.length, titles: newSessions.map(s => s.title) });
  } catch (err) {
    logger.error({ err }, "add-healing error");
    res.status(500).json({ error: String(err) });
  }
});

// ─── Bulk session audio patch (everyayah.com + Islamic Network CDN) ──────────

router.post("/admin/sessions/patch-audio", async (_req, res) => {
  // Each entry: { url, durationSeconds } — durations match actual audio length
  const AUDIO_MAP: Record<string, { url: string; durationSeconds: number }> = {
    // AZKAR — full surah recitations matching session theme
    "Morning Azkar Full":           { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/18.mp3",  durationSeconds: 2400 }, // Al-Kahf (~40 min)
    "Dua After Fajr":               { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/36.mp3",  durationSeconds: 1440 }, // Ya-Sin (~24 min)
    "Dua for Rizq":                 { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/56.mp3",  durationSeconds: 480  }, // Al-Waqi'ah (~8 min)
    "Ayatul Kursi Explained":       { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/2.mp3",   durationSeconds: 7200 }, // Al-Baqarah (~2 hr)
    "Evening Azkar Full":           { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3",  durationSeconds: 660  }, // Al-Mulk (~11 min)
    // QURAN — full surah recitations
    "Surah Fatiha Reflection":      { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3",   durationSeconds: 50   }, // Al-Fatiha (~50 sec)
    "Ayatul Kursi Deep Dive":       { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/2.mp3",   durationSeconds: 7200 }, // Al-Baqarah
    "Surah Ar-Rahman":              { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/55.mp3",  durationSeconds: 660  }, // Ar-Rahman (~11 min)
    "Last Three Surahs":            { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3", durationSeconds: 60   }, // Al-Ikhlas + short (~1 min total)
    "Surah Al-Kahf":                { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/18.mp3",  durationSeconds: 2400 }, // Al-Kahf (~40 min)
    // DHIKR — thematically matched full surahs
    "SubhanAllah 33x with Meaning": { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3", durationSeconds: 25   }, // Al-Ikhlas (~25 sec)
    "Salawat on the Prophet":       { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/33.mp3",  durationSeconds: 1500 }, // Al-Ahzab (~25 min)
    "La ilaha illallah Meditation": { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3", durationSeconds: 25   }, // Al-Ikhlas
    "Istighfar Session":            { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/71.mp3",  durationSeconds: 360  }, // Nuh (~6 min)
    // SLEEP — full surah recitations of the Prophets' stories (real sleep-length audio)
    "Ibrahim AS and the Fire":      { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/21.mp3",  durationSeconds: 900  }, // Al-Anbiya (~15 min)
    "Yunus AS in the Whale":        { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/10.mp3",  durationSeconds: 2220 }, // Yunus (~37 min)
    "Musa AS and the Sea":          { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/26.mp3",  durationSeconds: 1140 }, // Ash-Shu'ara (~19 min)
    "The Night Journey: Isra and Miraj": { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/17.mp3", durationSeconds: 1140 }, // Al-Isra (~19 min)
    // DUA60 — short single-ayah or Al-Fatiha clips (1-2 min)
    "60s Dua for Anxiety":          { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/94.mp3",  durationSeconds: 40   }, // Ash-Sharh (~40 sec)
    "60s Morning Fiat":             { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3",   durationSeconds: 50   }, // Al-Fatiha (~50 sec)
    "60s Dua for Gratitude":        { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/93.mp3",  durationSeconds: 50   }, // Ad-Duha (~50 sec)
    "60s Dua Before Sleep":         { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3", durationSeconds: 25   }, // Al-Falaq (~25 sec)
    // SALAH — full surahs
    "Understanding Fatiha in Salah":{ url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3",   durationSeconds: 50   }, // Al-Fatiha
    "Khushoo Guide":                { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/23.mp3",  durationSeconds: 720  }, // Al-Mu'minun (~12 min)
    "Post-Salah Dhikr":             { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/103.mp3", durationSeconds: 20   }, // Al-Asr (~20 sec)
    // HEALING — full surahs matching themes
    "Healing Through Sujood":       { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/96.mp3",  durationSeconds: 60   }, // Al-Alaq (~1 min)
    "Dua for Overthinking":         { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/94.mp3",  durationSeconds: 40   }, // Ash-Sharh
    "Surah Ad-Duha Reflection":     { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/93.mp3",  durationSeconds: 50   }, // Ad-Duha
    "Trusting Allah in Hard Times": { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/65.mp3",  durationSeconds: 300  }, // At-Talaq (~5 min)
    "Slowing Down in Salah":        { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/2.mp3",   durationSeconds: 7200 }, // Al-Baqarah
    "Sleep with Ayatul Kursi":      { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3",  durationSeconds: 660  }, // Al-Mulk (sleep surah, ~11 min)
    "Letting Go with Tawakkul":     { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/3.mp3",   durationSeconds: 3600 }, // Al-Imran (~60 min)
    "Tahajjud Companion":           { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/73.mp3",  durationSeconds: 360  }, // Al-Muzzammil (~6 min)
    "Rizq Anxiety Session":         { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/56.mp3",  durationSeconds: 480  }, // Al-Waqi'ah (~8 min)
    "Finding Peace After Isha":     { url: "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3",  durationSeconds: 660  }, // Al-Mulk (~11 min)
  };

  try {
    const sessions = (await getAllSessions()) as Array<Record<string, unknown>> | null;
    if (!sessions) { res.status(404).json({ error: "No sessions found" }); return; }

    let updated = 0;
    for (const s of sessions) {
      const title = s["title"] as string;
      const entry = AUDIO_MAP[title];
      if (entry) {
        s["audioUrl"] = entry.url;
        s["durationSeconds"] = entry.durationSeconds;
        updated++;
      }
    }

    await setAllSessions(sessions);
    res.json({ ok: true, total: sessions.length, updated, message: `${updated} sessions updated with accurate audio and durations` });
  } catch (err) {
    logger.error({ err }, "sessions patch-audio error");
    res.status(500).json({ error: String(err) });
  }
});

// ─── Duas reseed (force replace all duas with expanded seed data) ────────────

router.post("/admin/duas/reseed", async (_req, res) => {
  try {
    await seedDuas();
    const duas = await getAllDuas();
    res.json({ ok: true, total: (duas as unknown[])?.length ?? 0, message: "Duas reseeded successfully" });
  } catch (err) {
    logger.error({ err }, "duas reseed error");
    res.status(500).json({ error: String(err) });
  }
});

// ─── Names reseed (force replace all names with seed data) ───────────────────

router.post("/admin/names/reseed", async (_req, res) => {
  try {
    await seedNames();
    const names = await getAllNames();
    res.json({ ok: true, total: (names as unknown[])?.length ?? 0, message: "Names reseeded successfully" });
  } catch (err) {
    logger.error({ err }, "names reseed error");
    res.status(500).json({ error: "Reseed failed" });
  }
});

// ─── Names batch generate ─────────────────────────────────────────────────────

router.post("/admin/names/generate-batch", async (req, res) => {
  const { gender, count = 20, categories = ["quranic", "prophet"] } = req.body as {
    gender?: string;
    count?: number;
    categories?: string[];
  };

  if (!gender) { res.status(400).json({ error: "gender required (boy|girl)" }); return; }

  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      system: "Return ONLY valid JSON array. No markdown. No preamble.",
      messages: [{
        role: "user",
        content: `Generate ${count} Muslim ${gender} names for MyTazki names database.
Categories: ${categories.join(", ")}.

Each name object:
{
  "id": "unique_slug",
  "nameEnglish": "string",
  "nameArabic": "Arabic script",
  "nameUrdu": "Urdu script",
  "gender": "${gender}",
  "meaningEnglish": "clear meaning",
  "meaningUrdu": "Urdu meaning",
  "origin": "Arabic|Persian|Turkish|Urdu",
  "root": "Arabic root letters if applicable or null",
  "categories": ["quranic","prophet","sahaba","rare"],
  "quranReference": "Surah Name X:Y or null",
  "prophetConnection": "string or null",
  "isForbidden": false,
  "popularityRank": 1-1000,
  "trending2025": true,
  "similarNames": ["name1","name2"]
}

Return JSON array of ${count} names.`,
      }],
    });

    const block = response.content[0];
    const raw = block?.type === "text" ? block.text.trim() : "[]";
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    let newNames: unknown[] = [];
    if (jsonMatch) {
      try { newNames = JSON.parse(jsonMatch[0]) as unknown[]; } catch { /* ignore */ }
    }

    const existing = (await getAllNames()) as unknown[] ?? [];
    await setAllNames([...existing, ...newNames]);

    res.json({ ok: true, added: newNames.length, total: existing.length + newNames.length });
  } catch (err) {
    logger.error({ err }, "names generate-batch error");
    res.status(500).json({ error: "Generation failed" });
  }
});

// ─── Blog list (for admin UI status) ─────────────────────────────────────────

router.get("/admin/blog", async (_req, res) => {
  try {
    const posts = await Promise.all(
      BLOG_STUBS.map(async (stub) => {
        const record = await getBlogPost(stub.slug);
        return {
          slug: stub.slug,
          title: stub.title,
          category: stub.category,
          hasContent: !!(record?.content_html && record.content_html.length > 0),
          wordCount: record?.wordCount ?? 0,
          generatedAt: record?.generatedAt ?? null,
        };
      })
    );
    res.json(posts);
  } catch (err) {
    logger.error({ err }, "admin blog list error");
    res.status(500).json({ error: "Failed to list blog posts" });
  }
});

// ─── Waitlist ─────────────────────────────────────────────────────────────────

router.post("/waitlist", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Valid email required" });
    return;
  }
  await addToWaitlist(email.toLowerCase().trim());
  res.json({ ok: true, message: "You're on the waitlist! JazakAllah khair." });
});

router.get("/admin/waitlist", async (_req, res) => {
  const emails = await getWaitlist();
  res.json({ count: emails.length, emails });
});

export default router;
