import { Badge } from "./Badge";
import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "@/jotai";
import { Text, SmallText, SmallTextButton } from "@/components/Typography";
import { TransactionState, TransferAssetRelease, TransferEventStatus, TransferType } from "@skip-go/client";
import Image from "next/image";
import { formatDisplayAmount } from "@/utils/number";
import { styled, useTheme } from "@/styled-components";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { convertTokenAmountToHumanReadableAmount, getTruncatedAddress } from "@/utils/crypto";
import { useMemo } from "react";
import { useOverallStatusLabelAndColor } from "../hooks/useOverallStatusLabelAndColor";
import { Link } from "@/components/Button";
import { loadingPulseAnimation } from "@/components/Container";
import { getTransferTypeLabel } from "./Bridge";
import { CoinsIcon } from "../icons/CoinsIcon";
import { Tooltip } from "@/components/Tooltip";

export type Step = "Origin" | "Routed" | "Destination";

export type TransferEventCardProps = {
  chainId: string;
  explorerLink: string;
  transferType: TransferType | string;
  status?: TransferEventStatus;
  state?: TransactionState;
  step: Step;
  durationInMs?: number;
  index: number;
  onReindex?: () => void;
  transferAssetRelease?: TransferAssetRelease;
}

const routedStatusMap: Record<TransferEventStatus, string> = {
  unconfirmed: "Unconfirmed",
  signing: "Signing",
  pending: "Pending",
  completed: "Complete",
  failed: "Failed",
  approving: "Approving",
  incomplete: "Incomplete",
}

export const TransferEventCard = ({ chainId, explorerLink, transferType, status, state, step, index, onReindex, transferAssetRelease }: TransferEventCardProps) => {
  const theme = useTheme();
  const skipChains = useAtomValue(skipChainsAtom);
  const skipAssets = useAtomValue(skipAssetsAtom);
  const { sourceAsset, sourceAmount, destAsset, destAmount, userAddresses, operations } = useTransactionHistoryItemFromUrlParams();

  const statusLabelAndColor = useOverallStatusLabelAndColor({ status });
  const stateLabelAndColor = useOverallStatusLabelAndColor({ state });
  const stateAbandoned = state === "STATE_ABANDONED" && step === "Destination";

  const chain = skipChains?.data?.find((chain) => chain.chainId === chainId);

  const userAddress = userAddresses?.find((address) => address.chainId === chainId)?.address;

  const showTransferAssetRelease = transferAssetRelease && step !== "Destination";

  const renderStatusBadge = useMemo(() => {
    if (stateAbandoned) {
      return (
        <Badge color={stateLabelAndColor?.color} background={stateLabelAndColor?.background}>{stateLabelAndColor?.label}</Badge>
      )
    }
    if (step === "Destination") {
      return (
        <Badge
          color={status !== "pending" ? statusLabelAndColor?.color : undefined}
          background={status !== "pending" ? statusLabelAndColor?.background : undefined}>
          {statusLabelAndColor?.label}
        </Badge>
      )
    }
    if (status) {
      return (
        <Badge flexDirection="row" gap={5} align="center">
          {routedStatusMap[status]}
          {status === "completed" && <GreenDot />}
        </Badge>
      )
    }
  }, [stateAbandoned, stateLabelAndColor?.background, stateLabelAndColor?.color, stateLabelAndColor?.label, status, statusLabelAndColor?.background, statusLabelAndColor?.color, statusLabelAndColor?.label, step]);

  const containerStatus = useMemo(() => {
    if (stateAbandoned) {
      return "warning";
    }

    if (step === "Destination") {
      return status;
    }

  }, [stateAbandoned, status, step]);

  const currentAsset = useMemo(() => {
    if (step === "Origin") {
      return {
        asset: sourceAsset,
        amount: sourceAmount,
      };
    } else if (step === "Destination") {
      return {
        asset: destAsset,
        amount: destAmount,
      };
    } else {
      const currentOperation = operations?.[index];
      const asset = skipAssets?.data?.find((asset) => asset.chainId === currentOperation?.chainId && asset.denom === currentOperation?.denomIn);
      return {
        asset: asset,
        amount: convertTokenAmountToHumanReadableAmount(currentOperation?.amountIn, asset?.decimals),
      };
    }
  }, [step, sourceAsset, sourceAmount, destAsset, destAmount, operations, index, skipAssets?.data]);

  const renderTransferEventDetails = useMemo(() => {

    if (userAddress) {
      return (
        <Column gap={10} justify="center">
          <Row gap={5} align="center">
            {currentAsset?.asset?.logoUri && <Image src={currentAsset?.asset?.logoUri} alt={currentAsset?.asset?.symbol ?? ''} width={20} height={20} />}
            <Text useWindowsTextHack>{formatDisplayAmount(currentAsset?.amount)} {currentAsset?.asset?.symbol}</Text>
          </Row>
          <Row gap={5} align="center">
            <SmallText normalTextColor>on {chain?.prettyName}</SmallText>
            <SmallText>{getTruncatedAddress(userAddress)}</SmallText>
          </Row>
        </Column>
      )
    }

    return (
      <>
        {chain?.logoUri && <Image src={chain?.logoUri} alt={chain?.chainName} width={40} height={40} />}
        <Column justify="center">
          <Text>{chain?.prettyName}</Text>
          <SmallText>{chainId}</SmallText>
        </Column>
      </>
    )
  }, [currentAsset, userAddress, chain?.logoUri, chain?.chainName, chain?.prettyName, chainId]);

  const transferAssetReleaseAsset = useMemo(() => {
    return skipAssets?.data?.find(asset => asset.denom === transferAssetRelease?.denom && asset.chainId === transferAssetRelease?.chainId);
  }, [skipAssets?.data, transferAssetRelease]);

  const renderBottomButton = useMemo(() => {
    const decimals = skipAssets?.data?.find(asset => asset.denom === transferAssetRelease?.denom && asset.chainId === transferAssetRelease?.chainId)?.decimals;
    const skipGoLink = `https://go.skip.build/?src_asset=${transferAssetRelease?.denom}&src_chain=${transferAssetRelease?.chainId}&amount_in=${transferAssetRelease?.amount ? convertTokenAmountToHumanReadableAmount(transferAssetRelease?.amount, decimals) : undefined}`;
    if (stateAbandoned) {
      return (
        <SmallTextButton onClick={onReindex} textAlign="center" color={stateLabelAndColor?.color}>Reindex →</SmallTextButton>
      )
    }

    if (showTransferAssetRelease) {
      return (
        <SmallText>
          <Link href={skipGoLink} color={theme.brandColor} target="_blank" justify="center">
            Reattempt on Skip.go →
          </Link>
        </SmallText>
      )
    }
    
    return (
      <SmallText>
        <Link href={explorerLink} target="_blank" justify="center">
          View on block explorer →
        </Link>
      </SmallText>
    )

  }, [skipAssets?.data, transferAssetRelease?.denom, transferAssetRelease?.chainId, transferAssetRelease?.amount, stateAbandoned, showTransferAssetRelease, explorerLink, onReindex, stateLabelAndColor?.color, theme.brandColor]);

  return (
    <TransferEventContainer loading={status === "pending" && !stateAbandoned} padding={15} width={355} borderRadius={16} status={containerStatus}>
      <Row align="center" justify="space-between">
        <Row gap={8} align="center" justify="center">
          <Badge> {step} </Badge>
          {showTransferAssetRelease && (
            <Tooltip content={`Your assets were released as ${transferAssetReleaseAsset?.symbol} on ${transferAssetReleaseAsset?.chainName}`}>
              <Badge color={theme.brandColor} gap={5} align="center" justify="center">
                Your tokens
                <CoinsIcon />
              </Badge>
            </Tooltip>
          )}
        </Row>
        {renderStatusBadge}
      </Row>
      <TransferEventDetailsCard>
        <Row justify="space-between">
          <Row gap={15}>
            {renderTransferEventDetails}
          </Row>
          <Badge> {getTransferTypeLabel(transferType)} </Badge>
        </Row>
      </TransferEventDetailsCard>
      {renderBottomButton}
    </TransferEventContainer>
  );
};

const GreenDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.success.text};
`;

const TransferEventDetailsCard = styled.div`
  padding: 16px 12px;
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${theme.secondary.background.normal}`};
`;

const TransferEventContainer = styled(Container) <{ status?: string, loading?: boolean }>`
  ${({ status, theme, loading }) => {
    if (loading) {
      return loadingPulseAnimation({
        active: true,
      })
    }

    switch (status) {
      case "completed":
        return `border: 2px solid ${theme.success.text}`;
      case "abandoned":
      case "warning":
        return `border: 2px solid ${theme.warning.text}`;
      case "failed":
      case "error":
        return `border: 2px solid ${theme.error.text}`;
      default:
        return '';
    }
  }}
`;
