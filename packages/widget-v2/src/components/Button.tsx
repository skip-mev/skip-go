import { css, styled } from 'styled-components';
import { FlexProps, flexProps } from './Layout';

export const removeButtonStyles = css`
  background: none;
  border: none;
  padding: 0;
  outline: inherit;
`;

export const Button = styled.button<FlexProps>`
  ${removeButtonStyles}
  &:hover {
    cursor: pointer;
  }
  ${flexProps};
`;
