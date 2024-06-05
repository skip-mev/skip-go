import { createContext, ReactNode, useContext, useState } from 'react';
import { Dialog } from '../Dialog/Dialog';

interface WalletModalContext {
  chainID: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openWalletModal: (chainID: string) => void;
}

const WalletModalContext = createContext<WalletModalContext | undefined>(
  undefined
);

export function useWalletModal() {
  const context = useContext(WalletModalContext);
  if (context === undefined) {
    throw new Error('useWalletModal must be used within a WalletModalProvider');
  }
  return context;
}

export function WalletModalProvider({ children }: { children: ReactNode }) {
  const [chainID, setChainID] = useState<WalletModalContext['chainID']>('');
  const [isOpen, setIsOpen] = useState<WalletModalContext['isOpen']>(false);
  return (
    <WalletModalContext.Provider
      value={{
        chainID,
        isOpen,
        setIsOpen,
        openWalletModal: (_chainID) => {
          setIsOpen(true);
          setChainID(_chainID);
        },
      }}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Dialog>
    </WalletModalContext.Provider>
  );
}
