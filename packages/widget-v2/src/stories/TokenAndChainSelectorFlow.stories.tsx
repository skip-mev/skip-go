import type { Meta } from '@storybook/react';
import { SwapFlow } from '../widget/SwapFlow/SwapFlow';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { TokenAndChainSelectorFlow } from '../widget/TokenAndChainSelectorFlow/TokenAndChainSelectorFlow';
import { Row } from '../components/Layout';
import { defaultTheme, lightTheme } from '../widget/theme';

const meta = {
  title: 'Flows/TokenAndChainSelectorFlow',
  component: () => <TokenAndChainSelectorFlowExample />,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SwapFlow>;

export default meta;

export const TokenAndChainSelectorFlowExample = () => {
  const modal = useModal(TokenAndChainSelectorFlow);

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
