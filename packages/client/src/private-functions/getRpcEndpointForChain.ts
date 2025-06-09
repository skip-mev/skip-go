import { chains, findFirstWorkingEndpoint } from "src/chains";
import { ClientState } from "../state/clientState";

export const getRpcEndpointForChain = async (chainId: string) => {
  if (ClientState.endpointOptions.getRpcEndpointForChain) {
    return ClientState.endpointOptions.getRpcEndpointForChain(chainId);
  }

  if (ClientState.endpointOptions.endpoints && ClientState.endpointOptions.endpoints[chainId]) {
    const endpointOptions = ClientState.endpointOptions.endpoints[chainId];

    if (endpointOptions?.rpc) {
      return endpointOptions.rpc;
    }
  }

  console.warn(
    "Warning: You are using unreliable public endpoints. We strongly recommend overriding them via endpointOptions for use beyond development settings.",
  );

  const chain = chains().find((chain) => chain.chain_id === chainId);
  if (!chain) {
    throw new Error(`getRpcEndpointForChain: failed to find chain id '${chainId}' in registry`);
  }

  if (chain.apis?.rpc?.length === 0 || !chain.apis?.rpc) {
    throw new Error(
      `getRpcEndpointForChain error: failed to find RPC endpoint for chain id '${chainId}'`,
    );
  }
  const endpoints = chain.apis?.rpc?.map((api) => api.address);
  const endpoint = await findFirstWorkingEndpoint(endpoints, "rpc");

  if (!endpoint) {
    throw new Error(
      `getRpcEndpointForChain error: failed to find RPC endpoint for chain id '${chainId}'`,
    );
  }

  return endpoint;
};
