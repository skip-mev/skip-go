import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ShowWidget, Widget } from "@/widget/Widget";
import { Column, Row } from "@/components/Layout";
import "./global.css";

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
    <Column align="flex-end">
      <Column gap={5} style={{ width: 200 }}>
        <ShowWidget />
        <button onClick={() => toggleTheme()}>
          Toggle theme (current theme: {theme})
        </button>
      </Column>
      <Row style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -185px)",
        width: "100%",
      }}
        align="center"
        justify="center"
      >
        <div style={{
          width: "100%",
          maxWidth: 500,
          padding: "0 10px"
        }}>
          <Widget
            theme={theme}
            settings={{
              slippage: 5,
            }}
            routeConfig={{
              goFast: true,
            }}
            connectedAddress={{
              "cosmoshub-4": "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
            }}
          />
        </div>
      </Row>
    </Column>
  );
};

createRoot(document.getElementById("root") as HTMLElement)?.render(
  <StrictMode>
    <DevMode />
  </StrictMode>
);
