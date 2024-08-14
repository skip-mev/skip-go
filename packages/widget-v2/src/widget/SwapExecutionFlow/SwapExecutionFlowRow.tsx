import { Column, Row } from '../../components/Layout';
import { SmallText, Text } from '../../components/Typography';
import { getChain } from '../../state/skip';
import { AssetAtom } from '../../state/swap';
import { getFormattedAssetAmount } from '../../utils/crypto';
import { formatUSD } from '../../utils/intl';
import { useUsdValue } from '../../utils/useUsdValue';

export type SwapExecutionFlowRowProps = {
  asset: AssetAtom;
  destination?: boolean;
  address?: string;
};

export const SwapExecutionFlowRow = ({
  asset,
  destination,
  address,
}: SwapExecutionFlowRowProps) => {
  const usdValue = useUsdValue({ ...asset, value: asset.amount });
  const chain = getChain(asset.chainID ?? '');
  const chainImage = chain.images?.find((image) => image.svg ?? image.png);

  return (
    <Row gap={25}>
      <Column gap={10}>
        <Text fontSize={24}>
          {getFormattedAssetAmount(asset.amount ?? 0, asset.decimals)}{' '}
          {asset.recommendedSymbol}
        </Text>
        <SmallText>
          {formatUSD(usdValue?.data ?? 0)}
          {destination && ' after fees'}
        </SmallText>
        <Row>
          <SmallText normalTextColor>on {asset.chainName}</SmallText>
          {chainImage && (
            <img
              height={10}
              width={10}
              src={chainImage.svg ?? chainImage.png}
            />
          )}
          <SmallText>{address}</SmallText>
        </Row>
      </Column>
    </Row>
  );
};
