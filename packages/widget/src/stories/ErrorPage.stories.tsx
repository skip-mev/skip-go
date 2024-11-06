import type { Meta, StoryObj } from "@storybook/react";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { errorAtom, ErrorPageVariants, ErrorType } from "@/state/errorPage";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { RouteResponse } from "@skip-go/client";
import { ClientOperation } from "@/utils/clientType";
import { renderLightAndDarkTheme } from "./renderLightAndDarkTheme";

const meta = {
  title: "Pages/ErrorPage",
  component: (props) => renderLightAndDarkTheme(
    <RenderExample {...props} />,
    undefined,
    true
  ),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<ErrorPageVariants>;
type Story = StoryObj<typeof meta>;

export default meta;

const route = {
  amountIn: "50000000",
  amountOut: "18185371517380425",
  usdAmountIn: "50.05",
  usdAmountOut: "44.66",
  sourceAssetDenom: "uusdc",
  destAssetDenom: "ethereum-native",
} as RouteResponse;

const revertedOperation = {
  denom: "uatom",
  amountIn: "50000000",
  fromChainID: "noble-1"
} as ClientOperation;

const RenderExample = (props: ErrorPageVariants) => {
  const [error, setError] = useAtom(errorAtom);
  useEffect(() => {
    setError(props);
  }, [error, props, setError]);

  if (error) {
    return <ErrorPage />;
  }
  return null;
};

export const AuthFailed: Story = {
  args: {
    errorType: ErrorType.AuthFailed,
    onClickBack: () => alert("back"),
  }
};

export const Timeout: Story = {
  args: {
    errorType: ErrorType.Timeout,
    explorerUrl: "https://www.google.com",
  }
};

export const AdditionalSigningRequired: Story = {
  args: {
    errorType: ErrorType.AdditionalSigningRequired,
    onClickSign: () => alert("sign"),
    route,
  }
};

export const TradeWarning: Story = {
  args: {
    errorType: ErrorType.TradeWarning,
    onClickContinue: () => alert("continue"),
    onClickBack: () => alert("back"),
    route,
  }
};

export const TransactionFailed: Story = {
  args: {
    errorType: ErrorType.TransactionFailed,
    transactionHash: "jalksdjfalksdf",
    explorerUrl: "https://www.google.com",
    onClickContactSupport: () => alert("contact support")
  }
};

export const TransactionReverted: Story = {
  args: {
    errorType: ErrorType.TransactionReverted,
    explorerUrl: "https://www.google.com",
    revertedOperation,
    recoveryAddress: "RECOVERY ADDRESS",
    onClickContinueTransaction: () => alert("continue transaction")
  }
};


export const Unexpected: Story = {
  args: {
    errorType: ErrorType.Unexpected,
    error: new Error("unexpected error"),
  }
};