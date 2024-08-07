import { css, styled } from 'styled-components';
import * as Dialog from '@radix-ui/react-dialog';
import { ShadowDomAndProviders } from '../widget/ShadowDomAndProviders';
import { useModal } from '@ebay/nice-modal-react';
import { useEffect } from 'react';
import { PartialTheme } from '../widget/theme';

export type ModalProps = {
  children: React.ReactNode;
  drawer?: boolean;
  container?: HTMLElement;
  onOpenChange?: (open: boolean) => void;
  theme?: PartialTheme;
};

export const Modal = ({
  children,
  drawer,
  container,
  onOpenChange,
  theme,
}: ModalProps) => {
  const modal = useModal();

  useEffect(() => {
    onOpenChange?.(true);
    return () => {
      onOpenChange?.(false);
    };
  }, []);

  return (
    <Dialog.Root open={modal.visible} onOpenChange={() => modal.remove()}>
      <Dialog.Portal container={container}>
        <ShadowDomAndProviders theme={theme}>
          <StyledOverlay drawer={drawer}>
            <StyledContent>{children}</StyledContent>
          </StyledOverlay>
        </ShadowDomAndProviders>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const StyledOverlay = styled(Dialog.Overlay)<{ drawer?: boolean }>`
  background: rgba(0 0 0 / 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  z-index: 10;

  ${(props) =>
    props.drawer &&
    css`
      align-items: flex-end;
      position: absolute;
      background: unset;
    `};
`;

const StyledContent = styled(Dialog.Content)`
  min-width: 300px;
  border-radius: 4px;
  z-index: 100;
`;
