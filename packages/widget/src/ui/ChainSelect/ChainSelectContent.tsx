import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { matchSorter } from 'match-sorter';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Chain } from '../../hooks/use-chains';
import { cn } from '../../utils/ui';
import { StyledScrollAreaRoot } from '../AssetSelect/AssetSelectContent';
import { StyledThemedButton } from '../StyledComponents/Buttons';
import { StyledSearchInput } from '../StyledComponents/Input';

interface Props {
  chains: Chain[];
  onChange: (chain: Chain) => void;
  onClose: () => void;
}

function ChainSelectContent({ chains, onChange, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const [searchValue, setSearchValue] = useState('');

  const filteredChains = useMemo(() => {
    if (!searchValue) return chains;
    return matchSorter(chains, searchValue, {
      keys: ['chainID', 'chainName', 'prettyName'],
    });
  }, [chains, searchValue]);

  return (
    <div className="isolate flex h-full flex-col p-6 pb-2 font-diatype">
      <div className="mb-4 flex items-center gap-4">
        <StyledThemedButton
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          onClick={onClose}
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </StyledThemedButton>
        <p className="text-xl font-bold">Select Network</p>
      </div>
      <StyledSearchInput
        className="z-20 w-full rounded-md border px-4 py-2"
        type="text"
        placeholder="Search for a chain"
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        ref={inputRef}
      />
      {chains.length < 1 ? (
        <div className="flex flex-grow justify-center pt-9">
          <svg
            className="inline-block h-7 w-7 animate-spin text-neutral-300"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
        </div>
      ) : (
        <StyledScrollAreaRoot
          className={cn(
            'relative isolate flex-grow overflow-hidden',
            'before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-2',
            'after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-2'
          )}
        >
          <ScrollArea.Viewport className="h-full w-full py-4">
            {filteredChains.map((chain) => (
              <StyledThemedButton
                className="flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors focus:-outline-offset-2"
                key={chain.chainID}
                onClick={() => onChange(chain)}
                data-testid="chain-item"
              >
                <img
                  alt={chain.prettyName}
                  className="h-[48px] w-[48px] rounded-full object-contain"
                  width={48}
                  height={48}
                  src={
                    chain.logoURI || 'https://api.dicebear.com/6.x/shapes/svg'
                  }
                />

                <div>
                  <p className="text-lg font-semibold">{chain.prettyName}</p>
                  <p className="text-sm opacity-60">{chain.chainID}</p>
                </div>
              </StyledThemedButton>
            ))}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="z-20 flex touch-none select-none py-4 transition-colors ease-out data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-neutral-500/50 transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-neutral-500" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </StyledScrollAreaRoot>
      )}
    </div>
  );
}

export default ChainSelectContent;
