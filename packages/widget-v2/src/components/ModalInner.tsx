import styled, { useTheme } from "styled-components";
import { Column, Row } from "./Layout";
import { LeftArrowIcon } from "@/icons/ArrowIcon";
import { Text } from "./Typography";
import { Button } from "./Button";

type ModalInnerHeaderProps = {
  title: string;
  onClickBackButton: () => void;
  rightContent?: () => React.ReactNode;
};

export const ModalInnerHeader = ({
  title,
  onClickBackButton,
  rightContent,
}: ModalInnerHeaderProps) => {
  const theme = useTheme();
  return (
    <StyledHeader align="center" justify="space-between">
      <Button onClick={() => onClickBackButton()}>
        <StyledLeftArrowIcon
          color={theme?.primary.background.normal}
          backgroundColor={theme?.primary.text.normal}
        />
      </Button>
      <StyledCenteredTitle textAlign="center">{title}</StyledCenteredTitle>
      {rightContent?.()}
    </StyledHeader>
  );
};

export const StyledInnerContainer = styled(Column) <{
  height: number;
}>`
  height: ${({ height }) => height}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;


export const StyledHeader = styled(Row)`
  height: 40px;
  margin-top: 10px;
  padding: 0 12px;
`;

export const StyledContainer = styled(Column)`
  position: relative;
  padding: 10px;
  gap: 10px;
  width: 580px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  overflow: hidden;
`;

export const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  opacity: 0.2;
`;

export const StyledCenteredTitle = styled(Text)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;
