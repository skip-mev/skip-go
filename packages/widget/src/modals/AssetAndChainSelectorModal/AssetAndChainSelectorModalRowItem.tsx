import { Column, Row } from "@/components/Layout";
import { ModalRowItem } from "@/components/ModalRowItem";
import { SmallText, Text } from "@/components/Typography";
import { ClientAsset, skipChainsAtom } from "@/state/skipClient";
import { CircleSkeletonElement, SkeletonElement } from "@/components/Skeleton";
import { styled, useTheme } from "styled-components";
import { AssetAnnotationIcon } from "@/components/AssetAnnotationIcon";
import { useAtomValue } from "jotai";
import { useGetBalance } from "@/hooks/useGetBalance";
import { formatDisplayAmount } from "@/utils/number";
import { formatUSD } from "@/utils/intl";
import {
  ChainWithAsset,
  GroupedAsset,
  SelectorContext,
} from "./AssetAndChainSelectorModal";
import { useFilteredChains } from "./useFilteredChains";
import { GroupedAssetImage } from "@/components/GroupedAssetImage";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { useCroppedImage } from "@/hooks/useCroppedImage";
import type { AssetAnnotation } from "@/state/assetAnnotations";
import { AssetAnnotationBadge } from "@/components/AssetAnnotationBadge";
import { getAnnotationColors } from "@/utils/assetAnnotationColors";

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
  annotation?: AssetAnnotation;
};

export const AssetAndChainSelectorModalRowItem = ({
  item,
  index,
  skeleton,
  onSelect,
  context,
  eureka,
  annotation,
}: AssetAndChainSelectorModalRowItemProps) => {
  const { isFetching, isPending } = useAtomValue(skipChainsAtom);
  const isChainsLoading = isFetching && isPending;
  const getBalance = useGetBalance();
  const theme = useTheme();

  if (!item || isChainsLoading) return skeleton;

  const selectorAnnotation = annotation?.selector;
  const accentColor = selectorAnnotation
    ? getAnnotationColors(theme, annotation.variant).accent
    : undefined;

  const annotationBadge = selectorAnnotation && (
    <AssetAnnotationBadge
      label={selectorAnnotation.label}
      variant={annotation.variant}
      outlined
    />
  );

  if (isGroupedAsset(item)) {
    return (
      <ModalRowItem
        key={`${index}${item.id}`}
        onClick={() => onSelect(item)}
        leftContent={
          <GroupedAssetRow
            item={item}
            context={context}
            eureka={eureka}
            annotation={annotation}
            accentColor={accentColor}
          />
        }
        eureka={eureka}
        highlightColor={accentColor}
        rightContent={
          (selectorAnnotation || Number(item.totalAmount) > 0) && (
            <Row align="center" gap={12}>
              {annotationBadge}
              {Number(item.totalAmount) > 0 && (
                <Column align="flex-end">
                  <SmallText normalTextColor>
                    {formatDisplayAmount(item.formattedTotalAmount)}
                  </SmallText>
                  {Number(item.totalUsd) > 0 && (
                    <SmallText>{formatUSD(item.totalUsd)}</SmallText>
                  )}
                </Column>
              )}
            </Row>
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
      highlightColor={accentColor}
      onClick={() => onSelect(item.asset)}
      leftContent={
        <ChainWithAssetRow
          item={item}
          eureka={eureka}
          annotation={annotation}
          accentColor={accentColor}
        />
      }
      rightContent={
        (selectorAnnotation || (balance && Number(balance.amount) > 0)) && (
          <Row align="center" gap={12}>
            {annotationBadge}
            {balance && Number(balance.amount) > 0 && (
              <Column align="flex-end">
                <SmallText normalTextColor>
                  {formatDisplayAmount(balance.formattedAmount)}
                </SmallText>
                {balance.valueUsd && Number(balance.valueUsd) > 0 && (
                  <SmallText>{formatUSD(balance.valueUsd)}</SmallText>
                )}
              </Column>
            )}
          </Row>
        )
      }
    />
  );
};

const GroupedAssetRow = ({
  item,
  context,
  eureka,
  annotation,
  accentColor,
}: {
  item: GroupedAsset;
  context: SelectorContext;
  eureka?: boolean;
  annotation?: AssetAnnotation;
  accentColor?: string;
}) => {
  const filteredChains =
    useFilteredChains({ selectedGroup: item, context }) ?? [];

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
      annotation={annotation}
      accentColor={accentColor}
    />
  );
};

const ChainWithAssetRow = ({
  item,
  eureka,
  annotation,
  accentColor,
}: {
  item: ChainWithAsset;
  eureka?: boolean;
  annotation?: AssetAnnotation;
  accentColor?: string;
}) => {
  const chainImage = useCroppedImage(item?.logoUri);
  return (
    <RowLayout
      image={
        chainImage ? (
          <StyledChainImage
            height={35}
            width={35}
            src={chainImage}
            alt={`${item.chainId} logo`}
          />
        ) : (
          <CircleSkeletonElement height={35} width={35} />
        )
      }
      mainText={item.prettyName}
      subText={<SmallText>{item.chainId}</SmallText>}
      eureka={eureka}
      annotation={annotation}
      accentColor={accentColor}
    />
  );
};

type RowLayoutProps = {
  image: React.ReactNode;
  mainText?: React.ReactNode;
  subText?: React.ReactNode;
  eureka?: boolean;
  annotation?: AssetAnnotation;
  accentColor?: string;
};

const RowLayout = ({
  image,
  mainText,
  subText,
  eureka,
  annotation,
  accentColor,
}: RowLayoutProps) => {
  const isMobileScreenSize = useIsMobileScreenSize();

  return (
    <Row align="center" gap={8}>
      {image}
      <Column gap={2}>
        <Row
          align="baseline"
          flexDirection={isMobileScreenSize ? "column" : "row"}
          gap={isMobileScreenSize ? undefined : 8}
        >
          <Text useWindowsTextHack>{mainText}</Text>
          <Row align="center" gap={6}>
            {subText}
            {eureka && <SmallText normalTextColor> IBC Eureka </SmallText>}
          </Row>
        </Row>
        {annotation?.selector?.description && accentColor && (
          <Row align="center" gap={4}>
            <AssetAnnotationIcon size={14} color={accentColor} />
            <SmallText color={accentColor}>
              {annotation.selector.description}
            </SmallText>
          </Row>
        )}
      </Column>
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
