import { css, styled } from "styled-components";

export type FlexProps = {
  align?: string;
  justify?: string;
  gap?: number;
  padding?: number;
  borderRadius?: number;
  flexDirection?: "row" | "column";
};

type SizeValue = string | number;

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
  ${({ width }) =>
    width !== undefined && `width: ${typeof width === "number" ? `${width}px` : width}`};
  ${({ height }) =>
    height !== undefined && `height: ${typeof height === "number" ? `${height}px` : height}`};
  flex-direction: row;
  ${flexProps};
`;

export const Column = styled(Row)`
  flex-direction: column;
`;

export const Spacer = styled.div<SpacerProps>`
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
  ${({ width }) =>
    width !== undefined && `width: ${typeof width === "number" ? `${width}px` : width}`};
  ${({ height }) =>
    height !== undefined && `height: ${typeof height === "number" ? `${height}px` : height}`};

  ${({ showLine, lineColor = "#ccc", lineThickness = 1 }) =>
    showLine &&
    `
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: ${lineThickness}px;
        background-color: ${lineColor};
        transform: translateY(-50%);
      }
    `}
`;

type SpacerProps = {
  width?: SizeValue;
  height?: SizeValue;
  showLine?: boolean;
  lineColor?: string;
  lineThickness?: number;
};
