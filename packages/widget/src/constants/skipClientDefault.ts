const appUrl = "https://go.skip.build";

export const endpointOptions = {
  getRpcEndpointForChain: async (chainId: string) => {
    return `${appUrl}/api/rpc/${chainId}`;
  },
  getRestEndpointForChain: async (chainId: string) => {
    return `${appUrl}/api/rest/${chainId}`;
  },
};

export const prodApiUrl = `${appUrl}/api/skip`;
