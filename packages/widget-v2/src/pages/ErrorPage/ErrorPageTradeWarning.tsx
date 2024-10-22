import { ErrorState } from "@/components/ErrorState";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { calculatePercentageDifference } from "@/utils/number";
import { RouteResponse } from "@skip-go/client";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";

export type ErrorPageTradeWarningProps = {
  onClickContinue: () => void;
  onClickBack: () => void;
  route: RouteResponse;
};

export const ErrorPageTradeWarning = ({
  onClickContinue,
  onClickBack,
  route,
}: ErrorPageTradeWarningProps) => {
  const theme = useTheme();
  const {
    amountIn,
    amountOut,
    usdAmountIn,
    usdAmountOut,
    sourceAssetDenom,
    sourceAssetChainID,
    destAssetDenom,
    destAssetChainID,
  } = route;

  const swapDifferencePercentage = `${calculatePercentageDifference(
    usdAmountIn ?? 0,
    usdAmountOut ?? 0,
    true
  )}%`;

  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAssetDenom,
    chainId: sourceAssetChainID,
    tokenAmount: amountIn,
  });
  const destinationDetails = useGetAssetDetails({
    assetDenom: destAssetDenom,
    chainId: destAssetChainID,
    tokenAmount: amountOut,
  });

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: onClickBack,
        }}
      />
      <ErrorState
        title={`Warning: Bad trade (-${swapDifferencePercentage})`}
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center">
              You will lose ~{swapDifferencePercentage} of your input value with
              this trade
              <br />
              Input: {sourceDetails?.amount} {sourceDetails?.symbol} ({usdAmountIn})
              <br />
              Estimated output: ~{destinationDetails?.amount}{" "}
              {destinationDetails?.symbol} ({usdAmountOut})
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
      <MainButton
        label="Back"
        icon={ICONS.leftArrow}
        onClick={onClickBack}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
