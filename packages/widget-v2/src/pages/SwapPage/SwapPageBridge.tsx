import { useTheme, styled } from "styled-components";
import { BridgeArrowIcon } from "@/icons/BridgeArrowIcon";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { destinationAssetAtom, sourceAssetAtom, swapDirectionAtom } from "@/state/swapPage";
import { useAtom, useSetAtom } from "jotai";

export const SwapPageBridge = () => {
  const theme = useTheme();
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);
  const setSwapDirection = useSetAtom(swapDirectionAtom)
  const onInvertSwap = () => {
    setSwapDirection("swap-out");
    setSourceAsset(destinationAsset);
    setDestinationAsset(sourceAsset);
  }

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
