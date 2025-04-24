import { OfflineAminoSigner } from "@cosmjs/amino";
import {
  GeneratedType,
  OfflineDirectSigner,
  OfflineSigner,
} from "@cosmjs/proto-signing";
import {
  AminoConverters,
  GasPrice,
  SignerData,
  StdFee,
} from "@cosmjs/stargate";

import { WalletClient } from "viem";

import * as types from "./types";
import { Adapter } from "@solana/wallet-adapter-base";
import { MsgsRequest, TransactionCallbacks } from "./types";

/** Common Types */
export interface UserAddress {
  chainID: string;
  address: string;
}

export type EndpointOptions = {
  rpc?: string;
  rest?: string;
};

export type ValidateGasResult = {
  error: null | string;
  asset: types.FeeAsset | null;
  fee: StdFee | null;
};

/** Signer Getters */
export interface SignerGetters {
  getEVMSigner?: (chainID: string) => Promise<WalletClient>;
  getCosmosSigner?: (
    chainID: string,
  ) => Promise<
    | (OfflineAminoSigner & OfflineDirectSigner)
    | OfflineAminoSigner
    | OfflineDirectSigner
  >;
  getSVMSigner?: () => Promise<Adapter>;
}

/** Gas Options */
export type GetFallbackGasAmount = (
  chainID: string,
  chainType: types.ChainType,
) => Promise<number | undefined>;

export type GetGasPrice = (
  chainID: string,
  chainType: types.ChainType,
) => Promise<GasPrice | undefined>;

interface GasOptions {
  /**
   * If `getGasPrice` is undefined, or returns undefined, the router will attempt to set the recommended gas price
   **/
  getGasPrice?: GetGasPrice;
  /**
   * If `getFallbackGasAmount` is set, when router fails to simulate the gas amount, it will use the fallback gas amount
   */
  getFallbackGasAmount?: GetFallbackGasAmount;
  gasAmountMultiplier?: number;
}

/** Skip Client Options */
export interface SkipClientOptions extends SignerGetters {
  apiURL?: string;
  apiKey?: string;
  endpointOptions?: {
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainID: string) => Promise<string>;
    getRestEndpointForChain?: (chainID: string) => Promise<string>;
  };
  aminoTypes?: AminoConverters;
  registryTypes?: Iterable<[string, GeneratedType]>;
  chainIDsToAffiliates?: Record<string, types.ChainAffiliates>;
  cacheDurationMs?: number;
}

/** Execute Route Options */
export type ExecuteRouteOptions = SignerGetters &
  GasOptions &
  types.TransactionCallbacks &
  Pick<MsgsRequest, "timeoutSeconds"> & {
    route: types.RouteResponse;
    /**
     * Addresses should be in the same order with the `chainIDs` in the `route`
     */
    userAddresses: UserAddress[];
    /**
     * defaults to true
     * if `simulate` is set to `true`, it will simulate the transaction before sending it.
     * This is useful for checking if the transaction will succeed or not and get a proper gas amount.
     *
     * If `simulate` is set to `false`, it will not simulate the transaction and send it directly.
     * We suggest if you set it to `false` you should set `getFallbackGasAmount` for chainID that you are going to have.
     */
    simulate?: boolean;
    slippageTolerancePercent?: string;
    /**
     * Arbitrary Tx to be executed before or after route msgs
     */
    beforeMsg?: types.CosmosMsg;
    afterMsg?: types.CosmosMsg;
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
  };

export type ExecuteCosmosMessageOptions = {
  signerAddress: string;
  signer: OfflineSigner;
  message: types.MultiChainMsg;
  fee: StdFee;
};

export type ExecuteCosmosMessage = GasOptions & {
  signerAddress: string;
  getCosmosSigner?: SignerGetters["getCosmosSigner"];
  chainID: string;
  messages: types.CosmosMsg[];
  gas: ValidateGasResult;
  onTransactionSigned?: TransactionCallbacks["onTransactionSigned"];
  onTransactionBroadcast?: TransactionCallbacks["onTransactionBroadcast"];
};

interface SignCosmosMessageOptionsBase {
  signerAddress: string;
  chainID: string;
  cosmosMsgs: types.CosmosMsg[];
  fee: StdFee;
  signerData: SignerData;
}

export type SignCosmosMessageDirectOptions = SignCosmosMessageOptionsBase & {
  signer: OfflineDirectSigner;
};

export type SignCosmosMessageAminoOptions = SignCosmosMessageOptionsBase & {
  signer: OfflineAminoSigner;
};
