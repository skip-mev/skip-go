import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Widget } from "@/widget/Widget";
import { Column, Row } from "@/components/Layout";
import "./global.css";
import { defaultTheme, lightTheme } from "@/widget/theme";
import { resetWidget } from "@/state/swapPage";

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
        <button onClick={() => toggleTheme()}>Toggle theme (current theme: {theme})</button>
        <button onClick={() => resetWidget()}> reset widget </button>
        <button onClick={() => resetWidget({ onlyClearInputValues: true })}>
          reset widget only clear input values
        </button>
      </Column>
      <Row
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -185px)",
          width: "100%",
        }}
        align="center"
        justify="center"
      >
        <div
          style={{
            width: "100%",
            maxWidth: 500,
            padding: "0 10px",
          }}
        >
          <Widget
            theme={{
              ...(theme === "dark" ? defaultTheme : lightTheme),
              brandTextColor: "black",
              brandColor: "#FF66FF",
            }}
            settings={{
              useUnlimitedApproval: true,
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
  </StrictMode>,
);
