import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { errorWarningAtom } from "@/state/errorWarning";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { useTheme } from "styled-components";
import { useEffect } from "react";
import { setTag } from "@sentry/react";
import { track } from "@amplitude/analytics-browser";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { ErrorWarningPageContent } from "../ErrorWarningPageContent";

export type RelayFeeQuoteExpiredProps = {
  error?: Error;
  onClickBack?: () => void;
};

export const ExpectedErrorPageRelayFeeQuoteExpired = ({ error, onClickBack }: RelayFeeQuoteExpiredProps) => {
  const theme = useTheme();
  const setErrorAtom = useSetAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  useEffect(() => {
    setTag("errorMessage", error?.message);
  }, [error?.message]);

  const onClickRetry = () => {
    setErrorAtom(undefined);
    setCurrentPage(Routes.SwapPage);
  };

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: relay fee quote expired - header back button clicked");
            setErrorAtom(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorWarningPageContent
        title="Relay fee quote expired"
        description="Please retry your route."
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton
        label="Retry"
        icon={ICONS.rightArrow}
        onClick={() => {
          track("error page: relay fee quote expired - retry button clicked");
          onClickRetry();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};