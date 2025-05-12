import { OfflineAminoSigner } from "@cosmjs/amino";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { GasPrice, SignerData, StdFee } from "@cosmjs/stargate";

import { WalletClient } from "viem";

import { Adapter } from "@solana/wallet-adapter-base";
import { ChainType, CosmosMsg, FeeAsset } from "./swaggerTypes";
import { ICosmosGenericOfflineSigner } from "@interchainjs/cosmos/types/wallet";

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
  getCosmosSigner?: (chainId: string) => Promise<ICosmosGenericOfflineSigner>;
  getSvmSigner?: () => Promise<Adapter>;
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

export type TxResult = {
  txHash: string;
  chainId: string;
};
