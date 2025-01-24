import { css, styled } from "styled-components";

export type FlexProps = {
  align?: string;
  justify?: string;
  gap?: number;
  padding?: number;
  borderRadius?: number;
  flexDirection?: "row" | "column";
};

export const flexProps = css<FlexProps>`
  display: flex;
  ${({ align }) => align && `align-items: ${align}`};
  ${({ justify }) => justify && `justify-content: ${justify}`};
  ${({ gap }) => gap && `gap: ${gap}px`};
  ${({ padding }) => padding && `padding: ${padding}px`};
  ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius}px`};
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection}`};
`;

export const Row = styled.div<SpacerProps & FlexProps>`
  ${({ width }) => width && `width: ${width}px`};
  ${({ height }) => height && `height: ${height}px`};
  flex-direction: row;
  ${flexProps};
`;

export const Column = styled(Row)`
  flex-direction: column;
`;

export const Spacer = styled.div<SpacerProps>`
  ${({ width }) => width && `width: ${width}px`};
  ${({ height }) => height && `height: ${height}px`};
  flex-shrink: 0;
  flex-grow: 0;
`;

type SpacerProps = {
  width?: number;
  height?: number;
};
