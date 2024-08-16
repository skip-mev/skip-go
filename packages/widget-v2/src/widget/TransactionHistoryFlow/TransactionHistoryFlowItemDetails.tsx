import { SmallText } from '../../components/Typography';
import { Column, Row } from '../../components/Layout';
import { ThinArrowIcon } from '../../icons/ThinArrowIcon';
import styled, { useTheme } from 'styled-components';
import React from 'react';
import { ChainIcon } from '../../icons/ChainIcon';
import { Button } from '../../components/Button';
import { TrashIcon } from '../../icons/TrashIcon';

type TransactionHistoryFlowItemDetailsProps = {
  status: string;
  sourceChainName: string;
  destinationChainName: string;
  relativeTimeString: string;
  transactionID: string;
  onClickTransactionID: () => void;
  onClickDelete: () => void;
};

export const TransactionHistoryFlowItemDetails = ({
  status,
  sourceChainName,
  destinationChainName,
  relativeTimeString,
  transactionID,
  onClickTransactionID,
  onClickDelete,
}: TransactionHistoryFlowItemDetailsProps) => {
  const theme = useTheme();

  return (
    <Column padding={10} gap={10}>
      <Row align="center">
        <StyledDetailsLabel>Status</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor>{status}</SmallText>
          <SmallText>at 15:42 EST 12/4/24</SmallText>
        </Row>
      </Row>
      <Row align="center">
        <StyledDetailsLabel>Chain route</StyledDetailsLabel>
        <Row gap={5} align="center">
          <SmallText normalTextColor>{sourceChainName}</SmallText>
          <ThinArrowIcon direction="right" color={theme.primary.text.normal} />
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
          <SmallText normalTextColor>{transactionID}</SmallText>
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
