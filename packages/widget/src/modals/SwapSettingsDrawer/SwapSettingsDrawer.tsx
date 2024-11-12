import { styled, useTheme } from "styled-components";
import { createModal } from "@/components/Modal";
import { Column, Row } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { RouteArrow } from "@/icons/RouteArrow";
import { SwapPageFooterItems } from "../../pages/SwapPage/SwapPageFooter";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import { Fragment, useMemo } from "react";
import { formatUSD } from "@/utils/intl";
import { getClientOperations, OperationType } from "@/utils/clientType";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { calculateSmartRelayFee, checkIsSmartRelay } from "@/utils/route";
import SlippageSelector from "../../pages/SwapPage/SlippageSelector";

export const SwapSettingsDrawer = createModal(() => {
  const theme = useTheme();
  const { data: route } = useAtomValue(skipRouteAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainsRoute = useMemo(() => {
    return route?.chainIDs.map((chainID) =>
      chains?.find((chain) => chain.chainID === chainID)
    );
  }, [route, chains]);

  const clientOperations = route && getClientOperations(route.operations);

  const axelarTransferOperation = useMemo(() => {
    if (!clientOperations) return;
    return clientOperations?.find(
      (item) => item.type === OperationType.axelarTransfer
    );
  }, [clientOperations]);

  const hyperlaneTransferOperation = useMemo(() => {
    if (!clientOperations) return;
    return clientOperations?.find(
      (item) => item.type === OperationType.hyperlaneTransfer
    );
  }, [clientOperations]);

  const axelarFee = useMemo(() => {
    if (axelarTransferOperation) {
      const { feeAmount, feeAsset, usdFeeAmount } = axelarTransferOperation;
      if (!feeAmount || !feeAsset || !feeAsset.decimals) return;
      const computed = convertTokenAmountToHumanReadableAmount(
        feeAmount,
        feeAsset.decimals
      );
      return {
        assetAmount: Number(computed),
        formattedAssetAmount: `${computed} ${feeAsset.symbol}`,
        formattedUsdAmount: usdFeeAmount
          ? `${formatUSD(usdFeeAmount)}`
          : undefined,
      };
    }
  }, [axelarTransferOperation]);

  const hyperlaneFee = useMemo(() => {
    if (hyperlaneTransferOperation) {
      const { feeAmount, feeAsset, usdFeeAmount } = hyperlaneTransferOperation;
      if (!feeAmount || !feeAsset || !feeAsset.decimals) return;
      const computed = convertTokenAmountToHumanReadableAmount(
        feeAmount,
        feeAsset.decimals
      );
      return {
        assetAmount: Number(computed),
        formattedAssetAmount: `${computed} ${feeAsset.symbol}`,
        formattedUsdAmount: usdFeeAmount
          ? `${formatUSD(usdFeeAmount)}`
          : undefined,
      };
    }
  }, [hyperlaneTransferOperation]);

  const isSmartRelay = checkIsSmartRelay(route);
  const smartRelayFee = useMemo(() => {
    return calculateSmartRelayFee(isSmartRelay, route?.estimatedFees);
  }, [isSmartRelay, route?.estimatedFees]);

  return (
    <StyledSwapPageSettings gap={20}>
      <Column gap={10}>
        <Row justify="space-between">
          <SwapDetailText>Route</SwapDetailText>
          <Row align="center" gap={5}>
            {chainsRoute?.map((chain, index) => (
              <Fragment key={index}>
                <img
                  width="20"
                  height="20"
                  src={chain?.logoURI}
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
        {Boolean(route?.swapPriceImpactPercent) && (
          <Row justify="space-between">
            <SwapDetailText>Price Impact</SwapDetailText>
            <Row align="center" gap={5}>
              <SwapDetailText monospace>
                {route?.swapPriceImpactPercent}%
              </SwapDetailText>
            </Row>
          </Row>
        )}

      </Column>
      {(axelarFee || hyperlaneFee || smartRelayFee) && (
        <Column gap={10}>
          {axelarFee && (
            <Row justify="space-between">
              <SwapDetailText>Axelar Bridging Fee</SwapDetailText>
              <SwapDetailText monospace>
                {axelarFee.formattedAssetAmount} ({axelarFee.formattedUsdAmount}
                )
              </SwapDetailText>
            </Row>
          )}
          {hyperlaneFee && (
            <Row justify="space-between">
              <SwapDetailText>Hyperlane Bridging Fee</SwapDetailText>
              <SwapDetailText monospace>
                {hyperlaneFee.formattedAssetAmount} (
                {hyperlaneFee.formattedUsdAmount})
              </SwapDetailText>
            </Row>
          )}
          {smartRelayFee && (
            <Row justify="space-between">
              <SwapDetailText>Relayer Fee</SwapDetailText>
              <SwapDetailText monospace>
                {smartRelayFee.formattedAssetAmount} (
                {smartRelayFee.formattedUsdAmount})
              </SwapDetailText>
            </Row>
          )}
        </Column>
      )}
      <SlippageSelector />
      <SwapDetailText justify="space-between">
        <SwapPageFooterItems showRouteInfo />
      </SwapDetailText>
    </StyledSwapPageSettings>
  );
});

const StyledSwapPageSettings = styled(Column)`
  max-width: 480px;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  margin: 0 10px;
  background-color: ${(props) => props.theme.primary.background.normal};
`;

const SwapDetailText = styled(Row).attrs({
  as: SmallText,
  normalTextColor: true,
})`
  position: relative;
  letter-spacing: 0.26px;
`;