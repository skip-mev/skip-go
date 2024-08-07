import NiceModal from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column, Row } from '../../components/Layout';
import { styled } from 'styled-components';
import { useAtom } from 'jotai';
import { skipAssets } from '../../state/skip';
import { ModalRowItem } from '../../components/ModalRowItem';
import { SmallText, Text } from '../../components/Typography';
import List from 'rc-virtual-list';
import { getHexColor, opacityToHex } from '../../utils/colors';

export const TokenAndChainSelectorFlow = NiceModal.create(
  ({ theme, ...modalProps }: ModalProps) => {
    const [loadingAssets] = useAtom(skipAssets);
    const assets =
      loadingAssets.state === 'hasData' ? loadingAssets.data : undefined;
    return (
      <Modal {...modalProps}>
        <StyledTokenAndChainSelectorFlowContainer>
          TokenAndChainSelectorFlow
          <List
            data={assets ?? []}
            height={550}
            itemHeight={60}
            itemKey="denom"
            styles={{
              verticalScrollBar: {
                backgroundColor: 'transparent',
              },
              verticalScrollBarThumb: {
                backgroundColor:
                  getHexColor(theme?.textColor ?? '') + opacityToHex(50),
              },
            }}
          >
            {(asset) => (
              <ModalRowItem
                onClick={() => {}}
                leftContent={
                  <Row align="center" gap={10}>
                    <img
                      style={{ borderRadius: '50%' }}
                      height={35}
                      width={35}
                      src={asset.logoURI}
                    />
                    <Text>{asset.symbol}</Text>
                    <SmallText>{asset.chainName ?? asset.chainID}</SmallText>
                  </Row>
                }
              />
            )}
          </List>
        </StyledTokenAndChainSelectorFlowContainer>
      </Modal>
    );
  }
);

const StyledTokenAndChainSelectorFlowContainer = styled(Column)`
  padding: 10px;
  gap: 10px;
  width: 580px;
  height: 600px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
`;
