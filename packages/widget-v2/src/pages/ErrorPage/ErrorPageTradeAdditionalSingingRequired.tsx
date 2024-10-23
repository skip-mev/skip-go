import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText, Text } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { RouteResponse } from "@skip-go/client/dist/types";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";

export type ErrorPageTradeAdditionalSigningRequiredProps = {
  onClickSign: () => void;
  onClickBack: () => void;
  route: RouteResponse;
};

export const ErrorPageTradeAdditionalSigningRequired = ({
  onClickSign,
  route,
  onClickBack,
}: ErrorPageTradeAdditionalSigningRequiredProps) => {
  const { amountIn, amountOut, sourceAssetDenom, destAssetDenom } = route;

  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAssetDenom,
    tokenAmount: amountIn,
  });
  const destinationDetails = useGetAssetDetails({
    assetDenom: destAssetDenom,
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
        title={
          <Text>
            Transaction requires an
            <br />
            additional signing step
          </Text>
        }
        description={
          <SmallText textWrap="balance">
            {sourceDetails.amount} {sourceDetails.symbol} {" -> "}
            {destinationDetails.amount} {destinationDetails.symbol}
          </SmallText>
        }
        icon={ICONS.signature}
      />
      <MainButton
        label="Authorize in wallet"
        icon={ICONS.rightArrow}
        onClick={onClickSign}
      />
    </>
  );
};
