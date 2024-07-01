import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Asset } from '@skip-go/core';
import { matchSorter } from 'match-sorter';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatUnits } from 'viem';

import { SpinnerIcon } from '../Icon/SpinnerIcon';
import { cn } from '../../utils/ui';

interface Props {
  assets?: Asset[];
  balances: Record<string, string>;
  onChange?: (asset: Asset) => void;
  onClose: () => void;
  showChainInfo?: boolean;
  isBalancesLoading?: boolean;
}

function AssetSelectContent({
  assets = [],
  balances,
  onChange,
  onClose,
  showChainInfo,
  isBalancesLoading,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const [searchValue, setSearchValue] = useState('');

  const sortedAssets = useMemo(() => {
    return assets
      ?.sort((a, b) => {
        if (!a.recommendedSymbol) return 1;
        if (!b.recommendedSymbol) return -1;
        if (a.recommendedSymbol > b.recommendedSymbol) return 1;
        if (a.recommendedSymbol < b.recommendedSymbol) return -1;
        return 0;
      })
      .filter((asset) => {
        if (
          asset.originChainID === 'sifchain-1' &&
          asset.originDenom !== 'rowan'
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const balanceA = BigInt(balances[a.denom] || '0');
        const balanceB = BigInt(balances[b.denom] || '0');
        if (balanceA > balanceB) return -1;
        if (balanceA < balanceB) return 1;
        return 0;
      });
  }, [assets, balances]);

  const filteredAssets = useMemo(() => {
    if (!searchValue) return sortedAssets;
    return matchSorter(sortedAssets || [], searchValue, {
      keys: ['recommendedSymbol', 'symbol', 'denom'],
    });
  }, [searchValue, sortedAssets]);

  return (
    <div className="isolate flex h-full flex-col p-6 pb-2 font-jost">
      <div className="mb-4 flex items-center gap-4">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
          onClick={onClose}
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <p className="text-xl font-bold">Select Token</p>
        {isBalancesLoading && (
          <SpinnerIcon className="h-4 w-4 animate-spin text-neutral-400" />
        )}
      </div>
      <input
        className="z-20 w-full rounded-md border px-4 py-2"
        type="text"
        placeholder="Search name or paste address"
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        ref={inputRef}
      />
      <ScrollArea.Root
        className={cn(
          'relative isolate flex-grow overflow-hidden',
          'before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-2',
          'before:bg-gradient-to-b before:from-white before:to-transparent',
          'after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-2',
          'before:to-transparent after:bg-gradient-to-t after:from-white'
        )}
      >
        <ScrollArea.Viewport className="h-full w-full py-4">
          {filteredAssets.map((asset) => (
            <button
              key={`${asset.chainID}-${asset.denom}`}
              data-testid="asset-item"
              className="flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors hover:bg-[#ECD9D9] focus:-outline-offset-2"
              onClick={() => (onClose(), onChange?.(asset))}
            >
              <img
                height={48}
                width={48}
                alt={asset.recommendedSymbol || 'symbol'}
                className="h-12 w-12 rounded-full object-contain"
                src={asset.logoURI || 'https://api.dicebear.com/6.x/shapes/svg'}
                onError={(e) =>
                  (e.currentTarget.src =
                    'https://api.dicebear.com/6.x/shapes/svg')
                }
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    {asset.recommendedSymbol || asset.symbol}
                  </p>
                  {asset.isCW20 && (
                    <p className="rounded bg-yellow-600 px-1.5 text-xs font-semibold text-white">
                      CW20
                    </p>
                  )}
                </div>

                {showChainInfo && (
                  <p className="text-sm text-neutral-400">{asset.chainID}</p>
                )}
              </div>
              <div>
                {balances[asset.denom] && (
                  <p className="text-sm font-medium text-neutral-400">
                    {parseFloat(
                      formatUnits(
                        BigInt(balances[asset.denom]),
                        asset.decimals ?? 6
                      )
                    ).toLocaleString('en-US', { maximumFractionDigits: 6 })}
                  </p>
                )}
              </div>
            </button>
          ))}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="z-20 flex touch-none select-none py-4 transition-colors ease-out data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-neutral-500/50 transition-colors before:absolute before:left-1/2 before:top-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:bg-neutral-500" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </div>
  );
}

export default AssetSelectContent;
