export interface SwapVenueConfig {
  prettyName: string;
}

export const SWAP_VENUES: Record<string, SwapVenueConfig> = {
  "neutron-astroport": {
    prettyName: "Neutron Astroport",
  },
  "terra-astroport": {
    prettyName: "Terra Astroport",
  },
  "injective-astroport": {
    prettyName: "Injective Astroport",
  },
  "sei-astroport": {
    prettyName: "Sei Astroport",
  },
  "osmosis-poolmanager": {
    prettyName: "Osmosis",
  },
  "neutron-lido-satellite": {
    prettyName: "Neutron Lido Satellite",
  },
  "migaloo-white-whale": {
    prettyName: "Migaloo White Whale",
  },
  "chihuahua-white-whale": {
    prettyName: "Chihuahua White Whale",
  },
  "terra-white-whale": {
    prettyName: "Terra White Whale",
  },
  "testnet-initia-dex": {
    prettyName: "Testnet Initia DEX",
  },
};
