import { CSSProperties, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { defaultTheme, lightTheme } from '../widget/theme';
import { Column } from '../components/Layout';

export const renderLightAndDarkTheme = (
  render: ReactNode,
  style?: CSSProperties,
  row?: boolean
) => {
  return (
    <StyledWrapper gap={10} align="center" style={style} row={row}>
      <ThemeProvider theme={defaultTheme}>{render}</ThemeProvider>
      <ThemeProvider theme={lightTheme}>{render}</ThemeProvider>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Column)<{ row?: boolean }>`
  ${({ row }) => row && 'flex-direction: row;'}
  background-color: gray;
  padding: 20px;
`;
