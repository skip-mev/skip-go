import { convertToPxValue } from "@/utils/style";
import { styled } from "@/styled-components";
import { FlexProps, flexProps } from "@/components/Layout";

type BadgeProps = {
  variant?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  background?: string;
};

export const Badge = styled.div<BadgeProps & FlexProps>`
  position: relative;
  font-family: "ABCDiatype", sans-serif;
  font-size: 13px;
  display: flex;
  width: fit-content;
  height: ${({ height }) => (height ? convertToPxValue(height) : "fit-content")};
  border-radius: 100px;
  padding: 6px 8px;
  color: ${({ theme }) => theme.primary.text.lowContrast};
  background: ${({ theme }) => theme.secondary.background.normal};
  ${({ color }) => `color: ${color};`};
  ${({ background }) => `background: ${background};`};
  ${flexProps};
`;
