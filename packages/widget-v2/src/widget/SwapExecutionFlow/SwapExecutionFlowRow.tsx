import { useTheme } from 'styled-components';
import { Button } from '../../components/Button';
import { Column, Row } from '../../components/Layout';
import { SmallText, Text } from '../../components/Typography';
import { PenIcon } from '../../icons/PenIcon';
import { getChain } from '../../state/skip';
import { AssetAtom } from '../../state/swap';
import { getFormattedAssetAmount } from '../../utils/crypto';
import { formatUSD } from '../../utils/intl';
import { useUsdValue } from '../../utils/useUsdValue';
import { Wallet } from '../../components/RenderWalletList';
import { iconMap, ICONS } from '../../icons';
import React from 'react';

export type SwapExecutionFlowRowProps = {
  asset: AssetAtom;
  destination?: boolean;
  onClickEditDestinationWallet?: () => void;
  wallet?: Wallet;
  icon?: ICONS;
};

export const SwapExecutionFlowRow = ({
  asset,
  destination,
  onClickEditDestinationWallet,
  wallet,
  icon = ICONS.none,
}: SwapExecutionFlowRowProps) => {
  const theme = useTheme();
  const usdValue = useUsdValue({ ...asset, value: asset.amount });
  const chain = getChain(asset.chainID ?? '');
  const chainImage = chain.images?.find((image) => image.svg ?? image.png);

  const ButtonOrFragment = onClickEditDestinationWallet
    ? Button
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
              <img height={10} width={10} src={wallet.imageUrl} />
              <ButtonOrFragment
                onClick={onClickEditDestinationWallet}
                align="center"
                gap={5}
              >
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
