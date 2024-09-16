import { useTheme } from "styled-components";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Layout";
import { SmallText, Text } from "@/components/Typography";
import { Wallet } from "@/components/RenderWalletList";
import { iconMap, ICONS } from "@/icons";
import { useEffect, useMemo } from "react";
import { ChainTransaction } from "@skip-go/client";
import {
  StyledAnimatedBorder,
  txState,
} from "./SwapExecutionPageRouteDetailedRow";
import { ChainIcon } from "@/icons/ChainIcon";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ClientOperation } from "@/utils/clientType";

export type SwapExecutionPageRouteSimpleRowProps = {
  denom: ClientOperation["denomIn"] | ClientOperation["denomOut"];
  tokenAmount: ClientOperation["amountIn"] | ClientOperation["amountOut"];
  chainID: ClientOperation["fromChainID"] | ClientOperation["chainID"];
  destination?: boolean;
  onClickEditDestinationWallet?: () => void;
  explorerLink?: ChainTransaction["explorerLink"];
  txState?: txState;
  wallet?: Wallet;
  icon?: ICONS;
};

export const SwapExecutionPageRouteSimpleRow = ({
  denom,
  tokenAmount,
  chainID,
  txState,
  destination,
  onClickEditDestinationWallet,
  explorerLink,
  wallet,
  icon = ICONS.none,
}: SwapExecutionPageRouteSimpleRowProps) => {
  const theme = useTheme();

  const assetDetails = useGetAssetDetails({
    assetDenom: denom,
    chainId: chainID,
    tokenAmount,
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
          {assetDetails.amount}{" "}{assetDetails?.symbol}
        </Text>
        <SmallText>
          {assetDetails.formattedUsdAmount}
          {destination && " after fees"}
        </SmallText>
        <Row align="center" gap={5}>
          <SmallText normalTextColor>on {assetDetails.chainName}</SmallText>
          {wallet && (
            <>
              {wallet.walletInfo.logo && (
                <img height={10} width={10} src={wallet.walletInfo.logo} />
              )}
              <SmallText>
                {/* {wallet.address} */}
              </SmallText>

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
