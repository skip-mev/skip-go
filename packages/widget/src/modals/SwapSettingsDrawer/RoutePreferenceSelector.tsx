import React from "react";
import { useAtom } from "jotai";
import { routePreferenceAtom } from "@/state/swapPage";
import { ROUTE_PREFERENCE_OPTIONS } from "@/constants/widget";
import { Column, Row, Spacer } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import styled from "styled-components";
import { StyledSettingsOptionLabel } from "./SlippageSelector";
import { QuestionMarkTooltip } from "@/components/QuestionMarkTooltip";
import { track } from "@amplitude/analytics-browser";

const RoutePreferenceSelector: React.FC = () => {
  const [routePreference, setRoutePreference] = useAtom(routePreferenceAtom);

  return (
    <Container>
      <PreferenceText align="center">
        Route Preference
        <Spacer width={5} />
        <QuestionMarkTooltip
          content={
            <SmallText normalTextColor style={{ width: 250 }}>
              Choose if faster or cheaper routes should be prioritized. Fast routes require a $50
              minimum from Ethereum and may not be available if there is insufficient liquidity for
              an asset.
            </SmallText>
          }
        />
      </PreferenceText>
      <OptionsContainer gap={5}>
        {ROUTE_PREFERENCE_OPTIONS.map((option) => (
          <StyledSettingsOptionLabel
            key={option}
            selected={option === routePreference}
            onClick={() => {
              track("settings drawer: route preference - changed", { routePreference: option });
              setRoutePreference(option);
            }}
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
