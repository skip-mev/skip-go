import React from "react";
import { useAtom } from "jotai";
import { routePreferenceAtom } from "@/state/swapPage";
import { ROUTE_PREFERENCE_OPTIONS } from "@/constants/widget";
import { Column, Row, Spacer } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { QuestionMarkIcon } from "@/icons/QuestionMarkIcon";
import styled from "styled-components";
import { StyledSettingsOptionLabel } from "./SlippageSelector";
import { Tooltip } from "@/components/Tooltip";

const RoutePreferenceSelector: React.FC = () => {
  const [routePreference, setRoutePreference] = useAtom(routePreferenceAtom);

  return (
    <Container>
      <PreferenceText align="center">
        Route Preference
        <Spacer width={5} />
        <Tooltip
          content={
            <SmallText normalTextColor style={{ width: 250 }}>
              Choose if Skip:Go should prioritize faster routes or routes with the lowest possible
              fees.
            </SmallText>
          }
        >
          <QuestionMarkIcon />
        </Tooltip>
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

const Container = styled(Column)`
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
`;

const PreferenceText = styled(Row).attrs({
  as: SmallText,
  normalTextColor: true,
})`
  position: relative;
  letter-spacing: 0.26px;
`;

const OptionsContainer = styled(Row)`
  width: 100%;
`;

export default RoutePreferenceSelector;
