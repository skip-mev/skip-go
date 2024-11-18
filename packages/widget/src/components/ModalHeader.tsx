import { styled, useTheme } from "styled-components";
import { Column, Row } from "./Layout";
import { LeftArrowIcon } from "@/icons/ArrowIcon";
import { Text } from "./Typography";
import { Button } from "./Button";
import { MAX_MOBILE_SCREEN_WIDTH } from "@/hooks/useIsMobileScreenSize";

type ModalHeaderProps = {
  title: string;
  onClickBackButton: () => void;
  rightContent?: () => React.ReactNode;
};

export const ModalHeader = ({
  title,
  onClickBackButton,
  rightContent,
}: ModalHeaderProps) => {
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

export const StyledModalContainer = styled(Column)`
  position: relative;
  padding: 10px;
  gap: 10px;
  width: calc(100% - 20px);
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  overflow: hidden;
  height: 100%;

  @media (max-width: ${MAX_MOBILE_SCREEN_WIDTH}px) {
    max-height: 600px;
  }
`;
export const StyledModalInnerContainer = styled(Column) <{
  height: number;
}>`
  height: ${({ height }) => height}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledHeader = styled(Row)`
  height: 40px;
  margin-top: 10px;
  padding: 0 12px;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  opacity: 0.2;
`;

const StyledCenteredTitle = styled(Text)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;
