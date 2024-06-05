import type { Meta, StoryObj } from '@storybook/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { SwapWidget } from './Widget';
import { WidgetProvider } from '../provider';

export const EVMConnect = () => {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        <button type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  );
};

const meta: Meta<typeof SwapWidget> = {
  title: 'Skip/SwapWidget',
  component: SwapWidget,
  decorators: [
    Story => (
      <WidgetProvider>
        <EVMConnect />
        <SwapWidget />
      </WidgetProvider>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof SwapWidget>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
