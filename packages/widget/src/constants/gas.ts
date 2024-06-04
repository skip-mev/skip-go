export const DEFAULT_GAS_AMOUNT = (200_000).toString();

export const EVMOS_GAS_AMOUNT = (280_000).toString();

export function isChainIdEvmos(chainID: string) {
  return chainID === 'evmos_9001-2' || chainID.includes('evmos');
}
