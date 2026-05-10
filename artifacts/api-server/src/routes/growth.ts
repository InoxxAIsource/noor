import { Router } from "express";
import type { Response } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { getProgress, getStreak, getSalahLogFull } from "../lib/db.js";

const router = Router();

// GET /api/growth — all dashboard data in one call
router.get("/growth", requireAuth, async (req: AuthRequest, res: Response) => {
  const [progress, streak] = await Promise.all([
    getProgress(req.userId!),
    getStreak(req.userId!),
  ]);

  // Last 7 days of salah logs
  const salahLast7: Array<{ date: string; entries: unknown[] }> = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0]!;
    const entries = await getSalahLogFull(req.userId!, dateStr);
    salahLast7.push({ date: dateStr, entries });
  }

  // Weekly report
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekProgress = progress.filter((p) => p.timestamp >= oneWeekAgo);

  const categoryCount: Record<string, number> = {};
  weekProgress.forEach((p) => {
    const cat = p.category || "Other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const topCategory =
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  const weekReport = {
    sessions: weekProgress.length,
    minutes: Math.floor(weekProgress.reduce((s, p) => s + (p.durationListened || 0), 0) / 60),
    topCategory,
    streakDays: streak?.currentStreak || 0,
  };

  res.json({
    progress,
    streak: streak || {
      currentStreak: 0,
      longestStreak: 0,
      lastPrayerDate: null,
      weeklyGoal: 5,
      weeklyCompleted: 0,
      totalPrayers: 0,
      totalMinutes: 0,
    },
    salahLast7,
    weekReport,
  });
});

export default router;
