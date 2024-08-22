import { css, styled, useTheme } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";
import { ShadowDomAndProviders } from "@/widget/ShadowDomAndProviders";
import NiceModal, { useModal as useNiceModal } from "@ebay/nice-modal-react";
import { ComponentType, FC, useEffect, useMemo } from "react";
import { PartialTheme } from "@/widget/theme";

import { ErrorBoundary } from "react-error-boundary";
import { useAtom } from "jotai";
import { errorAtom } from "@/state/errorPage";
import { numberOfModalsOpenAtom } from "@/state/modal";

export type ModalProps = {
  children: React.ReactNode;
  drawer?: boolean;
  container?: HTMLElement;
  onOpenChange?: (open: boolean) => void;
  stackedModal?: boolean;
  theme?: PartialTheme;
};

export const Modal = ({
  children,
  drawer,
  container,
  onOpenChange,
  stackedModal,
  theme,
}: ModalProps) => {
  const modal = useModal();

  useEffect(() => {
    onOpenChange?.(true);
    return () => {
      onOpenChange?.(false);
    };
  }, [onOpenChange]);

  return (
    <Dialog.Root open={modal.visible} onOpenChange={() => modal.remove()}>
      <Dialog.Portal container={container}>
        <ShadowDomAndProviders theme={theme}>
          <StyledOverlay drawer={drawer} invisible={stackedModal}>
            <StyledContent>{children}</StyledContent>
          </StyledOverlay>
        </ShadowDomAndProviders>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const createModal = <T extends ModalProps>(
  component: ComponentType<T>
) => {
  const Component = component;

  const WrappedComponent = (props: T) => {
    const [, setError] = useAtom(errorAtom);

    return (
      <Modal {...props}>
        <ErrorBoundary fallback={null} onError={(error) => setError(error)}>
          <Component {...props} />
        </ErrorBoundary>
      </Modal>
    );
  };

  return NiceModal.create(WrappedComponent);
};

export const useModal = <T extends ModalProps>(
  modal?: FC<T>,
  initialArgs?: Partial<T>
) => {
  const theme = useTheme();
  const [numberOfModalsOpen, setNumberOfModalsOpen] = useAtom(
    numberOfModalsOpenAtom
  );

  const modalInstance = useNiceModal(modal as FC<unknown>, initialArgs);

  return useMemo(
    () => ({
      ...modalInstance,
      show: (showArgs?: Partial<T & ModalProps>) => {
        modalInstance.show({
          theme,
          stackedModal: numberOfModalsOpen > 0,
          ...showArgs,
        } as Partial<T>);
        setNumberOfModalsOpen((prev) => prev + 1);
      },
      remove: () => {
        setNumberOfModalsOpen((prev) => Math.max(0, prev - 1));
        modalInstance.remove();
      },
      hide: () => {
        setNumberOfModalsOpen((prev) => Math.max(0, prev - 1));
        modalInstance.hide();
      },
    }),
    [modalInstance, setNumberOfModalsOpen, theme, numberOfModalsOpen]
  );
};

const StyledOverlay = styled(Dialog.Overlay)<{
  drawer?: boolean;
  invisible?: boolean;
}>`
  ${({ invisible }) => (invisible ? "" : "background: rgba(0 0 0 / 0.5);")}
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
