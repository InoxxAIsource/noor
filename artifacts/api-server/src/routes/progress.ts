import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { logProgress, getProgress, getStreak, setStreak } from "../lib/db.js";
import type { Response } from "express";

const router = Router();

function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0]!;
}

async function doCheckin(userId: string, minutes = 0) {
  const today = todayStr();
  const yesterday = yesterdayStr();

  let streak = await getStreak(userId);
  if (!streak) {
    streak = {
      currentStreak: 0,
      longestStreak: 0,
      lastPrayerDate: null,
      weeklyGoal: 5,
      weeklyCompleted: 0,
      totalPrayers: 0,
      totalMinutes: 0,
    };
  }

  if (streak.lastPrayerDate === today) return streak;

  if (streak.lastPrayerDate === yesterday) {
    streak.currentStreak += 1;
  } else {
    streak.currentStreak = 1;
  }

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  streak.lastPrayerDate = today;
  streak.totalPrayers += 1;
  streak.totalMinutes += minutes;
  streak.weeklyCompleted = Math.min(streak.weeklyCompleted + 1, 7);

  await setStreak(userId, streak);
  return streak;
}

// POST /api/progress
router.post("/progress", requireAuth, async (req: AuthRequest, res: Response) => {
  const { sessionId, durationListened, moodBefore, moodAfter, category } = req.body as {
    sessionId: string;
    durationListened: number;
    moodBefore?: number | null;
    moodAfter?: number | null;
    category: string;
  };

  if (!sessionId || !durationListened || !category) {
    res.status(400).json({ error: "sessionId, durationListened, and category are required" });
    return;
  }

  const entry = {
    sessionId,
    durationListened,
    moodBefore: moodBefore ?? null,
    moodAfter: moodAfter ?? null,
    category,
    userId: req.userId!,
    timestamp: Date.now(),
  };

  await logProgress(req.userId!, entry);
  const streak = await doCheckin(req.userId!, Math.floor(durationListened / 60));

  res.json({ progress: entry, streak });
});

// GET /api/progress/me
router.get("/progress/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const entries = await getProgress(req.userId!);
  res.json(entries);
});

// GET /api/progress/recent — returns the single most-recent session entry
router.get("/progress/recent", requireAuth, async (req: AuthRequest, res: Response) => {
  const entries = await getProgress(req.userId!);
  const recent = entries[0] ?? null;
  res.json({ recent });
});

export default router;
