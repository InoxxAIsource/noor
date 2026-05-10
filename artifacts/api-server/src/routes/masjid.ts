import { Router } from "express";
import type { Response } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { getUser, setUser, getMasjidCache, setMasjidCache } from "../lib/db.js";

const MASJID_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const router = Router();

router.get("/masjid/nearby", async (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({ error: "lat and lng required" });
    return;
  }

  const cacheKey = `${Math.round(lat * 10) / 10}:${Math.round(lng * 10) / 10}`;

  try {
    const cached = await getMasjidCache(cacheKey);
    if (cached && Date.now() - cached.cachedAt < MASJID_CACHE_TTL) {
      res.json(cached.mosques);
      return;
    }
  } catch { /* ignore cache miss */ }

  try {
    const query = `[out:json];node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lng});out;`;
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
    });
    if (!resp.ok) throw new Error("Overpass failed");
    const data = (await resp.json()) as {
      elements: Array<{ id: number; lat: number; lon: number; tags?: { name?: string; "name:en"?: string } }>;
    };

    const toRad = (d: number) => (d * Math.PI) / 180;
    const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const mosques = data.elements
      .map((el) => ({
        name: el.tags?.["name:en"] || el.tags?.name || "Masjid",
        lat: el.lat,
        lng: el.lon,
        distance: Math.round(haversine(lat, lng, el.lat, el.lon) * 10) / 10,
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20);

    await setMasjidCache(cacheKey, { mosques, cachedAt: Date.now() }).catch(() => {});
    res.json(mosques);
  } catch {
    res.json([]);
  }
});

router.get("/masjid/favourite", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await getUser(req.userId!);
  res.json((user as Record<string, unknown>)?.favouriteMasjid ?? null);
});

router.post("/masjid/favourite", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await getUser(req.userId!) as Record<string, unknown> | null;
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  user.favouriteMasjid = req.body;
  await setUser(req.userId!, user);
  res.json(req.body);
});

export default router;
