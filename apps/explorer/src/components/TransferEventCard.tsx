import { Badge } from "@/components/Badge";
import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { SmallTextButton } from '@/components/Typography';
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "@/jotai";
import { Text, SmallText } from "@/components/Typography";
import { TransferType } from "@skip-go/client";
import Image from "next/image";
import { BridgeIcon } from "../icons/BridgeIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { convertSecondsToMinutesOrHours, formatDisplayAmount } from "@/utils/number";
import { useTheme, styled } from "@/styled-components";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { convertTokenAmountToHumanReadableAmount, getTruncatedAddress } from "@/utils/crypto";
import { useMemo } from "react";

export type Step = "Origin" | "Routed" | "Destination";

export type TransferEventCardProps = {
  chainId: string;
  explorerLink: string;
  transferType: TransferType | string;
  status: string;
  step: Step;
  txHash?: string;
  durationInMs?: number;
  index: number;
  // transferEvent?: ClientTransferEvent;
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

export const TransferEventCard = ({ chainId, explorerLink, transferType, status, step, index, durationInMs = 0 }: TransferEventCardProps) => {
  const skipChains = useAtomValue(skipChainsAtom);
  const skipAssets = useAtomValue(skipAssetsAtom);
  const theme = useTheme();
  const { sourceAsset, sourceAmount, destAsset, destAmount, userAddresses, operations } = useTransactionHistoryItemFromUrlParams();

  const chain = skipChains?.data?.find((chain) => chain.chainId === chainId);

  const userAddress = userAddresses?.find((address) => address.chainId === chainId)?.address;

  console.log("user address", userAddress, userAddresses);

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
        console.log("operations", operations);
        const currentOperation = operations?.[index];
        console.log("currentOperation", currentOperation);
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
            <Text>{formatDisplayAmount(currentAsset?.amount)} {currentAsset?.asset?.symbol}</Text>
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
  }, [userAddress, chain, chainId, sourceAsset]);
  
  return (
    <Column align="center" justify="center">
      {
        step !== "Origin" && (
          <>
            <BridgeIcon color={theme.primary.background.normal}/>
            <Container padding={12} width="auto" borderRadius={12} gap={5} flexDirection="row">
              <SmallText normalTextColor>{ getTransferTypeLabel(transferType) }</SmallText>
              <SmallText> <ClockIcon /> </SmallText>
              <SmallText> {durationInMs ? convertSecondsToMinutesOrHours(durationInMs / 1000) : "Instant"}</SmallText>
            </Container>
            <BridgeIcon color={theme.primary.background.normal} />
          </>
        )
      }
     
      <TransferEventContainer padding={15} width={355} borderRadius={16} status={step === "Destination" ? status : undefined}>
        <Row align="center" justify="space-between">
          <Badge> { step } </Badge>
          <Badge variant={step === "Destination" ? status : undefined}> {status} </Badge>
        </Row>
        <TransferEventDetailsCard>
          <Row justify="space-between">
            <Row gap={15}>
              { renderTransferEventDetails }
            </Row>
            <Badge> { getTransferTypeLabel(transferType) } </Badge>
          </Row>
        </TransferEventDetailsCard>
        <SmallTextButton textAlign="center" onClick={() => window.open(explorerLink, "_blank")}> View on Mintscan → </SmallTextButton>
      </TransferEventContainer>
    </Column>
);
};

const TransferEventDetailsCard = styled.div`
  padding: 16px 12px;
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${theme.secondary.background.normal}`};
`;

const TransferEventContainer = styled(Container)<{ status?: string}>`
    ${({ theme, status }) => {
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
  }};
`;
