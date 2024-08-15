import { useAtom } from 'jotai';
import { Row } from '../../components/Layout';
import { SmallText } from '../../components/Typography';
import { getChain, skipAssets } from '../../state/skip';
import { getFormattedAssetAmount } from '../../utils/crypto';

export type Operation = {
  fromChainID: string;
  denomIn: string;
  txIndex: number;
  amountIn: string;
  amountOut: string;
};

export type SwapExecutionFlowDetailedRouteRowProps = {
  operation: Operation;
};

export const SwapExecutionFlowDetailedRouteRow = ({
  operation,
}: SwapExecutionFlowDetailedRouteRowProps) => {
  const [{ data: assets }] = useAtom(skipAssets);

  const asset = assets?.find((asset) => asset.denom === operation.denomIn);

  const chain = getChain(operation?.fromChainID ?? '');
  const chainImage = chain.images?.find((image) => image.svg ?? image.png);
  return (
    <Row gap={15} align="center">
      {chainImage && (
        <img height={30} width={30} src={chainImage.svg ?? chainImage.png} />
      )}
      <Row gap={5}>
        <SmallText normalTextColor>
          {getFormattedAssetAmount(operation.amountIn ?? 0, asset?.decimals)}{' '}
          {asset?.recommendedSymbol}
        </SmallText>
        <SmallText> on {asset?.chainName}</SmallText>
      </Row>
    </Row>
  );
};
