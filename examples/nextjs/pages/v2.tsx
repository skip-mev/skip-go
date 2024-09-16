import { NextPage } from 'next';
import React from 'react';
import { SwapWidget } from "../../../packages/widget-v2/build/index";

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidget />
      </div>
      <button
        onClick={() => {
          if (window.confirm('Are you sure you want to purge all settings?')) {
            window.localStorage.clear();
            window.sessionStorage.clear();
            window.location.reload();
          }
        }}
        style={{
          height: '40px',
        }}
      >
        Purge Settings
      </button>
    </div>
  );
};

export default Home;
