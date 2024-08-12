import type { Meta } from '@storybook/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Row } from '../components/Layout';
import { defaultTheme, lightTheme } from '../widget/theme';
import { WalletSelectorFlow } from '../widget/WalletSelectorFlow/WalletSelectorFlow';

const meta = {
  title: 'Flows/WalletSelectorFlow',
  component: () => <TokenAndChainSelectorFlowExample />,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof WalletSelectorFlow>;

export default meta;

export const TokenAndChainSelectorFlowExample = () => {
  const modal = useModal(WalletSelectorFlow);

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
