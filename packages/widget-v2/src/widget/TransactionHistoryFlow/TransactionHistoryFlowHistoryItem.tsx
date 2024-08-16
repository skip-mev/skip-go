import { Chain, RouteResponse } from '@skip-go/client';
import { SmallText, Text } from '../../components/Typography';
import { useAtom } from 'jotai';
import { skipAssets, getChain, ClientAsset } from '../../state/skip';
import { Column, Row } from '../../components/Layout';
import { ThinArrowIcon } from '../../icons/ThinArrowIcon';
import styled, { useTheme } from 'styled-components';
import { getFormattedAssetAmount } from '../../utils/crypto';
import { XIcon } from '../../icons/XIcon';
import { useMemo, useState } from 'react';
import { StyledAnimatedBorder } from '../SwapExecutionFlow/SwapExecutionFlowRouteDetailedRow';
import React from 'react';
import { TransactionHistoryFlowHistoryItemDetails } from './TransactionHistoryFlowHistoryItemDetails';

export interface TxStatus {
  chainId: string;
  txHash: string;
  explorerLink: string;
  axelarscanLink?: string;
}

export interface TxHistoryItem {
  route: RouteResponse;
  txStatus: TxStatus[];
  timestamp: string;
  status: 'pending' | 'success' | 'failed';
}

export type TxHistoryItemInput = Pick<TxHistoryItem, 'route'>;

export type TxHistoryState = Record<string, TxHistoryItem>;

type TransactionHistoryFlowHistoryItemProps = {
  txHistoryItem: TxHistoryItem;
  showDetails?: boolean;
  onClickRow?: () => void;
  onClickTransactionID: () => void;
};

export const TransactionHistoryFlowHistoryItem = ({
  txHistoryItem,
  showDetails,
  onClickRow,
  onClickTransactionID,
}: TransactionHistoryFlowHistoryItemProps) => {
  const theme = useTheme();
  const {
    route: {
      amountIn,
      amountOut,
      sourceAssetDenom,
      sourceAssetChainID,
      destAssetDenom,
      destAssetChainID,
    },
    txStatus,
    timestamp,
    status,
  } = txHistoryItem;
  const [{ data: assets }] = useAtom(skipAssets);
  const sourceChain = getChain(sourceAssetChainID ?? '');
  const sourceChainImage = sourceChain.images?.find(
    (image) => image.svg ?? image.png
  );
  const source = {
    amount: amountIn,
    asset: assets?.find((asset) => asset.denom === sourceAssetDenom),
    chainImage: sourceChainImage?.svg ?? sourceChainImage?.png ?? '',
  };

  const destinationChain = getChain(destAssetChainID ?? '');
  const destinationChainImage = destinationChain.images?.find(
    (image) => image.svg ?? image.png
  );
  const destination = {
    amount: amountOut,
    asset: assets?.find((asset) => asset.denom === destAssetDenom),
    chainImage: destinationChainImage?.svg ?? destinationChainImage?.png ?? '',
  };

  const renderStatus = useMemo(() => {
    switch (status) {
      case 'pending':
        return (
          <StyledAnimatedBorder
            width={10}
            height={10}
            backgroundColor={theme.primary.text.normal}
            txState="broadcasted"
          />
        );
      case 'success':
        return <StyledGreenDot />;
      case 'failed':
        return <XIcon color={theme.error.text} />;
    }
  }, [status]);

  const relativeTime = useMemo(() => {
    // get relative time based on timestamp
    return '5 mins ago';
  }, [timestamp]);

  return (
    <StyledHistoryContainer showDetails={showDetails}>
      <StyledHistoryItemRow justify="space-between" onClick={onClickRow}>
        <Row gap={5} align="center">
          <RenderAssetAmount {...source} />
          <ThinArrowIcon
            direction="right"
            color={theme.primary.text.lowContrast}
          />
          <RenderAssetAmount {...destination} />
          <SmallText normalTextColor>
            on {destinationChain?.pretty_name ?? destinationChain?.chain_name}
          </SmallText>
        </Row>
        <Row align="center" gap={10}>
          <SmallText>1 min ago.</SmallText>
          {renderStatus}
        </Row>
      </StyledHistoryItemRow>
      {showDetails && (
        <TransactionHistoryFlowHistoryItemDetails
          status={status}
          sourceChainName={sourceChain?.pretty_name ?? sourceChain?.chain_name}
          destinationChainName={
            destinationChain?.pretty_name ?? destinationChain?.chain_name
          }
          relativeTimeString={relativeTime}
          transactionID={txStatus[0].txHash}
          onClickTransactionID={onClickTransactionID}
          onClickDelete={() => {}}
        />
      )}
    </StyledHistoryContainer>
  );
};

const StyledHistoryContainer = styled(Column)<{ showDetails?: boolean }>`
  padding: 10px;
  background-color: ${({ theme, showDetails }) =>
    showDetails && theme.secondary.background.normal};
  &:hover {
    background-color: ${({ theme }) => theme.secondary.background.normal};
  }
  border-radius: 6px;
`;

const StyledHistoryItemRow = styled(Row)`
  &:hover {
    cursor: pointer;
  }
`;

const StyledGreenDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${({ theme }) => theme.success.text};
  border-radius: 50%;
`;

const RenderAssetAmount = ({
  amount,
  asset,
  chainImage,
}: {
  amount: string;
  asset: ClientAsset | undefined;
  chainImage: string;
}) => {
  return (
    <>
      <img height={20} width={20} src={chainImage} />
      <SmallText normalTextColor>
        {getFormattedAssetAmount(amount, asset?.decimals)}
      </SmallText>
      <SmallText normalTextColor>
        {asset?.recommendedSymbol ?? asset?.symbol}
      </SmallText>
    </>
  );
};
