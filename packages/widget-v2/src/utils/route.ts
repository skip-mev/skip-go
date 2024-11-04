import { formatUSD } from "@/utils/intl";
import { EstimatedFee, RouteResponse } from "@skip-go/client";

export enum FeeType {
  SMART_RELAY = "SMART_RELAY",
}

export const checkIsSmartRelay = (
  route: RouteResponse | undefined
): boolean => {
  return !!route?.estimatedFees?.some(
    (fee) => fee.feeType === FeeType.SMART_RELAY
  );
};

export const calculateSmartRelayFee = (
  isSmartRelay: boolean,
  estimatedFees: EstimatedFee[] | undefined
) => {
  if (!isSmartRelay || !estimatedFees) return undefined;

  const relayFees = estimatedFees.filter(
    (fee) => fee.feeType === FeeType.SMART_RELAY
  );

  const sameAsset = relayFees.every(
    (fee, _, arr) => fee.originAsset.symbol === arr[0].originAsset.symbol
  );

  if (!sameAsset) return undefined;

  const computedAmount = relayFees.reduce(
    (acc, fee) => acc + Number(fee.amount),
    0
  );

  const computedUsd = relayFees.reduce(
    (acc, fee) => acc + Number(fee.usdAmount),
    0
  );

  if (!computedAmount || !computedUsd) return undefined;

  const assetDecimals = relayFees[0].originAsset.decimals || 6;
  const inAsset = (computedAmount / Math.pow(10, assetDecimals)).toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 6,
    }
  );

  return {
    assetAmount: Number(inAsset),
    formattedAssetAmount: `${inAsset} ${relayFees[0].originAsset.symbol}`,
    formattedUsdAmount: `${formatUSD(computedUsd)}`,
  };
};
