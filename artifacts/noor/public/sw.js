// MyTazki Service Worker — Push Notifications + Offline Cache
const CACHE_NAME = "mytazki-v2";
const STATIC_ASSETS = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Notification type configs ─────────────────────────────────────────────────
const TYPE_CONFIG = {
  prayer: {
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    actions: [
      { action: "open", title: "Open Prayer Times" },
      { action: "dismiss", title: "Dismiss" },
    ],
  },
  dua: {
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    vibrate: [200, 100, 200],
    requireInteraction: false,
    actions: [
      { action: "open", title: "View Duas" },
      { action: "dismiss", title: "Later" },
    ],
  },
  hadith: {
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    vibrate: [100, 50, 100],
    requireInteraction: false,
    actions: [
      { action: "open", title: "Read Hadith" },
      { action: "dismiss", title: "Later" },
    ],
  },
  streak: {
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    vibrate: [200, 100, 200],
    requireInteraction: false,
    actions: [
      { action: "open", title: "Open MyTazki" },
      { action: "dismiss", title: "Dismiss" },
    ],
  },
  welcome: {
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    vibrate: [100],
    requireInteraction: false,
    actions: [],
  },
  test: {
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    vibrate: [100],
    requireInteraction: false,
    actions: [{ action: "open", title: "Open App" }],
  },
};

// ── Push handler ──────────────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = {
    title: "MyTazki",
    body: "Remember Allah. Every moment is a blessing.",
    url: "/home",
    type: "welcome",
    tag: "mytazki-default",
  };

  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {}

  const typeKey = data.type || "welcome";
  const config = TYPE_CONFIG[typeKey] || TYPE_CONFIG.welcome;

  const options = {
    body: data.body,
    icon: config.icon,
    badge: config.badge,
    vibrate: config.vibrate,
    data: { url: data.url || "/home" },
    actions: config.actions,
    requireInteraction: config.requireInteraction,
    tag: data.tag || `mytazki-${typeKey}`,
    silent: false,
    dir: "ltr",
    lang: "en",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/home";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// ── Fetch — network first, cache fallback for navigation ─────────────────────
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match("/").then((r) => r || Response.error())
    )
  );
});
