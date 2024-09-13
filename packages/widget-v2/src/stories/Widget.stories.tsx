import type { Meta } from "@storybook/react";
import { ShowSwapWidget, SwapWidget, SwapWidgetProps } from "@/widget/Widget";
import { defaultTheme, lightTheme, Theme } from "@/widget/theme";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { ReactElement, useEffect } from "react";
import { destinationAssetAtom, sourceAssetAtom } from "@/state/swapPage";
import { useAtom } from "jotai";
import { skipAssetsAtom } from "@/state/skipClient";

type Props = SwapWidgetProps & { theme: Theme; button?: ReactElement };

export const Widget = (props: Props) => {
  const [, setSourceAsset] = useAtom(sourceAssetAtom);
  const [, setDestinationAsset] = useAtom(destinationAssetAtom);

  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const sourceAsset = assets?.find(
    (asset) => asset.denom === "ethereum-native"
  );
  const destinationAsset = assets?.find((asset) => asset.denom === "uatom");

  useEffect(() => {
    setSourceAsset(sourceAsset);
    setDestinationAsset(destinationAsset);
  }, [destinationAsset, setDestinationAsset, setSourceAsset, sourceAsset]);

  return <SwapWidget {...props} key={props.theme.primary.background.normal} />;
};

export const Modal = (props: Props) => {
  return (
    <NiceModal.Provider>
      <ShowSwapWidget {...props} key={props.theme.primary.background.normal} />
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
