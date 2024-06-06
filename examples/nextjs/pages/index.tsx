import { NextPage } from 'next';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { EVMConnect } from '../components/EVMConnect';
import { SwapWidget } from 'widget';

const Home: NextPage = () => {
  return (
    <div>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidget />
      </div>
    </div>
  );
};

export default Home;
