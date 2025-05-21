import { BlockingPageContent } from "@/pages/BlockingPage/BlockingPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { blockingPageAtom } from "@/state/blockingPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { getTruncatedAddress } from "@/utils/crypto";
import { track } from "@amplitude/analytics-browser";

export type ErrorPageTransactionFailedProps = {
  txHash: string;
  explorerLink: string;
  onClickContactSupport: () => void;
  onClickBack?: () => void;
};

export const ErrorPageTransactionFailed = ({
  txHash,
  explorerLink,
  onClickContactSupport,
  onClickBack,
}: ErrorPageTransactionFailedProps) => {
  const theme = useTheme();
  const setBlockingPageAtom = useSetAtom(blockingPageAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: transaction failed - header back button clicked");
            setBlockingPageAtom(undefined);
            if (onClickBack) {
              onClickBack();
            }
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <BlockingPageContent
        title="Transaction failed"
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center" textWrap="balance">
              Please contact our support team below.
            </SmallText>
            <Row
              as={SmallTextButton}
              gap={5}
              onClick={() => {
                track("error page: transaction failed - explorer link clicked");
                window.open(explorerLink, "_blank");
              }}
              color={theme.primary.text.lowContrast}
            >
              Transaction: <u>{getTruncatedAddress(txHash)}</u>
              <ChainIcon color={theme.primary.text.lowContrast} />
            </Row>
          </>
        }
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton
        label="Contact support"
        icon={ICONS.rightArrow}
        onClick={() => {
          track("error page: transaction failed - contact support button clicked");
          onClickContactSupport();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
