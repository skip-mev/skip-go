import 'styled-components';

export const defaultTheme = {
  backgroundColor: 'black',
  textColor: 'white',
  borderColor: 'rgb(229 229 229)',
  brandColor: '#FF66FF',
  highlightColor: 'rgb(245, 245, 245)',
  secondary: {
    background: '#141414',
  },
};

export const lightTheme = {
  backgroundColor: 'white',
  textColor: 'black',
  borderColor: 'rgb(229 229 229)',
  brandColor: '#FF66FF',
  highlightColor: 'rgb(245, 245, 245)',
  secondary: {
    background: '#F1F1F1',
  },
};

export type PartialTheme = Partial<Theme> | undefined;

export type Theme = {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  brandColor: string;
  highlightColor: string;
  secondary: {
    background: string;
  };
};

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
