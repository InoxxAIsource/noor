import { Router } from "express";
import { getAllSessions } from "../lib/db.js";

const router = Router();

// GET /api/sessions
router.get("/sessions", async (req, res) => {
  const sessions = await getAllSessions();
  const category = req.query["category"] as string | undefined;

  if (!sessions) {
    res.json([]);
    return;
  }

  const list = sessions as Array<Record<string, unknown>>;
  if (category) {
    res.json(list.filter((s) => s["category"] === category));
    return;
  }
  res.json(list);
});

// GET /api/sessions/:id
router.get("/sessions/:id", async (req, res) => {
  const sessions = await getAllSessions();
  if (!sessions) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  const session = (sessions as Array<Record<string, unknown>>).find(
    (s) => s["id"] === req.params["id"]
  );

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json(session);
});

export default router;
