import { styled } from 'styled-components';

export const StyledPrimaryButton = styled.button`
  background-color: ${(props) => props.theme.primary.backgroundColor};
  color: ${(props) => props.theme.primary.textColor};
  fill: ${(props) => props.theme.primary.textColor};
  &:hover {
    background-color: ${(props) => props.theme.secondary.backgroundColor};
  }
`;

export const StyledSecondaryButton = styled.button`
  background-color: ${(props) => props.theme.secondary.backgroundColor};
  border-color: ${(props) => props.theme.secondary.borderColor};
  color: ${(props) => props.theme.secondary.textColor};
`;
