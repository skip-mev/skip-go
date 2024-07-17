import { NextPage } from 'next';
import { useEffect } from 'react';
import { initializeSwapWidget } from '@skip-go/widget';

const VuePage: NextPage = () => {
  initializeSwapWidget();

  useEffect(() => {
    const { createApp } = require('vue/dist/vue.esm-bundler.js');
    const app = createApp({
      setup() {
        const defaultRoute = JSON.stringify({
          srcChainID: 'osmosis-1',
          srcAssetDenom:
            'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
        });

        return {
          defaultRoute,
        };
      },
      template: `
        <div style="width:450px;height:820px;">
          <skip-widget :default-route="defaultRoute"></skip-widget>
        </div>
      `,
    });

    (app.config.compilerOptions.isCustomElement = (tag: string) =>
      ['skip-widget'].includes(tag)),
      app.mount('#vue');

    return () => {
      app.unmount();
    };
  }, []);

  return <div id="vue" />;
};

export default VuePage;
