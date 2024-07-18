import { ArrowLeftIcon } from '@heroicons/react/16/solid';
import { AdaptiveLink } from '../AdaptiveLink';
import { GasSetting } from './GasSetting';
import { SaveIndicator } from './SaveIndicator';
import { SlippageSetting } from './SlippageSetting';
import { useDisclosureKey } from '../../store/disclosures';

import { Dialog } from '../Dialog/Dialog';
import { DialogContent } from '../Dialog/DialogContent';
import { StyledThemedButton } from '../StyledComponents/Buttons';

export const SettingsDialog = () => {
  const [isOpen, { close }] = useDisclosureKey('settingsDialog');
  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <div className="h-full overflow-y-auto px-4 py-6 scrollbar-hide">
          <div className="flex items-center gap-4 pb-2">
            <StyledThemedButton
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              onClick={close}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </StyledThemedButton>
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
      </DialogContent>
    </Dialog>
  );
};
