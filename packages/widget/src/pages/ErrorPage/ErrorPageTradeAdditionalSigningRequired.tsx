import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { errorAtom } from "@/state/errorPage";
import { useSetAtom } from "jotai";
import { useTheme } from "styled-components";

export type ErrorPageTradeAdditionalSigningRequiredProps = {
  onClickContinue: () => void;
  onClickBack?: () => void;
  signaturesRequired: number;
};

export const ErrorPageTradeAdditionalSigningRequired = ({
  onClickContinue,
  signaturesRequired,
  onClickBack,
}: ErrorPageTradeAdditionalSigningRequiredProps) => {
  const theme = useTheme();
  const setErrorAtom = useSetAtom(errorAtom);

  const handleOnClickBack = () => {
    setErrorAtom(undefined);
    if (onClickBack) {
      onClickBack();
    }
  };

  const handleOnClickContinue = () => {
    setErrorAtom(undefined);
    onClickContinue();
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
        title="This transaction requires additional signing steps"
        description={
          <SmallText textWrap="balance" textAlign="center" color={theme.warning.text}>
            This transaction requires <u>{signaturesRequired} signatures</u>.{" "}
            Please leave this window open until both steps have been authorized.
          </SmallText>
        }
        icon={ICONS.signature}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton
        label="Continue"
        icon={ICONS.rightArrow}
        onClick={handleOnClickContinue}
        backgroundColor={theme.warning.text}
      />
    </>
  );
};
