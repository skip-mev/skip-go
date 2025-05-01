import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { AminoConverters, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import { Chain, Asset, ChainAffiliates } from "./types/swaggerTypes";
import { ApiResponse, createRequestClient } from "./utils/generateApi";
import { getMainnetAndTestnetChains } from "./private-functions/getMainnetAndTestnetChains";
import { getMainnetAndTestnetAssets } from "./private-functions/getMainnetAndTestnetAssets";
import { balances } from "./api/postBalances";
import { EndpointOptions, SignerGetters, ValidateGasResult } from "src/types/client-types";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ClientState {
  static requestClient: ReturnType<typeof createRequestClient>;

  static aminoTypes: AminoTypes;
  static registry: Registry;

  static endpointOptions: {
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainId: string) => Promise<string>;
    getRestEndpointForChain?: (chainId: string) => Promise<string>;
  };
  static getCosmosSigner?: SignerGetters["getCosmosSigner"];
  static getEVMSigner?: SignerGetters["getEVMSigner"];
  static getSVMSigner?: SignerGetters["getSVMSigner"];
  static chainIdsToAffiliates?: Record<string, ChainAffiliates>;
  static cumulativeAffiliateFeeBPS?: string = "0";

  static skipChains?: Chain[];
  static skipAssets?: Record<string, Asset[]>;
  static skipBalances?: Record<string, ApiResponse<"getBalances">>;

  static async getSkipChains() {
    if (this.skipChains) {
      return this.skipChains;
    }

    const response = await getMainnetAndTestnetChains();

    this.skipChains = response;
    return response;
  }

  static async getSkipAssets() {
    if (this.skipAssets) {
      return this.skipAssets;
    }

    const response = await getMainnetAndTestnetAssets();
    this.skipAssets = response;
    return response;
  }

  static async getSkipBalances() {
    if (this.skipBalances) {
      return this.skipBalances;
    }

    const response = await balances();
    this.skipBalances = response;
    return response;
  }

  static signingStargateClientByChainId: Record<string, SigningStargateClient> = {};
  static validateGasResults: ValidateGasResult[] | undefined;

  private static isInitialized = false;
  private static resolveInitialization: () => void;
  static clientInitialized: Promise<void> = new Promise<void>((resolve) => {
    this.resolveInitialization = () => {
      if (!this.isInitialized) {
        this.isInitialized = true;
        resolve();
      }
    };
  });

  static setClientInitialized() {
    this.resolveInitialization();
  }
}

export type SkipApiOptions = {
  apiUrl?: string;
  apiKey?: string;
  endpointOptions?: {
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainId: string) => Promise<string>;
    getRestEndpointForChain?: (chainId: string) => Promise<string>;
  };
}

export type SkipClientOptions = SkipApiOptions & {
  aminoTypes?: AminoConverters;
  registryTypes?: Iterable<[string, GeneratedType]>;
  chainIdsToAffiliates?: Record<string, ChainAffiliates>;
  cacheDurationMs?: number;
} & SignerGetters;
