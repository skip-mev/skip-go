import { Badge } from "./Badge";
import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "@/jotai";
import { Text, SmallText, SmallTextButton } from "@/components/Typography";
import type { TransferEventStatus } from "@skip-go/client";
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
import { useClipboard } from "@/hooks/useClipboard";
import { useGetTransferAssetReleaseAsset } from "../hooks/useGetTransferAssetReleaseAsset";
import type { TimelineCard } from "../utils/routeTimeline";

const SKIP_GO_URL = process.env.NEXT_PUBLIC_SKIP_GO_URL ||
  (process.env.NODE_ENV === "development" ? "https://dev.go.skip.build" : "https://go.skip.build");

export type TransferEventCardProps = Omit<TimelineCard, "id" | "txIndex" | "timeline"> & {
  timeline?: TimelineCard["timeline"];
  onReindex?: () => void;
};

const routedStatusMap: Record<TransferEventStatus, string> = {
  unconfirmed: "Unconfirmed",
  signing: "Signing",
  pending: "Pending",
  completed: "Complete",
  failed: "Failed",
  approving: "Approving",
  incomplete: "Incomplete",
}

export const TransferEventCard = ({ chainId, explorerLink, transferType, status, state, step, onReindex, transferAssetRelease, timeline }: TransferEventCardProps) => {
  const theme = useTheme();
  const skipChains = useAtomValue(skipChainsAtom);
  const skipAssets = useAtomValue(skipAssetsAtom);
  const { sourceAsset, sourceAmount, destAsset, destAmount, userAddresses } = useTransactionHistoryItemFromUrlParams();
  const { saveToClipboard: saveUserAddressToClipboard, isCopied: isUserAddressCopied } = useClipboard();

  const statusLabelAndColor = useOverallStatusLabelAndColor({ status });
  const stateLabelAndColor = useOverallStatusLabelAndColor({ state });
  const stateAbandoned = state === "STATE_ABANDONED" && (timeline?.isTransactionEnd ?? step === "Destination");
  const stateFailed = (timeline?.isTransactionEnd ?? step === "Destination") &&
    (timeline?.phase === "failed" || status === "failed");

  const chain = skipChains?.data?.find((chain) => chain.chainId === chainId);

  const userAddress = userAddresses?.find((address) => address.chainId === chainId)?.address;

  const showTransferAssetRelease = transferAssetRelease?.released && (timeline?.canRecover ?? step !== "Destination");

  const transferAssetReleaseAsset = useGetTransferAssetReleaseAsset(transferAssetRelease);
  const releaseChain = skipChains.data?.find(chain => chain.chainId === transferAssetRelease?.chainId);

  const renderStatusBadge = useMemo(() => {
    if (timeline?.phase === "planned") {
      return (
        <Badge flexDirection="row" gap={5} align="center">
          Canceled
          <RedDot />
        </Badge>
      );
    }
    if (stateAbandoned) {
      return (
        <Tooltip content="Transaction got stuck. Retry indexing">
          <Badge
            color={stateLabelAndColor?.color}
            background={stateLabelAndColor?.background}>
            {stateLabelAndColor?.label}
          </Badge>
        </Tooltip>
      )
    }
    if (stateFailed) {
      const failureLabelAndColor = timeline?.phase === "failed" ? stateLabelAndColor : statusLabelAndColor;
      return (
        <Badge color={failureLabelAndColor?.color} background={failureLabelAndColor?.background}>
          {failureLabelAndColor?.label}
        </Badge>
      );
    }
    if (timeline && timeline.source !== "event" && status === undefined) {
      return (
        <Badge
          color={timeline.phase !== "failed" ? stateLabelAndColor?.color : undefined}
          background={timeline.phase !== "failed" ? stateLabelAndColor?.background : undefined}>
          {stateLabelAndColor?.label}
        </Badge>
      );
    }
    if (step === "Origin") {
      return (
        <Badge flexDirection="row" gap={5} align="center">
          Complete
          <GreenDot />
        </Badge>
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
  }, [timeline, stateAbandoned, stateFailed, stateLabelAndColor, status, statusLabelAndColor, step]);

  const containerStatus = useMemo(() => {
    if (stateAbandoned) {
      return "warning";
    }

    if (stateFailed) return "failed";
    if (step === "Destination") return status ?? (timeline?.phase === "success" ? "completed" : undefined);

  }, [stateFailed, stateAbandoned, status, step, timeline?.phase]);

  const currentAsset = useMemo(() => {
    const transferAssetReleaseAmount = convertTokenAmountToHumanReadableAmount(transferAssetRelease?.amount ?? '', transferAssetReleaseAsset?.decimals);

    if (timeline) {
      const details = timeline.asset;
      const asset = details && ((!details.estimated && transferAssetReleaseAsset) || skipAssets?.data?.find(asset => asset.chainId === details.chainId && asset.denom === details.denom));
      return {
        asset,
        amount: asset && details?.amount ? convertTokenAmountToHumanReadableAmount(details.amount, asset.decimals) : undefined,
      };
    }
    // Legacy links without a route still use the available source/destination metadata.
    return {
      asset: (step === "Origin" ? sourceAsset : destAsset) ?? transferAssetReleaseAsset,
      amount: (step === "Origin" ? sourceAmount : destAmount) ?? transferAssetReleaseAmount,
    };
  }, [timeline, transferAssetRelease, transferAssetReleaseAsset, step, sourceAsset, sourceAmount, destAsset, destAmount, skipAssets?.data]);

  const renderTransferEventDetails = useMemo(() => {

    if (currentAsset?.asset) {
      const assetChain = skipChains.data?.find(chain => chain.chainId === currentAsset.asset?.chainId);
      const chainName = assetChain?.prettyName ?? assetChain?.chainName ?? currentAsset.asset.chainName;
      return (
        <Column gap={10} justify="center">
          <Row gap={5} align="center">
            {currentAsset?.asset?.logoUri && <Image src={currentAsset?.asset?.logoUri} alt={currentAsset?.asset?.symbol ?? ''} width={20} height={20} />}
            <Text useWindowsTextHack>{timeline && currentAsset?.amount === undefined ? "--" : formatDisplayAmount(currentAsset?.amount)} {currentAsset?.asset?.symbol}</Text>
          </Row>
          <Row gap={5} align="center">
            <SmallText normalTextColor>on {chainName}</SmallText>
            {
              userAddress && (
                <SmallTextButton onClick={() => saveUserAddressToClipboard(userAddress)}>
                  <Tooltip content={userAddress}>
                    <SmallText>{isUserAddressCopied ? "Copied!" : getTruncatedAddress(userAddress)}</SmallText>
                  </Tooltip>
                </SmallTextButton>
              )
            }
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
  }, [timeline, skipChains.data, currentAsset?.asset, currentAsset?.amount, chain?.logoUri, chain?.chainName, chain?.prettyName, chainId, userAddress, isUserAddressCopied, saveUserAddressToClipboard]);

  const isLoading = useMemo(() => {
    return (status === "pending" || timeline?.phase === "pending") && !stateAbandoned && !stateFailed && step !== "Origin";
  }, [timeline?.phase, status, stateAbandoned, stateFailed, step]);

  const renderBottomButton = useMemo(() => {
    if (timeline?.phase === "planned" || timeline?.phase === "loading") return null;
    const decimals = skipAssets?.data?.find(asset => asset.denom === transferAssetRelease?.denom && asset.chainId === transferAssetRelease?.chainId)?.decimals;
    const skipGoLink = new URL(`/?src_asset=${transferAssetRelease?.denom}&src_chain=${transferAssetRelease?.chainId}&amount_in=${transferAssetRelease?.amount ? convertTokenAmountToHumanReadableAmount(transferAssetRelease?.amount, decimals) : undefined}`, SKIP_GO_URL).href;
    if (stateAbandoned) {
      return (
        <SmallTextButton onClick={onReindex} textAlign="center" color={stateLabelAndColor?.color}>Reindex →</SmallTextButton>
      )
    }

    if (showTransferAssetRelease) {
      return (
        <SmallText>
          <Link href={skipGoLink} color={theme.brandColor} target="_blank" justify="center">
            Try again on Skip.go →
          </Link>
        </SmallText>
      )
    }

    return (
      <SmallText>
        {
          explorerLink && (
            <Link href={explorerLink} target="_blank" justify="center">
              View on block explorer →
            </Link>
          )
        }
      </SmallText>
    )

  }, [timeline?.phase, skipAssets?.data, transferAssetRelease?.denom, transferAssetRelease?.chainId, transferAssetRelease?.amount, stateAbandoned, showTransferAssetRelease, explorerLink, onReindex, stateLabelAndColor?.color, theme.brandColor]);

  return (
    <TransferEventContainer $dimmed={timeline?.phase === "planned"} loading={isLoading} padding={15} width="100%" borderRadius={16} status={containerStatus}>
      <Row align="center" justify="space-between">
        <Row gap={8} align="center" justify="center">
          <Badge> {step} </Badge>
          {showTransferAssetRelease && (
            <Tooltip content={`Your assets were released as ${transferAssetReleaseAsset?.symbol} on ${releaseChain?.prettyName ?? releaseChain?.chainName ?? transferAssetReleaseAsset?.chainName}`}>
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

const RedDot = styled(GreenDot)`
  background-color: ${({ theme }) => theme.error.text};
`;

const TransferEventDetailsCard = styled.div`
  padding: 16px 12px;
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${theme.secondary.background.normal}`};
`;

export const TransferEventContainer = styled(Container) <{ status?: string, loading?: boolean, $dimmed?: boolean }>`
  max-width: 100%;
  opacity: ${({ $dimmed }) => $dimmed ? 0.5 : 1};
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
