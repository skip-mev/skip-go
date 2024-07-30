import type { Meta, StoryObj } from '@storybook/react';
import { SwapWidget } from '../widget';
import styled from 'styled-components';
import { Row } from '../components/Layout';
import { defaultTheme, lightTheme } from '../widget/theme';
import { SwapWidgetProps } from '@skip-go/widget';

const meta = {
  title: 'Widget',
  component: (props) => Widget(props),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SwapWidget>;

export default meta;

export const Widget = (props: SwapWidgetProps) => {
  return (
    <StyledWrapper gap={10}>
      <SwapWidget {...props} theme={defaultTheme} />
      <SwapWidget {...props} theme={lightTheme} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Row)`
  background-color: gray;
  padding: 20px;
`;
