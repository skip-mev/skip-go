import * as clientTypes from "../client-types";
import { ClientState } from "./state";
import { createRequestClient } from "./fetch-request-client";
import * as types from "../types";

export const setClientOptions = (
  options: clientTypes.SkipClientOptions = {},
) => {
  ClientState.clientOptions = options;
  ClientState.requestClient = createRequestClient({
    baseURL: options.apiURL || "https://api.skip.build",
    apiKey: options.apiKey,
  });

  ClientState.endpointOptions = options.endpointOptions ?? {};
  ClientState.getCosmosSigner = options.getCosmosSigner;
  ClientState.getEVMSigner = options.getEVMSigner;
  ClientState.getSVMSigner = options.getSVMSigner;

  // ClientState.aminoTypes = new AminoTypes({
  //   ...createDefaultAminoConverters(),
  //   ...createWasmAminoConverters(),
  //   ...circleAminoConverters,
  //   ...evmosAminoConverters,
  //   ...(options.aminoTypes ?? {}),
  // });

  // ClientState.registry = new Registry([
  //   ...defaultRegistryTypes,
  //   ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
  //   ["/initia.move.v1.MsgExecute", MsgExecute],
  //   ["/opinit.ophost.v1.MsgInitiateTokenDeposit", MsgInitiateTokenDeposit],
  //   ...circleProtoRegistry,
  //   ...evmosProtoRegistry,
  //   ...(options.registryTypes ?? []),
  // ]);

  if (options.chainIDsToAffiliates) {
    ClientState.cumulativeAffiliateFeeBPS = validateChainIDsToAffiliates(
      options.chainIDsToAffiliates,
    );
    ClientState.chainIDsToAffiliates = options.chainIDsToAffiliates;
  }
};

function validateChainIDsToAffiliates(
  chainIDsToAffiliates: Record<string, types.ChainAffiliates>,
) {
  const affiliatesArray: types.Affiliate[][] = Object.values(
    chainIDsToAffiliates,
  ).map((chain) => chain.affiliates);

  const firstAffiliateBasisPointsFee = affiliatesArray[0]?.reduce(
    (acc, affiliate) => {
      if (!affiliate.basisPointsFee) {
        throw new Error("basisPointFee must exist in each affiliate");
      }
      return acc + parseInt(affiliate.basisPointsFee, 10);
    },
    0,
  );

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
      "basisPointFee does not add up to the same number for each chain in chainIDsToAffiliates",
    );
  }

  return firstAffiliateBasisPointsFee?.toFixed(0);
}
