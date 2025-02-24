import { LightningIcon } from "@/icons/LightningIcon";
import { useTheme } from "styled-components";
import { Row } from "./Layout";
import { Tooltip } from "./Tooltip";

export const GoFastSymbol = () => {
  const theme = useTheme();

  return (
    <Row>
      <Tooltip content="Powered by Skip:Go Fast">
        <LightningIcon color={theme.brandColor} />
      </Tooltip>
    </Row>
  );
};
