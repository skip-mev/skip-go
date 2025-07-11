import { styled, useTheme } from "styled-components";
import { Row } from "./Layout";
import { LeftArrowIcon } from "@/icons/ArrowIcon";
import { Text } from "./Typography";
import { Button } from "./Button";

type ModalHeaderProps = {
  title: string;
  onClickBackButton: () => void;
  rightContent?: React.ReactNode;
};

export const ModalHeader = ({ title, onClickBackButton, rightContent }: ModalHeaderProps) => {
  const theme = useTheme();
  return (
    <StyledHeader align="center" justify="space-between">
      <Button onClick={() => onClickBackButton()}>
        <StyledLeftArrowIcon color={theme?.primary.text.normal} />
      </Button>
      <StyledCenteredTitle textAlign="center">{title}</StyledCenteredTitle>
      {rightContent}
    </StyledHeader>
  );
};

const StyledHeader = styled(Row)`
  height: 40px;
  margin-top: 10px;
  padding: 0 12px;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  opacity: 0.2;
  transform: rotate(180deg);
  transition: opacity 0.2s;
  button:hover & {
    opacity: 1;
  }
`;

const StyledCenteredTitle = styled(Text)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;
