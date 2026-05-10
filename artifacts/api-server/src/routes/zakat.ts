import { Router } from "express";

const router = Router();

router.get("/zakat/gold-price", async (_req, res) => {
  try {
    const resp = await fetch("https://api.metals.live/v1/spot/gold");
    if (!resp.ok) throw new Error("metals.live unavailable");
    const data = (await resp.json()) as Array<{ gold: number }>;
    const usdPerOz = data[0]?.gold ?? 2350;
    const usdPerGram = usdPerOz / 31.1035;
    const inrPerGram = usdPerGram * 83;
    res.json({
      pricePerGramINR: Math.round(inrPerGram),
      pricePerGramUSD: Math.round(usdPerGram * 100) / 100,
      updatedAt: Date.now(),
    });
  } catch {
    res.json({
      pricePerGramINR: 6200,
      pricePerGramUSD: 74.7,
      updatedAt: Date.now(),
    });
  }
});

export default router;
