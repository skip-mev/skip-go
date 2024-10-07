import { Coin, OfflineAminoSigner } from '@cosmjs/amino';
import {
  GeneratedType,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import {
  AminoConverters,
  GasPrice,
  SignerData,
  StdFee,
} from '@cosmjs/stargate';

import { WalletClient } from 'viem';

import * as types from './types';
import { Adapter } from '@solana/wallet-adapter-base';

/** Common Types */
export interface UserAddress {
  chainID: string;
  address: string;
}

export type EndpointOptions = {
  rpc?: string;
  rest?: string;
};

/** Signer Getters */
interface SignerGetters {
  getEVMSigner?: (chainID: string) => Promise<WalletClient>;
  getCosmosSigner?: (chainID: string) => Promise<OfflineSigner>;
  getSVMSigner?: () => Promise<Adapter>;
}

export type ChainType = 'evm' | 'cosmos' | 'svm';

/** Gas Options */
export type GetFallbackGasAmount = (
  chainID: string,
  chainType: ChainType
) => Promise<number | undefined>;

export type GetGasPrice = (
  chainID: string,
  chainType: ChainType
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

/** Transaction Callbacks */
export interface TransactionCallbacks {
  onTransactionSigned?: (txInfo: {
    txHash: string;
    chainID: string;
  }) => Promise<void>;
  onTransactionBroadcast?: (txInfo: {
    txHash: string;
    chainID: string;
  }) => Promise<void>;
  onTransactionTracked?: (txInfo: {
    txHash: string;
    chainID: string;
    explorerLink: string;
  }) => Promise<void>;
  onTransactionCompleted?: (
    chainID: string,
    txHash: string,
    status: types.TxStatusResponse
  ) => Promise<void>;
  onValidateGasBalance?: (value: {
    chainID?: string;
    txIndex?: number;
    status: 'success' | 'error' | 'pending' | 'completed';
  }) => Promise<void>;
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
}

/** Execute Route Options */
export type ExecuteRouteOptions = SignerGetters &
  GasOptions &
  TransactionCallbacks & {
    route: types.RouteResponse;
    /**
     * Addresses should be in the same order with the `chainIDs` in the `route`
     */
    userAddresses: UserAddress[];
    validateGasBalance?: boolean;
    slippageTolerancePercent?: string;
  };

/** Execute Cosmos Message Options */
export type ExecuteCosmosMessageOptions = {
  signerAddress: string;
  signer: OfflineSigner;
  message: types.MultiChainMsg;
  fee: StdFee;
};

/** Execute Cosmos Message */
export type ExecuteCosmosMessage = GasOptions &
  Partial<TransactionCallbacks> & {
    signerAddress: string;
    getCosmosSigner?: (chainID: string) => Promise<OfflineSigner>;
    chainID: string;
    messages: types.CosmosMsg[];
    gasTokenUsed?: Coin;
    onTransactionSigned?: (txInfo: {
      txHash: string;
      chainID: string;
    }) => Promise<void>;
  };

/** Sign Cosmos Message Options Base */
interface SignCosmosMessageOptionsBase {
  signerAddress: string;
  chainID: string;
  cosmosMsgs: types.CosmosMsg[];
  fee: StdFee;
  signerData: SignerData;
}

/** Sign Cosmos Message Direct Options */
export type SignCosmosMessageDirectOptions =
  SignCosmosMessageOptionsBase & {
    signer: OfflineDirectSigner;
  };

/** Sign Cosmos Message Amino Options */
export type SignCosmosMessageAminoOptions =
  SignCosmosMessageOptionsBase & {
    signer: OfflineAminoSigner;
  };
