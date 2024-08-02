import { styled } from 'styled-components';
import { Modal, ModalProps } from '../../components/Modal';
import { Column, Row } from '../../components/Layout';
import NiceModal from '@ebay/nice-modal-react';
import { SmallText } from '../../components/Typography';
import { SwapFlowFlooterItems } from './SwapFlowFooterItems';

export const SwapFlowSettings = NiceModal.create((modalProps: ModalProps) => {
  const totalGas = '0.001 XYZ ($0.1)';
  const routerFee = '0.001 XYZ ($0.1)';
  const bridgeFee = '0.001 XYZ ($0.1)';

  return (
    <Modal {...modalProps}>
      <StyledSwapFlowSettings gap={20}>
        <Column gap={10}>
          <Row justify="space-between">
            <SettingText>Route</SettingText>
          </Row>
          <Row justify="space-between">
            <SettingText>Max Slippage</SettingText>
          </Row>
        </Column>

        <Column gap={10}>
          <Row justify="space-between">
            <SettingText>Total Gas</SettingText>
            <SettingText>{totalGas}</SettingText>
          </Row>
          <Row justify="space-between">
            <SettingText>Router Fee</SettingText>
            <SettingText>{routerFee}</SettingText>
          </Row>
          <Row justify="space-between">
            <SettingText>Bridge Fee</SettingText>
            <SettingText>{bridgeFee}</SettingText>
          </Row>
        </Column>

        <SettingText justify="space-between">
          <SwapFlowFlooterItems />
        </SettingText>
      </StyledSwapFlowSettings>
    </Modal>
  );
});

const StyledSwapFlowSettings = styled(Column)`
  width: 480px;
  padding: 20px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const SettingText = styled(Row).attrs({
  as: SmallText,
  opacity: '1',
})``;
