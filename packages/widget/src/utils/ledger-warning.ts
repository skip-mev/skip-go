import { RouteResponse } from '@skip-router/core';
import {
  knownBrokenCCTPLedgerChainIds,
  knownEthermintLedgerChainIds,
} from '../constants/ledger-warning';

export const isCCTPLedgerBrokenInOperation = (route: RouteResponse) => {
  return route.operations.some(
    (operation) =>
      'cctpTransfer' in operation &&
      knownBrokenCCTPLedgerChainIds.includes(operation.cctpTransfer.fromChainID)
  );
};

export const isEthermintLedgerInOperation = (route: RouteResponse) => {
  return (
    route.operations.some(
      (operation) =>
        'transfer' in operation &&
        knownEthermintLedgerChainIds.includes(operation.transfer.chainID)
    ) ||
    route.operations.some(
      (operation) =>
        'axelarTransfer' in operation &&
        knownEthermintLedgerChainIds.includes(
          operation.axelarTransfer.fromChainID
        )
    )
  );
};
