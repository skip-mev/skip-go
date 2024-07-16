import { ComponentProps } from 'react';
import { SimpleTooltip } from '../SimpleTooltip';
import { cn } from '../../utils/ui';
import { disclosure } from '../../store/disclosures';
import { StyledButton } from './ShareButton';
import { GearIcon } from '../Icon/GearIcon';

export const SettingsButton = ({
  className,
  ...props
}: ComponentProps<'button'>) => {
  return (
    <SimpleTooltip label="Swap Settings">
      <StyledButton
        className={cn(
          'rounded-full p-2',
          'transition-colors focus:outline-none',
          className
        )}
        onClick={() => disclosure.open('settingsDialog')}
        role="group"
        {...props}
      >
        <GearIcon className="h-4 w-4" />
      </StyledButton>
    </SimpleTooltip>
  );
};
