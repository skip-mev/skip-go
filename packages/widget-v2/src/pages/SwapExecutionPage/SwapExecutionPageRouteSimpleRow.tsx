import styled, { useTheme } from "styled-components";
import { Link, Button } from "@/components/Button";
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
import { useGetAccount } from "@/hooks/useGetAccount";
import { getTruncatedAddress } from "@/utils/crypto";
import { formatUSD } from "@/utils/intl";
import { copyToClipboard } from "@/utils/misc";
import {
  limitDecimalsDisplayed,
} from "@/utils/number";

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

  const assetDetails = useGetAssetDetails({
    assetDenom: denom,
    chainId,
    tokenAmount,
  });

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
          status={status}
        >
          <img
            height={50}
            width={50}
            style={{ borderRadius: 50, }}
            src={assetDetails.assetImage}
            title={assetDetails?.asset?.name}
          />
        </StyledAnimatedBorder>
      )}
      <Column gap={5}>
        <StyledSymbolAndAmount>
          {limitDecimalsDisplayed(assetDetails.amount)} {assetDetails?.symbol}
        </StyledSymbolAndAmount>
        {usdValue && (
          <SmallText>
            {formatUSD(usdValue)}
          </SmallText>
        )}

        <Row align="center" gap={5}>
          <SmallText normalTextColor>on {assetDetails.chainName}</SmallText>

          <Button
            align="center"
            gap={3}
            onClick={() => copyToClipboard(source.address)}
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
              <PenIcon
                color={theme.primary.text.lowContrast}
              />
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
  overflow: hidden;
  text-overflow: ellipsis;
`;