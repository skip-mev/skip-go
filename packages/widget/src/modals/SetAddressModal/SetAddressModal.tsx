import { createModal, ModalProps } from "@/components/Modal";
import { Row } from "@/components/Layout";
import { css, styled, useTheme } from "styled-components";
import { useCallback, useMemo, useState } from "react";
import { RightArrowIcon } from "@/icons/ArrowIcon";
import { RenderWalletList, ManualWalletEntry } from "@/components/RenderWalletList";
import { Button } from "@/components/Button";
import { SmallText, Text } from "@/components/Typography";
import { useAtom, useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { isValidWalletAddress } from "./isValidWalletAddress";
import { useWalletList } from "@/hooks/useWalletList";
import { ModalHeader } from "@/components/ModalHeader";
import { StyledModalContainer } from "@/components/Modal";
import { chainAddressesAtom, swapExecutionStateAtom } from "@/state/swapExecutionPage";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { isMobile } from "@/utils/os";
import { MinimalWallet } from "@/state/wallets";
import { track } from "@amplitude/analytics-browser";
import { ChainType } from "@skip-go/client";

export type SetAddressModalProps = ModalProps & {
  chainId: string;
  chainAddressIndex: number;
  signRequired?: boolean;
};

export enum WalletSource {
  Input = "input",
  Wallet = "wallet",
  Injected = "injected",
}

export const SetAddressModal = createModal((modalProps: SetAddressModalProps) => {
  const isMobileScreenSize = useIsMobileScreenSize();
  const { chainId, chainAddressIndex } = modalProps;
  const { route } = useAtomValue(swapExecutionStateAtom);
  const requiredChainAddresses = route?.requiredChainAddresses;
  if (modalProps.chainAddressIndex === undefined) {
    throw new Error("chain address index cannot be undefined");
  }
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chain = chains?.find((c) => c.chainId === chainId);
  const chainName = chain?.prettyName;
  const chainLogo = chain?.logoUri;
  const [showManualAddressInput, setShowManualAddressInput] = useState(false);
  const [manualWalletAddress, setManualWalletAddress] = useState("");
  const _walletList = useWalletList({ chainId, destinationWalletList: true });
  const [chainAddresses, setChainAddresses] = useAtom(chainAddressesAtom);

  // If not same chain transaction, show warning
  const showWithdrawalWarning =
    new Set(Object.values(chainAddresses).map(({ chainId }) => chainId)).size > 1;

  const mobile = isMobile();

  const manualWalletEntry = {
    onSelect: () => setShowManualAddressInput(true),
    walletName: "Enter address manually",
    rightContent: () => {
      return <RightArrowIcon color={theme?.primary?.text.normal} />;
    },
  } as ManualWalletEntry;

  const onlyShowManualWalletEntry =
    chain?.chainType === chainAddresses[0]?.chainType && chain?.chainType !== ChainType.Cosmos;

  const hideManualWalletEntry = modalProps.signRequired;

  const walletList = [..._walletList, ...(hideManualWalletEntry ? [] : [manualWalletEntry])];

  const handleChangeAddress = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setManualWalletAddress(e.target.value);
  }, []);

  const addressIsValid = useMemo(() => {
    if (!chain || manualWalletAddress.length === 0) return;
    const { chainType, bech32Prefix, chainId } = chain;
    return isValidWalletAddress({
      address: manualWalletAddress,
      bech32Prefix,
      chainType,
      chainId: chainId,
    });
  }, [chain, manualWalletAddress]);

  const placeholder = useMemo(() => {
    if (!chain) return "Enter address...";
    const { chainType, bech32Prefix } = chain;

    switch (chainType) {
      case ChainType.Cosmos:
        return `${bech32Prefix}1...`;
      case ChainType.Evm:
        return "0x...";
      case ChainType.Svm:
        return "Enter solana address...";
      default:
        return "Enter address...";
    }
  }, [chain]);

  const onConfirmSetManualAddress = () => {
    track("set address modal: confirm set address", {
      chainId,
    });
    const chainType = chain?.chainType;
    if (!chainId || !chainType) return;
    setChainAddresses((prev) => {
      return {
        ...prev,
        [chainAddressIndex]: {
          chainId: chainId,
          chainType: chainType as ChainType,
          address: manualWalletAddress,
          source: WalletSource.Input,
        },
      };
    });
    NiceModal.remove(Modals.SetAddressModal);
  };

  const walletListTitle = useMemo(() => {
    const isDestinationIndex = chainAddressIndex === Object.values(chainAddresses).length - 1;
    const title = isDestinationIndex ? "Destination" : "Intermediary";
    if (mobile) {
      return title;
    }
    return `${title} wallet`;
  }, [chainAddressIndex, chainAddresses, mobile]);

  const onSelectWallet = async (wallet: MinimalWallet) => {
    track("set address modal: wallet selected", {
      chainId,
      walletName: wallet.walletName,
    });
    const response = await wallet.getAddress?.({
      praxWallet: {
        sourceChainID: chainAddressIndex
          ? chainAddresses[chainAddressIndex - 1]?.chainId
          : undefined,
      },
    });
    const address = response?.address;
    const logo = response?.logo;
    setChainAddresses((prev) => {
      if (
        JSON.stringify(requiredChainAddresses) !==
        JSON.stringify(Object.values(prev).map((chain) => chain.chainId))
      ) {
        return prev;
      }
      return {
        ...prev,
        [chainAddressIndex]: {
          chainId: chainId,
          chainType: chain?.chainType,
          address,
          source: WalletSource.Wallet,
          wallet: {
            walletName: wallet.walletName,
            walletPrettyName: wallet.walletPrettyName,
            walletChainType: wallet.walletChainType,
            walletInfo: {
              logo: logo ?? wallet.walletInfo?.logo,
            },
          },
        },
      };
    });
  };

  return (
    <>
      {showManualAddressInput ? (
        <StyledModalContainer>
          <ModalHeader
            title={isMobileScreenSize ? "Enter an address" : `Enter a ${chainName} address`}
            onClickBackButton={() => setShowManualAddressInput(false)}
            rightContent={
              <StyledChainLogoContainerRow align="center" justify="center">
                <img width="25px" height="25px" src={chainLogo} />
              </StyledChainLogoContainerRow>
            }
          />
          {showWithdrawalWarning && (
            <SmallText color={theme?.error?.text} textAlign="center">
              Avoid transfers to centralized exchanges. Your assets may be lost.
            </SmallText>
          )}
          <StyledInputContainer>
            <StyledInput
              placeholder={placeholder}
              value={manualWalletAddress}
              onChange={handleChangeAddress}
              validAddress={addressIsValid}
            />
            <StyledAddressValidatorDot validAddress={addressIsValid} />
          </StyledInputContainer>
          {addressIsValid === false && (
            <SmallText color={theme?.error?.text} textAlign="center">
              Please enter a valid wallet address for {chainName}
            </SmallText>
          )}
          <StyledBrandButton
            align="center"
            justify="center"
            disabled={!addressIsValid}
            onClick={onConfirmSetManualAddress}
          >
            <Text
              mainButtonColor={addressIsValid === true ? theme?.brandColor : undefined}
              opacity={addressIsValid ? 1 : 0.5}
              fontSize={24}
            >
              Confirm
            </Text>
          </StyledBrandButton>
        </StyledModalContainer>
      ) : (
        <RenderWalletList
          title={walletListTitle}
          walletList={onlyShowManualWalletEntry ? [manualWalletEntry] : walletList}
          onClickBackButton={() => {
            track("set address modal: back button - clicked");
            NiceModal.remove(Modals.SetAddressModal);
          }}
          chainId={chainId}
          onSelectWallet={(v) => {
            track("set address modal: wallet selected", {
              chainId,
              walletName: v.walletName,
            });
            onSelectWallet(v);
          }}
        />
      )}
    </>
  );
});

const StyledInputContainer = styled.div`
  position: relative;
`;

const StyledChainLogoContainerRow = styled(Row)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.secondary.background.normal};
`;

const StyledAddressValidatorDot = styled.div<{ validAddress?: boolean }>`
  position: absolute;
  height: 11px;
  width: 11px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary.text.lowContrast};

  ${({ validAddress, theme }) =>
    validAddress === true
      ? `background: ${theme.success.text}`
      : validAddress === false
        ? `background: ${theme.error.text}`
        : ""};

  top: calc(50% - 11px / 2);
  right: 20px;
`;

const StyledInput = styled.input<{ validAddress?: boolean }>`
  font-size: 20px;
  font-family: "ABCDiatype", sans-serif;
  height: 60px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  padding: 8px 40px 8px 15px;
  border: 1px solid ${({ theme }) => theme.primary.text.ultraLowContrast};
  background: ${({ theme }) => theme.secondary.background.normal};
  color: ${({ theme }) => theme.primary.text.normal};
  border-radius: 12px;

  ${({ validAddress, theme }) =>
    validAddress === false &&
    css`
      border-color: ${theme.error.text};
      background: ${theme.error.background};
    `}
`;

export const StyledBrandButton = styled(Button)`
  background: ${({ theme }) => theme.brandColor};
  height: 60px;
  border-radius: 12px;
  ${({ disabled, theme }) => disabled && `background: ${theme.secondary.background.normal}`};
`;
