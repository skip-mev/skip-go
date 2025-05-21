import { BlockingPageContent } from "@/pages/BlockingPage/BlockingPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { useSetAtom } from "jotai";
import { blockingPageAtom } from "@/state/blockingPage";
import { goFastWarningAtom } from "@/state/swapPage";
import { SmallText } from "@/components/Typography";
import styled, { useTheme } from "styled-components";
import { CogIcon } from "@/icons/CogIcon";
import { Column, Row } from "@/components/Layout";
import { useSettingsDrawer } from "@/hooks/useSettingsDrawer";
import { useEffect } from "react";
import { setTag } from "@sentry/react";
import { track } from "@amplitude/analytics-browser";

export type WarningPageGoFastProps = {
  onClickBack: () => void;
  onClickContinue: () => void;
};

export const WarningPageGoFast = ({ onClickBack, onClickContinue }: WarningPageGoFastProps) => {
  const setBlockingPageAtom = useSetAtom(blockingPageAtom);
  const setShowGoFastErrorAtom = useSetAtom(goFastWarningAtom);
  const { SettingsFooter, drawerOpen } = useSettingsDrawer();
  const theme = useTheme();

  useEffect(() => {
    setShowGoFastErrorAtom(false);
    setTag("goFastWarning", true);
  }, [setShowGoFastErrorAtom]);

  const handleOnClickBack = () => {
    setBlockingPageAtom(undefined);
    onClickBack?.();
  };

  return (
    <Column
      gap={5}
      style={{
        opacity: drawerOpen ? 0.3 : 1,
      }}
    >
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("warning page: go fast - header back button clicked");
            handleOnClickBack();
          },
        }}
      />
      <BlockingPageContent
        title="You're on the fastest route"
        description={
          <SmallText textAlign="center" textWrap="balance" lineHeight="17px">
            Faster routes may have higher transaction fees. <br />
            You can choose between Fastest and Cheapest routes in the <br />
            <StyledSettingsContainer gap={3}>
              <CogIcon color={theme.primary.text.normal} />
              <SmallText normalTextColor>Settings</SmallText>
              <SmallText>drawer.</SmallText>
            </StyledSettingsContainer>
          </SmallText>
        }
        icon={ICONS.goFast}
      />
      <MainButton
        label="Continue"
        icon={ICONS.rightArrow}
        onClick={() => {
          track("warning page: go fast - main continue button clicked");
          onClickContinue();
        }}
      />
      <SettingsFooter highlightSettings />
    </Column>
  );
};

const StyledSettingsContainer = styled(Row)`
  display: inline-flex;
`;
