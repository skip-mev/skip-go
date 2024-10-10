import { ErrorState } from "@/components/ErrorState";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { errorAtom } from "@/state/errorPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";

export type ErrorPageUnexpectedProps = {
  error?: Error;
  onClickBack?: () => void;
};

export const ErrorPageUnexpected = ({ error, onClickBack }: ErrorPageUnexpectedProps) => {
  const theme = useTheme();
  const resetError = useResetAtom(errorAtom);
  const setErrorAtom = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  const onClickRetry = () => {
    setErrorAtom(undefined);
    setCurrentPage(Routes.SwapPage);
    console.error("on click retry");
  };

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
            console.error("on click back");
          }
        }}
      />
      <ErrorState
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
