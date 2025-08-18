"use client";

import { Row } from "@/components/Layout";
import { SearchIcon } from "@/icons/SearchIcon";
import { styled, useTheme } from "@/styled-components";

export const TxHashInput = ({
  size = "normal",
  value,
  onChange,
}: {
  size: "small" | "normal";
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const theme = useTheme();
  return (
    <StyledWrapper size={size}>
      <SearchIcon color={theme.primary.text.lowContrast} />
      <StyledInput
        type="text"
        placeholder="Enter transaction hash"
        size={size}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </StyledWrapper>
  );
};

export const StyledWrapper = styled(Row) <{ size: "normal" | "small", isClickable?: boolean; }>`
  cursor: ${(props) => (props.isClickable ? "pointer" : "default")};
  align-items: center;
  background-color: ${(props) => props.theme.primary.background.normal};
  gap: ${(props) => (props.size === "normal" ? "16px" : "12px")};
  height: ${(props) => (props.size === "normal" ? "64px" : "48px")};
  padding: ${(props) => (props.size === "normal" ? "0px 20px" : "0px 16px")};
  border-radius: ${(props) => (props.size === "normal" ? "20px" : "12px")};
  @media (max-width: 767px) {
    gap: 12px;
    height: 48px;
    border-radius: 16px;
  }
  transition: all 0.2s ease-in-out;
`;

const StyledInput = styled.input<{
  isLoading?: boolean;
  disabled?: boolean;
  size: "normal" | "small";
}>`
  border: none;
  outline: none;

  /* Default font sizes */
  font-size: ${(props) => (props.size === "normal" ? "24px" : "16px")};
  @media (max-width: 767px) {
    font-size: 16px;
  }

  font-weight: 400;
  letter-spacing: -0.01em;
  width: 100%;
  ${({ disabled }) => disabled && "cursor: not-allowed"};
  color: ${(props) => props.theme.primary.text.normal};
  background: ${(props) => props.theme.primary.background.normal};

  ${(props) =>
    props.isLoading &&
    `
      color: ${props.theme.primary.text.ultraLowContrast};
      animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite;
  `}
  @keyframes pulse {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.8;
    }
  }

  transition: all 0.2s ease-in-out;
`;
