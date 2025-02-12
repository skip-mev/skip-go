import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { useSetAtom } from "jotai";
import { errorAtom } from "@/state/errorPage";
import { goFastWarningAtom } from "@/state/swapPage";
import { SmallTextButton } from "@/components/Typography";

export type ErrorPageGoFastWarningProps = {
  onClickBack: () => void;
  onClickContinue: () => void;
};

export const ErrorPageGoFastWarning = ({ onClickBack, onClickContinue }: ErrorPageGoFastWarningProps) => {
  const setErrorAtom = useSetAtom(errorAtom);
  const setShowGoFastErrorAtom = useSetAtom(goFastWarningAtom)
  const theme = useTheme();

  const handleOnClickBack = () => {
    setErrorAtom(undefined);
    setShowGoFastErrorAtom(false);
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
        title="This route uses the GoFast protocol"
        description={
          
          <SmallTextButton border onClick={() => {
            onClickContinue?.()
            setShowGoFastErrorAtom(false)
          }
          } color={theme.primary.text.lowContrast}>
              I know the risk, continue anyway
          </SmallTextButton>
        }
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
