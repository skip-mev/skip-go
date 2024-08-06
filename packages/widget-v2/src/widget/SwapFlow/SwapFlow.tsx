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
import { SwapFlowBridge } from './SwapFlowBridge';
import { sourceAtom, destinationAtom } from '../../state/swap';
import { useAtom } from 'jotai';

const sourceAssetBalance = 125;

export const SwapFlow = () => {
  const theme = useTheme();
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAtom);

  const modal = useModal(SwapFlowSettings);

  return (
    <>
      <Column
        gap={5}
        style={{
          opacity: drawerOpen ? 0.3 : 1,
        }}
      >
        <Row justify="space-between">
          <GhostButton gap={5} onClick={() => {}}>
            <HistoryIcon color={theme.textColor} />
            History
          </GhostButton>
          {!!sourceAssetBalance && (
            <Row align="center" gap={10}>
              <SmallText> Balance: {sourceAssetBalance} </SmallText>
              <GhostButton onClick={() => {}}>Max</GhostButton>
            </Row>
          )}
        </Row>
        <Column align="center">
          <AssetChainInput
            selectedAssetDenom={sourceAsset.denom}
            value={sourceAsset.amount}
            onChangeValue={(newValue) =>
              setSourceAsset((old) => ({ ...old, amount: newValue }))
            }
          />
          <SwapFlowBridge />
          <AssetChainInput
            selectedAssetDenom={destinationAsset.denom}
            value={destinationAsset.amount}
            onChangeValue={(newValue) =>
              setDestinationAsset((old) => ({ ...old, amount: newValue }))
            }
          />
        </Column>
        <MainButton label="Connect Wallet" icon={ICONS.plus} />

        <GhostButton
          gap={5}
          align="center"
          justify="space-between"
          onClick={() =>
            modal.show({
              drawer: true,
              container,
              onOpenChange: (open: boolean) =>
                open ? setDrawerOpen(true) : setDrawerOpen(false),
              theme,
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
