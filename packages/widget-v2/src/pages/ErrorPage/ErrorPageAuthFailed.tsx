import { ErrorState } from "@/components/ErrorState";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { useSetAtom } from "jotai";
import { errorAtom } from "@/state/errorPage";

export type ErrorPageAuthFailedProps = {
  onClickBack: () => void;
};

export const ErrorPageAuthFailed = ({
  onClickBack,
}: ErrorPageAuthFailedProps) => {
  const setErrorAtom = useSetAtom(errorAtom);
  const theme = useTheme();

  const handleOnClickBack = () => {
    setErrorAtom(undefined);
    if (onClickBack) {
      onClickBack();
    }
  };

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: handleOnClickBack
        }}
      />
      <ErrorState
        title="Transaction failed"
        description="User rejected authentication request"
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton
        label="Back"
        icon={ICONS.leftArrow}
        onClick={handleOnClickBack}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
