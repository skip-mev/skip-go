import 'styled-components';
import { opacityToHex } from '../utils/colors';

export const defaultTheme = {
  backgroundColor: 'black',
  textColor: 'white',
  brandColor: '#ff66ff',
  primary: {
    background: {
      normal: '#000',
      transparent: '#000000' + opacityToHex(90),
    },
    text: {
      normal: '#fff',
      lowContrast: '#ffffff' + opacityToHex(50),
      ultraLowContrast: '#ffffff' + opacityToHex(20),
    },
    ghostButtonHover: '#000000' + opacityToHex(40),
  },
  secondary: {
    background: '#141414',
    transparent: '#252525' + opacityToHex(70),
  },
  success: {
    text: '#6fde00',
  },
  warning: {
    background: '#411f00',
    text: '#ff7a00',
  },
  error: {
    background: '#430000',
    text: '#ff1616',
  },
};

export const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  brandColor: 'darkblue',
  primary: {
    background: {
      normal: '#ffffff',
      transparent: '#ffffff' + opacityToHex(95),
    },
    text: {
      normal: '#000000',
      lowContrast: '#000000' + opacityToHex(45),
      ultraLowContrast: '#000000' + opacityToHex(10),
    },
    ghostButtonHover: '#ffffff' + opacityToHex(90),
  },
  secondary: {
    background: '#f1f1f1',
    transparent: '#eeeeee' + opacityToHex(90),
  },
  success: {
    text: '#6bcf07',
  },
  warning: {
    background: '#ffe2c8',
    text: '#ef7404',
  },
  error: {
    background: '#ffcbcb',
    text: '#ef1e1e',
  },
};

export type PartialTheme = Partial<Theme> | undefined;

export type Theme = {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  brandColor: string;
  highlightColor: string;
  primary: {
    background: string;
    transparent: string;
    text: {
      normal: string;
      lowContrast: string;
      ultraLowContrast: string;
    };
    ghostButtonHover: string;
  };
  secondary: {
    background: string;
    transparent: {
      normal: string;
      transparent: string;
    };
  };
  success: {
    text: string;
  };
  warning: {
    background: string;
    text: string;
  };
  error: {
    background: string;
    text: string;
  };
};

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
