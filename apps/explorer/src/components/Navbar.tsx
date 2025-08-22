import { Row } from "@/components/Layout";
import { NiceModal, Modals } from "@/nice-modal";
import { skipChainsAtom, ClientAsset } from "@/state/skipClient";
import { uniqueAssetsBySymbolAtom } from "../state/uniqueAssetsBySymbol";
import { useAtomValue } from "@/jotai";
import { useMemo } from "react";
import { ChainSelector } from "./ChainSelector";
import { SearchButton } from "./SearchButton";
import { Logo, TopRightComponent } from "./TopNav";
import { TxHashInput } from "./TxHashInput";
import { css, styled } from "@/styled-components";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";

export type NavbarProps = {
  isSearchAModal: boolean;
  isTop: boolean;
  txHash?: string;
  chainId?: string;
  onSearch: (txHash?: string, chainId?: string) => void;
  resetState: () => void;
  setTxHash: (txHash: string) => void;
  setChainId: (chainId: string) => void;
}

export const Navbar = ({ isSearchAModal, isTop, txHash, chainId, onSearch, resetState, setTxHash, setChainId }: NavbarProps) => {
  const uniqueAssetsBySymbol = useAtomValue(uniqueAssetsBySymbolAtom);
  const chains = useAtomValue(skipChainsAtom);
  
  const selectedChain = useMemo(() => {
    if (!chainId) return null;
    return chains.data?.find((chain) => chain.chainId === chainId) || null;
  }, [chains.data, chainId]);
  
  return (
    <StyledNavbarContainer width="100%" align="center" justify="space-between">
      <Logo onClick={() => resetState()} />
      {!isSearchAModal ? (
        <SearchWrapper isTop={isTop}>
          <TxHashInput
            size={isTop ? "small" : "normal"}
            value={txHash || ""}
            onChange={(v) => setTxHash(v)}
            onSearch={() => {
              if (txHash && chainId) {
                onSearch();
              }
            }}
            openModal={() => {
              NiceModal.show(Modals.AssetAndChainSelectorModal, {
                context: "source",
                onSelect: (asset: ClientAsset | null) => {
                  setChainId(asset?.chainId || "");

                  onSearch(txHash, asset?.chainId);
                  NiceModal.hide(Modals.AssetAndChainSelectorModal);
                },
                overrideSelectedGroup: {
                  assets: uniqueAssetsBySymbol,
                },
                selectChain: true,
              });
            }}
          />
          <ChainSelector
            size={isTop ? "small" : "normal"}
            onClick={() => {
              NiceModal.show(Modals.AssetAndChainSelectorModal, {
                context: "source",
                onSelect: (asset: ClientAsset | null) => {
                  setChainId(asset?.chainId || "");
                  if (txHash) {
                    onSearch(txHash, asset?.chainId);
                  }
                  NiceModal.hide(Modals.AssetAndChainSelectorModal);
                },
                overrideSelectedGroup: {
                  assets: uniqueAssetsBySymbol,
                },
                selectChain: true,
              });
            }}
            selectedChain={selectedChain}
          />
          <SearchButton size={isTop ? "small" : "normal"} onClick={() => onSearch()} />
        </SearchWrapper>
      ) : (
        <SearchTopRight>
          <SearchButton size="small" iconOnly onClick={() => resetState()} />
        </SearchTopRight>
      )}
      <TopRightComponent />
    </StyledNavbarContainer>
  )
}

const StyledNavbarContainer = styled(Row)`
  padding: 20px;
  @media (min-width: 1023px) {
    padding: 30px 24px 110px 24px;
  }
`;

const SearchTopRight = styled.div`
  @media (min-width: 1023px) {
    display: none;
  }
`;

const SearchWrapper = styled.div<{ isTop: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 0 16px;
  transition: all 0.2s ease-in-out;
  position: absolute;
  transform: translate(-50%);
  left: 50%;

  @media (max-width: 1022px) {
    top: 120px;
  }

  @media (min-width: 1023px) {
    flex-direction: row;
    width: calc(355px * 2 + 16px);
    padding: 0;
    ${({ isTop }) => !isTop && css`
      top: 50%;
      transform: translate(-50%, -50%);
    `}
  }
`;
