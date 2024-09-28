'use client'
import { SwapWidget } from '@skip-go/widget';

const Home = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 20
      }}
    >
      <SwapWidget></SwapWidget>
    </div>
  );
};

export default Home;
