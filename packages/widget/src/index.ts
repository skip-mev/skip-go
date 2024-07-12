import { Buffer as BufferPolyfill } from 'buffer';
globalThis.Buffer = BufferPolyfill;

export { SwapWidgetProvider } from './provider';
export { SwapWidget, SwapWidgetProps } from './ui';
export { initializeSwapWidget } from './ui/WebComponent';
export { useAssets } from './provider/assets';
export { useChains, useChainByID } from './hooks/use-chains';
