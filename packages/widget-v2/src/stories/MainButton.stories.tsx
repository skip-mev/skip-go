import type { Meta, StoryObj } from '@storybook/react';
import { renderLightAndDarkTheme } from './renderLightAndDarkTheme';
import { MainButton } from '../components/MainButton';
import { ICONS } from '../icons';
import { COLORS } from '../utils/colors';

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
    onClick: () => alert('connect wallet'),
  },
};

export const Swap: Story = {
  args: {
    label: 'Swap',
    icon: ICONS.swap,
    onClick: () => alert('should trigger alert'),
  },
};

export const SwapWarning: Story = {
  args: {
    label: 'Swap',
    icon: ICONS.warning,
    onClick: () => alert('should trigger alert'),
  },
};

export const InsufficientBalance: Story = {
  args: {
    label: 'Insufficient Balance',
    disabled: true,
    icon: ICONS.swap,
    onClick: () => alert('should not trigger'),
  },
};

export const Connecting: Story = {
  args: {
    label: 'Connecting',
    loading: true,
    onClick: () => alert('should not trigger'),
  },
};

export const SwapInProgress: Story = {
  args: {
    label: 'Swap in progress...',
    loading: true,
    loadingTimeString: '2 mins.',
    onClick: () => alert('should not trigger'),
  },
};

export const SwapComplete: Story = {
  args: {
    label: 'Swap Complete',
    backgroundColor: COLORS.green,
    icon: ICONS.checkmark,
    onClick: () => alert('should trigger'),
  },
};

export const ContinueTransaction: Story = {
  args: {
    label: 'Continue Transaction',
    backgroundColor: COLORS.orange,
    icon: ICONS.rightArrow,
    onClick: () => alert('should trigger'),
  },
};

export const GoBack: Story = {
  args: {
    label: 'Go Back',
    backgroundColor: COLORS.red,
    leftIcon: ICONS.leftArrow,
    onClick: () => alert('should trigger'),
  },
};
