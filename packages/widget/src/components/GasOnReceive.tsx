import { GasIcon } from "@/icons/GasIcon";
import {
  gasOnReceiveAtom,
  gasOnReceiveRouteAtom,
  isSomeDestinationFeeBalanceAvailableAtom,
} from "@/state/gasOnReceive";
import { skipAssetsAtom } from "@/state/skipClient";
import { formatUSD } from "@/utils/intl";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { Row } from "./Layout";
import { SkeletonElement } from "./Skeleton";
import { Switch } from "./Switch";
import { SmallText } from "./Typography";
import { currentTransactionAtom } from "@/state/history";
import { SpinnerIcon } from "@/icons/SpinnerIcon";
import { RouteDetails } from "@skip-go/client";

export type GasOnReceiveProps = {
  routeDetails?: RouteDetails;
};

export const GasOnReceive = ({ routeDetails }: GasOnReceiveProps = {}) => {
  const theme = useTheme();
  const [gasOnReceive, setGasOnReceive] = useAtom(gasOnReceiveAtom);
  const { data: gasRoute, isLoading: fetchingGasRoute } = useAtomValue(gasOnReceiveRouteAtom);
  const currentTransaction = useAtomValue(currentTransactionAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const isSomeDestinationFeeBalanceAvailable = useAtomValue(
    isSomeDestinationFeeBalanceAvailableAtom,
  );

  const isLoading = routeDetails?.status === "pending" || currentTransaction?.status === "pending";

  const isFetchingBalance = isSomeDestinationFeeBalanceAvailable.isLoading;
  const gasOnReceiveAsset = useMemo(() => {
    const gasAsset = routeDetails
      ? { chainId: routeDetails.route?.destAssetChainId, denom: routeDetails.route?.destAssetDenom }
      : gasRoute?.gasOnReceiveAsset;

    if (!gasAsset) return;

    const asset = assets?.find(
      (a) => a.chainId === gasAsset?.chainId && a.denom === gasAsset?.denom,
    );
    return asset;
  }, [assets, gasRoute?.gasOnReceiveAsset, routeDetails]);

  const amountUsd =
    routeDetails?.route?.usdAmountOut ?? gasRoute?.gasOnReceiveAsset?.amountUsd ?? "";
  const assetSymbol = gasOnReceiveAsset?.recommendedSymbol?.toUpperCase() ?? "";

  const gasOnReceiveText = useMemo(() => {
    const formattedAmountText = `${formatUSD(amountUsd)} in ${assetSymbol} as gas top-up`;

    const isCompleted = routeDetails?.status === "completed";

    if (isCompleted) {
      return `Received ${formattedAmountText}`;
    }

    if (isLoading) {
      return `Receiving ${formattedAmountText}`;
    }
    if (gasOnReceive) {
      return `You'll receive ${formattedAmountText}`;
    }
    return "Enable to receive fee asset on destination chain";
  }, [
    gasOnReceive,
    gasOnReceiveAsset?.recommendedSymbol,
    gasRoute?.gasOnReceiveAsset?.amountUsd,
    isLoading,
    routeDetails?.status,
  ]);

  // if (!gasRoute?.gasOnReceiveAsset) {
  //   return null;
  // }
  return (
    <GasOnReceiveWrapper>
      <>
        <Row gap={8} align="center">
          {isLoading ? (
            <SmallText
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                position: "relative",
              }}
            >
              <SpinnerIcon
                style={{
                  animation: "spin 1s linear infinite",
                  position: "absolute",
                  height: 14,
                  width: 14,
                }}
              />
            </SmallText>
          ) : (
            <GasIcon color={theme.primary.text.lowContrast} />
          )}
          {isFetchingBalance || fetchingGasRoute ? (
            <SkeletonElement height={20} width={300} />
          ) : (
            <SmallText>{gasOnReceiveText}</SmallText>
          )}
        </Row>
        {!isFetchingBalance && currentTransaction?.status === "unconfirmed" && (
          <Switch
            checked={gasOnReceive}
            onChange={(v) => {
              setGasOnReceive(v);
            }}
          />
        )}
      </>
    </GasOnReceiveWrapper>
  );
};

const GasOnReceiveWrapper = styled(Row)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.secondary.background.normal};
`;
