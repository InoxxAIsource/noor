import { Router, type Request, type Response } from "express";

const router = Router();
const KEY = "c14fa12d3e0ea4c8058f828f78fe6459";

router.get("/c14fa12d3e0ea4c8058f828f78fe6459.txt", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(KEY);
});

router.get("/indexnow.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(JSON.stringify({
    host: "mytazki.com",
    key: KEY,
    keyLocation: "https://mytazki.com/c14fa12d3e0ea4c8058f828f78fe6459.txt",
  }));
});

export default router;
