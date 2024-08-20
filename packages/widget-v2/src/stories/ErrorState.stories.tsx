import type { Meta } from '@storybook/react';
import { ErrorState, ErrorStateProps } from '@components/ErrorState';
import { ICONS } from '@icons';
import { SmallText, SmallTextButton, Text } from '@components/Typography';
import { ChainIcon } from '@icons/ChainIcon';
import { Row } from '@components/Layout';
import { XIcon } from '@icons/XIcon';
import { defaultTheme, lightTheme, Theme } from '@widget/theme';
import {
  renderLightAndDarkTheme,
  renderLightAndDarkThemeSeperateProps,
} from './renderLightAndDarkTheme';

type props = {
  dark: ErrorStateProps;
  light: ErrorStateProps;
};
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/ErrorState',
  component: (props) =>
    renderLightAndDarkThemeSeperateProps(
      // @ts-ignore
      <ErrorState />,
      props.dark,
      props.light
    ),
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<props>;

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

const badTradeProps = (theme: Theme) => {
  return {
    icon: ICONS.triangleWarning,
    title: 'Warning: Bad trade (–65.15%)',
    description: (
      <>
        <SmallText color={theme.error.text} textAlign="center">
          You will lose ~65% of your input value with this trade
          <br />
          Input: 1500 USDC ($1500)
          <br />
          Estimated output: ~100 XYZ ($1000)
        </SmallText>
        <SmallTextButton
          onClick={() => alert('that was dumb')}
          color={theme.primary.text.lowContrast}
        >
          I know the risk, continue anyway
        </SmallTextButton>
      </>
    ),
    backgroundColor: theme.error.background,
    textColor: theme.error.text,
  };
};
export const BadTrade = {
  args: {
    dark: badTradeProps(defaultTheme),
    light: badTradeProps(lightTheme),
  },
};

const transactionFailedProps = (theme: Theme) => {
  return {
    icon: ICONS.triangleWarning,
    title: 'Transaction failed',
    description: (
      <>
        <SmallText color={theme.error.text} textAlign="center">
          This transaction encountered a critical error. <br />
          Please contact our support team below.
        </SmallText>
        <Row
          as={SmallTextButton}
          gap={5}
          onClick={() => alert('xd')}
          color={theme.primary.text.lowContrast}
        >
          Transaction: <u>0x120A...Wfw8x0</u>
          <ChainIcon color={theme.primary.text.lowContrast} />
        </Row>
      </>
    ),
    backgroundColor: theme.error.background,
    textColor: theme.error.text,
  };
};

export const TransactionFailed = {
  args: {
    dark: transactionFailedProps(defaultTheme),
    light: transactionFailedProps(lightTheme),
  },
};

const criticalErrorProps = (theme: Theme) => {
  return {
    icon: ICONS.triangleWarning,
    title: 'Transaction failed',
    description: 'User rejected authentication request',
    backgroundColor: theme.error.background,
    textColor: theme.error.text,
  };
};

export const CriticalError = {
  args: {
    dark: criticalErrorProps(defaultTheme),
    light: criticalErrorProps(lightTheme),
  },
};

const timeoutProps = (theme: Theme) => {
  return {
    icon: ICONS.warning,
    title: 'This transaction is taking longer than usual.',
    description: (
      <>
        <SmallText color={theme.warning.text} textAlign="center">
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
          color={theme.primary.text.lowContrast}
        >
          <ChainIcon color={theme.primary.text.lowContrast} />
          View on mintscan
        </Row>
      </>
    ),
    backgroundColor: theme.warning.background,
    textColor: theme.warning.text,
  };
};

export const Timeout = {
  args: {
    dark: timeoutProps(defaultTheme),
    light: timeoutProps(lightTheme),
  },
};

const actionRequiredProps = (theme: Theme) => {
  return {
    icon: ICONS.warning,
    title: 'Action Required',
    description: (
      <>
        <SmallText color={theme.warning.text} textAlign="center">
          This transaction reverted while trying to execute.
          <br />
          You can continue executing this transaction now.
        </SmallText>
        <SmallText color={theme.primary.text.lowContrast} textAlign="center">
          Current asset location: 1 ATOM on Osmosis (osmosis1209...18fa)
        </SmallText>
        <Row gap={25} justify="center">
          <Row
            gap={5}
            align="center"
            as={SmallTextButton}
            onClick={() => alert('view on mintscan')}
            color={theme.primary.text.lowContrast}
          >
            <ChainIcon color={theme.primary.text.lowContrast} />
            View on mintscan
          </Row>
          <Row
            gap={5}
            align="center"
            as={SmallTextButton}
            onClick={() => alert("don't continue")}
            color={theme.primary.text.lowContrast}
          >
            <XIcon color={theme.primary.text.lowContrast} />
            Don't continue
          </Row>
        </Row>
      </>
    ),
    backgroundColor: theme.warning.background,
    textColor: theme.warning.text,
  };
};

export const ActionRequired = {
  args: {
    dark: actionRequiredProps(defaultTheme),
    light: actionRequiredProps(lightTheme),
  },
};

export const AdditionalSignature = {
  render: (props: ErrorStateProps) =>
    renderLightAndDarkTheme(<ErrorState {...props} />),
  args: {
    title: (
      <Text>
        Transaction requires an
        <br />
        additional signing step
      </Text>
    ),
    description: (
      <SmallText normalTextColor> ATOM {' -> '} 71.235 COREUM</SmallText>
    ),
    icon: ICONS.signature,
  },
};
