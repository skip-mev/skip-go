import { createModal, ModalProps } from "@/components/Modal";
import { Row } from "@/components/Layout";
import { css, styled, useTheme } from "styled-components";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  chainAddressesAtom,
  gasRouteChainAddressesAtom,
  swapExecutionStateAtom,
} from "@/state/swapExecutionPage";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { isMobile } from "@/utils/os";
import { MinimalWallet } from "@/state/wallets";
import { track } from "@amplitude/analytics-browser";
import { ChainType } from "@skip-go/client";
import { TriangleWarningIcon } from "@/icons/TriangleWarningIcon";

export type SetAddressModalProps = ModalProps & {
  chainId: string;
  chainAddressIndex: number;
  signRequired?: boolean;
  isGasRoute?: boolean;
};

export enum WalletSource {
  Input = "input",
  Wallet = "wallet",
  Injected = "injected",
}

export const SetAddressModal = createModal((modalProps: SetAddressModalProps) => {
  const isMobileScreenSize = useIsMobileScreenSize();
  const { chainId, chainAddressIndex, isGasRoute: isGasRoute } = modalProps;
  const { route, gasRoute } = useAtomValue(swapExecutionStateAtom);
  const requiredChainAddresses = isGasRoute
    ? gasRoute?.requiredChainAddresses
    : route?.requiredChainAddresses;
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
  const [hasAcknowledgedWithdrawalWarning, setHasAcknowledgedWithdrawalWarning] = useState(false);
  const _walletList = useWalletList({ chainId, destinationWalletList: true });
  const [_chainAddresses, _setChainAddresses] = useAtom(chainAddressesAtom);
  const [gasRouteChainAddresses, setGasRouteChainAddresses] = useAtom(gasRouteChainAddressesAtom);

  const chainAddresses = isGasRoute ? gasRouteChainAddresses : _chainAddresses;
  const setChainAddresses = isGasRoute ? setGasRouteChainAddresses : _setChainAddresses;

  // If not same chain transaction, show warning
  const showWithdrawalWarning =
    new Set(Object.values(chainAddresses).map(({ chainId }) => chainId)).size > 1;

  useEffect(() => {
    if (!showManualAddressInput || !showWithdrawalWarning) {
      setHasAcknowledgedWithdrawalWarning(false);
    }
  }, [showManualAddressInput, showWithdrawalWarning]);

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

  const requiresWithdrawalWarningAcknowledgement = showManualAddressInput && showWithdrawalWarning;
  const shouldBlockManualAddressEntry =
    requiresWithdrawalWarningAcknowledgement && !hasAcknowledgedWithdrawalWarning;

  const canConfirmAddress =
    addressIsValid === true &&
    (!requiresWithdrawalWarningAcknowledgement || hasAcknowledgedWithdrawalWarning);

  const onConfirmSetManualAddress = () => {
    if (requiresWithdrawalWarningAcknowledgement && !hasAcknowledgedWithdrawalWarning) {
      return;
    }
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
          {shouldBlockManualAddressEntry ? (
            <StyledBlockingWarning>
              <StyledBlockingWarningIcon>
                <TriangleWarningIcon backgroundColor={theme?.error?.text} width={47} height={41} />
              </StyledBlockingWarningIcon>
              <StyledWarningTitle as="p" color={theme?.error?.text}>
                Risk of fund loss
              </StyledWarningTitle>
              <SmallText color={theme?.error?.text} textAlign="center">
                Do not transfer to centralized exchanges. If the transaction fails, you may receive a
                refund in a different token that exchanges cannot recover.
              </SmallText>
              <StyledBlockingWarningButton
                onClick={() => setHasAcknowledgedWithdrawalWarning(true)}
                align="center"
                justify="center"
              >
                I understand the risk
              </StyledBlockingWarningButton>
            </StyledBlockingWarning>
          ) : (
            <>
              {showWithdrawalWarning && (
                <StyledWarningCard>
                  <SmallText color={theme?.error?.text} textAlign="center">
                    Exchange deposit addresses are not supported. Please use a self-custody wallet
                    address.
                  </SmallText>
                </StyledWarningCard>
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
                disabled={!canConfirmAddress}
                onClick={onConfirmSetManualAddress}
              >
                <Text
                  mainButtonColor={canConfirmAddress ? theme?.brandColor : undefined}
                  opacity={canConfirmAddress ? 1 : 0.5}
                  fontSize={24}
                >
                  Confirm
                </Text>
              </StyledBrandButton>
            </>
          )}
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

const StyledWarningCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.error.text};
  background: ${({ theme }) => theme.error.background};
`;

const StyledWarningTitle = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const StyledBlockingWarning = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.error.text};
  background: ${({ theme }) => theme.error.background};
`;

const StyledBlockingWarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBlockingWarningButton = styled(Button)`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  background: ${({ theme }) => theme.error.text};
  color: ${({ theme }) => theme.primary.background.normal};
  font-weight: 600;
  font-size: 16px;
`;
