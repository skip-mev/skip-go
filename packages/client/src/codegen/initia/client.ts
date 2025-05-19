//@ts-nocheck
import { GeneratedType, Registry, OfflineSigner } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import type { HttpEndpoint } from "@cosmjs/stargate";
import * as initiaMoveV1TxRegistry from "./move/v1/tx.registry";
import * as initiaMoveV1TxAmino from "./move/v1/tx.amino";
export const initiaAminoConverters = {
  ...initiaMoveV1TxAmino.AminoConverter
};
export const initiaProtoRegistry: ReadonlyArray<[string, GeneratedType]> = [...initiaMoveV1TxRegistry.registry];
export const getSigningInitiaClientOptions = ({
  defaultTypes = defaultRegistryTypes
}: {
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
} = {}): {
  registry: Registry;
  aminoTypes: AminoTypes;
} => {
  const registry = new Registry([...defaultTypes, ...initiaProtoRegistry]);
  const aminoTypes = new AminoTypes({
    ...initiaAminoConverters
  });
  return {
    registry,
    aminoTypes
  };
};
export const getSigningInitiaClient = async ({
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
  } = getSigningInitiaClientOptions({
    defaultTypes
  });
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry: (registry as any),
    aminoTypes
  });
  return client;
};