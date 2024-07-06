import { NextPage } from 'next';
import React from 'react';
import { SwapWidget } from '@skip-go/widget';

const Home: NextPage = () => {
  return (
    <div
      style={{
        width: '450px',
        height: '820px',
      }}
    >
      <SwapWidget
        colors={{
          primary: '#FF4FFF',
        }}
        defaultRoute={{
          srcChainID: 'osmosis-1',
          srcAssetDenom:
            'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
        }}
      />
    </div>
  );
};

export default Home;
