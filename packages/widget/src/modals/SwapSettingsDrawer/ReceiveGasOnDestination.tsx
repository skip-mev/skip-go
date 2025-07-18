import { Row } from "@/components/Layout";
import { SwapDetailText } from "./SwapSettingsDrawer";
import { skipAssetsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { Switch } from "@/components/Switch";
import { formatUSD } from "@/utils/intl";
import { QuestionMarkTooltip } from "@/components/QuestionMarkTooltip";

export type ReceiveGasOnDestinationProps = {
  amountUsd: string;
  feeAsset: {
    chainId: string;
    denom: string;
  };
};

export const ReceiveGasOnDestination = ({ amountUsd, feeAsset }: ReceiveGasOnDestinationProps) => {
  const { data: assets } = useAtomValue(skipAssetsAtom);
  const asset = assets?.find(
    (asset) => asset.denom === feeAsset.denom && asset?.chainId === feeAsset.chainId,
  );

  return (
    <Row justify="space-between" align="center">
      <SwapDetailText gap={5}>
        Receive gas on destination
        <QuestionMarkTooltip
          content={`You'll get ${formatUSD(amountUsd)} in ${asset?.recommendedSymbol}`}
        />
      </SwapDetailText>
      <Row align="center" gap={5} height={25}>
        <Switch />
      </Row>
    </Row>
  );
};
