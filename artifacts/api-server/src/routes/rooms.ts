import { Router } from "express";
import type { Request, Response } from "express";
import { nanoid } from "nanoid";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { getRoom, setRoom, dbListRooms, getAllSessions } from "../lib/db.js";

const router = Router();

const roomConnections: Record<string, Response[]> = {};

function broadcast(code: string, event: Record<string, unknown>) {
  const conns = roomConnections[code] ?? [];
  const data = `data: ${JSON.stringify(event)}\n\n`;
  conns.forEach((res) => {
    try { res.write(data); } catch { /* ignore disconnected */ }
  });
}

function param(p: string | string[]): string {
  return Array.isArray(p) ? p[0]! : p;
}

// POST /api/rooms
router.post("/rooms", requireAuth, async (req: AuthRequest, res: Response) => {
  const { sessionId, name } = req.body as { sessionId: string; name: string };
  if (!sessionId || !name) {
    res.status(400).json({ error: "sessionId and name required" });
    return;
  }

  const sessions = await getAllSessions();
  const session = sessions
    ? (sessions as Array<Record<string, unknown>>).find((s) => s["id"] === sessionId)
    : null;

  const code = "NOOR-" + nanoid(4).toUpperCase();
  const room = {
    code,
    name,
    sessionId,
    sessionTitle: (session as Record<string, unknown>)?.["title"] ?? "Session",
    hostId: req.userId!,
    hostName: "Host",
    participantCount: 1,
    intentions: [] as unknown[],
    createdAt: Date.now(),
    isActive: true,
  };

  await setRoom(code, room);

  const activeRooms = await dbListRooms();
  if (!activeRooms.includes(code)) {
    await setRoom("__active__", [...activeRooms, code]);
  }

  res.status(201).json(room);
});

// GET /api/rooms/active
router.get("/rooms/active", async (_req: Request, res: Response) => {
  const codes = await dbListRooms();
  const rooms = await Promise.all(codes.map((c) => getRoom(c)));
  const active = rooms.filter(
    (r): r is Record<string, unknown> =>
      r !== null && (r as Record<string, unknown>)["isActive"] === true
  );
  res.json(active);
});

// GET /api/rooms/:code
router.get("/rooms/:code", async (req: Request, res: Response) => {
  const code = param(req.params["code"]!);
  const room = await getRoom(code);
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  res.json(room);
});

// POST /api/rooms/:code/join
router.post("/rooms/:code/join", requireAuth, async (req: AuthRequest, res: Response) => {
  const code = param(req.params["code"]!);
  const room = await getRoom(code) as Record<string, unknown> | null;
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  room["participantCount"] = ((room["participantCount"] as number) || 1) + 1;
  await setRoom(code, room);
  broadcast(code, { type: "participant_joined", count: room["participantCount"] });
  res.json(room);
});

// GET /api/rooms/:code/stream — SSE
router.get("/rooms/:code/stream", async (req: Request, res: Response) => {
  const code = param(req.params["code"]!);
  const room = await getRoom(code) as Record<string, unknown> | null;
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: "connected", count: room["participantCount"], intentions: room["intentions"] })}\n\n`);

  if (!roomConnections[code]) roomConnections[code] = [];
  (roomConnections[code] as Response[]).push(res);

  const heartbeat = setInterval(() => {
    try { res.write(": ping\n\n"); } catch { clearInterval(heartbeat); }
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeat);
    roomConnections[code] = ((roomConnections[code] ?? []) as Response[]).filter((r) => r !== res);
  });
});

// POST /api/rooms/:code/start — host starts playback
router.post("/rooms/:code/start", requireAuth, async (req: AuthRequest, res: Response) => {
  const code = param(req.params["code"]!);
  const room = await getRoom(code) as Record<string, unknown> | null;
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  broadcast(code, { type: "playback_start" });
  res.json({ ok: true });
});

// POST /api/intentions
router.post("/intentions", requireAuth, async (req: AuthRequest, res: Response) => {
  const { code, text, senderName } = req.body as { code: string; text: string; senderName?: string };
  if (!code || !text) { res.status(400).json({ error: "code and text required" }); return; }

  const room = await getRoom(code) as Record<string, unknown> | null;
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const intention = {
    id: nanoid(6),
    text,
    senderName: senderName || "Anonymous",
    prayerCount: 0,
    timestamp: Date.now(),
  };

  const intentions = (room["intentions"] as unknown[]) || [];
  intentions.push(intention);
  room["intentions"] = intentions;
  await setRoom(code, room);

  broadcast(code, { type: "intention_added", intention });
  res.status(201).json(intention);
});

// POST /api/intentions/:id/pray
router.post("/intentions/:id/pray", requireAuth, async (req: AuthRequest, res: Response) => {
  const { code } = req.body as { code: string };
  if (!code) { res.status(400).json({ error: "code required" }); return; }

  const room = await getRoom(code) as Record<string, unknown> | null;
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }

  const intentions = (room["intentions"] as Array<Record<string, unknown>>) || [];
  const intention = intentions.find((i) => i["id"] === req.params["id"]);
  if (!intention) { res.status(404).json({ error: "Intention not found" }); return; }

  intention["prayerCount"] = ((intention["prayerCount"] as number) || 0) + 1;
  room["intentions"] = intentions;
  await setRoom(code, room);

  broadcast(code, { type: "intention_updated", intention });
  res.json(intention);
});

export default router;
