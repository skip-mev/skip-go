import { RouteResponse } from '@skip-go/client';
import { SmallText } from '@/components/Typography';
import { useAtom } from 'jotai';
import { skipAssets, getChain, ClientAsset } from '@/state/skip';
import { Column, Row } from '@/components/Layout';
import styled, { useTheme } from 'styled-components';
import { getFormattedAssetAmount } from '@/utils/crypto';
import { XIcon } from '@/icons/XIcon';
import { useMemo } from 'react';
import { StyledAnimatedBorder } from '@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow';
import { TransactionHistoryModalItemDetails } from './TransactionHistoryModalItemDetails';
import { HistoryArrowIcon } from '@/icons/HistoryArrowIcon';

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

type TransactionHistoryModalItemProps = {
  txHistoryItem: TxHistoryItem;
  showDetails?: boolean;
  onClickRow?: () => void;
  onClickTransactionID: () => void;
};

export const TransactionHistoryModalItem = ({
  txHistoryItem,
  showDetails,
  onClickRow,
  onClickTransactionID,
}: TransactionHistoryModalItemProps) => {
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

  const absoluteTimeString = useMemo(() => {
    return new Date(timestamp).toLocaleString();
  }, [timestamp]);

  const relativeTime = useMemo(() => {
    // get relative time based on timestamp
    if (status === 'pending') {
      return 'In Progress';
    }
    return '5 mins ago';
  }, [timestamp, status]);

  return (
    <StyledHistoryContainer showDetails={showDetails}>
      <StyledHistoryItemRow
        align="center"
        justify="space-between"
        onClick={onClickRow}
      >
        <Row gap={5} align="center">
          <RenderAssetAmount {...source} />
          <HistoryArrowIcon color={theme.primary.text.lowContrast} />
          <RenderAssetAmount {...destination} />
          <SmallText normalTextColor>
            on {destinationChain?.pretty_name ?? destinationChain?.chain_name}
          </SmallText>
        </Row>
        <Row align="center" gap={10}>
          <SmallText>{relativeTime}</SmallText>
          {renderStatus}
        </Row>
      </StyledHistoryItemRow>
      {showDetails && (
        <TransactionHistoryModalItemDetails
          status={status}
          sourceChainName={sourceChain?.pretty_name ?? sourceChain?.chain_name}
          destinationChainName={
            destinationChain?.pretty_name ?? destinationChain?.chain_name
          }
          absoluteTimeString={absoluteTimeString}
          relativeTimeString={relativeTime}
          transactionID={txStatus[0].txHash}
          onClickTransactionID={onClickTransactionID}
        />
      )}
    </StyledHistoryContainer>
  );
};

const StyledHistoryContainer = styled(Column)<{ showDetails?: boolean }>`
  background-color: ${({ theme, showDetails }) =>
    showDetails && theme.secondary.background.normal};
  &:hover {
    background-color: ${({ theme }) => theme.secondary.background.normal};
  }
  border-radius: 6px;
`;

const StyledHistoryItemRow = styled(Row)`
  padding: 0 10px;
  height: 40px;
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
