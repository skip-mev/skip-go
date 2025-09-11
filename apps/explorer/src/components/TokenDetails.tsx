import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { DetailsRow } from "./TransactionDetails";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "@/jotai";
import Image from "next/image";
import { SmallText } from "@/components/Typography";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { formatDisplayAmount } from "@/utils/number";
import { convertTokenAmountToHumanReadableAmount, getTruncatedAddress } from "@/utils/crypto";
import { useClipboard } from "@/hooks/useClipboard";
import { useMemo } from "react";
import { TxStatusResponse } from "@skip-go/client";
import { styled } from "@/styled-components";
import { useGetTransferAssetReleaseAsset } from "../hooks/useGetTransferAssetReleaseAsset";

export const TokenDetails = ({
  transactionStatusResponse,
}: {
  transactionStatusResponse?: TxStatusResponse;
}) => {
  const { destAsset, destAmount } = useTransactionHistoryItemFromUrlParams();
  const { saveToClipboard, isCopied } = useClipboard();

  const skipChains = useAtomValue(skipChainsAtom);

  const transferAssetReleaseAsset = useGetTransferAssetReleaseAsset(transactionStatusResponse?.transferAssetRelease);

  const receivedAsset = useMemo(() => {
    if (transactionStatusResponse?.transferAssetRelease?.released) {
      return transferAssetReleaseAsset;
    }
    return destAsset;
  }, [destAsset, transferAssetReleaseAsset, transactionStatusResponse?.transferAssetRelease?.released]);

  const chain = skipChains?.data?.find((chain) => chain.chainId === receivedAsset?.chainId);

  const receivedToken = useMemo(() => {
    if (destAsset) {
      return `${formatDisplayAmount(destAmount)} ${destAsset?.recommendedSymbol ?? ''}`;
    }

    if (transactionStatusResponse?.transferAssetRelease?.released && transferAssetReleaseAsset) {
      return `${formatDisplayAmount(convertTokenAmountToHumanReadableAmount(transactionStatusResponse?.transferAssetRelease?.amount ?? '', transferAssetReleaseAsset?.decimals), { decimals: 2 })} ${transferAssetReleaseAsset?.recommendedSymbol ?? ''}`;
    }
    
  }, [destAmount, destAsset, transactionStatusResponse?.transferAssetRelease?.amount, transactionStatusResponse?.transferAssetRelease?.released, transferAssetReleaseAsset]);

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

  return (
    <Container gap={20} width="100%" borderRadius={16}>
      {
        receivedAsset && (
          <Column gap={10}>
            <Row align="center" gap={5}>
              {receivedAsset?.logoUri && <Image src={receivedAsset?.logoUri} alt={receivedAsset?.symbol ?? ''} width={16} height={16} />}
              <SmallText normalTextColor>{chain?.prettyName}</SmallText>
              <SmallText>({receivedAsset?.recommendedSymbol})</SmallText>
            </Row>
            <SmallText>{receivedAsset?.description}</SmallText>
          </Column>
        )
      }
      {
        !receivedAsset && (
          <StyledNoMetadataContainer>
            <SmallText>No metadata found for this asset.</SmallText>
          </StyledNoMetadataContainer>
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
      {
        decimals && (
          <DetailsRow
            label="Decimals"
            value={decimals}
          />
        )
      }
    </Container>
  );
};

const StyledNoMetadataContainer = styled.div`
  padding: 12px;
  border-radius: 5px;
  background: ${({ theme }) => theme.warning.background};
`;