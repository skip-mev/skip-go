import { BlockingPageContent } from "@/pages/BlockingPage/BlockingPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { blockingPageAtom } from "@/state/blockingPage";
import { useSetAtom } from "jotai";
import { useTheme } from "styled-components";
import { track } from "@amplitude/analytics-browser";

export type WarningPageTradeAdditionalSigningRequiredProps = {
  onClickContinue: () => void;
  onClickBack?: () => void;
  signaturesRequired: number;
};

export const WarningPageTradeAdditionalSigningRequired = ({
  onClickContinue,
  signaturesRequired,
  onClickBack,
}: WarningPageTradeAdditionalSigningRequiredProps) => {
  const theme = useTheme();
  const setBlockingPageAtom = useSetAtom(blockingPageAtom);

  const handleOnClickBack = () => {
    setBlockingPageAtom(undefined);
    onClickBack?.();
  };

  const handleOnClickContinue = () => {
    setBlockingPageAtom(undefined);
    onClickContinue();
  };

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: additional signing required - header back button clicked");
            handleOnClickBack();
          },
        }}
      />
      <BlockingPageContent
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
