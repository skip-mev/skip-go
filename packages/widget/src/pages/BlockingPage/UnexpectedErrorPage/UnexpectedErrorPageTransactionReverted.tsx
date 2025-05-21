import { BlockingPageContent } from "@/pages/BlockingPage/BlockingPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { currentPageAtom, Routes } from "@/state/router";
import { blockingPageAtom } from "@/state/blockingPage";
import { useSetAtom } from "jotai";
import { track } from "@amplitude/analytics-browser";
import { TransferAssetRelease } from "@skip-go/client";

export type UnexpectedErrorPageTransactionRevertedProps = {
  explorerUrl: string;
  transferAssetRelease?: TransferAssetRelease;
  onClickContinueTransaction: () => void;
  onClickBack?: () => void;
};

export const UnexpectedErrorPageTransactionReverted = ({
  explorerUrl,
  transferAssetRelease,
  onClickContinueTransaction,
  onClickBack,
}: UnexpectedErrorPageTransactionRevertedProps) => {
  const setBlockingPageAtom = useSetAtom(blockingPageAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const theme = useTheme();

  const assetDetails = useGetAssetDetails({
    assetDenom: transferAssetRelease?.denom,
    tokenAmount: transferAssetRelease?.amount,
    chainId: transferAssetRelease?.chainId,
  });

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("unexpected error page: transaction reverted - header back button clicked");
            setBlockingPageAtom(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <BlockingPageContent
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
                  track("unexpected error page: transaction reverted - view on explorer clicked");
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
          track("unexpected error page: transaction reverted - main continue button clicked");
          onClickContinueTransaction();
        }}
      />
    </>
  );
};
