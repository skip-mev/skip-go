import type { Meta } from '@storybook/react';
import { ShowSwapWidget, SwapWidget, SwapWidgetProps } from '@widget/Widget';
import { defaultTheme, lightTheme, Theme } from '@widget/theme';
import NiceModal from '@ebay/nice-modal-react';
import { styled } from 'styled-components';
import { ReactElement } from 'react';

type Props = SwapWidgetProps & { theme: Theme; button?: ReactElement };

export const Widget = (props: Props) => (
  <SwapWidget {...props} key={props.theme.primary.background.normal} />
);

export const Modal = (props: Props) => {
  return (
    <NiceModal.Provider>
      <ShowSwapWidget {...props} key={props.theme.primary.background.normal} />
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
} satisfies Meta<Props>;

export default meta;
