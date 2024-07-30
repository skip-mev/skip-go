import { styled } from 'styled-components';
import { Column, Row, Spacer } from './Layout';
import { SmallText, Text } from './Typography';
import { ChangeEvent } from 'react';
import { DownArrowIcon } from '../icons/DownArrowIcon';
import { useTheme } from 'styled-components';
import { CogIcon } from '../icons/CogIcon';
import { Button } from './Button';
import { useAtom } from 'jotai';
import { skipAssets } from '../state/skip';
import { useUsdValue } from '../utils/useUsdValue';
import { formatUSD } from '../utils/intl';

export type AssetChainInputProps = {
  value?: string;
  onChangeValue?: (e: ChangeEvent) => void;
  handleChangeAsset?: () => void;
  handleChangeChain?: () => void;
  selectedAssetDenom?: string;
};

export const AssetChainInput = ({
  value = '0',
  onChangeValue,
  selectedAssetDenom,
  handleChangeAsset,
  handleChangeChain,
}: AssetChainInputProps) => {
  const theme = useTheme();
  const [assets] = useAtom(skipAssets);

  const selectedAsset =
    assets.state === 'hasData'
      ? assets.data.find((asset) => asset.denom === selectedAssetDenom)
      : undefined;

  const usdValue = useUsdValue({ ...selectedAsset, value });

  return (
    <StyledAssetChainInputWrapper
      justify="space-between"
      padding={20}
      borderRadius={25}
    >
      <Row justify="space-between">
        <StyledInput type="text" value={value} onChange={onChangeValue} />
        <Button onClick={handleChangeAsset} gap={5}>
          {selectedAsset ? (
            <StyledAssetLabel align="center" justify="center" gap={7}>
              <img src={selectedAsset?.logoURI} width={23} />
              {selectedAsset?.name}
            </StyledAssetLabel>
          ) : (
            <StyledSelectTokenLabel>
              <Text>Select token</Text>
            </StyledSelectTokenLabel>
          )}

          <DownArrowIcon
            color={theme.backgroundColor}
            backgroundColor={theme.textColor}
          />
        </Button>
      </Row>
      <Row justify="space-between">
        <SmallText>{formatUSD(usdValue?.data ?? 0)}</SmallText>
        {selectedAsset ? (
          <Button onClick={handleChangeChain} align="center" gap={4}>
            <SmallText>on {selectedAsset?.chainName}</SmallText>
            <CogIcon color={theme.textColor} />
          </Button>
        ) : (
          <Spacer />
        )}
      </Row>
    </StyledAssetChainInputWrapper>
  );
};

const StyledAssetChainInputWrapper = styled(Column)`
  height: 110px;
  width: 480px;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const StyledInput = styled.input`
  all: unset;
  font-size: 38px;
  font-weight: 300;
  width: 100%;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.backgroundColor};
`;

const StyledAssetLabel = styled(Row).attrs({
  padding: 8,
})`
  height: 40px;
  border-radius: 10px;
  white-space: nowrap;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.secondary.background};
`;

const StyledSelectTokenLabel = styled(StyledAssetLabel)`
  background-color: ${(props) => props.theme.brandColor};
`;
