import { useTheme } from 'styled-components';
import { useCallback, useMemo, useState } from 'react';
import { useModal } from '@ebay/nice-modal-react';
import { useAtom } from 'jotai';
import { AssetChainInput } from '@/components/AssetChainInput';
import { Column } from '@/components/Layout';
import { MainButton } from '@/components/MainButton';
import { SmallText } from '@/components/Typography';
import { ICONS } from '@/icons';
import { skipAssets, getChainsContainingAsset } from '@/state/skip';
import { sourceAssetAtom, destinationAssetAtom } from '@/state/swap';
import { TokenAndChainSelectorModal } from '@/modals/TokenAndChainSelectorModal/TokenAndChainSelectorModal';
import { SwapPageSettings } from './SwapPageSettings';
import { SwapPageFooter } from './SwapPageFooter';
import { SwapPageBridge } from './SwapPageBridge';
import { SwapPageHeader } from './SwapPageHeader';

const sourceAssetBalance = 125;

export const SwapPage = () => {
  const theme = useTheme();
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [{ data: assets }] = useAtom(skipAssets);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);

  const swapFlowSettings = useModal(SwapPageSettings);
  const tokenAndChainSelectorFlow = useModal(TokenAndChainSelectorModal);

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

        console.log(asset);
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
        <SwapPageHeader
          leftButton={{
            label: 'History',
            icon: ICONS.history,
          }}
          rightButton={{
            label: 'Max',
          }}
          rightContent={
            sourceAssetBalance ? (
              <SmallText> Balance: {sourceAssetBalance} </SmallText>
            ) : undefined
          }
        />
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
          <SwapPageBridge />
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

        <SwapPageFooter
          showRouteInfo
          onClick={() =>
            swapFlowSettings.show({
              theme,
              drawer: true,
              container,
              onOpenChange: (open: boolean) =>
                open ? setDrawerOpen(true) : setDrawerOpen(false),
            })
          }
        />
      </Column>
      <div
        id="swap-flow-settings-container"
        ref={(element) => element && setContainer(element)}
      ></div>
    </>
  );
};
