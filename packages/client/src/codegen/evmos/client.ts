//@ts-nocheck
import { GeneratedType, Registry, OfflineSigner } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, AminoTypes, SigningStargateClient } from "@cosmjs/stargate";
import type { HttpEndpoint } from "@cosmjs/stargate";
import * as evmosErc20V1TxRegistry from "./erc20/v1/tx.registry";
import * as evmosInflationV1TxRegistry from "./inflation/v1/tx.registry";
import * as evmosRevenueV1TxRegistry from "./revenue/v1/tx.registry";
import * as evmosVestingV2TxRegistry from "./vesting/v2/tx.registry";
import * as evmosErc20V1TxAmino from "./erc20/v1/tx.amino";
import * as evmosInflationV1TxAmino from "./inflation/v1/tx.amino";
import * as evmosRevenueV1TxAmino from "./revenue/v1/tx.amino";
import * as evmosVestingV2TxAmino from "./vesting/v2/tx.amino";
export const evmosAminoConverters = {
  ...evmosErc20V1TxAmino.AminoConverter,
  ...evmosInflationV1TxAmino.AminoConverter,
  ...evmosRevenueV1TxAmino.AminoConverter,
  ...evmosVestingV2TxAmino.AminoConverter
};
export const evmosProtoRegistry: ReadonlyArray<[string, GeneratedType]> = [...evmosErc20V1TxRegistry.registry, ...evmosInflationV1TxRegistry.registry, ...evmosRevenueV1TxRegistry.registry, ...evmosVestingV2TxRegistry.registry];
export const getSigningEvmosClientOptions = ({
  defaultTypes = defaultRegistryTypes
}: {
  defaultTypes?: ReadonlyArray<[string, GeneratedType]>;
} = {}): {
  registry: Registry;
  aminoTypes: AminoTypes;
} => {
  const registry = new Registry([...defaultTypes, ...evmosProtoRegistry]);
  const aminoTypes = new AminoTypes({
    ...evmosAminoConverters
  });
  return {
    registry,
    aminoTypes
  };
};
export const getSigningEvmosClient = async ({
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
  } = getSigningEvmosClientOptions({
    defaultTypes
  });
  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
    registry: (registry as any),
    aminoTypes
  });
  return client;
};