import styled, { useTheme } from "styled-components";
import { Link, Button, PillButton, PillButtonLink } from "@/components/Button";
import { Column, Row } from "@/components/Layout";
import { SmallText, Text } from "@/components/Typography";
import { ICONS } from "@/icons";
import { useMemo } from "react";
import { ChainTransaction } from "@skip-go/client";
import { StyledAnimatedBorder } from "./SwapExecutionPageRouteDetailedRow";
import { ChainIcon } from "@/icons/ChainIcon";
import { PenIcon } from "@/icons/PenIcon";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ClientOperation, SimpleStatus } from "@/utils/clientType";
import { chainAddressesAtom } from "@/state/swapExecutionPage";
import { useAtomValue } from "jotai";
import { getTruncatedAddress } from "@/utils/crypto";
import { formatUSD } from "@/utils/intl";
import { limitDecimalsDisplayed, removeTrailingZeros } from "@/utils/number";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { useCopyAddress } from "@/hooks/useCopyAddress";

export type SwapExecutionPageRouteSimpleRowProps = {
  denom: ClientOperation["denomIn"] | ClientOperation["denomOut"];
  tokenAmount: ClientOperation["amountIn"] | ClientOperation["amountOut"];
  usdValue?: string;
  chainId: ClientOperation["fromChainID"] | ClientOperation["chainID"];
  onClickEditDestinationWallet?: () => void;
  explorerLink?: ChainTransaction["explorerLink"];
  status?: SimpleStatus;
  icon?: ICONS;
  context: "source" | "destination";
};

export const SwapExecutionPageRouteSimpleRow = ({
  denom,
  tokenAmount,
  usdValue,
  chainId,
  status,
  onClickEditDestinationWallet,
  explorerLink,
  context,
}: SwapExecutionPageRouteSimpleRowProps) => {
  const theme = useTheme();
  const isMobileScreenSize = useIsMobileScreenSize();
  const { copyAddress, isShowingCopyAddressFeedback } = useCopyAddress();

  const assetDetails = useGetAssetDetails({
    assetDenom: denom,
    chainId,
    tokenAmount,
  });

  const chainAddresses = useAtomValue(chainAddressesAtom);

  const source = useMemo(() => {
    const chainAddressArray = Object.values(chainAddresses);
    switch (context) {
      case "source": {
        const selected = chainAddressArray[0];
        return {
          address: selected?.address,
          image: (selected?.source === "wallet" && selected?.wallet?.walletInfo.logo) || undefined,
        };
      }
      case "destination": {
        const selected = chainAddressArray[chainAddressArray.length - 1];
        return {
          address: selected?.address,
          image: (selected?.source === "wallet" && selected?.wallet?.walletInfo.logo) || undefined,
        };
      }
    }
  }, [chainAddresses, context]);

  const displayAmount = useMemo(() => {
    return removeTrailingZeros(limitDecimalsDisplayed(assetDetails.amount));
  }, [assetDetails.amount]);

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
    <Row gap={25} align="center">
      <StyledAnimatedBorder
        width={50}
        height={50}
        backgroundColor={theme.success.text}
        status={status}
      >
        {assetDetails.assetImage ? (
          <img
            height={50}
            width={50}
            style={{ borderRadius: 50 }}
            src={assetDetails.assetImage}
            title={assetDetails?.asset?.name}
          />
        ) : (
          <PlaceholderIcon>?</PlaceholderIcon>
        )}
      </StyledAnimatedBorder>
      <Column gap={5}>
        <StyledSymbolAndAmount>
          {displayAmount} {assetDetails?.symbol}
        </StyledSymbolAndAmount>
        {usdValue && <SmallText>{formatUSD(usdValue)}</SmallText>}

        <Row align="center" height={18} gap={5}>
          <StyledChainName normalTextColor textWrap="nowrap">
            on {assetDetails.chainName}
          </StyledChainName>

          <Button align="center" gap={3} onClick={() => copyAddress(source.address)}>
            {source.image && <img height={10} width={10} src={source.image} />}
            {source.address && (
              <SmallText monospace title={source.address} textWrap="nowrap">
                {isShowingCopyAddressFeedback
                  ? "Address copied!"
                  : getTruncatedAddress(source.address, isMobileScreenSize)}
              </SmallText>
            )}
          </Button>

          {explorerLink ? (
            renderExplorerLink
          ) : onClickEditDestinationWallet ? (
            <Button
              as={isMobileScreenSize ? PillButton : undefined}
              align="center"
              onClick={onClickEditDestinationWallet}
            >
              <PenIcon color={theme.primary.text.lowContrast} />
            </Button>
          ) : null}
        </Row>
      </Column>
    </Row>
  );
};

const StyledSymbolAndAmount = styled(Text)`
  font-size: 24px;
  max-width: 325px;
  height: 27px;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 767px) {
    font-size: 22px;
  }
`;

const PlaceholderIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${(props) => props.theme.secondary.background.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${(props) => props.theme.primary.text.normal};
  border: 1px solid ${(props) => props.theme.primary.text.normal};
`;

const StyledChainName = styled(SmallText)`
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
