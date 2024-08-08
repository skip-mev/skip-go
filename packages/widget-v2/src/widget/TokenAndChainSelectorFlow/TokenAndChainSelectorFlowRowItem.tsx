import { Row } from '../../components/Layout';
import { ModalRowItem } from '../../components/ModalRowItem';
import { SmallText, Text } from '../../components/Typography';
import { ChainWithAsset, ClientAsset } from '../../state/skip';
import {
  CircleSkeletonElement,
  SkeletonElement,
} from '../../components/Skeleton';
import { styled } from 'styled-components';
import { getHexColor, opacityToHex } from '../../utils/colors';
import { Chain } from '@chain-registry/types';

export type RowItemType = {
  item: ClientAsset | ChainWithAsset;
  index: number;
  skeleton: React.ReactElement;
  onSelect: (token: ClientAsset | null) => void;
};

const isClientAsset = (
  item: ClientAsset | ChainWithAsset
): item is ClientAsset => {
  return (item as ClientAsset).denom !== undefined;
};

const isChain = (
  item: ClientAsset | ChainWithAsset
): item is ChainWithAsset => {
  return (item as Chain).chain_id !== undefined;
};

export const RowItem = ({ item, index, skeleton, onSelect }: RowItemType) => {
  if (!item) return skeleton;

  if (isClientAsset(item)) {
    return (
      <ModalRowItem
        key={`${index}${item.denom}`}
        onClick={() => onSelect(item)}
        style={{ margin: '5px 0' }}
        leftContent={
          <Row align="center" gap={10}>
            <StyledAssetImage
              height={35}
              width={35}
              src={item.logoURI}
              alt={`${item.symbol} logo`}
            />
            <Text>{item.symbol}</Text>
            <SmallText>
              {item.chainName ?? item.originChainID ?? item.chainID}
            </SmallText>
          </Row>
        }
      />
    );
  }

  if (isChain(item)) {
    return (
      <ModalRowItem
        key={item.chain_id}
        onClick={() => onSelect(item?.asset || null)}
        style={{ margin: '5px 0' }}
        leftContent={
          <Row align="center" gap={10}>
            <StyledAssetImage
              height={35}
              width={35}
              src={item?.images?.[0].svg ?? item?.images?.[0].png}
              alt={`${item.chain_id} logo`}
            />
            <Text>{item.pretty_name}</Text>
            <SmallText>{item.chain_name}</SmallText>
          </Row>
        }
      />
    );
  }
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
