import { styled } from 'styled-components';
import { Row } from './Layout';
import { Text } from './Typography';

export type ModalRowItemProps = {
  leftContent?: string | React.ReactNode;
  rightContent?: string | React.ReactNode;
};

export const ModalRowItem = ({
  leftContent,
  rightContent,
}: ModalRowItemProps) => {
  return (
    <StyledModalRowItemContainer
      align="center"
      justify="space-between"
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

const StyledModalRowItemContainer = styled(Row)`
  width: 100%;
  height: 60px;
  border-radius: 12px;
  padding: 12px 15px;
  ${({ theme }) => `background-color: ${theme.secondary.background}`};

  &:hover {
    opacity: 0.7;
    cursor: pointer;
  }
`;
