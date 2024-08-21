import { atom } from 'jotai';
import { ClientAsset } from './skipClient';
import { Wallet } from '@/components/RenderWalletList';

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
};

export const sourceAssetAtom = atom<AssetAtom>();

export const destinationAssetAtom = atom<AssetAtom>();

export const connectedWalletAtom = atom<Wallet>();

export const destinationWalletAtom = atom<Wallet>();
