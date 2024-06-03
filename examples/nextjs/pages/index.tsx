import { NextPage } from 'next';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { EVMConnect } from '../components/EVMConnect';
import { WidgetButton } from 'widget';

const Home: NextPage = () => {
  return (
    <div>
      <EVMConnect />
      <WidgetButton />
    </div>
  );
};

export default Home;
