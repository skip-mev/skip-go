import { Container } from "@/components/Container";
import { Row } from "@/components/Layout";
import { SmallText } from '@/components/Typography';
import { Fragment, useMemo } from "react";
import type { ReactNode } from "react";
import type { TransactionState } from "@skip-go/client";
import { useAtomValue } from "@/jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { Button } from "@/components/Button";
import { getTruncatedAddress } from "@/utils/crypto";
import { useClipboard } from "@/hooks/useClipboard";
import Image from "next/image";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { formatDisplayAmount } from "@/utils/number";
import { useOverallStatusLabelAndColor } from "../hooks/useOverallStatusLabelAndColor";
import { styled } from "@/styled-components";
import { RightArrowIcon } from "../icons/RightArrowIcon";

export type TransactionDetailsProps = {
  txHash: string;
  state?: TransactionState;
  chainIds?: string[];
  hasUntrackedSteps?: boolean;
}

export const TransactionDetails = ({ txHash, state, chainIds, hasUntrackedSteps }: TransactionDetailsProps) => {
  const skipChains = useAtomValue(skipChainsAtom);
  const { saveToClipboard, isCopied } = useClipboard();
  const { sourceAsset, destAsset, sourceAmount, destAmount } = useTransactionHistoryItemFromUrlParams();

  const statusLabelAndColor = useOverallStatusLabelAndColor({ state });

  const chains = chainIds?.map((chainId) => skipChains?.data?.find((chain) => chain.chainId === chainId));

  const transaction = useMemo(() => {
    if (sourceAsset && destAsset) {
      return (
        <Row gap={5}>
          <SmallText normalTextColor>{formatDisplayAmount(sourceAmount, { decimals: 2, abbreviate: true })} {sourceAsset?.symbol}</SmallText>
          <SmallText>→</SmallText>
          <SmallText normalTextColor>{formatDisplayAmount(destAmount, { decimals: 2, abbreviate: true })} {destAsset?.symbol}</SmallText>
        </Row>
      );  
    }
    return (
      <Row gap={5}>
        <SmallText normalTextColor>{chains?.at(0)?.prettyName}</SmallText>
        <SmallText>→</SmallText>
        <SmallText normalTextColor>{chains?.at(-1)?.prettyName}</SmallText>
      </Row>
    )
  }, [chains, destAmount, destAsset, sourceAmount, sourceAsset]);
  
  return (
    <Container gap={20} width="100%" borderRadius={16}>
      <DetailsRow
        label="Transaction"
        value={transaction}
      />
      <DetailsRow
        label="Status"
        value={hasUntrackedSteps && !state
          ? <SmallText>Planned</SmallText>
          : hasUntrackedSteps && state === "STATE_COMPLETED_SUCCESS"
          ? <SmallText>Partially tracked</SmallText>
          : <SmallText color={statusLabelAndColor?.color}>{statusLabelAndColor?.label}</SmallText>}
      />
      <DetailsRow onClick={() => saveToClipboard(txHash)} label="Transaction Hash" value={isCopied ? "Copied!" : getTruncatedAddress(txHash)} />
      <DetailsRow
        label="Route"
        value={
          <RouteChains data-route-preview aria-label="Route">
            {chains?.map((chain, index) => (
              <Fragment key={`${chain?.chainId}-${index}`}>
                {chain?.logoUri && <Image src={chain?.logoUri} alt={chain?.chainName} width={20} height={20} />}
                {index < chains.length - 1 && <RouteArrow aria-hidden="true"><RightArrowIcon color="currentColor" /></RouteArrow>}
              </Fragment>
            ))}
          </RouteChains>
        }
      />
    </Container>
  );
};

export const DetailsRow = ({ label, value, onClick }: { label: string, value: ReactNode, onClick?: () => void }) => {
  return (
    <Button as={onClick === undefined ? "div" : "button"} onClick={onClick} align="center" justify="space-between">
      <SmallText>{label}</SmallText>
      {
        typeof value === "string" || typeof value === "number" ? (
          <SmallText normalTextColor>{value}</SmallText>
        ) : (
          value
        )
      }
    </Button>
  )
}

const RouteChains = styled(Row)`
  min-width: 0;
  max-width: 220px;
  margin-left: 16px;
  align-items: center;

  > img {
    flex: 0 1 20px;
    min-width: 0;
    height: auto;
    aspect-ratio: 1;
    object-fit: contain;
  }
`;

const RouteArrow = styled(SmallText)`
  flex: 0 1 25px;
  min-width: 0;
  display: flex;
  justify-content: center;

  > svg {
    width: 50%;
    height: auto;
  }
`;
