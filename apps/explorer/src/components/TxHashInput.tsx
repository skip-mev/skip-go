"use client";

import { Row } from "@/components/Layout";
import { SearchIcon } from "@/icons/SearchIcon";
import { styled, useTheme } from "@/styled-components";

export const TxHashInput = ({
  size = "normal",
  value,
  onChange,
  openModal,
  onSearch,
}: {
  size: "small" | "normal";
  value?: string;
  onChange?: (value: string) => void;
  openModal?: () => void;
  onSearch?: () => void;
}) => {
  const theme = useTheme();

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      openModal?.();
    } else if (event.key === "Enter") {
      onSearch?.();
    }
  };

  return (
    <InputWrapper size={size}>
      <SearchIcon color={theme.primary.text.lowContrast} />
      <StyledInput
        type="text"
        placeholder="Enter transaction hash"
        size={size}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </InputWrapper>
  );
};

export const StyledWrapper = styled(Row)<{
  size: "normal" | "small";
  isClickable?: boolean;
}>`
  cursor: ${(props) => (props.isClickable ? "pointer" : "default")};
  align-items: center;
  background-color: ${(props) => props.theme.primary.background.normal};
  gap: ${(props) => (props.size === "normal" ? "16px" : "12px")};
  height: ${(props) => (props.size === "normal" ? "64px" : "48px")};
  padding: ${(props) => (props.size === "normal" ? "0px 20px" : "0px 16px")};
  border-radius: ${(props) => (props.size === "normal" ? "20px" : "12px")};
  transition: all 0.2s ease-in-out;
  flex: 1;
  @media (max-width: 1023px) {
    flex: none;
  }
`;

const InputWrapper = styled(StyledWrapper)`
  flex: 1.8;

  @media (max-width: 1023px) {
    flex: none;
  }
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

  font-family: "ABCDiatype", sans-serif;
  font-weight: 500;
  ::placeholder {
    color: ${(props) => props.theme.primary.text.normal};
    font-weight: 500;
    font-size: ${(props) => (props.size === "normal" ? "24px" : "16px")};
  }
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

  text-overflow: ellipsis;

  transition: all 0.2s ease-in-out;
`;
