import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { SmallText } from '@/components/Typography';
import { ReactNode } from "react";
import { getSimpleOverallStatus, TransactionState } from "@skip-go/client";
import { Badge } from "@/components/Badge";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { GhostButton } from "@/components/Button";
import { getTruncatedAddress } from "@/utils/crypto";

export type TransactionDetailsProps = {
  txHash: string;
  state?: TransactionState;
  chainIds?: string[];
}

export const TransactionDetails = ({ txHash, state, chainIds }: TransactionDetailsProps) => {
  const skipChains = useAtomValue(skipChainsAtom);

  const chains = chainIds?.map((chainId) => skipChains?.data?.find((chain) => chain.chainId === chainId));
  
  console.log({ txHash, state, chainIds });
  return (
    <Column gap={10}>
      <Container gap={20} width={355} borderRadius={16}>
        <TransactionDetailsRow
          label="Transaction"
          value={`${chains?.at(0)?.prettyName} → ${chains?.at(-1)?.prettyName}`}
        />
        <TransactionDetailsRow
          label="Status"
          value={
            <Badge variant={state ? getSimpleOverallStatus(state) : ""}>
              {state ? getSimpleOverallStatus(state) : ""}
            </Badge>
          }
        />
        <TransactionDetailsRow label="Transaction Hash" value={getTruncatedAddress(txHash)} />
        <TransactionDetailsRow
          label="Route"
          value={
            <Row gap={5}>
              {chains?.map((chain, index) => (
                <Row key={chain?.chainId} gap={8} align="center">
                  <img src={chain?.logoUri} alt={chain?.chainName} width={20} height={20} />
                  <SmallText>{index < chains.length - 1 && "→"}</SmallText>
                </Row>
              ))}
            </Row>
          }
        />
      </Container>
      <Row justify="space-between">
        <GhostButton>
          View raw data
        </GhostButton>
        <GhostButton>
          View token details
        </GhostButton>
      </Row>
    </Column>
  );
};

const TransactionDetailsRow = ({ label, value }: { label: string, value: ReactNode }) => {
  return (
    <Row justify="space-between">
      <SmallText>{label}</SmallText>
      {
        typeof value === "string" ? (
          <SmallText normalTextColor>{value}</SmallText>
        ) : (
          value
        )
      }
    </Row>
  )
}