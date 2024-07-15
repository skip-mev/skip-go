import { TrashIcon } from '@heroicons/react/20/solid';
import { ComponentProps } from 'react';

import { SimpleTooltip } from '../SimpleTooltip';
import { txHistory, useTxHistory } from '../../store/tx-history';
import { cn } from '../../utils/ui';

type Props = ComponentProps<'button'>;

export const HistoryClearButton = ({ className, ...props }: Props) => {
  const hasHistory = useTxHistory((state) => Object.keys(state).length > 0);

  if (!hasHistory) return null;

  return (
    <SimpleTooltip label="Clear transaction history">
      <button
        className={cn(
          'text-xs font-semibold',
          'rounded-lg p-2',
          'flex items-center gap-1',
          'transition-colors focus:outline-none',
          `opacity-80 hover:opacity-90`,
          'text-red-500 bg-red-100',
          className
        )}
        onClick={() => txHistory.clear()}
        {...props}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </SimpleTooltip>
  );
};
