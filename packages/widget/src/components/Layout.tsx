import { css, styled } from "styled-components";

export type FlexProps = {
  align?: string;
  justify?: string;
  gap?: number;
  padding?: number;
  borderRadius?: number;
};

export const flexProps = css<FlexProps>`
  display: flex;
  ${({ align }) => align && `align-items: ${align}`};
  ${({ justify }) => justify && `justify-content: ${justify}`};
  ${({ gap }) => gap && `gap: ${gap}px`};
  ${({ padding }) => padding && `padding: ${padding}px`};
  ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius}px`};
`;

export const Row = styled.div<FlexProps>`
  ${flexProps};
  flex-direction: row;
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

export const PageContainer = styled(Column).attrs({
  gap: 5
})`
  width: 500px;
  position: relative;
  padding: 0 10px;
  @media (max-width: 500px) {
    width: 100%;
  }
`;