import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { useSetAtom } from "jotai";
import { errorAtom } from "@/state/errorPage";

export type ErrorPageAuthFailedProps = {
  onClickBack: () => void;
};

export const ErrorPageAuthFailed = ({ onClickBack }: ErrorPageAuthFailedProps) => {
  const setErrorAtom = useSetAtom(errorAtom);
  const theme = useTheme();

  const handleOnClickBack = () => {
    setErrorAtom(undefined);
    onClickBack?.();
  };

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: handleOnClickBack,
        }}
      />
      <ErrorPageContent
        title="Transaction failed"
        description="User rejected authentication request"
        icon={ICONS.triangleWarning}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton
        label="Back"
        icon={ICONS.leftArrow}
        onClick={handleOnClickBack}
        backgroundColor={theme.warning.text}
      />
    </>
  );
};
