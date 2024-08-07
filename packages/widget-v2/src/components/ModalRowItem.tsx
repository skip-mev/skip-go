import { styled } from 'styled-components';
import { Row } from './Layout';
import { removeButtonStyles, Text } from './Typography';

export type ModalRowItemProps = {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
};

export const ModalRowItem = ({
  leftContent,
  rightContent,
  onClick,
}: ModalRowItemProps) => {
  return (
    <StyledModalRowItemContainer
      as="button"
      align="center"
      justify="space-between"
      onClick={onClick}
      gap={16}
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

  ${({ onClick }) =>
    onClick &&
    `  &:hover {
    opacity: 0.7;
    cursor: pointer;
  }`};
`;
