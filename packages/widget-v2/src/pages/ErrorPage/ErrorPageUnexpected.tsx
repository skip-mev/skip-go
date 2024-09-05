import { ErrorState } from "@/components/ErrorState";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import { errorAtom } from "@/state/errorPage";
import { useResetAtom } from "jotai/utils";
import { useTheme } from "styled-components";

export type ErrorPageUnexpectedProps = {
  error?: Error;
};

export const ErrorPageUnexpected = ({ error }: ErrorPageUnexpectedProps) => {
  const theme = useTheme();
  const resetError = useResetAtom(errorAtom);

  const onClickRetry = () => {
    resetError();
  };

  return (
    <>
      <ErrorState
        title="An unexpected error has occurred"
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center">
              {error?.message}
            </SmallText>
          </>
        }
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
