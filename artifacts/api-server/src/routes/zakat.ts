import { Router } from "express";
import { getGoldPriceCache, setGoldPriceCache } from "../lib/db.js";

const router = Router();
const CACHE_TTL = 24 * 60 * 60 * 1000;
const NISAB_GOLD_GRAMS = 87.48;
const USD_TO_INR = 83;

router.get("/zakat/gold-price", async (_req, res) => {
  try {
    const cached = await getGoldPriceCache();
    if (cached && Date.now() - cached.updatedAt < CACHE_TTL) {
      res.json(cached);
      return;
    }

    const resp = await fetch("https://api.metals.live/v1/spot/gold");
    if (!resp.ok) throw new Error("metals.live unavailable");
    const data = (await resp.json()) as Array<{ gold: number }>;
    const usdPerOz = data[0]?.gold ?? 2350;
    const pricePerGram = Math.round((usdPerOz / 31.1035) * USD_TO_INR);
    const nisab = Math.round(NISAB_GOLD_GRAMS * pricePerGram);

    const result = {
      pricePerGram,
      nisab,
      currency: "INR",
      updatedAt: Date.now(),
    };
    await setGoldPriceCache(result);
    res.json(result);
  } catch {
    const cached = await getGoldPriceCache().catch(() => null);
    if (cached) { res.json(cached); return; }
    res.json({
      pricePerGram: 6500,
      nisab: 568620,
      currency: "INR",
      fallback: true,
      updatedAt: Date.now(),
    });
  }
});

export default router;
