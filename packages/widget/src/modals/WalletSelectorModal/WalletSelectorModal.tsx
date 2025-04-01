import { createModal, ModalProps } from "@/components/Modal";
import { RenderWalletList } from "@/components/RenderWalletList";
import { useWalletList } from "@/hooks/useWalletList";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { ChainType } from "@skip-go/client";
import { usePrimaryChainIdForChainType } from "@/hooks/usePrimaryChainIdForChainType";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { useGetAccount } from "@/hooks/useGetAccount";
import { Column, Row } from "@/components/Layout";
import { useUpdateSourceAssetToDefaultForChainType } from "@/hooks/useUpdateSourceAssetToDefaultForChainType";
import { MinimalWallet } from "@/state/wallets";
import { sourceAssetAtom } from "@/state/swapPage";
import { EcosystemConnectors } from "@/modals/ConnectedWalletModal/EcosystemConnectors";

export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
  chainType?: ChainType;
  connectedWalletModal?: boolean;
};

export const WalletSelectorModal = createModal((modalProps: WalletSelectorModalProps) => {
  const { chainId, chainType, connectedWalletModal } = modalProps;
  const { data: chains } = useAtomValue(skipChainsAtom);

  const walletList = useWalletList({ chainID: chainId, chainType });

  const sourceAsset = useAtomValue(sourceAssetAtom);
  const sourceAssetChain = chains?.find((chain) => {
    return chain.chainID === sourceAsset?.chainID;
  });

  const [selectedEco, setSelectedEco] = useState<ChainType | undefined>(
    chainType ?? sourceAssetChain?.chainType,
  );

  const primaryChainIdForChainType = usePrimaryChainIdForChainType();

  const selectedEcoChain = chains?.find((chain) => {
    if (selectedEco) {
      return chain.chainID === primaryChainIdForChainType[selectedEco];
    }
  });

  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainID);

  const setSourceAsset = useUpdateSourceAssetToDefaultForChainType();

  const showOtherEcosytems = !sourceAccount && selectedEco === sourceAssetChain?.chainType;

  const sourceAssetChainType = useMemo(() => {
    return chains?.find((chain) => chain.chainID === sourceAsset?.chainID)?.chainType;
  }, [chains, sourceAsset?.chainID]);

  const handleOnClickBackButton = () => {
    NiceModal.remove(Modals.WalletSelectorModal);
    if (connectedWalletModal) {
      NiceModal.show(Modals.ConnectedWalletModal);
    } else if (selectedEco) {
      setSelectedEco(sourceAssetChain?.chainType);
      NiceModal.show(Modals.WalletSelectorModal, {
        chainId: sourceAssetChain?.chainID,
      });
    }
  };

  const onWalletConnected = (wallet?: MinimalWallet) => {
    if (wallet?.walletChainType) {
      setSourceAsset(wallet.walletChainType);
    }
  };

  const title = useMemo(() => {
    switch (selectedEcoChain?.chainType ?? sourceAssetChain?.chainType) {
      case ChainType.Cosmos:
        return "Connect cosmos wallet";
      case ChainType.EVM:
        return "Connect ethereum wallet";
      case ChainType.SVM:
        return "Connect solana Wallet";
      default:
        return "Connect wallet";
    }
  }, [selectedEcoChain?.chainType, sourceAssetChain?.chainType]);

  return (
    <RenderWalletList
      title={title}
      walletList={walletList}
      onClickBackButton={handleOnClickBackButton}
      isConnectEco={connectedWalletModal}
      chainId={chainId}
      onWalletConnected={onWalletConnected}
      headerRightContent={
        <StyledChainLogoContainerRow align="center" justify="center">
          <img
            width="25px"
            height="25px"
            src={selectedEcoChain?.logoURI ?? sourceAssetChain?.logoURI}
          />
        </StyledChainLogoContainerRow>
      }
      bottomContent={
        showOtherEcosytems && (
          <Column>
            <StyledDivider />
            <EcosystemConnectors excludeChainType={sourceAssetChainType} onClick={setSelectedEco} />
          </Column>
        )
      }
    />
  );
});

const StyledDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.primary.text.ultraLowContrast};
  margin: 10px;
`;

const StyledChainLogoContainerRow = styled(Row)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.secondary.background.normal};
`;
