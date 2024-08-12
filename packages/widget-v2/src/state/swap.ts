import { atom } from 'jotai';
import { ClientAsset } from './skip';

export type AssetAtom = Partial<ClientAsset> & {
  amount?: string;
};

export const sourceAtom = atom<AssetAtom | undefined>();

export const destinationAtom = atom<AssetAtom | undefined>();
