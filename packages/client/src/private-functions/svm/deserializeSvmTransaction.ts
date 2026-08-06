import { Transaction, VersionedTransaction } from "@solana/web3.js";

export function deserializeSvmTransaction(
  txBuffer: Buffer,
): Transaction | VersionedTransaction {
  const probe = VersionedTransaction.deserialize(txBuffer);
  if (probe.version === "legacy") {
    return Transaction.from(txBuffer);
  }
  return probe;
}

export function isVersionedTransaction(
  tx: Transaction | VersionedTransaction,
): tx is VersionedTransaction {
  return "version" in tx;
}
