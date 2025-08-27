import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Column } from "@/components/Layout";
import { ModalProps, createModal } from "@/components/Modal";
import { CopyIcon } from "@/icons/CopyIcon";
import { styled, useTheme } from "@/styled-components";
import { Text } from "@/components/Typography";
import { useClipboard } from "@/hooks/useClipboard";
import { styledScrollbar } from "../../mixins/styledScrollbar";
import { ExplorerModals } from "../../constants/modal";
import { XIcon } from "@/icons/XIcon";
import { NiceModal } from "@/nice-modal";
import { CloseIconContainer } from "./SearchModal";

export type ViewRawDataModalProps = ModalProps & {
  data: string;
};

export const ViewRawDataModal = createModal(
  (modalProps: ViewRawDataModalProps) => {
    const theme = useTheme();
    const { saveToClipboard, isCopied } = useClipboard();

    return (
      <ModalContainer>
        <StyledCloseIconContainer onClick={() => NiceModal.hide(ExplorerModals.ViewRawDataModal)}>
          <XIcon width={14} height={14} color={theme.primary.text.lowContrast} />
        </StyledCloseIconContainer>
        <StyledContent>
          <StyledPre>{modalProps.data}</StyledPre>
        </StyledContent>
        <StyledCopyIconButton
          onClick={() => {
            saveToClipboard(modalProps.data);
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

const StyledCloseIconContainer = styled(CloseIconContainer)`
  position: absolute;
  top: -55px;
  right: 0px;
`;

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
  width: 80vw;
  max-height: 80vh;
`;

const StyledContent = styled(Column)`
  overflow: auto;
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.secondary.background.normal};
  border-radius: ${({ theme }) => theme.borderRadius?.modalContainer};
  
  ${styledScrollbar()};
`;
