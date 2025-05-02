import { AminoTypes } from "@cosmjs/stargate/build/aminotypes";
import {
  createDefaultAminoConverters,
  defaultRegistryTypes,
} from "@cosmjs/stargate/build/signingstargateclient";
import { createWasmAminoConverters } from "@cosmjs/cosmwasm-stargate/build/modules/wasm/aminomessages";
import { circleAminoConverters, circleProtoRegistry } from "src/codegen/circle/client";
import { evmosAminoConverters, evmosProtoRegistry } from "src/codegen/evmos/client";
import { Registry } from "@cosmjs/proto-signing/build/registry";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { MsgExecute } from "src/codegen/initia/move/v1/tx";
import { MsgInitiateTokenDeposit } from "src/codegen/opinit/ophost/v1/tx";
import { ClientState, SkipClientOptions } from "../state";
import { createRequestClient } from "../utils/generateApi";
import { Affiliate, ChainAffiliates } from "../types/swaggerTypes";
import { Fetch } from "src/utils/fetchClient";

export const setClientOptions = (options: SkipClientOptions = {}) => {
  Fetch.client = createRequestClient({
    baseUrl: options.apiUrl || "https://api.skip.build",
    apiKey: options.apiKey,
  });

  ClientState.endpointOptions = options.endpointOptions ?? {};
  ClientState.getCosmosSigner = options.getCosmosSigner;
  ClientState.getEVMSigner = options.getEVMSigner;
  ClientState.getSVMSigner = options.getSVMSigner;

  ClientState.aminoTypes = new AminoTypes({
    ...createDefaultAminoConverters(),
    ...createWasmAminoConverters(),
    ...circleAminoConverters,
    ...evmosAminoConverters,
    ...(options.aminoTypes ?? {}),
  });

  ClientState.registry = new Registry([
    ...defaultRegistryTypes,
    ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
    ["/initia.move.v1.MsgExecute", MsgExecute],
    ["/opinit.ophost.v1.MsgInitiateTokenDeposit", MsgInitiateTokenDeposit],
    ...circleProtoRegistry,
    ...evmosProtoRegistry,
    ...(options.registryTypes ?? []),
  ]);

  if (options.chainIdsToAffiliates) {
    ClientState.cumulativeAffiliateFeeBPS = validateChainIdsToAffiliates(
      options.chainIdsToAffiliates,
    );
    ClientState.chainIdsToAffiliates = options.chainIdsToAffiliates;
  }

  Fetch.setClientInitialized();
};

function validateChainIdsToAffiliates(chainIdsToAffiliates: Record<string, ChainAffiliates>) {
  const affiliatesArray = Object.values(chainIdsToAffiliates)
    .map((chain) => chain.affiliates)
    .filter((a) => a !== undefined) as Affiliate[][];

  const firstAffiliateBasisPointsFee = affiliatesArray[0]?.reduce((acc, affiliate) => {
    if (!affiliate.basisPointsFee) {
      throw new Error("basisPointFee must exist in each affiliate");
    }
    return acc + parseInt(affiliate.basisPointsFee, 10);
  }, 0);

  const allBasisPointsAreEqual = affiliatesArray.every((affiliate) => {
    const totalBasisPointsFee = affiliate.reduce((acc, affiliate) => {
      if (!affiliate.basisPointsFee) {
        throw new Error("basisPointFee must exist in each affiliate");
      }
      if (!affiliate.address) {
        throw new Error("address to receive fee must exist in each affiliate");
      }
      return acc + parseInt(affiliate?.basisPointsFee, 10);
    }, 0);
    return totalBasisPointsFee === firstAffiliateBasisPointsFee;
  });

  if (!allBasisPointsAreEqual) {
    throw new Error(
      "basisPointFee does not add up to the same number for each chain in chainIdsToAffiliates",
    );
  }

  return firstAffiliateBasisPointsFee?.toFixed(0);
}
