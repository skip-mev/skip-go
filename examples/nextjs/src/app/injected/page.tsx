'use client';

import React, { useState } from "react";
import { Widget } from "@skip-go/widget";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { createWalletClient, custom, Account } from "viem";
import { mainnet, optimism, polygon, base, arbitrum, avalanche } from 'viem/chains';

type ChainId = string;
type Address = string;

export default function Home() {
  // This state holds a mapping from chain IDs to connected addresses.
  const [connectedAddresses, setConnectedAddresses] = useState<Record<ChainId, Address>>();

  /**
   * Helper to update the connectedAddresses with a given chainId and address.
   */
  const updateAccount = (chainId: ChainId, address: Address) => {
    setConnectedAddresses((prev) => ({
      ...prev,
      [chainId]: address,
    }));
  };

  /**
   * Connect to an EVM-compatible wallet (e.g., MetaMask).
   */
  const connectEthereum = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      throw new Error("MetaMask not installed");
    }

    // Request accounts
    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    const evmAddress = accounts[0];
    if (!evmAddress) throw new Error("No EVM accounts found");

    // Get currently selected chain ID from MetaMask
    const chainIdHex = (await ethereum.request({ method: 'eth_chainId' })) as string;
    const chainId = parseInt(chainIdHex, 16).toString();

    updateAccount(chainId, evmAddress);
  };

  /**
   * Connect to a Solana wallet using Phantom Wallet Adapter.
   */
  const connectSolana = async () => {
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
    const chainIds = ["cosmoshub-4", "osmosis-1", "elys-1"];

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
    if (window.keplr?.getOfflineSigner === undefined) {
      throw new Error("Keplr extension not installed");
    }
    const offlineSigner = await window.keplr?.getOfflineSigner(chainId);
    return offlineSigner;
  }

  /**
   * Get an EVM-compatible signer by creating a viem wallet client.
   */
  const chainConfigMap: Record<string, any> = {
    "1": mainnet,
    "10": optimism,
    "137": polygon,
    "8453": base,
    "42161": arbitrum,
    "43114": avalanche,
  };

  const getEvmSigner = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      throw new Error("MetaMask not installed");
    }

    // Request accounts
    const accounts = (await ethereum.request({
      method: "eth_requestAccounts",
    })) as Account[];

    const evmAddress = accounts?.[0];
    if (!evmAddress) {
      throw new Error("No EVM accounts found");
    }

    // Get the currently selected chain ID
    const chainIdHex = (await ethereum.request({ method: 'eth_chainId' })) as string;
    const chainId = parseInt(chainIdHex, 16).toString();

    const selectedChain = chainConfigMap[chainId] ?? mainnet;

    const client = createWalletClient({
      account: evmAddress,
      chain: selectedChain,
      transport: custom(ethereum),
    });

    return client;
  };

  /**
   * Get an SVM-compatible signer using Phantom.
   */
  const getSvmSigner = async () => {
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
        {Object.entries(connectedAddresses ?? {}).map(([chainId, address]) => (
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
        <button onClick={connectEthereum}>Connect Ethereum</button>
        <button onClick={connectSolana}>Connect Solana</button>
      </div>
      <Widget
        // Provide the connected addresses and signer retrieval functions to the Widget
        connectedAddresses={connectedAddresses}
        getCosmosSigner={getCosmosSigner}
        getEvmSigner={getEvmSigner}
        getSvmSigner={getSvmSigner}
      />
    </div>
  );
}
