"use client";
import { Button, PillButton, MainButton, Text } from "@skip-go/widget/ui";
import { ClientOnly } from "./ClientOnly";
import { ToggleThemeButton, Wrapper } from "./Wrapper";

export default function Home() {
  return (
    <ClientOnly>
      <Wrapper>
        <ToggleThemeButton />
        <Button>
          <Text>Hello world</Text>
        </Button>
        <PillButton>
          <Text>Hello world</Text>
        </PillButton>
        <MainButton label="Hello world" />
      </Wrapper>
    </ClientOnly>
  );
}
