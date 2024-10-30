import { SmallText } from "@/components/Typography";
import { ClientAsset } from "@/state/skipClient";
import { Column, Row } from "@/components/Layout";
import { styled, useTheme } from "styled-components";
import { XIcon } from "@/icons/XIcon";
import { useMemo } from "react";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { TransactionHistoryPageHistoryItemDetails } from "./TransactionHistoryPageHistoryItemDetails";
import { HistoryArrowIcon } from "@/icons/HistoryArrowIcon";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { removeTransactionHistoryItemAtom, TransactionHistoryItem } from "@/state/history";
import { useSetAtom } from "jotai";
import { formatDistanceStrict } from "date-fns";
import { useBroadcastedTxsStatus } from "../SwapExecutionPage/useBroadcastedTxs";
import { useSyncTxStatus } from "../SwapExecutionPage/useSyncTxStatus";

type TransactionHistoryPageHistoryItemProps = {
  index: number;
  txHistoryItem: TransactionHistoryItem;
  showDetails?: boolean;
  onClickRow?: () => void;
};

export const TransactionHistoryPageHistoryItem = ({
  index,
  txHistoryItem,
  showDetails,
  onClickRow,
}: TransactionHistoryPageHistoryItemProps) => {
  const theme = useTheme();

  const { data: statusData } = useBroadcastedTxsStatus({
    txsRequired: txHistoryItem?.route.txsRequired,
    txs: txHistoryItem.transactionDetails.map(tx => ({
      chainID: tx.chainID,
      txHash: tx.txHash,
    })),
  });

  useSyncTxStatus({
    statusData,
    historyIndex: index,
  });

  const removeTransactionHistoryItem = useSetAtom(removeTransactionHistoryItemAtom);

  const {
    route: {
      amountIn,
      amountOut,
      sourceAssetDenom,
      sourceAssetChainID,
      destAssetDenom,
      destAssetChainID,
    },
    timestamp,
    status,
    transactionDetails,
  } = txHistoryItem;

  const sourceAssetDetails = useGetAssetDetails({
    assetDenom: sourceAssetDenom,
    chainId: sourceAssetChainID,
    tokenAmount: amountIn,
  });

  const destinationAssetDetails = useGetAssetDetails({
    assetDenom: destAssetDenom,
    chainId: destAssetChainID,
    tokenAmount: amountOut,
  });

  const source = {
    amount: sourceAssetDetails.amount,
    asset: sourceAssetDetails.asset,
    assetImage: sourceAssetDetails.assetImage ?? "",
  };

  const destination = {
    amount: destinationAssetDetails.amount,
    asset: destinationAssetDetails.asset,
    assetImage: destinationAssetDetails.assetImage ?? "",
  };

  const renderStatus = useMemo(() => {
    switch (status) {
      case "unconfirmed":
      case "pending":
        return (
          <StyledAnimatedBorder
            width={10}
            height={10}
            backgroundColor={theme.primary.text.normal}
            status="pending"
          />
        );
      case "completed":
        return <StyledGreenDot />;
      case "failed":
        return <XIcon color={theme.error.text} />;
    }
  }, [status, theme.error.text, theme.primary.text.normal]);

  const absoluteTimeString = useMemo(() => {
    return new Date(timestamp).toLocaleString();
  }, [timestamp]);

  const relativeTime = useMemo(() => {
    // get relative time based on timestamp
    if (status === "pending") {
      return "In Progress";
    }
    return formatDistanceStrict(new Date(timestamp), new Date(), { addSuffix: true })
      .replace(" minutes", " mins")
      .replace(" minute", " min")
      .replace(" hours", " hrs")
      .replace(" hour", " hr")
  }, [status, timestamp]);

  return (
    <StyledHistoryContainer showDetails={showDetails}>
      <StyledHistoryItemRow
        align="center"
        justify="space-between"
        onClick={onClickRow}
      >
        <Row gap={5} align="center">
          <RenderAssetAmount {...source} />
          <HistoryArrowIcon color={theme.primary.text.lowContrast} />
          <RenderAssetAmount {...destination} />
          <StyledChainName normalTextColor title={destinationAssetDetails.chainName}>
            on {destinationAssetDetails.chainName}
          </StyledChainName>
        </Row>
        <Row align="center" gap={10}>
          <SmallText>{relativeTime}</SmallText>
          {renderStatus}
        </Row>
      </StyledHistoryItemRow>
      {showDetails && (
        <TransactionHistoryPageHistoryItemDetails
          status={status}
          sourceChainName={sourceAssetDetails.chainName ?? "--"}
          destinationChainName={destinationAssetDetails.chainName ?? "--"}
          absoluteTimeString={absoluteTimeString}
          transactionDetails={transactionDetails}
          onClickDelete={() => removeTransactionHistoryItem(index)}
        />
      )}
    </StyledHistoryContainer>
  );
};


const RenderAssetAmount = ({
  amount,
  asset,
  assetImage,
}: {
  amount?: string;
  asset?: ClientAsset;
  assetImage: string;
}) => {
  return (
    <>
      <img height={20} width={20} src={assetImage} />
      <StyledAssetAmount normalTextColor title={amount}>
        {amount}
      </StyledAssetAmount>
      <StyledSymbol normalTextColor>
        {asset?.recommendedSymbol ?? asset?.symbol}
      </StyledSymbol>
    </>
  );
};

const StyledHistoryContainer = styled(Column) <{ showDetails?: boolean }>`
  background-color: ${({ theme, showDetails }) =>
    showDetails && theme.secondary.background.normal};
  &:hover {
    background-color: ${({ theme }) => theme.secondary.background.normal};
  }
  border-radius: 6px;
`;

const StyledHistoryItemRow = styled(Row)`
  padding: 0 10px;
  height: 40px;
  &:hover {
    cursor: pointer;
  }
`;

const StyledGreenDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${({ theme }) => theme.success.text};
  border-radius: 50%;
`;

const StyledAssetAmount = styled(SmallText)`
  max-width: 60px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledSymbol = styled(SmallText)`
  max-width: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledChainName = styled(SmallText)`
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 40px;
  white-space: nowrap;
`;
