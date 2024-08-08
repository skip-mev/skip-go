import { Row } from '../../components/Layout';
import { ModalRowItem } from '../../components/ModalRowItem';
import { SmallText, Text } from '../../components/Typography';
import { ClientAsset } from '../../state/skip';
import {
  CircleSkeletonElement,
  SkeletonElement,
} from '../../components/Skeleton';
import { styled } from 'styled-components';
import { getHexColor, opacityToHex } from '../../utils/colors';

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
          <StyledAssetImage
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

const StyledAssetImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  ${({ theme }) =>
    `background-color: ${
      getHexColor(theme.textColor ?? '') + opacityToHex(10)
    }`};
`;

export const Skeleton = () => {
  return (
    <ModalRowItem
      style={{ margin: '5px 0' }}
      leftContent={
        <StyledRow align="center" gap={10}>
          <CircleSkeletonElement width={35} height={35} />
          <SkeletonElement width={80} height={20} />
          <SkeletonElement width={60} height={16} />
        </StyledRow>
      }
    />
  );
};

const StyledRow = styled(Row)`
  filter: blur(4px);
`;
