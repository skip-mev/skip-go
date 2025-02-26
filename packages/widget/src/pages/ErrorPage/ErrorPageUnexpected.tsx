import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { errorAtom } from "@/state/errorPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { useEffect } from "react";
import { setTag } from "@sentry/react";

export type ErrorPageUnexpectedProps = {
  error?: Error;
  onClickBack?: () => void;
};

export const ErrorPageUnexpected = ({ error, onClickBack }: ErrorPageUnexpectedProps) => {
  const theme = useTheme();
  const setErrorAtom = useSetAtom(errorAtom);
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
            setErrorAtom(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorPageContent
        title="An unexpected error has occurred"
        description={error?.message}
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton
        label="Retry"
        icon={ICONS.rightArrow}
        onClick={onClickRetry}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
