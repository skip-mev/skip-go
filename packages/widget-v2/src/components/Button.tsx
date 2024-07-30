import { styled } from 'styled-components';
import { FlexProps, flexProps } from './Layout';

export const Button = styled.button<FlexProps>`
  all: unset;
  &:hover {
    cursor: pointer;
  }
  ${flexProps};
`;
