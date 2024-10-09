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
import { ChainWithAsset, GroupedAsset } from "./TokenAndChainSelectorModal";

export const isGroupedAsset = (
  item: GroupedAsset | ClientAsset | ChainWithAsset
): item is GroupedAsset => {
  return (item as GroupedAsset).chains !== undefined;
};

export type TokenAndChainSelectorModalRowItemProps = {
  item: GroupedAsset | ChainWithAsset;
  index: number;
  skeleton: React.ReactElement;
  onSelect: (token: ClientAsset | GroupedAsset | null) => void;
};

export const TokenAndChainSelectorModalRowItem = ({
  item,
  index,
  skeleton,
  onSelect,
}: TokenAndChainSelectorModalRowItemProps) => {
  const { isLoading: isChainsLoading } = useAtomValue(skipChainsAtom);
  const getBalance = useGetBalance();
  if (!item || isChainsLoading) return skeleton;

  if (isGroupedAsset(item)) {
    return (
      <ModalRowItem
        key={`${index}${item.id}`}
        onClick={() => onSelect(item)}
        style={{ margin: "5px 0" }}
        leftContent={
          <TokenAndChainSelectorModalRowItemLeftContent item={item} />
        }
        rightContent={
          Number(item.totalAmount) > 0 && (
            <Column align="flex-end">
              <SmallText normalTextColor>
                {parseFloat(item.totalAmount.toFixed(8))}
              </SmallText>
              {item.totalUsd && (
                <SmallText>{formatUSD(item.totalUsd)}</SmallText>
              )}
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
      leftContent={
        <Row align="center" gap={8}>
          <StyledAssetImage
            height={35}
            width={35}
            src={item?.logoURI}
            alt={`${item.chainID} logo`}
          />
          <Row align="end" gap={8}>
            <Text>{item.prettyName}</Text>
            <SmallText>{item.chainID}</SmallText></Row>
        </Row>
      }
      rightContent={
        balance &&
        Number(balance.amount) > 0 && (
          <Column align="flex-end">
            <SmallText normalTextColor>
              {convertTokenAmountToHumanReadableAmount(
                balance.amount,
                balance.decimals
              )}
            </SmallText>
            {balance.valueUSD && (
              <SmallText>{formatUSD(balance.valueUSD)}</SmallText>
            )}
          </Column>
        )
      }
    />
  );
};

const TokenAndChainSelectorModalRowItemLeftContent = ({
  item,
}: {
  item: GroupedAsset;
}) => {
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chainList = item.chains
    .map((chain) => {
      const _chain = chains?.find((c) => c.chainID === chain.chainID);
      return {
        chainName: _chain?.prettyName || chain.chainID,
      };
    })
    .sort((a, b) => a.chainName.localeCompare(b.chainName));

  return (
    <Row align="center" gap={8}>
      <StyledAssetImage
        height={35}
        width={35}
        src={item.assets[0].logoURI}
        alt={`${item.assets[0].recommendedSymbol} logo`}
      />
      <Row align="end" gap={8}>
        <Text>{item.assets[0].recommendedSymbol}</Text>
        {chainList.length > 1 ? (
          <SmallText>{`${chainList.length} networks`}</SmallText>
        ) : (
          chainList.map((chain, index) => (
            <Row key={index} align="center" gap={6}>
              {<SmallText>{chain.chainName}</SmallText>}
            </Row>
          ))
        )}
      </Row>
    </Row>
  );
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
