import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useAssets } from '../provider/assets';
import { raise } from '../utils/assert';

interface Props {
  chainId: string;
  denom: string;
  value: string;
}

export function AssetValue({ chainId, denom, value }: Props) {
  const { getAsset } = useAssets();

  const { decimals = 6, recommendedSymbol } = useMemo(() => {
    return (
      getAsset(denom, chainId) ||
      raise(`AssetValue error: no asset found for '${denom}' on '${chainId}'`)
    );
  }, [chainId, denom, getAsset]);

  const formattedValue = useMemo(() => {
    const v = formatUnits(BigInt(value), decimals);
    return parseFloat(v).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  }, [decimals, value]);

  return (
    <span className="tabular-nums">
      {formattedValue} {recommendedSymbol}
    </span>
  );
}
