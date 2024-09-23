import { SmallText } from "@/components/Typography";
import { Column, Row } from "@/components/Layout";
import styled, { useTheme } from "styled-components";
import { ChainIcon } from "@/icons/ChainIcon";
import { Button } from "@/components/Button";
import { TrashIcon } from "@/icons/TrashIcon";
import { useMemo } from "react";
import { HistoryArrowIcon } from "@/icons/HistoryArrowIcon";
import { SimpleStatus } from "@/utils/clientType";
import { getTruncatedAddress } from "@/utils/crypto";

type TransactionHistoryModalItemDetailsProps = {
  status: SimpleStatus;
  sourceChainName: string;
  destinationChainName: string;
  absoluteTimeString: string;
  relativeTimeString: string;
  transactionHash: string;
  onClickTransactionID: () => void;
  onClickDelete?: () => void;
};

const statusMap = {
  broadcasted: "In Progress",
  pending: "In Progress",
  completed: "Completed",
  failed: "Failed",
};

export const TransactionHistoryModalItemDetails = ({
  status,
  sourceChainName,
  destinationChainName,
  absoluteTimeString,
  relativeTimeString,
  transactionHash,
  onClickTransactionID,
  onClickDelete,
}: TransactionHistoryModalItemDetailsProps) => {
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
      <Row align="center">
        <StyledDetailsLabel>Status</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor color={statusColor}>
            {statusMap[status]}
          </SmallText>
          <SmallText>at {absoluteTimeString}</SmallText>
        </Row>
      </Row>
      <Row align="center">
        <StyledDetailsLabel>Chain route</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor>{sourceChainName}</SmallText>
          <HistoryArrowIcon color={theme.primary.text.normal} />
          <SmallText normalTextColor>{destinationChainName}</SmallText>
        </Row>
      </Row>
      <Row align="center">
        <StyledDetailsLabel>Time</StyledDetailsLabel>
        <SmallText normalTextColor>{relativeTimeString}</SmallText>
      </Row>
      <Row align="center">
        <StyledDetailsLabel>Transaction ID</StyledDetailsLabel>
        <Button onClick={onClickTransactionID} gap={5}>
          <SmallText normalTextColor>{getTruncatedAddress(transactionHash)}</SmallText>
          <SmallText>
            <ChainIcon />
          </SmallText>
        </Button>
      </Row>
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
