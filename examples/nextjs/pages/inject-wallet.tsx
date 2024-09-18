import { SwapWidget } from '@skip-go/widget';
import {
  getWallet,
  GrazProvider,
  useAccount as useCosmosAccount,
  useConnect as useCosmosConnect,
  useDisconnect as useCosmosDisconnect,
  WalletType,
} from 'graz';
import { NextPage } from 'next';
import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { chains, assets } from 'chain-registry';
import {
  Config,
  createConfig,
  http,
  useAccount as useEVMAccount,
  useConnect as useEVMConnect,
  WagmiProvider,
} from 'wagmi';
import { mainnet } from 'viem/chains';
import { metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { useEffect, useState } from 'react';
import { WalletClient } from 'viem';
import { getWalletClient } from '@wagmi/core';

const App = () => {
  const { connect: connectCosmos } = useCosmosConnect();
  const { data, isConnected, walletType } = useCosmosAccount({
    chainId: 'cosmoshub-4',
  });
  const { disconnect: disconnectCosmos } = useCosmosDisconnect();

  const { address, connector } = useEVMAccount();
  const { connect: connectEVM } = useEVMConnect();

  const [solanaAddress, setSolanaAddress] = useState<string>();

  const solanaWallet = new PhantomWalletAdapter();
  console.log(solanaWallet.readyState);
  useEffect(() => {
    solanaWallet.addListener('connect', (v) => {
      console.log(v);
      setSolanaAddress(v?.toBase58());
    });
  }, [solanaWallet]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
      }}
    >
      <div
        style={{
          width: '450px',
          height: '820px',
          flexShrink: 0,
        }}
      >
        <SwapWidget
          filter={{
            source: {
              'cosmoshub-4': undefined,
              solana: undefined,
              1: undefined,
            },
          }}
          connectedWallet={{
            cosmos: {
              getAddress: async (chainID) => {
                const cosmosWallet = getWallet(walletType);
                await cosmosWallet.enable(chainID);
                const key = await cosmosWallet.getKey(chainID);
                return key.bech32Address;
              },
              getSigner: async (chainID) => {
                const cosmosWallet = getWallet(walletType);
                return cosmosWallet.getOfflineSigner(chainID);
              },
            },
            evm: {
              getAddress: async (chainID) => {
                const accounts = await connector?.getAccounts();
                if (!accounts) throw new Error('No EVM accounts found');
                return accounts?.[0];
              },
              getSigner: async (chainID) => {
                const evmWalletClient = (await getWalletClient(config, {
                  chainId: parseInt(chainID),
                })) as WalletClient;
                if (!evmWalletClient)
                  throw new Error('No EVM wallet client found');
                return evmWalletClient;
              },
            },
            svm: {
              getAddress: async () => {
                if (!solanaAddress) throw new Error('No Solana address found');
                await solanaWallet.connect();
                return solanaAddress;
              },
              getSigner: async () => {
                await solanaWallet.connect();
                return solanaWallet;
              },
            },
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div
          style={{
            border: '1px solid black',
            padding: '8px',
            backgroundColor: 'white',
          }}
        >
          <p
            style={{
              color: 'black',
            }}
          >
            {isConnected
              ? ` ${data?.bech32Address} Connected to cosmoshub-4 with ${walletType}`
              : 'Not connected to Cosmoshub'}
          </p>
          <button
            onClick={() => {
              connectCosmos({
                chainId: 'cosmoshub-4',
                walletType: WalletType.KEPLR,
              });
            }}
          >
            Connect Cosmoshub with keplr
          </button>
          <button
            onClick={() => {
              disconnectCosmos();
            }}
          >
            Disconnect
          </button>
        </div>
        <div
          style={{
            border: '1px solid black',
            padding: '8px',
            backgroundColor: 'white',
          }}
        >
          <p
            style={{
              color: 'black',
            }}
          >
            {address
              ? ` ${address} Connected to Ethereum with ${connector?.name}`
              : 'Not connected to Ethereum'}
          </p>
          <button
            onClick={() => {
              connectEVM({
                chainId: 1,
                connector: metaMask({
                  dappMetadata: {
                    name: 'Skip Go example',
                  },
                  extensionOnly: true,
                }),
              });
            }}
          >
            Connect Ethereum with metamask
          </button>
          <button
            onClick={() => {
              connector?.disconnect();
            }}
          >
            Disconnect
          </button>
        </div>

        <div
          style={{
            border: '1px solid black',
            padding: '8px',
            backgroundColor: 'white',
          }}
        >
          <p
            style={{
              color: 'black',
            }}
          >
            {solanaAddress
              ? ` ${solanaAddress} Connected to Solana with ${solanaWallet?.name}`
              : 'Not connected to Solana'}
          </p>
          <button
            onClick={() => {
              solanaWallet.connect();
            }}
          >
            Connect Solana with Phantom
          </button>
          <button
            onClick={() => {
              solanaWallet.disconnect();
              setSolanaAddress(undefined);
            }}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

const chainInfos = chains
  .filter((i) => i.chain_id === 'cosmoshub-4')
  .map((chain) => chainRegistryChainToKeplr(chain, assets));

const Page: NextPage = () => {
  return (
    <WagmiProvider config={config} key={'skip-example'}>
      <QueryClientProvider client={new QueryClient()}>
        <GrazProvider
          grazOptions={{
            chains: chainInfos,
          }}
        >
          <App />
        </GrazProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const config: Config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Skip Go example',
      },
      extensionOnly: true,
    }),
  ],
});

export default Page;
