import { NextPage } from 'next';
import { SwapWidget } from '@skip-go/widget';

const Home: NextPage = () => {
  return (
    <div style={{ display: 'flex', gap: 50 }}>
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
          defaultRoute={{
            srcChainID: 'osmosis-1',
            srcAssetDenom:
              'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
          }}
        />
      </div>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidget
          theme={{
            primary: {
              backgroundColor: 'black',
              textColor: 'white',
              borderColor: 'gray',
            },
            secondary: {
              backgroundColor: 'grey',
              textColor: 'white',
              borderColor: 'darkgray',
            },
          }}
          defaultRoute={{
            srcChainID: 'osmosis-1',
            srcAssetDenom:
              'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
          }}
        />
      </div>
    </div>
  );
};

export default Home;
