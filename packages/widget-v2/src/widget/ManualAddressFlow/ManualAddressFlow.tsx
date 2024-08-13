import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column } from '../../components/Layout';
import { styled } from 'styled-components';
import { useState } from 'react';
import { RightArrowIcon } from '../../icons/ArrowIcon';
import {
  RenderWalletList,
  RenderWalletListHeader,
  Wallet,
} from '../../components/RenderWalletList';
import { WALLET_LIST } from '../WalletSelectorFlow/WalletSelectorFlow';
import { getHexColor, opacityToHex } from '../../utils/colors';
import { StyledBrandButton } from '../../components/Button';

export type ManualAddressFlowProps = ModalProps & {
  onSelect: (wallet: Wallet) => void;
};

export const ManualAddressFlow = NiceModal.create(
  (modalProps: ManualAddressFlowProps) => {
    const { onSelect } = modalProps;
    const modal = useModal();
    const [showManualAddressInput, setShowManualAddressInput] = useState(false);

    const walletList: Wallet[] = [
      ...WALLET_LIST,
      {
        name: 'Enter address manually',
        onSelect: () => setShowManualAddressInput(true),
        rightContent: () => {
          return (
            <RightArrowIcon
              color={modalProps.theme?.backgroundColor}
              backgroundColor={modalProps.theme?.textColor}
            />
          );
        },
      },
    ];

    return (
      <Modal {...modalProps}>
        {showManualAddressInput ? (
          <StyledContainer gap={15}>
            <RenderWalletListHeader
              title="Enter a Base wallet address"
              onClickBackButton={() => setShowManualAddressInput(false)}
            />
            <StyledInput placeholder="0xABCDEFG..." />
            <StyledBrandButton>Confirm</StyledBrandButton>
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
  gap: 10px;
  width: 580px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
  overflow: hidden;
`;

const StyledInput = styled.input`
  height: 60px;
  box-sizing: border-box;
  padding: 8px 20px 8px 15px;
  border: 1px solid
    ${({ theme }) => getHexColor(theme.textColor ?? '') + opacityToHex(20)};
  background-color: ${({ theme }) => theme.secondary.background};
  border-radius: 12px;
`;
