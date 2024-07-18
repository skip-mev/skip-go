import { NextPage } from 'next';
import React, { useState } from 'react';
import { SwapWidget } from '@skip-go/widget';
import crypto from 'crypto';
import { PartialTheme } from '@skip-go/widget/build/ui/theme';

function hashString(inputString: string) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex');
}

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const defaultProps = {
  defaultRoute: {
    srcChainID: 'osmosis-1',
    srcAssetDenom:
      'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
  },
};

const darkTheme = {
  backgroundColor: '#191A1C',
  textColor: '#E6EAE9',
  borderColor: '#363B3F',
  brandColor: '#FF4FFF',
  highlightColor: '#1F2022',
};

const defaultHash = hashString(JSON.stringify(defaultProps));

const Home: NextPage = () => {
  const [props, setProps] = useState(defaultProps);
  const [propsHash, setPropsHash] = useState(defaultHash);

  const handleOnChange = (event: any) => {
    if (isJsonString(event.target.innerText)) {
      const newHash = hashString(event.target.innerText);
      if (propsHash !== newHash) {
        console.log('update props');
        setProps({ ...JSON.parse(event.target.innerText) });
        setPropsHash(newHash);
      }
    }
  };

  const handleUpdateTheme = (theme: PartialTheme) => {
    const newProps = { ...props, theme: theme } as any;
    const newHash = hashString(JSON.stringify(newProps));
    setProps(newProps);
    setPropsHash(newHash);
  };

  return (
    <div style={{ display: 'flex', gap: 50 }}>
      <div
        style={{
          width: '450px',
          height: '820px',
          flexShrink: 0,
        }}
      >
        <SwapWidget {...props} key={propsHash} />
      </div>
      <div>
        <div style={{ display: 'flex' }}>
          <button
            onClick={() => {
              if (
                window.confirm('Are you sure you want to purge all settings?')
              ) {
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
          <button
            style={{
              height: '40px',
            }}
            onClick={() => handleUpdateTheme(undefined)}
          >
            Default Theme
          </button>
          <button
            style={{
              height: '40px',
            }}
            onClick={() => handleUpdateTheme(darkTheme)}
          >
            Dark Theme
          </button>
        </div>

        <pre
          contentEditable="true"
          onBlur={handleOnChange}
          style={{
            border: '1px solid black',
            padding: 20,
            fontSize: '20px',
            color: 'black',
          }}
        >
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Home;
