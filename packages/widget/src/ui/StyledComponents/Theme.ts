import { styled } from 'styled-components';

export const StyledPrimaryDiv = styled.div`
  background-color: ${(props) => props.theme.primary.backgroundColor};
  color: ${(props) => props.theme.primary.textColor};
`;

export const StyledPrimaryBrandDiv = styled.div`
  background-color: ${(props) => props.theme.primary.brandColor};
`;
