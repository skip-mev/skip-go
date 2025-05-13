import { Column, Row } from "@/components/Layout";
import { ModalRowItem } from "@/components/ModalRowItem";
import { SmallText, Text } from "@/components/Typography";
import { ClientAsset, skipChainsAtom } from "@/state/skipClient";
import { CircleSkeletonElement, SkeletonElement } from "@/components/Skeleton";
import { styled } from "styled-components";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { formatDisplayAmount } from "@/utils/number";
import { formatUSD } from "@/utils/intl";
import { ChainWithAsset, GroupedAsset, SelectorContext } from "./AssetAndChainSelectorModal";
import { useFilteredChains } from "./useFilteredChains";
import { GroupedAssetImage } from "@/components/GroupedAssetImage";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";

export const isGroupedAsset = (
  item: GroupedAsset | ClientAsset | ChainWithAsset,
): item is GroupedAsset => {
  return (item as GroupedAsset).chains !== undefined;
};

export type AssetAndChainSelectorModalRowItemProps = {
  item: GroupedAsset | ChainWithAsset;
  index: number;
  skeleton: React.ReactElement;
  onSelect: (token: ClientAsset | GroupedAsset | null) => void;
  context: SelectorContext;
  eureka?: boolean;
};

export const AssetAndChainSelectorModalRowItem = ({
  item,
  index,
  skeleton,
  onSelect,
  context,
  eureka,
}: AssetAndChainSelectorModalRowItemProps) => {
  const { isFetching, isPending } = useAtomValue(skipChainsAtom);
  const isChainsLoading = isFetching && isPending;
  const getBalance = useGetBalance();

  if (!item || isChainsLoading) return skeleton;

  if (isGroupedAsset(item)) {
    return (
      <ModalRowItem
        key={`${index}${item.id}`}
        onClick={() => onSelect(item)}
        leftContent={<GroupedAssetRow item={item} context={context} eureka={eureka} />}
        eureka={eureka}
        rightContent={
          Number(item.totalAmount) > 0 && (
            <Column align="flex-end">
              <SmallText normalTextColor>
                {formatDisplayAmount(item.formattedTotalAmount)}
              </SmallText>
              {Number(item.totalUsd) > 0 && <SmallText>{formatUSD(item.totalUsd)}</SmallText>}
            </Column>
          )
        }
      />
    );
  }
  const balance = getBalance(item.asset.chainId, item.asset.denom);

  return (
    <ModalRowItem
      key={item.chainId}
      eureka={eureka}
      onClick={() => onSelect(item.asset)}
      leftContent={<ChainWithAssetRow item={item} eureka={eureka} />}
      rightContent={
        balance &&
        Number(balance.amount) > 0 && (
          <Column align="flex-end">
            <SmallText normalTextColor>{formatDisplayAmount(balance.formattedAmount)}</SmallText>
            {balance.valueUsd && Number(balance.valueUsd) > 0 && (
              <SmallText>{formatUSD(balance.valueUsd)}</SmallText>
            )}
          </Column>
        )
      }
    />
  );
};

const GroupedAssetRow = ({
  item,
  context,
  eureka,
}: {
  item: GroupedAsset;
  context: SelectorContext;
  eureka?: boolean;
}) => {
  const filteredChains = useFilteredChains({ selectedGroup: item, context }) ?? [];

  const subText =
    filteredChains.length > 1 ? (
      <SmallText>{`${filteredChains.length} networks`}</SmallText>
    ) : (
      <SmallText>on {filteredChains[0]?.chainName}</SmallText>
    );

  return (
    <RowLayout
      image={<GroupedAssetImage height={35} width={35} groupedAsset={item} />}
      mainText={item.assets[0].recommendedSymbol}
      subText={subText}
      eureka={eureka}
    />
  );
};

const ChainWithAssetRow = ({ item, eureka }: { item: ChainWithAsset; eureka?: boolean }) => {
  return (
    <RowLayout
      image={
        <StyledChainImage height={35} width={35} src={item?.logoUri} alt={`${item.chainId} logo`} />
      }
      mainText={item.prettyName}
      subText={<SmallText>{item.chainId}</SmallText>}
      eureka={eureka}
    />
  );
};

type RowLayoutProps = {
  image: React.ReactNode;
  mainText?: React.ReactNode;
  subText?: React.ReactNode;
  eureka?: boolean;
};

const RowLayout = ({ image, mainText, subText, eureka }: RowLayoutProps) => {
  const isMobileScreenSize = useIsMobileScreenSize();

  return (
    <Row align="center" gap={8}>
      {image}
      <Row
        align="baseline"
        flexDirection={isMobileScreenSize ? "column" : "row"}
        gap={isMobileScreenSize ? undefined : 8}
      >
        <Text>{mainText}</Text>
        <Row align="center" gap={6}>
          {subText}
          {eureka && <SmallText normalTextColor> IBC Eureka </SmallText>}
        </Row>
      </Row>
    </Row>
  );
};

const StyledChainImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  ${({ theme }) => `background: ${theme.secondary.background.hover};`};
`;

export const Skeleton = () => {
  return (
    <ModalRowItem
      style={{ margin: "5px 0" }}
      leftContent={
        <StyledRow align="center" gap={8}>
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
