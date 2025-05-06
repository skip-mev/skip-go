import { useTheme, styled } from "styled-components";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { destinationAssetAtom, invertSwapAtom } from "@/state/swapPage";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { defaultRouteAtom } from "@/state/route";
import { useSwitchEvmChain } from "@/hooks/useSwitchEvmChain";

export const SwapPageBridge = () => {
  const theme = useTheme();
  const isMobileScreenSize = useIsMobileScreenSize();
  const switchEvmChainId = useSwitchEvmChain();
  const destinationAsset = useAtomValue(destinationAssetAtom);

  const [isSpinning, setIsSpinning] = useState(false);
  const invertSwap = useSetAtom(invertSwapAtom);
  const defaultRoute = useAtomValue(defaultRouteAtom);
  const lockedRoute = defaultRoute?.srcLocked || defaultRoute?.destLocked;
  const onInvertSwap = () => {
    invertSwap();
    switchEvmChainId(destinationAsset?.chainId);

    let spinTimeout = undefined;
    clearTimeout(spinTimeout);
    setIsSpinning(true);

    spinTimeout = setTimeout(() => {
      setIsSpinning(false);
    }, 500);
  };

  return (
    <StyledSwapPageBridgeButton
      align="center"
      onClick={onInvertSwap}
      disabled={isSpinning || lockedRoute}
    >
      <BridgeIcon
        color={theme.primary.background.normal}
        width={isMobileScreenSize ? 60 : 47}
        height={isMobileScreenSize ? 10 : 7}
      />
      <StyledBridgeArrow
        spin={isSpinning}
        color={theme.primary.text.normal}
        width={isMobileScreenSize ? 16 : 13}
        height={isMobileScreenSize ? 16 : 13}
      />
    </StyledSwapPageBridgeButton>
  );
};

const StyledSwapPageBridgeButton = styled(Button)`
  position: relative;
  cursor: pointer;
  height: 5px;
`;

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
