import { route } from "@skip-go/client";

const { request } = route({
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

const getRoute = async () => {
  const response = await request();
  console.log(response);
}

getRoute();