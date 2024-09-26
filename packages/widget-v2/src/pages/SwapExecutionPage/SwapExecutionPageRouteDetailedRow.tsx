import { Column, Row } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { css, styled, useTheme } from "styled-components";
import React, { useMemo } from "react";
import { ChainIcon } from "@/icons/ChainIcon";
import { Button, Link } from "@/components/Button";
import { ChainTransaction } from "@skip-go/client";
import { ClientOperation, SimpleStatus } from "@/utils/clientType";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { useAtomValue } from "jotai";
import { chainAddressesAtom } from "@/state/swapExecutionPage";
import { useAccount } from "@/hooks/useAccount";
import { getTruncatedAddress } from "@/utils/crypto";

export type SwapExecutionPageRouteDetailedRowProps = {
  denom: ClientOperation["denomIn"] | ClientOperation["denomOut"];
  tokenAmount: ClientOperation["amountIn"] | ClientOperation["amountOut"];
  chainID: ClientOperation["fromChainID"] | ClientOperation["chainID"];
  explorerLink?: ChainTransaction["explorerLink"];
  status?: SimpleStatus;
  isSignRequired?: boolean;
  index: number;
  context: "source" | "destination" | "intermediary";
  account?: {
    address: string;
    image?: string;
  };
};

export const SwapExecutionPageRouteDetailedRow = ({
  denom,
  tokenAmount,
  chainID,
  status,
  explorerLink,
  isSignRequired,
  index,
  context,
  ...props
}: SwapExecutionPageRouteDetailedRowProps) => {
  const theme = useTheme();

  const assetDetails = useGetAssetDetails({
    assetDenom: denom,
    chainId: chainID,
    tokenAmount,
  });

  const chainAddresses = useAtomValue(chainAddressesAtom);
  const account = useAccount(chainID);

  const source = useMemo(() => {
    const chainAddressArray = Object.values(chainAddresses);
    switch (context) {
      case "source":
        return {
          address: account?.address,
          image: account?.wallet.logo,
        };
      case "intermediary": {
        const selected = Object.values(chainAddresses).find(
          (chainAddress) => chainAddress.chainID === chainID
        );
        return {
          address: selected?.address,
          image:
            (selected?.source === "wallet" &&
              selected.wallet.walletInfo.logo) ||
            undefined,
        };
      }
      case "destination": {
        const selected = chainAddressArray[chainAddressArray.length - 1];
        return {
          address: selected?.address,
          image:
            (selected?.source === "wallet" &&
              selected.wallet.walletInfo.logo) ||
            undefined,
        };
      }
    }
  }, [
    account?.address,
    account?.wallet.logo,
    chainAddresses,
    chainID,
    context,
  ]);

  return (
    <Row gap={15} align="center" {...props}>
      {assetDetails?.assetImage && (
        <StyledAnimatedBorder
          width={30}
          height={30}
          backgroundColor={theme.success.text}
          status={status}
        >
          <StyledChainImage
            height={30}
            width={30}
            src={assetDetails.assetImage}
          />
        </StyledAnimatedBorder>
      )}

      <Column
        style={{
          flex: 1,
        }}
        justify="space-between"
      >
        <Row align="center" justify="space-between">
          <Row gap={5}>
            <SmallText normalTextColor>
              {assetDetails?.amount} {assetDetails?.symbol}
            </SmallText>
            <SmallText> on {assetDetails?.chainName}</SmallText>
            {explorerLink && (
              <Link href={explorerLink} target="_blank">
                <SmallText>
                  <ChainIcon />
                </SmallText>
              </Link>
            )}
          </Row>
          {source.address && (
            <StyledButton onClick={() => {
              if (source.address) {
                navigator.clipboard.writeText(source.address);
              }
            }}>
              {source.image && (
                <img
                  src={source.image}
                  style={{
                    height: "100%",
                  }}
                />
              )}
              <SmallText monospace title={source.address}>{getTruncatedAddress(source.address)}</SmallText>
            </StyledButton>
          )}
        </Row>
        {
          isSignRequired && (
            <SmallText color={theme.warning.text}>Signature required</SmallText>
          )
        }
      </Column >
    </Row >
  );
};

const StyledButton = styled(Button)`
  padding: 5px 8px;
  height: 28px;
  border-radius: 30px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.secondary.background.normal};
  gap: 4px;
  align-items: center;
`;

const StyledChainImage = styled.img`
  border-radius: 50%;
  box-sizing: content-box;
`;

export const StyledAnimatedBorder = ({
  backgroundColor,
  children,
  width,
  height,
  borderSize = 2,
  status,
}: {
  backgroundColor: string;
  children?: React.ReactNode;
  width: number;
  height: number;
  borderSize?: number;
  status?: SimpleStatus;
}) => (
  <StyledLoadingContainer
    align="center"
    justify="center"
    width={width}
    height={height}
    borderSize={borderSize}
    status={status}
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

const StyledLoadingContainer = styled(Row) <{
  height: number;
  width: number;
  borderSize: number;
  status?: SimpleStatus;
  backgroundColor?: string;
}>`
  position: relative;
  overflow: hidden;
  height: ${({ height, borderSize }) => height + borderSize * 2}px;
  width: ${({ width, borderSize }) => width + borderSize * 2}px;
  ${({ status, borderSize, theme }) => {
    switch (status) {
      case "completed":
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
    height: ${({ height }) => `${height + 20}px;`};
    width: ${({ width }) => `${width + 20}px;`};
    ${({ status, backgroundColor, theme }) =>
    status === "pending" &&
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

const StyledLoadingOverlay = styled(Row) <{
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
