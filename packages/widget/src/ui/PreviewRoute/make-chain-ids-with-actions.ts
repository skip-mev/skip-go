import { RouteResponse } from '@skip-go/core';

import { Action, SwapAction, TransferAction } from './make-actions';

export interface ChainIDWithAction {
  chainID: string;
  transferAction?: TransferAction | undefined;
  swapAction: SwapAction | undefined;
}

export const makeChainIDsWithAction = ({
  route,
  actions,
}: {
  route: RouteResponse;
  actions: Action[];
}): ChainIDWithAction[] => {
  const transferActions = actions.filter(
    (action) => action.type === 'TRANSFER'
  ) as TransferAction[];
  return route.chainIDs.map((chainID, index) => {
    const isFirstChain = index === 0;
    const isLastChain = index === route.chainIDs.length - 1;
    const prevChainID = !isFirstChain && route.chainIDs[index - 1];
    const nextChainID = !isLastChain && route.chainIDs[index + 1];

    const chainRoute = isLastChain
      ? [prevChainID, chainID]
      : [chainID, nextChainID];
    const transferAction = transferActions.find((action) => {
      return (
        action.fromChainID === chainRoute[0] &&
        action.toChainID === chainRoute[1]
      );
    });

    const reversedActions = actions.slice().reverse();
    // Find the last swap action that matches conditions
    const swapAction = reversedActions.find((action) => {
      if (
        index === 0 &&
        actions.length <= 2 &&
        action.type === 'SWAP' &&
        chainID === action.chainID
      ) {
        return true;
      }

      if (action.type === 'SWAP' && chainID === action.chainID) {
        return (
          (transferAction?.amountOut === action.amountIn &&
            transferAction.toChainID === action.chainID) ||
          (transferAction?.fromChainID === action.chainID &&
            transferAction.amountIn === action.amountOut)
        );
      }
    }) as SwapAction | undefined;

    return { chainID, transferAction, swapAction };
  });
};
