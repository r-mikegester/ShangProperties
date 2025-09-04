import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./router/routes"; // 👈 import your routing setup
import "./assets/styles/index.css";
import { Analytics } from "@vercel/analytics/react";
import { NotificationProvider } from "./context/NotificationContext";
import { SpeedInsights } from "@vercel/speed-insights/react"

if (import.meta.env.PROD) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <NotificationProvider>
        <AppRoutes />
        <Analytics />
        <SpeedInsights />
      </NotificationProvider>
    </StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </StrictMode>
  );
}
