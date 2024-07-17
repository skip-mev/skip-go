import { NextPage } from 'next';
import React from 'react';
import { initializeSwapWidget } from '@skip-go/widget';

const WebComponent: NextPage = () => {
  initializeSwapWidget();

  return (
    <div
      style={{
        width: '450px',
        height: '820px',
      }}
    >
      <skip-widget
        default-route={JSON.stringify({
          srcChainID: 'osmosis-1',
          srcAssetDenom:
            'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
        })}
      ></skip-widget>
    </div>
  );
};

export default WebComponent;
