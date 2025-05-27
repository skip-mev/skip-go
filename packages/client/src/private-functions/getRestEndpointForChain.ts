import { chains, findFirstWorkingEndpoint } from "src/chains";
import { ClientState } from "../state/clientState";

export const getRestEndpointForChain = async (chainId: string) => {
  if (ClientState.endpointOptions.getRestEndpointForChain) {
    return ClientState.endpointOptions.getRestEndpointForChain(chainId);
  }

  if (ClientState.endpointOptions.endpoints && ClientState.endpointOptions.endpoints[chainId]) {
    const endpointOptions = ClientState.endpointOptions.endpoints[chainId];

    if (endpointOptions?.rest) {
      return endpointOptions.rest;
    }
  }

  const chain = chains().find((chain) => chain.chain_id === chainId);
  if (!chain) {
    throw new Error(
      `getRestEndpointForChain error: failed to find chain id '${chainId}' in registry`,
    );
  }
  if (chain.apis?.rest?.length === 0 || !chain.apis?.rest) {
    throw new Error(
      `getRestEndpointForChain error: failed to find REST endpoint for chain '${chainId}'`,
    );
  }
  const endpoints = chain.apis?.rest?.map((api) => api.address);
  const endpoint = await findFirstWorkingEndpoint(endpoints, "rest");

  if (!endpoint) {
    throw new Error(
      `getRestEndpointForChain error: failed to find REST endpoint for chain '${chainId}'`,
    );
  }

  return endpoint;
};
