import { useTheme } from 'styled-components';
import { AssetChainInput } from '../../components/AssetChainInput';
import { GhostButton } from '../../components/Button';
import { Column, Row } from '../../components/Layout';
import { MainButton } from '../../components/MainButton';
import { SmallText } from '../../components/Typography';
import { ICONS } from '../../icons';
import { HistoryIcon } from '../../icons/HistoryIcon';
import { useCallback, useMemo, useState } from 'react';
import { SwapFlowSettings } from './SwapFlowSettings';
import { useModal } from '@ebay/nice-modal-react';
import { SwapFlowFlooterItems } from './SwapFlowFooterItems';
import { SwapFlowBridge } from './SwapFlowBridge';
import { sourceAtom, destinationAtom } from '../../state/swap';
import { useAtom } from 'jotai';
import { TokenAndChainSelectorFlow } from '../TokenAndChainSelectorFlow/TokenAndChainSelectorFlow';
import { getChainsContainingAsset, skipAssets } from '../../state/skip';

const sourceAssetBalance = 125;

export const SwapFlow = () => {
  const theme = useTheme();
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAtom);
  const [{ data: assets }] = useAtom(skipAssets);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAtom);

  const swapFlowSettings = useModal(SwapFlowSettings);
  const tokenAndChainSelectorFlow = useModal(TokenAndChainSelectorFlow);

  const chainsContainingSourceAsset = useMemo(() => {
    if (!assets || !sourceAsset?.symbol) return;
    const chains = getChainsContainingAsset(sourceAsset?.symbol, assets);
    return chains;
  }, [sourceAsset?.symbol]);

  const chainsContainingDestinationAsset = useMemo(() => {
    if (!assets || !destinationAsset?.symbol) return;
    const chains = getChainsContainingAsset(destinationAsset?.symbol, assets);
    return chains;
  }, [destinationAsset?.symbol]);

  const handleChangeSourceAsset = useCallback(() => {
    tokenAndChainSelectorFlow.show({
      theme,
      onSelect: (asset) => {
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorFlow.hide();
      },
    });
  }, []);

  const handleChangeSourceChain = useCallback(() => {
    if (!chainsContainingSourceAsset) return;

    return tokenAndChainSelectorFlow.show({
      theme,
      onSelect: (asset) => {
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorFlow.hide();
      },
      chainsContainingAsset: chainsContainingSourceAsset,
      asset: sourceAsset,
    });
  }, [chainsContainingSourceAsset, sourceAsset]);

  const handleChangeDestinationAsset = useCallback(() => {
    tokenAndChainSelectorFlow.show({
      theme,
      onSelect: (asset) => {
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorFlow.hide();
      },
    });
  }, []);

  const handleChangeDestinationChain = useCallback(() => {
    if (!chainsContainingDestinationAsset) return;

    return tokenAndChainSelectorFlow.show({
      theme,
      onSelect: (asset) => {
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorFlow.hide();
      },
      chainsContainingAsset: chainsContainingDestinationAsset,
      asset: destinationAsset,
    });
  }, [chainsContainingDestinationAsset, destinationAsset]);

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
            selectedAssetDenom={sourceAsset?.denom}
            handleChangeAsset={handleChangeSourceAsset}
            handleChangeChain={handleChangeSourceChain}
            value={sourceAsset?.amount ?? '0'}
            onChangeValue={(newValue) =>
              setSourceAsset((old) => ({ ...old, amount: newValue }))
            }
          />
          <SwapFlowBridge />
          <AssetChainInput
            selectedAssetDenom={destinationAsset?.denom}
            handleChangeAsset={handleChangeDestinationAsset}
            handleChangeChain={handleChangeDestinationChain}
            value={destinationAsset?.amount ?? '0'}
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
            swapFlowSettings.show({
              theme,
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
