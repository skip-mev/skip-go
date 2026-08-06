import { Transaction, VersionedTransaction } from "@solana/web3.js";
import type { Connection } from "@solana/web3.js";

export function deserializeSvmTransaction(
  txBuffer: Buffer,
): Transaction | VersionedTransaction {
  const probe = VersionedTransaction.deserialize(txBuffer);
  if (probe.version === "legacy") {
    return Transaction.from(txBuffer);
  }
  return probe;
}

function isVersionedTransaction(
  tx: Transaction | VersionedTransaction,
): tx is VersionedTransaction {
  return "version" in tx;
}

export function serializeSvmMessage(
  tx: Transaction | VersionedTransaction,
): Uint8Array {
  return isVersionedTransaction(tx) ? tx.message.serialize() : tx.serializeMessage();
}

export function simulateSvmTransaction(
  connection: Connection,
  tx: Transaction | VersionedTransaction,
) {
  return isVersionedTransaction(tx)
    ? connection.simulateTransaction(tx)
    : connection.simulateTransaction(tx);
}
