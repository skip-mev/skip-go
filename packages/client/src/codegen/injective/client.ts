//@ts-nocheck
import { GeneratedType, Registry, OfflineSigner } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import type { HttpEndpoint } from "@cosmjs/stargate";
import * as injectiveWasmxV1TxRegistry from "./wasmx/v1/tx.registry";
import * as injectiveWasmxV1TxAmino from "./wasmx/v1/tx.amino";
export const injectiveAminoConverters = {
  ...injectiveWasmxV1TxAmino.AminoConverter
};
export const injectiveProtoRegistry: ReadonlyArray<[string, GeneratedType]> = [...injectiveWasmxV1TxRegistry.registry];
export const getSigningInjectiveClientOptions = ({
  defaultTypes = defaultRegistryTypes
}: {
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
} = {}): {
  registry: Registry;
  aminoTypes: AminoTypes;
} => {
  const registry = new Registry([...defaultTypes, ...injectiveProtoRegistry]);
  const aminoTypes = new AminoTypes({
    ...injectiveAminoConverters
  });
  return {
    registry,
    aminoTypes
  };
};
export const getSigningInjectiveClient = async ({
  rpcEndpoint,
  signer,
  defaultTypes = defaultRegistryTypes
}: {
  rpcEndpoint: string | HttpEndpoint;
  signer: OfflineSigner;
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
}) => {
  const {
    registry,
    aminoTypes
  } = getSigningInjectiveClientOptions({
    defaultTypes
  });
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry: (registry as any),
    aminoTypes
  });
  return client;
};