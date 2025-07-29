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
import styled, { css, useTheme } from "styled-components";
import { Row } from "./Layout";
import { SkeletonElement } from "./Skeleton";
import { Switch } from "./Switch";
import { SmallText } from "./Typography";
import { SpinnerIcon } from "@/icons/SpinnerIcon";
import { RouteDetails } from "@skip-go/client";
import { currentTransactionAtom } from "@/state/history";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { convertToPxValue } from "@/utils/style";
import { QuestionMarkTooltip } from "./QuestionMarkTooltip";
import { track } from "@amplitude/analytics-browser";

export type GasOnReceiveProps = {
  routeDetails?: Partial<RouteDetails>;
  hideContainer?: boolean;
};

export const GasOnReceive = ({ routeDetails, hideContainer }: GasOnReceiveProps = {}) => {
  const theme = useTheme();
  const [gasOnReceive, setGasOnReceive] = useAtom(gasOnReceiveAtom);
  const { data: gasRoute, isLoading: fetchingGasRoute } = useAtomValue(gasOnReceiveRouteAtom);
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const isSomeDestinationFeeBalanceAvailable = useAtomValue(
    isSomeDestinationFeeBalanceAvailableAtom,
  );

  const currentTransaction = useAtomValue(currentTransactionAtom);

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

  const amountUsd = routeDetails?.route?.usdAmountOut ?? gasRoute?.gasOnReceiveAsset?.amountUsd;
  const amountOut = routeDetails?.route?.amountOut ?? gasRoute?.gasOnReceiveAsset?.amountOut ?? "";

  const assetSymbol = gasOnReceiveAsset?.recommendedSymbol?.toUpperCase() ?? "";

  const gasOnReceiveText = useMemo(() => {
    const formattedAmountText = amountUsd
      ? `${formatUSD(amountUsd)} in ${assetSymbol}`
      : `${convertTokenAmountToHumanReadableAmount(amountOut, gasOnReceiveAsset?.decimals)} ${assetSymbol}`;

    switch (routeDetails?.status) {
      case "pending":
        return `Receiving ${formattedAmountText}`;
      case "completed":
        return `Received ${formattedAmountText} as gas top-up`;
      case "failed":
        return `Failed to receive ${formattedAmountText} as gas top-up`;
      default:
        return (
          <Row align="center" gap={8}>
            Enable gas top up{" "}
            {
              <QuestionMarkTooltip
                content={
                  <SmallText normalTextColor style={{ whiteSpace: "nowrap" }}>
                    You'll get {formattedAmountText}
                  </SmallText>
                }
              />
            }
          </Row>
        );
    }
  }, [amountOut, amountUsd, assetSymbol, gasOnReceiveAsset?.decimals, routeDetails?.status]);

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
    return (
      <GasIcon color={gasOnReceive ? theme.primary.text.normal : theme.primary.text.lowContrast} />
    );
  }, [
    gasOnReceive,
    routeDetails?.status,
    theme.primary.text.lowContrast,
    theme.primary.text.normal,
  ]);

  if (!routeDetails && (!gasRoute?.gasOnReceiveAsset || !gasOnReceiveAsset || fetchingGasRoute)) {
    return null;
  }

  return (
    <GasOnReceiveContainer hideContainer={hideContainer} align="center" justify="space-between">
      <Row gap={8} align="center">
        {renderIcon}
        {(isFetchingBalance || fetchingGasRoute) && !routeDetails ? (
          <SkeletonElement height={20} width={300} />
        ) : (
          <SmallText
            color={
              routeDetails?.status === "failed"
                ? theme.warning.text
                : gasOnReceive
                  ? theme.primary.text.normal
                  : undefined
            }
          >
            {gasOnReceiveText}
          </SmallText>
        )}
      </Row>
      {routeDetails
        ? null
        : !isFetchingBalance &&
          !currentTransaction && (
            <Switch
              checked={gasOnReceive}
              onChange={(value) => {
                track("gas on receive: toggle button - clicked", {
                  gasOnReceive: value,
                });
                setGasOnReceive(value);
              }}
            />
          )}
    </GasOnReceiveContainer>
  );
};

const GasOnReceiveContainer = styled(Row)<{ hideContainer?: boolean }>`
  ${({ hideContainer, theme }) =>
    !hideContainer &&
    css`
      background-color: ${theme.secondary.background.transparent};
      padding: 15px 20px;
    `}
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.selectionButton)};
`;
