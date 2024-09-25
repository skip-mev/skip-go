const appUrl = 'https://go.skip.build';

export const endpointOptions = {
  getRpcEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rpc/${chainID}`;
  },
  getRestEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rest/${chainID}`;
  },
};

export const apiURL = `${appUrl}/api/widget/skip`;

export const ETH_GAS_FEE = 0.01;
export const COSMOS_GAS_AMOUNT = 2_000_000;
