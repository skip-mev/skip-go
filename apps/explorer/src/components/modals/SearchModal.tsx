import { Column, Row } from "@/components/Layout";
import { ModalProps, createModal } from "@/components/Modal";
import { styled, useTheme } from "@/styled-components";
import { TxHashInput } from "../TxHashInput";
import { Modals, NiceModal } from "@/nice-modal";
import { ClientAsset, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "@/jotai";
import { ChainSelector } from "../ChainSelector";
import { useEffect, useMemo, useState } from "react";
import { SearchButton } from "../SearchButton";
import { Logo } from "../Navbar";
import { XIcon } from "@/icons/XIcon";
import { ExplorerModals } from "../../constants/modal";

export type SearchModalProps = ModalProps & {
  txHash?: string;
  chainId?: string;
  onSearch: (txHash?: string, chainId?: string) => void;
  setTxHash: (txHash: string) => void;
  setChainId: (chainId: string) => void;
}

export const SearchModal = createModal(
  (modalProps: SearchModalProps) => {
    const theme = useTheme();
    const { txHash: initialTxHash, chainId: initialChainId, onSearch, setTxHash, setChainId } = modalProps;

    const [localTxHash, setLocalTxHash] = useState(initialTxHash || "");
    const [localChainId, setLocalChainId] = useState(initialChainId || "");

    const chains = useAtomValue(skipChainsAtom);

    useEffect(() => {
      setLocalTxHash(initialTxHash || "");
      setLocalChainId(initialChainId || "");
    }, [initialTxHash, initialChainId]);
  
    const selectedChain = useMemo(() => {
      if (!localChainId) return null;
      return chains.data?.find((chain) => chain.chainId === localChainId) || null;
    }, [chains.data, localChainId]);

    const handleTxHashChange = (v: string) => {
      setLocalTxHash(v);
      setTxHash(v);
    };

    const handleChainIdChange = (chainId: string) => {
      setLocalChainId(chainId);
      setChainId(chainId);
    };

    return (
      <ModalContainer onClick={() => {
        NiceModal.hide(ExplorerModals.SearchModal);
      }}>
        <Column gap={8} onClick={(e) => e.stopPropagation()}>
          <Row justify="space-between">
            <Logo />
            <CloseIconContainer onClick={() => NiceModal.hide(ExplorerModals.SearchModal)}>
              <XIcon width={14} height={14} color={theme.primary.text.lowContrast} />
            </CloseIconContainer>
          </Row>
          <TxHashInput
            size="small"
            value={localTxHash}
            onChange={handleTxHashChange}
            openModal={() => {
              NiceModal.show(Modals.AssetAndChainSelectorModal, {
                context: "source",
                onSelect: (asset: ClientAsset | null) => {
                  handleChainIdChange(asset?.chainId || "");

                  onSearch(localTxHash, asset?.chainId);
                  NiceModal.hide(Modals.AssetAndChainSelectorModal);
                },
                onlySelectChain: true,
                selectChain: true,
              });
            }}
          />
          <ChainSelector
            size="small"
            onClick={() => {
              NiceModal.show(Modals.AssetAndChainSelectorModal, {
                context: "source",
                onSelect: (asset: ClientAsset | null) => {
                  handleChainIdChange(asset?.chainId || "");
                  NiceModal.hide(Modals.AssetAndChainSelectorModal);
                },
                onlySelectChain: true,
                selectChain: true,
              });
            }}
            selectedChain={selectedChain}
          />
          <SearchButton size="small" onClick={() => {
            onSearch(localTxHash, localChainId);
            NiceModal.hide(ExplorerModals.SearchModal);
          }} isSearchable={!!localTxHash && !!localChainId} />
        </Column>
      </ModalContainer>
    );
  }
);

export const CloseIconContainer = styled(Row)`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.primary.background.normal};
  border-radius: 12px;
  cursor: pointer;
`;

const ModalContainer = styled(Column)`
  height: 100vh;
  width: 100%;
  padding: 30px 20px;
`;

