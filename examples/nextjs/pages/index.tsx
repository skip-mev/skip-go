import { NextPage } from 'next';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { EVMConnect } from '../components/EVMConnect';

const Home: NextPage = () => {
  return (
    <div>
      <EVMConnect />
    </div>
  );
};

export default Home;
