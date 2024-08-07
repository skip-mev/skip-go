import type { Meta } from '@storybook/react';
import { ShowSwapWidget, SwapWidget, SwapWidgetProps } from '../widget/Widget';
import styled from 'styled-components';
import { Column, Row } from '../components/Layout';
import { lightTheme } from '../widget/theme';

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
      <Row gap={10}>
        <ShowSwapWidget
          {...props}
          button={<StyledDarkButton> dark mode </StyledDarkButton>}
        />
        <ShowSwapWidget
          {...props}
          theme={lightTheme}
          button={<StyledWhiteButton> light mode</StyledWhiteButton>}
        />
      </Row>
      <Row gap={10}>
        <SwapWidget {...props} />
        <SwapWidget {...props} theme={lightTheme} />
      </Row>
    </StyledWrapper>
  );
};

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
