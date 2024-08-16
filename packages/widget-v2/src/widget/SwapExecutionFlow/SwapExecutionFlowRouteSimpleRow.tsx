import { useTheme } from 'styled-components';
import { Button } from '../../components/Button';
import { Column, Row } from '../../components/Layout';
import { SmallText, Text } from '../../components/Typography';
import { ClientAsset, getChain, skipAssets } from '../../state/skip';
import { getFormattedAssetAmount } from '../../utils/crypto';
import { Wallet } from '../../components/RenderWalletList';
import { iconMap, ICONS } from '../../icons';
import React from 'react';
import { withBoundProps } from '../../utils/misc';
import { ChainTransaction } from '@skip-go/client';
import { Operation } from './SwapExecutionFlowRouteDetailedRow';
import { useAtom } from 'jotai';
import { useUsdValue } from '../../utils/useUsdValue';
import { formatUSD } from '../../utils/intl';

export type SwapExecutionFlowRouteSimpleRowProps = {
  denom: Operation['denomIn'] | Operation['denomOut'];
  amount: Operation['amountIn'] | Operation['amountOut'];
  chainID: Operation['fromChainID'] | Operation['chainID'];
  destination?: boolean;
  onClickEditDestinationWallet?: () => void;
  explorerLink?: ChainTransaction['explorerLink'];
  wallet?: Wallet;
  icon?: ICONS;
};

export const SwapExecutionFlowRouteSimpleRow = ({
  denom,
  amount,
  chainID,
  destination,
  onClickEditDestinationWallet,
  wallet,
  icon = ICONS.none,
}: SwapExecutionFlowRouteSimpleRowProps) => {
  const theme = useTheme();
  const [{ data: assets }] = useAtom(skipAssets);
  const asset = assets?.find((asset) => asset.denom === denom);

  const chain = getChain(chainID ?? '');
  const chainImage = chain.images?.find((image) => image.svg ?? image.png);

  if (!asset) {
    throw new Error(`Asset not found for denom: ${denom}`);
  }

  const normalizedAmount = Number(amount) / Math.pow(10, asset.decimals ?? 6);

  const usdValue = useUsdValue({
    ...asset,
    value: normalizedAmount.toString(),
  });

  const ButtonOrFragment = onClickEditDestinationWallet
    ? withBoundProps(Button, {
        onClick: onClickEditDestinationWallet,
        align: 'center',
        gap: 5,
      })
    : React.Fragment;
  const Icon = iconMap[icon];

  return (
    <Row gap={25} align="center">
      {chainImage && (
        <img height={50} width={50} src={chainImage.svg ?? chainImage.png} />
      )}
      <Column gap={5}>
        <Text fontSize={24}>
          {getFormattedAssetAmount(amount ?? 0, asset?.decimals)}{' '}
          {asset?.recommendedSymbol}
        </Text>
        <SmallText>
          {formatUSD(usdValue?.data ?? 0)}
          {destination && ' after fees'}
        </SmallText>
        <Row align="center" gap={5}>
          <SmallText normalTextColor>on {asset?.chainName}</SmallText>
          {wallet && (
            <>
              {wallet.imageUrl && (
                <img height={10} width={10} src={wallet.imageUrl} />
              )}
              <ButtonOrFragment>
                <SmallText>{wallet.address}</SmallText>
                <Icon
                  width={10}
                  height={10}
                  color={theme.primary.text.lowContrast}
                />
              </ButtonOrFragment>
            </>
          )}
        </Row>
      </Column>
    </Row>
  );
};
