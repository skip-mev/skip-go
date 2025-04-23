import { OfflineAminoSigner } from "@cosmjs/amino";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { GasPrice, SignerData, StdFee } from "@cosmjs/stargate";

import { WalletClient } from "viem";

import { Adapter } from "@solana/wallet-adapter-base";
import { CosmosMsg, FeeAsset } from "./swaggerTypes";

/** Common Types */
export type UserAddress = {
  chainID: string;
  address: string;
};

export enum ChainType {
  Cosmos = "cosmos",
  EVM = "evm",
  SVM = "svm",
}

export type EndpointOptions = {
  rpc?: string;
  rest?: string;
};

export type ValidateGasResult = {
  error: null | string;
  asset: FeeAsset | null;
  fee: StdFee | null;
};

/** Signer Getters */
export type SignerGetters = {
  getEVMSigner?: (chainId: string) => Promise<WalletClient>;
  getCosmosSigner?: (
    chainId: string,
  ) => Promise<
    (OfflineAminoSigner & OfflineDirectSigner) | OfflineAminoSigner | OfflineDirectSigner
  >;
  getSVMSigner?: () => Promise<Adapter>;
};

/** Gas Options */
export type GetFallbackGasAmount = (
  chainId: string,
  chainType: ChainType,
) => Promise<number | undefined>;

export type GetGasPrice = (chainId: string, chainType: ChainType) => Promise<GasPrice | undefined>;

export type GasOptions = {
  /**
   * If `getGasPrice` is undefined, or returns undefined, the router will attempt to set the recommended gas price
   **/
  getGasPrice?: GetGasPrice;
  /**
   * If `getFallbackGasAmount` is set, when router fails to simulate the gas amount, it will use the fallback gas amount
   */
  getFallbackGasAmount?: GetFallbackGasAmount;
  gasAmountMultiplier?: number;
};

export type SignCosmosMessageOptionsBase = {
  signerAddress: string;
  chainId: string;
  cosmosMsgs: CosmosMsg[];
  fee: StdFee;
  signerData: SignerData;
};

export type SignCosmosMessageDirectOptions = SignCosmosMessageOptionsBase & {
  signer: OfflineDirectSigner;
};

export type SignCosmosMessageAminoOptions = SignCosmosMessageOptionsBase & {
  signer: OfflineAminoSigner;
};

/** Execute Route Options */
// export type ExecuteRouteOptions = SignerGetters &
//   GasOptions &
//   types.TransactionCallbacks &
//   Pick<MsgsRequest, "timeoutSeconds"> & {
//     route: types.RouteResponse;
//     /**
//      * Addresses should be in the same order with the `chainIDs` in the `route`
//      */
//     userAddresses: UserAddress[];
//     simulate?: boolean;
//     slippageTolerancePercent?: string;
//     /**
//      * Arbitrary Tx to be executed before or after route msgs
//      */
//     beforeMsg?: types.CosmosMsg;
//     afterMsg?: types.CosmosMsg;
//     /**
//      * Set allowance amount to max if EVM transaction requires allowance approval.
//      */
//     useUnlimitedApproval?: boolean;
//     /**
//     /**
//      * If `skipApproval` is set to `true`, the router will bypass checking whether
//      * the signer has granted approval for the specified token contract on an EVM chain.
//      * This can be useful if approval has already been handled externally or there are race conditions.
//      */
//     bypassApprovalCheck?: boolean;
//   };

// export type ExecuteCosmosMessageOptions = {
//   signerAddress: string;
//   signer: OfflineSigner;
//   message: types.MultiChainMsg;
//   fee: StdFee;
// };

// export type ExecuteCosmosMessage = GasOptions & {
//   signerAddress: string;
//   getCosmosSigner?: SignerGetters["getCosmosSigner"];
//   chainID: string;
//   messages: types.CosmosMsg[];
//   gas: ValidateGasResult;
//   onTransactionSigned?: TransactionCallbacks["onTransactionSigned"];
//   onTransactionBroadcast?: TransactionCallbacks["onTransactionBroadcast"];
// };

// interface SignCosmosMessageOptionsBase {
//   signerAddress: string;
//   chainID: string;
//   cosmosMsgs: types.CosmosMsg[];
//   fee: StdFee;
//   signerData: SignerData;
// }

// export type SignCosmosMessageDirectOptions = SignCosmosMessageOptionsBase & {
//   signer: OfflineDirectSigner;
// };

// export type SignCosmosMessageAminoOptions = SignCosmosMessageOptionsBase & {
//   signer: OfflineAminoSigner;
// };
