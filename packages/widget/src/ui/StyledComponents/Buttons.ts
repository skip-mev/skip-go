import { styled } from 'styled-components';

export const StyledThemedButton = styled.button`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  fill: ${(props) => props.theme.textColor};
  border-color: ${(props) => props.theme.borderColor};
  &:hover {
    background-color: ${(props) => props.theme.highlightColor};
  }
`;

export const StyledHighlightButton = styled.button`
  background-color: ${(props) => props.theme.highlightColor};
  border-color: ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.textColor};
`;
