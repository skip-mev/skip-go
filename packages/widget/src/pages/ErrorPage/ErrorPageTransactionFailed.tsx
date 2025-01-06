import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { errorAtom } from "@/state/errorPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { getTruncatedAddress } from "@/utils/crypto";
import { captureException } from "@sentry/browser";
import { useEffect } from "react";

export type ErrorPageTransactionFailedProps = {
  transactionHash: string;
  explorerLink: string;
  onClickContactSupport: () => void;
  onClickBack: () => void;
};

export const ErrorPageTransactionFailed = ({
  transactionHash,
  explorerLink,
  onClickContactSupport,
  onClickBack,
}: ErrorPageTransactionFailedProps) => {

  useEffect(() => {
    captureException("TransactionFailed");
  }, []);

  const theme = useTheme();
  const setErrorAtom = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            setErrorAtom(undefined);
            if (onClickBack) {
              onClickBack();
            }
            setCurrentPage(Routes.SwapPage);
          }
        }}
      />
      <ErrorPageContent
        title="Transaction failed"
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center" textWrap="balance">
              Please contact our support team below.
            </SmallText>
            <Row
              as={SmallTextButton}
              gap={5}
              onClick={() => window.open(explorerLink, "_blank")}
              color={theme.primary.text.lowContrast}
            >
              Transaction: <u>{getTruncatedAddress(transactionHash)}</u>
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
        onClick={onClickContactSupport}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
