import { Badge } from "@/components/Badge";
import { Container } from "@/components/Container";
import { Row } from "@/components/Layout";
import { ClientTransferEvent } from "@skip-go/client";
import { SmallTextButton } from '@/components/Typography';
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";


export type TransferEventCardProps = {
  transferEvent?: ClientTransferEvent;
}

export const TransferEventCard = ({ transferEvent }: TransferEventCardProps) => {
  const { chain } = useGetAssetDetails({
    chainId: transferEvent?.fromChainId,
  });
  console.log(transferEvent);
  console.log(chain);
  return (
    <Container padding={15} width={354} height={144} borderRadius={16}>
      <Row align="center" justify="space-between">
        <Badge> Routed </Badge>
        <Badge> {transferEvent?.status} </Badge>
      </Row>
      <SmallTextButton textAlign="center"> View on Mintscan </SmallTextButton>
    </Container>
  );
};