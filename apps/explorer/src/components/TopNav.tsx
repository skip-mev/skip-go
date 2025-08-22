"use client";
import React from "react";
import { Row } from "@/components/Layout";
import { Button } from "@/components/Button";
import { styled } from "@/styled-components";
import Link from "next/link";
import Image from "next/image";
import { useLocalStorage } from "@uidotdev/usehooks";
import { RightArrowIcon } from "../icons/RightArrowIcon";

export const Logo = ({ onClick }: { onClick?: () => void }) => {
  const [theme] = useLocalStorage<"dark" | "light">("explorer-theme");

  return (
    <Link
      onClick={onClick}
      href="/"
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Image
        src={theme === "dark" ? "/logo.svg" : "/logo-light.svg"}
        alt="Skip go explorer Logo"
        width={256}
        height={32}
      />
    </Link>
  );
};

export const TopRightComponent = () => {
  const [theme] = useLocalStorage<"dark" | "light">("explorer-theme");

  return (
    <TopRightContainer>
      <Row>
        <Link
          href="https://discord.gg/interchain"
          target="_blank"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <StyledPillButton onClick={() => {}} isDarkMode={theme === "dark"}>
            Need Help?
            <RightArrowIcon color={theme === "dark" ? "#000" : "#fff"} />
          </StyledPillButton>
        </Link>
      </Row>
    </TopRightContainer>
  );
};

const TopRightContainer = styled.div`
  @media (max-width: 1023px) {
    display: none;
  }
`;

const StyledPillButton = styled(Button)<{ isDarkMode?: boolean }>`
  background: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#000")};
  color: ${({ isDarkMode }) => (isDarkMode ? "#000" : "#fff")};
  font-family: "ABCDiatype", sans-serif;
  box-shadow: none;
  border: none;
  font-weight: 500;
  font-size: 16px;
  padding: 12px;
  align-items: center;
  gap: 8px;
  border-radius: 100px;

  &:hover {
    background: ${({ isDarkMode }) => (isDarkMode ? "#f0f0f0" : "#e0e0e0")};
  }
`;
