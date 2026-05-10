import { Router } from "express";
import type { Response } from "express";
import { nanoid } from "nanoid";
import { getGift, setGift, getAllSessions } from "../lib/db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// POST /api/gifts
router.post("/gifts", requireAuth, async (req: AuthRequest, res: Response) => {
  const { sessionId, senderName, message } = req.body as {
    sessionId: string;
    senderName: string;
    message?: string;
  };

  if (!sessionId || !senderName) {
    res.status(400).json({ error: "sessionId and senderName required" });
    return;
  }

  const sessions = await getAllSessions();
  const session = sessions
    ? (sessions as Array<Record<string, unknown>>).find((s) => s["id"] === sessionId)
    : null;

  const token = nanoid(8);
  const gift = {
    token,
    sessionId,
    session: session ?? null,
    senderName,
    message: message || "",
    senderId: req.userId!,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  await setGift(token, gift);
  res.status(201).json({ token, url: `/gift/${token}` });
});

// GET /api/gifts/:token — public, no auth
router.get("/gifts/:token", async (req, res) => {
  const gift = await getGift(req.params["token"]!);
  if (!gift) {
    res.status(404).json({ error: "Gift not found" });
    return;
  }

  const g = gift as Record<string, unknown>;
  if (Date.now() > (g["expiresAt"] as number)) {
    res.status(404).json({ error: "This gift has expired" });
    return;
  }

  res.json(gift);
});

export default router;
