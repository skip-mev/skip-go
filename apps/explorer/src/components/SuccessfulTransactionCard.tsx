import { GhostButton } from "@/components/Button"
import { Column } from "@/components/Layout"
import { SmallText, Text } from "@/components/Typography"
import { HamburgerIcon } from "@/icons/HamburgerIcon"
import { TransferEventContainer } from "./TransferEventCard"

export const SuccessfulTransactionCard = ({ showRawDataModal }: { showRawDataModal: () => void }) => {
  return (
    <Column width={355} align="flex-end" gap={10}>
      <GhostButton gap={5} onClick={showRawDataModal}>
        View raw data <HamburgerIcon />
      </GhostButton>
      <TransferEventContainer padding={45} status="completed">
        <Column align="center" justify="center" gap={12}>
          <Text textAlign="center" lineHeight="24px">
            Transaction successful
          </Text>
          <SmallText textAlign="center" lineHeight="24px">
            This transaction has completed successfully. No cross-chain transfers were made.
          </SmallText>
        </Column>
      </TransferEventContainer>
    </Column>
  )
}