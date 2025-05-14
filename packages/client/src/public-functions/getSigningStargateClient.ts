import type { OfflineSigner } from "@cosmjs/proto-signing/build/signer.js";
import { ClientState } from "../state/clientState";
import { SigningStargateClient } from "@cosmjs/stargate";
import { accountParser } from "src/registry";
import { getRpcEndpointForChain } from "../private-functions/getRpcEndpointForChain";

export type getSigningStargateClientProps = {
  chainId: string;
  getOfflineSigner?: (chainId: string) => Promise<OfflineSigner>;
};

export const getSigningStargateClient = async ({
  chainId,
  getOfflineSigner,
}: getSigningStargateClientProps) => {
  if (!getOfflineSigner) {
    throw new Error("'getCosmosSigner' is not provided or configured in skip router");
  }
  if (!ClientState.signingStargateClientByChainId?.[chainId]) {
    const [signer, endpoint] = await Promise.all([
      getOfflineSigner(chainId),
      getRpcEndpointForChain(chainId),
    ]);
    ClientState.signingStargateClientByChainId[chainId] =
      await SigningStargateClient.connectWithSigner(endpoint, signer, {
        aminoTypes: ClientState.aminoTypes,
        registry: ClientState.registry,
        accountParser,
      });
  }

  return {
    stargateClient: ClientState.signingStargateClientByChainId[chainId] as SigningStargateClient,
    signer: await getOfflineSigner(chainId),
  };
};
