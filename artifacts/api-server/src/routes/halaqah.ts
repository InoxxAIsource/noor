import { Router } from "express";
import type { Response } from "express";
import { nanoid } from "nanoid";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { getHalaqah, setHalaqah, getUser, getProgress } from "../lib/db.js";

const router = Router();

function param(p: string | string[]): string {
  return Array.isArray(p) ? p[0]! : p;
}

interface HalaqahMember {
  userId: string;
  name: string;
  joinedAt: number;
  lastPrayedAt: string | null;
}

interface HalaqahIntention {
  id: string;
  userId: string;
  name: string;
  text: string;
  prayerCount: number;
  createdAt: number;
}

interface HalaqahData {
  code: string;
  name: string;
  adminId: string;
  inviteCode: string;
  members: HalaqahMember[];
  assignedSession: string | null;
  assignedSessionTitle: string | null;
  groupStreak: number;
  intentions: HalaqahIntention[];
  createdAt: number;
}

// POST /api/halaqah — create group
router.post("/halaqah", requireAuth, async (req: AuthRequest, res: Response) => {
  const { name } = req.body as { name: string };
  if (!name) { res.status(400).json({ error: "name required" }); return; }

  const user = await getUser(req.userId!);
  const code = nanoid(6).toUpperCase();

  const group: HalaqahData = {
    code,
    name,
    adminId: req.userId!,
    inviteCode: code,
    members: [{
      userId: req.userId!,
      name: (user?.["name"] as string) || "Member",
      joinedAt: Date.now(),
      lastPrayedAt: null,
    }],
    assignedSession: null,
    assignedSessionTitle: null,
    groupStreak: 0,
    intentions: [],
    createdAt: Date.now(),
  };

  await setHalaqah(code, group);
  res.status(201).json(group);
});

// GET /api/halaqah/:code
router.get("/halaqah/:code", async (req, res) => {
  const code = param(req.params["code"]!);
  const group = await getHalaqah(code);
  if (!group) { res.status(404).json({ error: "Group not found" }); return; }
  res.json(group);
});

// POST /api/halaqah/:code/join
router.post("/halaqah/:code/join", requireAuth, async (req: AuthRequest, res: Response) => {
  const code = param(req.params["code"]!);
  const group = await getHalaqah(code) as HalaqahData | null;
  if (!group) { res.status(404).json({ error: "Group not found" }); return; }

  const already = group.members.some((m) => m.userId === req.userId!);
  if (!already) {
    const user = await getUser(req.userId!);
    group.members.push({
      userId: req.userId!,
      name: (user?.["name"] as string) || "Member",
      joinedAt: Date.now(),
      lastPrayedAt: null,
    });
    await setHalaqah(code, group);
  }

  res.json(group);
});

// POST /api/halaqah/:code/assign — admin assigns session
router.post("/halaqah/:code/assign", requireAuth, async (req: AuthRequest, res: Response) => {
  const code = param(req.params["code"]!);
  const { sessionId, sessionTitle } = req.body as { sessionId: string; sessionTitle?: string };
  const group = await getHalaqah(code) as HalaqahData | null;
  if (!group) { res.status(404).json({ error: "Group not found" }); return; }
  if (group.adminId !== req.userId!) { res.status(403).json({ error: "Admin only" }); return; }

  group.assignedSession = sessionId;
  group.assignedSessionTitle = sessionTitle || null;
  await setHalaqah(code, group);
  res.json(group);
});

// POST /api/halaqah/:code/intention — post intention
router.post("/halaqah/:code/intention", requireAuth, async (req: AuthRequest, res: Response) => {
  const code = param(req.params["code"]!);
  const { text } = req.body as { text: string };
  if (!text) { res.status(400).json({ error: "text required" }); return; }

  const group = await getHalaqah(code) as HalaqahData | null;
  if (!group) { res.status(404).json({ error: "Group not found" }); return; }

  const member = group.members.find((m) => m.userId === req.userId!);
  if (!member) { res.status(403).json({ error: "Not a member" }); return; }

  const intention: HalaqahIntention = {
    id: nanoid(6),
    userId: req.userId!,
    name: member.name,
    text,
    prayerCount: 0,
    createdAt: Date.now(),
  };

  group.intentions.push(intention);
  await setHalaqah(code, group);
  res.status(201).json(intention);
});

// POST /api/halaqah/:code/pray
router.post("/halaqah/:code/pray", requireAuth, async (req: AuthRequest, res: Response) => {
  const code = param(req.params["code"]!);
  const { intentionId } = req.body as { intentionId: string };
  const group = await getHalaqah(code) as HalaqahData | null;
  if (!group) { res.status(404).json({ error: "Group not found" }); return; }

  const intention = group.intentions.find((i) => i.id === intentionId);
  if (!intention) { res.status(404).json({ error: "Intention not found" }); return; }

  intention.prayerCount += 1;
  await setHalaqah(code, group);
  res.json(intention);
});

// POST /api/halaqah/:code/checkin — mark member as active today
router.post("/halaqah/:code/checkin", requireAuth, async (req: AuthRequest, res: Response) => {
  const code = param(req.params["code"]!);
  const group = await getHalaqah(code) as HalaqahData | null;
  if (!group) { res.status(404).json({ error: "Group not found" }); return; }

  const today = new Date().toISOString().split("T")[0]!;
  const member = group.members.find((m) => m.userId === req.userId!);
  if (member) {
    member.lastPrayedAt = today;
    await setHalaqah(code, group);
  }
  res.json({ ok: true });
});

// GET /api/halaqah/:code/stats
router.get("/halaqah/:code/stats", requireAuth, async (req: AuthRequest, res: Response) => {
  const code = param(req.params["code"]!);
  const group = await getHalaqah(code) as HalaqahData | null;
  if (!group) { res.status(404).json({ error: "Group not found" }); return; }

  const today = new Date().toISOString().split("T")[0]!;
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const prayedToday = group.members.filter((m) => m.lastPrayedAt === today).length;

  // Get progress for admin user only (simplified — full stats would need all members)
  const progress = await getProgress(req.userId!);
  const weekSessions = progress.filter((p) => p.timestamp >= oneWeekAgo).length;

  const participationRate =
    group.members.length > 0
      ? Math.round((prayedToday / group.members.length) * 100)
      : 0;

  res.json({
    totalMembers: group.members.length,
    prayedToday,
    participationRate,
    groupStreak: group.groupStreak,
    weekSessions,
  });
});

export default router;
