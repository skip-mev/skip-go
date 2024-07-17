import { ChevronDownIcon, PencilSquareIcon } from '@heroicons/react/16/solid';
import * as Collapsible from '@radix-ui/react-collapsible';
import { BridgeType, RouteResponse } from '@skip-go/core';
import { useMemo, useState } from 'react';

import { useSettingsStore } from '../store/settings';
import { formatPercent, formatUSD } from '../utils/intl';
import { cn } from '../utils/ui';
import { UsdValue } from './UsdValue';
import { SimpleTooltip } from './SimpleTooltip';
import { disclosure } from '../store/disclosures';
import { SwapWidgetStore } from '../hooks/use-swap-widget';
import { ConversionRate } from './ConversionRate';
import { StyledThemedButton } from './StyledComponents/Buttons';
import { StyledBorderDiv } from './StyledComponents/Theme';

type Props = SwapWidgetStore & {
  amountOut: string;
  onBridgesChange: (bridges: BridgeType[]) => void;
  priceImpactPercent: number;
  priceImpactThresholdReached: boolean;
  route: RouteResponse;
};

export const SwapDetails = ({
  amountIn,
  amountOut,
  // bridges: selectedBridges,
  destinationAsset,
  destinationChain,
  gasRequired,
  // onBridgesChange,
  priceImpactPercent,
  priceImpactThresholdReached,
  route,
  sourceAsset,
  sourceChain,
  sourceFeeAsset,
}: Props) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { slippage } = useSettingsStore();

  const axelarTransferOperation = useMemo(() => {
    for (const op of route.operations) {
      if ('axelarTransfer' in op) return op;
    }
  }, [route]);
  const hyperlaneTransferOperation = useMemo(() => {
    for (const op of route.operations) {
      if ('hyperlaneTransfer' in op) return op;
    }
  }, [route]);

  const bridgingFee = useMemo(() => {
    if (hyperlaneTransferOperation) {
      const { feeAmount, feeAsset, usdFeeAmount } =
        hyperlaneTransferOperation.hyperlaneTransfer;
      const computed = (
        +feeAmount / Math.pow(10, feeAsset.decimals || 6)
      ).toLocaleString('en-US', {
        maximumFractionDigits: 6,
      });
      return {
        inAsset: `${computed} ${feeAsset.symbol}`,
        inUSD: usdFeeAmount && `${formatUSD(usdFeeAmount)}`,
      };
    }
    if (axelarTransferOperation) {
      const { feeAmount, feeAsset, usdFeeAmount } =
        axelarTransferOperation.axelarTransfer;
      const computed = (
        +feeAmount / Math.pow(10, feeAsset.decimals || 18)
      ).toLocaleString('en-US', {
        maximumFractionDigits: 6,
      });

      return {
        inAsset: `${computed} ${feeAsset.symbol}`,
        inUSD: `${formatUSD(usdFeeAmount)}`,
      };
    }
  }, [axelarTransferOperation, hyperlaneTransferOperation]);

  const isSmartRelay = route.estimatedFees?.some(
    (fee) => fee.feeType === 'SMART_RELAY'
  );

  const smartRelayFee = useMemo(() => {
    if (!isSmartRelay) return;
    const fee = route.estimatedFees.filter(
      (fee) => fee.feeType === 'SMART_RELAY'
    );
    const sameAsset = fee.every(
      (fee, i, arr) => fee.originAsset.symbol === arr[0].originAsset.symbol
    );
    if (!sameAsset) return;
    const computedAmount = fee.reduce(
      (acc, fee) => acc + Number(fee.amount),
      0
    );
    const computedUsd = fee.reduce(
      (acc, fee) => acc + Number(fee.usdAmount),
      0
    );
    const inAsset = (
      computedAmount / Math.pow(10, fee[0].originAsset.decimals || 6)
    ).toLocaleString('en-US', {
      maximumFractionDigits: 6,
    });

    return {
      amount: Number(inAsset),
      inAsset: `${inAsset} ${fee[0].originAsset.symbol}`,
      inUSD: `${formatUSD(computedUsd)}`,
    };
  }, [isSmartRelay, route.estimatedFees]);

  const totalAmountOut = useMemo(() => {
    if (isSmartRelay) {
      return String(parseFloat(amountOut) + (smartRelayFee?.amount || 0));
    }
    return amountOut;
  }, [amountOut, isSmartRelay, smartRelayFee?.amount]);

  if (!(sourceChain && sourceAsset && destinationChain && destinationAsset)) {
    return null;
  }

  return (
    <StyledBorderDiv
      as={Collapsible.Root}
      className={cn(
        'group rounded-lg px-4 py-2 text-sm',
        'border transition-[border,shadow]'
      )}
      open={detailsOpen || priceImpactThresholdReached}
      onOpenChange={(open) => setDetailsOpen(open)}
    >
      <div className="relative flex items-center gap-1 text-center text-xs">
        <ConversionRate
          srcAsset={sourceAsset}
          destAsset={destinationAsset}
          amountIn={amountIn}
          amountOut={totalAmountOut}
        >
          {({ left, right, conversion, toggle }) => (
            <div>
              <button className="mr-2 tabular-nums" onClick={toggle}>
                1 {(left.recommendedSymbol ?? '').replace(/\sEthereum$/, '')} ={' '}
                {conversion.toLocaleString('en-US', {
                  maximumFractionDigits: 4,
                })}{' '}
                {(right.recommendedSymbol ?? '').replace(/\sEthereum$/, '')}
              </button>
              <span className="tabular-nums text-neutral-400">
                <UsdValue
                  error={null}
                  chainId={right.chainID}
                  denom={right.denom}
                  coingeckoID={right.coingeckoID}
                  value={conversion.toString()}
                />
              </span>
            </div>
          )}
        </ConversionRate>
        <div className="flex-grow" />
        <Collapsible.Trigger
          className={cn(
            'relative flex items-center gap-1 text-xs',
            "before:absolute before:-inset-2 before:content-['']",
            'text-neutral-400'
          )}
        >
          <span
            className={cn(
              'animate-slide-left-and-fade tabular-nums text-neutral-400 transition-opacity',
              detailsOpen && 'hidden'
            )}
          >
            Slippage: {slippage}%
          </span>
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 transition',
              detailsOpen ? 'rotate-180' : 'rotate-0'
            )}
          />
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content
        className={cn(
          'overflow-hidden',
          'data-[state=open]:animate-collapsible-open',
          'data-[state=closed]:animate-collapsible-closed'
        )}
      >
        <dl
          className={cn(
            'mb-2 mt-4 grid grid-cols-2 gap-2',
            '[&_dt]:text-start [&_dt]:text-neutral-400',
            '[&_dd]:text-end [&_dd]:tabular-nums'
          )}
        >
          {priceImpactPercent ? (
            <>
              <dt className={priceImpactThresholdReached ? 'text-red-500' : ''}>
                Price Impact
              </dt>
              <dd className={priceImpactThresholdReached ? 'text-red-500' : ''}>
                {formatPercent(priceImpactPercent)}
              </dd>
            </>
          ) : null}
          <dt>Slippage</dt>
          <dd>
            <SimpleTooltip label="Click to change maximum slippage">
              <StyledThemedButton
                className={cn(
                  'mr-1 inline-flex items-center gap-1 p-1 text-xs transition-colors',
                  'text-red-500',
                  'rounded'
                )}
                onClick={() => disclosure.open('settingsDialog')}
              >
                <PencilSquareIcon className="h-3 w-3" />
              </StyledThemedButton>
            </SimpleTooltip>
            {slippage}%
          </dd>
          {sourceFeeAsset && (
            <>
              <dt>Estimated Transaction Fee</dt>
              {sourceChain.chainID !== 'stride-1' ? (
                <dd>
                  {gasRequired ?? '-'} {sourceFeeAsset.recommendedSymbol}
                </dd>
              ) : (
                <dd>--</dd>
              )}
            </>
          )}
          {/* <dt>Gas Amount</dt>
          <dd>
            <SimpleTooltip label="Click to change gas multiplier">
              <button
                className={cn(
                  "mr-1 inline-flex items-center gap-1 p-1 text-xs transition-colors",
                  "text-red-500 hover:bg-neutral-100",
                  "rounded",
                )}
                onClick={() => disclosure.open("settingsDialog")}
              >
                <PencilSquareIcon className="h-3 w-3" />
              </button>
            </SimpleTooltip>
            {parseFloat(gasAmount).toLocaleString()}
          </dd> */}
          {bridgingFee && (
            <>
              <dt>Bridging Fee</dt>
              <dd>
                {bridgingFee?.inAsset ?? '-'}{' '}
                <span className="text-sm tabular-nums text-neutral-400">
                  {bridgingFee?.inUSD ?? '-'}
                </span>
              </dd>
            </>
          )}
          {smartRelayFee && (
            <>
              <dt>Relayer Fee</dt>
              <dd>
                {smartRelayFee?.inAsset ?? '-'}{' '}
                <span className="text-sm tabular-nums text-neutral-400">
                  {smartRelayFee?.inUSD ?? '-'}
                </span>
              </dd>
            </>
          )}
        </dl>
      </Collapsible.Content>
    </StyledBorderDiv>
  );
};
