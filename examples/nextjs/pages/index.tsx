import { NextPage } from 'next';
import { SwapWidget } from '@skip-go/widget';
import '@skip-go/widget/style.css';

const Home: NextPage = () => {
  return (
    <div>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidget
          colors={{
            primary: '#FF4FFF',
          }}
          onlyTestnet
        />
      </div>
    </div>
  );
};

export default Home;
