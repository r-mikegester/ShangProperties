import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./lib/router/routes"; // 👈 import your routing setup
import "./lib/styles/index.css";
import { Analytics } from "@vercel/analytics/react";

if (import.meta.env.PROD) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppRoutes />
      <Analytics />
    </StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppRoutes />
    </StrictMode>
  );
}
