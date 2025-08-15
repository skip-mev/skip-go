//@ts-nocheck
import { GeneratedType, Registry, OfflineSigner } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import type { HttpEndpoint } from "@cosmjs/stargate";
import * as opinitOphostV1TxRegistry from "./ophost/v1/tx.registry";
import * as opinitOphostV1TxAmino from "./ophost/v1/tx.amino";
export const opinitAminoConverters = {
  ...opinitOphostV1TxAmino.AminoConverter
};
export const opinitProtoRegistry: ReadonlyArray<[string, GeneratedType]> = [...opinitOphostV1TxRegistry.registry];
export const getSigningOpinitClientOptions = ({
  defaultTypes = defaultRegistryTypes
}: {
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
} = {}): {
  registry: Registry;
  aminoTypes: AminoTypes;
} => {
  const registry = new Registry([...defaultTypes, ...opinitProtoRegistry]);
  const aminoTypes = new AminoTypes({
    ...opinitAminoConverters
  });
  return {
    registry,
    aminoTypes
  };
};
export const getSigningOpinitClient = async ({
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
  } = getSigningOpinitClientOptions({
    defaultTypes
  });
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry: registry as any,
    aminoTypes
  });
  return client;
};