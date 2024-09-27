import { NextPage } from 'next';
import React from 'react';
import { SwapWidget } from '@skip-go/widget';

const Home: NextPage = () => {
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
