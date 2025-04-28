import { GeneratedType, OfflineDirectSigner, Registry } from "@cosmjs/proto-signing";
import { AminoConverters, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import { Chain, Asset, ChainAffiliates, FeeAsset } from "./types/swaggerTypes";
import { ApiResponse, createRequestClient } from "./utils/generateApi";
import { WalletClient } from "viem";
import { OfflineAminoSigner } from "@cosmjs/amino";
import { Adapter } from "@solana/wallet-adapter-base/lib/types/types";
import { StdFee } from "@cosmjs/stargate";
import { getMainnetAndTestnetChains } from "./private-functions/getMainnetAndTestnetChains";
import { getMainnetAndTestnetAssets } from "./private-functions/getMainnetAndTestnetAssets";
import { balances } from "./api/getBalances";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ClientState {
  static requestClient: ReturnType<typeof createRequestClient>;

  static {
    ClientState.requestClient = createRequestClient({
      baseURL: "https://api.skip.build",
    });
  }

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
      this.skipAssets;
    }

    const response = await getMainnetAndTestnetAssets();
    this.skipAssets = response;
    return response;
  }

  static async getSkipBalances() {
    if (this.skipBalances) {
      return this.skipBalances;
    }

    const response = await balances.request();
    this.skipBalances = response;
    return response;
  }

  static signingStargateClientByChainId: Record<string, SigningStargateClient> = {};
  static validateGasResults: ValidateGasResult[] | undefined;
}

export type SignerGetters = {
  getEVMSigner?: (chainId: string) => Promise<WalletClient>;
  getCosmosSigner?: (
    chainId: string,
  ) => Promise<
    (OfflineAminoSigner & OfflineDirectSigner) | OfflineAminoSigner | OfflineDirectSigner
  >;
  getSVMSigner?: () => Promise<Adapter>;
};

export type SkipClientOptions = {
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
} & SignerGetters;

export type EndpointOptions = {
  rpc?: string;
  rest?: string;
};

export type ValidateGasResult = {
  error: null | string;
  asset: FeeAsset | null;
  fee: StdFee | null;
};
