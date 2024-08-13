import type { Meta, StoryObj } from '@storybook/react';
import { SwapWidget, SwapWidgetProps } from '../widget/Widget';
import styled from 'styled-components';
import { Column } from '../components/Layout';
import { defaultTheme, lightTheme } from '../widget/theme';

export const WidgetExample = (props: SwapWidgetProps) => (
  <SwapWidget {...props} />
);

const meta = {
  title: 'Widget',
  component: WidgetExample,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    theme: defaultTheme,
  },
  argTypes: {
    theme: {
      options: ['defaultTheme', 'lightTheme'],
      mapping: {
        defaultTheme: defaultTheme,
        lightTheme: lightTheme,
      },
    },
  },
} satisfies Meta<typeof SwapWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

const StyledWrapper = styled(Column)`
  background-color: gray;
  padding: 20px;
`;

const StyledDarkButton = styled.button`
  border: none;
  border-radius: 20px;
  background-color: black;
  color: white;
  &:hover {
    pointer: cursor;
  }
`;

const StyledWhiteButton = styled(StyledDarkButton)`
  background-color: white;
  color: black;
`;
