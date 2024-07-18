import { styled } from 'styled-components';

export const StyledThemedDiv = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  border-color: ${(props) => props.theme.borderColor};
`;

export const StyledBrandDiv = styled.div`
  background-color: ${(props) => props.theme.brandColor};
`;

export const StyledBorderDiv = styled.div`
  border-color: ${(props) => props.theme.borderColor};
`;
