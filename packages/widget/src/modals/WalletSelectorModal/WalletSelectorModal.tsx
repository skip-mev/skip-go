import { createModal, ModalProps } from "@/components/Modal";
import {
  StyledModalContainer,
  StyledModalInnerContainer,
} from "@/components/ModalHeader";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { useWalletList } from "@/hooks/useWalletList";
import { MinimalWallet } from "@/state/wallets";
import { ClientAsset, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import styled from "styled-components";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { ChainType } from "@skip-go/client";
import { track } from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";

import { EcosystemConnectors } from "@/components/EcosystemConnectors";
import {
  isManualWalletEntry,
  isMinimalWallet,
  ManualWalletEntry,
  RenderWalletList,
} from "@/components/RenderWalletList";


const StyledDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.primary.text.ultraLowContrast};
  margin: 10px 0;
`;


export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
  chainType?: ChainType;
  connectEco?: boolean;
  sourceAsset?: ClientAsset | null;
  showPriorityView?: boolean;
};

export const WalletSelectorModal = createModal((modalProps: WalletSelectorModalProps) => {
  const { chainId, chainType, connectEco, sourceAsset, showPriorityView } = modalProps;
  const { data: chains } = useAtomValue(skipChainsAtom);
  const { chainImage, chainName } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });
  const requiredChainType = useMemo(() => {
    if (!showPriorityView || !sourceAsset?.chainID || !chains) return undefined;
    return chains.find((c) => c.chainID === sourceAsset.chainID)?.chainType;
  }, [chains, sourceAsset?.chainID, showPriorityView]);

  const targetChainType = showPriorityView ? requiredChainType : chainType;
  const targetChainId = showPriorityView ? sourceAsset?.chainID : chainId;

  const walletList = useWalletList({ chainID: targetChainId, chainType: targetChainType });

  const displayWalletsForPriority = useMemo((): (MinimalWallet | ManualWalletEntry)[] => {
    if (!showPriorityView) return [];
    return walletList.filter(
      (wallet) => isManualWalletEntry(wallet) || wallet?.isAvailable !== false,
    );
  }, [walletList, showPriorityView]);

  const connectMutation = useMutation({
    mutationKey: ["connectPriorityWallet"],
    mutationFn: async (wallet: MinimalWallet) => {

      return await wallet.connect(showPriorityView ? sourceAsset?.chainID : targetChainId);
    },
    onSuccess: () => {
      NiceModal.remove(Modals.WalletSelectorModal);
    },
  });

  const handleOnClickBackButton = () => {
    if (showPriorityView && (connectMutation.isPending || connectMutation.isError)) {
      connectMutation.reset();
      return;
    }

    NiceModal.remove(Modals.WalletSelectorModal);
    if (connectEco && !showPriorityView) {
      NiceModal.show(Modals.ConnectedWalletModal);
    }
  };


  if (showPriorityView) {
    const priorityTitle = `Connect ${
      requiredChainType === ChainType.Cosmos
        ? "Cosmos"
        : requiredChainType === ChainType.EVM
          ? "Ethereum"
          : requiredChainType === ChainType.SVM
            ? "Solana"
            : "" 
    } Wallet`;

    const connectionState = {
      isPending: connectMutation.isPending,
      isError: connectMutation.isError,
      error: connectMutation.error,
      variables: connectMutation.variables,
    };

    const handleItemClick = (wallet: MinimalWallet | ManualWalletEntry) => {
      if (isMinimalWallet(wallet)) {
        track("wallet selector modal: connect required wallet - clicked", {
          wallet: wallet.walletPrettyName ?? wallet.walletName,
          chainType: requiredChainType,
        });
      }
    };

    const renderHeaderRightContent = () => {
      return sourceAsset?.chainID ? (
        <img src={chainImage} height={36} width={36} title={chainName} />
      ) : null;
    };

    return (
      <StyledModalContainer gap={15}>
        <RenderWalletList
          title={priorityTitle}
          walletList={displayWalletsForPriority}
          onClickBackButton={handleOnClickBackButton}
          connectFn={connectMutation.mutate}
          connectionState={connectionState}
          headerRightContent={renderHeaderRightContent}
          onItemClick={handleItemClick}
        />
        {requiredChainType ? (
          <StyledModalInnerContainer style={{ paddingTop: 0 }}>
            <StyledDivider />
            <EcosystemConnectors excludeChainType={requiredChainType} />
          </StyledModalInnerContainer>
        ) : null}
      </StyledModalContainer>
    );
  } else {
    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={walletList}
        onClickBackButton={handleOnClickBackButton}
        isConnectEco={connectEco}
        chainId={chainId}
      />
    );
  }
});
