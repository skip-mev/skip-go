import { NextPage } from 'next';
import React from 'react';
import { SwapWidget, SwapWidgetProvider } from '@skip-go/widget';
import { NoSSR } from '../components/NoSSR';

const Home: NextPage = () => {
  return (
    <NoSSR>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidgetProvider>
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
        </SwapWidgetProvider>
      </div>
    </NoSSR>
  );
};

export default Home;
