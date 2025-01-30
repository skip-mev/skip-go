import { css, keyframes, styled } from "styled-components";
import { ShadowDomAndProviders } from "@/widget/ShadowDomAndProviders";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { ComponentType, useCallback, useEffect, useRef, useState } from "react";
import { PartialTheme } from "@/widget/theme";

import { ErrorBoundary } from "react-error-boundary";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom, ErrorType } from "@/state/errorPage";
import { themeAtom } from "@/state/skipClient";
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
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const modal = useModal();

  const closeModal = useCallback(() => {
    onOpenChange?.(false);
    modal.remove();
    window.scrollTo(0, savedScrollPosition);
  }, [modal, onOpenChange, savedScrollPosition]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!modalRef.current?.contains(event.target as Node)) {
        closeModal();
      }
    };

    const scrollPos = window.scrollY;
    setSavedScrollPosition(scrollPos);
    onOpenChange?.(true);
    const prevOverflowStyle = getComputedStyle(document.body).overflow;
    setPrevOverflowStyle(prevOverflowStyle);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      window.scrollTo(0, scrollPos);
    }, 10);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
      onOpenChange?.(false);
      document.body.style.overflow = prevOverflowStyle;
    };
  }, [closeModal, modal, onOpenChange, prevOverflowStyle, savedScrollPosition]);

  return createPortal(
    <ShadowDomAndProviders theme={theme}>
      <StyledOverlay ref={modalRef} drawer={drawer} open={modal.visible}>
        <StyledContent drawer={drawer} open={modal.visible} onClick={(e) => e.stopPropagation()}>
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
    180ms cubic-bezier(0.5, 1, 0.89, 1);
`;
