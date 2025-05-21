import { BlockingPageContent } from "@/pages/BlockingPage/BlockingPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { useSetAtom } from "jotai";
import { blockingPageAtom } from "@/state/blockingPage";
import { track } from "@amplitude/analytics-browser";

export type ExpectedErrorPageAuthFailedProps = {
  onClickBack: () => void;
};

export const ExpectedErrorPageAuthFailed = ({ onClickBack }: ExpectedErrorPageAuthFailedProps) => {
  const setBlockingPageAtom = useSetAtom(blockingPageAtom);
  const theme = useTheme();

  const handleOnClickBack = () => {
    track("expected error page: user rejected request - back button clicked");
    setBlockingPageAtom(undefined);
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
      <BlockingPageContent
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
