import type { Meta, StoryObj } from "@storybook/react";
import { SwapPage } from "@/pages/SwapPage/SwapPage";
import { styled } from "styled-components";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { errorAtom, ErrorPageVariants, ErrorType } from "@/state/errorPage";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { RouteResponse } from "@skip-go/client";

const meta = {
  title: "Pages/ErrorPage",
  component: (props) => <RenderExample {...props} />,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<ErrorPageVariants>;
type Story = StoryObj<typeof meta>;

export default meta;

const RenderExample = (props: ErrorPageVariants) => {
  const [error, setError] = useAtom(errorAtom);
  useEffect(() => {
    setError(props);
  }, [error, props, setError]);

  if (error) {
    return <ErrorPage />;
  }
  return null;
}

export const TradeWarning: Story = {
  args: {
    errorType: ErrorType.TradeWarning,
    swapDifferencePercentage: "60%",
    onClickContinue: () => alert("continue"),
    onClickBack: () => alert("back"),
    route: {
      amountIn: "50000000",
      amountOut: "18185371517380425",
      usdAmountIn: "50.05",
      usdAmountOut: "44.66",
      sourceAssetDenom: "uusdc",
      destAssetDenom: "ethereum-native",
    } as RouteResponse
  }
};
