import { ErrorWarningPageContent } from "@/pages/ErrorWarningPage/ErrorWarningPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { errorWarningAtom } from "@/state/errorWarning";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { useEffect } from "react";
import { setTag } from "@sentry/react";
import { track } from "@amplitude/analytics-browser";

export type UnexpectedErrorPageUnexpectedProps = {
  error?: Error;
  onClickBack?: () => void;
};

export const UnexpectedErrorPageUnexpected = ({
  error,
  onClickBack,
}: UnexpectedErrorPageUnexpectedProps) => {
  const theme = useTheme();
  const setErrorWarningAtom = useSetAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  useEffect(() => {
    setTag("errorMessage", error?.message);
  }, [error?.message]);

  const onClickRetry = () => {
    setErrorWarningAtom(undefined);
    setCurrentPage(Routes.SwapPage);
  };

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("unexpected error page: unexpected error - header back button clicked");
            setErrorWarningAtom(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorWarningPageContent
        title="An unexpected error has occurred"
        description={error?.message}
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton
        label="Retry"
        icon={ICONS.rightArrow}
        onClick={() => {
          track("unexpected error page: unexpected error - retry button clicked");
          onClickRetry();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
