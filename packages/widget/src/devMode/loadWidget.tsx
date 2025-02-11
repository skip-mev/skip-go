import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ShowWidget, Widget } from "@/widget/Widget";
import { Column, Row } from "@/components/Layout";
import "./global.css";
import { defaultTheme, lightTheme } from "@/widget/theme";

const DevMode = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  useEffect(() => {
    const loadRemoteDebuggingScript = () => {
      const ipAddress = window.location.hostname;
      // assume local ip addresses start with 192*
      if (!ipAddress.startsWith("192")) return;

      // port is arbitrary but it's easier to have it auto set
      const scriptSrc = `http://${ipAddress}:1234/target.js`;

      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => {
        console.log("Script loaded successfully");
      };
      script.onerror = (error) => {
        console.log(error);
        console.error("Error loading the script");
      };

      document.head.appendChild(script);
    };
    loadRemoteDebuggingScript();
  }, []);

  return (
    <Column align="flex-end">
      <Column gap={5} style={{ width: 200 }}>
        <ShowWidget />
        <button onClick={() => toggleTheme()}>Toggle theme (current theme: {theme})</button>
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
