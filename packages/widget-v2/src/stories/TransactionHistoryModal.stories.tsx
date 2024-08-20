import type { Meta } from '@storybook/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Row } from '@components/Layout';
import { defaultTheme, lightTheme } from '@widget/theme';
import { TransactionHistoryModal } from '@modals/TransactionHistoryModal/TransactionHistoryModal';
import txHistory from '@modals/TransactionHistoryModal/tx_history.json';

const meta = {
  title: 'Modals/TransactionHistoryModal',
  component: (props) => <TransactionHistoryModalExample {...props} />,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    txHistory: txHistory as any,
  },
} satisfies Meta<typeof TransactionHistoryModal>;

export default meta;

export const TransactionHistoryModalExample = (props: any) => {
  const modal = useModal(TransactionHistoryModal);

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
