import { Row } from '../../components/Layout';
import { ModalRowItem } from '../../components/ModalRowItem';
import { SmallText, Text } from '../../components/Typography';
import { ClientAsset } from '../../state/skip';

export type RowItemType = {
  asset: ClientAsset | null;
  index: number;
  skeleton: React.ReactElement;
  onSelect: (assetDenom: string) => void;
};

export const RowItem = ({ asset, index, skeleton, onSelect }: RowItemType) => {
  if (!asset) return skeleton;
  return (
    <ModalRowItem
      key={`${index}${asset.denom}`}
      onClick={() => onSelect(asset.denom)}
      style={{ margin: '5px 0' }}
      leftContent={
        <Row align="center" gap={10}>
          <img
            style={{ borderRadius: '50%', objectFit: 'cover' }}
            height={35}
            width={35}
            src={asset.logoURI}
            alt={`${asset.symbol} logo`}
          />
          <Text>{asset.symbol}</Text>
          <SmallText>
            {asset.chainName ?? asset.originChainID ?? asset.chainID}
          </SmallText>
        </Row>
      }
    />
  );
};

export const Skeleton = ({ color }: { color?: string }) => {
  return (
    <ModalRowItem
      style={{ margin: '5px 0' }}
      leftContent={
        <Row align="center" gap={10}>
          <div
            style={{
              width: 35,
              height: 35,
              borderRadius: '50%',
              backgroundColor: color,
            }}
          />
          <div
            style={{
              width: 80,
              height: 20,
              backgroundColor: color,
            }}
          />
          <div
            style={{
              width: 60,
              height: 16,
              backgroundColor: color,
            }}
          />
        </Row>
      }
    />
  );
};
