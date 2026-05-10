import { Router } from "express";
import type { Response } from "express";
import { saveJournal, getJournals } from "../lib/db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// POST /api/journal
router.post("/journal", requireAuth, async (req: AuthRequest, res: Response) => {
  const { sessionId, sessionTitle, contentText, moodBefore, moodAfter } = req.body as {
    sessionId: string;
    sessionTitle?: string;
    contentText: string;
    moodBefore?: string;
    moodAfter?: string;
  };

  if (!contentText) {
    res.status(400).json({ error: "contentText required" });
    return;
  }

  const entry = {
    sessionId: sessionId || "",
    sessionTitle: sessionTitle || "",
    contentText,
    moodBefore: moodBefore || null,
    moodAfter: moodAfter || null,
    userId: req.userId!,
    timestamp: Date.now(),
  };

  await saveJournal(req.userId!, entry);
  res.status(201).json(entry);
});

// GET /api/journal/me
router.get("/journal/me", requireAuth, async (req: AuthRequest, res: Response) => {
  const entries = await getJournals(req.userId!);
  const sorted = (entries as Array<Record<string, unknown>>).sort(
    (a, b) => (b["timestamp"] as number) - (a["timestamp"] as number)
  );
  res.json(sorted);
});

export default router;
