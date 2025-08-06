import { AminoTypes } from "@cosmjs/stargate";
import { createDefaultAminoConverters, defaultRegistryTypes } from "@cosmjs/stargate";
import { createWasmAminoConverters } from "@cosmjs/cosmwasm-stargate";
import { circleAminoConverters, circleProtoRegistry } from "src/codegen/circle/client";
import { evmosAminoConverters, evmosProtoRegistry } from "src/codegen/evmos/client";
import { initiaAminoConverters } from "src/codegen/initia/client"
import { opinitAminoConverters } from "src/codegen/opinit/client"
import { Registry } from "@cosmjs/proto-signing";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx.js";
import { MsgExecute } from "src/codegen/initia/move/v1/tx";
import { MsgInitiateTokenDeposit } from "src/codegen/opinit/ophost/v1/tx";
import { ClientState } from "../state/clientState";
import type { SkipClientOptions } from "../state/clientState";
import { createRequestClient } from "../utils/generateApi";
import { ApiState } from "src/state/apiState";

export const setClientOptions = (options: SkipClientOptions = {}) => {
  ApiState.client = createRequestClient({
    apiUrl: options.apiUrl || "https://api.skip.build",
    apiKey: options.apiKey,
    apiHeaders: options.apiHeaders,
  });

  ClientState.endpointOptions = options.endpointOptions ?? {};

  ClientState.aminoTypes = new AminoTypes({
    ...createDefaultAminoConverters(),
    ...createWasmAminoConverters(),
    ...circleAminoConverters,
    ...evmosAminoConverters,
    ...initiaAminoConverters,
    ...opinitAminoConverters,
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

  if (!options.allowOptionsUpdateAfterApiCall && ApiState.apiCalled && !ApiState.initialized) {
    throw new Error("setClientOptions must be called before an api request is made");
  }

  ApiState.initialized = true;
};
