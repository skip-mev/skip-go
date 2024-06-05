import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { forwardRef } from 'react';
import { Chain } from '../../hooks/use-chains';
import { cn } from '../../utils/ui';

interface Props {
  chain?: Chain;
}

const ChainSelectTrigger = forwardRef<HTMLButtonElement, Props>(
  function ChainSelectTrigger({ chain, ...props }, ref) {
    return (
      <button
        className={cn(
          'flex w-full items-center px-4 py-2 sm:py-4',
          'whitespace-nowrap rounded-md bg-neutral-100 text-left font-semibold transition-colors',
          'border border-neutral-200 hover:border-neutral-300'
        )}
        ref={ref}
        data-testid={'select-chain'}
        {...props}
      >
        <span className="flex-1">
          {chain ? chain.prettyName : 'Select Chain'}
        </span>
        <ChevronDownIcon className="mt-0.5 h-4 w-4" />
      </button>
    );
  }
  //
);

export default ChainSelectTrigger;
