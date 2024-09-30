import { styled } from "@linaria/react";

export type FlexProps = {
  align?: string;
  justify?: string;
  gap?: number;
  padding?: number;
  borderRadius?: number;
};

export const flexProps = ({ align, justify, gap, padding, borderRadius }: FlexProps) => `
  display: flex;
  ${align ? `align-items: ${align};` : ""}
  ${justify ? `justify-content: ${justify};` : ""}
  ${gap ? `gap: ${gap}px;` : ""}
  ${padding ? `padding: ${padding}px;` : ""}
  ${borderRadius ? `border-radius: ${borderRadius}px;` : ""}
`;

export const Row = styled.div<FlexProps>`
  ${(props) => flexProps(props)};
  flex-direction: row;
`;

export const Column = styled(Row)`
  flex-direction: column;
`;

export const Spacer = styled.div<SpacerProps>`
  ${({ width }) => width ? `width: ${width}px` : ""};
  ${({ height }) => height ? `height: ${height}px` : ""};
  flex-shrink: 0;
  flex-grow: 0;
`;

type SpacerProps = {
  width?: number;
  height?: number;
};
