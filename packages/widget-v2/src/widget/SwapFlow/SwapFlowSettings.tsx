import { css, styled } from 'styled-components';
import { Modal, ModalProps } from '../../components/Modal';
import { Column, Row } from '../../components/Layout';
import NiceModal from '@ebay/nice-modal-react';
import { SmallText } from '../../components/Typography';
import { SwapFlowFlooterItems } from './SwapFlowFooterItems';
import { RouteArrow } from '../../icons/RouteArrow';

const SLIPPAGE_OPTIONS = [
  {
    value: '0.5',
    label: '0.5%',
  },
  {
    value: '3',
    label: '3%',
  },
  {
    value: '5',
    label: '5%',
  },
  {
    value: '10',
    label: '10%',
  },
];

const totalGas = '0.001 XYZ ($0.1)';
const routerFee = '0.001 XYZ ($0.1)';
const bridgeFee = '0.001 XYZ ($0.1)';
const selectedOption = SLIPPAGE_OPTIONS[0];
const route = ['COSMOS', 'OSMOSIS', 'AXELAR'];

export const SwapFlowSettings = NiceModal.create((modalProps: ModalProps) => {
  return (
    <Modal {...modalProps}>
      <StyledSwapFlowSettings gap={20}>
        <Column gap={10}>
          <Row justify="space-between">
            <SettingText>Route</SettingText>
            <Row align="center" gap={5}>
              {route.map((_path, index) => (
                <>
                  <img
                    width="20"
                    height="20"
                    src="https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png"
                  />
                  {index !== route.length - 1 && (
                    <RouteArrow color={modalProps.theme?.textColor} />
                  )}
                </>
              ))}
            </Row>
          </Row>
          <Row justify="space-between">
            <SettingText>Max Slippage</SettingText>
            <Row>
              {SLIPPAGE_OPTIONS.map(({ label }) => (
                <StyledSlippageOptionLabel
                  monospace
                  selected={selectedOption.label === label}
                >
                  {label}
                </StyledSlippageOptionLabel>
              ))}
            </Row>
          </Row>
        </Column>

        <Column gap={10}>
          <Row justify="space-between">
            <SettingText>Total Gas</SettingText>
            <SettingText monospace>{totalGas}</SettingText>
          </Row>
          <Row justify="space-between">
            <SettingText>Router Fee</SettingText>
            <SettingText monospace>{routerFee}</SettingText>
          </Row>
          <Row justify="space-between">
            <SettingText>Bridge Fee</SettingText>
            <SettingText monospace>{bridgeFee}</SettingText>
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

const StyledSlippageOptionLabel = styled(SmallText)<{ selected?: boolean }>`
  border-radius: 7px;
  padding: 4px 7px;
  white-space: nowrap;
  color: ${(props) => props.theme.textColor};
  &:hover {
    background-color: ${(props) => props.theme.secondary.background};
    opacity: 1;
    cursor: pointer;
  }
  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${theme.secondary.background};
      opacity: 1;
    `}
`;

const SettingText = styled(Row).attrs({
  as: SmallText,
  opacity: '1',
})`
  letter-spacing: 0.26px;
`;
