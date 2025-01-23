import { Column, Row } from "@/components/Layout";
import { ModalRowItem } from "@/components/ModalRowItem";
import { SmallText, Text } from "@/components/Typography";
import { ClientAsset, skipChainsAtom } from "@/state/skipClient";
import { CircleSkeletonElement, SkeletonElement } from "@/components/Skeleton";
import { styled } from "styled-components";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { convertTokenAmountToHumanReadableAmount } from "@/utils/crypto";
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
};

export const AssetAndChainSelectorModalRowItem = ({
  item,
  index,
  skeleton,
  onSelect,
  context,
}: AssetAndChainSelectorModalRowItemProps) => {
  const { isLoading: isChainsLoading } = useAtomValue(skipChainsAtom);
  const getBalance = useGetBalance();

  if (!item || isChainsLoading) return skeleton;

  if (isGroupedAsset(item)) {
    return (
      <ModalRowItem
        key={`${index}${item.id}`}
        onClick={() => onSelect(item)}
        style={{ margin: "5px 0" }}
        leftContent={<GroupedAssetRow item={item} context={context} />}
        rightContent={
          Number(item.totalAmount) > 0 && (
            <Column align="flex-end">
              <SmallText normalTextColor>{parseFloat(item.totalAmount.toFixed(8))}</SmallText>
              {Number(item.totalUsd) > 0 && <SmallText>{formatUSD(item.totalUsd)}</SmallText>}
            </Column>
          )
        }
      />
    );
  }
  const balance = getBalance(item.asset.chainID, item.asset.denom);

  return (
    <ModalRowItem
      key={item.chainID}
      onClick={() => onSelect(item.asset)}
      style={{ margin: "5px 0" }}
      leftContent={<ChainWithAssetRow item={item} />}
      rightContent={
        balance &&
        Number(balance.amount) > 0 && (
          <Column align="flex-end">
            <SmallText normalTextColor>
              {convertTokenAmountToHumanReadableAmount(balance.amount, balance.decimals)}
            </SmallText>
            {balance.valueUSD && <SmallText>{formatUSD(balance.valueUSD)}</SmallText>}
          </Column>
        )
      }
    />
  );
};

const GroupedAssetRow = ({ item, context }: { item: GroupedAsset; context: SelectorContext }) => {
  const filteredChains = useFilteredChains({ selectedGroup: item, context }) ?? [];

  const subText =
    filteredChains.length > 1 ? (
      <SmallText>{`${filteredChains.length} networks`}</SmallText>
    ) : (
      filteredChains.map((chain, index) => (
        <Row key={index} align="center" gap={6}>
          <SmallText>{chain.chainName}</SmallText>
        </Row>
      ))
    );

  return (
    <RowLayout
      image={<GroupedAssetImage height={35} width={35} groupedAsset={item} />}
      mainText={item.assets[0].recommendedSymbol}
      subText={subText}
    />
  );
};

const ChainWithAssetRow = ({ item }: { item: ChainWithAsset }) => {
  return (
    <RowLayout
      image={
        <StyledChainImage height={35} width={35} src={item?.logoURI} alt={`${item.chainID} logo`} />
      }
      mainText={item.prettyName}
      subText={<SmallText>{item.chainID}</SmallText>}
    />
  );
};

type RowLayoutProps = {
  image: React.ReactNode;
  mainText?: React.ReactNode;
  subText?: React.ReactNode;
};

const RowLayout = ({ image, mainText, subText }: RowLayoutProps) => {
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
        {subText}
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
