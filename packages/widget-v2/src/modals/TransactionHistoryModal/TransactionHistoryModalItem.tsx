import { SmallText } from "@/components/Typography";
import { ClientAsset } from "@/state/skipClient";
import { Column, Row } from "@/components/Layout";
import styled, { useTheme } from "styled-components";
import { XIcon } from "@/icons/XIcon";
import { useMemo } from "react";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { TransactionHistoryModalItemDetails } from "./TransactionHistoryModalItemDetails";
import { HistoryArrowIcon } from "@/icons/HistoryArrowIcon";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { removeTransactionHistoryItemAtom, TransactionHistoryItem } from "@/state/history";
import { useSetAtom } from "jotai";

type TransactionHistoryModalItemProps = {
  index: number;
  txHistoryItem: TransactionHistoryItem;
  showDetails?: boolean;
  onClickRow?: () => void;
};

export const TransactionHistoryModalItem = ({
  index,
  txHistoryItem,
  showDetails,
  onClickRow,
}: TransactionHistoryModalItemProps) => {
  const theme = useTheme();
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
      case "broadcasted":
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
    return "5 mins ago";
  }, [status]);

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
        <TransactionHistoryModalItemDetails
          status={status}
          sourceChainName={sourceAssetDetails.chainName ?? "--"}
          destinationChainName={destinationAssetDetails.chainName ?? "--"}
          absoluteTimeString={absoluteTimeString}
          relativeTimeString={relativeTime}
          transactionDetails={transactionDetails}
          onClickDelete={() => removeTransactionHistoryItem(index)}
        />
      )}
    </StyledHistoryContainer>
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
      <SmallText normalTextColor>
        {asset?.recommendedSymbol ?? asset?.symbol}
      </SmallText>
    </>
  );
};

const StyledAssetAmount = styled(SmallText)`
  max-width: 40px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledChainName = styled(SmallText)`
  max-width: 95px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;