import { ClientOperation } from "./clientType";

export const getSignRequiredChainIds = (operations: ClientOperation[]) => {
  const signRequiredChains: string[] = [];
  operations.forEach((op, i, arr) => {
    const nextOperation = arr[i + 1];
    const isSignRequired = getIsOperationSignRequired(i, arr, nextOperation, op);
    if (isSignRequired && op.chainID) {
      signRequiredChains.push(op.chainID);
    }
  });
  return signRequiredChains;
};

export const getIsOperationSignRequired = (operationIndex: number, operations: ClientOperation[], nextOperation: ClientOperation, currentOperation: ClientOperation) => {
  return ((operationIndex + 1) !== operations.length) && (nextOperation?.txIndex !== currentOperation.txIndex);
};
