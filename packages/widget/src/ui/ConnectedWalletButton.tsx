import { ComponentProps, forwardRef } from 'react';
import { cn } from '../utils/ui';

type Props = ComponentProps<'button'> & {
  address: string;
  walletName: string;
  walletLogo?: string;
};

export const ConnectedWalletButton = forwardRef<HTMLButtonElement, Props>(
  function Component(props, ref) {
    const { address, walletLogo, walletName, className, ...rest } = props;
    return (
      <button
        className={cn(
          'flex items-center gap-2 transition-colors focus:outline-none',
          'rounded-lg border border-neutral-200 px-2 py-1.5 hover:border-neutral-300 hover:bg-neutral-50',
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
        <span className="font-mono text-xs font-semibold tabular-nums">
          {address.slice(0, 8)}...{address.slice(-5)}
        </span>
      </button>
    );
  }
  //
);
