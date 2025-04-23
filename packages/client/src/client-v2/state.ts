import {
  GeneratedType,
  OfflineDirectSigner,
  Registry,
} from "@cosmjs/proto-signing";
import {
  AminoConverters,
  AminoTypes,
  SigningStargateClient,
} from "@cosmjs/stargate";
import {
  Chain,
  Asset,
  ChainAffiliates,
  FeeAsset,
} from "./types/swaggerTypes";
import { ApiResponse, createRequestClient } from "./utils/generateApi";
import { WalletClient } from "viem/_types/clients/createWalletClient";
import { OfflineAminoSigner } from "@cosmjs/amino";
import { Adapter } from "@solana/wallet-adapter-base/lib/types/types";
import { StdFee } from "@cosmjs/stargate";

export class ClientState {
  static requestClient: ReturnType<typeof createRequestClient>;

  static aminoTypes: AminoTypes;
  static registry: Registry;

  static endpointOptions: {
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainID: string) => Promise<string>;
    getRestEndpointForChain?: (chainID: string) => Promise<string>;
  };
  static getCosmosSigner?: SignerGetters["getCosmosSigner"];
  static getEVMSigner?: SignerGetters["getEVMSigner"];
  static getSVMSigner?: SignerGetters["getSVMSigner"];
  static chainIDsToAffiliates?: Record<string, ChainAffiliates>;
  static cumulativeAffiliateFeeBPS?: string = "0";

  static skipChains?: Chain[];
  static skipAssets?: Record<string, Asset[]>;
  static skipBalances?: Record<string, ApiResponse<"getBalances">>;
  static signingStargateClientByChainId: Record<string, SigningStargateClient> =
    {};
  static validateGasResults: ValidateGasResult[] | undefined;
}

export type SignerGetters = {
  getEVMSigner?: (chainId: string) => Promise<WalletClient>;
  getCosmosSigner?: (
    chainId: string,
  ) => Promise<
    | (OfflineAminoSigner & OfflineDirectSigner)
    | OfflineAminoSigner
    | OfflineDirectSigner
  >;
  getSVMSigner?: () => Promise<Adapter>;
};

export interface SkipClientOptions extends SignerGetters {
  apiUrl?: string;
  apiKey?: string;
  endpointOptions?: {
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainId: string) => Promise<string>;
    getRestEndpointForChain?: (chainId: string) => Promise<string>;
  };
  aminoTypes?: AminoConverters;
  registryTypes?: Iterable<[string, GeneratedType]>;
  chainIDsToAffiliates?: Record<string, ChainAffiliates>;
  cacheDurationMs?: number;
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
