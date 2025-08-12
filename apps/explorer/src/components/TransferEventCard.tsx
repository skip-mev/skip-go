import { Badge } from "@/components/Badge";
import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { SmallTextButton } from '@/components/Typography';
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { styled } from "@/widget";
import { Text, SmallText } from "@/components/Typography";
import { TransferType } from "@skip-go/client";

export type Step = "Origin" | "Routed" | "Destination";

export type TransferEventCardProps = {
  chainId: string;
  explorerLink: string;
  transferType: TransferType | string;
  status: string;
  step: Step;
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

export const TransferEventCard = ({ chainId, explorerLink, transferType, status, step }: TransferEventCardProps) => {
  const skipChains = useAtomValue(skipChainsAtom);

  const chain = skipChains?.data?.find((chain) => chain.chainId === chainId);
  
  return (
    <TransferEventContainer padding={15} width={354} borderRadius={16} status={step === "Destination" ? status : undefined}>
      <Row align="center" justify="space-between">
        <Badge> { step } </Badge>
        <Badge variant={step === "Destination" ? status : undefined}> {status} </Badge>
      </Row>
      <TransferEventDetailsCard>
        <Row justify="space-between">
          <Row gap={15}>
            <img src={chain?.logoUri} alt={chain?.chainName} width={40} height={40} />
            <Column justify="center">
              <Text>{chain?.prettyName}</Text>
              <SmallText>{chainId}</SmallText>
            </Column>
          </Row>
          <Badge> { getTransferTypeLabel(transferType) } </Badge>
        </Row>
      </TransferEventDetailsCard>
      <SmallTextButton textAlign="center" onClick={() => window.open(explorerLink, "_blank")}> View on Mintscan → </SmallTextButton>
    </TransferEventContainer>
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
