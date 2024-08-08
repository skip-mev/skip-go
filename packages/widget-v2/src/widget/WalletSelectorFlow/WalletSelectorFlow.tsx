import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column, Row } from '../../components/Layout';
import { styled } from 'styled-components';
import { useCallback, useMemo } from 'react';
import { Text } from '../../components/Typography';
import { VirtualList } from '../../components/VirtualList';
import { hashObject } from '../../utils/misc';
import { ModalRowItem } from '../../components/ModalRowItem';
import { getHexColor, opacityToHex } from '../../utils/colors';
import { LeftArrowIcon } from '../../icons/ArrowIcon';
import { Button } from '../../components/Button';

export type WalletSelectorFlowProps = ModalProps & {
  onSelect: (wallet: Wallet) => void;
};

type Wallet = {
  name: string;
  imageUrl: string;
};

const WALLET_LIST: Wallet[] = [
  {
    name: 'Keplr',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png',
  },
  {
    name: 'Phantom',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png',
  },
  {
    name: 'MetaMask',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png',
  },
];

export const WalletSelectorFlow = NiceModal.create(
  (modalProps: WalletSelectorFlowProps) => {
    const { onSelect } = modalProps;
    const modal = useModal();

    const renderItem = useCallback(
      (wallet: Wallet) => {
        return (
          <ModalRowItem
            key={wallet.name}
            onClick={() => onSelect(wallet)}
            style={{ margin: '5px 0' }}
            leftContent={
              <Row align="center" gap={10}>
                <img
                  height={35}
                  width={35}
                  style={{ objectFit: 'cover' }}
                  src={wallet.imageUrl}
                  alt={`${wallet.name} logo`}
                />
                <Text>{wallet.name}</Text>
              </Row>
            }
          />
        );
      },
      [onSelect]
    );

    const height = useMemo(() => {
      return Math.min(530, WALLET_LIST.length * 70);
    }, []);

    return (
      <Modal {...modalProps}>
        <StyledContainer gap={15}>
          <StyledHeader align="center" justify="center">
            <StyledBackButton onClick={() => modal.remove()}>
              <LeftArrowIcon
                color={modalProps.theme?.backgroundColor}
                backgroundColor={modalProps.theme?.textColor}
              />
            </StyledBackButton>
            <Text textAlign="center">Connect wallet</Text>
          </StyledHeader>
          <VirtualList
            listItems={WALLET_LIST}
            height={height}
            itemHeight={70}
            renderItem={renderItem}
            itemKey={(item) => hashObject(item)}
          />
        </StyledContainer>
      </Modal>
    );
  }
);

const StyledBackButton = styled(Button)`
  position: absolute;
  left: 22px;
`;

const StyledHeader = styled(Row)`
  height: 40px;
  margin-top: 10px;
`;

const StyledContainer = styled(Column)`
  position: relative;
  padding: 10px;
  gap: 10px;
  width: 580px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
  overflow: hidden;
`;
