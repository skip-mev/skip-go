import { NextPage } from 'next';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { EVMConnect } from '../components/EVMConnect';
import { Widget } from 'widget';

const Home: NextPage = () => {
  return (
    <div>
      <EVMConnect />
      <Widget />
    </div>
  );
};

export default Home;
