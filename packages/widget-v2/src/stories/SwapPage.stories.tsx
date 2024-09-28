import type { Meta, StoryObj } from "@storybook/react";
import { SwapPage } from "@/pages/SwapPage/SwapPage";
import { renderLightAndDarkTheme } from "./renderLightAndDarkTheme";
import { styled } from "styled-components";
import NiceModal from "@ebay/nice-modal-react";

const meta = {
  title: "Pages/SwapPage",
  component: (props) =>
    renderLightAndDarkTheme(
      <NiceModal.Provider>
        <SwapFlowContainer>
          <SwapPage {...props} />
        </SwapFlowContainer>
      </NiceModal.Provider>,
      undefined,
      true
    ),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof SwapPage>;
type Story = StoryObj<typeof meta>;

export default meta;

export const Example: Story = {
  args: {},
};

const SwapFlowContainer = styled.div`
  position: relative;
  width: fit-content;
`;