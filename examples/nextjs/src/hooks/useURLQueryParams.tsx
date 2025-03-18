import { useState, useEffect } from 'react';
import { WidgetProps } from '@skip-go/widget';

type OtherParams = {
  shadowDom?: boolean;
  testnet?: boolean;
  api?: "prod" | "dev";
  theme?: "light" | "dark";
}

export const useQueryParams = () => {
  const [defaultRoute, setDefaultRoute] = useState<WidgetProps['defaultRoute']>(undefined);
  const [otherParams, setOtherParams] = useState<OtherParams>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryString = window.location.search.substring(1);
      const pairs = queryString.split('&');
      const keys = ['src_asset', 'src_chain', 'dest_chain', 'dest_asset', 'amount_in', 'amount_out', 'testnet', "api", "shadowDom", "theme"];
      const defaultRouteResult: Partial<WidgetProps['defaultRoute']> = {};
      const otherParams = {} as OtherParams;

      pairs.forEach((pair) => {
        const [rawKey, rawValue] = pair.split('=');

        const value = decodeURIComponent(rawValue);
        if (rawKey && rawValue && keys.includes(rawKey)) {
          if (rawKey === 'src_asset') {
            defaultRouteResult.srcAssetDenom = value;
          }
          if (rawKey === 'src_chain') {
            defaultRouteResult.srcChainId = value;
          }
          if (rawKey === 'dest_chain') {
            defaultRouteResult.destChainId = value;
          }
          if (rawKey === 'dest_asset') {
            defaultRouteResult.destAssetDenom = value;
          }
          if (rawKey === 'amount_in') {
            defaultRouteResult.amountIn = parseFloat(value);
          }
          if (rawKey === 'amount_out') {
            defaultRouteResult.amountOut = parseFloat(value);
          }
          if (rawKey === "shadowDom") {
            otherParams.shadowDom = JSON.parse(value) as boolean;
          }
          if (rawKey === "testnet") {
            otherParams.testnet = JSON.parse(value) as boolean;
          }
          if (rawKey === "api" && ["prod", "dev"].includes(value)) {
            otherParams.api = value as "prod" | "dev";
          }
          if (rawKey === "theme" && ["light", "dark"].includes(value)) {
            otherParams.theme = value as "light" | "dark";
          }
        }
      });

      setOtherParams(otherParams);

      if (!Object.keys(defaultRouteResult).length) return;

      setDefaultRoute(defaultRouteResult as WidgetProps['defaultRoute']);
    }
  }, []);

  return {defaultRoute, otherParams};
};
