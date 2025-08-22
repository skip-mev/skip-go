import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { DetailsRow } from "./TransactionDetails";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "@/jotai";
import Image from "next/image";
import { SmallText } from "@/components/Typography";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { formatDisplayAmount } from "@/utils/number";
import { getTruncatedAddress } from "@/utils/crypto";
import { useClipboard } from "@/hooks/useClipboard";

export const TokenDetails = () => {
  const { destAsset, destAmount } = useTransactionHistoryItemFromUrlParams();
  const { saveToClipboard, isCopied } = useClipboard();

  const skipChains = useAtomValue(skipChainsAtom);
  const chain = skipChains?.data?.find((chain) => chain.chainId === destAsset?.chainId);

  const isNativeToken = destAsset?.originChainId === destAsset?.chainId && destAsset?.originDenom === destAsset?.denom;

  return (
    <Container gap={20} width="100%" borderRadius={16}>
      {
        destAsset && (
          <Column gap={10}>
            <Row align="center" gap={5}>
              {destAsset?.logoUri && <Image src={destAsset?.logoUri} alt={destAsset?.symbol ?? ''} width={16} height={16} />}
              <SmallText normalTextColor>{chain?.prettyName}</SmallText>
              <SmallText>({destAsset?.recommendedSymbol})</SmallText>
            </Row>
            { isNativeToken && (
              <SmallText>The native token of {chain?.prettyName}</SmallText>
            )}
          </Column>
        )
      }

      <DetailsRow
        label="Received"
        value={`${formatDisplayAmount(destAmount, { decimals: 2, abbreviate: true })} ${destAsset?.recommendedSymbol}`}
      />
      <DetailsRow
        label="Chain ID"
        value={`${destAsset?.chainId}`}
      />
      <DetailsRow
        label="Denom"
        onClick={() => saveToClipboard(destAsset?.denom)}
        value={isCopied ? "Copied!" : getTruncatedAddress(destAsset?.denom)}
      />
      <DetailsRow
        label="Decimals"
        value={`${destAsset?.decimals}`}
      />
      {
        isNativeToken && (
          <DetailsRow
            label="Type"
            value="Native"
          />
        )
      }
    </Container>
  );
};
