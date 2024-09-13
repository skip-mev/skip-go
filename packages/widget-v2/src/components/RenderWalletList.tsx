import { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { LeftArrowIcon } from "@/icons/ArrowIcon";
import { Button } from "@/components/Button";
import { Row, Column } from "@/components/Layout";
import { ModalRowItem } from "./ModalRowItem";
import { VirtualList } from "./VirtualList";
import { Text } from "@/components/Typography";
import { MinimalWallet } from "@/state/wallets";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { useMutation } from "@tanstack/react-query";
import { useModal } from "@ebay/nice-modal-react";

export type RenderWalletListProps = {
  title: string;
  walletList: MinimalWallet[];
  onClickBackButton: () => void;
};

export type Wallet = MinimalWallet & {
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
  onClickBackButton,
}: RenderWalletListProps) => {
  const theme = useTheme();
  const modal = useModal();
  const connectMutation = useMutation({
    mutationKey: ["connectWallet"],
    mutationFn: async (wallet: MinimalWallet) => {
      return await wallet.connect();
    },
    onSuccess: () => {
      modal.remove();
    }
  });

  const renderItem = (wallet: Wallet) => {
    const {
      walletName,
      walletPrettyName,
      walletInfo: { logo: imageUrl },
      rightContent,
    } = wallet;
    return (
      <ModalRowItem
        key={walletName}
        onClick={() => {
          connectMutation.mutate(wallet);
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
                alt={`${walletPrettyName} logo`}
              />
            )}

            <Text>{walletPrettyName}</Text>
          </Row>
        }
        rightContent={rightContent?.()}
      />
    );
  };

  const height = useMemo(() => {
    return Math.min(530, walletList.length * (ITEM_HEIGHT + ITEM_GAP));
  }, [walletList]);

  const container = useMemo(() => {
    switch (true) {
      case !!connectMutation.isError:
        return (
          <StyledInnerContainer height={height}>
            <StyledLoadingContainer>
              <StyledAnimatedBorder
                width={80}
                height={80}
                backgroundColor={theme.primary.text.normal}
                txState="failed"
                borderSize={8}
              >
                <img
                  style={{ objectFit: "cover" }}
                  src={connectMutation.variables?.walletInfo.logo}
                  alt={`${connectMutation.variables?.walletPrettyName} logo`} />
              </StyledAnimatedBorder>
              <Text color={theme.primary.text.lowContrast}>Failed to connect to {connectMutation.variables?.walletPrettyName}</Text>
            </StyledLoadingContainer>
          </StyledInnerContainer>
        );
      case !!connectMutation.isPending:
        return (
          <StyledInnerContainer height={height}>
            <StyledLoadingContainer>
              <StyledAnimatedBorder
                width={80}
                height={80}
                backgroundColor={theme.primary.text.normal}
                txState="broadcasted"
                borderSize={8}
              >
                <img
                  style={{ objectFit: "cover" }}
                  src={connectMutation.variables?.walletInfo.logo}
                  alt={`${connectMutation.variables?.walletPrettyName} logo`} />
              </StyledAnimatedBorder>
              <Text color={theme.primary.text.lowContrast}>Connecting to {connectMutation.variables?.walletPrettyName}</Text>
            </StyledLoadingContainer>
          </StyledInnerContainer>
        );
      default:
        return <VirtualList
          listItems={walletList}
          height={height}
          itemHeight={ITEM_HEIGHT + ITEM_GAP}
          renderItem={renderItem}
          itemKey={(item) => item.walletName}
        />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectMutation, height, walletList]);

  return (
    <StyledContainer gap={15}>
      <RenderWalletListHeader
        title={title}
        onClickBackButton={(connectMutation.isPending || connectMutation.isError) ? connectMutation.reset : onClickBackButton}
      />
      {container}
    </StyledContainer>
  );
};

const StyledLoadingContainer = styled(Column)`
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-bottom: 10px;
`;

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

const StyledInnerContainer = styled(Column) <{
  height: number;
}>`
  height: ${({ height }) => height}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  opacity: 0.2;
`;
