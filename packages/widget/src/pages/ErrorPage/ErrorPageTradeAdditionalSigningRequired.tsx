import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import { PageHeader } from "../../components/PageHeader";
import { errorAtom } from "@/state/errorPage";
import { useSetAtom } from "jotai";
import { useTheme } from "styled-components";
import { track } from "@amplitude/analytics-browser";

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
    onClickBack?.();
  };

  const handleOnClickContinue = () => {
    setErrorAtom(undefined);
    onClickContinue();
  };

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: additional signing required - header back button clicked");
            handleOnClickBack();
          },
        }}
      />
      <ErrorPageContent
        title="This transaction requires additional signing steps"
        description={
          <SmallText textWrap="balance" textAlign="center" color={theme.warning.text}>
            This transaction requires <u>{signaturesRequired} signatures</u>. Please leave this
            window open until both steps have been authorized.
          </SmallText>
        }
        icon={ICONS.signature}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton
        label="Continue"
        icon={ICONS.rightArrow}
        onClick={() => {
          track("error page: additional signing required - main continue button clicked");
          handleOnClickContinue();
        }}
        backgroundColor={theme.warning.text}
      />
    </>
  );
};
