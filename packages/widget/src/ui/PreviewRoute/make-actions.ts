import { BridgeType, RouteResponse } from '@skip-go/core';

export interface TransferAction {
  type: 'TRANSFER';
  denomIn: string;
  denomOut: string;
  fromChainID: string;
  toChainID: string;
  id: string;
  bridgeID?: BridgeType;
  signRequired: boolean;
  amountIn: string;
  amountOut: string;
  txIndex: number;
}

export interface SwapAction {
  type: 'SWAP';
  denomIn: string;
  denomOut: string;
  chainID: string;
  id: string;
  signRequired: boolean;
  amountIn: string;
  amountOut: string;
  txIndex: number;
}

export type Action = TransferAction | SwapAction;

export const makeActions = ({ route }: { route: RouteResponse }): Action[] => {
  const _actions: Action[] = [];

  let swapCount = 0;
  let transferCount = 0;
  route.operations.forEach((operation, i) => {
    const signRequired = (() => {
      if (i === 0) {
        return true;
      } else {
        const prevOperation = route.operations[i - 1];
        if (operation.txIndex > prevOperation.txIndex) {
          return true;
        }
        return false;
      }
    })();

    if ('swap' in operation) {
      _actions.push({
        type: 'SWAP',
        denomIn: operation.swap.denomIn,
        denomOut: operation.swap.denomOut,
        chainID: operation.swap.chainID,
        id: `swap-${swapCount}-${transferCount}-${i}`,
        signRequired,
        amountIn: operation.amountIn,
        amountOut: operation.amountOut,
        txIndex: operation.txIndex,
      });

      swapCount++;
      return;
    }

    if ('evmSwap' in operation) {
      _actions.push({
        type: 'SWAP',
        denomIn: operation.evmSwap.denomIn,
        denomOut: operation.evmSwap.denomOut,
        chainID: operation.evmSwap.fromChainID,
        id: `swap-${swapCount}-${transferCount}-${i}`,
        signRequired,
        amountIn: operation.amountIn,
        amountOut: operation.amountOut,
        txIndex: operation.txIndex,
      });
      return;
    }

    if ('svmSwap' in operation) {
      _actions.push({
        type: 'SWAP',
        denomIn: operation.svmSwap.denomIn,
        denomOut: operation.svmSwap.denomOut,
        chainID: operation.svmSwap.fromChainID,
        id: `swap-${swapCount}-${transferCount}-${i}`,
        signRequired,
        amountIn: operation.amountIn,
        amountOut: operation.amountOut,
        txIndex: operation.txIndex,
      });
      return;
    }

    if ('axelarTransfer' in operation) {
      _actions.push({
        type: 'TRANSFER',
        denomIn: operation.axelarTransfer.denomIn,
        denomOut: operation.axelarTransfer.denomOut,
        fromChainID: operation.axelarTransfer.fromChainID,
        toChainID: operation.axelarTransfer.toChainID,
        id: `transfer-${swapCount}-${transferCount}-${i}`,
        bridgeID: operation.axelarTransfer.bridgeID,
        signRequired,
        amountIn: operation.amountIn,
        amountOut: operation.amountOut,
        txIndex: operation.txIndex,
      });
      transferCount++;
      return;
    }

    if ('cctpTransfer' in operation) {
      _actions.push({
        type: 'TRANSFER',
        denomIn: operation.cctpTransfer.denomIn,
        denomOut: operation.cctpTransfer.denomOut,
        fromChainID: operation.cctpTransfer.fromChainID,
        toChainID: operation.cctpTransfer.toChainID,
        id: `transfer-${swapCount}-${transferCount}-${i}`,
        bridgeID: operation.cctpTransfer.bridgeID,
        signRequired,
        amountIn: operation.amountIn,
        amountOut: operation.amountOut,
        txIndex: operation.txIndex,
      });
      transferCount++;
      return;
    }

    if ('hyperlaneTransfer' in operation) {
      _actions.push({
        type: 'TRANSFER',
        denomIn: operation.hyperlaneTransfer.denomIn,
        denomOut: operation.hyperlaneTransfer.denomOut,
        fromChainID: operation.hyperlaneTransfer.fromChainID,
        toChainID: operation.hyperlaneTransfer.toChainID,
        id: `transfer-${swapCount}-${transferCount}-${i}`,
        bridgeID: operation.hyperlaneTransfer.bridgeID,
        signRequired,
        amountIn: operation.amountIn,
        amountOut: operation.amountOut,
        txIndex: operation.txIndex,
      });
      transferCount++;
      return;
    }

    if ('opInitTransfer' in operation) {
      _actions.push({
        type: 'TRANSFER',
        denomIn: operation.opInitTransfer.denomIn,
        denomOut: operation.opInitTransfer.denomOut,
        fromChainID: operation.opInitTransfer.fromChainID,
        toChainID: operation.opInitTransfer.toChainID,
        id: `transfer-${swapCount}-${transferCount}-${i}`,
        bridgeID: operation.opInitTransfer.bridgeID,
        signRequired,
        amountIn: operation.amountIn,
        amountOut: operation.amountOut,
        txIndex: operation.txIndex,
      });
      transferCount++;
      return;
    }

    if ('bankSend' in operation) {
      _actions.push({
        type: 'TRANSFER',
        denomIn: operation.bankSend.denom,
        denomOut: operation.bankSend.denom,
        fromChainID: operation.bankSend.chainID,
        toChainID: operation.bankSend.chainID,
        id: `transfer-${swapCount}-${transferCount}-${i}`,
        signRequired,
        amountIn: operation.amountIn,
        amountOut: operation.amountOut,
        txIndex: operation.txIndex,
      });
      transferCount++;
      return;
    }

    _actions.push({
      type: 'TRANSFER',
      denomIn: operation.transfer.denomIn,
      denomOut: operation.transfer.denomOut,
      fromChainID: operation.transfer.fromChainID,
      toChainID: operation.transfer.toChainID,
      id: `transfer-${swapCount}-${transferCount}-${i}`,
      bridgeID: operation.transfer.bridgeID,
      signRequired,
      amountIn: operation.amountIn,
      amountOut: operation.amountOut,
      txIndex: operation.txIndex,
    });
    transferCount++;
  });

  return _actions;
};
