import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { SmallText } from '@/components/Typography';
import { ReactNode, useMemo } from "react";
import { TransactionState } from "@skip-go/client";
import { useAtomValue } from "@/jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { Button } from "@/components/Button";
import { getTruncatedAddress } from "@/utils/crypto";
import { useClipboard } from "@/hooks/useClipboard";
import Image from "next/image";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { formatDisplayAmount } from "@/utils/number";
import { useOverallStatusLabelAndColor } from "../hooks/useOverallStatusLabelAndColor";

export type TransactionDetailsProps = {
  txHash: string;
  state?: TransactionState;
  chainIds?: string[];
}

export const TransactionDetails = ({ txHash, state, chainIds }: TransactionDetailsProps) => {
  const skipChains = useAtomValue(skipChainsAtom);
  const { saveToClipboard, isCopied } = useClipboard();
  const { sourceAsset, destAsset, sourceAmount, destAmount, routeStatus } = useTransactionHistoryItemFromUrlParams();

  const statusLabelAndColor = useOverallStatusLabelAndColor({ status: routeStatus, state });

  const chains = chainIds?.map((chainId) => skipChains?.data?.find((chain) => chain.chainId === chainId));

  const transaction = useMemo(() => {
    if (sourceAsset && destAsset) {
      return `${formatDisplayAmount(sourceAmount, { decimals: 2, abbreviate: true })} ${sourceAsset?.symbol} → ${formatDisplayAmount(destAmount, { decimals: 2, abbreviate: true })} ${destAsset?.symbol}`
    }
    return `${chains?.at(0)?.prettyName} → ${chains?.at(-1)?.prettyName}`
  }, [chains, destAmount, destAsset, sourceAmount, sourceAsset]);
  
  return (
    <Column gap={5}>
      <Container gap={20} width={355} borderRadius={16}>
        <DetailsRow
          label="Transaction"
          value={transaction}
        />
        <DetailsRow
          label="Status"
          value={<SmallText color={statusLabelAndColor?.color}>{statusLabelAndColor?.label}</SmallText>}
        />
        <DetailsRow onClick={() => saveToClipboard(txHash)} label="Transaction Hash" value={isCopied ? "Copied!" : getTruncatedAddress(txHash)} />
        <DetailsRow
          label="Route"
          value={
            <Row gap={5}>
              {chains?.map((chain, index) => (
                <Row key={`${chain?.chainId}-${index}`} gap={8} align="center">
                  {chain?.logoUri && <Image src={chain?.logoUri} alt={chain?.chainName} width={20} height={20} />}
                  <SmallText>{index < chains.length - 1 && "→"}</SmallText>
                </Row>
              ))}
            </Row>
          }
        />
      </Container>
    </Column>
  );
};

export const DetailsRow = ({ label, value, onClick }: { label: string, value: ReactNode, onClick?: () => void }) => {
  return (
    <Button as={onClick === undefined ? "div" : "button"} onClick={onClick} align="center" justify="space-between">
      <SmallText>{label}</SmallText>
      {
        typeof value === "string" ? (
          <SmallText normalTextColor>{value}</SmallText>
        ) : (
          value
        )
      }
    </Button>
  )
}
