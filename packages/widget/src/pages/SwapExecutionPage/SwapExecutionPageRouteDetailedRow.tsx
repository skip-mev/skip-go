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
import { chainAddressesAtom } from "@/state/swapExecutionPage";
import { getTruncatedAddress } from "@/utils/crypto";
import { formatDisplayAmount } from "@/utils/number";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { CopyIcon } from "@/icons/CopyIcon";
import { useCopyAddress } from "@/hooks/useCopyAddress";
import { TxsStatus } from "./useBroadcastedTxs";

export type SwapExecutionPageRouteDetailedRowProps = {
  denom: ClientOperation["denomIn"] | ClientOperation["denomOut"];
  tokenAmount: ClientOperation["amountIn"] | ClientOperation["amountOut"];
  chainId: ClientOperation["fromChainId"] | ClientOperation["chainId"];
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
  statusData?: TxsStatus;
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
  statusData,
  ...props
}: SwapExecutionPageRouteDetailedRowProps) => {
  const theme = useTheme();
  const isMobileScreenSize = useIsMobileScreenSize();
  const { copyAddress, isShowingCopyAddressFeedback } = useCopyAddress();

  const assetDetails = useGetAssetDetails({
    assetDenom: denom,
    chainId,
    tokenAmount,
  });

  const chainAddresses = useAtomValue(chainAddressesAtom);

  const shouldRenderEditDestinationWallet =
    context === "destination" && onClickEditDestinationWallet !== undefined;

  const renderingEditDestinationWalletOrExplorerLink =
    shouldRenderEditDestinationWallet || explorerLink !== undefined;

  const chainAddressWallet = useMemo(() => {
    const chainAddressArray = Object.values(chainAddresses);
    const firstChainAddressFoundForChainId = chainAddressArray.find(
      (chainAddress) => chainAddress.chainId === chainId,
    );
    const lastChainAddress = chainAddressArray[chainAddressArray.length - 1];

    const selectedChainAddress =
      context === "destination" ? lastChainAddress : firstChainAddressFoundForChainId;

    return {
      address: selectedChainAddress?.address,
      image:
        (selectedChainAddress?.source === "wallet" &&
          selectedChainAddress?.wallet?.walletInfo.logo) ||
        undefined,
    };
  }, [chainAddresses, chainId, context]);

  const renderAddress = useMemo(() => {
    const Container = shouldRenderEditDestinationWallet
      ? ({ children }: { children: React.ReactNode }) => <Row gap={5}>{children}</Row>
      : React.Fragment;
    if (!chainAddressWallet.address) return;

    const renderContent = () => {
      const copiedToClipboardText = isMobileScreenSize ? "Copied!" : "Address copied!";

      if (isShowingCopyAddressFeedback) {
        return <SmallText>{copiedToClipboardText}</SmallText>;
      }
      if (isMobileScreenSize) {
        return <CopyIcon color={theme.primary.text.lowContrast} />;
      }
      return (
        <AddressText title={chainAddressWallet.address} monospace textWrap="nowrap">
          {getTruncatedAddress(chainAddressWallet.address, isMobileScreenSize)}
        </AddressText>
      );
    };
    return (
      <Container>
        <AddressPillButton onClick={() => copyAddress(chainAddressWallet?.address)}>
          {chainAddressWallet.image && (
            <img
              src={chainAddressWallet.image}
              style={{
                height: "100%",
              }}
            />
          )}
          {renderContent()}
        </AddressPillButton>
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
    copyAddress,
    isMobileScreenSize,
    isShowingCopyAddressFeedback,
    onClickEditDestinationWallet,
    shouldRenderEditDestinationWallet,
    chainAddressWallet.address,
    chainAddressWallet.image,
    theme.primary.text.lowContrast,
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

  const numberOfTransferEvents = statusData?.transferEvents.length;
  const latestStatus = statusData?.transferEvents?.[statusData?.transferEvents.length - 1]?.status;

  return (
    <Row gap={15} align="center" {...props}>
      {assetDetails?.assetImage ? (
        <StyledAnimatedBorder
          width={30}
          height={30}
          backgroundColor={theme.success.text}
          status={status}
          key={`${numberOfTransferEvents}-${latestStatus}`}
        >
          <StyledChainImage
            height={30}
            width={30}
            src={assetDetails.assetImage}
            title={assetDetails?.asset?.name}
          />
        </StyledAnimatedBorder>
      ) : (
        <PlaceholderIcon> ? </PlaceholderIcon>
      )}

      <Column
        style={{
          flex: 1,
        }}
        justify="space-between"
      >
        <Row align="center">
          <LeftContent>
            <Row gap={5} align="center">
              <StyledAssetAmount normalTextColor title={assetDetails?.amount}>
                {formatDisplayAmount(assetDetails?.amount)}
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
          </LeftContent>
          {renderAddress}
        </Row>
      </Column>
    </Row>
  );
};

const AddressPillButton = styled(PillButton)`
  justify-content: flex-start;
  @media (min-width: 768px) {
    width: 160px;
  }
`;

const LeftContent = styled(Column)`
  width: 55%;
  @media (max-width: 767px) {
    width: 75%;
  }
`;

const PlaceholderIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => props.theme.secondary.background.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${(props) => props.theme.primary.text.normal};
  border: 1px solid ${(props) => props.theme.primary.text.normal};
`;

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
  max-width: 80px;
  text-overflow: ellipsis;
  overflow: hidden;

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
