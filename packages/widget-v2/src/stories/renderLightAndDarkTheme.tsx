import { ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { defaultTheme, lightTheme } from '../widget/theme';
import { Column } from '../components/Layout';

export const renderLightAndDarkTheme = (render: ReactNode) => {
  return (
    <StyledWrapper gap={10}>
      <ThemeProvider theme={defaultTheme}>{render}</ThemeProvider>
      <ThemeProvider theme={lightTheme}>{render}</ThemeProvider>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Column)`
  background-color: gray;
  padding: 20px;
`;
