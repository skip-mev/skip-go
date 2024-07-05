import { NextPage } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';
import {
  SwapWidget,
  SwapWidgetProvider,
  initializeSwapWidget,
} from '@skip-go/widget';

const NoSsrBase = (props: any) => <>{props.children}</>;

const NoSSR = dynamic(() => Promise.resolve(NoSsrBase), {
  ssr: false,
});

const Home: NextPage = () => {
  initializeSwapWidget();

  return (
    <NoSSR>
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
        </div>
      </div>
    </NoSSR>
  );
};

export default Home;
