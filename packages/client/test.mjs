import { SkipClient } from "@skip-go/client";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

async function main() {
  try {
    const mnemonic = "";

    // Create signer
    const osmoSigner = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "osmo",
    });
    const nobleSigner = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "noble",
    });

    // Create SkipClient
    const skipClient = new SkipClient({
      getCosmosSigner: async (chainId) => {
        if (chainId === "osmosis-1") return osmoSigner;
        if (chainId === "noble-1") return nobleSigner;
      },
    });

    // Define the route
    const routeConfig = {
      sourceAssetDenom:
        "ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4",
      sourceAssetChainID: "osmosis-1",
      amountIn: "200000",
      destAssetChainID: "8453",
      destAssetDenom: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      smartRelay: true,
      allowMultiTx: true,
      allowUnsafe: true,
      smartSwapOptions: {
        splitRoutes: true,
        evmSwaps: true,
      },
      goFast: true,
    };

    // 1. Test out the route
    const route = await skipClient.route(routeConfig);

    const osmoAddress = (await osmoSigner.getAccounts())[0].address;
    const nobleAddress = (await nobleSigner.getAccounts())[0].address;
    console.log(osmoAddress);
    console.log(nobleAddress);

    // 2. Execute the route
    const ethAddress = "0x2034d376e7BFB0BE1AFeC8639194b3bE6512C043";

    const userAddresses = [
      { chainID: "osmosis-1", address: osmoAddress },
      { chainID: "noble-1", address: nobleAddress },
      { chainID: "8453", address: ethAddress },
    ];

    console.log("execute route", route);

    const executeRes = await skipClient.executeRoute({ route, userAddresses });
    console.log("execute result:", executeRes);
  } catch (err) {
    console.error("Error caught:", err);
  }
}

// Run main
main();
