import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { PageHeader } from "../../components/PageHeader";
import { currentPageAtom, Routes } from "@/state/router";
import { errorAtom } from "@/state/errorPage";
import { useSetAtom } from "jotai";
import { track } from "@amplitude/analytics-browser";
import { TransferAssetRelease } from "@skip-go/client";

export type ErrorPageTransactionRevertedProps = {
  explorerUrl: string;
  transferAssetRelease?: TransferAssetRelease;
  onClickContinueTransaction: () => void;
  onClickBack?: () => void;
};

export const ErrorPageTransactionReverted = ({
  explorerUrl,
  transferAssetRelease,
  onClickContinueTransaction,
  onClickBack,
}: ErrorPageTransactionRevertedProps) => {
  const setErrorAtom = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const theme = useTheme();

  const assetDetails = useGetAssetDetails({
    assetDenom: transferAssetRelease?.denom,
    tokenAmount: transferAssetRelease?.amount,
    chainId: transferAssetRelease?.chainId,
  });

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: transaction reverted - header back button clicked");
            setErrorAtom(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
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
            <SmallText color={theme.primary.text.lowContrast} textAlign="center" textWrap="balance">
              Current asset location: {assetDetails?.amount} {assetDetails?.symbol} on{" "}
              {assetDetails?.chainName}
            </SmallText>
            <Row gap={25} justify="center">
              <Row
                gap={5}
                align="center"
                as={SmallTextButton}
                onClick={() => {
                  track("error page: transaction reverted - view on explorer clicked");
                  window.open(explorerUrl, "_blank");
                }}
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
        onClick={() => {
          track("error page: transaction reverted - main continue button clicked");
          onClickContinueTransaction();
        }}
      />
    </>
  );
};
