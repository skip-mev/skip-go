import { Badge } from "./Badge";
import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { SmallTextButton } from '@/components/Typography';
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "@/jotai";
import { Text, SmallText } from "@/components/Typography";
import { TransferEventStatus, TransferType } from "@skip-go/client";
import Image from "next/image";
import { BridgeIcon } from "../icons/BridgeIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { convertSecondsToMinutesOrHours, formatDisplayAmount } from "@/utils/number";
import { useTheme, styled } from "@/styled-components";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { convertTokenAmountToHumanReadableAmount, getTruncatedAddress } from "@/utils/crypto";
import { useMemo } from "react";
import { useOverallStatusLabelAndColor } from "../hooks/useOverallStatusLabelAndColor";
import { Link } from "@/components/Button";
import { loadingPulseAnimation } from "@/components/Container";

export type Step = "Origin" | "Routed" | "Destination";

export type TransferEventCardProps = {
  chainId: string;
  explorerLink: string;
  transferType: TransferType | string;
  status?: TransferEventStatus;
  step: Step;
  txHash?: string;
  durationInMs?: number;
  index: number;
}

const getTransferTypeLabel = (transferType: TransferType | string) => {
  switch (transferType) {
    case TransferType.ibcTransfer:
      return "IBC";
    case TransferType.axelarTransfer:
      return "Axelar";
    case TransferType.cctpTransfer:
      return "CCTP";
    case TransferType.hyperlaneTransfer:
      return "Hyperlane";
    case TransferType.opInitTransfer:
      return "OP INIT";
    case TransferType.goFastTransfer:
      return "GO FAST";
    case TransferType.stargateTransfer:
      return "Stargate";
    case TransferType.eurekaTransfer:
      return "Eureka";
    case TransferType.layerZeroTransfer:
      return "Layer Zero";
    default:
      return transferType;
  }
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

export const TransferEventCard = ({ chainId, explorerLink, transferType, status, step, index, durationInMs = 0 }: TransferEventCardProps) => {
  const skipChains = useAtomValue(skipChainsAtom);
  const skipAssets = useAtomValue(skipAssetsAtom);
  const theme = useTheme();
  const { sourceAsset, sourceAmount, destAsset, destAmount, userAddresses, operations, routeStatus } = useTransactionHistoryItemFromUrlParams();

  const statusLabelAndColor = useOverallStatusLabelAndColor({ status: routeStatus ?? status });

  const chain = skipChains?.data?.find((chain) => chain.chainId === chainId);

  const userAddress = userAddresses?.find((address) => address.chainId === chainId)?.address;

  const renderStatusBadge = useMemo(() => {
    if (step === "Destination") {
      return (
        <Badge
          color={ status !== "pending" ? statusLabelAndColor?.color : undefined}
          background={status !== "pending" ? statusLabelAndColor?.background : undefined}>
          { statusLabelAndColor?.label }
        </Badge>
      )
    }
    if (status) {
      return (
        <Badge flexDirection="row" gap={5} align="center">
          { routedStatusMap[status] }
          { status === "completed" && <GreenDot /> }
        </Badge>
      )
    }
  }, [status, statusLabelAndColor?.background, statusLabelAndColor?.color, statusLabelAndColor?.label, step]);

  const renderTransferEventDetails = useMemo(() => {
    const getCurrentAsset = () => {
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
        console.log("operations", operations, index);
        const currentOperation = operations?.[index];
        const asset = skipAssets?.data?.find((asset) => asset.chainId === currentOperation?.chainId && asset.denom === currentOperation?.denomIn);
        return {
          asset: asset,
          amount: convertTokenAmountToHumanReadableAmount(currentOperation?.amountIn, asset?.decimals),
        };
      }
    }

    const currentAsset = getCurrentAsset();

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
  }, [userAddress, chain?.logoUri, chain?.chainName, chain?.prettyName, chainId, step, sourceAsset, sourceAmount, destAsset, destAmount, operations, index, skipAssets?.data]);
  
  return (
    <Column align="center" justify="center">
      {
        step !== "Origin" && (
          <>
            <BridgeIcon color={theme.primary.background.normal}/>
            <Container padding={12} width="auto" borderRadius={12} gap={5} flexDirection="row">
              <SmallText normalTextColor>{ getTransferTypeLabel(transferType) }</SmallText>
              {
                durationInMs ? (
                  <>
                    <SmallText> <ClockIcon /> </SmallText>
                    <SmallText> {durationInMs ? convertSecondsToMinutesOrHours(durationInMs / 1000) : "Instant"}</SmallText>
                  </>
                ) : null
              }
            </Container>
            <BridgeIcon color={theme.primary.background.normal} />
          </>
        )
      }
     
      <TransferEventContainer loading={status === "pending"} padding={15} width={355} borderRadius={16} status={step === "Destination" ? status : undefined}>
        <Row align="center" justify="space-between">
          <Badge> { step } </Badge>
          { renderStatusBadge }
        </Row>
        <TransferEventDetailsCard>
          <Row justify="space-between">
            <Row gap={15}>
              { renderTransferEventDetails }
            </Row>
            <Badge> { getTransferTypeLabel(transferType) } </Badge>
          </Row>
        </TransferEventDetailsCard>
        <SmallText>
          <Link href={explorerLink} target="_blank" justify="center">
            View on Mintscan →
          </Link>
        </SmallText>
      </TransferEventContainer>
    </Column>
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

const TransferEventContainer = styled(Container)<{ status?: string, loading?: boolean }>`
  ${({ status, theme, loading}) => {
    if (loading) {
      return loadingPulseAnimation({
        active: true,
      })
    }

    switch (status) {
      case "completed":
        return `border: 2px solid ${theme.success.text}`;
      case "warning":
        return `border: 2px solid ${theme.warning.text}`;
      case "error":
        return `border: 2px solid ${theme.error.text}`;
      default:
        return '';
    }
  }}
`;
