import { NextPage } from 'next';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { EVMConnect } from '../components/EVMConnect';
import { SwapWidget } from 'widget';

const Home: NextPage = () => {
  return (
    <div>
      <EVMConnect />
      <SwapWidget />
    </div>
  );
};

export default Home;
