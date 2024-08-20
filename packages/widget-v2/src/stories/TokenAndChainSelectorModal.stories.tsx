import type { Meta } from '@storybook/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { TokenAndChainSelectorModal } from '@modals/TokenAndChainSelectorModal/TokenAndChainSelectorModal';
import { Row } from '@components/Layout';
import { defaultTheme, lightTheme } from '@widget/theme';

const meta = {
  title: 'Modals/TokenAndChainSelectorModal',
  component: () => <TokenAndChainSelectorModalExample />,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TokenAndChainSelectorModalExample>;

export default meta;

export const TokenAndChainSelectorModalExample = () => {
  const modal = useModal(TokenAndChainSelectorModal);

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
};
