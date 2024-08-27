import { Row } from "@/components/Layout";
import { ModalRowItem } from "@/components/ModalRowItem";
import { SmallText, Text } from "@/components/Typography";
import { ChainWithAsset, ClientAsset, skipChainsAtom } from "@/state/skipClient";
import { CircleSkeletonElement, SkeletonElement } from "@/components/Skeleton";
import { styled } from "styled-components";
import { useAtomValue } from "jotai";
import { Chain } from "@skip-go/client";

export const isClientAsset = (
  item: ClientAsset | ChainWithAsset
): item is ClientAsset => {
  return (item as ClientAsset).denom !== undefined;
};

export const isChainWithAsset = (
  item: ClientAsset | ChainWithAsset
): item is ChainWithAsset => {
  return (item as Chain).chainID !== undefined;
};

export type TokenAndChainSelectorModalRowItemProps = {
  item: ClientAsset | ChainWithAsset;
  index: number;
  skeleton: React.ReactElement;
  onSelect: (token: ClientAsset | null) => void;
};

export const TokenAndChainSelectorModalRowItem = ({
  item,
  index,
  skeleton,
  onSelect,
}: TokenAndChainSelectorModalRowItemProps) => {
  const { isLoading: isChainsLoading, data: chains } = useAtomValue(skipChainsAtom)

  if (!item || isChainsLoading) return skeleton;

  if (isClientAsset(item)) {
    const chain = chains?.find((chain) => chain.chainID === item.chainID)
    return (
      <ModalRowItem
        key={`${index}${item.denom}`}
        onClick={() => onSelect(item)}
        style={{ margin: "5px 0" }}
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
              {chain?.prettyName}
            </SmallText>
          </Row>
        }
      />
    );
  }

  if (isChainWithAsset(item)) {

    const chain = chains?.find((chain) => chain.chainID === item.chainID)
    return (
      <ModalRowItem
        key={item.chainID}
        onClick={() => onSelect(item?.asset || null)}
        style={{ margin: "5px 0" }}
        leftContent={
          <Row align="center" gap={10}>
            <StyledAssetImage
              height={35}
              width={35}
              src={item?.logoURI}
              alt={`${item.chainID} logo`}
            />
            <Text>{chain?.prettyName}</Text>
            <SmallText>{item.chainID}</SmallText>
          </Row>
        }
      />
    );
  }
};

const StyledAssetImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  ${({ theme }) => `background-color: ${theme.secondary.background.hover};`};
`;

export const Skeleton = () => {
  return (
    <ModalRowItem
      style={{ margin: "5px 0" }}
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
