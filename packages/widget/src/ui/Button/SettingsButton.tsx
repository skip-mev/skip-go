import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { ComponentProps } from 'react';
import { SimpleTooltip } from '../SimpleTooltip';
import { cn } from '../../utils/ui';
import { disclosure } from '../../store/disclosures';
import { GearIcon } from '../Icon/GearIcon';

export const SettingsButton = ({
  className,
  ...props
}: ComponentProps<'button'>) => {
  return (
    <SimpleTooltip label="Swap Settings">
      <button
        className={cn(
          'rounded-full p-2 text-black/80 hover:bg-neutral-100 hover:text-black/100',
          'transition-colors focus:outline-none',
          className
        )}
        onClick={() => disclosure.open('settingsDialog')}
        role="group"
        {...props}
      >
        <GearIcon className="h-4 w-4" />
      </button>
    </SimpleTooltip>
  );
};
