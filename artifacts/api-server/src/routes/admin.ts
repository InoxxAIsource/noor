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
  const resolvedKeyword = targetKeyword ?? stub.title.split("—")[0]?.trim() ?? stub.title;

  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: "Return ONLY valid JSON. No markdown. No preamble.",
      messages: [{
        role: "user",
        content: `Write a blog post for DeenApp (deenapp.app), a Muslim prayer app. Tagline: "Remember Allah. Every day."

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
- End with paragraph mentioning DeenApp by name
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

// ─── Bulk session audio patch (everyayah.com + Islamic Network CDN) ──────────

router.post("/admin/sessions/patch-audio", async (_req, res) => {
  // Map each session title to a free Alafasy recitation URL
  const AUDIO_MAP: Record<string, string> = {
    // AZKAR — referenced Quran verse per session
    "Morning Azkar Full":          "https://everyayah.com/data/Alafasy_128kbps/003041.mp3", // Quran 3:41
    "Dua After Fajr":              "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3", // Al-Fatiha (morning dua)
    "Dua for Rizq":                "https://everyayah.com/data/Alafasy_128kbps/065003.mp3", // Quran 65:3
    "Ayatul Kursi Explained":      "https://everyayah.com/data/Alafasy_128kbps/002255.mp3", // Quran 2:255
    "Evening Azkar Full":          "https://everyayah.com/data/Alafasy_128kbps/033042.mp3", // Quran 33:42
    // QURAN — full surah recitations
    "Surah Fatiha Reflection":     "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3",  // Surah 1
    "Ayatul Kursi Deep Dive":      "https://everyayah.com/data/Alafasy_128kbps/002255.mp3", // Quran 2:255
    "Surah Ar-Rahman":             "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/55.mp3", // Surah 55
    "Last Three Surahs":           "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3", // Surah 112
    "Surah Al-Kahf":               "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/18.mp3",  // Surah 18
    // DHIKR — referenced verse or thematically close surah
    "SubhanAllah 33x with Meaning":"https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3", // Al-Ikhlas (Tawhid)
    "Salawat on the Prophet":      "https://everyayah.com/data/Alafasy_128kbps/033056.mp3", // Quran 33:56
    "La ilaha illallah Meditation":"https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3", // Al-Ikhlas
    "Istighfar Session":           "https://everyayah.com/data/Alafasy_128kbps/071010.mp3", // Quran 71:10
    // SLEEP — referenced story verse
    "Ibrahim AS and the Fire":     "https://everyayah.com/data/Alafasy_128kbps/021069.mp3", // Quran 21:69
    "Yunus AS in the Whale":       "https://everyayah.com/data/Alafasy_128kbps/021087.mp3", // Quran 21:87
    "Musa AS and the Sea":         "https://everyayah.com/data/Alafasy_128kbps/026063.mp3", // Quran 26:63
    "The Night Journey: Isra and Miraj": "https://everyayah.com/data/Alafasy_128kbps/017001.mp3", // Quran 17:1
    // DUA60 — referenced verse (short sessions)
    "60s Dua for Anxiety":         "https://everyayah.com/data/Alafasy_128kbps/013028.mp3", // Quran 13:28
    "60s Morning Fiat":            "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3",   // Al-Fatiha
    "60s Dua for Gratitude":       "https://everyayah.com/data/Alafasy_128kbps/014007.mp3", // Quran 14:7
    "60s Dua Before Sleep":        "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3", // Al-Falaq (protection)
    // SALAH — referenced verse
    "Understanding Fatiha in Salah": "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3", // Al-Fatiha
    "Khushoo Guide":               "https://everyayah.com/data/Alafasy_128kbps/023002.mp3", // Quran 23:2
    "Post-Salah Dhikr":            "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/103.mp3", // Al-Asr
  };

  try {
    const sessions = (await getAllSessions()) as Array<Record<string, unknown>> | null;
    if (!sessions) { res.status(404).json({ error: "No sessions found" }); return; }

    let updated = 0;
    for (const s of sessions) {
      const title = s["title"] as string;
      const url = AUDIO_MAP[title];
      if (url) { s["audioUrl"] = url; updated++; }
    }

    await setAllSessions(sessions);
    res.json({ ok: true, total: sessions.length, updated, message: `${updated} sessions now have Alafasy audio` });
  } catch (err) {
    logger.error({ err }, "sessions patch-audio error");
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
        content: `Generate ${count} Muslim ${gender} names for DeenApp names database.
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
