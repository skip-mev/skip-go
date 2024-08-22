import { useAtom } from "jotai";
import { Row } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { getChain, skipAssets } from "@/state/skipClient";
import { getFormattedAssetAmount } from "@/utils/crypto";
import { css, styled, useTheme } from "styled-components";
import React from "react";
import { ChainIcon } from "@/icons/ChainIcon";
import { Button } from "@/components/Button";
import { ChainTransaction } from "@skip-go/client";

type OperationType =
  | "swap"
  | "evmSwap"
  | "transfer"
  | "axelarTransfer"
  | "cctpTransfer"
  | "hyperlaneTransfer"
  | "opInitTransfer"
  | "bankSend";

export type Operation = {
  type: OperationType;
  chainID: string;
  fromChainID?: string;
  toChainID?: string;
  denom?: string;
  denomIn?: string;
  denomOut: string;
  txIndex: number;
  amountIn: string;
  amountOut: string;
  bridgeID?: string;
  swapVenues?: {
    name: "";
    chainID: "";
  }[];
};

export type txState = "pending" | "broadcasted" | "confirmed" | "failed";

export type SwapExecutionPageRouteDetailedRowProps = {
  denom: Operation["denomIn"] | Operation["denomOut"];
  amount: Operation["amountIn"] | Operation["amountOut"];
  chainID: Operation["fromChainID"] | Operation["chainID"];
  explorerLink?: ChainTransaction["explorerLink"];
  txState?: txState;
};

export const SwapExecutionPageRouteDetailedRow = ({
  denom,
  amount,
  chainID,
  txState,
  explorerLink,
  ...props
}: SwapExecutionPageRouteDetailedRowProps) => {
  const theme = useTheme();
  const [{ data: assets }] = useAtom(skipAssets);

  const asset = assets?.find((asset) => asset.denom === denom);

  const chain = getChain(chainID ?? "");
  const chainImage = chain.images?.find((image) => image.svg ?? image.png);

  return (
    <Row gap={15} align="center" {...props}>
      {chainImage && (
        <StyledAnimatedBorder
          width={30}
          height={30}
          backgroundColor={theme.success.text}
          txState={txState}
        >
          <StyledChainImage
            height={30}
            width={30}
            src={chainImage.svg ?? chainImage.png}
            state={txState}
          />
        </StyledAnimatedBorder>
      )}

      <Row align="center" justify="space-between" style={{ flex: 1 }}>
        <Row gap={5}>
          <SmallText normalTextColor>
            {getFormattedAssetAmount(amount ?? 0, asset?.decimals)}{" "}
            {asset?.recommendedSymbol}
          </SmallText>
          <SmallText> on {asset?.chainName}</SmallText>
          {explorerLink && (
            <Button onClick={() => window.open(explorerLink, "_blank")}>
              <SmallText>
                <ChainIcon />
              </SmallText>
            </Button>
          )}
        </Row>
        <StyledWalletAddress>cosmos17...zha0v</StyledWalletAddress>
      </Row>
    </Row>
  );
};

const StyledChainImage = styled.img<{ state?: txState }>`
  border-radius: 50%;
  box-sizing: content-box;
`;

const StyledWalletAddress = styled(SmallText)`
  padding: 5px 8px;
  height: 28px;
  border-radius: 30px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.secondary.background.normal};
`;

export const StyledAnimatedBorder = ({
  backgroundColor,
  children,
  width,
  height,
  borderSize = 2,
  txState,
}: {
  backgroundColor: string;
  children?: React.ReactNode;
  width: number;
  height: number;
  borderSize?: number;
  txState?: txState;
}) => (
  <StyledLoadingContainer
    align="center"
    justify="center"
    width={width}
    height={height}
    borderSize={borderSize}
    txState={txState}
    backgroundColor={backgroundColor}
  >
    <StyledLoadingOverlay
      className="overlay"
      justify="space-between"
      width={width}
      height={height}
      backgroundColor={backgroundColor}
    >
      {children}
    </StyledLoadingOverlay>
  </StyledLoadingContainer>
);

const StyledLoadingContainer = styled(Row)<{
  height: number;
  width: number;
  borderSize: number;
  txState?: txState;
  backgroundColor?: string;
}>`
  position: relative;
  overflow: hidden;
  height: ${({ height, borderSize }) => height + borderSize * 2}px;
  width: ${({ width, borderSize }) => width + borderSize * 2}px;
  ${({ txState, borderSize, theme }) => {
    switch (txState) {
      case "confirmed":
        return `border: ${borderSize}px solid ${theme.success.text}`;
      case "failed":
        return `border: ${borderSize}px solid ${theme.error.text}`;
      case "broadcasted":
      default:
        return "";
    }
  }};
  border-radius: 50%;

  &:before {
    content: '';
    position: absolute;
    height: ${({ height }) => `${height + 20}px;`}
    width: ${({ width }) => `${width + 20}px;`}
    ${({ txState, backgroundColor, theme }) =>
      txState === "broadcasted" &&
      css`
        background-image: conic-gradient(
          transparent,
          transparent,
          transparent,
          ${backgroundColor ?? theme.success.text}
        );
        animation: rotate 4s linear infinite;
      `};
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StyledLoadingOverlay = styled(Row)<{
  backgroundColor?: string;
  width: number;
  height: number;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: absolute;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary.background.normal};
`;
