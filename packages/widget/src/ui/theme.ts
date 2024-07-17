import 'styled-components';

export const defaultTheme = {
  backgroundColor: 'white',
  textColor: 'black',
  borderColor: 'rgb(229 229 229)',
  brandColor: 'rgb(255, 72, 110)',
  highlightColor: 'rgb(245, 245, 245)',
};

export type PartialTheme = Partial<Theme> | undefined;

export type Theme = {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  brandColor: string;
  highlightColor: string;
};

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
