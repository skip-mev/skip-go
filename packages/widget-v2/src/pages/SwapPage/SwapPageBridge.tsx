import { useTheme, styled } from "styled-components";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { invertSwapAtom } from "@/state/swapPage";
import { useSetAtom } from "jotai";
import { useState } from "react";

export const SwapPageBridge = () => {
  const theme = useTheme();
  const [spin, setSpin] = useState(false);
  const invertSwap = useSetAtom(invertSwapAtom);
  const onInvertSwap = () => {
    invertSwap("swap-out");

    let spinTimeout = undefined;
    clearTimeout(spinTimeout);
    setSpin(true);
    spinTimeout = setTimeout(() => setSpin(false), 500);
  };

  return (
    <div style={{ position: "relative", cursor: "pointer" }} onClick={onInvertSwap}>
      <BridgeIcon color={theme.primary.background.normal} />
      <StyledBridgeArrow spin={spin} color={theme.primary.text.normal} />
    </div>
  );
};

const StyledBridgeArrow = styled(BridgeArrowIcon) <{ spin?: boolean }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  ${({ spin }) => spin && "animation: spin 0.5s cubic-bezier(.18,.89,.32,1.27);"};
`;
