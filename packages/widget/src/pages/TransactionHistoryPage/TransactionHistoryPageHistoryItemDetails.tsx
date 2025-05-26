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
import { TransferAssetRelease } from "@skip-go/client";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { createSkipExplorerLink } from "@/utils/explorerLink";
import { TransactionDetails } from "@/state/swapExecutionPage";
import { onlyTestnetsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";

type TransactionHistoryPageHistoryItemDetailsProps = {
  status?: SimpleStatus;
  sourceChainName: string;
  destinationChainName: string;
  absoluteTimeString: string;
  onClickDelete?: () => void;
  transferAssetRelease?: TransferAssetRelease;
  transactionDetails: TransactionDetails[];
};

const statusMap = {
  unconfirmed: "Unconfirmed",
  signing: "In Progress",
  broadcasted: "In Progress",
  pending: "In Progress",
  completed: "Completed",
  failed: "Failed",
  approving: "Approving allowance",
  incomplete: "Not completed",
};

export const TransactionHistoryPageHistoryItemDetails = ({
  status,
  sourceChainName,
  destinationChainName,
  absoluteTimeString,
  onClickDelete,
  transferAssetRelease,
  transactionDetails,
}: TransactionHistoryPageHistoryItemDetailsProps) => {
  const theme = useTheme();

  const isTestnet = useAtomValue(onlyTestnetsAtom);

  const statusColor = useMemo(() => {
    if (status === "failed" || status === "incomplete") {
      if (transferAssetRelease) {
        return theme.warning.text;
      }
      return theme.error.text;
    } else if (status === "completed") {
      return theme.success.text;
    }
    return;
  }, [status, theme.error.text, theme.success.text, theme.warning.text, transferAssetRelease]);

  const showTransferAssetRelease = Boolean(
    transferAssetRelease &&
      transferAssetRelease.released &&
      (status === "failed" || status === "incomplete"),
  );

  const transferAssetReleaseAsset = useGetAssetDetails({
    assetDenom: transferAssetRelease?.denom,
    chainId: transferAssetRelease?.chainId,
  });

  const renderSkipExplorerLinks = useMemo(() => {
    return transactionDetails.map((txDetails, index) => {
      const getLabel = () => {
        if (index === 0) return "Route explorer";
        if (index === 1) return "Second tx explorer";
        return "tx explorer";
      };

      const skipExplorerLink = createSkipExplorerLink(
        txDetails?.txHash,
        txDetails?.chainId,
        isTestnet,
      );
      return (
        <StyledHistoryItemDetailRow align="center">
          <StyledDetailsLabel>{getLabel()}</StyledDetailsLabel>
          <Link href={skipExplorerLink} target="_blank" gap={5}>
            <SmallText normalTextColor>{getTruncatedAddress(txDetails?.txHash)}</SmallText>
            <SmallText>
              <ChainIcon />
            </SmallText>
          </Link>
        </StyledHistoryItemDetailRow>
      );
    });
  }, [transactionDetails]);

  return (
    <Column padding={10} gap={10} style={{ paddingTop: showTransferAssetRelease ? 0 : 10 }}>
      {showTransferAssetRelease && (
        <StyledTransferAssetRelease>
          <SmallText color={theme.warning.text}>
            This transaction did not complete. Your assets have been released as:{" "}
            {transferAssetReleaseAsset?.symbol} on {transferAssetReleaseAsset?.chainName}
          </SmallText>
        </StyledTransferAssetRelease>
      )}
      <StyledHistoryItemDetailRow align="center">
        <StyledDetailsLabel>Status</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor color={statusColor}>
            {status
              ? showTransferAssetRelease
                ? "Not completed"
                : statusMap[status]
              : "Loading..."}
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

      {renderSkipExplorerLinks}

      <Row align="center" style={{ marginTop: 10, padding: "0px 10px" }}>
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
  padding: 0px 10px;
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 5px 10px;
  }
`;

const StyledTransferAssetRelease = styled(Row)`
  background-color: ${({ theme }) => theme.warning.background};
  padding: 10px;
  border-radius: 5px;
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
