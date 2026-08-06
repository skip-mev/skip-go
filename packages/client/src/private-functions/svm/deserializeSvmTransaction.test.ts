import {
  AddressLookupTableAccount,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { describe, expect, it } from "vitest";
import {
  deserializeSvmTransaction,
  isVersionedTransaction,
} from "./deserializeSvmTransaction";

// The version marker lives on the *message* (after the signature array), not
// on byte 0 of the transaction as a whole — that byte is the signature count,
// which is small enough to never set the discriminating bit for either
// format. Fixtures below always go through a real `.serialize()` (full wire:
// signatures + message), not `.serializeMessage()`/`compileMessage()` alone,
// so this actually exercises the same bytes solve puts on the wire rather
// than a message-only fragment `Transaction.from` was never meant to parse.
describe("deserializeSvmTransaction", () => {
  it("decodes a legacy transaction as Transaction, not VersionedTransaction", () => {
    const payer = Keypair.generate();
    const legacy = new Transaction({
      feePayer: payer.publicKey,
      recentBlockhash: PublicKey.default.toBase58(),
    }).add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1,
      })
    );
    // Unsigned: solve hands back an unsigned tx for the wallet to sign, so
    // the fixture should look like that, not a fully-signed one.
    const wire = legacy.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    const decoded = deserializeSvmTransaction(wire);
    expect(isVersionedTransaction(decoded)).toBe(false);
    expect(decoded).toBeInstanceOf(Transaction);
  });

  it("decodes a v0 transaction (with an Address Lookup Table) as VersionedTransaction", () => {
    const payer = Keypair.generate();
    const altAddress = Keypair.generate().publicKey;
    const lookedUpKey = Keypair.generate().publicKey;

    const lookupTableAccount = new AddressLookupTableAccount({
      key: altAddress,
      state: {
        deactivationSlot: BigInt(Number.MAX_SAFE_INTEGER),
        lastExtendedSlot: 0,
        lastExtendedSlotStartIndex: 0,
        authority: payer.publicKey,
        addresses: [lookedUpKey],
      },
    });

    const message = new TransactionMessage({
      payerKey: payer.publicKey,
      recentBlockhash: PublicKey.default.toBase58(),
      instructions: [
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: lookedUpKey,
          lamports: 1,
        }),
      ],
    }).compileToV0Message([lookupTableAccount]);

    // Unsigned VersionedTransaction: signatures default to all-zero
    // placeholders, matching what solve hands back for the wallet to sign.
    const versioned = new VersionedTransaction(message);
    const wire = Buffer.from(versioned.serialize());

    const decoded = deserializeSvmTransaction(wire);
    expect(isVersionedTransaction(decoded)).toBe(true);
    expect(decoded).toBeInstanceOf(VersionedTransaction);

    // The whole point of the ALT: the looked-up key must NOT appear among
    // the message's static (inline, 32-byte) account keys — it's meant to
    // be resolved from the table at execution time instead.
    if (isVersionedTransaction(decoded)) {
      const staticKeys = decoded.message.staticAccountKeys.map((k) =>
        k.toBase58()
      );
      expect(staticKeys).not.toContain(lookedUpKey.toBase58());
      expect(decoded.message.addressTableLookups).toHaveLength(1);
    }
  });

  it("round-trips a v0 transaction's message bytes the same way signSvmTransaction extracts them for the fee payer", () => {
    const payer = Keypair.generate();
    const message = new TransactionMessage({
      payerKey: payer.publicKey,
      recentBlockhash: PublicKey.default.toBase58(),
      instructions: [
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 1,
        }),
      ],
    }).compileToV0Message();

    const versioned = new VersionedTransaction(message);
    const decoded = deserializeSvmTransaction(Buffer.from(versioned.serialize()));

    expect(isVersionedTransaction(decoded)).toBe(true);
    if (isVersionedTransaction(decoded)) {
      // This is exactly what signSvmTransaction.ts does for the versioned
      // branch: `transaction.message.serialize()`. It must succeed and
      // produce bytes distinct from the fully-serialized (signed) tx, since
      // it's the unsigned message body only.
      const messageBytes = decoded.message.serialize();
      expect(messageBytes.length).toBeGreaterThan(0);
      expect(messageBytes.length).toBeLessThan(decoded.serialize().length);
    }
  });

  it("a legacy fixture built the old (wrong) way — message bytes only, no signature prefix — does NOT decode as itself", () => {
    // Regression guard for the bug this suite caught during development:
    // `compileMessage().serialize()` produces message-only bytes with no
    // outer signature-count prefix. Feeding that to deserializeSvmTransaction
    // must not silently succeed and look like a normal legacy tx — either it
    // throws, or it corrupts the parse in some detectable way. What must
    // never happen is this masquerading as a valid decode of a real wire
    // transaction, which is what motivated switching the other fixtures to
    // full `.serialize()`.
    const payer = Keypair.generate();
    const legacy = new Transaction({
      feePayer: payer.publicKey,
      recentBlockhash: PublicKey.default.toBase58(),
    }).add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: new PublicKey(
          Uint8Array.from({ length: 32 }, (_, index) =>
            index === 29 ? 0x81 : 0
          )
        ),
        lamports: 1,
      })
    );
    const messageOnly = legacy.compileMessage().serialize();

    expect(() => deserializeSvmTransaction(messageOnly)).toThrow();
  });
});
