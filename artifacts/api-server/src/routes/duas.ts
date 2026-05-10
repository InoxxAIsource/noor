import { Router } from "express";
import { getAllDuas, getDuaFavs, setDuaFavs } from "../lib/db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/duas
router.get("/duas", requireAuth, async (req: AuthRequest, res: Response) => {
  const duas = await getAllDuas();
  const favIds = await getDuaFavs(req.userId!);
  const category = req.query["category"] as string | undefined;

  if (!duas) {
    res.json([]);
    return;
  }

  let list: Array<Record<string, unknown>> = (duas as Array<Record<string, unknown>>).map((d) => ({
    ...d,
    isFavorite: favIds.includes(d["id"] as string),
  }));

  if (category) {
    list = list.filter((d) => (d["category"] as string) === category);
  }

  res.json(list);
});

// POST /api/duas/:id/favorite
router.post("/duas/:id/favorite", requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const favIds = await getDuaFavs(req.userId!);
  const idx = favIds.indexOf(id);

  if (idx === -1) {
    favIds.push(id);
  } else {
    favIds.splice(idx, 1);
  }

  await setDuaFavs(req.userId!, favIds);
  res.json({ isFavorite: idx === -1 });
});

export default router;
