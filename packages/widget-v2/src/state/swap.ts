import { atom } from 'jotai';

export const sourceAtom = atom({
  amount: '0',
  denom: '',
  chainId: '',
});

export const destinationAtom = atom({
  amount: '0',
  denom: '',
  chainId: '',
});
