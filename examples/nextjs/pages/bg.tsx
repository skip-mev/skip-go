import { SwapWidget } from '@skip-go/widget';
import background from './background.svg';

const WithBackground = () => {

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('${background.src}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-185px)',
      }}>
        <SwapWidget />
      </div>
    </div>
  );
};

export default WithBackground;
