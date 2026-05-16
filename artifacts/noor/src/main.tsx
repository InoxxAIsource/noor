import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for push notifications + offline
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + "sw.js", { scope: "/" })
      .then((reg) => {
        console.info("[SW] Registered:", reg.scope);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        // Replit's deployment proxy intercepts SW registration on hosted apps —
        // this is a platform limitation, not a bug. Log at info, not warn.
        if (msg.includes("wrsParams") || msg.includes("Rejected") || msg.includes("SecurityError")) {
          console.info("[SW] Skipped — proxy environment does not support service workers.");
        } else {
          console.warn("[SW] Registration failed:", err);
        }
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
