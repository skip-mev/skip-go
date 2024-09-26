import type { Meta } from "@storybook/react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Row } from "@/components/Layout";
import { defaultTheme, lightTheme } from "@/widget/theme";
import { SetAddressModal } from "@/modals/SetAddressModal/SetAddressModal";
import { useEffect, useState } from "react";
import { skipAssetsAtom } from "@/state/skipClient";
import { destinationAssetAtom } from "@/state/swapPage";
import { useAtom } from "jotai";

const meta = {
  title: "Modals/SetAddressModal",
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {},
} satisfies Meta<typeof SetAddressModal>;

export default meta;

export const SetAddressModalsExample = () => {
  const modal = useModal(SetAddressModal);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);
  const [shouldRender, setShouldRender] = useState(false);

  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const asset = assets?.find((asset) => asset.denom === "uatom");

  useEffect(() => {
    setDestinationAsset(asset);

    if (destinationAsset) {
      setShouldRender(true);
    }
  }, [asset, destinationAsset, setDestinationAsset]);
  if (shouldRender) {
    return (
      <NiceModal.Provider>
        <Row gap={10}>
          <button
            onClick={() =>
              modal.show({
                theme: defaultTheme,
              })
            }
          >
            Show dark mode
          </button>
          <button
            onClick={() =>
              modal.show({
                theme: lightTheme,
              })
            }
          >
            Show light mode
          </button>
        </Row>
      </NiceModal.Provider>
    );
  }
  return null;
};
