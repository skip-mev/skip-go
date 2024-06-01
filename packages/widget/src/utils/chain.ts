import { FeeAsset } from '@skip-router/core';

/**
 * - deprio denoms start with 'ibc/' and 'factory/'
 * - prio denoms start with 'u' or 'uu'
 */
export function sortFeeAssets(a: FeeAsset, b: FeeAsset) {
  const aIsDeprio =
    a.denom.startsWith('ibc/') || a.denom.startsWith('factory/');
  const bIsDeprio =
    b.denom.startsWith('ibc/') || b.denom.startsWith('factory/');
  const aIsPrio = a.denom.startsWith('u') || a.denom.startsWith('uu');
  const bIsPrio = b.denom.startsWith('u') || b.denom.startsWith('uu');

  if (aIsDeprio && !bIsDeprio) return 1;
  if (!aIsDeprio && bIsDeprio) return -1;
  if (aIsPrio && !bIsPrio) return -1;
  if (!aIsPrio && bIsPrio) return 1;

  return 0;
}
