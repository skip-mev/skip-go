import { useAtom } from 'jotai';
import { Row } from '../../components/Layout';
import { SmallText } from '../../components/Typography';
import { getChain, skipAssets } from '../../state/skip';
import { getFormattedAssetAmount } from '../../utils/crypto';
import { styled } from 'styled-components';
import { SpinningBorderAnimation } from '../../components/MainButton';
import { withBoundProps } from '../../utils/misc';
import React from 'react';

type OperationType =
  | 'swap'
  | 'evmSwap'
  | 'transfer'
  | 'axelarTransfer'
  | 'cctpTransfer'
  | 'hyperlaneTransfer'
  | 'opInitTransfer'
  | 'bankSend';

export type Operation = {
  type: OperationType;
  chainID: string;
  fromChainID?: string;
  toChainID?: string;
  denom?: string;
  denomIn?: string;
  denomOut: string;
  txIndex: number;
  amountIn: string;
  amountOut: string;
  bridgeID?: string;
  swapVenues?: {
    name: '';
    chainID: '';
  }[];
};

export type txState = 'pending' | 'broadcasted' | 'confirmed' | 'failed';

export type SwapExecutionFlowRouteDetailedRowProps = {
  denom: Operation['denomIn'] | Operation['denomOut'];
  amount: Operation['amountIn'] | Operation['amountOut'];
  chainID: Operation['fromChainID'] | Operation['chainID'];
  txState?: txState;
};

export const SwapExecutionFlowRouteDetailedRow = ({
  denom,
  amount,
  chainID,
  txState,
  ...props
}: SwapExecutionFlowRouteDetailedRowProps) => {
  const [{ data: assets }] = useAtom(skipAssets);

  const asset = assets?.find((asset) => asset.denom === denom);

  const chain = getChain(chainID ?? '');
  const chainImage = chain.images?.find((image) => image.svg ?? image.png);

  const ChainImageContainer =
    txState === 'broadcasted'
      ? withBoundProps(SpinningBorderAnimation, {
          height: 30,
          width: 30,
          backgroundColor: 'green',
        })
      : React.Fragment;
  return (
    <Row gap={15} align="center" {...props}>
      {chainImage && (
        <ChainImageContainer>
          <StyledChainImage
            height={30}
            width={30}
            src={chainImage.svg ?? chainImage.png}
            state={txState}
          />
        </ChainImageContainer>
      )}

      <Row gap={5}>
        <SmallText normalTextColor>
          {getFormattedAssetAmount(amount ?? 0, asset?.decimals)}{' '}
          {asset?.recommendedSymbol}
        </SmallText>
        <SmallText> on {asset?.chainName}</SmallText>
      </Row>
    </Row>
  );
};

const StyledChainImage = styled.img<{ state?: txState }>`
  ${({ theme, state }) =>
    state === 'confirmed' && `border: 2px solid ${theme.success.text};`}
  border-radius: 50%;
  box-sizing: content-box;
`;
