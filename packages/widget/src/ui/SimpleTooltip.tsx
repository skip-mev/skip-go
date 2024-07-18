import * as Tooltip from '@radix-ui/react-tooltip';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../utils/ui';
import { useSwapWidgetUIStore } from '../store/swap-widget';
import { styled } from 'styled-components';

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
      <StyledTooltipContent
        type={type}
        sideOffset={4}
        {..._content}
        className={cn(
          'rounded-md px-4 py-2 leading-none',
          'select-none shadow shadow-neutral-500/50',
          'text-sm font-diatype',
          'animate-slide-up-and-fade',
          'z-10',
          type === 'warning' && `bg-[#fbeef1]`,
          type === 'warning' && 'font-medium',
          _content?.className
        )}
      >
        {label}
        <Tooltip.Arrow
          className={cn('drop-shadow', type === 'warning' && 'fill-[#fbeef1]')}
        />
      </StyledTooltipContent>
    </Tooltip.Root>
  );
};

const StyledTooltipContent = styled(Tooltip.Content)<{
  type: 'default' | 'warning' | 'brand';
}>`
  background-color: ${(props) => props.theme.backgroundColor};

  fill: ${(props) => props.theme.backgroundColor};
  color: ${(props) =>
    props.type === 'warning' ? props.theme.brandColor : props.theme.textColor};
`;
