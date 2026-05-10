import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import {
  getStreak,
  setStreak,
  getSalahLogFull,
  getStreakExtended,
  setStreakExtended,
} from "../lib/db.js";
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

function weekStart(): number {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

async function getHijriMonth(): Promise<string> {
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const resp = await fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`);
    const json = await resp.json() as Record<string, unknown>;
    const hijri = (json["data"] as Record<string, unknown>)?.["hijri"] as Record<string, unknown> | undefined;
    return (hijri?.["month"] as Record<string, string> | undefined)?.["en"] ?? "";
  } catch {
    return "";
  }
}

// GET /api/streak/me
router.get("/streak/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const today = todayStr();

  const [streak, streakExt] = await Promise.all([
    getStreak(req.userId!),
    getStreakExtended(req.userId!),
  ]);

  const base = streak ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastPrayerDate: null,
    weeklyGoal: 5,
    weeklyCompleted: 0,
    totalPrayers: 0,
    totalMinutes: 0,
  };

  if (!streak) await setStreak(req.userId!, base);

  const ext = streakExt ?? { fajrStreak: 0, ramadanStreak: 0, perfectDays: 0 };

  // Compute thisWeekPrayers from last 7 days of salah logs
  let thisWeekPrayers = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0]!;
    const entries = await getSalahLogFull(req.userId!, ds);
    thisWeekPrayers += entries.length;
  }

  res.json({ ...base, ...ext, thisWeekPrayers });
});

// POST /api/streak/checkin
router.post("/streak/checkin", requireAuth, async (req: AuthRequest, res: Response) => {
  const { minutes = 0 } = req.body as { minutes?: number };
  const today = todayStr();
  const yesterday = yesterdayStr();

  // Fetch streak and today's salah logs in parallel
  const [streak, streakExt, todayLogs, hijriMonth] = await Promise.all([
    getStreak(req.userId!),
    getStreakExtended(req.userId!),
    getSalahLogFull(req.userId!, today),
    getHijriMonth(),
  ]);

  let s = streak ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastPrayerDate: null,
    weeklyGoal: 5,
    weeklyCompleted: 0,
    totalPrayers: 0,
    totalMinutes: 0,
  };

  const ext = streakExt ?? { fajrStreak: 0, ramadanStreak: 0, perfectDays: 0 };

  const isRamadan = hijriMonth === "Ramadan";
  const hasFajr = todayLogs.some((e) => e.prayer === "Fajr");
  const hasAllPrayers = todayLogs.length >= 5;

  // Only update once per day
  if (s.lastPrayerDate !== today) {
    if (s.lastPrayerDate === yesterday) {
      s.currentStreak += 1;
    } else {
      s.currentStreak = 1;
    }

    if (s.currentStreak > s.longestStreak) {
      s.longestStreak = s.currentStreak;
    }

    s.lastPrayerDate = today;
    s.totalPrayers += 1;
    s.totalMinutes += minutes;
    s.weeklyCompleted = Math.min(s.weeklyCompleted + 1, 7);

    // Extended streak tracking
    if (isRamadan) {
      ext.ramadanStreak = (ext.ramadanStreak || 0) + 1;
    }
    if (hasFajr) {
      ext.fajrStreak = (ext.fajrStreak || 0) + 1;
    } else {
      ext.fajrStreak = 0; // Reset if Fajr missed
    }
    if (hasAllPrayers) {
      ext.perfectDays = (ext.perfectDays || 0) + 1;
    }

    await Promise.all([
      setStreak(req.userId!, s),
      setStreakExtended(req.userId!, ext),
    ]);
  }

  // Compute thisWeekPrayers
  let thisWeekPrayers = todayLogs.length;
  const since = weekStart();
  for (let i = 1; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (d.getTime() >= since) {
      const ds = d.toISOString().split("T")[0]!;
      const entries = await getSalahLogFull(req.userId!, ds);
      thisWeekPrayers += entries.length;
    }
  }

  res.json({ ...s, ...ext, thisWeekPrayers });
});

export default router;
