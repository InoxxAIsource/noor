import { Router } from "express";
import webpush from "web-push";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import {
  savePushSubscription,
  getPushSubscription,
  deletePushSubscription,
  getAllPushSubscriptions,
  getUser,
  type PushSubscriptionRecord,
} from "../lib/db.js";
import type { Response } from "express";

const router = Router();

// Configure VAPID
const VAPID_PUBLIC_KEY = process.env["VAPID_PUBLIC_KEY"] ?? "";
const VAPID_PRIVATE_KEY = process.env["VAPID_PRIVATE_KEY"] ?? "";
const VAPID_EMAIL = process.env["VAPID_EMAIL"] ?? "mailto:hello@mytazki.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// ── POST /api/notifications/subscribe ─────────────────────────────────────────
router.post("/notifications/subscribe", requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { subscription, notifyPrayer = true, notifyDua = true, notifyHadith = true, notifyStreak = true } = req.body as {
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
    notifyPrayer?: boolean;
    notifyDua?: boolean;
    notifyHadith?: boolean;
    notifyStreak?: boolean;
  };

  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    res.status(400).json({ error: "Invalid push subscription" });
    return;
  }

  const user = await getUser(userId);
  const city = (user?.["city"] as string) || "London";
  const madhab = (user?.["madhab"] as string) || "hanafi";

  const record: PushSubscriptionRecord = {
    endpoint: subscription.endpoint,
    keys: subscription.keys,
    userId,
    city,
    madhab,
    notifyPrayer,
    notifyDua,
    notifyHadith,
    notifyStreak,
    createdAt: Date.now(),
  };

  await savePushSubscription(userId, record);

  // Send a welcome notification
  try {
    await webpush.sendNotification(
      { endpoint: subscription.endpoint, keys: subscription.keys },
      JSON.stringify({
        title: "MyTazki Notifications On",
        body: "You will be reminded for prayer times, daily duas, and more. Barakallahu feekum.",
        url: "/home",
        icon: "/favicon.svg",
        tag: "welcome",
      })
    );
  } catch {
    // Welcome notification failure is non-blocking
  }

  res.json({ ok: true, message: "Subscribed to push notifications" });
});

// ── DELETE /api/notifications/subscribe ───────────────────────────────────────
router.delete("/notifications/subscribe", requireAuth, async (req: AuthRequest, res: Response) => {
  await deletePushSubscription(req.userId!);
  res.json({ ok: true });
});

// ── GET /api/notifications/status ─────────────────────────────────────────────
router.get("/notifications/status", requireAuth, async (req: AuthRequest, res: Response) => {
  const sub = await getPushSubscription(req.userId!);
  res.json({
    subscribed: !!sub,
    notifyPrayer: sub?.notifyPrayer ?? true,
    notifyDua: sub?.notifyDua ?? true,
    notifyHadith: sub?.notifyHadith ?? true,
    notifyStreak: sub?.notifyStreak ?? true,
  });
});

// ── PATCH /api/notifications/preferences ──────────────────────────────────────
router.patch("/notifications/preferences", requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const sub = await getPushSubscription(userId);
  if (!sub) { res.status(404).json({ error: "Not subscribed" }); return; }
  const { notifyPrayer, notifyDua, notifyHadith, notifyStreak } = req.body as Partial<PushSubscriptionRecord>;
  await savePushSubscription(userId, {
    ...sub,
    notifyPrayer: notifyPrayer ?? sub.notifyPrayer,
    notifyDua: notifyDua ?? sub.notifyDua,
    notifyHadith: notifyHadith ?? sub.notifyHadith,
    notifyStreak: notifyStreak ?? sub.notifyStreak,
  });
  res.json({ ok: true });
});

// ── POST /api/notifications/test ──────────────────────────────────────────────
router.post("/notifications/test", requireAuth, async (req: AuthRequest, res: Response) => {
  const sub = await getPushSubscription(req.userId!);
  if (!sub) { res.status(404).json({ error: "Not subscribed" }); return; }
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: sub.keys },
      JSON.stringify({
        title: "Test — MyTazki",
        body: "Your push notifications are working. As-salamu alaykum!",
        url: "/home",
        tag: "test",
        type: "test",
      })
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send notification", detail: String(err) });
  }
});

// ── Internal helper: send push to a single subscription ───────────────────────
async function sendPush(sub: PushSubscriptionRecord, payload: object): Promise<boolean> {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: sub.keys },
      JSON.stringify(payload)
    );
    return true;
  } catch {
    return false;
  }
}

// ── Prayer-time notification scheduler ────────────────────────────────────────
// Runs every 60 seconds. Sends notifications ~5 min before each prayer.

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const ARABIC: Record<string, string> = {
  Fajr: "الفجر", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء",
};
const PRAYER_DUA: Record<string, string> = {
  Fajr: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban",
  Dhuhr: "Hayya 'ala-s-Salah, hayya 'ala-l-Falah",
  Asr: "Guard strictly the prayers, especially the middle prayer",
  Maghrib: "Allahuma laka sumna wa 'ala rizqika aftarna",
  Isha: "Whoever prays Isha in congregation has stood half the night in prayer",
};

const DAILY_DUA_TIMES = ["06:00", "12:30", "18:00"]; // morning, midday, evening reminders
const DAILY_HADITH_TIME = "08:00";
const STREAK_REMINDER_TIME = "21:00";

const sentToday = new Set<string>(); // key = `${userId}:${type}` — reset at midnight

// Reset sent set at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) sentToday.clear();
}, 60_000);

async function fetchPrayerTimesForCity(city: string, madhab: string): Promise<Record<string, string> | null> {
  try {
    const method = madhab === "shia" ? 0 : 1;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=${method}&date=${dd}-${mm}-${yyyy}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json() as { data?: { timings?: Record<string, string> } };
    const timings = data?.data?.timings;
    if (!timings) return null;
    const result: Record<string, string> = {};
    for (const p of PRAYERS) {
      const raw = timings[p];
      if (raw) result[p] = raw.slice(0, 5);
    }
    return result;
  } catch {
    return null;
  }
}

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number) as [number, number];
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

// City cache to avoid hammering aladhan.com
const cityCache = new Map<string, { timings: Record<string, string>; date: string }>();

async function getTimingsForCity(city: string, madhab: string): Promise<Record<string, string> | null> {
  const dateKey = new Date().toISOString().split("T")[0]!;
  const cacheKey = `${city}:${madhab}`;
  const cached = cityCache.get(cacheKey);
  if (cached && cached.date === dateKey) return cached.timings;
  const timings = await fetchPrayerTimesForCity(city, madhab);
  if (timings) cityCache.set(cacheKey, { timings, date: dateKey });
  return timings;
}

export async function runNotificationScheduler(): Promise<void> {
  setInterval(async () => {
    try {
      const allSubs = await getAllPushSubscriptions();
      if (allSubs.length === 0) return;

      const nowStr = nowHHMM();
      const dateKey = new Date().toISOString().split("T")[0]!;

      for (const sub of allSubs) {
        // ── Prayer reminders (5 min before each prayer) ────────────────────
        if (sub.notifyPrayer) {
          const timings = await getTimingsForCity(sub.city, sub.madhab ?? "hanafi");
          if (timings) {
            for (const prayer of PRAYERS) {
              const prayerTime = timings[prayer];
              if (!prayerTime) continue;
              const remind = addMinutes(prayerTime, -5);
              const sentKey = `${sub.userId}:prayer:${prayer}:${dateKey}`;
              if (nowStr === remind && !sentToday.has(sentKey)) {
                sentToday.add(sentKey);
                await sendPush(sub, {
                  title: `${prayer} in 5 minutes`,
                  body: `${ARABIC[prayer]} · ${prayerTime}. ${PRAYER_DUA[prayer] ?? "Time to prepare for salah."}`,
                  url: "/prayer-times",
                  tag: `prayer-${prayer}`,
                  type: "prayer",
                  icon: "/favicon.svg",
                  badge: "/favicon.svg",
                });
              }
            }
          }
        }

        // ── Daily Dua reminders ────────────────────────────────────────────
        if (sub.notifyDua) {
          const DUA_MESSAGES = [
            { title: "Morning Dua", body: "Allahumma bika asbahna wa bika amsayna. Good morning!", url: "/duas" },
            { title: "Midday Reminder", body: "Take a moment to make dua. Allah is always listening.", url: "/duas" },
            { title: "Evening Dua", body: "Allahumma bika amsayna wa bika asbahna. Reflect on your day.", url: "/duas" },
          ];
          DAILY_DUA_TIMES.forEach((time, idx) => {
            const sentKey = `${sub.userId}:dua:${idx}:${dateKey}`;
            if (nowStr === time && !sentToday.has(sentKey)) {
              sentToday.add(sentKey);
              const msg = DUA_MESSAGES[idx]!;
              void sendPush(sub, { ...msg, tag: `dua-${idx}`, type: "dua", icon: "/favicon.svg" });
            }
          });
        }

        // ── Daily Hadith ───────────────────────────────────────────────────
        if (sub.notifyHadith) {
          const sentKey = `${sub.userId}:hadith:${dateKey}`;
          if (nowStr === DAILY_HADITH_TIME && !sentToday.has(sentKey)) {
            sentToday.add(sentKey);
            await sendPush(sub, {
              title: "Hadith of the Day",
              body: "Your daily hadith is ready. A moment of wisdom awaits you.",
              url: "/home",
              tag: "hadith-daily",
              type: "hadith",
              icon: "/favicon.svg",
            });
          }
        }

        // ── Streak reminder ────────────────────────────────────────────────
        if (sub.notifyStreak) {
          const sentKey = `${sub.userId}:streak:${dateKey}`;
          if (nowStr === STREAK_REMINDER_TIME && !sentToday.has(sentKey)) {
            sentToday.add(sentKey);
            await sendPush(sub, {
              title: "Keep your streak alive",
              body: "Don't break your streak today. Complete your prayer or dhikr session.",
              url: "/home",
              tag: "streak-reminder",
              type: "streak",
              icon: "/favicon.svg",
            });
          }
        }
      }
    } catch {
      // scheduler errors are non-fatal
    }
  }, 60_000);
}

// ── GET /api/notifications/vapid-public-key ────────────────────────────────────
router.get("/notifications/vapid-public-key", (_req, res: Response) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

export default router;
