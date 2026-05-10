import { Router } from "express";
import { getNamesOfAllah } from "../lib/db.js";

const router = Router();

router.get("/names-of-allah", async (_req, res) => {
  const names = await getNamesOfAllah();
  if (!names) {
    res.status(500).json({ error: "Names not loaded" });
    return;
  }
  res.json(names);
});

export default router;
