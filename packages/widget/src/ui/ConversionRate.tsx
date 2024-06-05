import { Asset } from "@skip-router/core";
import { ReactNode, useCallback, useMemo, useState } from "react";

export interface Props {
  srcAsset: Asset;
  destAsset: Asset;
  amountIn: string;
  amountOut: string;
  defaultDirection?: ConvDirection;

  children: (args: RenderArgs) => ReactNode;
}

interface RenderArgs {
  left: Asset;
  right: Asset;
  conversion: number;
  toggle: () => void;
}

export const ConversionRate = ({
  srcAsset: src,
  destAsset: dest,
  amountIn,
  amountOut,
  defaultDirection = ConvDirection.DEST_SRC,
  children,
}: Props) => {
  const [direction, setState] = useState<ConvDirection>(() => defaultDirection);

  const toggle = useCallback(() => {
    setState((prev) => {
      return prev === ConvDirection.DEST_SRC ? ConvDirection.SRC_DEST : ConvDirection.DEST_SRC;
    });
  }, []);

  const left = direction === ConvDirection.DEST_SRC ? dest : src;
  const right = direction === ConvDirection.DEST_SRC ? src : dest;

  const conversion = useMemo(() => {
    if (direction === ConvDirection.DEST_SRC) {
      return +amountIn / +amountOut;
    } else {
      return +amountOut / +amountIn;
    }
  }, [amountIn, amountOut, direction]);

  const renderArgs: RenderArgs = useMemo(
    () => ({ left, right, conversion, toggle }),
    [conversion, left, right, toggle],
  );

  return children(renderArgs);
};

export enum ConvDirection {
  DEST_SRC = "dest-src",
  SRC_DEST = "src-dest",
}
