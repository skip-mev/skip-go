import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Widget } from "@/widget/Widget";
import { Row, Column } from "@/components/Layout";
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
  return (
    <Row gap={20}>
      <Widget theme={theme === "dark" ? defaultTheme : lightTheme} />
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
