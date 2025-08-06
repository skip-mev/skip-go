import { ErrorWarningPageContent } from "@/pages/ErrorWarningPage/ErrorWarningPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import styled, { useTheme } from "styled-components";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { track } from "@amplitude/analytics-browser";
import { RouteResponse } from "@skip-go/client";
import { PageHeader } from "@/components/PageHeader";

export type WarningPageLowInfoProps = {
  onClickContinue: () => void;
  onClickBack: () => void;
  route: RouteResponse;
};

export const WarningPageLowInfo = ({
  onClickContinue,
  onClickBack,
  route,
}: WarningPageLowInfoProps) => {
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
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("warning page: low info - header back button clicked");
            onClickBack();
          },
        }}
      />
      <ErrorWarningPageContent
        title="Warning: Incomplete Price Data"
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center" textWrap="balance">
              <StyledDescriptionContent>
                USD price data is missing for one of the assets, please double check the input and
                output amounts are acceptable before continuing.
                <br />
                {sourceDetails.amount} {sourceDetails.symbol} → {destinationDetails.amount}{" "}
                {destinationDetails.symbol}
              </StyledDescriptionContent>
            </SmallText>
            <SmallTextButton
              onClick={() => {
                track("warning page: low info - continue anyway clicked");
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
          track("warning page: low info - main back button clicked");
          onClickBack();
        }}
        backgroundColor={theme.warning.text}
      />
    </>
  );
};

const StyledDescriptionContent = styled.div`
  line-height: 1.5;
`;
