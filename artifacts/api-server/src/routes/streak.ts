import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { getStreak, setStreak } from "../lib/db.js";
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

// GET /api/streak/me
router.get("/streak/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const streak = await getStreak(req.userId!);
  if (!streak) {
    const fresh = {
      currentStreak: 0,
      longestStreak: 0,
      lastPrayerDate: null,
      weeklyGoal: 5,
      weeklyCompleted: 0,
      totalPrayers: 0,
      totalMinutes: 0,
    };
    await setStreak(req.userId!, fresh);
    res.json(fresh);
    return;
  }
  res.json(streak);
});

// POST /api/streak/checkin
router.post("/streak/checkin", requireAuth, async (req: AuthRequest, res: Response) => {
  const { minutes = 0 } = req.body as { minutes?: number };
  const today = todayStr();
  const yesterday = yesterdayStr();

  let streak = await getStreak(req.userId!);
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

  if (streak.lastPrayerDate === today) {
    res.json(streak);
    return;
  }

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

  await setStreak(req.userId!, streak);
  res.json(streak);
});

export default router;
