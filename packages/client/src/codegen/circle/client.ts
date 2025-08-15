//@ts-nocheck
import { GeneratedType, Registry, OfflineSigner } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import type { HttpEndpoint } from "@cosmjs/stargate";
import * as circleCctpV1TxRegistry from "./cctp/v1/tx.registry";
import * as circleCctpV1TxAmino from "./cctp/v1/tx.amino";
export const circleAminoConverters = {
  ...circleCctpV1TxAmino.AminoConverter
};
export const circleProtoRegistry: ReadonlyArray<[string, GeneratedType]> = [...circleCctpV1TxRegistry.registry];
export const getSigningCircleClientOptions = ({
  defaultTypes = defaultRegistryTypes
}: {
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
} = {}): {
  registry: Registry;
  aminoTypes: AminoTypes;
} => {
  const registry = new Registry([...defaultTypes, ...circleProtoRegistry]);
  const aminoTypes = new AminoTypes({
    ...circleAminoConverters
  });
  return {
    registry,
    aminoTypes
  };
};
export const getSigningCircleClient = async ({
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
  } = getSigningCircleClientOptions({
    defaultTypes
  });
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry: registry as any,
    aminoTypes
  });
  return client;
};