import { Container } from "@/components/Container";
import { Column } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { BridgeIcon } from "../icons/BridgeIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { useTheme } from "@/styled-components";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { TransferType } from "@skip-go/client";
import { OperationType } from "@/utils/clientType";
import type { ReactNode } from "react";

export const getTransferTypeLabel = (transferType: TransferType | OperationType | string) => {
  switch (transferType) {
    case TransferType.ibcTransfer:
      return "IBC";
    case TransferType.axelarTransfer:
      return "Axelar";
    case TransferType.cctpTransfer:
      return "CCTP";
    case TransferType.cctpTransferV2:
      return "CCTP v2";
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
    case OperationType.evmSwap:
      return "EVM Swap";
    case OperationType.swap:
      return "Swap";
    default:
      return transferType;
  }
}

export const Bridge = ({ transferType, durationInMs, children }: { transferType: string, durationInMs?: number, children?: ReactNode }) => {
  const theme = useTheme();
  return (
    <Column align="center" gap={0}>
      <BridgeIcon color={theme.primary.background.normal}/>
      <Container padding={12} width="auto" borderRadius={12} gap={5} flexDirection="row" style={{ alignItems: "center" }}>
        <SmallText normalTextColor>{ getTransferTypeLabel(transferType) }</SmallText>
        {children}
        {
          durationInMs ? (
            <>
              <SmallText> <ClockIcon /> </SmallText>
              <SmallText> {convertSecondsToMinutesOrHours(durationInMs / 1000)}</SmallText>
            </>
          ) : null
        }
      </Container>
      <BridgeIcon color={theme.primary.background.normal} />
    </Column>
  )
}
