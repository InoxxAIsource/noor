import { Router } from "express";
import { getAllNames, getNameFavs, setNameFavs } from "../lib/db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/names
router.get("/names", async (req, res) => {
  const names = await getAllNames();
  const gender = req.query["gender"] as string | undefined;
  const search = (req.query["search"] as string | undefined)?.toLowerCase();

  if (!names) {
    res.json([]);
    return;
  }

  let list = names as Array<Record<string, unknown>>;

  if (gender && gender !== "all") {
    list = list.filter((n) => n["gender"] === gender);
  }

  if (search) {
    list = list.filter(
      (n) =>
        (n["nameEnglish"] as string)?.toLowerCase().includes(search) ||
        (n["meaningEnglish"] as string)?.toLowerCase().includes(search) ||
        (n["nameArabic"] as string)?.includes(search)
    );
  }

  res.json(list);
});

// POST /api/names/:id/favorite
router.post("/names/:id/favorite", requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const favIds = await getNameFavs(req.userId!);
  const idx = favIds.indexOf(id);

  if (idx === -1) {
    favIds.push(id);
  } else {
    favIds.splice(idx, 1);
  }

  await setNameFavs(req.userId!, favIds);
  res.json({ isFavorite: idx === -1 });
});

export default router;
