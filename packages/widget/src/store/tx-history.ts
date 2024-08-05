import { RouteResponse } from '@skip-go/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { randomId } from '../utils/random';

export interface TxStatus {
  chainId: string;
  txHash: string;
  explorerLink: string;
  axelarscanLink?: string;
}

export interface TxHistoryItem {
  route: RouteResponse;
  txStatus: TxStatus[];
  timestamp: string;
  status: 'pending' | 'success' | 'failed';
}

export type TxHistoryItemInput = Pick<TxHistoryItem, 'route'>;

export type TxHistoryState = Record<string, TxHistoryItem>;

const defaultValues: TxHistoryState = {};

export const useTxHistory = create(
  persist(() => defaultValues, {
    name: 'TxHistoryState',
    version: 3,
  })
);

export const txHistory = {
  add: (input: TxHistoryItemInput) => {
    const id = randomId();

    const newItem: TxHistoryItem = {
      txStatus: [],
      timestamp: new Date().toISOString(),
      status: 'pending',
      ...input,
    };

    useTxHistory.setState({ [id]: newItem });

    return [id, newItem] as const;
  },
  update: (id: string, input: Partial<TxHistoryItem>) => {
    useTxHistory.setState((state) => {
      const current = state[id];

      const latest: TxHistoryItem = {
        ...current,
        ...input,
      };

      return { [id]: latest };
    });
  },
  success: (id: string) => {
    useTxHistory.setState((state) => {
      const current = state[id];
      if (!current) return state;

      const latest: TxHistoryItem = {
        ...current,
        status: 'success',
      };

      return { [id]: latest };
    });
  },
  fail: (id: string) => {
    useTxHistory.setState((state) => {
      const current = state[id];
      if (!current) return state;

      const latest: TxHistoryItem = {
        ...current,
        status: 'failed',
      };

      return { [id]: latest };
    });
  },
  remove: (id: string) => {
    useTxHistory.setState((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...newState } = state;
      return newState;
    }, true);
  },
  addStatus: (id: string, route: RouteResponse, txStatus: TxStatus) => {
    useTxHistory.setState((state) => {
      const current = state[id];
      if (!current) {
        const newItem: TxHistoryItem = {
          txStatus: [txStatus],
          timestamp: new Date().toISOString(),
          status: 'pending',
          route,
        };

        return { [id]: newItem };
      }

      const newTxStatus = current.txStatus.concat(txStatus);

      const latest: TxHistoryItem = {
        ...current,
        txStatus: newTxStatus,
      };

      return { [id]: latest };
    });
  },
  updateStatus: (id: string, txStatus: TxStatus) => {
    useTxHistory.setState((state) => {
      const current = state[id];
      if (!current) return state;

      const newTxStatus = current.txStatus.map((item) => {
        if (item.txHash === txStatus.txHash) {
          return txStatus;
        }
        return item;
      });

      const latest: TxHistoryItem = {
        ...current,
        txStatus: newTxStatus,
      };

      return { [id]: latest };
    });
  },
  clear: () => {
    useTxHistory.setState({}, true);
  },
};
