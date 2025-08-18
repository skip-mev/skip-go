"use client";

import { StyledWrapper } from "./TxHashInput";
import { Row } from "@/components/Layout";
import Image from "next/image";
import { Text } from "@/components/Typography";
import { styled, useTheme } from "@/styled-components";
import { TopRightArrowIcon } from "../icons/TopRightArrowIcon";
import { Chain } from "@skip-go/client";
import { ChevronIcon } from "@/icons/ChevronIcon";

export const ChainSelector = ({
  onClick,
  selectedChain,
  size = "normal",
}: {
  onClick?: () => void;
  selectedChain?: Chain | null;
  size?: "normal" | "small";
}) => {
  const theme = useTheme();
  return (
    <StyledWrapper size={size} onClick={onClick} isClickable justify="space-between">
      <Row gap={size === "normal" ? 16 : 12} align="center">
        <TopRightArrowIcon color={theme.primary.text.lowContrast} />
        {selectedChain ? (
          <StyledSelectedRow>
            <Image
              height={20}
              width={20}
              src={selectedChain.logoUri || ""}
              alt={`${selectedChain.chainId} logo`}
              style={{
                objectFit: "cover",
              }}
            />
            <StyledText size={size}>{selectedChain.prettyName}</StyledText>
          </StyledSelectedRow>
        ) : (
          <StyledText size={size} fontSize={size === "normal" ? 24 : 16 } color={theme.primary.text.lowContrast}>Select Chain</StyledText>
        )}
      </Row>
      <ChevronIcon noBackground width={18} color={theme.primary.text.lowContrast} />
    </StyledWrapper>
  );
};

const StyledText = styled(Text)<{size: "normal" | "small"}>`
  font-size: ${(props) => (props.size === "normal" ? "24px" : "16px")};
`;

const StyledSelectedRow = styled(Row)`
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  padding: 6px 7px;
  background-color: ${(props) => props.theme.secondary.background.normal};
  border-radius: 8px;
`;
