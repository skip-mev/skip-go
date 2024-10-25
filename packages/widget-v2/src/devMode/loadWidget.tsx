import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Widget } from "@/widget/Widget";
import { Row, Column } from "@/components/Layout";

const DevMode = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  return (
    <Row gap={20}>
      <Widget theme={theme} brandColor="blue" defaultRoute={{
        "srcChainID": "akashnet-2",
        "srcAssetDenom": "ibc/E963E185E4A553A3D0A24D18144301917AD1B3457D7658076B2D46E2C682F696",
        "destChainID": "archway-1",
        "destAssetDenom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"
      }}
      />
      <Column>
        <button onClick={() => toggleTheme()}> Toggle theme (current theme: {theme})</button>
      </Column>
    </Row>
  );
};

createRoot(document.getElementById("root") as HTMLElement)?.render(
  <StrictMode>
    <DevMode />
  </StrictMode>
);
