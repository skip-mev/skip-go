import type { Meta, StoryObj } from '@storybook/react';
import { renderLightAndDarkTheme } from './renderLightAndDarkTheme';
import { SwapExecutionFlow } from '../widget/SwapExecutionFlow/SwapExecutionFlow';
import NiceModal from '@ebay/nice-modal-react';
import { destinationAssetAtom } from '../state/swap';
import { useAtom } from 'jotai';
import operations from '../widget/SwapExecutionFlow/operations.json';
import { skipAssets } from '../state/skip';
import { useEffect, useState } from 'react';

const meta = {
  title: 'Flows/SwapExecutionFlow',
  component: (props) => {
    const [_sourceAsset, setSourceAsset] = useAtom(destinationAssetAtom);
    const [_destinationAsset, setDestinationAsset] =
      useAtom(destinationAssetAtom);
    const [shouldRender, setShouldRender] = useState(false);
    const firstOperation = props.operations[0];
    const lastOperation = props.operations[props.operations.length - 1];

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
          <SwapExecutionFlow {...props} />
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
} satisfies Meta<typeof SwapExecutionFlow>;
type Story = StoryObj<typeof meta>;

export default meta;

export const SwapExecutionFlowExample: Story = {
  args: {
    operations,
  },
};
