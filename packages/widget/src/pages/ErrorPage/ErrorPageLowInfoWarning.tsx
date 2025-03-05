import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { RouteResponse } from "@skip-go/client";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";

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
    sourceAssetChainID,
    destAssetDenom,
    destAssetChainID,
  } = route;

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
            <SmallTextButton onClick={onClickContinue} color={theme.primary.text.lowContrast}>
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
        onClick={onClickBack}
        backgroundColor={theme.warning.text}
      />
    </>
  );
};
