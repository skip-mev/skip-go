import { RouteResponse } from "@skip-go/client";
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

export type TxStatus = {
  chainId: string;
  txHash: string;
  explorerLink: string;
  axelarscanLink?: string;
}

export type TxHistoryItem = {
  route: RouteResponse;
  txStatus: TxStatus[];
  timestamp: string;
  status: "pending" | "success" | "failed";
}

export type TxHistoryItemInput = Pick<TxHistoryItem, "route">;

export type TxHistoryState = Record<string, TxHistoryItem>;

type TransactionHistoryModalItemProps = {
  txHistoryItem: TxHistoryItem;
  showDetails?: boolean;
  onClickRow?: () => void;
  onClickTransactionID: () => void;
};

export const TransactionHistoryModalItem = ({
  txHistoryItem,
  showDetails,
  onClickRow,
  onClickTransactionID,
}: TransactionHistoryModalItemProps) => {
  const theme = useTheme();
  const {
    route: {
      amountIn,
      amountOut,
      sourceAssetDenom,
      sourceAssetChainID,
      destAssetDenom,
      destAssetChainID,
    },
    txStatus,
    timestamp,
    status,
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
    chainImage: sourceAssetDetails?.chainImage ?? "",
  };

  const destination = {
    amount: destinationAssetDetails.amount,
    asset: destinationAssetDetails.asset,
    chainImage: destinationAssetDetails.chainImage ?? "",
  };

  const renderStatus = useMemo(() => {
    switch (status) {
      case "pending":
        return (
          <StyledAnimatedBorder
            width={10}
            height={10}
            backgroundColor={theme.primary.text.normal}
            status="broadcasted"
          />
        );
      case "success":
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
          <SmallText normalTextColor>
            on {destinationAssetDetails.chainName}
          </SmallText>
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
          transactionID={txStatus[0].txHash}
          onClickTransactionID={onClickTransactionID}
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
  chainImage,
}: {
  amount?: string;
  asset?: ClientAsset;
  chainImage: string;
}) => {
  return (
    <>
      <img height={20} width={20} src={chainImage} />
      <SmallText normalTextColor>
        {amount}
      </SmallText>
      <SmallText normalTextColor>
        {asset?.recommendedSymbol ?? asset?.symbol}
      </SmallText>
    </>
  );
};
