import type { Meta } from "@storybook/react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Row } from "@/components/Layout";
import { defaultTheme, lightTheme } from "@/widget/theme";

import { WalletSelectorModal, WalletSelectorModalProps } from "@/modals/WalletSelectorModal/WalletSelectorModal";

const meta = {
  title: "Modals/WalletSelectorModal",
  component: (props) => <WalletSelectorModalExample {...props} />,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof WalletSelectorModal>;

export default meta;

export const WalletSelectorModalExample = (props: WalletSelectorModalProps) => {
  const modal = useModal(WalletSelectorModal);

  return (
    <NiceModal.Provider>
      <Row gap={10}>
        <button
          onClick={() =>
            modal.show({
              theme: defaultTheme,
              ...props,
            })
          }
        >
          Show dark mode
        </button>
        <button
          onClick={() =>
            modal.show({
              theme: lightTheme,
              ...props,
            })
          }
        >
          Show light mode
        </button>
      </Row>
    </NiceModal.Provider>
  );
};
