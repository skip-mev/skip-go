import { useTheme } from 'styled-components';
import { AssetChainInput } from '../../components/AssetChainInput';
import { GhostButton } from '../../components/Button';
import { Column, Row } from '../../components/Layout';
import { MainButton } from '../../components/MainButton';
import { SmallText } from '../../components/Typography';
import { ICONS } from '../../icons';
import { HistoryIcon } from '../../icons/HistoryIcon';
import { useState } from 'react';
import { SwapFlowSettings } from './SwapFlowSettings';
import { useModal } from '@ebay/nice-modal-react';
import { SwapFlowFlooterItems } from './SwapFlowFooterItems';
import { BridgeIcon } from '../../icons/BridgeIcon';
import { BridgeArrowIcon } from '../../icons/BridgeArrowIcon';
import { SwapFlowBridge } from './SwapFlowBridge';

export const SwapFlow = () => {
  const theme = useTheme();
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const modal = useModal(SwapFlowSettings);

  return (
    <>
      <Column
        gap={5}
        style={{
          opacity: drawerOpen ? 0.5 : 1,
        }}
      >
        <Row justify="space-between">
          <GhostButton gap={5} onClick={() => {}}>
            <HistoryIcon color={theme.textColor} />
            History
          </GhostButton>
          <Row align="center" gap={10}>
            <SmallText> Balance: 125 </SmallText>
            <GhostButton onClick={() => {}}>Max</GhostButton>
          </Row>
        </Row>
        <Column align="center">
          <AssetChainInput
            selectedAssetDenom="uatom"
            value="50"
            onChangeValue={() => {}}
          />
          <SwapFlowBridge />
          <AssetChainInput value="0" onChangeValue={() => {}} />
        </Column>
        <MainButton label="Connect Wallet" icon={ICONS.plus} />

        <GhostButton
          gap={5}
          align="center"
          justify="space-between"
          disabled
          onClick={() =>
            modal.show({
              drawer: true,
              container,
              onOpenChange: (open: boolean) =>
                open ? setDrawerOpen(true) : setDrawerOpen(false),
            })
          }
        >
          <SwapFlowFlooterItems />
        </GhostButton>
      </Column>
      <div
        id="swap-flow-settings-container"
        ref={(element) => element && setContainer(element)}
      ></div>
    </>
  );
};
