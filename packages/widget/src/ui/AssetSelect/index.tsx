import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Asset } from '@skip-go/core';
import { useState } from 'react';

import AssetSelectContent from './AssetSelectContent';
import { cn } from '../../utils/ui';
import { Dialog } from '../Dialog/Dialog';
import { DialogTrigger } from '../Dialog/DialogTrigger';
import { DialogContent } from '../Dialog/DialogContent';
import { styled } from 'styled-components';
import { StyledHighlightButton } from '../StyledComponents/Buttons';

interface Props {
  asset?: Asset;
  assets?: Asset[];
  balances?: Record<string, string>;
  onChange?: (asset: Asset) => void;
  showChainInfo?: boolean;
  isBalancesLoading?: boolean;
}

function AssetSelect({
  asset,
  assets,
  balances,
  onChange,
  showChainInfo,
  isBalancesLoading,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <StyledHighlightButton
          className={cn(
            'whitespace-nowrap text-left font-semibold',
            'flex w-full items-center gap-2 rounded-md px-4 py-2 transition-colors sm:py-4',
            'border hover:border-neutral-300',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          disabled={!assets || assets.length === 0}
          data-testid="select-asset"
        >
          {asset && (
            <img
              alt={asset.recommendedSymbol || 'asset symbol'}
              height={24}
              width={24}
              className="h-6 w-6 rounded-full object-contain"
              src={asset.logoURI || 'https://api.dicebear.com/6.x/shapes/svg'}
              onError={(event) =>
                (event.currentTarget.src =
                  'https://api.dicebear.com/6.x/shapes/svg')
              }
            />
          )}
          <div className="min-w-0 flex-1">
            {!asset && <span>Select Token</span>}
            {asset && <div className="truncate">{asset.recommendedSymbol}</div>}
          </div>
          <div>
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </StyledHighlightButton>
      </DialogTrigger>
      <DialogContent>
        <AssetSelectContent
          assets={assets}
          balances={balances ?? {}}
          onChange={onChange}
          onClose={() => setIsOpen(false)}
          showChainInfo={showChainInfo}
          isBalancesLoading={isBalancesLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AssetSelect;
