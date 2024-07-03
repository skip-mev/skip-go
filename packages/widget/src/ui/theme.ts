export const defaultTheme = {
  primary: {
    backgroundColor: 'yellow',
    textColor: 'black',
  },
  secondary: {
    backgroundColor: '',
    textColor: '',
  }
};

declare module 'styled-components' {
  export interface DefaultTheme {
    primary: {
      backgroundColor: string;
      textColor: string;
    },
    secondary: {
      backgroundColor: string;
      textColor: string;
    }
  }
}
