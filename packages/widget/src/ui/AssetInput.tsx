import { BackspaceIcon } from '@heroicons/react/20/solid';
import { Asset } from '@skip-go/core';
import { BigNumber } from 'bignumber.js';
import { MouseEventHandler, useMemo } from 'react';
import { formatUnits } from 'viem';

import AssetSelect from './AssetSelect';
import ChainSelect from './ChainSelect';
import { SimpleTooltip } from './SimpleTooltip';
import { SpinnerIcon } from './Icon/SpinnerIcon';
import { Chain } from '../hooks/use-chains';
import { useAssets } from '../provider/assets';
import { useAccount } from '../hooks/use-account';
import { useAnyDisclosureOpen } from '../store/disclosures';
import { useBalancesByChain } from '../hooks/use-balances-by-chain';
import { cn } from '../utils/ui';
import {
  formatNumberWithCommas,
  formatNumberWithoutCommas,
} from '../utils/number';
import { formatPercent, formatUSD } from '../utils/intl';
import { useSwapWidgetUIStore } from '../store/swap-widget';
import {
  StyledBorderDiv,
  StyledBrandDiv,
  StyledThemedDiv,
} from './StyledComponents/Theme';

interface Props {
  amount: string;
  amountUSD?: string;
  diffPercentage?: number;
  onAmountChange?: (amount: string) => void;
  onAmountMax?: MouseEventHandler<HTMLButtonElement>;
  asset?: Asset;
  onAssetChange?: (asset: Asset) => void;
  chain?: Chain;
  onChainChange?: (chain: Chain) => void;
  chains: Chain[];
  context: 'source' | 'destination';
  isError?: string | boolean;
  isLoading?: boolean;
}

function AssetInput({
  amount,
  amountUSD,
  diffPercentage = 0,
  onAmountChange,
  onAmountMax,
  asset,
  onAssetChange,
  chain,
  chains,
  onChainChange,
  context,
  isError,
  isLoading,
}: Props) {
  const { assetsByChainID, getNativeAssets } = useAssets();

  const filter = useSwapWidgetUIStore((state) => state.filter);

  const assets = useMemo(() => {
    if (!chain && filter && filter?.[context]) {
      return [];
    }

    if (!chain) return getNativeAssets();
    const _assets = assetsByChainID(chain.chainID);

    if (filter && filter?.[context] && filter[context]?.[chain.chainID]) {
      return _assets.filter((asset) =>
        filter[context]?.[chain.chainID]?.includes(asset.denom)
      );
    }

    return _assets;
  }, [assetsByChainID, chain, getNativeAssets, filter]);

  const account = useAccount(chain?.chainID);

  const isAnyDisclosureOpen = useAnyDisclosureOpen();

  const { data: balances, isLoading: isBalancesLoading } = useBalancesByChain({
    address: account?.address,
    chain,
    assets,
    enabled: !isAnyDisclosureOpen && context === 'source',
  });

  const selectedAssetBalance = useMemo(() => {
    if (!asset || !balances) return '0';
    return formatUnits(
      BigInt(balances[asset.denom] ?? '0'),
      asset.decimals ?? 6
    );
  }, [asset, balances]);

  const maxButtonDisabled = useMemo(() => {
    return parseFloat(selectedAssetBalance) <= 0;
  }, [selectedAssetBalance]);

  return (
    <StyledBorderDiv
      className={cn(
        'rounded-lg border p-4 transition-[border,shadow]',
        'focus-within:border-neutral-300 focus-within:shadow-sm',
        'hover:border-neutral-300 hover:shadow-sm',
        !!isError &&
          'border-red-400 focus-within:border-red-500 hover:border-red-500'
      )}
    >
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
        <div>
          <ChainSelect chain={chain} chains={chains} onChange={onChainChange} />
        </div>
        <div>
          <AssetSelect
            asset={asset}
            assets={assets}
            balances={balances}
            onChange={onAssetChange}
            showChainInfo={true}
            isBalancesLoading={isBalancesLoading}
          />
        </div>
      </div>
      <div className="relative isolate">
        {isLoading && (
          <SpinnerIcon className="absolute right-2 top-2 z-10 h-4 w-4 animate-spin text-neutral-300" />
        )}
        {amount && !isLoading && (
          <button className="absolute right-2 top-2 z-10">
            <BackspaceIcon
              className="h-4 w-4 text-neutral-300 transition-colors hover:text-neutral-400"
              onClick={() => onAmountChange?.('')}
            />
          </button>
        )}
        <StyledThemedDiv
          as="input"
          data-testid="amount"
          className={cn(
            'h-10 w-full text-3xl font-medium tabular-nums',
            'placeholder:text-neutral-300 focus:outline-none',
            isLoading && 'animate-pulse text-neutral-500'
          )}
          type="text"
          placeholder="0"
          value={formatNumberWithCommas(amount)}
          inputMode="numeric"
          onChange={(e) => {
            if (!onAmountChange) return;

            let latest = e.target.value;

            if (latest.match(/^[.,]/)) latest = `0.${latest}`; // Handle first character being a period or comma
            latest = latest.replace(/^[0]{2,}/, '0'); // Remove leading zeros
            latest = latest.replace(/[^\d.,]/g, ''); // Remove non-numeric and non-decimal characters
            latest = latest.replace(/[.]{2,}/g, '.'); // Remove multiple decimals
            latest = latest.replace(/[,]{2,}/g, ','); // Remove multiple commas

            onAmountChange?.(formatNumberWithoutCommas(latest));
          }}
          onKeyDown={(event) => {
            if (!onAmountChange) return;

            if (event.key === 'Escape') {
              if (
                event.currentTarget.selectionStart ===
                event.currentTarget.selectionEnd
              ) {
                event.currentTarget.select();
              }
              return;
            }

            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              let value = new BigNumber(
                formatNumberWithoutCommas(event.currentTarget.value) || '0'
              );
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (event.shiftKey) {
                  value = value.plus(10);
                } else if (event.altKey || event.ctrlKey || event.metaKey) {
                  value = value.plus(0.1);
                } else {
                  value = value.plus(1);
                }
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (event.shiftKey) {
                  value = value.minus(10);
                } else if (event.altKey || event.ctrlKey || event.metaKey) {
                  value = value.minus(0.1);
                } else {
                  value = value.minus(1);
                }
              }
              if (value.isNegative()) {
                value = new BigNumber(0);
              }
              onAmountChange(value.toString());
            }
          }}
        />
        <div className="flex h-8 items-center space-x-2 tabular-nums">
          <p className="text-sm tabular-nums text-neutral-400">
            {amountUSD && Number(amountUSD) > 0 ? formatUSD(amountUSD) : null}
          </p>
          {amountUSD !== undefined &&
          Number(amountUSD) > 0 &&
          diffPercentage !== 0 &&
          context === 'destination' ? (
            <p
              className={cn(
                'text-sm tabular-nums',
                diffPercentage >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              ({formatPercent(diffPercentage)})
            </p>
          ) : null}
          <div className="flex-grow" />
          {context === 'source' && account?.address && asset && (
            <div className="flex animate-slide-left-and-fade items-center text-sm">
              <span className="mr-1">Balance:</span>{' '}
              {isBalancesLoading ? (
                <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SimpleTooltip
                  label={`${parseFloat(selectedAssetBalance).toString()} ${
                    asset.recommendedSymbol
                  }`}
                >
                  <div
                    className={cn(
                      'mr-2 max-w-[16ch] truncate tabular-nums',
                      'cursor-help underline decoration-dotted underline-offset-4'
                    )}
                  >
                    {parseFloat(selectedAssetBalance).toLocaleString('en-US', {
                      maximumFractionDigits: 4,
                    })}
                  </div>
                </SimpleTooltip>
              )}
              <StyledBrandDiv
                as="button"
                className={cn(
                  'rounded-md px-2 py-1 text-xs font-semibold uppercase text-white',
                  'transition-[transform,background] enabled:hover:rotate-2 enabled:hover:scale-110 disabled:cursor-not-allowed',
                  'disabled:opacity-75'
                )}
                disabled={maxButtonDisabled}
                onClick={onAmountMax}
              >
                Max
              </StyledBrandDiv>
            </div>
          )}
        </div>
      </div>
      {typeof isError === 'string' && (
        <div className="mt-2 animate-slide-up-and-fade text-balance text-center text-xs font-medium text-red-500">
          {isError}
        </div>
      )}
    </StyledBorderDiv>
  );
}

export default AssetInput;
