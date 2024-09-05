import { ErrorState } from "@/components/ErrorState";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";

export type ErrorPageAuthFailedProps = {
  onClickBack: () => void;
};

export const ErrorPageAuthFailed = ({
  onClickBack,
}: ErrorPageAuthFailedProps) => {
  const theme = useTheme();

  return (
    <>
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
        onClick={onClickBack}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
