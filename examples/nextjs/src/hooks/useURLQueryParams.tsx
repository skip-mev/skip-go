import { useState, useEffect } from 'react';
import { WidgetProps } from '@skip-go/widget';

export const useQueryParams = () => {
  const [params, setParams] = useState<WidgetProps['defaultRoute']>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryString = window.location.search.substring(1);
      const pairs = queryString.split('&');
      const keys = ['src_asset', 'src_chain', 'dest_chain', 'dest_asset', 'amount_in', 'amount_out'];
      const result: Partial<WidgetProps['defaultRoute']> = {};

      pairs.forEach((pair) => {
        const [rawKey, rawValue] = pair.split('=');
        if (rawKey && rawValue && keys.includes(rawKey)) {
          if (rawKey === 'src_asset') {
            result.srcAssetDenom = decodeURIComponent(rawValue);
          }
          if (rawKey === 'src_chain') {
            result.srcChainId = decodeURIComponent(rawValue);
          }
          if (rawKey === 'dest_chain') {
            result.destChainId = decodeURIComponent(rawValue);
          }
          if (rawKey === 'dest_asset') {
            result.destAssetDenom = decodeURIComponent(rawValue);
          }
          if (rawKey === 'amount_in') {
            result.amountIn = parseFloat(decodeURIComponent(rawValue));
          }
          if (rawKey === 'amount_out') {
            result.amountOut = parseFloat(decodeURIComponent(rawValue));
          }
        }
      });

      setParams(result as WidgetProps['defaultRoute']);
    }
  }, []);

  return params;
};
