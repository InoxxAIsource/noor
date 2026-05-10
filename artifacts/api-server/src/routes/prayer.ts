import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { getUser, logSalah, getSalahLog } from "../lib/db.js";
import type { Response } from "express";

const router = Router();

const PRAYER_NAMES = [
  { name: "Fajr", arabicName: "الفجر" },
  { name: "Dhuhr", arabicName: "الظهر" },
  { name: "Asr", arabicName: "العصر" },
  { name: "Maghrib", arabicName: "المغرب" },
  { name: "Isha", arabicName: "العشاء" },
];

function getMethodForMadhab(madhab: string | null | undefined, sunniMadhab: string | null | undefined): number {
  if (madhab === "shia") return 0;
  const sm = sunniMadhab ?? "hanafi";
  if (sm === "shafi") return 4;
  return 1;
}

// GET /api/prayer/times
router.get("/prayer/times", requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await getUser(req.userId!);
  const city = (req.query["city"] as string) || (user?.["city"] as string) || "London";
  const date = (req.query["date"] as string) || new Date().toISOString().split("T")[0]!;

  const method = getMethodForMadhab(
    user?.["madhab"] as string | null | undefined,
    user?.["sunniMadhab"] as string | null | undefined
  );

  try {
    const dd = date.split("-")[2]!;
    const mm = date.split("-")[1]!;
    const yyyy = date.split("-")[0]!;

    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=${method}&date=${dd}-${mm}-${yyyy}`;
    const response = await fetch(url);
    const data = await response.json() as Record<string, unknown>;

    const payload = data["data"] as Record<string, unknown> | undefined;
    const timings = (payload?.["timings"] as Record<string, string>) ?? {};
    const hijri = (payload?.["date"] as Record<string, unknown>)?.["hijri"] as Record<string, unknown> | undefined;

    const times = PRAYER_NAMES.map((p) => ({
      name: p.name,
      arabicName: p.arabicName,
      time: timings[p.name] ?? "",
    }));

    const hijriMonth = (hijri?.["month"] as Record<string, string> | undefined)?.["en"] ?? "";
    const hijriDate = hijri ? `${(hijri["day"] as string) ?? ""} ${hijriMonth} ${(hijri["year"] as string) ?? ""}` : "";

    res.json({ times, method, date, hijriDate, city });
  } catch {
    const fallbackTimes = ["05:30", "13:00", "16:30", "19:45", "21:15"];
    const times = PRAYER_NAMES.map((p, i) => ({
      name: p.name,
      arabicName: p.arabicName,
      time: fallbackTimes[i] ?? "",
    }));
    res.json({ times, method, date, hijriDate: "", city });
  }
});

// POST /api/salah/log
router.post("/salah/log", requireAuth, async (req: AuthRequest, res: Response) => {
  const { prayer, date, khushooRating, note } = req.body as {
    prayer: string;
    date: string;
    khushooRating?: number | null;
    note?: string | null;
  };

  if (!prayer || !date) {
    res.status(400).json({ error: "prayer and date are required" });
    return;
  }

  const entry = {
    prayer,
    date,
    userId: req.userId!,
    khushooRating: khushooRating ?? null,
    note: note ?? null,
    loggedAt: Date.now(),
  };

  await logSalah(req.userId!, date, entry);
  res.json(entry);
});

// GET /api/salah/log
router.get("/salah/log", requireAuth, async (req: AuthRequest, res: Response) => {
  const date = (req.query["date"] as string) || new Date().toISOString().split("T")[0]!;
  const prayers = await getSalahLog(req.userId!, date);
  res.json({ date, prayers });
});

export default router;
