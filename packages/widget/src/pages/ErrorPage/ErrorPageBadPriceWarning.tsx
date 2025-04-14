import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { calculatePercentageChange } from "@/utils/number";
import { RouteResponse } from "@skip-go/client";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { track } from "@amplitude/analytics-browser";
import { useMemo } from "react";

export type ErrorPageBadPriceWarningProps = {
  onClickContinue: () => void;
  onClickBack: () => void;
  route: RouteResponse;
};

export const ErrorPageBadPriceWarning = ({
  onClickContinue,
  onClickBack,
  route,
}: ErrorPageBadPriceWarningProps) => {
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

  const hasUsdValues =
    usdAmountIn &&
    usdAmountOut &&
    parseFloat(usdAmountIn) > 0 &&
    parseFloat(usdAmountOut) > 0;

  const swapDifferencePercentage = hasUsdValues
    ? `${calculatePercentageChange(usdAmountIn, usdAmountOut, true)}%`
    : null;

  const priceImpactPercentage = useMemo(() => {
    const impactString = route.swapPriceImpactPercent;
    if (!impactString) return null;
    return `${parseFloat(impactString).toFixed(2)}%`;
  }, [route.swapPriceImpactPercent]);

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

  const { title, descriptionContent } = useMemo(() => {
    if (hasUsdValues && swapDifferencePercentage) {
      return {
        title: `Warning: Bad trade (-${swapDifferencePercentage})`,
        descriptionContent: (
          <>
            You will lose {swapDifferencePercentage} of your input value with this trade
            <br />
            Input: {sourceDetails?.amount} {sourceDetails?.symbol} ({usdAmountIn})
            <br />
            Estimated output: {destinationDetails?.amount} {destinationDetails?.symbol} ({usdAmountOut})
          </>
        ),
      };
    } else if (priceImpactPercentage) {
      return {
        title: `Warning: High Price Impact (${priceImpactPercentage})`,
        descriptionContent: (
          <>
            Executing this trade is expected to impact the price by {priceImpactPercentage}. Please verify the amounts.
            <br />
            Input: {sourceDetails?.amount} {sourceDetails?.symbol}
            <br />
            Estimated output: {destinationDetails?.amount} {destinationDetails?.symbol}
          </>
        ),
      };
    } else {
      return {
        title: "Warning: Bad Trade",
        descriptionContent: (
          <>
            This trade may result in a poor execution price. Please verify the amounts carefully.
            <br />
            Input: {sourceDetails?.amount} {sourceDetails?.symbol}
            <br />
            Estimated output: {destinationDetails?.amount} {destinationDetails?.symbol}
          </>
        ),
      };
    }
  }, [
    hasUsdValues,
    swapDifferencePercentage,
    priceImpactPercentage,
    sourceDetails,
    destinationDetails,
    usdAmountIn,
    usdAmountOut,
  ]);

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: bad price warning - header back button clicked");
            onClickBack();
          },
        }}
      />
      <ErrorPageContent
        title={title}
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center" textWrap="balance">
              {descriptionContent}
            </SmallText>
            <SmallTextButton
              onClick={() => {
                track("error page: bad price warning - continue anyway button clicked");
                onClickContinue();
              }}
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
        onClick={() => {
          track("error page: bad price warning - main back button clicked");
          onClickBack();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
