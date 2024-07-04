import { NextPage } from 'next';
import '@skip-go/widget/style.css';
import React from 'react';
import dynamic from 'next/dynamic';
import { SwapWidget, SwapWidgetProvider } from '@skip-go/widget';

import { initializeSwapWidget } from '@skip-go/widget/web-component';

const NoSsrBase = (props: any) => <>{props.children}</>;

const NoSSR = dynamic(() => Promise.resolve(NoSsrBase), {
  ssr: false,
});

const Home: NextPage = () => {
  initializeSwapWidget();

  return (
    <div style={{ display: 'flex', gap: 50 }}>
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
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <NoSSR>
          <skip-widget
            colors={JSON.stringify({
              primary: '#FF4FFF',
            })}
            default-route={JSON.stringify({
              srcChainID: 'osmosis-1',
              srcAssetDenom:
                'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
            })}
          ></skip-widget>
        </NoSSR>
      </div>
    </div>
  );
};

export default Home;
