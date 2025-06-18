import { ErrorWarningPageContent } from "@/pages/ErrorWarningPage/ErrorWarningPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { getTruncatedAddress } from "@/utils/crypto";
import { track } from "@amplitude/analytics-browser";
import { errorWarningAtom } from "@/state/errorWarning";
import { PageHeader } from "@/components/PageHeader";

export type UnexpectedErrorPageTransactionFailedProps = {
  txHash: string;
  explorerLink: string;
  onClickContactSupport: () => void;
  onClickBack?: () => void;
};

export const UnexpectedErrorPageTransactionFailed = ({
  txHash,
  explorerLink,
  onClickContactSupport,
  onClickBack,
}: UnexpectedErrorPageTransactionFailedProps) => {
  const theme = useTheme();
  const setErrorWarningAtom = useSetAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("unexpected error page: transaction failed - header back button clicked");
            setErrorWarningAtom(undefined);
            if (onClickBack) {
              onClickBack();
            }
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorWarningPageContent
        title="Transaction failed"
        description={
          <>
            <SmallText lineHeight="1.5" color={theme.error.text} textAlign="center" textWrap="balance">
              Please contact our support team below.
            </SmallText>
            <Row
              as={SmallTextButton}
              gap={5}
              onClick={() => {
                track("unexpected error page: transaction failed - explorer link clicked");
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
          track("unexpected error page: transaction failed - contact support button clicked");
          onClickContactSupport();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
