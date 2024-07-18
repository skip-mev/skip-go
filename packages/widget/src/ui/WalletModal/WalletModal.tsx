import { ArrowTopRightOnSquareIcon } from '@heroicons/react/16/solid';
import { ArrowLeftIcon, FaceFrownIcon } from '@heroicons/react/20/solid';
import * as ScrollArea from '@radix-ui/react-scroll-area';

import { AdaptiveLink } from '../AdaptiveLink';
import { useWalletModal } from './context';
import { useTotalWallets, WalletListItem } from './WalletListItem';
import { MinimalWallet, useMakeWallets } from '../../hooks/use-make-wallets';
import { cn } from '../../utils/ui';
import { trackWallet, TrackWalletCtx } from '../../store/track-wallet';
import { useChainByID } from '../../hooks/use-chains';
import { DialogContent } from '../Dialog/DialogContent';
import { StyledScrollAreaRoot } from '../AssetSelect/AssetSelectContent';
import { StyledThemedButton } from '../StyledComponents/Buttons';

interface Props {
  chainType: string;
  wallets: MinimalWallet[];
  onClose: () => void;
  chainID: string;
}

export function WalletModal({ chainType, onClose, wallets }: Props) {
  async function onWalletConnect(wallet: MinimalWallet) {
    await wallet.connect();
    onClose();
  }

  const totalWallets = useTotalWallets();

  return (
    <div className="flex h-full flex-col px-6 pb-2 pt-6 font-diatype">
      <div className="relative">
        <StyledThemedButton
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
            'absolute inset-y-0 left-0'
          )}
          onClick={onClose}
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </StyledThemedButton>
        <p className="text-center text-xl font-bold">Connect Wallet</p>
      </div>
      {totalWallets < 1 && (
        <div className="flex flex-col items-center space-y-4 py-16 text-center">
          <FaceFrownIcon className="h-16 w-16 text-gray-500" />
          <h4 className="text-center font-medium">No Wallets Available</h4>
          <p className="text-sm text-neutral-600 lg:px-8">
            Please install or enable your preferred wallet extension.
            <br />
            <AdaptiveLink
              href={
                chainType === 'cosmos'
                  ? 'https://cosmos.network/wallets'
                  : chainType === 'solana'
                  ? 'https://solana.com/ecosystem/explore?categories=wallet'
                  : 'https://ethereum.org/en/wallets/find-wallet'
              }
              className="inline-flex items-center gap-1 text-red-500 hover:underline"
            >
              <span>Explore available wallets</span>
              <ArrowTopRightOnSquareIcon className="h-3 w-3" />
            </AdaptiveLink>
          </p>
        </div>
      )}
      <StyledScrollAreaRoot
        className={cn(
          'relative isolate flex-grow overflow-hidden',
          'before:absolute before:inset-x-0 before:bottom-0 before:z-10 before:h-2'
        )}
      >
        <ScrollArea.Viewport className="h-full w-full py-4">
          {wallets.map((wallet) => {
            // currently only svm chainType that have isAvailable
            return (
              <WalletListItem
                key={wallet.walletName}
                chainType={chainType}
                walletName={wallet.walletName}
                className={cn(
                  'group relative mb-2 data-[unsupported=true]:opacity-30',
                  'data-[unsupported=true]:before:absolute data-[unsupported=true]:before:inset-0 data-[unsupported=true]:before:cursor-not-allowed'
                )}
              >
                <StyledThemedButton
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg p-2 transition-colors focus:-outline-offset-2'
                  )}
                  onClick={() => onWalletConnect(wallet)}
                  disabled={chainType === 'svm' && wallet.isAvailable !== true}
                >
                  {wallet.walletInfo.logo && (
                    <img
                      height={36}
                      width={36}
                      alt={wallet.walletPrettyName}
                      className="h-9 w-9 object-contain"
                      src={
                        typeof wallet.walletInfo.logo === 'string'
                          ? wallet.walletInfo.logo
                          : wallet.walletInfo.logo.major
                      }
                      aria-hidden="true"
                    />
                  )}
                  <p className="flex-1 text-left font-semibold">
                    {wallet.walletPrettyName === 'Leap Cosmos MetaMask'
                      ? 'Metamask (Leap Snap)'
                      : wallet.walletPrettyName}
                  </p>
                </StyledThemedButton>
                {wallet.isWalletConnected && (
                  <button
                    aria-label={`Disconnect ${wallet.walletPrettyName}`}
                    className={cn(
                      'absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold  transition-colors focus:outline-none',
                      'bg-[#FF486E]/10 text-[#FF486E]'
                    )}
                    onClick={async (event) => {
                      event.stopPropagation();
                      await wallet.disconnect();
                      trackWallet.untrack(chainType as TrackWalletCtx);
                      onClose();
                    }}
                  >
                    Disconnect
                  </button>
                )}
                {chainType === 'svm' && wallet.isAvailable !== true && (
                  <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg bg-[#c2c2c2]/20 px-2.5 py-1 text-xs font-semibold text-[#909090] transition-colors focus:outline-none group-hover:bg-[#c2c2c2]/30">
                    Not Installed
                  </div>
                )}
              </WalletListItem>
            );
          })}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="z-20 flex touch-none select-none py-4 transition-colors ease-out data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-neutral-500/50 transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-neutral-500" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </StyledScrollAreaRoot>
    </div>
  );
}

function WalletModalWithContext() {
  const { chainID } = useWalletModal();
  const { setIsOpen } = useWalletModal();
  const { data: chain } = useChainByID(chainID);

  const { makeWallets } = useMakeWallets();
  const wallets = makeWallets(chainID);

  if (!chain) {
    return null;
  }

  const { chainType } = chain;

  return (
    <DialogContent>
      <WalletModal
        chainType={chainType}
        wallets={wallets}
        onClose={() => setIsOpen(false)}
        chainID={chainID}
      />
    </DialogContent>
  );
}

export default WalletModalWithContext;
