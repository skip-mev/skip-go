import { Row } from "@/components/Layout";
import { NiceModal, Modals } from "@/nice-modal";
import { skipChainsAtom, ClientAsset } from "@/state/skipClient";
import { uniqueAssetsBySymbolAtom } from "../state/uniqueAssetsBySymbol";
import { useAtomValue } from "@/jotai";
import { useMemo } from "react";
import { ChainSelector } from "./ChainSelector";
import { SearchButton } from "./SearchButton";
import { RightArrowIcon } from "../icons/RightArrowIcon";
import { TxHashInput } from "./TxHashInput";
import { css, styled } from "@/styled-components";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button } from "@/components/Button";
import Link from "next/link";
import Image from "next/image";
import { ExplorerModals } from "../constants/modal";

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
          <SearchButton size={isTop ? "small" : "normal"} onClick={() => onSearch()} isSearchable={!!txHash && !!chainId} />
        </SearchWrapper>
      ) : (
        <SearchTopRight>
          <SearchButton size="small" iconOnly onClick={() => NiceModal.show(ExplorerModals.SearchModal, {
            txHash,
            chainId,
            onSearch,
            setTxHash,
            setChainId,
            blurBackground: true,
            disableCloseOnClickOutside: true,
          })} />
        </SearchTopRight>
      )}
      <TopRightComponent />
    </StyledNavbarContainer>
  )
}

export const Logo = ({ onClick }: { onClick?: () => void }) => {
  const [theme] = useLocalStorage<"dark" | "light">("explorer-theme");
  const isMobileScreenSize = useIsMobileScreenSize();

  return (
    <Link
      onClick={onClick}
      href="/"
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Image
        src={theme === "dark" ? "/logo.svg" : "/logo-light.svg"}
        alt="Skip go explorer Logo"
        width={isMobileScreenSize ? 194 : 256}
        height={isMobileScreenSize ? 24 : 32}
      />
    </Link>
  );
};

export const TopRightComponent = () => {
  const [theme] = useLocalStorage<"dark" | "light">("explorer-theme");

  return (
    <TopRightContainer>
      <Row>
        <Link
          href="https://discord.gg/interchain"
          target="_blank"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <StyledPillButton onClick={() => {}} isDarkMode={theme === "dark"}>
            Need Help?
            <RightArrowIcon color={theme === "dark" ? "#000" : "#fff"} />
          </StyledPillButton>
        </Link>
      </Row>
    </TopRightContainer>
  );
};

const TopRightContainer = styled.div`
  @media (max-width: 1300px) {
    display: none;
  }
`;

const StyledPillButton = styled(Button)<{ isDarkMode?: boolean }>`
  background: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#000")};
  color: ${({ isDarkMode }) => (isDarkMode ? "#000" : "#fff")};
  font-family: "ABCDiatype", sans-serif;
  box-shadow: none;
  border: none;
  font-weight: 500;
  font-size: 16px;
  padding: 12px;
  align-items: center;
  gap: 8px;
  border-radius: 100px;

  &:hover {
    background: ${({ isDarkMode }) => (isDarkMode ? "#f0f0f0" : "#e0e0e0")};
  }
`;

const StyledNavbarContainer = styled(Row)`
  padding: 20px;
  @media (min-width: 1300px) {
    padding: 30px 24px 110px 24px;
  }
`;

const SearchTopRight = styled.div`
  @media (min-width: 1300px) {
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

  @media (max-width: 1299px) {
    top: 120px;
  }

  @media (min-width: 1300px) {
    flex-direction: row;
    width: calc(355px * 2 + 16px);
    padding: 0;
    ${({ isTop }) => !isTop && css`
      top: 50%;
      transform: translate(-50%, -50%);
    `}
  }
`;
