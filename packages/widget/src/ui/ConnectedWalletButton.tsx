import { ComponentProps, forwardRef } from 'react';
import { cn } from '../utils/ui';
import { StyledThemedButton } from './StyledComponents/Buttons';

type Props = ComponentProps<'button'> & {
  address: string;
  walletName: string;
  walletLogo?: string;
};

export const ConnectedWalletButton = forwardRef<HTMLButtonElement, Props>(
  function Component(props, ref) {
    const { address, walletLogo, walletName, className, ...rest } = props;
    return (
      <StyledThemedButton
        className={cn(
          'flex items-center gap-2 transition-colors focus:outline-none',
          'rounded-lg border px-2 py-1.5 hover:border-neutral-300',
          className
        )}
        {...rest}
        ref={ref}
      >
        {walletLogo && (
          <img
            height={16}
            width={16}
            alt={walletName}
            className="object-contain"
            src={walletLogo}
          />
        )}
        <span className="font-diatypeMono text-xs font-semibold tabular-nums">
          {address.slice(0, 8)}...{address.slice(-5)}
        </span>
      </StyledThemedButton>
    );
  }
  //
);
