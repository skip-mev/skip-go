import { styled } from 'styled-components';

export const StyledSearchInput = styled.input`
  background-color: ${(props) => props.theme.highlightColor};
  border-color: ${(props) => props.theme.borderColor};
  &::placeholder {
    color: ${(props) => props.theme.textColor};
  }
`;
