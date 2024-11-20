import { LightningIcon } from "@/icons/LightningIcon";
import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { Row } from "./Layout";
import { SmallText } from "./Typography";

export const GoFastSymbol = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const theme = useTheme();

  return (
    <Row>
      <LightningIcon
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        color={theme.brandColor}
      />
      {showTooltip && (
        <Tooltip>
          Powered by Skip:Go Fast
        </Tooltip>
      )}
    </Row>
  );
};

const Tooltip = styled(SmallText).attrs({
  normalTextColor: true,
})`
  position: absolute;
  padding: 8px;
  border-radius: 13px;
  border: 1px solid ${({ theme }) => theme.primary.text.ultraLowContrast};
  background-color: ${({ theme }) => theme.secondary.background.normal};
  left: 180px;
  top: 15px;
  width: 180px;
  z-index: 1;
`;