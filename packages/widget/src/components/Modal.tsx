import { css, keyframes, styled } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";
import { ShadowDomAndProviders } from "@/widget/ShadowDomAndProviders";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  ComponentType,
  useContext,
  useEffect,
  useState,
} from "react";
import { PartialTheme } from "@/widget/theme";

import { ErrorBoundary } from "react-error-boundary";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom, ErrorType } from "@/state/errorPage";
import { themeAtom } from "@/state/skipClient";

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
  const modalContext = useContext(NiceModal.NiceModalContext);
  const ModalsOpen = Object.entries(modalContext)
    .filter((entries) => {
      const [_modalId, modalState] = entries;
      return modalState.visible;
    })
    .map((entries) => entries[0]);

  const isNotFirstModalVisible =
    ModalsOpen.findIndex((modalId) => modalId === modal.id) !== 0;

  useEffect(() => {
    onOpenChange?.(true);
    return () => {
      onOpenChange?.(false);
    };
  }, [onOpenChange]);

  const delay = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const [open, setOpen] = useState(true);

  return (
    <Dialog.Root
      open={modal.visible}
      onOpenChange={() => {
        setOpen(false);
        delay(75).then(() => modal.remove());
      }}
    >
      <Dialog.Portal container={container}>
        <ShadowDomAndProviders theme={theme}>
          <StyledOverlay
            drawer={drawer}
            open={open}
            invisible={isNotFirstModalVisible}
          >
            <StyledContent drawer={drawer} open={open}>
              {children}
            </StyledContent>
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
    const setError = useSetAtom(errorAtom);
    const theme = useAtomValue(themeAtom);

    return (
      <Modal {...props} theme={theme}>
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

const fadeIn = keyframes`
  from {
      opacity: 0;
    }
    to {
    opacity: 1;
    }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
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

const fadeOutAndSlideDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
`;

const fadeInAndZoomOut = keyframes`
  from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
`;

const fadeOutAndZoomIn = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0);
  }
`;

const StyledOverlay = styled(Dialog.Overlay) <{
  drawer?: boolean;
  invisible?: boolean;
  open?: boolean;
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
  animation: ${({ open }) => (open ? fadeIn : fadeOut)} 150ms ease-in-out;
  /* For Chrome */
  &::-webkit-scrollbar {
    display: none;
  }
  /* For Firefox */
  scrollbar-width: none;
  /* For Internet Explorer and Edge */
  -ms-overflow-style: none;

  ${(props) =>
    props.drawer &&
    css`
      align-items: flex-end;
      position: absolute;
      background: rgba(255, 255, 255, 0);
      animation: ${props.open ? fadeIn : fadeOut} 150ms ease-in-out;
      /* For Chrome */
      &::-webkit-scrollbar {
        display: none;
      }
      /* For Firefox */
      scrollbar-width: none;
      /* For Internet Explorer and Edge */
      -ms-overflow-style: none;
    `};
`;

const StyledContent = styled(Dialog.Content) <{
  drawer?: boolean;
  open?: boolean;
}>`
  max-width: 600px;
  width: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${({ drawer, open }) =>
    open
      ? drawer
        ? fadeInAndSlideUp
        : fadeInAndZoomOut
      : drawer
        ? fadeOutAndSlideDown
        : fadeOutAndZoomIn}
    150ms ease-in-out;
`;
