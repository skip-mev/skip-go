import { Column, Row } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { css, styled, useTheme } from "styled-components";
import React, { useMemo } from "react";
import { ChainIcon } from "@/icons/ChainIcon";
import { PenIcon } from "@/icons/PenIcon";
import { Button, PillButton, Link, PillButtonLink } from "@/components/Button";
import { ChainTransaction } from "@skip-go/client";
import { ClientOperation, SimpleStatus } from "@/utils/clientType";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { useAtomValue } from "jotai";
import { chainAddressesAtom, swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useGetAccount } from "@/hooks/useGetAccount";
import { getTruncatedAddress } from "@/utils/crypto";
import { copyToClipboard } from "@/utils/misc";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { CopyIcon } from "@/icons/CopyIcon";
import { removeTrailingZeros } from "@/utils/number";
import { useGetWalletStateFromAddress } from "@/hooks/useGetWalletStateFromAddress";

export type SwapExecutionPageRouteDetailedRowProps = {
  denom: ClientOperation["denomIn"] | ClientOperation["denomOut"];
  tokenAmount: ClientOperation["amountIn"] | ClientOperation["amountOut"];
  chainId: ClientOperation["fromChainID"] | ClientOperation["chainID"];
  onClickEditDestinationWallet?: () => void;
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
  chainId,
  status,
  onClickEditDestinationWallet,
  explorerLink,
  isSignRequired,
  index,
  context,
  ...props
}: SwapExecutionPageRouteDetailedRowProps) => {
  const theme = useTheme();
  const isMobileScreenSize = useIsMobileScreenSize();

  const assetDetails = useGetAssetDetails({
    assetDenom: denom,
    chainId,
    tokenAmount,
  });

  const { userAddresses } = useAtomValue(swapExecutionStateAtom);
  const getWalletState = useGetWalletStateFromAddress();

  const shouldRenderEditDestinationWallet =
    context === "destination" && onClickEditDestinationWallet !== undefined;

  const renderingEditDestinationWalletOrExplorerLink =
    shouldRenderEditDestinationWallet || explorerLink !== undefined;

  const userAddressIndex = userAddresses.findIndex(
    (userAddress) => userAddress.chainID === chainId,
  );
  const address = userAddresses[userAddressIndex].address;
  const walletInfo = getWalletState(address)?.walletInfo;

  const renderAddress = useMemo(() => {
    const Container = shouldRenderEditDestinationWallet
      ? ({ children }: { children: React.ReactNode }) => <Row gap={5}>{children}</Row>
      : React.Fragment;
    if (!address) return;
    return (
      <Container>
        <PillButton onClick={() => copyToClipboard(address)}>
          {walletInfo?.logo && (
            <img
              src={walletInfo.logo}
              style={{
                height: "100%",
              }}
            />
          )}
          {isMobileScreenSize ? (
            <CopyIcon color={theme.primary.text.lowContrast} />
          ) : (
            <AddressText title={address} monospace textWrap="nowrap">
              {getTruncatedAddress(address, isMobileScreenSize)}
            </AddressText>
          )}
        </PillButton>
        {shouldRenderEditDestinationWallet && (
          <Button
            as={isMobileScreenSize ? PillButton : undefined}
            align="center"
            onClick={onClickEditDestinationWallet}
          >
            <PenIcon color={theme.primary.text.lowContrast} />
          </Button>
        )}
      </Container>
    );
  }, [
    address,
    isMobileScreenSize,
    onClickEditDestinationWallet,
    shouldRenderEditDestinationWallet,
    theme.primary.text.lowContrast,
    walletInfo.logo,
  ]);

  const renderExplorerLink = useMemo(() => {
    if (!explorerLink) return;
    if (isMobileScreenSize) {
      return (
        <PillButtonLink href={explorerLink} target="_blank">
          <ChainIcon />
        </PillButtonLink>
      );
    }
    return (
      <Link href={explorerLink} target="_blank">
        <ChainIcon />
      </Link>
    );
  }, [explorerLink, isMobileScreenSize]);

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
            title={assetDetails?.asset?.name}
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
          <Column>
            <Row gap={5} align="center">
              <StyledAssetAmount normalTextColor title={assetDetails?.amount}>
                {removeTrailingZeros(assetDetails?.amount)}
              </StyledAssetAmount>
              <StyledSymbol normalTextColor>{assetDetails?.symbol}</StyledSymbol>
              <StyledChainName
                renderingEditDestinationWalletOrExplorerLink={
                  renderingEditDestinationWalletOrExplorerLink
                }
                title={assetDetails?.chainName}
                textWrap="nowrap"
              >
                {" "}
                on {assetDetails?.chainName}
              </StyledChainName>
              {renderExplorerLink}
            </Row>{" "}
            {isSignRequired && <SmallText color={theme.warning.text}>Signature required</SmallText>}
          </Column>
          {renderAddress}
        </Row>
      </Column>
    </Row>
  );
};

const AddressText = styled(SmallText)`
  text-transform: lowercase;
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

const StyledLoadingContainer = styled(Row)<{
  height: number;
  width: number;
  borderSize: number;
  status?: SimpleStatus;
  backgroundColor?: string;
}>`
  flex-shrink: 0;
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
      default:
        return "";
    }
  }};
  border-radius: 50%;

  &:before {
    content: "";
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

const StyledLoadingOverlay = styled(Row)<{
  backgroundColor?: string;
  width: number;
  height: number;
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: absolute;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary.background.normal};
`;

const StyledAssetAmount = styled(SmallText)`
  max-width: 60px;
  text-overflow: ellipsis;
  overflow: hidden;

  @media (max-width: 767px) {
    max-width: 80px;
  }

  @media (max-width: 400px) {
    max-width: 55px;
  }
`;

const StyledSymbol = styled(SmallText)`
  max-width: 55px;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 400px) {
    max-width: 40px;
  }
`;

const StyledChainName = styled(SmallText)<{
  renderingEditDestinationWalletOrExplorerLink: boolean;
}>`
  max-width: 95px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  @media (min-width: 500px) and (max-width: 767px) {
    ${({ renderingEditDestinationWalletOrExplorerLink }) =>
      renderingEditDestinationWalletOrExplorerLink
        ? css`
            max-width: 120px;
          `
        : css`
            max-width: 140px;
          `};
  }

  @media (min-width: 400px) and (max-width: 500px) {
    ${({ renderingEditDestinationWalletOrExplorerLink }) =>
      renderingEditDestinationWalletOrExplorerLink
        ? css`
            max-width: 55px;
          `
        : css`
            max-width: 85px;
          `};
  }

  @media (max-width: 400px) {
    ${({ renderingEditDestinationWalletOrExplorerLink }) =>
      renderingEditDestinationWalletOrExplorerLink
        ? css`
            max-width: 65px;
          `
        : css`
            max-width: 100px;
          `};
  }
`;
