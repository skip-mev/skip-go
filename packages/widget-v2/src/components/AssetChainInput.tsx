import { styled } from 'styled-components';
import { Column, Row, Spacer } from './Layout';
import { SmallText, Text } from './Typography';
import { ChevronIcon } from '../icons/ChevronIcon';
import { useTheme } from 'styled-components';
import { CogIcon } from '../icons/CogIcon';
import { Button, GhostButton } from './Button';
import { useAtom } from 'jotai';
import { skipAssets } from '../state/skip';
import { useUsdValue } from '../utils/useUsdValue';
import { formatUSD } from '../utils/intl';

export type AssetChainInputProps = {
  value?: string;
  onChangeValue?: (value: string) => void;
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
  const [{ data: assets }] = useAtom(skipAssets);

  const selectedAsset = assets?.find(
    (asset) => asset.denom === selectedAssetDenom
  );

  const usdValue = useUsdValue({ ...selectedAsset, value });

  return (
    <StyledAssetChainInputWrapper
      justify="space-between"
      padding={20}
      borderRadius={25}
    >
      <Row justify="space-between">
        <StyledInput
          type="text"
          value={value}
          onChange={(e) => onChangeValue?.(e.target.value)}
        />
        <Button onClick={handleChangeAsset} gap={5}>
          {selectedAsset ? (
            <StyledAssetLabel align="center" justify="center" gap={7}>
              <img src={selectedAsset?.logoURI} width={23} />
              <Text>{selectedAsset?.name}</Text>
            </StyledAssetLabel>
          ) : (
            <StyledSelectTokenLabel>
              <Text>Select token</Text>
            </StyledSelectTokenLabel>
          )}

          <ChevronIcon
            color={theme.backgroundColor}
            backgroundColor={theme.textColor}
          />
        </Button>
      </Row>
      <Row justify="space-between">
        <SmallText>{formatUSD(usdValue?.data ?? 0)}</SmallText>
        {selectedAsset ? (
          <GhostButton
            onClick={handleChangeChain}
            align="center"
            secondary
            gap={4}
          >
            <SmallText>on {selectedAsset?.chainName}</SmallText>
            <CogIcon color={theme.textColor} />
          </GhostButton>
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

export const StyledAssetLabel = styled(Row).attrs({
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
