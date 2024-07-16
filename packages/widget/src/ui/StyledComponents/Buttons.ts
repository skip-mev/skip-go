import { styled } from 'styled-components';

export const StyledButton = styled.button`
  color: ${(props) => props.theme.primary.textColor};
  fill: ${(props) => props.theme.primary.textColor};
  &:hover {
    background-color: ${(props) => props.theme.secondary.backgroundColor};
  }
`;
