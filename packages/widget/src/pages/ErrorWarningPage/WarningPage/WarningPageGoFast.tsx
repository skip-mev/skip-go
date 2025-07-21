import { ErrorWarningPageContent } from "@/pages/ErrorWarningPage/ErrorWarningPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { useSetAtom } from "jotai";
import { errorWarningAtom } from "@/state/errorWarning";
import { goFastWarningAtom } from "@/state/swapPage";
import { SmallText } from "@/components/Typography";
import styled, { useTheme } from "styled-components";
import { CogIcon } from "@/icons/CogIcon";
import { Column, Row } from "@/components/Layout";
import { useSettingsDrawer } from "@/hooks/useSettingsDrawer";
import { useEffect } from "react";
import { track } from "@amplitude/analytics-browser";
import { PageHeader } from "@/components/PageHeader";

export type WarningPageGoFastProps = {
  onClickBack: () => void;
  onClickContinue: () => void;
};

export const WarningPageGoFast = ({ onClickBack, onClickContinue }: WarningPageGoFastProps) => {
  const setErrorWarningAtom = useSetAtom(errorWarningAtom);
  const setShowGoFastErrorAtom = useSetAtom(goFastWarningAtom);
  const { SettingsFooter, drawerOpen } = useSettingsDrawer();
  const theme = useTheme();

  useEffect(() => {
    setShowGoFastErrorAtom(false);
  }, [setShowGoFastErrorAtom]);

  const handleOnClickBack = () => {
    setErrorWarningAtom(undefined);
    onClickBack?.();
  };

  return (
    <Column
      gap={5}
      style={{
        opacity: drawerOpen ? 0.3 : 1,
      }}
    >
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("warning page: go fast - header back button clicked");
            handleOnClickBack();
          },
        }}
      />
      <ErrorWarningPageContent
        title="You're on the fastest route"
        description={
          <SmallText lineHeight="1.5" textAlign="center" textWrap="balance">
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
