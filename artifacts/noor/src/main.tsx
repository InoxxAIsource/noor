import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for push notifications + offline
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + "sw.js")
      .then((reg) => {
        console.info("[SW] Registered:", reg.scope);
      })
      .catch((err) => {
        console.warn("[SW] Registration failed:", err);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
