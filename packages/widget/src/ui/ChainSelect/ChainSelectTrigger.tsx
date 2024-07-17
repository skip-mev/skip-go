import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { forwardRef } from 'react';
import { Chain } from '../../hooks/use-chains';
import { cn } from '../../utils/ui';
import { StyledHighlightButton } from '../StyledComponents/Buttons';

interface Props {
  chain?: Chain;
}

const ChainSelectTrigger = forwardRef<HTMLButtonElement, Props>(
  function ChainSelectTrigger({ chain, ...props }, ref) {
    return (
      <StyledHighlightButton
        className={cn(
          'flex w-full items-center px-4 py-2 sm:py-4',
          'whitespace-nowrap rounded-md text-left font-semibold transition-colors',
          'border hover:border-neutral-300'
        )}
        ref={ref}
        data-testid={'select-chain'}
        {...props}
      >
        <span className="flex-1">
          {chain ? chain.prettyName : 'Select Chain'}
        </span>
        <div>
          <ChevronDownIcon className="mt-0.5 h-4 w-4" />
        </div>
      </StyledHighlightButton>
    );
  }
  //
);

export default ChainSelectTrigger;
