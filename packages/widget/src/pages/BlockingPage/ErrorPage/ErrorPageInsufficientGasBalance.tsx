import { BlockingPageContent } from "@/pages/BlockingPage/BlockingPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { blockingPageAtom } from "@/state/blockingPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { useEffect } from "react";
import { setTag } from "@sentry/react";
import { track } from "@amplitude/analytics-browser";

export type InsufficientBalanceForGasProps = {
  error?: Error;
  onClickBack?: () => void;
};

export const ErrorPageInsufficientGasBalance = ({
  error,
  onClickBack,
}: InsufficientBalanceForGasProps) => {
  const theme = useTheme();
  const setBlockingPageAtom = useSetAtom(blockingPageAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  useEffect(() => {
    setTag("errorMessage", error?.message);
  }, [error?.message]);

  const onClickRetry = () => {
    setBlockingPageAtom(undefined);
    setCurrentPage(Routes.SwapPage);
  };

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: insufficient gas balance - header back button clicked");
            setBlockingPageAtom(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <BlockingPageContent
        title="Insufficient gas balance"
        description={error?.message}
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton
        label="Retry"
        icon={ICONS.rightArrow}
        onClick={() => {
          track("error page: insufficient gas balance - retry button clicked");
          onClickRetry();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
