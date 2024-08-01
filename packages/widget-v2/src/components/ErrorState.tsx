import { styled, useTheme } from 'styled-components';
import { Column } from './Layout';
import { iconMap, ICONS } from '../icons';
import { SmallText, Text } from './Typography';

export type ErrorStateProps = {
  icon?: ICONS;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
};

export const ErrorState = ({
  title,
  description,
  textColor,
  backgroundColor,
  icon = ICONS.none,
}: ErrorStateProps) => {
  const theme = useTheme();
  textColor ??= theme.textColor;
  backgroundColor ??= theme.backgroundColor;

  const Icon = iconMap[icon];

  return (
    <StyledErrorStateContainer
      align="center"
      justify="center"
      backgroundColor={backgroundColor}
      gap={16}
    >
      <Icon backgroundColor={backgroundColor} color={textColor} />
      {typeof title === 'string' ? (
        <Text fontSize={20} color={textColor}>
          {title}
        </Text>
      ) : (
        title
      )}
      {typeof description === 'string' ? (
        <SmallText opacity="0.5" color={textColor} textAlign="center">
          {description}
        </SmallText>
      ) : (
        description
      )}
    </StyledErrorStateContainer>
  );
};

const StyledErrorStateContainer = styled(Column)<{ backgroundColor?: string }>`
  width: 480px;
  height: 225px;
  border-radius: 25px;
  ${({ backgroundColor }) =>
    backgroundColor && `background-color: ${backgroundColor}`};
`;
