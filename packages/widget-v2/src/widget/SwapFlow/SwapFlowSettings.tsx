import { styled } from 'styled-components';
import { Modal, ModalProps } from '../../components/Modal';
import { Column, Row } from '../../components/Layout';
import NiceModal from '@ebay/nice-modal-react';
import { SmallText } from '../../components/Typography';
import { SwapFlowFlooterItems } from './SwapFlowFooterItems';

export const SwapFlowSettings = NiceModal.create((props: ModalProps) => {
  return (
    <Modal {...props}>
      <StyledSwapFlowSettings gap={20}>
        <Row justify="space-between">
          <SettingText>Route</SettingText>
        </Row>
        <Row justify="space-between">
          <SettingText>Total Gas</SettingText>
          <SettingText> 0.001 XYZ ($0.1) </SettingText>
        </Row>
        <Row justify="space-between">
          <SettingText>Router Fee</SettingText>
          <SettingText> 0.001 XYZ ($0.1) </SettingText>
        </Row>
        <Row justify="space-between">
          <SettingText>Bridge Fee</SettingText>
          <SettingText> 0.001 XYZ ($0.1) </SettingText>
        </Row>
        <Row justify="space-between">
          <SettingText>Max Slippage</SettingText>
        </Row>
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
