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
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { getMobileDateFormat } from "@/utils/date";
import { removeTrailingZeros } from "@/utils/number";
import { useTxHistory } from "@/hooks/useTxHistory";

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
  const isMobileScreenSize = useIsMobileScreenSize();

  const { status, explorerLinks } = useTxHistory({
    txs: txHistoryItem.transactionDetails.map((tx) => ({
      chainID: tx.chainID,
      txHash: tx.txHash,
    })),
    txsRequired: txHistoryItem.route.txsRequired,
  });

  console.log(explorerLinks);

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
      case "incomplete":
      case "failed":
        return <XIcon color={theme.error.text} />;
    }
  }, [status, theme.error.text, theme.primary.text.normal]);

  const absoluteTimeString = useMemo(() => {
    if (isMobileScreenSize) {
      return getMobileDateFormat(new Date(timestamp));
    }
    return new Date(timestamp).toLocaleString();
  }, [isMobileScreenSize, timestamp]);

  const relativeTime = useMemo(() => {
    // get relative time based on timestamp
    if (status === "pending") {
      return "In Progress";
    }
    return formatDistanceStrict(new Date(timestamp), new Date(), {
      addSuffix: true,
    })
      .replace("minutes", "mins")
      .replace("minute", "min")
      .replace("hours", "hrs")
      .replace("hour", "hr")
      .replace("seconds", "secs")
      .replace("second", "sec")
      .replace("months", "mos")
      .replace("month", "mo")
      .replace("years", "yrs")
      .replace("year", "yr");
  }, [status, timestamp]);

  return (
    <StyledHistoryContainer showDetails={showDetails}>
      <StyledHistoryItemRow align="center" justify="space-between" onClick={onClickRow}>
        <StyledHistoryItemContainer gap={5} align="center">
          <RenderAssetAmount {...source} />
          <HistoryArrowIcon color={theme.primary.text.lowContrast} style={{ flexShrink: 0 }} />
          <RenderAssetAmount {...destination} />
          <SmallText
            normalTextColor
            title={destinationAssetDetails.chainName}
            textWrap="nowrap"
            overflowEllipsis
          >
            on {destinationAssetDetails.chainName}
          </SmallText>
        </StyledHistoryItemContainer>
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
  const isMobileScreenSize = useIsMobileScreenSize();
  return (
    <>
      <img height={20} width={20} src={assetImage} />
      <SmallText normalTextColor title={amount}>
        {removeTrailingZeros(amount)}
      </SmallText>
      {!isMobileScreenSize && (
        <SmallText normalTextColor>{asset?.recommendedSymbol ?? asset?.symbol}</SmallText>
      )}
    </>
  );
};

const StyledHistoryContainer = styled(Column)<{ showDetails?: boolean }>`
  background: ${({ theme, showDetails }) => showDetails && theme.secondary.background.normal};
  &:hover {
    background: ${({ theme }) => theme.secondary.background.normal};
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
  background: ${({ theme }) => theme.success.text};
  border-radius: 50%;
`;

const StyledHistoryItemContainer = styled(Row)`
  max-width: calc(100% - 100px);
  overflow: hidden;
`;
