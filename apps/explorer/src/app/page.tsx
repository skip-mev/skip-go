"use client";
import { ToggleThemeButton } from "./template";
import { Button, GhostButton } from '@/components/Button';
import { MainButton } from '@/components/MainButton';
import { Text, SmallText } from '@/components/Typography';

export default function Home() {
  return (
    <>
      <ToggleThemeButton />
      <Button>
        <Text>Hello world</Text>
      </Button>
      <GhostButton onClick={() => console.log("clicked")}>
        Hello world
      </GhostButton>
      <MainButton label="Hello world" />
    </>
  );
}
