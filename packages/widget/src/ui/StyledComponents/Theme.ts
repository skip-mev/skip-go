import { styled } from 'styled-components';

export const StyledPrimaryDiv = styled.div`
  background-color: ${(props) => props.theme.primary.backgroundColor};
  color: ${(props) => props.theme.primary.textColor};
  border-color: ${(props) => props.theme.primary.borderColor};
`;

export const StyledPrimaryBrandDiv = styled.div`
  background-color: ${(props) => props.theme.primary.brandColor};
`;

export const StyledBorderColor = styled.div`
  border-color: ${(props) => props.theme.primary.borderColor};
`;
