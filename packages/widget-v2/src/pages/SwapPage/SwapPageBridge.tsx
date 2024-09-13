import { useTheme, styled } from "styled-components";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { invertSwapAtom } from "@/state/swapPage";
import { useSetAtom } from "jotai";

export const SwapPageBridge = () => {
  const theme = useTheme();
  const invertSwap = useSetAtom(invertSwapAtom);
  const onInvertSwap = () => {
    invertSwap("swap-out");
  };

  return (
    <div style={{ position: "relative", cursor: "pointer" }} onClick={onInvertSwap}>
      <BridgeIcon color={theme.primary.background.normal} />
      <StyledBridgeArrow color={theme.primary.text.normal} />
    </div>
  );
};

const StyledBridgeArrow = styled(BridgeArrowIcon)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
