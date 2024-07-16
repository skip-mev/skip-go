import { styled } from 'styled-components';

export const StyledSecondarySearchInput = styled.input`
  background-color: ${(props) => props.theme.secondary.backgroundColor};
  border-color: ${(props) => props.theme.secondary.borderColor};
  &::placeholder {
    color: ${(props) => props.theme.secondary.textColor};
  }
`;
