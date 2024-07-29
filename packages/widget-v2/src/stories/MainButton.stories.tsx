import type { Meta, StoryObj } from '@storybook/react';
import { renderLightAndDarkTheme } from './renderLightAndDarkTheme';
import { ICONS, MainButton } from '../components/MainButton';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/MainButton',
  component: (props) => renderLightAndDarkTheme(<MainButton {...props} />),
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof MainButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const ConnectWallet: Story = {
  args: {
    label: 'Connect Wallet',
    icon: ICONS.plus,
  },
};

export const Swap: Story = {
  args: {
    label: 'Swap',
    icon: ICONS.swap,
  },
};

export const SwapWarning: Story = {
  args: {
    label: 'Swap',
    icon: ICONS.warning,
  },
};

export const SwapInProgress: Story = {
  args: {
    swapInProgress: true,
  },
};

export const SwapComplete: Story = {
  args: {
    label: 'Swap Complete',
    backgroundColor: '#5FBF00',
    icon: ICONS.checkmark,
  },
};

export const ContinueTransaction: Story = {
  args: {
    label: 'Continue Transaction',
    backgroundColor: '#FF7A00',
    icon: ICONS.rightArrow,
  },
};

export const GoBack: Story = {
  args: {
    label: 'Go Back',
    backgroundColor: '#FF1616',
    leftIcon: ICONS.leftArrow,
  },
};
