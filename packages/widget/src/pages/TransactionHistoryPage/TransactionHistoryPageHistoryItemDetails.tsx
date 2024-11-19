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
import { copyToClipboard } from "@/utils/misc";

type TransactionHistoryPageHistoryItemDetailsProps = {
  status?: SimpleStatus;
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
  approving: "Approving allowance",
  incomplete: "Incomplete",
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
    if (status === "failed" || status === "incomplete") {
      return theme.error.text;
    } else if (status === "completed") {
      return theme.success.text;
    }
    return;
  }, [status, theme]);

  const handleClickingLinkIfNoExplorerLink = (
    txHash: string,
    explorerLink?: string
  ) => {
    if (!explorerLink) {
      copyToClipboard(txHash);
    }
  };

  return (
    <Column padding={20} gap={10} style={{ paddingTop: 10 }}>
      <StyledHistoryItemDetailRow align="center">
        <StyledDetailsLabel>Status</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor color={statusColor}>
            {status ? statusMap[status] : "Loading..."}
          </SmallText>
          <SmallText>at {absoluteTimeString}</SmallText>
        </Row>
      </StyledHistoryItemDetailRow>
      <StyledHistoryItemDetailRow align="center">
        <StyledDetailsLabel>Chain route</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor>{sourceChainName}</SmallText>
          <HistoryArrowIcon color={theme.primary.text.normal} />
          <SmallText normalTextColor>{destinationChainName}</SmallText>
        </Row>
      </StyledHistoryItemDetailRow>

      {transactionDetails.length === 1 ? (
        <StyledHistoryItemDetailRow align="center">
          <StyledDetailsLabel>Transaction ID</StyledDetailsLabel>
          <Link
            onClick={() => handleClickingLinkIfNoExplorerLink(transactionDetails?.[0]?.txHash, transactionDetails?.[0]?.explorerLink)}
            href={transactionDetails?.[0]?.explorerLink}
            title={transactionDetails?.[0]?.txHash}
            target="_blank"
            gap={5}
          >
            <SmallText normalTextColor>
              {getTruncatedAddress(transactionDetails?.[0]?.txHash)}
            </SmallText>
            <SmallText>
              <ChainIcon />
            </SmallText>
          </Link>
        </StyledHistoryItemDetailRow>
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
            <StyledHistoryItemDetailRow
              key={`${index}-${transactionDetail.txHash}`}
              align="center"
            >
              <StyledDetailsLabel key={`${index}-${transactionDetail.txHash}`}>
                {getTransactionIdLabel()}
              </StyledDetailsLabel>
              <Link
                onClick={() => handleClickingLinkIfNoExplorerLink(transactionDetail.txHash, transactionDetail.explorerLink)}
                key={`${index}-${transactionDetail.txHash}`}
                href={transactionDetail.explorerLink}
                title={transactionDetail?.txHash}
                target="_blank"
                gap={5}
              >
                <SmallText normalTextColor>
                  {getTruncatedAddress(transactionDetail.txHash)}
                </SmallText>
                <SmallText>
                  <ChainIcon />
                </SmallText>
              </Link>
            </StyledHistoryItemDetailRow>
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

const StyledHistoryItemDetailRow = styled(Row)`
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
