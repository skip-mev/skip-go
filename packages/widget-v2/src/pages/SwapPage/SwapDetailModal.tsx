import { css, styled } from "styled-components";
import { createModal, ModalProps } from "@/components/Modal";
import { Column, Row, Spacer } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { RouteArrow } from "@/icons/RouteArrow";
import { SwapPageFooterItems } from "./SwapPageFooter";
import { useAtom, useAtomValue } from "jotai";
import { skipChainsAtom } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import { useMemo, useState } from "react";
import { swapSettingsAtom } from "@/state/swapPage";
import { formatUSD } from "@/utils/intl";
import { SLIPPAGE_OPTIONS } from "@/constants/widget";
import { getClientOperations, OperationType } from "@/utils/clientType";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
import { getBrandButtonTextColor } from "@/utils/colors";
import { QuestionMarkIcon } from "@/icons/QuestionMarkIcon";
import { EvmDisclaimer } from "@/components/EvmDisclaimer";

export const SwapDetailModal = createModal((modalProps: ModalProps) => {
  const { data: route } = useAtomValue(skipRouteAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);
  const [swapSettings, setSwapSettings] = useAtom(swapSettingsAtom);
  const [showMaxSlippageTooltip, setShowMaxSlippageTooltip] = useState(false);
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

  const isSmartRelay = route?.estimatedFees?.some(
    (fee) => fee.feeType === "SMART_RELAY"
  );

  const smartRelayFee = useMemo(() => {
    if (!isSmartRelay) return;
    const fee = route?.estimatedFees.filter(
      (fee) => fee.feeType === "SMART_RELAY"
    );
    const sameAsset = fee?.every(
      (fee, _, arr) => fee.originAsset.symbol === arr[0].originAsset.symbol
    );
    if (!sameAsset) return;
    const computedAmount = fee?.reduce(
      (acc, fee) => acc + Number(fee.amount),
      0
    );
    const computedUsd = fee?.reduce(
      (acc, fee) => acc + Number(fee.usdAmount),
      0
    );
    if (!computedAmount || !fee || !computedUsd) return;
    const inAsset = (
      computedAmount / Math.pow(10, fee[0].originAsset.decimals || 6)
    ).toLocaleString("en-US", {
      maximumFractionDigits: 6,
    });

    return {
      assetAmount: Number(inAsset),
      formattedAssetAmount: `${inAsset} ${fee[0].originAsset.symbol}`,
      formattedUsdAmount: `${formatUSD(computedUsd)}`,
    };
  }, [isSmartRelay, route?.estimatedFees]);

  return (
    <StyledSwapPageSettings gap={20}>
      <Column gap={10}>
        <Row justify="space-between">
          <SwapDetailText>Route</SwapDetailText>
          <Row align="center" gap={5}>
            {chainsRoute?.map((chain, index) => (
              <>
                <img
                  width="20"
                  height="20"
                  src={chain?.logoURI}
                  alt={chain?.prettyName}
                  title={chain?.prettyName}
                />
                {index !== chainsRoute.length - 1 && (
                  <RouteArrow color={modalProps.theme?.primary?.text.normal} />
                )}
              </>
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
        <Row justify="space-between">
          <SwapDetailText>
            Max Slippage
            <Spacer width={5} />
            <QuestionMarkIcon
              onMouseEnter={() => setShowMaxSlippageTooltip(true)}
              onMouseLeave={() => setShowMaxSlippageTooltip(false)}
            />
            {showMaxSlippageTooltip && (
              <Tooltip>
                If price changes unfavorably during the transaction by more than
                this amount, the transaction will revert
              </Tooltip>
            )}
          </SwapDetailText>
          <Row gap={4}>
            {SLIPPAGE_OPTIONS.map((val) => (
              <StyledSlippageOptionLabel
                monospace
                selected={val === swapSettings.slippage}
                onClick={() => setSwapSettings({ slippage: val })}
              >
                {val}%
              </StyledSlippageOptionLabel>
            ))}
            <div style={{ position: "relative" }}>
              <CustomSlippageInput
                type="number"
                value={swapSettings.slippage}
                selected={!SLIPPAGE_OPTIONS.includes(swapSettings.slippage)}
                onChange={(e) =>
                  setSwapSettings({ slippage: parseFloat(e.target.value) })
                }
              />
              <CustomSlippageInputRightIcon
                selected={!SLIPPAGE_OPTIONS.includes(swapSettings.slippage)}
              >
                %
              </CustomSlippageInputRightIcon>
            </div>
          </Row>
        </Row>
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

      <EvmDisclaimer operations={clientOperations} />

      <SwapDetailText justify="space-between">
        <SwapPageFooterItems showRouteInfo />
      </SwapDetailText>
    </StyledSwapPageSettings>
  );
});

const StyledSwapPageSettings = styled(Column)`
  width: 480px;
  padding: 20px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.primary.background.normal};
`;

const StyledSlippageOptionLabel = styled(SmallText) <{ selected?: boolean }>`
  border-radius: 7px;
  padding: 4px 7px;
  white-space: nowrap;
  color: ${({ selected, theme }) =>
    selected
      ? getBrandButtonTextColor(theme.brandColor)
      : theme.primary.text.normal};
  &:hover {
    box-shadow: inset 0px 0px 0px 1px ${(props) => props.theme.brandColor};
    opacity: 1;
    cursor: pointer;
  }
  ${({ selected, theme }) =>
    selected &&
    css`
      background-color: ${theme.brandColor};
      opacity: 1;
    `}
`;

const SwapDetailText = styled(Row).attrs({
  as: SmallText,
  normalTextColor: true,
})`
  position: relative;
  letter-spacing: 0.26px;
`;

const Tooltip = styled(SmallText).attrs({
  normalTextColor: true,
})`
  position: absolute;
  padding: 13px;
  border-radius: 13px;
  border: 1px solid ${({ theme }) => theme.primary.text.ultraLowContrast};
  background-color: ${({ theme }) => theme.secondary.background.normal};
  top: -30px;
  left: 110px;
  width: 250px;
  z-index: 1;
`;

const CustomSlippageInput = styled(SmallText).attrs({
  as: "input",
}) <{ selected?: boolean }>`
  outline: none;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border: 1px solid ${({ theme }) => theme.primary.text.normal};
  border-radius: 7px;
  color: ${({ theme }) => theme.primary.text.normal};
  width: 55px;
  padding: 5px 7px;
  padding-right: 20px;
  box-sizing: border-box;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      color: ${getBrandButtonTextColor(theme.brandColor)};
      background-color: ${theme.brandColor};
    `}
`;

const CustomSlippageInputRightIcon = styled(SmallText) <{ selected?: boolean }>`
  position: absolute;
  top: 50%;
  right: 7px;
  transform: translateY(-50%);
  ${({ selected, theme }) =>
    selected &&
    css`
      color: ${getBrandButtonTextColor(theme.brandColor)};
    `}
`;
