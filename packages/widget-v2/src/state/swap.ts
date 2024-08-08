import { atom } from 'jotai';
import { ClientAsset } from './skip';

export type AssetAtom = ClientAsset & {
  amount?: string;
};

export const sourceAtom = atom<AssetAtom>({} as AssetAtom);

export const destinationAtom = atom<AssetAtom>({} as AssetAtom);
