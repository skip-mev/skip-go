const appUrl = 'https://go.skip.build';

export const endpointOptions = {
  getRpcEndpointForChain: async (chainID: string) => {
    if (chainID === 'solana') {
      return 'https://api.mainnet-beta.solana.com';
    }
    else return `${appUrl}/api/rpc/${chainID}`;
  },
  getRestEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rest/${chainID}`;
  },
};

export const apiURL = `${appUrl}/api/widget/skip`;
