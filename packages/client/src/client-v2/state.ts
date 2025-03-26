import { Registry } from "@cosmjs/proto-signing";
import { AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import * as clientTypes from "../client-types";
import * as types from "../types";
import { createRequestClient } from "./fetch-request-client";
import { Asset } from "src/types/types";

export class ClientState {
  static requestClient: ReturnType<typeof createRequestClient>;

  static aminoTypes: AminoTypes;
  static registry: Registry;

  static endpointOptions: {
    endpoints?: Record<string, clientTypes.EndpointOptions>;
    getRpcEndpointForChain?: (chainID: string) => Promise<string>;
    getRestEndpointForChain?: (chainID: string) => Promise<string>;
  };
  static getCosmosSigner?: clientTypes.SignerGetters["getCosmosSigner"];
  static getEVMSigner?: clientTypes.SignerGetters["getEVMSigner"];
  static getSVMSigner?: clientTypes.SignerGetters["getSVMSigner"];
  static chainIDsToAffiliates?: clientTypes.SkipClientOptions["chainIDsToAffiliates"];
  static cumulativeAffiliateFeeBPS?: string = "0";

  static clientOptions: clientTypes.SkipClientOptions;
  static skipChains?: types.Chain[];
  static skipAssets?: Record<string, Asset[]>;
  static skipBalances?: types.BalanceResponse;
  static signingStargateClientByChainId: Record<string, SigningStargateClient> =
    {};
  static gasFee: clientTypes.Gas[] | undefined;
}
