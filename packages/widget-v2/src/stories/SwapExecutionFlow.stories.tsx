import type { Meta, StoryObj } from '@storybook/react';
import { renderLightAndDarkTheme } from './renderLightAndDarkTheme';
import { SwapExecutionFlow } from '../widget/SwapExecutionFlow/SwapExecutionFlow';

const meta = {
  title: 'Flows/SwapExecutionFlow',
  component: (props) =>
    renderLightAndDarkTheme(<SwapExecutionFlow {...props} />, undefined, true),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SwapExecutionFlow>;
type Story = StoryObj<typeof meta>;

export default meta;

export const SwapExecutionFlowExample: Story = {
  args: {},
};
