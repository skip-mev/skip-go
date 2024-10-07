import { createModal, ModalProps, useModal } from "@/components/Modal";
import { Column, Row } from "@/components/Layout";
import { css, styled } from "styled-components";
import { useCallback, useMemo, useState } from "react";
import { RightArrowIcon } from "@/icons/ArrowIcon";
import {
  RenderWalletList,
  ManualWalletEntry,
} from "@/components/RenderWalletList";
import { Button } from "@/components/Button";
import { SmallText, Text } from "@/components/Typography";
import { useAtomValue, useSetAtom } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { isValidWalletAddress } from "./isValidWalletAddress";
import { useWalletList } from "@/hooks/useWalletList";
import { ModalHeader } from "@/components/ModalHeader";
import { chainAddressesAtom } from "@/state/swapExecutionPage";

export type SetAddressModalProps = ModalProps & {
  signRequired?: boolean;
  chainId: string
};

export const SetAddressModal = createModal((modalProps: SetAddressModalProps) => {
  const { theme, signRequired, chainId } = modalProps;
  const modal = useModal();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chain = chains?.find(c => c.chainID === chainId);
  const chainName = chain?.prettyName;
  const chainLogo = chain?.logoURI;
  const [showManualAddressInput, setShowManualAddressInput] = useState(false);
  const [manualWalletAddress, setManualWalletAddress] = useState("");
  const _walletList = useWalletList(chainId, true);
  const setChainAddresses = useSetAtom(chainAddressesAtom);

  const walletList = [
    ..._walletList,
    {
      onSelect: () => setShowManualAddressInput(true),
      walletName: "Enter address manually",
      rightContent: () => {
        return (
          <RightArrowIcon
            color={theme?.primary?.background.normal}
            backgroundColor={theme?.primary?.text.normal}
          />
        );
      },
    } as ManualWalletEntry,
  ];

  const handleChangeAddress = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setManualWalletAddress(e.target.value);
    },
    []
  );

  const addressIsValid = useMemo(() => {
    if (!chain || manualWalletAddress.length === 0) return;
    const { chainType, bech32Prefix } = chain;
    return isValidWalletAddress({
      address: manualWalletAddress,
      bech32Prefix,
      chainType
    });
  }, [chain, manualWalletAddress]);

  const placeholder = useMemo(() => {
    if (!chain) return "Enter address...";
    const { chainType, bech32Prefix } = chain;

    switch (chainType) {
      case "cosmos":
        return `${bech32Prefix}1...`;
      case "evm":
        return "0x...";
      case "svm":
        return "Enter solana address...";
      default:
        return "Enter address...";
    }
  }, [chain]);

  const onConfirmSetManualAddress = () => {
    const chainType = chain?.chainType;
    if (!chainId || !chainType) return;
    setChainAddresses((prev) => {
      const destinationIndex = Object.values(prev).length - 1;
      return {
        ...prev,
        [destinationIndex]: {
          chainID: chainId,
          chainType: chainType as "evm" | "cosmos" | "svm",
          address: manualWalletAddress,
          source: "input",
        },
      };
    });
    modal.remove();
  };
  return (
    <>
      {showManualAddressInput ? (
        <StyledContainer gap={15}>
          <ModalHeader
            title={`Enter a ${chainName} address`}
            onClickBackButton={() => setShowManualAddressInput(false)}
            rightContent={() => (
              <StyledChainLogoContainerRow align="center" justify="center">
                <img width="25px" height="25px" src={chainLogo} />
              </StyledChainLogoContainerRow>
            )}
          />
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
              mainButtonColor={
                addressIsValid === true ? theme?.brandColor : undefined
              }
              opacity={addressIsValid ? 1 : 0.5}
              fontSize={24}
            >
              Confirm
            </Text>
          </StyledBrandButton>
        </StyledContainer>
      ) : (
        <RenderWalletList
          title="Destination wallet"
          walletList={signRequired ? _walletList : walletList}
          onClickBackButton={() => modal.remove()}
          chainId={chainId}
          chainType={chain?.chainType}
          isDestinationAddress
        />
      )}
    </>
  );
});

const StyledContainer = styled(Column)`
  position: relative;
  padding: 10px;
  gap: 15px;
  width: 580px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  overflow: hidden;
`;

const StyledInputContainer = styled.div`
  position: relative;
`;

const StyledChainLogoContainerRow = styled(Row)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.secondary.background.normal};
`;

const StyledAddressValidatorDot = styled.div<{ validAddress?: boolean }>`
  position: absolute;
  height: 11px;
  width: 11px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary.text.lowContrast};

  ${({ validAddress, theme }) =>
    validAddress === true
      ? `background-color: ${theme.success.text}`
      : validAddress === false
        ? `background-color: ${theme.error.text}`
        : ""};

  top: calc(50% - 11px / 2);
  right: 20px;
`;

const StyledInput = styled.input<{ validAddress?: boolean }>`
  height: 60px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  padding: 8px 40px 8px 15px;
  border: 1px solid ${({ theme }) => theme.primary.text.ultraLowContrast};
  background-color: ${({ theme }) => theme.secondary.background.normal};
  color: ${({ theme }) => theme.primary.text.normal};
  border-radius: 12px;

  ${({ validAddress, theme }) =>
    validAddress === false &&
    css`
      border-color: ${theme.error.text};
      background-color: ${theme.error.background};
    `}
`;

export const StyledBrandButton = styled(Button)`
  background-color: ${({ theme }) => theme.brandColor};
  height: 60px;
  border-radius: 12px;
  ${({ disabled, theme }) =>
    disabled && `background-color: ${theme.secondary.background.normal}`};
`;
