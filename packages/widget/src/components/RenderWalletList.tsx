import { useCallback, useMemo } from "react";
import { styled, useTheme } from "styled-components";
import { Row, Column } from "@/components/Layout";
import { ModalRowItem } from "./ModalRowItem";
import { VirtualList } from "./VirtualList";
import { SmallText, Text } from "@/components/Typography";
import {
  MinimalWallet,
  cosmosWalletAtom,
  evmWalletAtom,
  svmWalletAtom,
  walletsAtom,
} from "@/state/wallets";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { useMutation } from "@tanstack/react-query";
import { ModalHeader, StyledModalContainer, StyledModalInnerContainer } from "./ModalHeader";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { chainAddressesAtom } from "@/state/swapExecutionPage";
import { clearAssetInputAmountsAtom } from "@/state/swapPage";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { ChainType } from "@skip-go/client";
import { WalletSource } from "@/modals/SetAddressModal/SetAddressModal";
import { isMobile } from "@/utils/os";
import { WalletType, getWallet, useDisconnect } from "graz";
import { solanaWallets } from "@/constants/solana";
import { useConnectors } from "wagmi";

export type RenderWalletListProps = {
  title: string;
  walletList: (MinimalWallet | ManualWalletEntry)[];
  onClickBackButton: () => void;
  isDestinationAddress?: boolean;
  chainId?: string;
  chainType?: ChainType;
  isConnectEco?: boolean;
  chainAddressIndex?: number;
};

export type ManualWalletEntry = {
  walletName: string;
  onSelect: () => void;
  rightContent?: () => React.ReactNode;
};

export const isManualWalletEntry = (
  wallet: ManualWalletEntry | MinimalWallet,
): wallet is ManualWalletEntry => {
  return (wallet as ManualWalletEntry).onSelect !== undefined;
};

export const isMinimalWallet = (
  wallet: ManualWalletEntry | MinimalWallet,
): wallet is MinimalWallet => {
  return (wallet as MinimalWallet).connect !== undefined;
};

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export const RenderWalletList = ({
  title,
  walletList,
  onClickBackButton,
  isDestinationAddress,
  chainId,
  chainType,
  isConnectEco,
  chainAddressIndex,
}: RenderWalletListProps) => {
  const theme = useTheme();
  const walletAtom = useAtomValue(walletsAtom);
  const setCosmosWallet = useSetAtom(cosmosWalletAtom);
  const setEVMWallet = useSetAtom(evmWalletAtom);
  const setSVMWallet = useSetAtom(svmWalletAtom);

  const [chainAddresses, setChainAddresses] = useAtom(chainAddressesAtom);

  const displayWallets = useMemo(() => {
    const filteredWallets = walletList.filter(
      (wallet) => isManualWalletEntry(wallet) || wallet?.isAvailable !== false,
    );

    return filteredWallets.length === 1 ? walletList : filteredWallets;
  }, [walletList]);

  const clearAssetInputAmounts = useSetAtom(clearAssetInputAmountsAtom);

  const connectors = useConnectors();
  const { disconnectAsync } = useDisconnect();

  const connectMutation = useMutation({
    mutationKey: ["connectWallet"],
    mutationFn: async (wallet: MinimalWallet) => {
      if (isDestinationAddress) {
        if (!chainId || !chainType) return;
        const address = await wallet.getAddress?.({
          praxWallet: {
            sourceChainID: chainAddressIndex
              ? chainAddresses[chainAddressIndex - 1]?.chainID
              : undefined,
          },
        });
        setChainAddresses((prev) => {
          const destinationIndex = chainAddressIndex || Object.values(prev).length - 1;
          return {
            ...prev,
            [destinationIndex]: {
              chainID: chainId,
              chainType,
              address,
              source: WalletSource.Wallet,
              wallet: {
                walletName: wallet.walletName,
                walletPrettyName: wallet.walletPrettyName,
                walletChainType: wallet.walletChainType,
                walletInfo: wallet.walletInfo,
              },
            },
          };
        });
        return null;
      }
      const mobile = isMobile();
      if (mobile) {
        switch (chainType) {
          case ChainType.EVM:
            if (walletAtom.cosmos) {
              const cosmosWallet = getWallet(walletAtom.cosmos.walletName as WalletType);
              await cosmosWallet.disable?.();
              await disconnectAsync();
              setCosmosWallet(undefined);
            }
            if (walletAtom.svm) {
              const svmWallet = solanaWallets.find((x) => x.name === walletAtom.svm?.walletName);
              await svmWallet?.disconnect?.();
              setSVMWallet(undefined);
            }
            break;
          case ChainType.SVM:
            if (walletAtom.evm) {
              const evmWallet = connectors.find((x) => x.id === walletAtom.evm?.walletName);
              await evmWallet?.disconnect?.();
              setEVMWallet(undefined);
            }
            if (walletAtom.cosmos) {
              const cosmosWallet = getWallet(walletAtom.cosmos.walletName as WalletType);
              await cosmosWallet.disable?.();
              await disconnectAsync();
              setCosmosWallet(undefined);
            }
            break;
          case ChainType.Cosmos:
            if (walletAtom.evm) {
              const evmWallet = connectors.find((x) => x.id === walletAtom.evm?.walletName);
              await evmWallet?.disconnect?.();
              setEVMWallet(undefined);
            }
            if (walletAtom.svm) {
              const svmWallet = solanaWallets.find((x) => x.name === walletAtom.svm?.walletName);
              await svmWallet?.disconnect?.();
              setSVMWallet(undefined);
            }
            break;
          default:
            break;
        }
      }

      if (isConnectEco) {
        clearAssetInputAmounts();
        return await wallet.connectEco();
      }
      return await wallet.connect();
    },
    onSuccess: () => {
      if (isConnectEco) {
        clearAssetInputAmounts();
      }
      NiceModal.remove(Modals.SetAddressModal);
      NiceModal.remove(Modals.WalletSelectorModal);
    },
  });

  const renderItem = useCallback(
    (wallet: ManualWalletEntry | MinimalWallet) => {
      const name = isMinimalWallet(wallet)
        ? (wallet.walletPrettyName ?? wallet.walletName)
        : wallet.walletName;

      const imageUrl = isMinimalWallet(wallet) ? wallet?.walletInfo?.logo : undefined;
      const rightContent = isManualWalletEntry(wallet) ? wallet?.rightContent : undefined;
      const isAvailable = isMinimalWallet(wallet) ? wallet?.isAvailable : undefined;

      const renderedRightContent = rightContent?.() ?? <></>;

      const imageElement = imageUrl ? (
        <img
          height={35}
          width={35}
          style={{ objectFit: "cover" }}
          src={imageUrl}
          alt={`${name}-logo`}
        />
      ) : null;

      const onClickConnectWallet = () => {
        if (isMinimalWallet(wallet)) {
          connectMutation.mutate(wallet);
        } else {
          wallet.onSelect();
        }
      };

      const leftContent = (
        <Row style={{ width: "100%" }} align="center" justify="space-between">
          <Row align="center" gap={10}>
            {imageElement}
            <Text>{name}</Text>
          </Row>
          {isAvailable !== undefined && (
            <SmallText>{isAvailable ? "Installed" : "Not Installed"}</SmallText>
          )}
        </Row>
      );

      return (
        <ModalRowItem
          key={name}
          onClick={onClickConnectWallet}
          style={{ marginTop: ITEM_GAP }}
          leftContent={leftContent}
          rightContent={renderedRightContent}
        />
      );
    },
    [connectMutation],
  );

  const height = useMemo(() => {
    return Math.min(530, displayWallets.length * (ITEM_HEIGHT + ITEM_GAP));
  }, [displayWallets.length]);

  const renderWalletListOrWalletConnectionStatus = useMemo(() => {
    if (connectMutation.isError || connectMutation.isPending) {
      const titleText = connectMutation.isError ? "Failed to connect" : "Connecting to";
      return (
        <StyledModalInnerContainer>
          <StyledLoadingContainer>
            <StyledAnimatedBorder
              width={80}
              height={80}
              backgroundColor={theme.primary.text.normal}
              status={connectMutation.isError ? "failed" : "pending"}
              borderSize={8}
            >
              <img
                style={{ objectFit: "cover" }}
                src={connectMutation.variables?.walletInfo.logo}
                alt={`${connectMutation.variables?.walletPrettyName} logo`}
              />
            </StyledAnimatedBorder>
            <Text color={theme.primary.text.lowContrast} textAlign="center">
              {titleText} {connectMutation.variables?.walletPrettyName}
            </Text>
            {connectMutation.error && (
              <Text textAlign="center" fontSize={14} color={theme.primary.text.lowContrast}>
                {connectMutation.error.message}
              </Text>
            )}
          </StyledLoadingContainer>
        </StyledModalInnerContainer>
      );
    }

    return (
      <VirtualList
        height={height}
        listItems={displayWallets}
        itemHeight={ITEM_HEIGHT + ITEM_GAP}
        renderItem={renderItem}
        itemKey={(item) => item.walletName}
        empty={{
          header: "No wallets available",
        }}
      />
    );
  }, [
    connectMutation.error,
    connectMutation.isError,
    connectMutation.isPending,
    connectMutation.variables?.walletInfo.logo,
    connectMutation.variables?.walletPrettyName,
    height,
    renderItem,
    theme.primary.text.lowContrast,
    theme.primary.text.normal,
    displayWallets,
  ]);

  return (
    <StyledModalContainer gap={15}>
      <ModalHeader
        title={title}
        onClickBackButton={
          connectMutation.isPending || connectMutation.isError
            ? connectMutation.reset
            : onClickBackButton
        }
      />
      {renderWalletListOrWalletConnectionStatus}
    </StyledModalContainer>
  );
};

const StyledLoadingContainer = styled(Column)`
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-bottom: 10px;
  padding: 20px;
`;
