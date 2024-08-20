import type { Meta, StoryObj } from '@storybook/react';
import { renderLightAndDarkTheme } from './renderLightAndDarkTheme';
import { SwapExecutionPage } from '@/pages/SwapExecutionPage/SwapExecutionPage';
import NiceModal from '@ebay/nice-modal-react';
import { destinationAssetAtom } from '@/state/swapPage';
import { useAtom } from 'jotai';
import operations from '@/pages/SwapExecutionPage/operations.json';
import { skipAssets } from '@/state/skipClient';
import { useEffect, useState } from 'react';

const meta = {
  title: 'Pages/SwapExecutionPage',
  component: (props) => {
    const [_sourceAsset, setSourceAsset] = useAtom(destinationAssetAtom);
    const [_destinationAsset, setDestinationAsset] =
      useAtom(destinationAssetAtom);
    const [shouldRender, setShouldRender] = useState(false);
    const firstOperation = operations[0];
    const lastOperation = operations[operations.length - 1];

    const [{ data: assets }] = useAtom(skipAssets);

    const sourceAsset = assets?.find(
      (asset) => asset.denom === firstOperation.denomIn
    );
    const destinationAsset = assets?.find(
      (asset) => asset.denom === lastOperation.denomOut
    );

    useEffect(() => {
      setSourceAsset(sourceAsset);
      setDestinationAsset(destinationAsset);

      if (sourceAsset && destinationAsset) {
        setShouldRender(true);
      }
    }, [sourceAsset, destinationAsset]);
    if (shouldRender) {
      return renderLightAndDarkTheme(
        <NiceModal.Provider>
          <SwapExecutionPage {...props} />
        </NiceModal.Provider>,
        undefined,
        true
      );
    }
    return null;
  },
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SwapExecutionPage>;
type Story = StoryObj<typeof meta>;

export default meta;

export const SwapExecutionPageExample: Story = {
  args: {},
};
