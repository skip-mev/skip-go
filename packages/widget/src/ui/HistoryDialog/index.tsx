import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useMemo } from 'react';

import { HistoryClearButton } from './HistoryClearButton';
import * as HistoryList from './HistoryList';
import { useSyncState } from './SyncState';
import { useDisclosureKey } from '../../store/disclosures';
import { useTxHistory } from '../../store/tx-history';
import { useAssets } from '../../provider/assets';
import { cn } from '../../utils/ui';
import { Dialog } from '../Dialog/Dialog';
import { DialogContent } from '../Dialog/DialogContent';
import { StyledScrollAreaRoot } from '../AssetSelect/AssetSelectContent';
import { StyledThemedButton } from '../StyledComponents/Buttons';

export const HistoryDialog = () => {
  const [isOpen, { close }] = useDisclosureKey('historyDialog');

  const history = useTxHistory();
  const { isReady } = useAssets();

  const entries = useMemo(() => {
    return isReady ? Object.entries(history).reverse() : undefined;
  }, [history, isReady]);

  useSyncState();

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <div className="flex h-full flex-col space-y-2 px-4 py-6">
          <div className="flex items-center gap-4 pb-2">
            <StyledThemedButton
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              onClick={close}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </StyledThemedButton>
            <h3 className="text-xl font-bold">Transaction History</h3>
            <div className="flex-grow" />
            <HistoryClearButton />
          </div>
          <StyledScrollAreaRoot
            className={cn('relative isolate -mx-4 overflow-hidden')}
          >
            <ScrollArea.Viewport className="h-full w-full px-4">
              <HistoryList.Root>
                {entries && entries.length < 1 && (
                  <span className="p-2 text-center text-sm opacity-60">
                    No recent transactions.
                  </span>
                )}
                {entries?.map(([id, data]) => (
                  <StyledThemedButton
                    as={HistoryList.Item}
                    key={id}
                    id={id}
                    data={data}
                  />
                ))}
                {!isReady && (
                  <div className="p-4 text-center opacity-60">
                    Loading transaction history...
                  </div>
                )}
              </HistoryList.Root>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="z-20 flex touch-none select-none transition-colors ease-out data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-neutral-500/50 transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-neutral-500" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </StyledScrollAreaRoot>
        </div>
      </DialogContent>
    </Dialog>
  );
};
