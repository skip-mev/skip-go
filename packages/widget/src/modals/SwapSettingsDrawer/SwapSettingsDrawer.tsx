import { styled, useTheme } from "styled-components";
import { createModal } from "@/components/Modal";
import { Column, Row } from "@/components/Layout";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { RouteArrow } from "@/icons/RouteArrow";
import { poweredBySkipGo, SwapPageFooterItems } from "@/pages/SwapPage/SwapPageFooter";
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
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";

export const SwapSettingsDrawer = createModal(() => {
  const theme = useTheme();
  const { data: route } = useAtomValue(skipRouteAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const chainsRoute = useMemo(() => {
    return route?.chainIDs.map((chainID) => chains?.find((chain) => chain.chainID === chainID));
  }, [route, chains]);

  const clientOperations = getClientOperations(route?.operations);

  const transferOperations = useMemo(() => {
    if (!clientOperations) return [];
    return clientOperations.filter((item) =>
      [
        OperationType.axelarTransfer,
        OperationType.hyperlaneTransfer,
        OperationType.goFastTransfer,
      ].includes(item.type),
    );
  }, [clientOperations]);

  const computeFee = (operation: ClientOperation) => {
    if (!operation) return;
    if (operation.type === OperationType.goFastTransfer) {
      const goFastFee = operation.fee;
      if (!goFastFee) return;

      const {
        feeAsset,
        sourceChainFeeAmount,
        destinationChainFeeAmount,
        bpsFeeAmount,
        sourceChainFeeUSD,
        destinationChainFeeUSD,
        bpsFeeUSD,
      } = goFastFee;

      const totalFeeAmount = [sourceChainFeeAmount, destinationChainFeeAmount, bpsFeeAmount].reduce(
        (sum, amount) => sum + Number(amount),
        0,
      );
      const totalUsdAmount = [sourceChainFeeUSD, destinationChainFeeUSD, bpsFeeUSD].reduce(
        (sum, amount) => sum + Number(amount),
        0,
      );

      const computed = convertTokenAmountToHumanReadableAmount(
        totalFeeAmount.toString(),
        feeAsset.decimals,
      );
      return {
        assetAmount: Number(computed),
        formattedAssetAmount: `${computed} ${feeAsset.symbol}`,
        formattedUsdAmount: formatUSD(totalUsdAmount.toString()),
      };
    } else {
      const { feeAmount, feeAsset, usdFeeAmount } = operation;
      if (!feeAmount || !feeAsset || !feeAsset.decimals) return;

      const computed = convertTokenAmountToHumanReadableAmount(feeAmount, feeAsset.decimals);

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
        let label = "";
        switch (operation.type) {
          case OperationType.axelarTransfer:
            label = "Axelar Bridging Fee";
            break;
          case OperationType.hyperlaneTransfer:
            label = "Hyperlane Bridging Fee";
            break;
          case OperationType.goFastTransfer:
            label = "Go Fast Transfer Fee";
            break;
          default:
            break;
        }
        feeList.push({ label, fee });
      }
    });

    const isSmartRelay = checkIsSmartRelay(route);
    const smartRelayFee = calculateSmartRelayFee(isSmartRelay, route?.estimatedFees);

    if (smartRelayFee) {
      feeList.push({ label: "Relayer Fee", fee: smartRelayFee });
    }
    return feeList;
  }, [transferOperations, route]);

  return (
    <StyledSwapPageSettings gap={15}>
      <Column gap={10}>
        <Row justify="space-between" align="center">
          <SwapDetailText>Route</SwapDetailText>
          <Row align="center" gap={5}>
            {chainsRoute?.map((chain, index) => (
              <Fragment key={index}>
                <img
                  width="25"
                  height="25"
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
          <u>Terms of Service</u>
        </SmallText>
        <SmallText
          as="a"
          href="https://docs.skip.build/go/legal-and-privacy/privacy-policy"
          target="_blank"
        >
          <u>Privacy Policy</u>
        </SmallText>
      </Row>
      <Row justify="space-between">
        <SmallTextButton
          color={theme.primary.text.lowContrast}
          onClick={() => {
            NiceModal.hide(Modals.SwapSettingsDrawer);
          }}
        >
          Close
        </SmallTextButton>
        <SmallText>{poweredBySkipGo}</SmallText>
      </Row>
    </StyledSwapPageSettings>
  );
});

const StyledSwapPageSettings = styled(Column)`
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  background: ${(props) => props.theme.primary.background.normal};
`;

const SwapDetailText = styled(Row).attrs({
  as: SmallText,
  normalTextColor: true,
})`
  position: relative;
  letter-spacing: 0.26px;
`;
