import { ErrorState } from "@/components/ErrorState";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { ClientOperation } from "@/utils/clientType";
import { useTheme } from "styled-components";

export type ErrorPageTransactionRevertedProps = {
  explorerUrl: string;
  revertedOperation: ClientOperation;
  recoveryAddress: string;
  onClickContinueTransaction: () => void;
};

export const ErrorPageTransactionReverted = ({
  explorerUrl,
  revertedOperation,
  recoveryAddress,
  onClickContinueTransaction,
}: ErrorPageTransactionRevertedProps) => {
  const theme = useTheme();

  const assetDenom = (revertedOperation.denomIn ?? revertedOperation.denom);

  const assetDetails = useGetAssetDetails({
    assetDenom: assetDenom,
    amount: revertedOperation.amountIn,
    chainId: revertedOperation?.fromChainID ?? revertedOperation.chainID
  });

  return (
    <>
      <ErrorState
        title="Action Required"
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center">
              This transaction reverted while trying to execute.
              <br />
              You can continue executing this transaction now.
            </SmallText>
            <SmallText
              color={theme.primary.text.lowContrast}
              textAlign="center"
            >
              Current asset location: {assetDetails?.formattedAmount} {assetDetails?.symbol} on {assetDetails?.chainName} ({recoveryAddress})
            </SmallText>
            <Row gap={25} justify="center">
              <Row
                gap={5}
                align="center"
                as={SmallTextButton}
                onClick={() => window.open(explorerUrl, "_blank")}
                color={theme.primary.text.lowContrast}
              >
                <ChainIcon color={theme.primary.text.lowContrast} />
                View on mintscan
              </Row>
            </Row>
          </>
        }
        icon={ICONS.warning}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton
        label="Continue transaction"
        backgroundColor={theme.warning.text}
        leftIcon={ICONS.rightArrow}
        onClick={onClickContinueTransaction}
      />
    </>
  );
};
