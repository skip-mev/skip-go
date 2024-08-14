import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column, Row } from '../../components/Layout';
import { css, styled } from 'styled-components';
import { useCallback, useMemo, useState } from 'react';
import { RightArrowIcon } from '../../icons/ArrowIcon';
import {
  RenderWalletList,
  RenderWalletListHeader,
  Wallet,
} from '../../components/RenderWalletList';
import { WALLET_LIST } from '../WalletSelectorFlow/WalletSelectorFlow';
import { getHexColor, opacityToHex } from '../../utils/colors';
import { Button } from '../../components/Button';
import { SmallText, Text } from '../../components/Typography';

export type ManualAddressFlowProps = ModalProps & {
  onSelect: (wallet: Wallet) => void;
  onSetManualWalletAddress: (address: string) => void;
  chainName?: string;
  chainLogo?: string;
};

export const ManualAddressFlow = NiceModal.create(
  (modalProps: ManualAddressFlowProps) => {
    const { onSelect, chainName, chainLogo, theme, onSetManualWalletAddress } =
      modalProps;
    const modal = useModal();
    const [showManualAddressInput, setShowManualAddressInput] = useState(false);
    const [manualWalletAddress, setManualWalletAddress] = useState('');

    const walletList: Wallet[] = [
      ...WALLET_LIST,
      {
        name: 'Enter address manually',
        onSelect: () => setShowManualAddressInput(true),
        rightContent: () => {
          return (
            <RightArrowIcon
              color={theme?.primary?.background.normal}
              backgroundColor={theme?.primary?.text.normal}
            />
          );
        },
      },
    ];

    const handleChangeAddress = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setManualWalletAddress(e.target.value);
      },
      []
    );

    const addressIsValid = useMemo(() => {
      // TODO: implement logic to actually validate addresses
      if (manualWalletAddress.length < 10) {
        return;
      }
      return manualWalletAddress.length === 10;
    }, [manualWalletAddress]);

    return (
      <Modal {...modalProps}>
        {showManualAddressInput ? (
          <StyledContainer gap={15}>
            <RenderWalletListHeader
              title={`Enter a ${chainName} wallet address`}
              onClickBackButton={() => setShowManualAddressInput(false)}
              rightContent={() => (
                <StyledChainLogoContainerRow align="center" justify="center">
                  <img width="25px" height="25px" src={chainLogo} />
                </StyledChainLogoContainerRow>
              )}
            />
            <StyledInputContainer>
              <StyledInput
                placeholder="0xABCDEFG..."
                value={manualWalletAddress}
                onChange={handleChangeAddress}
                validAddress={addressIsValid}
              />
              <StyledAddressValidatorDot validAddress={addressIsValid} />
            </StyledInputContainer>
            {addressIsValid === false && (
              <SmallText
                color={theme?.error?.text}
                opacity={1}
                textAlign="center"
              >
                Please enter a valid wallet address for {chainName}
              </SmallText>
            )}
            <StyledBrandButton
              align="center"
              justify="center"
              disabled={!addressIsValid}
              onClick={() => onSetManualWalletAddress(manualWalletAddress)}
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
            walletList={walletList}
            onSelect={onSelect}
            onClickBackButton={() => modal.remove()}
          />
        )}
      </Modal>
    );
  }
);

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
      : ''};

  top: calc(50% - 11px / 2);
  right: 20px;
`;

const StyledInput = styled.input<{ validAddress?: boolean }>`
  height: 60px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  padding: 8px 40px 8px 15px;
  border: 1px solid
    ${({ theme }) =>
      getHexColor(theme.primary.text.normal ?? '') + opacityToHex(20)};
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
