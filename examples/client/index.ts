import { route, setApiOptions, getRecommendedGasPrice } from "@skip-go/client";

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

  setApiOptions({ apiUrl: "https://google.com" });


  console.log(response);
}

const getRecGasPrice = async () => {
  setApiOptions();
  const response = await getRecommendedGasPrice({
    chainId: "osmosis-1"
  });
  console.log(response);
}

// const getFeeInfo = async () => {
//   const response = await getFeeInfoForChain("dymension_1100-1");
//   console.log(response);
// }

getRoute();

// getFeeInfo();

// getRecGasPrice();