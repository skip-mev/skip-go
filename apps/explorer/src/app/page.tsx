"use client";
import { Button, PillButton, MainButton, Text } from "@skip-go/widget/ui";
import { ToggleThemeButton } from "./template";

export default function Home() {
  return (
    <>
      <ToggleThemeButton />
      <Button>
        <Text>Hello world</Text>
      </Button>
      <PillButton>
        <Text>Hello world</Text>
      </PillButton>
      <MainButton label="Hello world" />
    </>
  );
}
