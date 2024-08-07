import { useTheme, styled } from 'styled-components';
import { BridgeArrowIcon } from '../../icons/BridgeArrowIcon';
import { BridgeIcon } from '../../icons/BridgeIcon';

export const SwapFlowBridge = () => {
  const theme = useTheme();
  return (
    <div style={{ position: 'relative' }}>
      <BridgeIcon color={theme.backgroundColor} />
      <StyledBridgeArrow color={theme.textColor} />
    </div>
  );
};

const StyledBridgeArrow = styled(BridgeArrowIcon)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
