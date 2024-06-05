import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { create } from 'zustand';

import { Args, useUsdDiffValue, useUsdValue } from '../hooks/use-usd-value';
import { formatUSD } from '../utils/intl';

type UsdValueProps = Args & {
  error?: ReactNode;
  loading?: ReactNode;
  context?: 'src' | 'dest';
};

export const UsdValue = ({
  error = 'Price not available',
  loading = '...',
  context,
  ...args
}: UsdValueProps) => {
  const { data: usdValue = 0, isError, isLoading } = useUsdValue(args);

  const prevValue = useRef(usdValue);
  useEffect(() => {
    if (!isLoading && prevValue.current !== usdValue) {
      prevValue.current = usdValue;
    }
  }, [isLoading, usdValue]);

  const contextStore = useContext(ctx);
  useEffect(() => {
    if (contextStore && context) {
      contextStore.setState({ [context]: isError ? undefined : args });
      return () => {
        contextStore.setState({ [context]: undefined });
      };
    }
  });

  if (isError) {
    return <>{error}</>;
  }

  if (isLoading && prevValue.current) {
    return <>{formatUSD(prevValue.current)}</>;
  }

  return <>{isLoading ? loading : formatUSD(usdValue)}</>;
};

///////////////////////////////////////////////////////////////////////////////

type Store = { src?: Args; dest?: Args };

const createContextStore = () => {
  return create<Store>(() => ({ src: undefined, dest: undefined }));
};

type Context = ReturnType<typeof createContextStore> | undefined;
const ctx = createContext<Context>(undefined);

///////////////////////////////////////////////////////////////////////////////

type UsdDiffValueProps = {
  src: Args;
  dest: Args;
  onLoading?: ReactNode;
  onUndefined?: ReactNode;
  children?: (args: { isLoading: boolean; percentage: number }) => ReactNode;
};

export const UsdDiffValue = (props: UsdDiffValueProps) => {
  const { src, dest, onLoading = '...', children } = props;
  const { data: percentage = 0, isLoading } = useUsdDiffValue([src, dest]);

  if (children) {
    return <>{children({ isLoading, percentage })}</>;
  }
  if (isLoading) {
    return <>{onLoading}</>;
  }
  return <>{percentage.toFixed(2)}%</>;
};

export const UsdDiff = {
  Provider: ({ children }: { children: ReactNode }) => {
    const store = useRef<Context>(createContextStore());
    return <ctx.Provider value={store.current}>{children}</ctx.Provider>;
  },
  Value: (props: Omit<UsdDiffValueProps, 'src' | 'dest'>) => {
    const useStore = useContext(ctx);
    if (!useStore) {
      throw new Error('UsdDiff.Value must be used inside UsdDiff.Provider');
    }

    const { src, dest } = useStore();
    if (!(src && dest)) {
      return <>{props.onUndefined ?? null}</>;
    }

    return <UsdDiffValue src={src} dest={dest} {...props} />;
  },
};

export const useUsdDiffReset = () => {
  const store = useContext(ctx);
  if (!store) {
    throw new Error('useUsdDiffReset must be used inside UsdDiff.Provider');
  }
  return () => store.setState({ src: undefined, dest: undefined });
};
