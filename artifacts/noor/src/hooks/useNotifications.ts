import { useState, useEffect, useCallback } from "react";

export type NotificationPermission = "default" | "granted" | "denied";

export interface NotificationPrefs {
  notifyPrayer: boolean;
  notifyDua: boolean;
  notifyHadith: boolean;
  notifyStreak: boolean;
}

export interface UseNotificationsReturn {
  supported: boolean;
  permission: NotificationPermission;
  subscribed: boolean;
  loading: boolean;
  prefs: NotificationPrefs;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<void>;
  updatePrefs: (prefs: Partial<NotificationPrefs>) => Promise<void>;
  sendTest: () => Promise<void>;
}

const DEFAULT_PREFS: NotificationPrefs = {
  notifyPrayer: true,
  notifyDua: true,
  notifyHadith: true,
  notifyStreak: true,
};

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("tazki_token") : null;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

async function getVapidPublicKey(): Promise<string> {
  const resp = await fetch("/api/notifications/vapid-public-key");
  const data = await resp.json() as { publicKey: string };
  return data.publicKey;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

export function useNotifications(): UseNotificationsReturn {
  const supported =
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? (Notification.permission as NotificationPermission) : "denied"
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  // Check subscription status on mount
  useEffect(() => {
    const token = getToken();
    if (!supported || !token) return;

    fetch("/api/notifications/status", { headers: authHeaders() })
      .then(r => r.json())
      .then((data: { subscribed: boolean } & NotificationPrefs) => {
        setSubscribed(data.subscribed);
        setPrefs({
          notifyPrayer: data.notifyPrayer,
          notifyDua: data.notifyDua,
          notifyHadith: data.notifyHadith,
          notifyStreak: data.notifyStreak,
        });
      })
      .catch(() => null);
  }, [supported]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!supported) return false;
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm as NotificationPermission);
      if (perm !== "granted") { setLoading(false); return false; }

      const reg = await navigator.serviceWorker.ready;
      const publicKey = await getVapidPublicKey();
      const keyBytes = urlBase64ToUint8Array(publicKey);
      const appKey = keyBytes.buffer.slice(keyBytes.byteOffset, keyBytes.byteOffset + keyBytes.byteLength) as ArrayBuffer;
      const pushSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appKey,
      });

      const subJson = pushSub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ subscription: subJson, ...prefs }),
      });

      setSubscribed(true);
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  }, [supported, prefs]);

  const unsubscribe = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        const pushSub = await reg.pushManager.getSubscription();
        if (pushSub) await pushSub.unsubscribe();
      }
      await fetch("/api/notifications/subscribe", {
        method: "DELETE",
        headers: authHeaders(),
      });
      setSubscribed(false);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const updatePrefs = useCallback(async (newPrefs: Partial<NotificationPrefs>): Promise<void> => {
    const merged = { ...prefs, ...newPrefs };
    setPrefs(merged);
    await fetch("/api/notifications/preferences", {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(merged),
    }).catch(() => null);
  }, [prefs]);

  const sendTest = useCallback(async (): Promise<void> => {
    await fetch("/api/notifications/test", {
      method: "POST",
      headers: authHeaders(),
    }).catch(() => null);
  }, []);

  return { supported, permission, subscribed, loading, prefs, subscribe, unsubscribe, updatePrefs, sendTest };
}
