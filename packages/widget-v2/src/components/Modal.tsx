import { css, keyframes, styled } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";
import { ShadowDomAndProviders } from "@/widget/ShadowDomAndProviders";
import NiceModal, { useModal as useNiceModal } from "@ebay/nice-modal-react";
import { ComponentType, FC, useEffect, useMemo } from "react";
import { PartialTheme } from "@/widget/theme";

import { ErrorBoundary } from "react-error-boundary";
import { useAtom } from "jotai";
import { errorAtom, ErrorType } from "@/state/errorPage";
import { numberOfModalsOpenAtom } from "@/state/modal";
import { themeAtom } from "@/state/skipClient";

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
        <ErrorBoundary
          fallback={null}
          onError={(error) =>
            setError({ errorType: ErrorType.Unexpected, error })
          }
        >
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
  const [theme] = useAtom(themeAtom);
  const [_numberOfModalsOpen, setNumberOfModalsOpen] = useAtom(
    numberOfModalsOpenAtom
  );

  const modalInstance = useNiceModal(modal as FC<unknown>, initialArgs);

  return useMemo(
    () => ({
      ...modalInstance,
      show: (showArgs?: Partial<T & ModalProps>) => {
        modalInstance.show({
          ...showArgs,
          theme,
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
    [modalInstance, theme, setNumberOfModalsOpen]
  );
};

const fadeIn = keyframes`
  from {
      opacity: 0;
    }
    to {
    opacity: 1;
    }
`;

const fadeInAndSlideUp = keyframes`
  from {
      opacity: 0;
    transform: translateY(100%);
    }
    to {
    opacity: 1;
    transform: translateY(0);
    }
`;

const StyledOverlay = styled(Dialog.Overlay) <{
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
  animation: ${fadeIn} 350ms cubic-bezier(0.16, 1, 0.3, 1);
  &::-webkit-scrollbar{
    display: none;
  }
  ${(props) =>
    props.drawer &&
    css`
      align-items: flex-end;
      position: absolute;
      background: unset;
      animation: ${fadeIn} 1s cubic-bezier(0.16, 1, 0.3, 1);
      &::-webkit-scrollbar{
        display: none;
      }
    `};
`;

const StyledContent = styled(Dialog.Content)`
  min-width: 300px;
  border-radius: 4px;
  z-index: 100;
  animation: ${fadeInAndSlideUp} 450ms cubic-bezier(0.16, 1, 0.3, 1);
`;
