import { useCallback, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { LeftArrowIcon } from "@/icons/ArrowIcon";
import { Button } from "@/components/Button";
import { Row, Column } from "@/components/Layout";
import { ModalRowItem } from "./ModalRowItem";
import { VirtualList } from "./VirtualList";
import { Text } from "@/components/Typography";

export type RenderWalletListProps = {
  title: string;
  walletList: Wallet[];
  onSelect?: (wallet: Wallet) => void;
  onClickBackButton: () => void;
};

export type Wallet = {
  name: string;
  address: string;
  imageUrl?: string;
  onSelect?: ((wallet: Wallet) => void) | (() => void);
  rightContent?: () => React.ReactNode;
};

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

type RenderWalletListHeaderProps = {
  title: string;
  onClickBackButton: () => void;
  rightContent?: () => React.ReactNode;
};

export const RenderWalletListHeader = ({
  title,
  onClickBackButton,
  rightContent,
}: RenderWalletListHeaderProps) => {
  const theme = useTheme();
  return (
    <StyledHeader align="center" justify="space-between">
      <Button onClick={() => onClickBackButton()}>
        <StyledLeftArrowIcon
          color={theme?.primary.background.normal}
          backgroundColor={theme?.primary.text.normal}
        />
      </Button>
      <StyledCenteredTitle textAlign="center">{title}</StyledCenteredTitle>
      {rightContent?.()}
    </StyledHeader>
  );
};

export const RenderWalletList = ({
  title,
  walletList,
  onSelect,
  onClickBackButton,
}: RenderWalletListProps) => {
  const renderItem = useCallback(
    (wallet: Wallet) => {
      const {
        name,
        imageUrl,
        rightContent,
        onSelect: onSelectOverride,
      } = wallet;
      return (
        <ModalRowItem
          key={name}
          onClick={() => {
            if (onSelectOverride) {
              onSelectOverride(wallet);
            } else if (onSelect) {
              onSelect(wallet);
            }
          }}
          style={{ marginTop: ITEM_GAP }}
          leftContent={
            <Row align="center" gap={10}>
              {imageUrl && (
                <img
                  height={35}
                  width={35}
                  style={{ objectFit: "cover" }}
                  src={imageUrl}
                  alt={`${name} logo`}
                />
              )}

              <Text>{name}</Text>
            </Row>
          }
          rightContent={rightContent?.()}
        />
      );
    },
    [onSelect]
  );

  const height = useMemo(() => {
    return Math.min(530, walletList.length * (ITEM_HEIGHT + ITEM_GAP));
  }, [walletList]);

  return (
    <StyledContainer gap={15}>
      <RenderWalletListHeader
        title={title}
        onClickBackButton={onClickBackButton}
      />
      <VirtualList
        listItems={walletList}
        height={height}
        itemHeight={ITEM_HEIGHT + ITEM_GAP}
        renderItem={renderItem}
        itemKey={(item) => item.address}
      />
    </StyledContainer>
  );
};

const StyledCenteredTitle = styled(Text)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;

export const StyledHeader = styled(Row)`
  height: 40px;
  margin-top: 10px;
  padding: 0 12px;
`;

export const StyledContainer = styled(Column)`
  position: relative;
  padding: 10px;
  gap: 10px;
  width: 580px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary.background.normal};
  overflow: hidden;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  opacity: 0.2;
`;
