import { NextPage } from 'next';
import React from 'react';
import { SwapWidgetWithoutProviders } from '@skip-go/widget';
import { SwapWidgetProvider } from '@skip-go/widget';

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidgetProvider>
          <SwapWidgetWithoutProviders
            defaultRoute={{
              srcChainID: 'osmosis-1',
              srcAssetDenom:
                'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
            }}
          />
        </SwapWidgetProvider>
      </div>
      <button
        onClick={() => {
          if (window.confirm('Are you sure you want to purge all settings?')) {
            window.localStorage.clear();
            window.sessionStorage.clear();
            window.location.reload();
          }
        }}
        style={{
          height: '40px',
        }}
      >
        Purge Settings
      </button>
    </div>
  );
};

export default Home;
