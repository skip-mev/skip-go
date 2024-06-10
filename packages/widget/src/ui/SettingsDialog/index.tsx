import { ArrowLeftIcon } from '@heroicons/react/16/solid';
import * as Dialog from '@radix-ui/react-dialog';

import { AdaptiveLink } from '../AdaptiveLink';
import { GasSetting } from './GasSetting';
import { PurgeSetting } from './PurgeSetting';
import { SaveIndicator } from './SaveIndicator';
import { SlippageSetting } from './SlippageSetting';
import { useDisclosureKey } from '../../store/disclosures';
import { cn } from '../../utils/ui';

export const SettingsDialog = () => {
  const [isOpen, { close }] = useDisclosureKey('settingsDialog');
  return (
    <Dialog.Root modal open={isOpen}>
      <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content
        className={cn(
          'font-jost data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]',
          'w-[90vw] max-w-[450px] max-h-[820px] h-[90vh] rounded-xl',
          'translate-x-[-50%] translate-y-[-50%] bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]'
        )}
        onInteractOutside={close}
      >
        {' '}
        <div className="h-full overflow-y-auto px-4 py-6 scrollbar-hide">
          <div className="flex items-center gap-4 pb-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
              onClick={close}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold">Swap Settings</h3>
            <div className="flex-grow" />
            <SaveIndicator />
          </div>
          <GasSetting />
          <p className="text-balance p-2 text-sm text-neutral-500 [&_a:hover]:underline [&_a]:text-red-500">
            Gas is used to meter transactions and allocate resources fairly
            among users. Users must pay a gas fee, usually in the native token,
            to have their transactions processed by the network.
            <br />
            <AdaptiveLink href="https://docs.cosmos.network/main/glossary#gas">
              Learn more
            </AdaptiveLink>
          </p>
          <SlippageSetting />
          <p className="text-balance p-2 text-sm text-neutral-500 [&_a:hover]:underline [&_a]:text-red-500">
            Slippage is how much price movement you can tolerate between the
            time you send out a transaction and the time it&apos;s executed.
            <br />
            <AdaptiveLink href="https://medium.com/onomy-protocol/what-is-slippage-in-defi-62a0d068feb3">
              Learn more
            </AdaptiveLink>
          </p>
          {/* <PurgeSetting />
          <p className="text-balance p-2 text-sm text-neutral-500 [&_a:hover]:underline [&_a]:text-red-500">
            Removes all of your data from the app, which includes connected
            wallets state, transaction history, and settings.
          </p> */}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
