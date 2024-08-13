import type { Meta } from '@storybook/react';
import { ShowSwapWidget, SwapWidget, SwapWidgetProps } from '../widget/Widget';
import { defaultTheme, lightTheme } from '../widget/theme';
import NiceModal from '@ebay/nice-modal-react';
import { styled } from 'styled-components';

export const Widget = (props: SwapWidgetProps) => <SwapWidget {...props} />;

export const Modal = (props: typeof ShowSwapWidget) => {
  return (
    <NiceModal.Provider>
      <ShowSwapWidget {...props} />
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
  title: 'Widget',
  component: Widget,
  args: {
    theme: defaultTheme,
    button: undefined,
  },
  argTypes: {
    theme: {
      options: ['defaultTheme', 'lightTheme'],
      mapping: {
        defaultTheme: defaultTheme,
        lightTheme: lightTheme,
      },
    },
    button: {
      options: ['default', 'custom'],
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
} satisfies Meta<typeof SwapWidget | typeof ShowSwapWidget>;

export default meta;
