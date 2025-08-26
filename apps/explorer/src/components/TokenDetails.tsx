import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { DetailsRow } from "./TransactionDetails";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "@/jotai";
import Image from "next/image";
import { SmallText } from "@/components/Typography";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { formatDisplayAmount } from "@/utils/number";
import { getTruncatedAddress } from "@/utils/crypto";
import { useClipboard } from "@/hooks/useClipboard";
import { useMemo } from "react";
import { TxStatusResponse } from "@skip-go/client";

export const TokenDetails = ({
  transactionStatusResponse,
}: {
  transactionStatusResponse: TxStatusResponse;
}) => {
  const { destAsset, destAmount } = useTransactionHistoryItemFromUrlParams();
  const { saveToClipboard, isCopied } = useClipboard();

  const skipChains = useAtomValue(skipChainsAtom);
  const skipAssets = useAtomValue(skipAssetsAtom);
  const chain = skipChains?.data?.find((chain) => chain.chainId === destAsset?.chainId);

  const transferAssetReleaseAsset = skipAssets?.data?.find((asset) => asset.chainId === transactionStatusResponse?.transferAssetRelease?.chainId && asset.denom === transactionStatusResponse?.transferAssetRelease?.denom);

  const receivedToken = useMemo(() => {
    if (transactionStatusResponse?.transferAssetRelease?.released) {
      return `${formatDisplayAmount(transactionStatusResponse?.transferAssetRelease?.amount, { decimals: 2, abbreviate: true })} ${transferAssetReleaseAsset?.recommendedSymbol}`;
    }
    return `${formatDisplayAmount(destAmount, { decimals: 2, abbreviate: true })} ${destAsset?.recommendedSymbol}`;
  }, [destAmount, destAsset?.recommendedSymbol, transactionStatusResponse?.transferAssetRelease?.amount, transactionStatusResponse?.transferAssetRelease?.released, transferAssetReleaseAsset?.recommendedSymbol]);

  const chainId = useMemo(() => {
    if (transactionStatusResponse?.transferAssetRelease?.chainId) {
      return transactionStatusResponse?.transferAssetRelease?.chainId;
    }
    return destAsset?.chainId;
  }, [destAsset?.chainId, transactionStatusResponse?.transferAssetRelease?.chainId]);

  const denom = useMemo(() => {
    if (transactionStatusResponse?.transferAssetRelease?.denom) {
      return transactionStatusResponse?.transferAssetRelease?.denom;
    }
    return destAsset?.denom;
  }, [destAsset?.denom, transactionStatusResponse?.transferAssetRelease?.denom]);

  const decimals = useMemo(() => {
    if (transferAssetReleaseAsset) {
      return transferAssetReleaseAsset?.decimals;
    }
    return destAsset?.decimals;
  }, [destAsset?.decimals, transferAssetReleaseAsset]);

  const isNativeToken = useMemo(() => {
    if (transferAssetReleaseAsset) {
      return transactionStatusResponse?.transferAssetRelease?.chainId === transactionStatusResponse?.transferAssetRelease?.chainId && transactionStatusResponse?.transferAssetRelease?.denom === transactionStatusResponse?.transferAssetRelease?.denom;
    }
    return destAsset?.originChainId === destAsset?.chainId && destAsset?.originDenom === destAsset?.denom;
  }, [destAsset?.chainId, destAsset?.denom, destAsset?.originChainId, destAsset?.originDenom, transactionStatusResponse?.transferAssetRelease?.chainId, transactionStatusResponse?.transferAssetRelease?.denom, transferAssetReleaseAsset]);

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
        value={receivedToken}
      />
      <DetailsRow
        label="Chain ID"
        value={chainId}
      />
      <DetailsRow
        label="Denom"
        onClick={() => saveToClipboard(denom)}
        value={isCopied ? "Copied!" : getTruncatedAddress(denom)}
      />
      <DetailsRow
        label="Decimals"
        value={decimals}
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
