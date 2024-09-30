import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SwapWidget } from "@/widget/Widget";
import { Row } from "@/components/Layout";

createRoot(document.getElementById("root") as HTMLElement)?.render(
  <StrictMode>
    <Row gap={20}>
      <SwapWidget />
    </Row>
  </StrictMode>,
);
