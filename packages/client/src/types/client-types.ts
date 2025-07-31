import type { OfflineAminoSigner } from "@cosmjs/amino";
import type { OfflineDirectSigner } from "@cosmjs/proto-signing";
import type { GasPrice, SignerData, StdFee } from "@cosmjs/stargate";

import type { WalletClient } from "viem";

import type { Adapter } from "@solana/wallet-adapter-base";
import type { ChainType, CosmosMsg, FeeAsset } from "./swaggerTypes";
import type { TrackTxPollingProps } from "src/api/postTrackTransaction";

/** Common Types */
export type UserAddress = {
  chainId: string;
  address: string;
};

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
  getEvmSigner?: (chainId: string) => Promise<WalletClient>;
  getCosmosSigner?: (
    chainId: string
  ) => Promise<
    | (OfflineAminoSigner & OfflineDirectSigner)
    | OfflineAminoSigner
    | OfflineDirectSigner
  >;
  getSvmSigner?: () => Promise<Adapter>;
};

/** Gas Options */
export type GetFallbackGasAmount = (
  chainId: string,
  chainType: ChainType
) => Promise<number | undefined>;

export type GetGasPrice = (
  chainId: string,
  chainType: ChainType
) => Promise<GasPrice | undefined>;

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

export type TxResult = {
  txHash: string;
  chainId: string;
  explorerLink?: string;
};

export interface BaseSettings {
  slippageTolerancePercent?: string;
  simulate?: boolean;
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
   * If `cosmosPriorityFeeDenom` is provided, it will be used to set the priority fee for Cosmos transactions.
   * It should be a function that takes a chainId and returns the denom for the priority fee.
   */
  getCosmosPriorityFeeDenom?: (chainId: string) => Promise<string | undefined>;
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
}
