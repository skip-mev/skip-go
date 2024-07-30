import { Preview } from '@storybook/react';
import React from 'react';
import { ShadowDomAndProviders } from '../src/widget/ShadowDomAndProviders';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <ShadowDomAndProviders>
          <Story />
        </ShadowDomAndProviders>
      </div>
    ),
  ],
};

export default preview;
