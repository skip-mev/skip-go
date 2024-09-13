import { seiPrecompileAddrABI } from "@/constants/abis";
import { evmWalletAtom, MinimalWallet } from "@/state/wallets";
import { useSetAtom } from "jotai";
import { useCallback, } from "react";
import { createPublicClient, http } from "viem";
import { sei } from "viem/chains";
import { useAccount, useDisconnect, useConnect, } from "wagmi";


export const useCreateEvmWallets = () => {
  const setEvmWallet = useSetAtom(evmWalletAtom);
  const {
    connector: currentEvmConnector, address: evmAddress, isConnected: isEvmConnected, chainId
  } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connectors, connectAsync } = useConnect();

  const createEvmWallets = useCallback((chainID: string) => {
    const isSei = chainID === "pacific-1";
    const wallets: MinimalWallet[] = [];
    for (const connector of connectors) {
      if (
        wallets.findIndex((wallet) => wallet.walletName === connector.id) !==
        -1
      ) {
        continue;
      }

      const evmGetAddress: MinimalWallet["getAddress"] = async ({
        signRequired,
      }) => {
        if (connector.id !== currentEvmConnector?.id) {
          await connectAsync({ connector, chainId: Number(chainID) });
          setEvmWallet({ walletName: connector.id, chainType: "evm" });
        } else if (evmAddress && isEvmConnected && signRequired) {
          setEvmWallet({ walletName: connector.id, chainType: "evm" });
        }
        return evmAddress;
      };

      const minimalWallet: MinimalWallet = {
        walletName: connector.id,
        walletPrettyName: connector.name,
        walletChainType: "evm",
        walletInfo: {
          logo: connector.icon,
        },
        connect: async () => {
          if (isEvmConnected && (chainId !== Number(chainID)) && connector.id === currentEvmConnector?.id) {
            await connector?.switchChain?.({
              chainId: Number(chainID),
            });
            return;
          }
          try {
            await connectAsync({ connector, chainId: Number(chainID) });
            setEvmWallet({ walletName: connector.id, chainType: "evm" });
            // TODO: onWalletConnected
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        getAddress: async ({ signRequired, context }) => {
          try {
            const address = await evmGetAddress({ signRequired, context });
            return address;
          } catch (error) {
            console.error(error);
          }
        },
        disconnect: async () => {
          await disconnectAsync();
          setEvmWallet(undefined);
          // TODO: onWalletDisconnected
        },
        isWalletConnected: connector.id === currentEvmConnector?.id,
      };

      if (isSei) {
        minimalWallet.getAddress = async ({ signRequired, context }) => {
          const address = await evmGetAddress({ signRequired, context });
          const publicClient = createPublicClient({
            chain: sei,
            transport: http(),
          });
          try {
            const seiAddress = await publicClient.readContract({
              args: [address as `0x${string}`],
              address: "0x0000000000000000000000000000000000001004",
              abi: seiPrecompileAddrABI,
              functionName: "getSeiAddr",
            });
            return seiAddress;
          } catch (error) {
            console.error(error);
          }
        };
      }
      wallets.push(minimalWallet);
    }
    return wallets;
  }, [chainId, connectAsync, connectors, currentEvmConnector?.id, disconnectAsync, evmAddress, isEvmConnected, setEvmWallet]);

  return { createEvmWallets };
};
