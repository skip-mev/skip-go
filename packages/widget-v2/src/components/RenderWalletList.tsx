import { useCallback, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { LeftArrowIcon } from '../icons/ArrowIcon';
import { hashObject } from '../utils/misc';
import { Button } from './Button';
import { Row, Column } from './Layout';
import { ModalRowItem } from './ModalRowItem';
import { VirtualList } from './VirtualList';
import { Text } from '../components/Typography';

export type RenderWalletListProps = {
  title: string;
  walletList: Wallet[];
  onSelect?: (wallet: Wallet) => void;
  onClickBackButton: () => void;
};

export type Wallet = {
  name: string;
  imageUrl?: string;
  onSelect?: ((wallet: Wallet) => void) | (() => void);
  rightContent?: () => React.ReactNode;
};

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export const RenderWalletListHeader = ({
  title,
  onClickBackButton,
}: {
  title: string;
  onClickBackButton: () => void;
}) => {
  const theme = useTheme();
  return (
    <StyledHeader align="center" justify="center">
      <StyledBackButton onClick={() => onClickBackButton()}>
        <LeftArrowIcon
          color={theme?.backgroundColor}
          backgroundColor={theme?.textColor}
        />
      </StyledBackButton>
      <Text textAlign="center">{title}</Text>
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
          onClick={() => onSelectOverride?.(wallet) ?? onSelect?.(wallet)}
          style={{ marginTop: ITEM_GAP }}
          leftContent={
            <Row align="center" gap={10}>
              {imageUrl && (
                <img
                  height={35}
                  width={35}
                  style={{ objectFit: 'cover' }}
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
    [walletList]
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
        itemKey={(item) => hashObject(item)}
      />
    </StyledContainer>
  );
};

const StyledBackButton = styled(Button)`
  position: absolute;
  left: 22px;
`;

export const StyledHeader = styled(Row)`
  height: 40px;
  margin-top: 10px;
`;

export const StyledContainer = styled(Column)`
  position: relative;
  padding: 10px;
  gap: 10px;
  width: 580px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
  overflow: hidden;
`;
