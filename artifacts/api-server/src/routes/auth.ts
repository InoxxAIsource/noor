import { Router } from "express";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import {
  getUser,
  setUser,
  getUserIdByEmail,
  setEmailIndex,
  setStreak,
} from "../lib/db.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

function stripHash(user: Record<string, unknown>) {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  const { email, name, password } = req.body as {
    email?: string;
    name?: string;
    password?: string;
  };

  if (!email || !name || !password) {
    res.status(400).json({ error: "email, name, and password are required" });
    return;
  }

  const existing = await getUserIdByEmail(email.toLowerCase());
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = nanoid();

  const user: Record<string, unknown> = {
    id: userId,
    email: email.toLowerCase(),
    name,
    passwordHash,
    madhab: null,
    sunniMadhab: "hanafi",
    language: "en",
    city: null,
    lat: null,
    lng: null,
    goals: [],
    reminderHour: 7,
    weeklyGoal: 5,
    onboardingComplete: false,
    subscriptionStatus: "free",
    createdAt: Date.now(),
    lastActive: Date.now(),
  };

  await setUser(userId, user);
  await setEmailIndex(email.toLowerCase(), userId);

  await setStreak(userId, {
    currentStreak: 0,
    longestStreak: 0,
    lastPrayerDate: null,
    weeklyGoal: 5,
    weeklyCompleted: 0,
    totalPrayers: 0,
    totalMinutes: 0,
  });

  const token = signToken({ userId });
  res.status(201).json({ token, user: stripHash(user) });
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const userId = await getUserIdByEmail(email.toLowerCase());
  if (!userId) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const user = await getUser(userId);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user["passwordHash"] as string);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  user["lastActive"] = Date.now();
  await setUser(userId, user);

  const token = signToken({ userId });
  res.json({ token, user: stripHash(user) });
});

// GET /api/auth/me
router.get("/auth/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await getUser(req.userId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(stripHash(user));
});

// PATCH /api/auth/me
router.patch("/auth/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await getUser(req.userId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const allowed = [
    "name",
    "madhab",
    "sunniMadhab",
    "language",
    "city",
    "lat",
    "lng",
    "goals",
    "reminderHour",
    "onboardingComplete",
    "weeklyGoal",
  ];

  for (const key of allowed) {
    if (key in req.body) {
      user[key] = (req.body as Record<string, unknown>)[key];
    }
  }

  user["lastActive"] = Date.now();
  await setUser(req.userId!, user);
  res.json(stripHash(user));
});

export default router;
