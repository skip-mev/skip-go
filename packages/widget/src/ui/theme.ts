import 'styled-components';

export const defaultTheme = {
  primary: {
    backgroundColor: 'white',
    textColor: 'black',
  },
  secondary: {
    backgroundColor: 'rgb(245, 245, 245)',
    textColor: 'black',
  },
};

export type Theme = {
  primary: {
    backgroundColor: string;
    textColor: string;
  };
  secondary: {
    backgroundColor: string;
    textColor: string;
  };
};

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
