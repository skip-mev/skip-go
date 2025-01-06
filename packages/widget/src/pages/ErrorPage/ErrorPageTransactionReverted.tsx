import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { ClientOperation } from "@/utils/clientType";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { currentPageAtom, Routes } from "@/state/router";
import { errorAtom } from "@/state/errorPage";
import { useSetAtom } from "jotai";
import { captureException } from "@sentry/react";
import { useEffect } from "react";

export type ErrorPageTransactionRevertedProps = {
  explorerUrl: string;
  revertedOperation: ClientOperation;
  recoveryAddress: string;
  onClickContinueTransaction: () => void;
  onClickBack: () => void;
};

export const ErrorPageTransactionReverted = ({
  explorerUrl,
  revertedOperation,
  recoveryAddress,
  onClickContinueTransaction,
  onClickBack,
}: ErrorPageTransactionRevertedProps) => {

  useEffect(() => {
    captureException("TransactionReverted");
  }, []);

  const setErrorAtom = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const theme = useTheme();

  const assetDenom = revertedOperation.denomIn ?? revertedOperation.denom;

  const assetDetails = useGetAssetDetails({
    assetDenom: assetDenom,
    tokenAmount: revertedOperation.amountIn,
    chainId: revertedOperation?.fromChainID ?? revertedOperation.chainID,
  });

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            setErrorAtom(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          }
        }}
      />
      <ErrorPageContent
        title="Action Required"
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center" textWrap="balance">
              This transaction reverted while trying to execute.
              <br />
              You can continue executing this transaction now.
            </SmallText>
            <SmallText
              color={theme.primary.text.lowContrast}
              textAlign="center"
              textWrap="balance"
            >
              Current asset location: {assetDetails?.amount}{" "}
              {assetDetails?.symbol} on {assetDetails?.chainName} (
              {recoveryAddress})
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
                View on explorer
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
        icon={ICONS.rightArrow}
        onClick={onClickContinueTransaction}
      />
    </>
  );
};
