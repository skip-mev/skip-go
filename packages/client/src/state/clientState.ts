import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { AminoConverters, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import { Chain, Asset } from "../types/swaggerTypes";
import { ApiResponse } from "../utils/generateApi";
import { getMainnetAndTestnetChains } from "../private-functions/getMainnetAndTestnetChains";
import {
  getMainnetAndTestnetAssets,
  GetMainnetAndTestnetAssetsProps,
} from "../private-functions/getMainnetAndTestnetAssets";
import { balances } from "../api/postBalances";
import { EndpointOptions, ValidateGasResult } from "src/types/client-types";
import { SkipApiOptions } from "./apiState";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ClientState {
  static aminoTypes: AminoTypes;
  static registry: Registry;

  static endpointOptions: {
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainId: string) => Promise<string>;
    getRestEndpointForChain?: (chainId: string) => Promise<string>;
  };

  static skipChains?: Chain[];
  static skipAssets?: Record<string, Asset[]>;
  static skipBalances?: Record<string, ApiResponse<"getBalances">>;

  static async getSkipChains(apiOptions?: SkipApiOptions) {
    if (this.skipChains) {
      return this.skipChains;
    }

    const response = await getMainnetAndTestnetChains(apiOptions);

    this.skipChains = response;
    return response;
  }

  static async getSkipAssets(props: GetMainnetAndTestnetAssetsProps) {
    if (this.skipAssets) {
      return this.skipAssets;
    }

    const response = await getMainnetAndTestnetAssets(props);
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
}

export type SkipClientOptions = SkipApiOptions & {
  endpointOptions?: {
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainId: string) => Promise<string>;
    getRestEndpointForChain?: (chainId: string) => Promise<string>;
  };
  aminoTypes?: AminoConverters;
  registryTypes?: Iterable<[string, GeneratedType]>;
  cacheDurationMs?: number;
};
