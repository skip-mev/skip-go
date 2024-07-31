import type { Meta } from '@storybook/react';
import { SwapWidgetWithoutNiceModalProvider } from '../widget';
import styled from 'styled-components';
import { Row } from '../components/Layout';
import { defaultTheme, lightTheme } from '../widget/theme';
import { SwapWidgetProps } from '@skip-go/widget';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../components/Modal';

const meta = {
  title: 'Widget',
  component: (props) => Widget(props),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SwapWidgetWithoutNiceModalProvider>;

export default meta;

export const Widget = (props: SwapWidgetProps) => {
  const modal = useModal(NiceModal.create(Modal));

  return (
    <NiceModal.Provider>
      <button
        onClick={() =>
          modal.show({
            children: (
              <SwapWidgetWithoutNiceModalProvider
                {...props}
                theme={defaultTheme}
              />
            ),
          })
        }
      >
        open dark mode in modal
      </button>

      <button
        onClick={() =>
          modal.show({
            children: (
              <SwapWidgetWithoutNiceModalProvider
                {...props}
                theme={lightTheme}
              />
            ),
          })
        }
      >
        open light mode in modal
      </button>

      <StyledWrapper gap={10}>
        <SwapWidgetWithoutNiceModalProvider {...props} theme={defaultTheme} />
        <SwapWidgetWithoutNiceModalProvider {...props} theme={lightTheme} />
      </StyledWrapper>
    </NiceModal.Provider>
  );
};

const StyledWrapper = styled(Row)`
  background-color: gray;
  padding: 20px;
`;
