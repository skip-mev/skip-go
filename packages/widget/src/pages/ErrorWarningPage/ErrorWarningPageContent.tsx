import { styled, useTheme } from "styled-components";
import { Column } from "@/components/Layout";
import { iconMap, ICONS } from "@/icons";
import { SmallText, Text } from "@/components/Typography";

export type ErrorWarningPageContentProps = {
  icon?: ICONS;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
};

export const ErrorWarningPageContent = ({
  title,
  description,
  textColor,
  backgroundColor,
  icon = ICONS.none,
}: ErrorWarningPageContentProps) => {
  const theme = useTheme();
  textColor ??= theme.primary.text.normal;
  backgroundColor ??= theme.primary.background.normal;

  const Icon = iconMap[icon];

  return (
    <StyledErrorWarningStateContainer
      align="center"
      justify="center"
      backgroundColor={backgroundColor}
      gap={12}
      padding={16}
    >
      <Icon backgroundColor={textColor} color={backgroundColor} height={40} width={40} />
      {typeof title === "string" ? (
        <Text fontSize={20} color={textColor} textAlign="center">
          {title}
        </Text>
      ) : (
        title
      )}
      {typeof description === "string" ? (
        <StyledErrorWarningTextInnerContainer>
          <SmallText
            color={textColor}
            textAlign="center"
            style={{
              wordWrap: "break-word",
            }}
          >
            {description}
          </SmallText>
        </StyledErrorWarningTextInnerContainer>
      ) : (
        description
      )}
    </StyledErrorWarningStateContainer>
  );
};

const StyledErrorWarningStateContainer = styled(Column)<{ backgroundColor?: string }>`
  width: 100%;
  height: 225px;
  border-radius: 25px;
  ${({ backgroundColor }) => backgroundColor && `background: ${backgroundColor}`};
`;

const StyledErrorWarningTextInnerContainer = styled(Column)`
  padding: 8px;
  max-height: 100px;
  overflow-y: auto;
  width: 100%;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.primary.text.ultraLowContrast};
    border-radius: 16px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 16px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
