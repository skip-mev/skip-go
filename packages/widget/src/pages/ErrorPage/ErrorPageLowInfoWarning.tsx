import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";

export type ErrorPageLowInfoWarningProps = {
  onClickContinue: () => void;
  onClickBack: () => void;
};

export const ErrorPageLowInfoWarning = ({
  onClickContinue,
  onClickBack,
}: ErrorPageLowInfoWarningProps) => {
  const theme = useTheme();

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: onClickBack,
        }}
      />
      <ErrorPageContent
        title="Warning: Incomplete Price Data"
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center" textWrap="balance">
              USD price data is missing for one of the assets, please double check the input and
              output amounts are acceptable before continuing.
            </SmallText>
            <SmallTextButton onClick={onClickContinue} color={theme.primary.text.lowContrast}>
              I know the risk, continue anyway
            </SmallTextButton>
          </>
        }
        icon={ICONS.triangleWarning}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton
        label="Back"
        icon={ICONS.leftArrow}
        onClick={onClickBack}
        backgroundColor={theme.warning.text}
      />
    </>
  );
};
