import { Router } from "express";
import { getDailyNameOfAllah, getDailyHadith, getAllDuas } from "../lib/db.js";

const router = Router();

// GET /api/daily
router.get("/daily", async (req, res) => {
  const nameOfAllah = await getDailyNameOfAllah();
  const hadith = await getDailyHadith();
  const duas = await getAllDuas();

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const dua = duas && duas.length > 0 ? duas[dayOfYear % duas.length] : null;

  res.json({ nameOfAllah, hadith, dua });
});

export default router;
