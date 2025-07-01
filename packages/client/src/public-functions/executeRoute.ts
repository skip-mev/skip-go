import { PublicKey } from "@solana/web3.js";
import { ClientState } from "../state/clientState";
import type { TransactionCallbacks } from "../types/callbacks";
import { ChainType } from "../types/swaggerTypes";
import type {
  CosmosMsg,
  RouteResponse,
  PostHandler,
} from "../types/swaggerTypes";
import type { ApiRequest } from "../utils/generateApi";
import { bech32m, bech32 } from "bech32";
import { executeTransactions } from "../private-functions/executeTransactions";
import { messages } from "../api/postMessages";
import { isAddress } from "viem";
import type {
  SignerGetters,
  GasOptions,
  UserAddress,
} from "src/types/client-types";
import { ApiState } from "src/state/apiState";
import type { TrackTxPollingProps } from "src/api/postTrackTransaction";

/** Execute Route Options */
export type ExecuteRouteOptions = SignerGetters &
  GasOptions &
  TransactionCallbacks &
  Pick<ApiRequest<"msgs">, "timeoutSeconds"> & {
    route: RouteResponse;
    /**
     * Addresses should be in the same order with the `chainIDs` in the `route`
     */
    userAddresses: UserAddress[];
    simulate?: boolean;
    slippageTolerancePercent?: string;
    /**
     * Arbitrary Tx to be executed before or after route msgs
     */
    beforeMsg?: CosmosMsg;
    afterMsg?: CosmosMsg;
    /**
     * Set allowance amount to max if EVM transaction requires allowance approval.
     */
    useUnlimitedApproval?: boolean;
    /**
    /**
     * If `skipApproval` is set to `true`, the router will bypass checking whether
     * the signer has granted approval for the specified token contract on an EVM chain.
     * This can be useful if approval has already been handled externally or there are race conditions.
     */
    bypassApprovalCheck?: boolean;
    /**
     * defaults to true
     * If `batchSimulate` is set to `true`, it will simulate all messages in a batch before the first tx run.
     * If `batchSimulate` is set to `false`, it will simulate each message one by one.
     */
    batchSimulate?: boolean;
    /**
     * Optional configuration for transaction polling behavior.
     * - `maxRetries`: Maximum number of polling attempts (default: 5)
     * - `retryInterval`: Retry interval in milliseconds (default: 1000)
     * - `backoffMultiplier`: Exponential backoff multiplier for increasing delay between retries (default: 2.5)
     * Example backoff with retryInterval = 1000 and backoffMultiplier = 2:
     * 1st retry: 1000ms → 2nd: 2000ms → 3rd: 4000ms → 4th: 8000ms ...
     */
    trackTxPollingOptions?: TrackTxPollingProps;
    /**
     * If `batchSignTxs` is set to `true`, it will sign all transactions in a batch up front.
     * If `batchSignTxs` is set to `false`, it will sign each transaction one by one.
     */
    batchSignTxs?: boolean;
    /**
     * Specify actions to perform after the route is completed
     */
    postRouteHandler?: PostHandler;
    /**
     * If `cosmosPriorityFeeDenom` is provided, it will be used to set the priority fee for Cosmos transactions.
     * It should be a function that takes a chainId and returns the denom for the priority fee.
     */
    getCosmosPriorityFeeDenom?: (
      chainId: string
    ) => Promise<string | undefined>;
    /**
     * SVM Fee Payer
     *
     * This is used to pay for the transaction fees on SVM chains.
     * It should be an object with the following properties:
     * `address`: The address of the fee payer.
     * `signTransaction`: A function that takes the data to sign and returns a Promise that resolves to the signed transaction.
     */
    svmFeePayer?: {
      address: string;
      signTransaction: (dataToSign: Buffer) => Promise<Uint8Array>;
    };
  };

export const executeRoute = async (options: ExecuteRouteOptions) => {
  const { route, userAddresses, beforeMsg, afterMsg, timeoutSeconds } = options;

  let addressList: string[] = [];
  userAddresses.forEach((userAddress, index) => {
    const requiredChainAddress = route.requiredChainAddresses[index];

    if (requiredChainAddress === userAddress?.chainId) {
      addressList.push(userAddress.address);
    }
  });

  if (addressList.length !== route.requiredChainAddresses.length) {
    addressList = userAddresses.map((x) => x.address);
  }

  const validLength =
    addressList.length === route.requiredChainAddresses.length ||
    addressList.length === route.chainIds?.length;

  if (!validLength) {
    throw new Error("executeRoute error: invalid address list");
  }

  const isUserAddressesValid = await validateUserAddresses(userAddresses);

  if (!isUserAddressesValid) {
    throw new Error("executeRoute error: invalid user addresses");
  }
  console.log(addressList)

  const gasOps = [
    {
        "transfer": {
            "port": "transfer",
            "channel": "channel-1266",
            "fromChainId": "cosmoshub-4",
            "toChainId": "elys-1",
            "pfmEnabled": true,
            "supportsMemo": true,
            "denomIn": "uatom",
            "denomOut": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
            "bridgeId": "IBC",
            "smartRelay": false,
            "chainId": "cosmoshub-4",
            "destDenom": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
        },
        "txIndex": 0,
        "amountIn": "100000",
        "amountOut": "100000"
    },
    {
        "swap": {
            "swapIn": {
                "swapVenue": {
                    "name": "elys-native",
                    "chainId": "elys-1",
                    "logoUri": "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/elys/logo.svg"
                },
                "swapOperations": [
                    {
                        "pool": "1",
                        "denomIn": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
                        "denomOut": "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349"
                    },
                    {
                        "pool": "10",
                        "denomIn": "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349",
                        "denomOut": "ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85"
                    }
                ],
                "swapAmountIn": "100000",
                "estimatedAmountOut": "2904733"
            },
            "estimatedAffiliateFee": "0ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85",
            "fromChainId": "elys-1",
            "chainId": "elys-1",
            "denomIn": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
            "denomOut": "ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85",
            "swapVenues": [
                {
                    "name": "elys-native",
                    "chainId": "elys-1",
                    "logoUri": "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/elys/logo.svg"
                }
            ]
        },
        "txIndex": 0,
        "amountIn": "100000",
        "amountOut": "2904733"
    },
    {
        "transfer": {
            "port": "transfer",
            "channel": "channel-6",
            "fromChainId": "elys-1",
            "toChainId": "osmosis-1",
            "pfmEnabled": true,
            "supportsMemo": true,
            "denomIn": "ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85",
            "denomOut": "uosmo",
            "bridgeId": "IBC",
            "smartRelay": false,
            "chainId": "elys-1",
            "destDenom": "uosmo"
        },
        "txIndex": 0,
        "amountIn": "2904733",
        "amountOut": "2904733"
    }
]

  const addressGasList = [
    "cosmos1g3jjhgkyf36pjhe7u5cw8j9u6cgl8x929ej430",
    "elys1g3jjhgkyf36pjhe7u5cw8j9u6cgl8x929etjud",
    "ab"
  ]

  const gasRoute = {
    "sourceAssetDenom": "uatom",
    "sourceAssetChainId": "cosmoshub-4",
    "destAssetDenom": "uosmo",
    "destAssetChainId": "osmosis-1",
    "amountIn": "100000",
    "amountOut": "2901947",
    "operations": [
        {
            "transfer": {
                "port": "transfer",
                "channel": "channel-1266",
                "fromChainId": "cosmoshub-4",
                "toChainId": "elys-1",
                "pfmEnabled": true,
                "supportsMemo": true,
                "denomIn": "uatom",
                "denomOut": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
                "bridgeId": "IBC",
                "smartRelay": false,
                "chainId": "cosmoshub-4",
                "destDenom": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
            },
            "txIndex": 0,
            "amountIn": "100000",
            "amountOut": "100000"
        },
        {
            "swap": {
                "swapIn": {
                    "swapVenue": {
                        "name": "elys-native",
                        "chainId": "elys-1",
                        "logoUri": "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/elys/logo.svg"
                    },
                    "swapOperations": [
                        {
                            "pool": "1",
                            "denomIn": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
                            "denomOut": "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349"
                        },
                        {
                            "pool": "10",
                            "denomIn": "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349",
                            "denomOut": "ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85"
                        }
                    ],
                    "swapAmountIn": "100000",
                    "estimatedAmountOut": "2901947"
                },
                "estimatedAffiliateFee": "0ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85",
                "fromChainId": "elys-1",
                "chainId": "elys-1",
                "denomIn": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
                "denomOut": "ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85",
                "swapVenues": [
                    {
                        "name": "elys-native",
                        "chainId": "elys-1",
                        "logoUri": "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/elys/logo.svg"
                    }
                ]
            },
            "txIndex": 0,
            "amountIn": "100000",
            "amountOut": "2901947"
        },
        {
            "transfer": {
                "port": "transfer",
                "channel": "channel-6",
                "fromChainId": "elys-1",
                "toChainId": "osmosis-1",
                "pfmEnabled": true,
                "supportsMemo": true,
                "denomIn": "ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85",
                "denomOut": "uosmo",
                "bridgeId": "IBC",
                "smartRelay": false,
                "chainId": "elys-1",
                "destDenom": "uosmo"
            },
            "txIndex": 0,
            "amountIn": "2901947",
            "amountOut": "2901947"
        }
    ],
    "chainIds": [
        "cosmoshub-4",
        "elys-1",
        "osmosis-1"
    ],
    "doesSwap": true,
    "estimatedAmountOut": "2901947",
    "swapVenues": [
        {
            "name": "elys-native",
            "chainId": "elys-1",
            "logoUri": "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/elys/logo.svg"
        }
    ],
    "txsRequired": 1,
    "usdAmountIn": "0.41",
    "usdAmountOut": "0.41",
    "estimatedFees": [],
    "requiredChainAddresses": [
        "cosmoshub-4",
        "elys-1",
        "osmosis-1"
    ],
    "estimatedRouteDurationSeconds": 60,
    "swapVenue": {
        "name": "elys-native",
        "chainId": "elys-1",
        "logoUri": "https://raw.githubusercontent.com/skip-mev/skip-go-registry/main/swap-venues/elys/logo.svg"
    }
}

  const gasMsg = await messages({
    timeoutSeconds,
    amountIn: gasRoute?.amountIn,
    amountOut: gasRoute?.amountOut || "0",
    sourceAssetChainId: gasRoute?.sourceAssetChainId,
    sourceAssetDenom: gasRoute?.sourceAssetDenom,
    destAssetChainId: gasRoute?.destAssetChainId,
    destAssetDenom: gasRoute?.destAssetDenom,
    operations: gasOps,
    addressList: addressGasList,
    slippageTolerancePercent: "0.000000001",
    chainIdsToAffiliates: ApiState.chainIdsToAffiliates,
  })

  const response = await messages({
    timeoutSeconds,
    amountIn: route?.amountIn,
    amountOut: route.estimatedAmountOut || "0",
    sourceAssetChainId: route?.sourceAssetChainId,
    sourceAssetDenom: route?.sourceAssetDenom,
    destAssetChainId: route?.destAssetChainId,
    destAssetDenom: route?.destAssetDenom,
    operations: route?.operations,
    addressList: addressList,
    slippageTolerancePercent: options.slippageTolerancePercent || "1",
    chainIdsToAffiliates: ApiState.chainIdsToAffiliates,
    postRouteHandler: options.postRouteHandler,
    feePayerAddress: options.svmFeePayer?.address,
  });

  const firstTx = response?.txs?.[0];
  if (firstTx && "cosmosTx" in firstTx) {
      // @ts-ignore
      firstTx.cosmosTx?.msgs?.unshift(gasMsg?.txs?.[0]?.cosmosTx?.msgs?.[0]);
    }

  if (beforeMsg && (response?.txs?.length ?? 0) > 0) {
    const firstTx = response?.txs?.[0];
    if (firstTx && "cosmosTx" in firstTx) {
      firstTx.cosmosTx?.msgs?.unshift(beforeMsg);
    }
  }

  if (afterMsg && (response?.txs?.length ?? 0) > 0) {
    const lastTx = response?.txs?.[response.txs.length - 1];
    if (lastTx && "cosmosTx" in lastTx) {
      lastTx.cosmosTx?.msgs?.push(afterMsg);
    }
  }
  console.log("response ",response)

  await executeTransactions({ ...options, txs: response?.txs });
};

const validateUserAddresses = async (userAddresses: UserAddress[]) => {
  const chains = await ClientState.getSkipChains();
  const validations = userAddresses.map((userAddress) => {
    const chain = chains.find((chain) => chain.chainId === userAddress.chainId);

    switch (chain?.chainType) {
      case ChainType.Cosmos:
        try {
          if (chain.chainId?.includes("penumbra")) {
            try {
              return (
                chain.bech32Prefix ===
                bech32m.decode(userAddress.address, 143)?.prefix
              );
            } catch {
              // The temporary solution to route around Noble address breakage.
              // This can be entirely removed once `noble-1` upgrades.
              return ["penumbracompat1", "tpenumbra"].includes(
                bech32.decode(userAddress.address, 1023).prefix
              );
            }
          }
          return (
            chain.bech32Prefix ===
            bech32.decode(userAddress.address, 1023).prefix
          );
        } catch {
          return false;
        }

      case ChainType.Evm:
        try {
          return isAddress(userAddress.address);
        } catch (_error) {
          return false;
        }
      case ChainType.Svm:
        try {
          const publicKey = new PublicKey(userAddress.address);
          return PublicKey.isOnCurve(publicKey);
        } catch (_error) {
          return false;
        }
      default:
        return false;
    }
  });

  return validations.every((validation) => validation);
};
