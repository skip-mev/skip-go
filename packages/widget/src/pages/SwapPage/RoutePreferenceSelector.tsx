import React, { useState } from "react";
import { useAtom } from "jotai";
import { routePreferenceAtom } from "@/state/swapPage";
import { ROUTE_PREFERENCE_OPTIONS } from "@/constants/widget";
import { Row, Spacer } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { QuestionMarkIcon } from "@/icons/QuestionMarkIcon";
import styled from "styled-components";
import { StyledSettingsOptionLabel } from "./SlippageSelector";

const RoutePreferenceSelector: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [routePreference, setRoutePreference] = useAtom(routePreferenceAtom);

  return (
    <Container>
      <PreferenceText align="center">
        Route Preference
        <Spacer width={5} />
        <QuestionMarkIcon
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
        {showTooltip && (
          <Tooltip>
            Choose if Skip:Go should prioritize faster routes or routes with the lowest possible
            fees.
          </Tooltip>
        )}
      </PreferenceText>
      <OptionsContainer gap={5}>
        {ROUTE_PREFERENCE_OPTIONS.map((option) => (
          <StyledSettingsOptionLabel
            key={option}
            selected={option === routePreference}
            onClick={() => setRoutePreference(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </StyledSettingsOptionLabel>
        ))}
      </OptionsContainer>
    </Container>
  );
};

const Container = styled(Row)`
  justify-content: space-between;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const PreferenceText = styled(Row).attrs({
  as: SmallText,
  normalTextColor: true,
})`
  position: relative;
  letter-spacing: 0.26px;
`;

const Tooltip = styled(SmallText).attrs({
  normalTextColor: true,
})`
  position: absolute;
  padding: 13px;
  border-radius: 13px;
  border: 1px solid ${({ theme }) => theme.primary.text.ultraLowContrast};
  background-color: ${({ theme }) => theme.secondary.background.normal};
  top: -30px;
  left: 130px;
  width: 250px;
  z-index: 1;
`;

const OptionsContainer = styled(Row)`
  @media (max-width: 767px) {
    width: 100%;
  }
`;

export default RoutePreferenceSelector;
