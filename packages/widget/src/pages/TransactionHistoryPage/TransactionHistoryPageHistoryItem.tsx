import { Text, SmallText } from "@/components/Typography";
import { ClientAsset, skipChainsAtom } from "@/state/skipClient";
import { Column, Row } from "@/components/Layout";
import { styled, useTheme } from "styled-components";
import { XIcon } from "@/icons/XIcon";
import { useMemo } from "react";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { TransactionHistoryPageHistoryItemDetails } from "./TransactionHistoryPageHistoryItemDetails";
import { HistoryArrowIcon } from "@/icons/HistoryArrowIcon";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { removeTransactionHistoryItemAtom, TransactionHistoryItem } from "@/state/history";
import { useAtomValue, useSetAtom } from "jotai";
import { formatDistanceStrict } from "date-fns";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { getMobileDateFormat } from "@/utils/date";
import { removeTrailingZeros } from "@/utils/number";
import { useTxHistory } from "@/hooks/useTxHistory";
import { createExplorerLink } from "@/utils/explorerLink";
import { FilledWarningIcon } from "@/icons/FilledWarningIcon";

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
  const { data: chains } = useAtomValue(skipChainsAtom);

  const {
    status: historyStatus,
    explorerLinks: txHistoryExplorerLinks,
    transferAssetRelease,
  } = useTxHistory({
    txHistoryItem,
    index,
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
    transactionDetails,
  } = txHistoryItem;

  const initialTxHash = transactionDetails?.[0]?.txHash;
  const chainId = transactionDetails?.[0]?.chainID;
  const chainType = chains?.find((chain) => chain.chainID === chainId)?.chainType;
  const derivedExplorerLink = createExplorerLink({
    txHash: initialTxHash,
    chainID: chainId,
    chainType,
  });

  const explorerLinks = useMemo(() => {
    if (txHistoryExplorerLinks.length === 0 && derivedExplorerLink) {
      return [derivedExplorerLink];
    }
    return txHistoryExplorerLinks;
  }, [derivedExplorerLink, txHistoryExplorerLinks]);

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
    switch (historyStatus) {
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
      case "failed": {
        if (transferAssetRelease) {
          return <FilledWarningIcon backgroundColor={theme.warning.text} />;
        } else return <XIcon color={theme.error.text} />;
      }
    }
  }, [
    theme.error.text,
    theme.primary.text.normal,
    theme.warning.text,
    transferAssetRelease,
    historyStatus,
  ]);

  const absoluteTimeString = useMemo(() => {
    if (isMobileScreenSize) {
      return getMobileDateFormat(new Date(timestamp));
    }
    return new Date(timestamp).toLocaleString();
  }, [isMobileScreenSize, timestamp]);

  const relativeTime = useMemo(() => {
    // get relative time based on timestamp
    if (historyStatus === "pending") {
      return "In Progress";
    }
    if (!timestamp) return "";
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
  }, [timestamp, historyStatus]);

  return (
    <StyledHistoryContainer showDetails={showDetails}>
      <StyledHistoryItemRow align="center" justify="space-between" onClick={onClickRow}>
        <StyledHistoryItemContainer gap={8} align="center">
          <RenderAssetAmount {...source} />
          <HistoryArrowIcon color={theme.primary.text.lowContrast} style={{ flexShrink: 0 }} />
          <RenderAssetAmount {...destination} />
        </StyledHistoryItemContainer>
        <Row align="center" gap={10}>
          <SmallText>{relativeTime}</SmallText>
          <Row width={20} align="center" justify="center">
            {renderStatus}
          </Row>
        </Row>
      </StyledHistoryItemRow>
      {showDetails && (
        <TransactionHistoryPageHistoryItemDetails
          status={historyStatus}
          sourceChainName={sourceAssetDetails.chainName ?? "--"}
          destinationChainName={destinationAssetDetails.chainName ?? "--"}
          absoluteTimeString={absoluteTimeString}
          onClickDelete={() => removeTransactionHistoryItem(index)}
          explorerLinks={explorerLinks}
          transferAssetRelease={transferAssetRelease}
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
      <img height={35} width={35} src={assetImage} />
      <Column>
        <Text normalTextColor title={amount}>
          {removeTrailingZeros(amount)}
        </Text>
        <SmallText title={asset?.chainName} textWrap="nowrap" overflowEllipsis>
          {asset?.chainName}
        </SmallText>
      </Column>
    </>
  );
};

const StyledHistoryContainer = styled(Column)<{ showDetails?: boolean }>`
  background: ${({ theme, showDetails }) => showDetails && theme.secondary.background.normal};
  &:hover {
    background: ${({ theme }) => theme.secondary.background.normal};
  }
  min-height: 55px;
  border-radius: 6px;
  justify-content: center;
`;

const StyledHistoryItemRow = styled(Row)`
  gap: 5px;
  padding: 0 10px;
  height: 55px;
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
