import { css, styled, useTheme } from 'styled-components';
import * as Dialog from '@radix-ui/react-dialog';
import { ShadowDomAndProviders } from '@/widget/ShadowDomAndProviders';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { ComponentProps, ComponentType, FC, useEffect } from 'react';
import { PartialTheme } from '@/widget/theme';

import { ErrorBoundary } from 'react-error-boundary';
import { useAtom } from 'jotai';
import { errorAtom } from '@/state/errorPage';
import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';

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

export const createModal = (component: ComponentType<any>) => {
  const Component = component;

  const WrappedComponent = (props: any) => {
    const [, setError] = useAtom(errorAtom);

    return (
      <Modal {...props}>
        <ErrorBoundary
          FallbackComponent={ErrorPage}
          onError={(error) => setError(error)}
        >
          <Component {...props} />
        </ErrorBoundary>
      </Modal>
    );
  };

  return NiceModal.create(WrappedComponent);
};

export const useThemedModal = <T extends FC<any>>(
  modal: T,
  args?: Partial<ComponentProps<T>>
) => {
  const theme = useTheme();
  const modalInstance = NiceModal.useModal(modal, { theme, ...args });

  return {
    ...modalInstance,
    show: (showArgs?: Partial<ComponentProps<T>>) =>
      modalInstance.show({ theme, ...showArgs }),
  };
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
