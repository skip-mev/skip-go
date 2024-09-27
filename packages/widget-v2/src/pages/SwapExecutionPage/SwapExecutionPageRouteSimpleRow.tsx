import { useTheme } from "styled-components";
import { Link, Button } from "@/components/Button";
import { Column, Row } from "@/components/Layout";
import { SmallText, Text } from "@/components/Typography";
import { iconMap, ICONS } from "@/icons";
import { useMemo } from "react";
import { ChainTransaction } from "@skip-go/client";
import { StyledAnimatedBorder } from "./SwapExecutionPageRouteDetailedRow";
import { ChainIcon } from "@/icons/ChainIcon";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ClientOperation, SimpleStatus } from "@/utils/clientType";
import { chainAddressesAtom } from "@/state/swapExecutionPage";
import { useAtomValue } from "jotai";
import { useGetAccount } from "@/hooks/useGetAccount";
import { getTruncatedAddress } from "@/utils/crypto";

export type SwapExecutionPageRouteSimpleRowProps = {
  denom: ClientOperation["denomIn"] | ClientOperation["denomOut"];
  tokenAmount: ClientOperation["amountIn"] | ClientOperation["amountOut"];
  chainId: ClientOperation["fromChainID"] | ClientOperation["chainID"];
  destination?: boolean;
  onClickEditDestinationWallet?: () => void;
  explorerLink?: ChainTransaction["explorerLink"];
  status?: SimpleStatus;
  icon?: ICONS;
  context: "source" | "destination";
};

export const SwapExecutionPageRouteSimpleRow = ({
  denom,
  tokenAmount,
  chainId,
  status,
  destination,
  onClickEditDestinationWallet,
  explorerLink,
  context,
  icon = ICONS.none,
}: SwapExecutionPageRouteSimpleRowProps) => {
  const theme = useTheme();

  const assetDetails = useGetAssetDetails({
    assetDenom: denom,
    chainId,
    tokenAmount,
  });

  const txStateOfAnimatedBorder = useMemo(() => {
    if (destination && status === "broadcasted") {
      return;
    }
    return status;
  }, [status, destination]);

  const Icon = iconMap[icon];

  const chainAddresses = useAtomValue(chainAddressesAtom);
  const getAccount = useGetAccount();
  const account = getAccount(chainId);

  const source = useMemo(() => {
    const chainAddressArray = Object.values(chainAddresses);
    switch (context) {
      case "source":
        return {
          address: account?.address,
          image: account?.wallet.logo,
        };
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
  }, [account?.address, account?.wallet.logo, chainAddresses, context]);

  return (
    <Row gap={25} align="center">
      {assetDetails.assetImage && (
        <StyledAnimatedBorder
          width={50}
          height={50}
          backgroundColor={theme.success.text}
          status={txStateOfAnimatedBorder}
        >
          <img
            height={50}
            width={50}
            src={assetDetails.assetImage}
            title={assetDetails?.asset?.name}
          />
        </StyledAnimatedBorder>
      )}
      <Column gap={5}>
        <Text fontSize={24}>
          {assetDetails.amount} {assetDetails?.symbol}
        </Text>
        <SmallText>
          {assetDetails.formattedUsdAmount}
          {destination && " after fees"}
        </SmallText>
        <Row align="center" gap={5}>
          <SmallText normalTextColor>on {assetDetails.chainName}</SmallText>

          <Button
            align="center"
            onClick={() => {
              if (source.address) {
                navigator.clipboard.writeText(source.address);
              }
            }}
          >
            {source.image && <img height={10} width={10} src={source.image} />}
            {source.address && (
              <SmallText monospace title={source.address}>
                {getTruncatedAddress(source.address)}
              </SmallText>
            )}
          </Button>

          {explorerLink ? (
            <Link href={explorerLink} target="_blank">
              <SmallText>
                <ChainIcon />
              </SmallText>
            </Link>
          ) : onClickEditDestinationWallet ? (
            <Button align="center" onClick={onClickEditDestinationWallet}>
              <Icon
                width={10}
                height={10}
                color={theme.primary.text.lowContrast}
              />
            </Button>
          ) : null}
        </Row>
      </Column>
    </Row>
  );
};
