import 'styled-components';

export const defaultTheme = {
  primary: {
    backgroundColor: 'white',
    textColor: 'black',
    borderColor: 'rgb(229 229 229)',
    brandColor: 'rgb(255, 72, 110)',
  },
  secondary: {
    backgroundColor: 'rgb(245, 245, 245)',
    textColor: 'black',
    borderColor: 'rgb(229 229 229)',
  },
};

export type Theme = {
  primary: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    brandColor: string;
  };
  secondary: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  };
};

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
