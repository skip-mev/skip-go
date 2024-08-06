import type { Meta, StoryObj } from '@storybook/react';
import { SwapFlow } from '../widget/SwapFlow/SwapFlow';
import { renderLightAndDarkTheme } from './renderLightAndDarkTheme';
import { styled } from 'styled-components';
import NiceModal from '@ebay/nice-modal-react';

const meta = {
  title: 'Flows/SwapFlow',
  component: (props) =>
    renderLightAndDarkTheme(
      <NiceModal.Provider>
        <SwapFlowContainer>
          <SwapFlow {...props} />
        </SwapFlowContainer>
      </NiceModal.Provider>,
      undefined,
      true
    ),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SwapFlow>;
type Story = StoryObj<typeof meta>;

export default meta;

export const SwapFlowExample: Story = {
  args: {},
};

const SwapFlowContainer = styled.div`
  position: relative;
  width: fit-content;
`;
