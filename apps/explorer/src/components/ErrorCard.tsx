import { Container } from "@/components/Container"
import { Column, Row } from "@/components/Layout"
import { SmallText, SmallTextButton, Text } from "@/components/Typography"
import { useClipboard } from "@/hooks/useClipboard";
import { CopyIcon } from "@/icons/CopyIcon";
import { TriangleWarningIcon } from "@/icons/TriangleWarningIcon";
import { styledScrollbar } from "@/mixins/styledScrollbar";
import { styled, useTheme } from "@/styled-components";
import { useRef } from "react";

export enum ErrorMessages {
  TRANSACTION_ERROR = "We're having trouble displaying this Transaction",
  TRANSACTION_NOT_FOUND = "Transaction not found",
  TRANSFER_EVENT_ERROR = "We're having trouble displaying this step",
}

export const ErrorCard = ({
  errorTitle,
  errorMessage,
  onRetry,
  padding = "16px",
}: {
  errorTitle: string;
  errorMessage: string;
  onRetry?: () => void;
  padding?: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { saveToClipboard, isCopied } = useClipboard();
  const theme = useTheme();

  return (
    <Container padding={padding}>
      <Column align="center" justify="center" gap={16}>
        <TriangleWarningIcon backgroundColor="white" width={18} height={16} />
        <Text textAlign="center" lineHeight="24px" style={{ maxWidth: "250px" }}>
          {errorTitle}
        </Text>
        {
          errorMessage && (
          <StyledContent>
            <StyledScrollableArea>
              <StyledText ref={contentRef}>{errorMessage}</StyledText>
            </StyledScrollableArea>
            <StyledFooter align="center" justify="flex-end" width="100%">
              <CopyButton onClick={() => saveToClipboard(errorMessage)}>
                <Row align="center" gap={5}>
                  {isCopied ? "Copied!" : "Copy error"}
                  <CopyIcon
                    width="13"
                    height="13"
                    color={theme.primary.text.lowContrast}
                  />
                </Row>
              </CopyButton>
              
            </StyledFooter>
          </StyledContent>
          )
        }
        
        <SmallTextButton onClick={onRetry}>
          Retry
        </SmallTextButton>
      </Column>
    </Container>
  )
}

const StyledText = styled(SmallText)`
  overflow-wrap: break-word;
  line-height: 1.5;
  flex: 1;
`;  

const StyledScrollableArea = styled(Column)`
  position: relative;
  max-height: 70px;
  overflow: auto;
  ${styledScrollbar(true)};
  gap: 8px;
`;

const StyledContent = styled(Column)`
  width: 100%;
  padding: 16px;
  padding-bottom: 0;
  background-color: ${({ theme }) => theme.secondary.background.normal};
  border-radius: 12px;
`;

const CopyButton = styled(SmallTextButton)`
  padding: 4px 8px;
`;

const StyledFooter = styled(Row)`
  padding: 8px 0;
`;
