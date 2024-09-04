import { ErrorState } from "@/components/ErrorState";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { skipAssetsAtom } from "@/state/skipClient";
import { getFormattedAssetAmount } from "@/utils/crypto";
import { formatUSD } from "@/utils/intl";
import { RouteResponse } from "@skip-go/client/dist/types";
import { useAtom } from "jotai";
import { useTheme } from "styled-components";

export type ErrorPageTradeWarningProps = {
  swapDifferencePercentage: string;
  onClickContinue: () => void;
  onClickBack: () => void;
  route: RouteResponse;
};

export const ErrorPageTradeWarning = ({
  swapDifferencePercentage,
  onClickContinue,
  onClickBack,
  route,
}: ErrorPageTradeWarningProps) => {
  const theme = useTheme();

  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const { amountIn, amountOut, usdAmountIn, usdAmountOut, sourceAssetDenom, destAssetDenom } = route;

  const sourceAsset = assets?.find(asset => asset.denom === sourceAssetDenom);
  const destinationAsset = assets?.find(asset => asset.denom === destAssetDenom);

  return (
    <>
      <ErrorState
        title={`Warning: Bad trade (-${swapDifferencePercentage})`}
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center">
              You will lose ~{swapDifferencePercentage} of your input value with this trade
              <br />
              Input: {getFormattedAssetAmount(amountIn, sourceAsset?.decimals)} {sourceAsset?.recommendedSymbol} {usdAmountIn && `(${formatUSD(usdAmountIn)})`}
              <br />
              Estimated output: ~{getFormattedAssetAmount(amountOut, destinationAsset?.decimals)} {destinationAsset?.recommendedSymbol} {usdAmountOut && `(${formatUSD(usdAmountOut)})`}
            </SmallText>
            <SmallTextButton
              onClick={onClickContinue}
              color={theme.primary.text.lowContrast}
            >
              I know the risk, continue anyway
            </SmallTextButton>
          </>
        }
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton label="Back" leftIcon={ICONS.leftArrow} onClick={onClickBack} />
    </>
  );
};
