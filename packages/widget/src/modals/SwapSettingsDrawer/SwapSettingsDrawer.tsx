import { styled, useTheme } from "styled-components";
import { createModal } from "@/components/Modal";
import { Column, Row } from "@/components/Layout";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { RouteArrow } from "@/icons/RouteArrow";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import { Fragment, useMemo } from "react";
import { getFeeList } from "@/utils/fees";
import SlippageSelector from "@/modals/SwapSettingsDrawer/SlippageSelector";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { track } from "@amplitude/analytics-browser";
import { convertToPxValue } from "@/utils/style";
import RoutePreferenceSelector from "./RoutePreferenceSelector";

export const SwapSettingsDrawer = createModal(() => {
  const theme = useTheme();
  const { data: route } = useAtomValue(skipRouteAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const chainsRoute = useMemo(() => {
    return route?.chainIds?.map((chainId) => chains?.find((chain) => chain.chainId === chainId));
  }, [route, chains]);

  const fees = useMemo(() => {
    if (!route) return [];
    return getFeeList(route);
  }, [route]);

  return (
    <StyledSwapPageSettings gap={15}>
      <Column gap={10}>
        {route && (
          <Row justify="space-between" align="center">
            <SwapDetailText>Route</SwapDetailText>
            <Row align="center" gap={5}>
              {chainsRoute?.map((chain, index) => (
                <Fragment key={index}>
                  <img
                    width="25"
                    height="25"
                    src={chain?.logoUri}
                    alt={chain?.prettyName}
                    title={chain?.prettyName}
                  />
                  {index !== chainsRoute.length - 1 && (
                    <RouteArrow color={theme?.primary?.text.normal} />
                  )}
                </Fragment>
              ))}
            </Row>
          </Row>
        )}
        {Boolean(route?.swapPriceImpactPercent) && (
          <Row justify="space-between" align="center">
            <SwapDetailText>Price Impact</SwapDetailText>
            <Row align="center" gap={5} height={25}>
              <SwapDetailText monospace>{route?.swapPriceImpactPercent}%</SwapDetailText>
            </Row>
          </Row>
        )}
      </Column>

      {fees.length > 0 && (
        <Column gap={10}>
          {fees.map(({ label, fee }, index) => (
            <Row justify="space-between" align="center" key={index} height={25}>
              <SwapDetailText>{label}</SwapDetailText>
              <SwapDetailText textAlign="right" monospace>
                {fee.formattedAssetAmount} ({fee.formattedUsdAmount})
              </SwapDetailText>
            </Row>
          ))}
        </Column>
      )}
      <RoutePreferenceSelector />
      <SlippageSelector />
      <Row gap={10}>
        <SmallText
          as="a"
          href="https://docs.skip.build/go/legal-and-privacy/terms-of-service"
          target="_blank"
        >
          <UnderlineText>Terms of Service</UnderlineText>
        </SmallText>
        <SmallText
          as="a"
          href="https://docs.skip.build/go/legal-and-privacy/privacy-policy"
          target="_blank"
        >
          <UnderlineText>Privacy Policy</UnderlineText>
        </SmallText>
      </Row>
      <Row justify="space-between">
        <SmallTextButton
          onClick={() => {
            track("settings drawer: close button - clicked");
            NiceModal.hide(Modals.SwapSettingsDrawer);
          }}
        >
          Close
        </SmallTextButton>
      </Row>
    </StyledSwapPageSettings>
  );
});

const StyledSwapPageSettings = styled(Column)`
  width: 100%;
  padding: 20px;
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.modalContainer)};
  background: ${(props) => props.theme.primary.background.normal};
`;

export const SwapDetailText = styled(Row).attrs({
  as: SmallText,
  normalTextColor: true,
})`
  position: relative;
  letter-spacing: 0.26px;
`;

const UnderlineText = styled.u`
  text-decoration-line: unset;
`;
