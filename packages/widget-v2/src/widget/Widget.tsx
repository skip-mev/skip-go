import { ShadowDomAndProviders } from './ShadowDomAndProviders';
import { PartialTheme } from './theme';
import { SwapFlow } from './SwapFlow/SwapFlow';
import NiceModal from '@ebay/nice-modal-react';
import styled from 'styled-components';

type SwapWidgetProps = {
  theme?: PartialTheme;
};

export const SwapWidget = (props: SwapWidgetProps) => {
  return (
    <NiceModal.Provider>
      <ShadowDomAndProviders {...props}>
        <WidgetContainer>
          <SwapFlow />
        </WidgetContainer>
      </ShadowDomAndProviders>
    </NiceModal.Provider>
  );
};

export const SwapWidgetWithoutNiceModalProvider = (props: SwapWidgetProps) => {
  return (
    <ShadowDomAndProviders {...props}>
      <WidgetContainer>
        <SwapFlow />
      </WidgetContainer>
    </ShadowDomAndProviders>
  );
};

const WidgetContainer = styled.div`
  position: relative;
`;
