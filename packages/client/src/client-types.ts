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
import { TransactionCallbacks } from './types';

/** Common Types */
export interface UserAddress {
  chainID: string;
  address: string;
}

export type EndpointOptions = {
  rpc?: string;
  rest?: string;
};

export type Gas = {
  error: null;
  asset: types.FeeAsset;
  fee: StdFee;
}

/** Signer Getters */
export interface SignerGetters {
  getEVMSigner?: (chainID: string) => Promise<WalletClient>;
  getCosmosSigner?: (chainID: string) => Promise<OfflineSigner>;
  getSVMSigner?: () => Promise<Adapter>;
}

/** Gas Options */
export type GetFallbackGasAmount = (
  chainID: string,
  chainType: types.ChainType
) => Promise<number | undefined>;

export type GetGasPrice = (
  chainID: string,
  chainType: types.ChainType
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
  types.TransactionCallbacks & {
    route: types.RouteResponse;
    /**
     * Addresses should be in the same order with the `chainIDs` in the `route`
     */
    userAddresses: UserAddress[];
    validateGasBalance?: boolean;
    slippageTolerancePercent?: string;
    /**
 * Arbitrary Tx to be executed before or after route msgs
 */
    beforeMsg?: types.CosmosMsg;
    afterMsg?: types.CosmosMsg;
  };


export type ExecuteCosmosMessageOptions = {
  signerAddress: string;
  signer: OfflineSigner;
  message: types.MultiChainMsg;
  fee: StdFee;
};

export type ExecuteCosmosMessage = GasOptions & {
  signerAddress: string;
  getCosmosSigner?: SignerGetters['getCosmosSigner'];
  chainID: string;
  messages: types.CosmosMsg[];
  gas: Gas
  onTransactionSigned?: TransactionCallbacks['onTransactionSigned'];
  onTransactionBroadcast?: TransactionCallbacks['onTransactionBroadcast'];
};

interface SignCosmosMessageOptionsBase {
  signerAddress: string;
  chainID: string;
  cosmosMsgs: types.CosmosMsg[];
  fee: StdFee;
  signerData: SignerData;
}

export type SignCosmosMessageDirectOptions =
  SignCosmosMessageOptionsBase & {
    signer: OfflineDirectSigner;
  };

export type SignCosmosMessageAminoOptions =
  SignCosmosMessageOptionsBase & {
    signer: OfflineAminoSigner;
  };
