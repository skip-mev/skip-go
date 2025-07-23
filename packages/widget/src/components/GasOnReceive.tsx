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
import { useTheme } from "styled-components";
import { Row } from "./Layout";
import { SkeletonElement } from "./Skeleton";
import { Switch } from "./Switch";
import { SmallText } from "./Typography";
import { SpinnerIcon } from "@/icons/SpinnerIcon";
import { RouteDetails } from "@skip-go/client";
import { currentTransactionAtom } from "@/state/history";

export type GasOnReceiveProps = {
  routeDetails?: RouteDetails;
};

export const GasOnReceive = ({ routeDetails }: GasOnReceiveProps = {}) => {
  const theme = useTheme();
  const [gasOnReceive, setGasOnReceive] = useAtom(gasOnReceiveAtom);
  const { data: gasRoute, isLoading: fetchingGasRoute } = useAtomValue(gasOnReceiveRouteAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const isSomeDestinationFeeBalanceAvailable = useAtomValue(
    isSomeDestinationFeeBalanceAvailableAtom,
  );

  const currentTransaction = useAtomValue(currentTransactionAtom);

  const isGorEnabled = useAtomValue(gasOnReceiveAtom);

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

    switch (routeDetails?.status) {
      case "pending":
        return `Receiving ${formattedAmountText}`;
      case "completed":
        return `Received ${formattedAmountText}`;
      case "failed":
        return `Failed to receive ${formattedAmountText}`;
      default:
        if (isGorEnabled) {
          return `You'll receive ${formattedAmountText}`;
        }
        return "Enable to receive fee asset on destination chain";
    }
  }, [amountUsd, assetSymbol, isGorEnabled, routeDetails?.status]);

  const renderIcon = useMemo(() => {
    if (routeDetails?.status === "pending") {
      return (
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
      );
    }
    return <GasIcon color={theme.primary.text.lowContrast} />;
  }, [routeDetails?.status, theme.primary.text.lowContrast]);

  if (!routeDetails && (!gasRoute?.gasOnReceiveAsset || !gasOnReceiveAsset || fetchingGasRoute)) {
    return null;
  }

  return (
    <Row align="center" justify="space-between">
      <Row gap={8} align="center">
        {renderIcon}
        {isFetchingBalance || fetchingGasRoute ? (
          <SkeletonElement height={20} width={300} />
        ) : (
          <SmallText color={routeDetails?.status === "failed" ? theme.warning.text : undefined}>
            {gasOnReceiveText}
          </SmallText>
        )}
      </Row>
      {!isFetchingBalance && !currentTransaction && !routeDetails && (
        <Switch
          checked={gasOnReceive}
          onChange={(v) => {
            setGasOnReceive(v);
          }}
        />
      )}
    </Row>
  );
};
