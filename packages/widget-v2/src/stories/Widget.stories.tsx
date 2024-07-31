import type { Meta } from '@storybook/react';
import { SwapWidget } from '../widget';
import styled from 'styled-components';
import { Row } from '../components/Layout';
import { defaultTheme, lightTheme } from '../widget/theme';
import { SwapWidgetProps } from '@skip-go/widget';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from '../components/Modal';
import { useState } from 'react';

const meta = {
  title: 'Widget',
  component: (props) => Widget(props),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SwapWidget>;

export default meta;

export const Widget = (props: SwapWidgetProps) => {
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const modal = useModal(Modal);

  return (
    <NiceModal.Provider>
      <button
        onClick={() =>
          modal.show({
            children: <SwapWidget {...props} theme={defaultTheme} />,
          })
        }
      >
        open dark mode in modal
      </button>

      <button
        onClick={() =>
          modal.show({
            children: <SwapWidget {...props} theme={lightTheme} />,
          })
        }
      >
        open light mode in modal
      </button>

      <button
        onClick={() =>
          modal.show({
            children: <Drawer> testing drawer </Drawer>,
            drawer: true,
            container: container,
            onOpenChange: (open: boolean) => {
              open ? setDrawerOpen(true) : setDrawerOpen(false);
            },
          })
        }
      >
        show drawer
      </button>

      <StyledWrapper gap={10}>
        <div
          style={{ position: 'relative' }}
          ref={(element) => {
            if (element) {
              setContainer(element);
            }
          }}
        >
          <div style={{ opacity: drawerOpen ? 0.5 : 1 }}>
            <SwapWidget {...props} theme={defaultTheme} />
          </div>
        </div>
        <SwapWidget {...props} theme={lightTheme} />
      </StyledWrapper>
    </NiceModal.Provider>
  );
};

const StyledWrapper = styled(Row)`
  background-color: gray;
  padding: 20px;
`;

const Drawer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  z-index: 100;
`;
