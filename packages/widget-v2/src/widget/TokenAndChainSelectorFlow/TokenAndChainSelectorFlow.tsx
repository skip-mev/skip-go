import NiceModal from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { Column } from '../../components/Layout';
import { styled } from 'styled-components';
import { useAtom } from 'jotai';
import { ClientAsset, skipAssets } from '../../state/skip';
import { useCallback } from 'react';
import { VirtualList } from '../../components/VirtualList';
import {
  Skeleton,
  TokenAndChainSelectorFlowRowItem,
} from './TokenAndChainSelectorFlowRowItem';

export const TokenAndChainSelectorFlow = NiceModal.create(
  (modalProps: ModalProps) => {
    const [loadingAssets] = useAtom(skipAssets);

    const assets =
      loadingAssets.state === 'hasData' ? loadingAssets.data : undefined;

    const renderItem = useCallback(
      (asset: ClientAsset | null, index: number) => {
        return (
          <TokenAndChainSelectorFlowRowItem
            asset={asset}
            index={index}
            skeleton={
              <Skeleton color={modalProps.theme?.secondary?.background} />
            }
          />
        );
      },
      []
    );

    return (
      <Modal {...modalProps}>
        <StyledTokenAndChainSelectorFlowContainer>
          TokenAndChainSelectorFlow
          <VirtualList
            listItems={assets}
            height={550}
            itemHeight={70}
            textColor={modalProps?.theme?.textColor ?? ''}
            renderItem={renderItem}
            itemKey={(asset: ClientAsset) =>
              asset.denom + asset.recommendedSymbol + asset.tokenContract
            }
          />
        </StyledTokenAndChainSelectorFlowContainer>
      </Modal>
    );
  }
);

const StyledTokenAndChainSelectorFlowContainer = styled(Column)`
  padding: 10px;
  gap: 10px;
  width: 480px;
  height: 600px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
`;
