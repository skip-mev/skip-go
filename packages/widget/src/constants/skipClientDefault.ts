const appUrl = "https://go.skip.build";

export const endpointOptions = {
  getRpcEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rpc/${chainID}`;
  },
  getRestEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rest/${chainID}`;
  },
};

export const devApiUrl = "https://api.dev.skip.build";

export const prodApiUrl = `${appUrl}/api/widget/skip`;
