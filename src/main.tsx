import React from "react";
import ReactDOM from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App";
import "./index.css";

console.log("main.tsx: Starting render...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("main.tsx: Root element not found!");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
        <SpeedInsights />
      </React.StrictMode>
    );
    console.log("main.tsx: Render called.");
  } catch (err) {
    console.error("main.tsx: Render failed!", err);
  }
}
