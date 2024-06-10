import { NextPage } from 'next';
import { SwapWidget } from '@skip-go/widget';

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
        />
      </div>
    </div>
  );
};

export default Home;
