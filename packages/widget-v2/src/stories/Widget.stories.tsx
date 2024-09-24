import type { Meta } from "@storybook/react";
import { ShowSwapWidget, SwapWidget, SwapWidgetProps } from "@/widget/Widget";
import { defaultTheme, lightTheme, Theme } from "@/widget/theme";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { ReactElement, useEffect, useMemo } from "react";
import { destinationAssetAtom, sourceAssetAmountAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom, useSetAtom } from "jotai";
import { skipAssetsAtom } from "@/state/skipClient";

type Props = SwapWidgetProps & { theme: Theme; button?: ReactElement };

export const Widget = (props: Props) => {
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setDestinationAsset = useSetAtom(destinationAssetAtom);
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);


  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const sourceAsset = assets?.find(
    (asset) => asset.denom === "uatom" && asset.chainID === "cosmoshub-4"
  );
  const destinationAsset = assets?.find((asset) => asset.denom === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" && asset.chainID === "solana");

  useEffect(() => {
    setSourceAsset(sourceAsset);
    setDestinationAsset(destinationAsset);
    setSourceAssetAmount("0.3");
  }, [destinationAsset, setDestinationAsset, setSourceAsset, setSourceAssetAmount, sourceAsset]);

  return useMemo(() => {
    return <SwapWidget {...props} />;
  }, [props]);
};

export const Modal = (props: Props) => {
  return (
    <NiceModal.Provider>
      <ShowSwapWidget {...props} />
    </NiceModal.Provider>
  );
};

const StyledCustomButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 20px;
  color: white;
  background-color: navy;
`;

const meta = {
  title: "Widget",
  component: Widget,
  args: {
    theme: defaultTheme,
    button: undefined,
  },
  argTypes: {
    theme: {
      options: ["defaultTheme", "lightTheme"],
      mapping: {
        defaultTheme: defaultTheme,
        lightTheme: lightTheme,
      },
    },
    button: {
      options: ["default", "custom"],
      mapping: {
        default: undefined,
        custom: (
          <StyledCustomButton>
            Custom button <br />
            click to open swap widget
          </StyledCustomButton>
        ),
      },
    },
  },
} satisfies Meta<Props>;

export default meta;
