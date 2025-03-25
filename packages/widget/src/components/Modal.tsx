import { css, keyframes, styled } from "styled-components";
import { disableShadowDomAtom, ShadowDomAndProviders } from "@/widget/ShadowDomAndProviders";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { ComponentType, useCallback, useEffect, useRef, useState } from "react";
import { PartialTheme } from "@/widget/theme";

import { ErrorBoundary } from "react-error-boundary";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom, ErrorType } from "@/state/errorPage";
import { rootIdAtom, themeAtom } from "@/state/skipClient";
import { createPortal } from "react-dom";

export type ModalProps = {
  children: React.ReactNode;
  drawer?: boolean;
  container?: HTMLElement;
  onOpenChange?: (open: boolean) => void;
  theme?: PartialTheme;
};

export const Modal = ({ children, drawer, container, onOpenChange, theme }: ModalProps) => {
  const [prevOverflowStyle, setPrevOverflowStyle] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const modal = useModal();
  const [wasVisible, setWasVisible] = useState<boolean>();
  const disableShadowDom = useAtomValue(disableShadowDomAtom);
  const rootId = useAtomValue(rootIdAtom);

  const delay = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const closeModal = useCallback(() => {
    onOpenChange?.(false);
    delay(75).then(() => {
      modal.remove();
    });
  }, [modal, onOpenChange]);

  useEffect(() => {
    if (wasVisible && !modal.visible) {
      closeModal();
    }
    setWasVisible(modal.visible);
  }, [closeModal, modal.visible, wasVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        modal.hide();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current !== event.target && modal.visible) {
        modal.hide();
      }
    };

    onOpenChange?.(true);

    const hasScrollbar = () => {
      const htmlElement = document.documentElement;
      return htmlElement.scrollHeight > htmlElement.clientHeight;
    };

    const prevOverflowStyle = window.getComputedStyle(document.documentElement).overflow;
    if (!drawer || !hasScrollbar()) {
      setPrevOverflowStyle(prevOverflowStyle);
      document.documentElement.style.overflow = "hidden";
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
      onOpenChange?.(false);
      document.documentElement.style.overflow = prevOverflowStyle;
    };
  }, [closeModal, drawer, modal, onOpenChange, prevOverflowStyle]);

  // this fixes a flickering animation when modals are opened
  if (disableShadowDom && wasVisible === undefined) return null;

  return createPortal(
    <ShadowDomAndProviders theme={theme}>
      <StyledOverlay drawer={drawer} open={modal.visible} data-root-id={rootId}>
        <StyledContent
          ref={modalRef}
          drawer={drawer}
          open={modal.visible}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </StyledContent>
      </StyledOverlay>
    </ShadowDomAndProviders>,
    container ?? document.body,
  );
};

export const createModal = <T extends ModalProps>(component: ComponentType<T>) => {
  const Component = component;

  const WrappedComponent = (props: T) => {
    const setError = useSetAtom(errorAtom);
    const theme = useAtomValue(themeAtom);

    return (
      <Modal {...props} theme={theme}>
        <ErrorBoundary
          fallback={null}
          onError={(error) => setError({ errorType: ErrorType.Unexpected, error })}
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
      transform: scale(0.95);
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
    transform: scale(0.95);
  }
`;

const StyledOverlay = styled.div<{
  drawer?: boolean;
  open?: boolean;
}>`
  background: rgba(0 0 0 / 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
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

const StyledContent = styled.div<{
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
    150ms cubic-bezier(0.5, 1, 0.89, 1);
`;
