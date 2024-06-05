import { useChains } from '../hooks/use-chains';
import { useSwapWidget } from '../hooks/use-swap-widget';
import AssetInput from './AssetInput';

export const Widget = () => {
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
  } = useSwapWidget();

  return (
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
  );
};
