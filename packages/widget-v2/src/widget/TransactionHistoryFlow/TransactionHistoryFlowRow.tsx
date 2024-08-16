import { Chain, RouteResponse } from '@skip-go/client';
import { SmallText, Text } from '../../components/Typography';
import { useAtom } from 'jotai';
import { skipAssets, getChain, ClientAsset } from '../../state/skip';
import { Row } from '../../components/Layout';
import { ThinArrowIcon } from '../../icons/ThinArrowIcon';
import styled, { useTheme } from 'styled-components';
import { getFormattedAssetAmount } from '../../utils/crypto';
import { XIcon } from '../../icons/XIcon';
import { useMemo } from 'react';
import { StyledAnimatedBorder } from '../SwapExecutionFlow/SwapExecutionFlowRouteDetailedRow';

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

type TransactionHistoryFlowRowProps = {
  txHistoryItem: TxHistoryItem;
};

export const TransactionHistoryFlowRow = ({
  txHistoryItem,
}: TransactionHistoryFlowRowProps) => {
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
  }, []);

  return (
    <StyledRowContainer justify="space-between">
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
    </StyledRowContainer>
  );
};

const StyledRowContainer = styled(Row)`
  padding: 10px;
  border-radius: 6px;
  &:hover {
    background-color: ${({ theme }) => theme.secondary.background.normal};
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
