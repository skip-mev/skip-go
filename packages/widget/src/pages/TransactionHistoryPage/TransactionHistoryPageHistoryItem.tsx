import { Text, SmallText } from "@/components/Typography";
import { ClientAsset } from "@/state/skipClient";
import { Column, Row } from "@/components/Layout";
import { styled, useTheme } from "styled-components";
import { XIcon } from "@/icons/XIcon";
import { forwardRef, useMemo } from "react";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { TransactionHistoryPageHistoryItemDetails } from "./TransactionHistoryPageHistoryItemDetails";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { removeTransactionHistoryItemAtom } from "@/state/history";
import { useSetAtom } from "jotai";
import { formatDistanceStrict } from "date-fns";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { getMobileDateFormat } from "@/utils/date";
import { formatDisplayAmount } from "@/utils/number";
import { useTxHistory } from "@/hooks/useTxHistory";
import { FilledWarningIcon } from "@/icons/FilledWarningIcon";
import { ThinArrowIcon } from "@/icons/ThinArrowIcon";
import { Tooltip } from "@/components/Tooltip";
import { CircleSkeletonElement } from "@/components/Skeleton";
import { convertToPxValue } from "@/utils/style";
import { RouteDetails, TransactionStatus, RouteStatus } from "@skip-go/client";

type TransactionHistoryPageHistoryItemProps = {
  index: number;
  txHistoryItem: RouteDetails & { relatedRoutes?: RouteDetails[] };
  showDetails?: boolean;
  onClickRow?: () => void;
  onClickDelete?: () => void;
};

export const TransactionHistoryPageHistoryItem = forwardRef<
  HTMLDivElement,
  TransactionHistoryPageHistoryItemProps
>(
  (
    {
      txHistoryItem,
      showDetails,
      onClickRow,
      onClickDelete,
    }: TransactionHistoryPageHistoryItemProps,
    ref,
  ) => {
    const theme = useTheme();
    const isMobileScreenSize = useIsMobileScreenSize();

    const historyItem = useTxHistory({
      txHistoryItem,
    });

    const removeTransactionHistoryItem = useSetAtom(removeTransactionHistoryItemAtom);

    const {
      route: {
        amountIn,
        amountOut,
        sourceAssetDenom,
        sourceAssetChainId,
        destAssetDenom,
        destAssetChainId,
      },
      timestamp,
      transactionDetails,
    } = txHistoryItem;

    const sourceAssetDetails = useGetAssetDetails({
      assetDenom: sourceAssetDenom,
      chainId: sourceAssetChainId,
      tokenAmount: amountIn,
    });

    const destinationAssetDetails = useGetAssetDetails({
      assetDenom: destAssetDenom,
      chainId: destAssetChainId,
      tokenAmount: amountOut,
    });

    const source = {
      amount: sourceAssetDetails.amount,
      asset: sourceAssetDetails.asset,
      assetImage: sourceAssetDetails.assetImage ?? "",
      chainName: sourceAssetDetails.chainName,
    };

    const destination = {
      amount: destinationAssetDetails.amount,
      asset: destinationAssetDetails.asset,
      assetImage: destinationAssetDetails.assetImage ?? "",
      chainName: destinationAssetDetails.chainName,
    };

    const feeAssetRouteDetails = useMemo(() => {
      let routeDetails = txHistoryItem?.relatedRoutes?.[0];
      const transactionDetailContainingCosmosFeeAsset = historyItem?.transactionDetails.find(
        (txDetail) => txDetail.routeKeyToStatus?.feeRoute !== undefined,
      );

      const convertTransactionStatusToRouteStatus = (
        transactionStatus?: TransactionStatus,
      ): RouteStatus | undefined => {
        if (!transactionStatus) return;
        if (transactionStatus === "success") {
          return "completed";
        }
        return transactionStatus;
      };

      const cosmosFeeAssetStatus = convertTransactionStatusToRouteStatus(
        transactionDetailContainingCosmosFeeAsset?.routeKeyToStatus?.feeRoute,
      );

      if (cosmosFeeAssetStatus) {
        routeDetails = historyItem;
        if (routeDetails) {
          routeDetails.status = cosmosFeeAssetStatus;
        }
      }
      return routeDetails;
    }, [historyItem, txHistoryItem?.relatedRoutes]);

    const renderStatus = useMemo(() => {
      switch (historyItem?.status) {
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
          if (historyItem?.transferAssetRelease) {
            return <FilledWarningIcon backgroundColor={theme.warning.text} />;
          } else return <XIcon color={theme.error.text} />;
        }
      }
    }, [
      historyItem?.status,
      historyItem?.transferAssetRelease,
      theme.primary.text.normal,
      theme.error.text,
      theme.warning.text,
    ]);

    const absoluteTimeString = useMemo(() => {
      if (isMobileScreenSize) {
        return getMobileDateFormat(new Date(timestamp));
      }
      return new Date(timestamp).toLocaleString();
    }, [isMobileScreenSize, timestamp]);

    const relativeTime = useMemo(() => {
      // get relative time based on timestamp
      if (historyItem?.status === "pending") {
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
    }, [historyItem?.status, timestamp]);

    if (!txHistoryItem.route) return null;

    return (
      <StyledHistoryContainer ref={ref} showDetails={showDetails}>
        <StyledHistoryItemRow align="center" justify="space-between" onClick={onClickRow}>
          <Row gap={8} align="center">
            <RenderAssetAmount {...source} sourceAsset />
            <ThinArrowIcon color={theme.primary.text.lowContrast} direction="right" />
            <RenderAssetAmount {...destination} />
          </Row>
          <Row align="center" gap={6}>
            <SmallText>{relativeTime}</SmallText>
            <Row width={20} align="center" justify="center">
              {renderStatus}
            </Row>
          </Row>
        </StyledHistoryItemRow>
        {showDetails && (
          <TransactionHistoryPageHistoryItemDetails
            status={historyItem?.status}
            transactionDetails={transactionDetails}
            sourceChainName={sourceAssetDetails.chainName ?? "--"}
            destinationChainName={destinationAssetDetails.chainName ?? "--"}
            absoluteTimeString={absoluteTimeString}
            onClickDelete={() => {
              removeTransactionHistoryItem(txHistoryItem.timestamp);
              onClickDelete?.();
            }}
            transferAssetRelease={historyItem?.transferAssetRelease}
            feeAssetRouteDetails={feeAssetRouteDetails}
          />
        )}
      </StyledHistoryContainer>
    );
  },
);

TransactionHistoryPageHistoryItem.displayName = "TransactionHistoryPageHistoryItem";

const RenderAssetAmount = ({
  amount,
  asset,
  assetImage,
  chainName,
  sourceAsset = false,
}: {
  amount?: string;
  asset?: ClientAsset;
  assetImage: string;
  chainName?: string;
  sourceAsset?: boolean;
}) => {
  const isMobileScreenSize = useIsMobileScreenSize();

  const subtitle = useMemo(() => {
    if (!asset) return;
    const verboseString = `${asset?.recommendedSymbol} on ${chainName ?? asset?.chainName}`;
    if (sourceAsset || isMobileScreenSize || verboseString.length > 24) {
      return asset?.recommendedSymbol;
    }
    return verboseString;
  }, [asset, chainName, isMobileScreenSize, sourceAsset]);

  return (
    <Row gap={8} align="center">
      {assetImage ? (
        <img height="auto" width={30} src={assetImage} alt={subtitle} />
      ) : (
        <CircleSkeletonElement height={30} width={30} />
      )}

      <Column style={sourceAsset ? { width: 50 } : undefined}>
        <Tooltip content={amount} style={{ width: "min-content" }}>
          <Text normalTextColor style={{ width: "max-content" }}>
            {formatDisplayAmount(amount, {
              decimals: 2,
            })}
          </Text>
        </Tooltip>
        <SmallText title={asset?.chainName} textWrap="nowrap" overflowEllipsis>
          {subtitle}
        </SmallText>
      </Column>
    </Row>
  );
};

const StyledHistoryContainer = styled(Column)<{ showDetails?: boolean }>`
  background: ${({ theme, showDetails }) => showDetails && theme.secondary.background.normal};
  &:hover {
    background: ${({ theme }) => theme.secondary.background.normal};
  }
  min-height: 55px;
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.rowItem)};
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
