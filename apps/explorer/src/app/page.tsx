"use client";
import { ToggleThemeButton } from "./template";
import { Button, PillButton } from '@/components/Button';
import { MainButton } from '@/components/MainButton';
import { Text } from '@/components/Typography';

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
