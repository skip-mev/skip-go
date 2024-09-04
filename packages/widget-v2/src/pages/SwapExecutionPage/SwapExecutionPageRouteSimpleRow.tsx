import { useTheme } from "styled-components";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Layout";
import { SmallText, Text } from "@/components/Typography";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { getFormattedAssetAmount } from "@/utils/crypto";
import { Wallet } from "@/components/RenderWalletList";
import { iconMap, ICONS } from "@/icons";
import { useEffect, useMemo } from "react";
import { ChainTransaction } from "@skip-go/client";
import {
  Operation,
  StyledAnimatedBorder,
  txState,
} from "./SwapExecutionPageRouteDetailedRow";
import { useAtom } from "jotai";
import { useUsdValue } from "@/utils/useUsdValue";
import { formatUSD } from "@/utils/intl";
import { ChainIcon } from "@/icons/ChainIcon";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";

export type SwapExecutionPageRouteSimpleRowProps = {
  denom: Operation["denomIn"] | Operation["denomOut"];
  amount: Operation["amountIn"] | Operation["amountOut"];
  chainID: Operation["fromChainID"] | Operation["chainID"];
  destination?: boolean;
  onClickEditDestinationWallet?: () => void;
  explorerLink?: ChainTransaction["explorerLink"];
  txState?: txState;
  wallet?: Wallet;
  icon?: ICONS;
};

export const SwapExecutionPageRouteSimpleRow = ({
  denom,
  amount,
  chainID,
  txState,
  destination,
  onClickEditDestinationWallet,
  explorerLink,
  wallet,
  icon = ICONS.none,
}: SwapExecutionPageRouteSimpleRowProps) => {
  useEffect(() => {
    "mount";
  }, []);
  const theme = useTheme();

  const assetDetails = useGetAssetDetails({
    assetDenom: denom,
    chainId: chainID,
  });

  if (!assetDetails?.asset) {
    throw new Error(`Asset not found for denom: ${denom}`);
  }

  const normalizedAmount = Number(amount) / Math.pow(10, assetDetails.asset.decimals ?? 6);

  const usdValue = useUsdValue({
    ...assetDetails.asset,
    value: normalizedAmount.toString(),
  });

  const txStateOfAnimatedBorder = useMemo(() => {
    if (destination && txState === "broadcasted") {
      return;
    }
    return txState;
  }, [txState, destination]);

  const Icon = iconMap[icon];

  return (
    <Row gap={25} align="center">
      {assetDetails.chainImage && (
        <StyledAnimatedBorder
          width={50}
          height={50}
          backgroundColor={theme.success.text}
          txState={txStateOfAnimatedBorder}
        >
          <img height={50} width={50} src={assetDetails.chainImage} />
        </StyledAnimatedBorder>
      )}
      <Column gap={5}>
        <Text fontSize={24}>
          {assetDetails.formattedAmount}{" "}
          {assetDetails?.symbol}
        </Text>
        <SmallText>
          {formatUSD(usdValue?.data ?? 0)}
          {destination && " after fees"}
        </SmallText>
        <Row align="center" gap={5}>
          <SmallText normalTextColor>on {assetDetails.chainName}</SmallText>
          {wallet && (
            <>
              {wallet.imageUrl && (
                <img height={10} width={10} src={wallet.imageUrl} />
              )}
              <SmallText>{wallet.address}</SmallText>

              {explorerLink ? (
                <Button onClick={() => window.open(explorerLink, "_blank")}>
                  <SmallText>
                    <ChainIcon />
                  </SmallText>
                </Button>
              ) : (
                <Button align="center" onClick={onClickEditDestinationWallet}>
                  <Icon
                    width={10}
                    height={10}
                    color={theme.primary.text.lowContrast}
                  />
                </Button>
              )}
            </>
          )}
        </Row>
      </Column>
    </Row>
  );
};
