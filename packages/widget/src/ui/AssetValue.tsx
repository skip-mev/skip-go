import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useAssets } from '../provider/assets';

interface Props {
  chainId: string;
  denom: string;
  value: string;
}

export function AssetValue({ chainId, denom, value }: Props) {
  const { getAsset } = useAssets();

  const asset = useMemo(() => {
    return getAsset(denom, chainId);
  }, [chainId, denom, getAsset]);

  const formattedValue = useMemo(() => {
    if (!asset?.decimals) return '-';
    const v = formatUnits(BigInt(value), asset.decimals);
    return parseFloat(v).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  }, [asset?.decimals, value]);

  return (
    <span className="tabular-nums">
      {formattedValue} {asset?.recommendedSymbol || '--'}
    </span>
  );
}
