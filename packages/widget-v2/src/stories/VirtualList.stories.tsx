import type { Meta, StoryObj } from '@storybook/react';
import { VirtualList } from '../components/VirtualList';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../widget/theme';

const meta = {
  title: 'Components/VirtualList',
  component: (props) => (
    <ThemeProvider theme={lightTheme}>
      <VirtualList {...props} />
    </ThemeProvider>
  ),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof VirtualList>;

type Story = StoryObj<typeof meta>;

export default meta;

export const ListExample: Story = {
  args: {
    listItems: Array.from({ length: 10000 }) as number[],
    height: 500,
    itemHeight: 100,
    renderItem: (item, index) => (
      <div style={{ border: '1px solid black', margin: 5 }}>
        {index}: {item as number}
      </div>
    ),
    itemKey: (item) => item as string,
  },
};
