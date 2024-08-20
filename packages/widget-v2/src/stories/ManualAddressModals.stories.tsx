import type { Meta } from '@storybook/react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Row } from '@/components/Layout';
import { defaultTheme, lightTheme } from '@/widget/theme';
import { ManualAddressModal } from '@/modals/ManualAddressModal/ManualAddressModal';
import { useEffect, useState } from 'react';
import { skipAssets } from '@/state/skip';
import { destinationAssetAtom } from '@/state/swap';
import { useAtom } from 'jotai';

const meta = {
  title: 'Modals/ManualAddressModal',
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof ManualAddressModal>;

export default meta;

export const ManualAddressModalsExample = () => {
  const modal = useModal(ManualAddressModal);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);
  const [shouldRender, setShouldRender] = useState(false);

  const [{ data: assets }] = useAtom(skipAssets);

  const asset = assets?.find((asset) => asset.denom === 'uatom');

  useEffect(() => {
    setDestinationAsset(asset);

    if (destinationAsset) {
      setShouldRender(true);
    }
  }, [asset, destinationAsset]);
  if (shouldRender) {
    return (
      <NiceModal.Provider>
        <Row gap={10}>
          <button
            onClick={() =>
              modal.show({
                theme: defaultTheme,
              })
            }
          >
            Show dark mode
          </button>
          <button
            onClick={() =>
              modal.show({
                theme: lightTheme,
              })
            }
          >
            Show light mode
          </button>
        </Row>
      </NiceModal.Provider>
    );
  }
  return null;
};
