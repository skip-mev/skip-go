import * as Tooltip from '@radix-ui/react-tooltip';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../utils/ui';
import { useSwapWidgetUIStore } from '../store/swap-widget';
import { css } from '@emotion/css';

type Props = Tooltip.TooltipProps & {
  type?: 'default' | 'warning' | 'brand';
  enabled?: boolean;
  label: ReactNode;
  children: ReactNode;
  _content?: ComponentPropsWithoutRef<'div'>;
};

export const SimpleTooltip = (props: Props) => {
  const {
    type = 'default',
    enabled = true,
    label,
    children,
    _content,
    ...tooltipProps
  } = props;
  if (!enabled) {
    return <>{children}</>;
  }
  return (
    <Tooltip.Root {...tooltipProps}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={4}
          {..._content}
          className={cn(
            'rounded-md bg-white px-4 py-2 leading-none',
            'select-none shadow shadow-neutral-500/50',
            'text-sm font-jost',
            'animate-slide-up-and-fade',
            type === 'warning' && `bg-[#fbeef1]`,
            type === 'warning' && 'font-medium',
            type === 'brand' && `text-white`,
            _content?.className
          )}
          style={{
            color:
              type === 'warning'
                ? useSwapWidgetUIStore.getState().colors.primary
                : undefined,
            backgroundColor:
              type === 'brand'
                ? useSwapWidgetUIStore.getState().colors.primary
                : undefined,
          }}
        >
          {label}
          <Tooltip.Arrow
            className={cn(
              'fill-white drop-shadow',
              type === 'warning' && 'fill-[#fbeef1]'
            )}
            style={{
              fill:
                type === 'brand'
                  ? useSwapWidgetUIStore.getState().colors.primary
                  : undefined,
            }}
          />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
