import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { useSetAtom } from "jotai";
import { errorAtom } from "@/state/errorPage";
import { goFastWarningAtom } from "@/state/swapPage";
import { SmallText } from "@/components/Typography";
import styled, { useTheme } from "styled-components";
import { CogIcon } from "@/icons/CogIcon";
import { Row } from "@/components/Layout";
import { useSettingsDrawer } from "@/hooks/useSettingsDrawer";
import { useEffect } from "react";

export type ErrorPageGoFastWarningProps = {
  onClickBack: () => void;
  onClickContinue: () => void;
};

export const ErrorPageGoFastWarning = ({
  onClickBack,
  onClickContinue,
}: ErrorPageGoFastWarningProps) => {
  const setErrorAtom = useSetAtom(errorAtom);
  const setShowGoFastErrorAtom = useSetAtom(goFastWarningAtom);
  const { SettingsDrawerPageContainer } = useSettingsDrawer();
  const theme = useTheme();

  useEffect(() => {
    setShowGoFastErrorAtom(false);
  }, [setShowGoFastErrorAtom]);

  const handleOnClickBack = () => {
    setErrorAtom(undefined);
    onClickBack?.();
  };

  return (
    <>
      <SettingsDrawerPageContainer highlightSettings>
        <SwapPageHeader
          leftButton={{
            label: "Back",
            icon: ICONS.thinArrow,
            onClick: handleOnClickBack,
          }}
        />
        <ErrorPageContent
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
        <MainButton label="Continue" icon={ICONS.rightArrow} onClick={onClickContinue} />
      </SettingsDrawerPageContainer>
    </>
  );
};

const StyledSettingsContainer = styled(Row)`
  display: inline-flex;
`;
