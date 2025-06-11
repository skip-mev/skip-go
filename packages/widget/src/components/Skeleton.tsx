import { css, keyframes, styled } from "styled-components";
import { getHexColor, opacityToHex } from "@/utils/colors";
import { toPxValue } from "@/utils/style";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const SkeletonElement = styled.div<{
  width: number | string;
  height: number | string;
}>`
  ${({ width, height, theme }) => css`
    width: ${toPxValue(width)};
    height: ${toPxValue(height)};
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      ${getHexColor(theme.primary.text.normal ?? "") + opacityToHex(10)} 25%,
      ${getHexColor(theme.primary.text.normal ?? "") + opacityToHex(20)} 50%,
      ${getHexColor(theme.primary.text.normal ?? "") + opacityToHex(10)} 75%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s linear infinite;
  `}
`;

export const CircleSkeletonElement = styled(SkeletonElement)`
  border-radius: 50%;
`;
