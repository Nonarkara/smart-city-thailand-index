import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App";
import "./styles.css";

const isLocalPreview = typeof window !== "undefined" && new Set(["localhost", "127.0.0.1", "0.0.0.0"]).has(window.location.hostname);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {!isLocalPreview ? <Analytics /> : null}
    {!isLocalPreview ? <SpeedInsights /> : null}
  </StrictMode>,
);
