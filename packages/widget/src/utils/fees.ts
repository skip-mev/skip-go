import { formatUSD } from "@/utils/intl";
import { convertTokenAmountToHumanReadableAmount } from "./crypto";
import { FeeType, Fee, RouteResponse, BridgeType } from "@skip-go/client";
import { formatDisplayAmount } from "./number";

export type FeeDetail = {
  assetAmount: number;
  formattedAssetAmount: string;
  usdAmount: number;
  formattedUsdAmount?: string;
};
export type LabeledFee = {
  label: string;
  fee: FeeDetail;
};

const getFeeDetail = (estimatedFee: Fee): FeeDetail => {
  const humanReadableAmount = convertTokenAmountToHumanReadableAmount(
    estimatedFee.amount ?? 0,
    estimatedFee.originAsset.decimals,
  );
  const totalUsd = Number(estimatedFee.usdAmount);

  return {
    assetAmount: Number(humanReadableAmount),
    formattedAssetAmount: `${formatDisplayAmount(humanReadableAmount)} ${estimatedFee.originAsset.symbol}`,
    usdAmount: totalUsd,
    formattedUsdAmount: formatUSD(totalUsd.toString()),
  };
};

const BRIDGE_ID_TO_LABEL_MAP: Record<BridgeType, string> = {
  [BridgeType.IBC]: "IBC",
  [BridgeType.AXELAR]: "Axelar",
  [BridgeType.HYPERLANE]: "Hyperlane",
  [BridgeType.GO_FAST]: "Go-Fast",
  [BridgeType.OPINIT]: "OpInit",
  [BridgeType.CCTP]: "CCTP",
  [BridgeType.EUREKA]: "IBC Eureka",
  [BridgeType.STARGATE]: "Stargate",
  [BridgeType.LAYER_ZERO]: "Layer Zero",
};

export function getFeeList(route: RouteResponse): LabeledFee[] {
  if (!route.estimatedFees || route.estimatedFees.length === 0) {
    return [];
  }

  return route.estimatedFees.map((fee) => {
    if (fee.feeType === FeeType.SMART_RELAY) {
      return {
        label: "Smart Relay Fee",
        fee: getFeeDetail(fee),
      };
    }

    const label = fee.bridgeId
      ? `${BRIDGE_ID_TO_LABEL_MAP[fee.bridgeId]} Bridging Fee`
      : "Bridging Fee";
    const feeDetail = getFeeDetail(fee);

    return {
      label,
      fee: feeDetail,
    };
  });
}

export function getTotalFees(fees: LabeledFee[]): FeeDetail | undefined {
  if (!fees.length) return;

  const totalAsset = fees.reduce((s, { fee }) => s + fee.assetAmount, 0);
  const totalUsd = fees.reduce((s, { fee }) => s + fee.usdAmount, 0);
  if (totalUsd === 0) return;
  const symbol = fees[0].fee.formattedAssetAmount.split(" ")[1];

  return {
    assetAmount: totalAsset,
    formattedAssetAmount: `${totalAsset.toFixed(6)} ${symbol}`,
    usdAmount: totalUsd,
    formattedUsdAmount: formatUSD(totalUsd.toString()),
  };
}
