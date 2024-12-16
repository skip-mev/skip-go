'use client';

import React, { useState } from "react";
import { Widget } from "@skip-go/widget";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { createWalletClient, custom, Account } from "viem";
import { mainnet } from "viem/chains";

type ChainId = string;
type Address = string;

export default function Home() {
  // This state holds a mapping from chain IDs to connected addresses.
  const [accountMap, setAccountMap] = useState<Record<ChainId, Address>>();

  /**
   * Helper to update the accountMap with a given chainId and address.
   */
  const updateAccount = (chainId: ChainId, address: Address) => {
    setAccountMap((prev) => ({
      ...prev,
      [chainId]: address,
    }));
  };

  /**
   * Connect to an EVM-compatible wallet (e.g., MetaMask).
   */
  const connectEVM = async () => {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    const evmAddress = accounts[0];
    updateAccount("1", evmAddress);
  };

  /**
   * Connect to a Solana wallet using Phantom Wallet Adapter.
   */
  const connectSVM = async () => {
    const phantom = new PhantomWalletAdapter();
    await phantom.connect();
    const publicKey = phantom.publicKey?.toBase58();
    if (!publicKey) throw new Error("No public key found");
    updateAccount("solana", publicKey);
  };

  /**
   * Connect to Cosmos-based chains using Keplr.
   */
  const connectCosmos = async () => {
    const chainIds = ["cosmoshub-4", "osmosis-1"];

    // Request access to the specified Cosmos chains from Keplr
    await window.keplr?.enable(chainIds);

    // Fetch and store addresses for each chain
    await Promise.all(
      chainIds.map(async (chainId) => {
        const keyInfo = await window.keplr?.getKey(chainId);
        if (keyInfo && keyInfo.bech32Address) {
          updateAccount(chainId, keyInfo.bech32Address);
        }
      })
    );
  };

  /**
   * Get an offline signer for a given Cosmos chain using Keplr.
   */
  const getCosmosSigner = async (chainId: string) => {
    try {
      const offlineSigner = await window.keplr?.getOfflineSigner(chainId);
      return offlineSigner;
    } catch (error) {
      alert(`${chainId} is not connected in Keplr`);
      return undefined;
    }
  };

  /**
   * Get an EVM-compatible signer by creating a viem wallet client.
   */
  const getEVMSigner = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      throw new Error("MetaMask not installed");
    }

    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as Account[];

    const evmAddress = accounts?.[0];
    if (!evmAddress) {
      throw new Error("No EVM accounts found");
    }

    const client = createWalletClient({
      account: evmAddress as Account,
      chain: mainnet,
      transport: custom(window.ethereum),
    });

    return client;
  };

  /**
   * Get an SVM-compatible signer using Phantom.
   */
  const getSVMSigner = async () => {
    const phantom = new PhantomWalletAdapter();
    await phantom.connect();
    return phantom;
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 500,
        padding: "0 10px",
        boxSizing: "border-box",
      }}
    >
      <p>Connected addresses:</p>
      <ul>
        {Object.entries(accountMap ?? {}).map(([chainId, address]) => (
          <li key={chainId}>
            {chainId}: {address}
          </li>
        ))}
      </ul>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button onClick={connectCosmos}>Connect Cosmos</button>
        <button onClick={connectEVM}>Connect EVM</button>
        <button onClick={connectSVM}>Connect SVM</button>
        <button onClick={() => setAccountMap(undefined)}>Disconnect</button>
      </div>
      <Widget
        // Provide the connected addresses and signer retrieval functions to the Widget
        connectedAddress={accountMap}
        // @ts-ignore - ignoring TS warning if any for demonstration purposes
        getCosmosSigner={getCosmosSigner}
        getEVMSigner={getEVMSigner}
        getSVMSigner={getSVMSigner}
      />
    </div>
  );
}
