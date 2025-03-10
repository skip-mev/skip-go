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

  const swapDifferencePercentage = `${calculatePercentageChange(
    usdAmountIn ?? 0,
    usdAmountOut ?? 0,
    true,
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
          onClick: () => {
            track("error page: bad price warning - header back button clicked");
            onClickBack();
          },
        }}
      />
      <ErrorPageContent
        title={`Warning: Bad trade (-${swapDifferencePercentage})`}
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center" textWrap="balance">
              You will lose {swapDifferencePercentage} of your input value with this trade
              <br />
              Input: {sourceDetails?.amount} {sourceDetails?.symbol} ({usdAmountIn})
              <br />
              Estimated output: {destinationDetails?.amount} {destinationDetails?.symbol} (
              {usdAmountOut})
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
