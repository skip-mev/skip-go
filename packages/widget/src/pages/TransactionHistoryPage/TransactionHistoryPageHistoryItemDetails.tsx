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
import { createExplorerLink } from "@/utils/explorerLink";
import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";

type TransactionHistoryPageHistoryItemDetailsProps = {
  status?: SimpleStatus;
  sourceChainName: string;
  destinationChainName: string;
  absoluteTimeString: string;
  transactionDetails: TransactionDetails[];
  onClickDelete?: () => void;
  explorerLinks?: string[];
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
  explorerLinks,
}: TransactionHistoryPageHistoryItemDetailsProps) => {
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);

  const statusColor = useMemo(() => {
    if (status === "failed" || status === "incomplete") {
      return theme.error.text;
    } else if (status === "completed") {
      return theme.success.text;
    }
    return;
  }, [status, theme]);

  const handleClickingLinkIfNoExplorerLink = (txHash?: string, explorerLink?: string) => {
    if (!explorerLink) {
      copyToClipboard(txHash);
    }
  };

  const getTxHashFromLink = (link?: string) => {
    const splitLinkBySlash = link?.split("/");
    if (!splitLinkBySlash) return;
    return splitLinkBySlash[splitLinkBySlash.length - 1];
  };

  const renderTransactionIds = useMemo(() => {
    const initialTxHash = transactionDetails?.[0]?.txHash;
    const chainId = transactionDetails?.[0]?.chainID;
    const chainType = chains?.find((chain) => chain.chainID === chainId)?.chainType;
    const explorerLink = createExplorerLink({
      txHash: transactionDetails?.[0]?.txHash,
      chainID: chainId,
      chainType,
    });

    if (explorerLinks?.length === 0) {
      return (
        <StyledHistoryItemDetailRow align="center">
          <StyledDetailsLabel>Initial transaction</StyledDetailsLabel>
          <Link
            onClick={() => handleClickingLinkIfNoExplorerLink(initialTxHash, explorerLink)}
            href={explorerLink}
            title={initialTxHash}
            target="_blank"
            gap={5}
          >
            <SmallText normalTextColor>{getTruncatedAddress(initialTxHash)}</SmallText>
          </Link>
        </StyledHistoryItemDetailRow>
      );
    }
    return explorerLinks?.map((link, index) => {
      const txHash = getTxHashFromLink(link);
      const getTransactionIdLabel = () => {
        if (index === 0) {
          return "Initial transaction ";
        }
        if (index === explorerLinks.length - 1) {
          return "Final transaction ";
        }
        return "Transaction ";
      };
      return (
        <StyledHistoryItemDetailRow key={`${index}-${txHash}`} align="center">
          <StyledDetailsLabel key={`${index}-${txHash}`}>
            {getTransactionIdLabel()}
          </StyledDetailsLabel>
          <Link
            onClick={() => handleClickingLinkIfNoExplorerLink(txHash, link)}
            key={`${index}-${txHash}`}
            href={link}
            title={txHash}
            target="_blank"
            gap={5}
          >
            <SmallText normalTextColor>{getTruncatedAddress(txHash)}</SmallText>
            <SmallText>
              <ChainIcon />
            </SmallText>
          </Link>
        </StyledHistoryItemDetailRow>
      );
    });
  }, [explorerLinks, transactionDetails]);

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

      {renderTransactionIds}

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

const StyledHistoryItemDetailRow = styled(Row).attrs({
  gap: 5,
})`
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
