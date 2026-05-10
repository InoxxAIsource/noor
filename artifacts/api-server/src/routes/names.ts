import { Router } from "express";
import { getAllNames, getNameFavs, setNameFavs } from "../lib/db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";

const router = Router();

// GET /api/names/trending — must come before /names/:id
router.get("/names/trending", async (_req, res) => {
  const names = await getAllNames();
  if (!names) { res.json([]); return; }
  const list = (names as Array<Record<string, unknown>>).filter((n) => n["trending2025"] === true);
  res.json(list);
});

// GET /api/names/favourites (auth)
router.get("/names/favourites", requireAuth, async (req: AuthRequest, res: Response) => {
  const names = await getAllNames();
  const favIds = await getNameFavs(req.userId!);
  if (!names || favIds.length === 0) { res.json([]); return; }
  const list = (names as Array<Record<string, unknown>>).filter((n) => favIds.includes(n["id"] as string));
  res.json(list);
});

// GET /api/names/:id
router.get("/names/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  if (id === "favourites" || id === "trending") { res.json([]); return; }
  const names = await getAllNames();
  if (!names) { res.status(404).json({ error: "Not found" }); return; }
  const name = (names as Array<Record<string, unknown>>).find((n) => n["id"] === id);
  if (!name) { res.status(404).json({ error: "Not found" }); return; }
  res.json(name);
});

// GET /api/names — returns flat array, with optional filtering
router.get("/names", async (req, res) => {
  const names = await getAllNames();
  if (!names) { res.json([]); return; }

  const gender = req.query["gender"] as string | undefined;
  const search = (req.query["search"] as string | undefined)?.toLowerCase();
  const category = req.query["category"] as string | undefined;
  const letter = (req.query["letter"] as string | undefined)?.toUpperCase();

  let list = names as Array<Record<string, unknown>>;

  if (gender && gender !== "all") {
    list = list.filter((n) => n["gender"] === gender);
  }

  if (category && category !== "All") {
    if (category === "Trending") {
      list = list.filter((n) => n["trending2025"] === true);
    } else if (category === "Forbidden") {
      list = list.filter((n) => n["isForbidden"] === true);
    } else {
      list = list.filter((n) =>
        Array.isArray(n["categories"]) &&
        (n["categories"] as string[]).some(
          (c) => c.toLowerCase() === category.toLowerCase()
        )
      );
    }
  }

  if (letter) {
    list = list.filter((n) =>
      (n["nameEnglish"] as string)?.toUpperCase().startsWith(letter)
    );
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

// POST /api/names/:id/favourite (auth)
router.post("/names/:id/favourite", requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const favIds = await getNameFavs(req.userId!);
  const idx = favIds.indexOf(id);
  if (idx === -1) favIds.push(id);
  else favIds.splice(idx, 1);
  await setNameFavs(req.userId!, favIds);
  res.json({ isFavorite: idx === -1 });
});

// Backward-compat: old favorite route
router.post("/names/:id/favorite", requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const favIds = await getNameFavs(req.userId!);
  const idx = favIds.indexOf(id);
  if (idx === -1) favIds.push(id);
  else favIds.splice(idx, 1);
  await setNameFavs(req.userId!, favIds);
  res.json({ isFavorite: idx === -1 });
});

export default router;
