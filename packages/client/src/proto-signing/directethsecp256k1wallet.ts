// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/proto-signing/directethsecp256k1wallet.ts

import { Secp256k1, keccak256 } from "@cosmjs/crypto";
import { toBech32 } from "@cosmjs/encoding";
import { DirectSignResponse, makeSignBytes } from "@cosmjs/proto-signing";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { AccountData, OfflineDirectSigner } from "./signer";
import { rawEthSecp256k1PubkeyToRawAddress } from "../amino/addresses";
import { encodeEthSecp256k1Signature } from "../amino/signature";

/**
 * A wallet that holds a single eth_secp256k1 keypair.
 *
 * If you want to work with BIP39 mnemonics and multiple accounts, use DirectEthSecp256k1HdWallet.
 */
export class DirectEthSecp256k1Wallet implements OfflineDirectSigner {
  /**
   * Creates a DirectEthSecp256k1Wallet from the given private key
   *
   * @param privkey The private key.
   * @param prefix The bech32 address prefix (human-readable part). Defaults to "mer".
   */
  public static async fromKey(
    privkey: Uint8Array,
    prefix = "mer",
  ): Promise<DirectEthSecp256k1Wallet> {
    const uncompressed = (await Secp256k1.makeKeypair(privkey)).pubkey;
    return new DirectEthSecp256k1Wallet(
      privkey,
      Secp256k1.compressPubkey(uncompressed),
      prefix,
    );
  }

  private readonly pubkey: Uint8Array;
  private readonly privkey: Uint8Array;
  private readonly prefix: string;

  private constructor(privkey: Uint8Array, pubkey: Uint8Array, prefix: string) {
    this.privkey = privkey;
    this.pubkey = pubkey;
    this.prefix = prefix;
  }

  private get address(): string {
    const uncompressed = Secp256k1.uncompressPubkey(this.pubkey);
    return toBech32(
      this.prefix,
      rawEthSecp256k1PubkeyToRawAddress(uncompressed),
    );
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    return [
      {
        algo: "eth_secp256k1",
        address: this.address,
        pubkey: this.pubkey,
      },
    ];
  }

  public async signDirect(
    address: string,
    signDoc: SignDoc,
  ): Promise<DirectSignResponse> {
    const signBytes = makeSignBytes(signDoc);
    if (address !== this.address) {
      throw new Error(`Address ${address} not found in wallet`);
    }
    const hashedMessage = keccak256(signBytes);
    const signature = await Secp256k1.createSignature(
      hashedMessage,
      this.privkey,
    );
    const signatureBytes = new Uint8Array([
      ...signature.r(32),
      ...signature.s(32),
    ]);
    const stdSignature = encodeEthSecp256k1Signature(
      this.pubkey,
      signatureBytes,
    );
    return {
      signed: signDoc,
      signature: stdSignature,
    };
  }
}
