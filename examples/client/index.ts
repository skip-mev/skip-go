import { route, setApiOptions, getFeeInfoForChain } from "@skip-go/client";

setApiOptions();

const getRoute = async () => {
  const response = await route({
    sourceAssetDenom: "uatom",
    sourceAssetChainId: "cosmoshub-4",
    destAssetDenom: "uusdc",
    destAssetChainId: "noble-1",
    allowUnsafe: true,
    experimentalFeatures: ["stargate", "eureka"],
    allowMultiTx: true,
    smartRelay: true,
    smartSwapOptions: { splitRoutes: true, evmSwaps: true },
    goFast: true,
    amountIn: "1000000",
  });
  console.log(response);
}

const getFeeInfo = async () => {
  const response = await getFeeInfoForChain("dymension_1100-1");
  console.log(response);
}

getFeeInfo();