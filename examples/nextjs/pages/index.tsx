import { NextPage } from 'next';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { EVMConnect } from '../components/EVMConnect';
import { SwapWidget, WidgetProvider } from '@skip-go/widget';

const Home: NextPage = () => {
  return (
    <div>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <WidgetProvider>
          <SwapWidget />
        </WidgetProvider>
      </div>
    </div>
  );
};

export default Home;
