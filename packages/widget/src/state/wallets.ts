import { atom } from "jotai";
import { SignClientTypes } from "@walletconnect/types";
import { WalletConnectModalConfig } from "@walletconnect/modal";
import { ChainType, SkipClientOptions } from "@skip-go/client";

export type MinimalWallet = {
  walletName: string;
  walletPrettyName: string;
  walletChainType: ChainType;
  walletInfo: {
    logo?: string;
  };
  connectEco: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isWalletConnected: boolean;
  isAvailable?: boolean;
  getAddress?: (props: {
    signRequired?: boolean;
    context?: 'recovery' | 'destination';
    praxWallet?: {
      index?: number;
      sourceChainID?: string;
    };
  }) => Promise<string | undefined>;
};

type WalletState = {
  walletName: string;
  chainType: string;
};

type GetSigners = Pick<SkipClientOptions, "getCosmosSigner" | "getEVMSigner" | "getSVMSigner">

export type WalletConnect = {
  options: Pick<SignClientTypes.Options, 'projectId' | 'name'> | null;
  walletConnectModal?: Pick<
    WalletConnectModalConfig,
    'themeVariables' | 'themeMode' | 'privacyPolicyUrl' | 'termsOfServiceUrl'
  > | null;
};

export const walletConnectAtom = atom<WalletConnect>({
  options: {
    projectId: 'ff1b9e9bd6329cfb07642bd7f4d11a8c',
    name: 'Skip Go',
  },
});

export const evmWalletAtom = atom<WalletState>();
export const cosmosWalletAtom = atom<WalletState>();
export const svmWalletAtom = atom<WalletState>();

export const walletsAtom = atom((get) => {
  return {
    evm: get(evmWalletAtom),
    cosmos: get(cosmosWalletAtom),
    svm: get(svmWalletAtom),
  };
});

export const getSignersAtom = atom<GetSigners>()

export const connectedAddressAtom = atom<Record<string, string | undefined>>();

export const knownEthermintLikeChains = [
  'evmos_9001-2',
  'dymension_1100-1',
  'injective-1',
  'dimension_37-1',
  'haqq_11235-1',
  'shido_9008-1',
];
