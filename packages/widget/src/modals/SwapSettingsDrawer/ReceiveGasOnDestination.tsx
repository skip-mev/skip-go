import { Row } from "@/components/Layout";
import { SwapDetailText } from "./SwapSettingsDrawer";
import { skipAssetsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { Switch } from "@/components/Switch";
import { Tooltip } from "@/components/Tooltip";
import { SmallText } from "@/components/Typography";
import { QuestionMarkIcon } from "@/icons/QuestionMarkIcon";
import { formatUSD } from "@/utils/intl";

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

  console.log(asset);

  return (
    <Row justify="space-between" align="center">
      <SwapDetailText gap={5}>
        Receive gas on destination
        <Tooltip content={`You'll get ${formatUSD(amountUsd)} in ${asset?.recommendedSymbol}`}>
          <QuestionMarkIcon />
        </Tooltip>
      </SwapDetailText>
      <Row align="center" gap={5} height={25}>
        <Switch />
      </Row>
    </Row>
  );
};
