import { ArrowsUpDownIcon, FingerPrintIcon } from '@heroicons/react/20/solid';
import * as Tooltip from '@radix-ui/react-tooltip';
import type {} from 'typed-query-selector';
import { ElementRef, useEffect, useRef } from 'react';
import { useSwapWidget } from '../hooks/use-swap-widget';
import { disclosure } from '../store/disclosures';
import { cn } from '../utils/ui';
import { AdaptiveLink } from './AdaptiveLink';
import AssetInput from './AssetInput';
import { HistoryButton } from './Button/HistoryButton';
import { SettingsButton } from './Button/SettingsButton';
import { ShareButton } from './Button/ShareButton';
import { ConnectedWalletButton } from './ConnectedWalletButton';
import { HistoryDialog } from './HistoryDialog';
import { JsonDialog } from './JsonDialog';
import { SettingsDialog } from './SettingsDialog';
import { SimpleTooltip } from './SimpleTooltip';
import { SwapDetails } from './SwapDetails';
import { UsdDiff } from './UsdValue';
import { useAccount } from '../hooks/use-account';
import { useWalletModal, WalletModal } from './WalletModal';
import { useChains } from '../hooks/use-chains';
import TransactionDialog from './TransactionDialog';
import { SpinnerIcon } from './Icon/SpinnerIcon';
import { useSwapWidgetUIStore } from '../store/swap-widget';
import { css } from '@emotion/css';
import { CraftedBySkip } from './CraftedBySkip';
import { useFixRadixUiWheelEvent } from '../hooks/use-fix-radix-ui-wheel-event';

export const SwapWidgetUI = ({
  className,
  style,
}: Pick<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>) => {
  useFixRadixUiWheelEvent();

  useEffect(() => void disclosure.rehydrate(), []);

  const { openWalletModal } = useWalletModal();
  const { data: chains } = useChains();

  const {
    amountIn,
    amountOut,
    bridges,
    destinationAsset,
    destinationChain,
    direction,
    isAmountError,
    numberOfTransactions,
    onAllTransactionComplete,
    onBridgeChange,
    onDestinationAmountChange,
    onDestinationAssetChange,
    onDestinationChainChange,
    onInvertDirection,
    onSourceAmountChange,
    onSourceAmountMax,
    onSourceAssetChange,
    onSourceChainChange,
    priceImpactThresholdReached,
    route,
    routeError,
    routeLoading,
    routeWarningMessage,
    routeWarningTitle,
    sourceAsset,
    sourceChain,
    sourceFeeAmount,
    sourceFeeAsset,
    swapPriceImpactPercent,
    usdDiffPercent,
    shareable,
  } = useSwapWidget();

  const srcAccount = useAccount(sourceChain?.chainID);

  const isWalletConnected = srcAccount?.isWalletConnected;

  function promptDestAsset() {
    document.querySelector("[data-testid='destination'] button")?.click();
  }

  const invertButtonRef = useRef<ElementRef<'button'>>(null);
  useEffect(() => {
    const ref = invertButtonRef.current;
    if (!ref) return;
    const listener = () => ref.setAttribute('data-swap', 'false');
    ref.addEventListener('animationend', listener);
    return () => ref.removeEventListener('animationend', listener);
  }, []);

  const accountStateKey = `${srcAccount?.isWalletConnected ? 'src' : 'no-src'}`;

  return (
    <UsdDiff.Provider>
      <Tooltip.Provider delayDuration={0} disableHoverableContent>
        <div
          className={cn(
            'space-y-4 font-diatype relative p-4 bg-white',
            className
          )}
          style={style}
        >
          <div className="flex h-8 items-center">
            <p className="text-2xl font-semibold">From</p>
            <div className="flex-grow" />
            <ShareButton shareableLink={shareable.link} />
            <HistoryButton />
            <SettingsButton />
            <div className="w-2" />
            {srcAccount?.address && srcAccount?.wallet ? (
              <SimpleTooltip label="Change Source Wallet">
                <ConnectedWalletButton
                  address={srcAccount.address}
                  onClick={() =>
                    sourceChain?.chainID && openWalletModal(sourceChain.chainID)
                  }
                  walletName={srcAccount.wallet?.walletPrettyName}
                  walletLogo={
                    srcAccount.wallet.walletInfo
                      ? typeof srcAccount.wallet.walletInfo.logo === 'string'
                        ? srcAccount.wallet.walletInfo.logo
                        : srcAccount.wallet.walletInfo.logo?.major ||
                          srcAccount.wallet.walletInfo.logo?.minor
                      : ''
                  }
                  className="animate-slide-left-and-fade"
                  key={srcAccount.address}
                />
              </SimpleTooltip>
            ) : null}
          </div>
          <div data-testid="source">
            <AssetInput
              amount={amountIn}
              amountUSD={route?.usdAmountIn}
              asset={sourceAsset}
              chain={sourceChain}
              chains={chains ?? []}
              onAmountChange={onSourceAmountChange}
              onAmountMax={onSourceAmountMax}
              onAssetChange={onSourceAssetChange}
              onChainChange={onSourceChainChange}
              context="source"
              isLoading={direction === 'swap-out' && routeLoading}
              isError={isAmountError}
            />
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <button
                className={cn(
                  'pointer-events-auto flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white',
                  'transition-transform enabled:hover:rotate-3 enabled:hover:scale-105',
                  'disabled:cursor-not-allowed disabled:bg-neutral-500 disabled:hover:scale-100',
                  'data-[swap=true]:pointer-events-none data-[swap=true]:animate-spin-swap'
                )}
                disabled={!destinationChain}
                onClick={async () => {
                  if (!destinationChain || !invertButtonRef.current) return;
                  invertButtonRef.current.setAttribute('data-swap', 'true');
                  await onInvertDirection();
                }}
                data-testid="swap-button"
                ref={invertButtonRef}
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-2xl font-semibold">To</p>
          </div>
          <div data-testid="destination">
            <AssetInput
              amount={amountOut}
              amountUSD={route?.usdAmountOut}
              diffPercentage={usdDiffPercent}
              asset={destinationAsset}
              chain={destinationChain}
              chains={chains ?? []}
              onAmountChange={onDestinationAmountChange}
              onAssetChange={onDestinationAssetChange}
              onChainChange={onDestinationChainChange}
              context="destination"
              isLoading={direction === 'swap-in' && routeLoading}
            />
          </div>
          {route && (
            <SwapDetails
              amountIn={amountIn}
              amountOut={amountOut}
              bridges={bridges}
              destinationAsset={destinationAsset}
              destinationChain={destinationChain}
              direction={direction}
              gasRequired={sourceFeeAmount}
              onBridgesChange={onBridgeChange}
              priceImpactPercent={swapPriceImpactPercent ?? 0}
              priceImpactThresholdReached={priceImpactThresholdReached}
              route={route}
              sourceAsset={sourceAsset}
              sourceFeeAsset={sourceFeeAsset}
              sourceChain={sourceChain}
            />
          )}
          {routeLoading && (
            <div className="flex w-full items-center justify-between space-x-2 text-sm font-medium uppercase">
              <p className="text-neutral-400">Finding best route...</p>
              <SpinnerIcon className="h-5 w-5 text-neutral-200 animate-spin" />
            </div>
          )}
          {route && !routeLoading && numberOfTransactions > 1 && (
            <div className="flex w-full items-center justify-center space-x-2 text-sm font-medium uppercase">
              <div
                className={cn('relative rounded-full p-[4px]')}
                style={{
                  backgroundColor:
                    useSwapWidgetUIStore.getState().colors.primary,
                }}
              >
                <div
                  className={cn(
                    'absolute h-6 w-6 animate-ping rounded-full',
                    css`
                      background-color: ${useSwapWidgetUIStore.getState().colors
                        .primary} !important;
                    `
                  )}
                />
                <FingerPrintIcon className="relative h-6 w-6 text-white" />
              </div>
              <p>{numberOfTransactions} Signature Required</p>
            </div>
          )}
          {!!routeError && (
            <div className="flex w-full items-center rounded-md bg-red-50 p-3 text-left text-xs font-medium uppercase text-red-500">
              <p className="flex-1">{routeError}</p>
            </div>
          )}
          {destinationChain?.chainID === 'dydx-mainnet-1' && (
            <div className="flex w-full items-center rounded-md bg-red-50 p-3 text-left text-xs font-medium uppercase text-red-500">
              <p className="flex-1 [&_a]:underline">
                This transaction will let you transfer and stake tokens on dydx,
                it will not allow you to trade. Follow the{' '}
                <AdaptiveLink href="https://dydx.exchange">
                  dydx frontend
                </AdaptiveLink>{' '}
                directions to set up a trading account
              </p>
            </div>
          )}
          {!isWalletConnected && (
            <button
              className={cn(
                'w-full rounded-md py-4 font-semibold text-white outline-none transition-[opacity,transform]',
                'disabled:cursor-not-allowed disabled:opacity-75',
                'enabled:hover:rotate-1 enabled:hover:scale-105'
              )}
              style={{
                backgroundColor: useSwapWidgetUIStore.getState().colors.primary,
              }}
              disabled={!sourceChain}
              onClick={async () => {
                if (sourceChain && !srcAccount?.isWalletConnected) {
                  openWalletModal(sourceChain.chainID);
                  return;
                }
                if (!destinationChain) {
                  promptDestAsset();
                  return;
                }
              }}
            >
              <div key={accountStateKey} className="animate-slide-up-and-fade">
                {!srcAccount?.isWalletConnected && 'Connect Wallet'}
              </div>
            </button>
          )}
          {sourceChain && isWalletConnected && (
            <div className="space-y-4">
              <TransactionDialog
                isLoading={routeLoading}
                route={route}
                isAmountError={isAmountError}
                shouldShowPriceImpactWarning={
                  !!routeWarningTitle && !!routeWarningMessage
                }
                routeWarningTitle={routeWarningTitle}
                routeWarningMessage={routeWarningMessage}
                onAllTransactionComplete={onAllTransactionComplete}
              />
            </div>
          )}
          <CraftedBySkip />
        </div>
        <HistoryDialog />
        <SettingsDialog />
        <JsonDialog />
      </Tooltip.Provider>
      <WalletModal />
    </UsdDiff.Provider>
  );
};
