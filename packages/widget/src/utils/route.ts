import { formatUSD } from "@/utils/intl";
import { convertTokenAmountToHumanReadableAmount } from "./crypto";
import { FeeType, Fee, RouteResponse } from "@skip-go/client";
import { ClientOperation, OperationType, getClientOperations } from "./clientType";

export type FeeDetail = {
  assetAmount: number;
  formattedAssetAmount: string;
  formattedUsdAmount?: string;
};
export type LabeledFee = {
  label: string;
  fee: FeeDetail;
};

/** Turn a ClientOperation into a FeeDetail */
const computeOpFee = (op: ClientOperation): FeeDetail | undefined => {
  if (op.type === OperationType.goFastTransfer && op.fee) {
    const {
      feeAsset,
      sourceChainFeeAmount,
      destinationChainFeeAmount,
      bpsFeeAmount,
      sourceChainFeeUsd,
      destinationChainFeeUsd,
      bpsFeeUsd,
    } = op.fee;

    const totalAmt = [sourceChainFeeAmount, destinationChainFeeAmount, bpsFeeAmount]
      .reduce((s, a) => s + Number(a), 0)
      .toString();
    const totalUsd = [sourceChainFeeUsd, destinationChainFeeUsd, bpsFeeUsd].reduce(
      (s, u) => s + Number(u),
      0,
    );

    const human = convertTokenAmountToHumanReadableAmount(totalAmt, feeAsset.decimals);

    return {
      assetAmount: Number(human),
      formattedAssetAmount: `${human} ${feeAsset.symbol}`,
      formattedUsdAmount: formatUSD(totalUsd.toString()),
    };
  }

  // all other ops have a simple fee + usdFeeAmount
  const { feeAmount, feeAsset, usdFeeAmount } = op;
  if (!feeAmount || !feeAsset?.decimals) return;

  const human = convertTokenAmountToHumanReadableAmount(feeAmount, feeAsset.decimals);

  return {
    assetAmount: Number(human),
    formattedAssetAmount: `${human} ${feeAsset.symbol}`,
    formattedUsdAmount: usdFeeAmount ? formatUSD(usdFeeAmount) : undefined,
  };
};

function computeSmartRelayFee(estimatedFees: Fee[]): FeeDetail | undefined {
  const relay = estimatedFees.filter((f) => f.feeType === FeeType.SMART_RELAY);
  if (!relay.length) return;

  const totalAmt = relay.reduce((s, f) => s + Number(f.amount), 0).toString();
  const totalUsd = relay.reduce((s, f) => s + Number(f.usdAmount), 0);

  const { originAsset } = relay[0];
  const decimals = originAsset.decimals ?? 6;
  const human = convertTokenAmountToHumanReadableAmount(totalAmt, decimals);

  return {
    assetAmount: Number(human),
    formattedAssetAmount: `${human} ${originAsset.symbol}`,
    formattedUsdAmount: formatUSD(totalUsd.toString()),
  };
}

export function getFeeList(route: RouteResponse): LabeledFee[] {
  const fees: LabeledFee[] = [];

  if (!route.operations) return fees;
  const clientOps = getClientOperations(route.operations);
  clientOps.forEach((op) => {
    const fee = computeOpFee(op);
    if (!fee) return;

    let label = "Bridge Fee";
    switch (op.type) {
      case OperationType.axelarTransfer:
        label = "Axelar Bridging Fee";
        break;
      case OperationType.hyperlaneTransfer:
        label = "Hyperlane Bridging Fee";
        break;
      case OperationType.goFastTransfer:
        label = "Go-Fast Transfer Fee";
        break;
    }

    fees.push({ label, fee });
  });

  // 2) if smart-relay is present, append it too
  const smartFee = computeSmartRelayFee(route.estimatedFees || []);
  if (smartFee) {
    fees.push({ label: "Smart Relay Fee", fee: smartFee });
  }

  return fees;
}

export function getTotalFees(fees: LabeledFee[]): FeeDetail | undefined {
  if (!fees.length) return;

  const totalAsset = fees.reduce((s, { fee }) => s + fee.assetAmount, 0);
  const totalUsd = fees.reduce(
    (s, { fee }) =>
      s + (fee.formattedUsdAmount ? Number(fee.formattedUsdAmount.replace(/[^0-9.-]/g, "")) : 0),
    0,
  );
  const symbol = fees[0].fee.formattedAssetAmount.split(" ")[1];

  return {
    assetAmount: totalAsset,
    formattedAssetAmount: `${totalAsset.toFixed(6)} ${symbol}`,
    formattedUsdAmount: totalUsd > 0 ? formatUSD(totalUsd.toString()) : undefined,
  };
}
