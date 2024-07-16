import { NextPage } from 'next';
import React, { useState } from 'react';
import { SwapWidget } from '@skip-go/widget';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

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
  colors: {
    primary: '#FF4FFF',
  },
  defaultRoute: {
    srcChainID: 'osmosis-1',
    srcAssetDenom:
      'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
  },
  theme: {
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
  },
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
  return (
    <div style={{ display: 'flex', gap: 50 }}>
      <div
        style={{
          width: '450px',
          height: '820px',
        }}
      >
        <SwapWidget {...props} key={propsHash} />
      </div>
      <div>
        <pre
          contentEditable="true"
          onBlur={handleOnChange}
          style={{
            border: '1px solid black',
            padding: 20,
            fontSize: '20px',
          }}
        >
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Home;
