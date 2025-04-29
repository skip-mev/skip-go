import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { track } from "@amplitude/analytics-browser";
import { RouteResponse } from "@skip-go/client";

export type ErrorPageLowInfoWarningProps = {
  onClickContinue: () => void;
  onClickBack: () => void;
  route: RouteResponse;
};

export const ErrorPageLowInfoWarning = ({
  onClickContinue,
  onClickBack,
  route,
}: ErrorPageLowInfoWarningProps) => {
  const theme = useTheme();
  const {
    amountIn,
    amountOut,
    sourceAssetDenom,
    sourceAssetChainId,
    destAssetDenom,
    destAssetChainId,
  } = route;

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

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: low info warning - header back button clicked");
            onClickBack();
          },
        }}
      />
      <ErrorPageContent
        title="Warning: Incomplete Price Data"
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center" textWrap="balance">
              USD price data is missing for one of the assets, please double check the input and
              output amounts are acceptable before continuing.
              <br />
              {sourceDetails.amount} {sourceDetails.symbol} → {destinationDetails.amount}{" "}
              {destinationDetails.symbol}
            </SmallText>
            <SmallTextButton
              onClick={() => {
                track("error page: low info warning - continue anyway clicked");
                onClickContinue();
              }}
              color={theme.primary.text.lowContrast}
            >
              I know the risk, continue anyway
            </SmallTextButton>
          </>
        }
        icon={ICONS.triangleWarning}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton
        label="Back"
        icon={ICONS.leftArrow}
        onClick={() => {
          track("error page: low info warning - main back button clicked");
          onClickBack();
        }}
        backgroundColor={theme.warning.text}
      />
    </>
  );
};
