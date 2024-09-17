import { ErrorState } from "@/components/ErrorState";
import { MainButton } from "@/components/MainButton";
import { SmallText, Text } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { RouteResponse } from "@skip-go/client/dist/types";

export type ErrorPageTradeAdditionalSigningRequiredProps = {
  onClickSign: () => void;
  route: RouteResponse;
};

export const ErrorPageTradeAdditionalSigningRequired = ({
  onClickSign,
  route,
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
      <ErrorState
        title={
          <Text>
            Transaction requires an
            <br />
            additional signing step
          </Text>
        }
        description={
          <SmallText>
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
