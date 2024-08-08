import { css, styled } from 'styled-components';
import { getHexColor, opacityToHex } from '../utils/colors';

export const SkeletonElement = styled.div<{
  width: number;
  height: number;
}>`
  ${({ width, height, theme }) =>
    css`
      width: ${width}px;
      height: ${height}px;
      background-color: ${getHexColor(theme.textColor ?? '') +
      opacityToHex(10)};
    `};
`;

export const CircleSkeletonElement = styled(SkeletonElement)`
  border-radius: 50%;
`;
