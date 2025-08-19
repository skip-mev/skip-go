import { Container } from "@/components/Container";
import { SmallText } from "@/components/Typography";
import { BridgeIcon } from "../icons/BridgeIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { useTheme } from "@/styled-components";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { TransferType } from "@skip-go/client";

export const getTransferTypeLabel = (transferType: TransferType | string) => {
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

export const Bridge = ({ transferType, durationInMs }: { transferType: string, durationInMs?: number }) => {
  const theme = useTheme();
  return (
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