import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SwapWidget } from "@/widget/Widget";

createRoot(document.getElementById("root") as HTMLElement)?.render(
  <StrictMode>
    <SwapWidget />
  </StrictMode>,
);
