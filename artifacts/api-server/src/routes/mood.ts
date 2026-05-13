import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import {
  getMoodCheckin,
  setMoodCheckin,
  getMoodHistory,
  getMorningStatus,
  setMorningComplete,
  getMorningStreak,
  incrementMorningStreak,
  getAIUsage,
  incrementAIUsage,
} from "../lib/db.js";
import Anthropic from "@anthropic-ai/sdk";
import type { Response } from "express";

const router = Router();
const AI_DAILY_LIMIT = 20;

const anthropic = new Anthropic({
  apiKey: process.env["AI_INTEGRATIONS_ANTHROPIC_API_KEY"] ?? "",
  baseURL: process.env["AI_INTEGRATIONS_ANTHROPIC_BASE_URL"],
});

function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

function getFallbackReflection(emotion: string): string {
  const reflections: Record<string, string> = {
    peaceful: "Alhamdulillah for this peace in your heart. Allah says: 'Verily, in the remembrance of Allah do hearts find rest.' Let this stillness carry you gently through your day.",
    anxious: "Allah is closer to you than your jugular vein. Your worry is a sign of your heart's awareness — bring it to Him in dua, and feel His presence wrap around you like a quiet shelter.",
    distracted: "The Prophet ﷺ said: 'Tie your camel, then put your trust in Allah.' Take one slow breath, return to this moment, and begin again with Bismillah.",
    grateful: "Gratitude multiplies blessings — this is Allah's promise. Your grateful heart is already an act of worship today. Let it overflow into your actions and words.",
    overwhelmed: "You are not alone in this. Allah does not burden a soul beyond what it can bear. Begin with just one small step — that is enough for now.",
    tired: "Rest is sunnah too. The Prophet ﷺ cared for his body as a trust from Allah. Be gentle with yourself today — even a quiet heart turned toward Allah is a form of worship.",
  };
  return reflections[emotion] ?? "Turn your heart gently toward Allah. In every state, He is near — and beginning your day with His remembrance is itself a beautiful act of ibadah.";
}

// GET /api/mood/today
router.get("/mood/today", requireAuth, async (req: AuthRequest, res: Response) => {
  const today = todayStr();
  const [mood, completedMorning, morningStreak] = await Promise.all([
    getMoodCheckin(req.userId!, today),
    getMorningStatus(req.userId!, today),
    getMorningStreak(req.userId!),
  ]);
  res.json({
    emotion: mood?.emotion ?? null,
    completedMorning,
    morningStreak,
  });
});

// GET /api/mood/history — last 7 days of emotional check-ins + a personalized insight string
router.get("/mood/history", requireAuth, async (req: AuthRequest, res: Response) => {
  const history = await getMoodHistory(req.userId!, 7);

  let insight: string | null = null;
  if (history.length >= 2) {
    const counts: Record<string, number> = {};
    for (const h of history) counts[h.emotion] = (counts[h.emotion] ?? 0) + 1;
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const insightMap: Record<string, string> = {
      peaceful:    "You've been finding moments of peace recently.",
      anxious:     "You've been navigating some challenges lately.",
      grateful:    "Your heart has been full of gratitude.",
      overwhelmed: "You've been carrying a lot recently.",
      lonely:      "You've been on a journey of seeking connection.",
      frustrated:  "You've been working through some difficulties.",
      grieving:    "You've been walking through a tender time.",
      joyful:      "You've been carrying joy in your heart.",
    };
    if (dominant) insight = insightMap[dominant] ?? null;
  }

  res.json({ history, insight });
});

// POST /api/mood/checkin
router.post("/mood/checkin", requireAuth, async (req: AuthRequest, res: Response) => {
  const { emotion } = req.body as { emotion?: string };
  if (!emotion) { res.status(400).json({ error: "emotion required" }); return; }
  const today = todayStr();
  await setMoodCheckin(req.userId!, today, { emotion, recordedAt: new Date().toISOString() });
  res.json({ ok: true, emotion });
});

// POST /api/morning/complete
router.post("/morning/complete", requireAuth, async (req: AuthRequest, res: Response) => {
  const today = todayStr();
  const alreadyDone = await getMorningStatus(req.userId!, today);
  let morningStreak = await getMorningStreak(req.userId!);
  if (!alreadyDone) {
    await setMorningComplete(req.userId!, today);
    morningStreak = await incrementMorningStreak(req.userId!);
  }
  res.json({ ok: true, morningStreak });
});

// POST /api/mood/reflect — AI reflection based on emotion
router.post("/mood/reflect", requireAuth, async (req: AuthRequest, res: Response) => {
  const { emotion } = req.body as { emotion?: string };
  if (!emotion) { res.status(400).json({ error: "emotion required" }); return; }

  const today = todayStr();
  const usage = await getAIUsage(req.userId!, today);
  if (usage >= AI_DAILY_LIMIT) {
    res.json({ reflection: getFallbackReflection(emotion) });
    return;
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 180,
      system: `You are a gentle, emotionally warm Islamic wellness companion. Your role is to offer calming, spiritually grounded reflections to Muslims starting their day.

Write exactly 2-3 sentences. Be warm, supportive, and hopeful.
Naturally weave in relevant Quranic wisdom or the Prophet's ﷺ guidance.
Never lecture or be preachy. Write as a caring, trusted friend.
Do not begin with "I" or greet the user. Go straight into the reflection.`,
      messages: [{
        role: "user",
        content: `The user is feeling "${emotion}" this morning. Offer them a short, calming Islamic reflection to gently ground them.`,
      }],
    });

    await incrementAIUsage(req.userId!, today);
    const text = response.content[0]?.type === "text"
      ? response.content[0].text
      : getFallbackReflection(emotion);
    res.json({ reflection: text });
  } catch {
    res.json({ reflection: getFallbackReflection(emotion) });
  }
});

export default router;
