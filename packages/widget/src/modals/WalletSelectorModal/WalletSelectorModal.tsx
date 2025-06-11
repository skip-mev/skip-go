import { createModal, ModalProps } from "@/components/Modal";
import { RenderWalletList } from "@/components/RenderWalletList";
import { useWalletList } from "@/hooks/useWalletList";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { usePrimaryChainIdForChainType } from "@/hooks/usePrimaryChainIdForChainType";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { useGetAccount } from "@/hooks/useGetAccount";
import { Column, Row } from "@/components/Layout";
import { sourceAssetAtom } from "@/state/swapPage";
import { EcosystemConnectors } from "@/modals/ConnectedWalletModal/EcosystemConnectors";
import { ChainType } from "@skip-go/client";
import { useCroppedImage } from "@/hooks/useCroppedImage";
import { SkeletonElement } from "@/components/Skeleton";

export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
  chainType?: ChainType;
  fromConnectedWalletModal?: boolean;
};

export const WalletSelectorModal = createModal((modalProps: WalletSelectorModalProps) => {
  const { chainId, chainType, fromConnectedWalletModal } = modalProps;
  const { data: chains } = useAtomValue(skipChainsAtom);
  const walletList = useWalletList({ chainId, chainType });
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainId);

  const sourceAssetChain = chains?.find((chain) => {
    return chain.chainId === sourceAsset?.chainId;
  });

  const [selectedEco, setSelectedEco] = useState<ChainType | undefined>(
    chainType ?? sourceAssetChain?.chainType,
  );

  const primaryChainIdForChainType = usePrimaryChainIdForChainType();

  const selectedEcoChain = chains?.find((chain) => {
    if (selectedEco) {
      return chain.chainId === primaryChainIdForChainType[selectedEco];
    }
  });

  const showOtherEcosytems = !sourceAccount && selectedEco === sourceAssetChain?.chainType;

  const sourceAssetChainType = useMemo(() => {
    return chains?.find((chain) => chain.chainId === sourceAsset?.chainId)?.chainType;
  }, [chains, sourceAsset?.chainId]);

  const handleOnClickBackButton = () => {
    NiceModal.remove(Modals.WalletSelectorModal);
    if (fromConnectedWalletModal) {
      NiceModal.show(Modals.ConnectedWalletModal);
    } else if (!showOtherEcosytems) {
      setSelectedEco(sourceAssetChain?.chainType);
      NiceModal.show(Modals.WalletSelectorModal, {
        chainId: sourceAssetChain?.chainId,
      });
    }
  };

  const title = useMemo(() => {
    switch (selectedEcoChain?.chainType ?? sourceAssetChain?.chainType) {
      case ChainType.Cosmos:
        return "Connect cosmos wallet";
      case ChainType.Evm:
        return "Connect ethereum wallet";
      case ChainType.Svm:
        return "Connect solana Wallet";
      default:
        return "Connect wallet";
    }
  }, [selectedEcoChain?.chainType, sourceAssetChain?.chainType]);

  const walletIcon = useCroppedImage(selectedEcoChain?.logoUri ?? sourceAssetChain?.logoUri);

  return (
    <RenderWalletList
      title={title}
      walletList={walletList}
      onClickBackButton={handleOnClickBackButton}
      isConnectEco={fromConnectedWalletModal}
      chainId={chainId}
      headerRightContent={
        <StyledChainLogoContainerRow align="center" justify="center">
          {walletIcon ? (
            <img width="25px" height="25px" src={walletIcon} />
          ) : (
            <SkeletonElement width={25} height={25} />
          )}
        </StyledChainLogoContainerRow>
      }
      bottomContent={
        showOtherEcosytems && (
          <Column
            style={{
              marginTop: "-5px",
            }}
          >
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
  background-color: ${({ theme }) => theme.secondary.background.transparent};
  margin: 10px;
`;

const StyledChainLogoContainerRow = styled(Row)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.secondary.background.normal};
`;
