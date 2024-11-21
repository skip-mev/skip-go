import { styled, useTheme } from "styled-components";
import { createModal } from "@/components/Modal";
import { Column, Row } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { RouteArrow } from "@/icons/RouteArrow";
import { SwapPageFooterItems } from "@/pages/SwapPage/SwapPageFooter";
import { useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import { Fragment, useMemo } from "react";
import { formatUSD } from "@/utils/intl";
import { ClientOperation, getClientOperations, OperationType } from "@/utils/clientType";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { calculateSmartRelayFee, checkIsSmartRelay } from "@/utils/route";
import SlippageSelector from "@/pages/SwapPage/SlippageSelector";
import RoutePreferenceSelector from "@/pages/SwapPage/RoutePreferenceSelector";

export const SwapSettingsDrawer = createModal(() => {
  const theme = useTheme();
  const { data: route } = useAtomValue(skipRouteAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const chainsRoute = useMemo(() => {
    return route?.chainIDs.map((chainID) =>
      chains?.find((chain) => chain.chainID === chainID)
    );
  }, [route, chains]);

  const clientOperations = getClientOperations(route?.operations);

  const transferOperations = useMemo(() => {
    if (!clientOperations) return [];
    return clientOperations.filter((item) =>
      [
        OperationType.axelarTransfer,
        OperationType.hyperlaneTransfer,
        OperationType.goFastTransfer,
      ].includes(item.type)
    );
  }, [clientOperations]);

  const computeFee = (operation: ClientOperation) => {
    if (!operation) return;
    if (operation.type === OperationType.goFastTransfer) {
      const goFastFee = operation.fee;
      if (!goFastFee) return;

      const { feeAsset, sourceChainFeeAmount, destinationChainFeeAmount,
        bpsFeeAmount, sourceChainFeeUSD, destinationChainFeeUSD, bpsFeeUSD }
        = goFastFee;

      const totalFeeAmount = [sourceChainFeeAmount, destinationChainFeeAmount, bpsFeeAmount]
        .reduce((sum, amount) => sum + Number(amount), 0);
      const totalUsdAmount = [sourceChainFeeUSD, destinationChainFeeUSD, bpsFeeUSD]
        .reduce((sum, amount) => sum + Number(amount), 0);

      const computed = convertTokenAmountToHumanReadableAmount(
        totalFeeAmount.toString(),
        feeAsset.decimals
      )
      return {
        assetAmount: Number(computed),
        formattedAssetAmount: `${computed} ${feeAsset.symbol}`,
        formattedUsdAmount: formatUSD(totalUsdAmount.toString()),
      };
    } else {
      const { feeAmount, feeAsset, usdFeeAmount } = operation;
      if (!feeAmount || !feeAsset || !feeAsset.decimals) return;

      const computed = convertTokenAmountToHumanReadableAmount(
        feeAmount,
        feeAsset.decimals
      );

      return {
        assetAmount: Number(computed),
        formattedAssetAmount: `${computed} ${feeAsset.symbol}`,
        formattedUsdAmount: usdFeeAmount ? formatUSD(usdFeeAmount) : undefined,
      };
    }
  };

  const fees = useMemo(() => {
    const feeList = [];

    transferOperations.forEach((operation) => {
      const fee = computeFee(operation);
      if (fee) {
        let label = '';
        switch (operation.type) {
          case OperationType.axelarTransfer:
            label = 'Axelar Bridging Fee';
            break;
          case OperationType.hyperlaneTransfer:
            label = 'Hyperlane Bridging Fee';
            break;
          case OperationType.goFastTransfer:
            label = 'Go Fast Transfer Fee';
            break;
          default:
            break;
        }
        feeList.push({ label, fee });
      }
    });

    const isSmartRelay = checkIsSmartRelay(route);
    const smartRelayFee = calculateSmartRelayFee(
      isSmartRelay,
      route?.estimatedFees
    );

    if (smartRelayFee) {
      feeList.push({ label: 'Relayer Fee', fee: smartRelayFee });
    }
    return feeList;
  }, [transferOperations, route]);

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
      {fees.length > 0 && (
        <Column gap={10}>
          {fees.map(({ label, fee }, index) => (
            <Row justify="space-between" key={index}>
              <SwapDetailText>{label}</SwapDetailText>
              <SwapDetailText monospace>
                {fee.formattedAssetAmount} ({fee.formattedUsdAmount})
              </SwapDetailText>
            </Row>
          ))}
        </Column>
      )}
      <RoutePreferenceSelector />
      <SlippageSelector />
      <SwapDetailText justify="space-between">
        <SwapPageFooterItems showRouteInfo />
      </SwapDetailText>
    </StyledSwapPageSettings>
  );
});

const StyledSwapPageSettings = styled(Column)`
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
