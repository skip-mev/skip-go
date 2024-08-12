import type { Meta, StoryObj } from '@storybook/react';
import { renderLightAndDarkTheme } from './renderLightAndDarkTheme';
import { ErrorState, ErrorStateProps } from '../components/ErrorState';
import { COLORS } from '../utils/colors';
import { ICONS } from '../icons';
import { SmallText, SmallTextButton, Text } from '../components/Typography';
import { ChainIcon } from '../icons/ChainIcon';
import { Row } from '../components/Layout';
import { XIcon } from '../icons/XIcon';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/ErrorState',
  component: (props) => renderLightAndDarkTheme(<ErrorState {...props} />),
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<ErrorStateProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const BadTrade: Story = {
  args: {
    icon: ICONS.triangleWarning,
    title: 'Warning: Bad trade (–65.15%)',
    description: (
      <>
        <SmallText opacity="0.5" color={COLORS.red} textAlign="center">
          You will lose ~65% of your input value with this trade
          <br />
          Input: 1500 USDC ($1500)
          <br />
          Estimated output: ~100 XYZ ($1000)
        </SmallText>
        <SmallTextButton
          onClick={() => alert('that was dumb')}
          color={COLORS.gray}
        >
          I know the risk, continue anyway
        </SmallTextButton>
      </>
    ),
    backgroundColor: COLORS.backgroundError,
    textColor: COLORS.red,
  },
};

export const TransactionFailed: Story = {
  args: {
    icon: ICONS.triangleWarning,
    title: 'Transaction failed',
    description: (
      <>
        <SmallText opacity="0.5" color={COLORS.red} textAlign="center">
          This transaction encountered a critical error. <br />
          Please contact our support team below.
        </SmallText>
        <Row
          as={SmallTextButton}
          gap={5}
          onClick={() => alert('xd')}
          color={COLORS.gray}
        >
          Transaction: <u>0x120A...Wfw8x0</u>
          <ChainIcon color={COLORS.gray} />
        </Row>
      </>
    ),
    backgroundColor: COLORS.backgroundError,
    textColor: COLORS.red,
  },
};

export const CriticalError: Story = {
  args: {
    icon: ICONS.triangleWarning,
    title: 'Transaction failed',
    description: 'User rejected authentication request',
    backgroundColor: COLORS.backgroundError,
    textColor: COLORS.red,
  },
};

export const Timeout: Story = {
  args: {
    icon: ICONS.warning,
    title: 'This transaction is taking longer than usual.',
    description: (
      <>
        <SmallText opacity="0.5" color={COLORS.orange} textAlign="center">
          Unstable network conditions mean this transaction may take up
          <br />
          to 48 hours to complete. Your funds are secure in the meantime.
          <br />
          This window can be closed safely while you wait.
        </SmallText>
        <Row
          gap={5}
          align="center"
          as={SmallTextButton}
          onClick={() => alert('xd')}
          color={COLORS.gray}
        >
          <ChainIcon color={COLORS.gray} />
          View on mintscan
        </Row>
      </>
    ),
    backgroundColor: COLORS.backgroundWarning,
    textColor: COLORS.orange,
  },
};

export const ActionRequired: Story = {
  args: {
    icon: ICONS.warning,
    title: 'Action Required',
    description: (
      <>
        <SmallText opacity="0.5" color={COLORS.orange} textAlign="center">
          This transaction reverted while trying to execute.
          <br />
          You can continue executing this transaction now.
        </SmallText>
        <SmallText color={COLORS.gray} textAlign="center">
          Current asset location: 1 ATOM on Osmosis (osmosis1209...18fa)
        </SmallText>
        <Row gap={25} justify="center">
          <Row
            gap={5}
            align="center"
            as={SmallTextButton}
            onClick={() => alert('view on mintscan')}
            color={COLORS.gray}
          >
            <ChainIcon color={COLORS.gray} />
            View on mintscan
          </Row>
          <Row
            gap={5}
            align="center"
            as={SmallTextButton}
            onClick={() => alert("don't continue")}
            color={COLORS.gray}
          >
            <XIcon color={COLORS.gray} />
            Don't continue
          </Row>
        </Row>
      </>
    ),
    backgroundColor: COLORS.backgroundWarning,
    textColor: COLORS.orange,
  },
};

export const AdditionalSignature: Story = {
  args: {
    title: (
      <Text>
        Transaction requires an
        <br />
        additional signing step
      </Text>
    ),
    description: (
      <SmallText opacity="1"> ATOM {' -> '} 71.235 COREUM</SmallText>
    ),
    icon: ICONS.signature,
  },
};
