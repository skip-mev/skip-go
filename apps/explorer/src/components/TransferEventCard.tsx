import { Badge } from "@/components/Badge";
import { Container } from "@/components/Container";
import { Column, Row } from "@/components/Layout";
import { ClientTransferEvent } from "@skip-go/client";
import { SmallTextButton } from '@/components/Typography';
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Text, SmallText } from "@/components/Typography";

export type TransferEventCardProps = {
  transferEvent?: ClientTransferEvent;
}

export const TransferEventCard = ({ transferEvent }: TransferEventCardProps) => {
  const skipChains = useAtomValue(skipChainsAtom);

  const chain = skipChains?.data?.find((chain) => chain.chainId === transferEvent?.fromChainId);
  
  console.log(chain);
  return (
    <Container padding={15} width={354} borderRadius={16}>
      <Row align="center" justify="space-between">
        <Badge> Routed </Badge>
        <Badge> {transferEvent?.status} </Badge>
      </Row>
      <TransferEventDetailsCard>
        <Row gap={15}>
          <img src={chain?.logoUri} alt={chain?.chainName} width={40} height={40} />
          <Column>
            <Text>{chain?.prettyName}</Text>
            <SmallText>{transferEvent?.fromChainId}</SmallText>
          </Column>
        </Row>
      </TransferEventDetailsCard>
      <SmallTextButton textAlign="center"> View on Mintscan </SmallTextButton>
    </Container>
  );
};

const TransferEventDetailsCard = styled.div`
  padding: 16px 12px;
  border: ${({ theme }) => `1px solid ${theme.secondary.background.normal}`};
`;
