import {
  ArrowLeftIcon,
  CheckIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/20/solid';
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import { useJsonDisclosure } from '../store/disclosures';
import { cn } from '../utils/ui';
import { StyledThemedButton } from './StyledComponents/Buttons';

export const JsonDialog = () => {
  const [state, { close }] = useJsonDisclosure();

  const [copied, setCopied] = useState(() => false);

  const onCopy = async () => {
    if (!state) return;
    const timeout = 1000;
    await navigator.clipboard.writeText(JSON.stringify(state.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };

  const ClipboardIcon = useMemo(() => {
    return copied ? CheckIcon : ClipboardDocumentIcon;
  }, [copied]);

  if (!state) return null;

  return (
    <Dialog.Root modal open>
      <Dialog.Content className="absolute inset-0 overflow-hidden rounded-3xl bg-white font-diatype">
        <button
          className={cn(
            'absolute right-4 top-5',
            'rounded-lg border px-2 py-1 text-sm transition-colors',
            'flex flex-grow items-center justify-center space-x-1',
            {
              'bg-neutral-100 hover:bg-neutral-200': !copied,
              'bg-green-100 hover:bg-green-200': copied,
              'border-green-400 text-green-900': copied,
            }
          )}
          onClick={onCopy}
        >
          <span>Copy to clipboard</span>
          <ClipboardIcon className="h-4 w-4" />
        </button>
        <div className="h-full overflow-y-auto px-4 py-6 scrollbar-hide">
          <div className="flex items-center gap-4 pb-2">
            <StyledThemedButton
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              onClick={close}
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </StyledThemedButton>
            <h3 className="text-xl font-bold">
              {state.title || 'JSON Viewer'}
            </h3>
            <div className="flex-grow" />
          </div>
          <pre className="overflow-auto rounded-lg border p-2 font-diatypeMono text-xs">
            {JSON.stringify(state.data, null, 2)}
          </pre>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
