import { styled } from 'styled-components';
import { Row } from './Layout';
import { removeButtonStyles, Text } from './Typography';
import { getHexColor, opacityToHex } from '../utils/colors';

export type ModalRowItemProps = {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export const ModalRowItem = ({
  leftContent,
  rightContent,
  onClick,
  style,
}: ModalRowItemProps) => {
  return (
    <StyledModalRowItemContainer
      as="button"
      align="center"
      justify="space-between"
      onClick={onClick}
      gap={16}
      style={style}
    >
      {typeof leftContent === 'string' ? (
        <Text fontSize={20}>{leftContent}</Text>
      ) : (
        leftContent
      )}
      {typeof rightContent === 'string' ? (
        <Text fontSize={20}>{rightContent}</Text>
      ) : (
        rightContent
      )}
    </StyledModalRowItemContainer>
  );
};

const StyledModalRowItemContainer = styled(Row)<{ onClick?: () => void }>`
  ${removeButtonStyles};
  width: 100%;
  height: 60px;
  border-radius: 12px;
  padding: 12px 15px;
  ${({ theme }) => `background-color: ${theme.secondary.background}`};

  ${({ onClick, theme }) =>
    onClick &&
    `  &:hover {
    background-color: ${getHexColor(theme.textColor ?? '') + opacityToHex(20)};
    cursor: pointer;
  }`};
`;
