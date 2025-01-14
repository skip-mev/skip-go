import { useTheme, styled } from "styled-components";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { invertSwapAtom } from "@/state/swapPage";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";

export const SwapPageBridge = () => {
  const theme = useTheme();
  const isMobileScreenSize = useIsMobileScreenSize();

  const [isSpinning, setIsSpinning] = useState(false);
  const invertSwap = useSetAtom(invertSwapAtom);
  const onInvertSwap = () => {
    invertSwap();

    let spinTimeout = undefined;
    clearTimeout(spinTimeout);
    setIsSpinning(true);
    spinTimeout = setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <Button
      style={{ position: "relative", cursor: "pointer", height: 5 }}
      align="center"
      onClick={onInvertSwap}
      disabled={isSpinning}
    >
      <BridgeIcon
        color={theme.primary.background.normal}
        width={isMobileScreenSize ? 60 : undefined}
        height={isMobileScreenSize ? 10 : undefined}
      />
      <StyledBridgeArrow
        spin={isSpinning}
        color={theme.primary.text.normal}
        width={isMobileScreenSize ? 16 : undefined}
        height={isMobileScreenSize ? 16 : undefined}
      />
    </Button>
  );
};

const StyledBridgeArrow = styled(BridgeArrowIcon)<{ spin?: boolean }>`
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
