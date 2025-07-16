import { ErrorWarningPageContent } from "@/pages/ErrorWarningPage/ErrorWarningPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { errorWarningAtom } from "@/state/errorWarning";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { useTheme } from "styled-components";
import { track } from "@amplitude/analytics-browser";
import { PageHeader } from "@/components/PageHeader";

export type ExpectedErrorPageInsufficientBalanceForGasProps = {
  error?: Error;
  onClickBack?: () => void;
};

export const ExpectedErrorPageInsufficientGasBalance = ({
  error,
  onClickBack,
}: ExpectedErrorPageInsufficientBalanceForGasProps) => {
  const theme = useTheme();
  const setErrorWarningAtom = useSetAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  const onClickRetry = () => {
    setErrorWarningAtom(undefined);
    setCurrentPage(Routes.SwapPage);
  };

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("expected error page: insufficient gas balance - header back button clicked");
            setErrorWarningAtom(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorWarningPageContent
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
          track("expected error page: insufficient gas balance - retry button clicked");
          onClickRetry();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
