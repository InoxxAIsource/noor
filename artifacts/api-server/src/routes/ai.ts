import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import {
  getAIUsage,
  incrementAIUsage,
  getAllSessions,
  getProgress,
  getUser,
  getStreak,
} from "../lib/db.js";
import Anthropic from "@anthropic-ai/sdk";
import type { Response } from "express";

const router = Router();
const MODEL = "claude-sonnet-4-6";
const AI_DAILY_LIMIT = 20;

const anthropic = new Anthropic({
  apiKey: process.env["AI_INTEGRATIONS_ANTHROPIC_API_KEY"] ?? "",
  baseURL: process.env["AI_INTEGRATIONS_ANTHROPIC_BASE_URL"],
});

function todayStr() {
  return new Date().toISOString().split("T")[0]!;
}

async function checkLimit(userId: string): Promise<number> {
  return getAIUsage(userId, todayStr());
}

// POST /api/ai/companion — original simple companion
router.post("/ai/companion", requireAuth, async (req: AuthRequest, res: Response) => {
  const { message, context } = req.body as { message: string; context?: string | null };
  if (!message) { res.status(400).json({ error: "message is required" }); return; }

  const usage = await checkLimit(req.userId!);
  if (usage >= AI_DAILY_LIMIT) {
    res.status(429).json({ error: "Daily AI limit reached. Please try again tomorrow." });
    return;
  }

  try {
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
    if (context) {
      messages.push({ role: "user", content: context });
      messages.push({ role: "assistant", content: "JazakAllah khair for sharing that context." });
    }
    messages.push({ role: "user", content: message });

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: `You are a compassionate Islamic AI companion for MyTazki. Help Muslims with duas, Quran, fiqh, and daily spiritual practice with warmth and Islamic adab. Keep responses to 3-4 sentences. Do not reveal you are Claude.`,
      messages,
    });

    const block = response.content[0];
    const reply = block && block.type === "text" ? block.text : "Assalamu alaykum. I'm here to help.";
    await incrementAIUsage(req.userId!, todayStr());
    res.json({ reply });
  } catch (err) {
    req.log?.error({ err }, "AI companion error");
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

// POST /api/ai/director — personalized Islamic guide chat
router.post("/ai/director", requireAuth, async (req: AuthRequest, res: Response) => {
  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  const usage = await checkLimit(req.userId!);
  if (usage >= AI_DAILY_LIMIT) {
    res.status(429).json({
      error: "You have reached your daily limit. JazakAllah khair for using MyTazki — come back tomorrow!",
      remaining: 0,
    });
    return;
  }

  try {
    const [user, streak, progress] = await Promise.all([
      getUser(req.userId!),
      getStreak(req.userId!),
      getProgress(req.userId!),
    ]);

    const recentCategories = progress
      .slice(0, 5)
      .map((p) => p.category)
      .filter(Boolean);

    const u = user as Record<string, unknown>;
    const s = streak;

    const personalObs =
      recentCategories.length > 0
        ? `I see you've been focusing on ${recentCategories[0]} recently`
        : "I'm glad you're here today";

    const systemPrompt = `You are a warm, knowledgeable Islamic companion for MyTazki — "Grow Spiritually Every Day."

User: ${u?.name || "Friend"}
Tradition: ${u?.madhab || "not specified"} | Madhab: ${u?.sunniMadhab || "not specified"}
City: ${u?.city || "not specified"}
Goals: ${Array.isArray(u?.goals) ? (u.goals as string[]).join(", ") : "not specified"}
Prayer streak: ${s?.currentStreak || 0} days
Recent sessions: ${recentCategories.join(", ") || "none yet"}

Your role:
- Knowledgeable Islamic friend, NOT a mufti issuing fatwas
- Answer questions about duas, Quran, Islamic practice warmly
- Use Arabic phrases naturally (Alhamdulillah, InshaAllah, SubhanAllah)
- Keep responses to 3-4 sentences maximum
- Ask ONE follow-up question per response
- For complex fiqh: say "Please consult a qualified scholar"
- Reference only Quran and authentic hadith (Sahih Bukhari/Muslim)
- Adjust for ${u?.madhab || "general"} tradition
- Do not reveal you are Claude or an AI

Opening (first message only): "As-salamu alaykum, ${u?.name || "friend"}! Alhamdulillah — ${s?.currentStreak || 0} days of ibadah. ${personalObs}. What is on your heart today?"`;

    const apiMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: systemPrompt,
      messages: apiMessages,
    });

    const block = response.content[0];
    const reply = block && block.type === "text" ? block.text : "Assalamu alaykum. How can I help?";
    await incrementAIUsage(req.userId!, todayStr());
    const newUsage = usage + 1;

    res.json({ reply, remaining: AI_DAILY_LIMIT - newUsage });
  } catch (err) {
    req.log?.error({ err }, "AI director error");
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

// POST /api/ai/recommend — mood-based session recommendations
router.post("/ai/recommend", requireAuth, async (req: AuthRequest, res: Response) => {
  const { mood, intensity } = req.body as { mood: string; intensity: string };
  if (!mood || !intensity) {
    res.status(400).json({ error: "mood and intensity required" });
    return;
  }

  const usage = await checkLimit(req.userId!);
  if (usage >= AI_DAILY_LIMIT) {
    res.status(429).json({ error: "Daily AI limit reached." });
    return;
  }

  try {
    const [sessions, progress] = await Promise.all([
      getAllSessions(),
      getProgress(req.userId!),
    ]);

    if (!sessions) { res.json({ recommendations: [] }); return; }

    const recentTitles = progress.slice(0, 3).map((p) => p.sessionId);
    const sessionList = (sessions as Array<Record<string, unknown>>).map((s) => ({
      id: s["id"],
      title: s["title"],
      category: s["category"],
      tags: s["tags"] || [],
    }));

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: "You are MyTazki's dua recommendation engine. Return ONLY valid JSON. No markdown. No explanation.",
      messages: [
        {
          role: "user",
          content: `User feels: ${mood} at intensity: ${intensity}.
Recent sessions (avoid repeating): ${recentTitles.join(", ") || "none"}.
Pick the 3 best matching sessions from this list.
Give one warm specific reason (under 20 words) for each.
Sessions: ${JSON.stringify(sessionList)}
JSON: {"recommendations":[{"id":"...","title":"...","reason":"..."},{"id":"...","title":"...","reason":"..."},{"id":"...","title":"...","reason":"..."}]}`,
        },
      ],
    });

    const block = response.content[0];
    const text = block && block.type === "text" ? block.text.trim() : "{}";

    let parsed: { recommendations: Array<{ id: string; title: string; reason: string }> } = {
      recommendations: [],
    };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch {
      req.log?.warn("Failed to parse AI recommend response");
    }

    const enriched = parsed.recommendations
      .map((r) => {
        const session = (sessions as Array<Record<string, unknown>>).find((s) => s["id"] === r.id);
        return session ? { session, reason: r.reason } : null;
      })
      .filter(Boolean);

    await incrementAIUsage(req.userId!, todayStr());
    res.json({ recommendations: enriched });
  } catch (err) {
    req.log?.error({ err }, "AI recommend error");
    res.status(500).json({ error: "Failed to get recommendations." });
  }
});

// POST /api/ai/journal-prompt — generate 3 reflection questions
router.post("/ai/journal-prompt", requireAuth, async (req: AuthRequest, res: Response) => {
  const { sessionTitle, scriptureText, moodBefore, moodAfter, userName } = req.body as {
    sessionTitle: string;
    scriptureText?: string;
    moodBefore?: string;
    moodAfter?: string;
    userName?: string;
  };

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 200,
      system: "Return ONLY valid JSON. No markdown. No preamble.",
      messages: [
        {
          role: "user",
          content: `Generate 3 reflection questions for ${userName || "the user"} who completed '${sessionTitle}'. Scripture: '${scriptureText || ""}'. Mood shifted from ${moodBefore || "?"} to ${moodAfter || "?"}.
Q1: what they noticed or felt during the session.
Q2: how this applies to their current life situation.
Q3: one concrete intention or action for tomorrow.
Under 20 words each. Warm, personal, not generic.
JSON: {"questions":["...","...","..."]}`,
        },
      ],
    });

    const block = response.content[0];
    const text = block && block.type === "text" ? block.text.trim() : "{}";

    let questions: string[] = [];
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { questions: string[] };
        questions = parsed.questions || [];
      }
    } catch {
      questions = [
        "What did you notice about your heart during this session?",
        "How does this dua connect to something you're facing right now?",
        "What one intention will you carry forward tomorrow?",
      ];
    }

    res.json({ questions });
  } catch (err) {
    req.log?.error({ err }, "AI journal prompt error");
    res.json({
      questions: [
        "What did you notice about your heart during this session?",
        "How does this dua connect to something you're facing right now?",
        "What one intention will you carry forward tomorrow?",
      ],
    });
  }
});

export default router;
