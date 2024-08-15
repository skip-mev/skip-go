import { useTheme } from 'styled-components';
import { Button } from '../../components/Button';
import { Column, Row } from '../../components/Layout';
import { SmallText, Text } from '../../components/Typography';
import { getChain } from '../../state/skip';
import { AssetAtom } from '../../state/swap';
import { getFormattedAssetAmount } from '../../utils/crypto';
import { formatUSD } from '../../utils/intl';
import { useUsdValue } from '../../utils/useUsdValue';
import { Wallet } from '../../components/RenderWalletList';
import { iconMap, ICONS } from '../../icons';
import React from 'react';
import { withBoundProps } from '../../utils/misc';
import { ChainTransaction } from '@skip-go/client';

export type SwapExecutionFlowSimpleRouteRowProps = {
  asset: AssetAtom;
  destination?: boolean;
  onClickEditDestinationWallet?: () => void;
  explorerLink?: ChainTransaction['explorerLink'];
  wallet?: Wallet;
  icon?: ICONS;
};

export const SwapExecutionFlowSimpleRouteRow = ({
  asset,
  destination,
  onClickEditDestinationWallet,
  wallet,
  icon = ICONS.none,
  transaction,
}: SwapExecutionFlowSimpleRouteRowProps) => {
  const theme = useTheme();
  const usdValue = useUsdValue({ ...asset, value: asset.amount });
  const chain = getChain(asset.chainID ?? '');
  const chainImage = chain.images?.find((image) => image.svg ?? image.png);

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
          {getFormattedAssetAmount(asset.amount ?? 0, asset.decimals)}{' '}
          {asset.recommendedSymbol}
        </Text>
        <SmallText>
          {formatUSD(usdValue?.data ?? 0)}
          {destination && ' after fees'}
        </SmallText>
        <Row align="center" gap={5}>
          <SmallText normalTextColor>on {asset.chainName}</SmallText>
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
