import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SwapWidget } from "@/widget/Widget";
import { Row } from "@/components/Layout";
import { lightTheme } from "@/widget/theme";

createRoot(document.getElementById("root") as HTMLElement)?.render(
  <StrictMode>
    <Row gap={20}>
      <SwapWidget />
      <SwapWidget theme={lightTheme} />
    </Row>
  </StrictMode>,
);
