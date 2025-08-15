import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Column } from "@/components/Layout";
import { ModalProps, createModal } from "@/components/Modal";
import { CopyIcon } from "@/icons/CopyIcon";
import { styled, useTheme } from "@/styled-components";
import { Text } from "@/components/Typography";
import { useEffect, useState } from "react";

export type ViewRawDataModalProps = ModalProps & {
  data: string;
};

export const ViewRawDataModal = createModal(
  (modalProps: ViewRawDataModalProps) => {
    const theme = useTheme();
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
      if (!isCopied) return;
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, [isCopied]);

    return (
      <ModalContainer>
        <StyledContent>

          <StyledPre>
            {modalProps.data}
          </StyledPre>

        </StyledContent>
        <StyledCopyIconButton
          onClick={() => {
            window.navigator.clipboard.writeText(modalProps.data);
            setIsCopied(true);
          }}
        >
          {isCopied ? (
            <StyledText>Copied to clipboard</StyledText>
          ) : (
            <>
              <StyledText>Copy</StyledText>{" "}
              <CopyIcon
                width="13"
                height="13"
                color={theme.primary.text.lowContrast}
              />
            </>
          )}
        </StyledCopyIconButton>
      </ModalContainer>
    );
  }
);

const StyledPre = styled.pre`
  margin-top: 0;
  margin-bottom: 0;
  width: 100%;
  font-size: 13px;
  color: ${({ theme }) => theme.primary.text.lowContrast};
`;

const StyledCopyIconButton = styled(Button)`
align-self: center;
  align-items: center;
  gap: 8px;
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.primary.text.lowContrast};
  font-size: 13px;
`;

const ModalContainer = styled(Container).attrs({
  borderRadius: 24,
  padding: 16,
})`
  max-height: 80vh;
`;

const StyledContent = styled(Column)`
  overflow-y: auto;
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.secondary.background.normal};
  border-radius: ${({ theme }) => theme.borderRadius?.modalContainer};
`;
