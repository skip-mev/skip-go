import { cloneElement, ComponentProps, CSSProperties, ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";
import { defaultTheme, lightTheme } from "@/widget/theme";
import { Column } from "@/components/Layout";
import React from "react";

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
export const renderLightAndDarkThemeSeperateProps = <
  T extends React.ComponentType
>(
  render: React.ReactElement<ComponentProps<T>>,
  defaultProps: Partial<ComponentProps<T>>,
  lightProps: Partial<ComponentProps<T>>
): React.ReactElement => {
  const renderDarkElement = cloneElement(render, defaultProps);
  const renderLightElement = cloneElement(render, lightProps);

  return (
    <StyledWrapper gap={10} align="center">
      <ThemeProvider theme={defaultTheme}>{renderDarkElement}</ThemeProvider>
      <ThemeProvider theme={lightTheme}>{renderLightElement}</ThemeProvider>
    </StyledWrapper>
  );
};
export const StyledWrapper = styled(Column) <{ row?: boolean }>`
  ${({ row }) => row && "flex-direction: row;"}
  padding: 20px;
`;
