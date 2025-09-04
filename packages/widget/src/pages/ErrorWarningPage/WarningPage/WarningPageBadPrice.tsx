import { ErrorWarningPageContent } from "@/pages/ErrorWarningPage/ErrorWarningPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { calculatePercentageChange } from "@/utils/number";
import { useTheme } from "styled-components";
import { track } from "@amplitude/analytics-browser";
import { useMemo } from "react";
import { RouteResponse } from "@skip-go/client";
import { PageHeader } from "@/components/PageHeader";
import { styled } from "styled-components";
import { isMobile } from "@/utils/os";

export type WarningPageBadPriceProps = {
  onClickContinue: () => void;
  onClickBack: () => void;
  route: RouteResponse;
};

export const WarningPageBadPrice = ({
  onClickContinue,
  onClickBack,
  route,
}: WarningPageBadPriceProps) => {
  const theme = useTheme();
  const {
    amountIn,
    amountOut,
    usdAmountIn,
    usdAmountOut,
    sourceAssetDenom,
    sourceAssetChainId,
    destAssetDenom,
    destAssetChainId,
  } = route;

  const hasUsdValues =
    usdAmountIn && usdAmountOut && parseFloat(usdAmountIn) > 0 && parseFloat(usdAmountOut) > 0;

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
    chainId: sourceAssetChainId,
    tokenAmount: amountIn,
  });
  const destinationDetails = useGetAssetDetails({
    assetDenom: destAssetDenom,
    chainId: destAssetChainId,
    tokenAmount: amountOut,
  });

  const errorPageContent = useMemo(() => {
    if (hasUsdValues && swapDifferencePercentage) {
      return {
        title: `Warning: Bad trade (-${swapDifferencePercentage})`,
        descriptionContent: (
          <StyledDescriptionContent>
            {isMobile() && (
              <>
                You may get a better quote on desktop because 2 tx routes are disabled on mobile
                <br />
              </>
            )}
            You will lose {swapDifferencePercentage} of your input value with this trade
            <br />
            Input: {sourceDetails?.amount} {sourceDetails?.symbol} (${usdAmountIn})
            <br />
            Estimated output: {destinationDetails?.amount} {destinationDetails?.symbol} ($
            {usdAmountOut})
          </StyledDescriptionContent>
        ),
      };
    }
    if (priceImpactPercentage) {
      return {
        title: `Warning: High Price Impact (${priceImpactPercentage})`,
        descriptionContent: (
          <>
            Executing this trade is expected to impact the price by {priceImpactPercentage}. Please
            verify the amounts.
            <br />
          </>
        ),
      };
    }
    return {
      title: "Warning: Bad Trade",
      descriptionContent: (
        <>
          This trade may result in a poor execution price. Please verify the amounts carefully.
          <br />
        </>
      ),
    };
  }, [
    destinationDetails?.amount,
    destinationDetails?.symbol,
    hasUsdValues,
    priceImpactPercentage,
    sourceDetails?.amount,
    sourceDetails?.symbol,
    swapDifferencePercentage,
    usdAmountIn,
    usdAmountOut,
  ]);

  const { title, descriptionContent } = errorPageContent;

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("warning page: bad price - header back button clicked");
            onClickBack();
          },
        }}
      />
      <ErrorWarningPageContent
        title={title}
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center" textWrap="balance">
              {descriptionContent}
            </SmallText>
            <SmallTextButton
              onClick={() => {
                track("warning page: bad price - continue anyway button clicked");
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
          track("warning page: bad price - main back button clicked");
          onClickBack();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};

const StyledDescriptionContent = styled.div`
  line-height: 1.5;
`;
