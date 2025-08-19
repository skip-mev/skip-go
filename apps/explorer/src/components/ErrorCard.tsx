import { Container } from "@/components/Container"
import { Column } from "@/components/Layout"
import { SmallTextButton, Text } from "@/components/Typography"
import { TriangleWarningIcon } from "@/icons/TriangleWarningIcon";

export enum ErrorMessages {
  TRANSACTION_ERROR = "We're having trouble displaying this Transaction",
  TRANSACTION_NOT_FOUND = "Transaction not found",
  TRANSFER_EVENT_ERROR = "We're having trouble displaying this step",
}

export const ErrorCard = ({
  errorMessage,
}: {
  errorMessage: string;
}) => {
  return (
    <Container padding={45}>
      <Column align="center" justify="center" gap={12}>
        <TriangleWarningIcon backgroundColor="white" width={18} height={16} />
        <Text textAlign="center" lineHeight="24px">
          {errorMessage}
        </Text>
        <SmallTextButton>
          Retry
        </SmallTextButton>
      </Column>
    </Container>
  )
}