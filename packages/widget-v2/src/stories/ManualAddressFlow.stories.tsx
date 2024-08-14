import type { Meta } from '@storybook/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Row } from '../components/Layout';
import { defaultTheme, lightTheme } from '../widget/theme';
import { ManualAddressFlow } from '../widget/ManualAddressFlow/ManualAddressFlow';

const meta = {
  title: 'Flows/ManualAddressFlow',
  component: (props) => <ManualAddressFlowExample {...props} />,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    onSetManualWalletAddress: (address: string) =>
      alert(`manual address is ${address}`),
    chainName: 'Base',
    chainLogo:
      'https://raw.githubusercontent.com/base-org/brand-kit/5ce7f4e9ba1a1ceaa7beb22156679899fff7faaf/logo/in-product/Base_Network_Logo.svg',
  },
} satisfies Meta<typeof ManualAddressFlow>;

export default meta;

export const ManualAddressFlowExample = (props: any) => {
  const modal = useModal(ManualAddressFlow);

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
