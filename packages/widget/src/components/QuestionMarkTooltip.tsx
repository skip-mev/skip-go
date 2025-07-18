import { Tooltip } from "@/components/Tooltip";
import styled from "styled-components";
import { QuestionMarkIcon } from "@/icons/QuestionMarkIcon";

export type QuestionMarkTooltipProps = {
  content?: React.ReactNode;
};

export const QuestionMarkTooltip = ({ content }: QuestionMarkTooltipProps) => {
  return (
    <Tooltip content={content}>
      <StyledQuestionMarkIcon />
    </Tooltip>
  );
};

const StyledQuestionMarkIcon = styled(QuestionMarkIcon)`
  color: ${({ theme }) => theme.primary.text.ultraLowContrast};
  &:hover {
    color: ${({ theme }) => theme.primary.text.normal};
  }
  transition: color 0.2s ease;
`;
