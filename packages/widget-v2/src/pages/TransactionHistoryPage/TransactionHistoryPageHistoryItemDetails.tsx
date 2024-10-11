import { SmallText } from "@/components/Typography";
import { Column, Row } from "@/components/Layout";
import { styled, useTheme } from "styled-components";
import { ChainIcon } from "@/icons/ChainIcon";
import { Button, Link } from "@/components/Button";
import { TrashIcon } from "@/icons/TrashIcon";
import { useMemo } from "react";
import { HistoryArrowIcon } from "@/icons/HistoryArrowIcon";
import { SimpleStatus } from "@/utils/clientType";
import { getTruncatedAddress } from "@/utils/crypto";
import { TransactionDetails } from "@/state/swapExecutionPage";

type TransactionHistoryPageHistoryItemDetailsProps = {
  status: SimpleStatus;
  sourceChainName: string;
  destinationChainName: string;
  absoluteTimeString: string;
  transactionDetails: TransactionDetails[];
  onClickDelete?: () => void;
};

const statusMap = {
  unconfirmed: "Unconfirmed",
  signing: "In Progress",
  broadcasted: "In Progress",
  pending: "In Progress",
  completed: "Completed",
  failed: "Failed",
};

export const TransactionHistoryPageHistoryItemDetails = ({
  status,
  sourceChainName,
  destinationChainName,
  absoluteTimeString,
  transactionDetails,
  onClickDelete,
}: TransactionHistoryPageHistoryItemDetailsProps) => {
  const theme = useTheme();

  const statusColor = useMemo(() => {
    if (status === "failed") {
      return theme.error.text;
    } else if (status === "completed") {
      return theme.success.text;
    }
    return;
  }, [status, theme]);

  return (
    <Column padding={10} gap={10}>
      <Row align="center" gap={10}>
        <StyledDetailsLabel>Status</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor color={statusColor}>
            {statusMap[status]}
          </SmallText>
          <SmallText>at {absoluteTimeString}</SmallText>
        </Row>
      </Row>
      <Row align="center" gap={10}>
        <StyledDetailsLabel>Chain route</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor>{sourceChainName}</SmallText>
          <HistoryArrowIcon color={theme.primary.text.normal} />
          <SmallText normalTextColor>{destinationChainName}</SmallText>
        </Row>
      </Row>

      {transactionDetails.length === 1 ? (
        <Row align="center" gap={10}>
          <StyledDetailsLabel>Transaction ID</StyledDetailsLabel>
          <Link href={transactionDetails?.[0]?.explorerLink} target="_blank" gap={5}>
            <SmallText normalTextColor>
              {getTruncatedAddress(transactionDetails?.[0]?.txHash)}
            </SmallText>
            <SmallText>
              <ChainIcon />
            </SmallText>
          </Link>
        </Row>
      ) : (
        transactionDetails.map((transactionDetail, index) => {
          const getTransactionIdLabel = () => {
            if (index === 0) {
              return "Initial transaction";
            }
            if (index === transactionDetails.length - 1) {
              return "Final transaction";
            }
            return "Transaction";
          };
          return (
            <Row key={`${index}-${transactionDetail.txHash}`} align="center" gap={10}>
              <StyledDetailsLabel key={`${index}-${transactionDetail.txHash}`}>{getTransactionIdLabel()}</StyledDetailsLabel>
              <Link key={`${index}-${transactionDetail.txHash}`} href={transactionDetail.explorerLink} target="_blank" gap={5}>
                <SmallText normalTextColor>
                  {getTruncatedAddress(transactionDetail.txHash)}
                </SmallText>
                <SmallText>
                  <ChainIcon />
                </SmallText>
              </Link>
            </Row>
          );
        })
      )}

      <Row align="center" style={{ marginTop: 10 }}>
        <Button onClick={onClickDelete} gap={5} align="center">
          <SmallText color={theme.error.text}>Delete</SmallText>
          <TrashIcon color={theme.error.text} />
        </Button>
      </Row>
    </Column>
  );
};

const StyledDetailsLabel = styled(SmallText)`
  width: 100px;
`;
