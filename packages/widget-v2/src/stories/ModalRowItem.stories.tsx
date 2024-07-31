import type { Meta, StoryObj } from '@storybook/react';
import { renderLightAndDarkTheme } from './renderLightAndDarkTheme';
import { ModalRowItem, ModalRowItemProps } from '../components/ModalRowItem';
import styled from 'styled-components';
import { RightArrowIcon } from '../icons/ArrowIcon';
import { SmallText, Text } from '../components/Typography';
import { Column, Row } from '../components/Layout';

const StyledRightArrowIcon = styled(RightArrowIcon)`
  path {
    fill: ${({ theme }) => theme.backgroundColor};
  }
  rect {
    fill: ${({ theme }) => theme.textColor};
  }
`;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/ModalRowItem',
  component: (props) =>
    renderLightAndDarkTheme(<ModalRowItem {...props} />, { width: 500 }),
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<ModalRowItemProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const TokenAndChain: Story = {
  args: {
    leftContent: (
      <Row gap={10} align="center">
        <img
          src="https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png"
          width="35"
        />
        <Row gap={5} align="flex-end">
          <Text lineHeight="17px">ATOM</Text>
          <SmallText>Cosmos Hub</SmallText>
        </Row>
      </Row>
    ),
    rightContent: (
      <Column gap={5}>
        <SmallText opacity="1">100.1233</SmallText>
        <SmallText>$834.32</SmallText>
      </Column>
    ),
    onClick: () => alert('select token/chain'),
  },
};

export const EnterAddressManually: Story = {
  args: {
    leftContent: 'Enter address manually',
    rightContent: <StyledRightArrowIcon />,
    onClick: () => alert('enter address'),
  },
};

export const Wallet: Story = {
  args: {
    leftContent: (
      <Row gap={10} align="center">
        <img
          src="https://raw.githubusercontent.com/cosmos/wallet-registry/main/wallets/keplrextension/images/logo.svg"
          width="35"
        />
        <Text lineHeight="17px">Keplr</Text>
      </Row>
    ),
    onClick: () => alert('select wallet'),
  },
};

export const NoOnClick: Story = {
  args: {
    leftContent: (
      <Row gap={10} align="center">
        <Text lineHeight="17px">No onClick</Text>
      </Row>
    ),
  },
};
