const appUrl = 'https://ibc-dot-fun-git-enable-cors-skip-protocol.vercel.app';

export const endpointOptions = {
  getRpcEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rpc/${chainID}`;
  },
  getRestEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rest/${chainID}`;
  },
};

export const apiURL = `${appUrl}/api/skip`;
