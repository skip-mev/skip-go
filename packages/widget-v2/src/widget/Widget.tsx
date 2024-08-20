import { ShadowDomAndProviders } from './ShadowDomAndProviders';
import { PartialTheme } from './theme';
import { SwapPage } from '@pages/SwapPage/SwapPage';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { styled } from 'styled-components';
import { Modal } from '@components/Modal';
import { cloneElement, ReactElement } from 'react';

export type SwapWidgetProps = {
  theme?: PartialTheme;
};

export const SwapWidget = (props: SwapWidgetProps) => {
  return (
    <NiceModal.Provider>
      <ShadowDomAndProviders {...props}>
        <WidgetContainer>
          <SwapPage />
        </WidgetContainer>
      </ShadowDomAndProviders>
    </NiceModal.Provider>
  );
};

const SwapWidgetWithoutNiceModalProvider = (props: SwapWidgetProps) => {
  return (
    <ShadowDomAndProviders {...props}>
      <WidgetContainer>
        <SwapPage />
      </WidgetContainer>
    </ShadowDomAndProviders>
  );
};

export type ShowSwapWidget = {
  button?: ReactElement;
} & SwapWidgetProps;

export const ShowSwapWidget = ({
  button = <button>show widget</button>,
  ...props
}: ShowSwapWidget) => {
  const modal = useModal(NiceModal.create(Modal));

  const handleClick = () => {
    modal.show({
      children: <SwapWidgetWithoutNiceModalProvider {...props} />,
    });
  };

  const Element = cloneElement(button, { onClick: handleClick });

  return <>{Element}</>;
};

const WidgetContainer = styled.div`
  width: 480px;
  position: relative;
`;
