import {
  ArrowRightIcon,
  FingerPrintIcon,
  PencilSquareIcon,
} from '@heroicons/react/20/solid';
import { RouteResponse } from '@skip-go/core';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FaExternalLinkAlt, FaKeyboard } from 'react-icons/fa';
import { formatUnits } from 'viem';

import { AdaptiveLink } from '../AdaptiveLink';
import { SimpleTooltip } from '../SimpleTooltip';
import { SwapAction, TransferAction } from './make-actions';
import { ChainIDWithAction } from './make-chain-ids-with-actions';
import { makeStepState } from './make-step-state';
import { SetAddressDialog } from './SetAddressDialog';
import { BroadcastedTx, ChainAddresses, SetChainAddressesParam } from './types';
import { useChainByID, useChains } from '../../hooks/use-chains';
import { useBridgeByID } from '../../hooks/use-bridges';
import { useAutoSetAddress } from '../../hooks/use-auto-set-address';
import { useBroadcastedTxsStatus } from '../../hooks/use-broadcasted-txs';
import { useAccount } from '../../hooks/use-account';
import {
  isCCTPLedgerBrokenInOperation,
  isEthermintLedgerInOperation,
} from '../../utils/ledger-warning';
import { cn } from '../../utils/ui';
import { ExpandArrow } from '../Icon/ExpandArrow';
import { useAssets } from '../../provider/assets';
import { StyledBorderDiv, StyledThemedDiv } from '../StyledComponents/Theme';
import { useTheme, styled } from 'styled-components';
import { StyledThemedButton } from '../StyledComponents/Buttons';

export const ChainStep = ({
  chainID,
  index,
  transferAction,
  swapAction,
  route,
  chainIDsWithAction,
  isOpen,
  broadcastedTxs,
  mutationStatus,
  setShowLedgerWarning,
  isSetAddressDialogOpen,
  setIsAddressDialogOpen,
  isExpanded,
  setIsExpanded,
  chainAddresses,
  setChainAddresses,
}: {
  chainID: string;
  index: number;
  transferAction?: TransferAction;
  swapAction?: SwapAction;
  route: RouteResponse;
  chainIDsWithAction: ChainIDWithAction[];
  isOpen: boolean;
  broadcastedTxs: BroadcastedTx[];
  mutationStatus: {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
  setShowLedgerWarning: Dispatch<
    SetStateAction<{
      cctp: boolean;
      ethermint: boolean;
    }>
  >;
  isSetAddressDialogOpen: boolean;
  setIsAddressDialogOpen: (v: number | undefined) => void;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  chainAddresses: ChainAddresses;
  setChainAddresses: (v: SetChainAddressesParam) => void;
}) => {
  const theme = useTheme();
  const { data: chain } = useChainByID(chainID);

  const totalChains = chainIDsWithAction.length;
  const isDestination = index === totalChains - 1;
  const isSource = index === 0;

  const { getAsset } = useAssets();

  const { data: bridge } = useBridgeByID(transferAction?.bridgeID);

  const chainAddress = chainAddresses[index];

  const previousChain = index !== 0 && chainIDsWithAction[index - 1];
  const signRequired = (() => {
    if (
      previousChain &&
      previousChain.transferAction?.id === transferAction?.id
    ) {
      if (swapAction?.signRequired && transferAction?.signRequired) {
        return true;
      }
      return false;
    }
    return transferAction?.signRequired || swapAction?.signRequired;
  })();

  useAutoSetAddress({
    chain,
    chainID,
    index,
    enabled: isOpen,
    signRequired,
    chainAddresses,
    setChainAddresses,
  });

  // tx tracking
  const { data: statusData } = useBroadcastedTxsStatus({
    txs: broadcastedTxs,
    txsRequired: route.txsRequired,
  });
  const stepState = makeStepState({
    statusData,
    isDestination: isDestination,
    index,
  });
  const isSuccess =
    totalChains === 1
      ? mutationStatus.isSuccess
      : Boolean(stepState?.isSuccess);
  const isError =
    totalChains === 1
      ? mutationStatus.isError
      : route.txsRequired !== broadcastedTxs.length &&
        mutationStatus.isError &&
        signRequired &&
        (broadcastedTxs.length === transferAction?.txIndex ||
          broadcastedTxs.length === swapAction?.txIndex)
      ? true
      : Boolean(stepState?.isError);
  const isLoading = isSource
    ? mutationStatus.isPending && !isSuccess && !isError
    : Boolean(stepState?.isLoading);

  const account = useAccount(chainID);
  useEffect(() => {
    const showCCTPLedgerWarning =
      isCCTPLedgerBrokenInOperation(route) &&
      account?.wallet?.isLedger === true;
    const showEthermintLikeLedgerWarning =
      isEthermintLedgerInOperation(route) && account?.wallet?.isLedger === true;

    if (signRequired && setShowLedgerWarning) {
      setShowLedgerWarning({
        cctp: !!showCCTPLedgerWarning,
        ethermint: !!showEthermintLikeLedgerWarning,
      });
    }
  }, [
    account,
    account?.wallet?.isLedger,
    route,
    setShowLedgerWarning,
    signRequired,
  ]);

  const swapAsset =
    swapAction &&
    getAsset(
      isSource && totalChains !== 1 ? swapAction.denomIn : swapAction.denomOut,
      swapAction.chainID
    );
  const transferAsset =
    transferAction &&
    (isSource
      ? getAsset(transferAction.denomIn, transferAction.fromChainID)
      : getAsset(transferAction.denomOut, transferAction.toChainID));

  const { data: chains } = useChains();
  const getChain = (chainID: string) =>
    chains?.find((c) => c.chainID === chainID);

  const intermidiaryChainsImage = useMemo(() => {
    return chainIDsWithAction
      .filter((c, i) => i !== 0 && i !== totalChains - 1)
      .map((c) => {
        const chain = getChain(c.chainID);
        return {
          name: chain?.prettyName,
          image: chain?.logoURI || 'https://api.dicebear.com/6.x/shapes/svg',
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainIDsWithAction]);

  const isNotFocused = !isDestination && !signRequired && index !== 0;
  const isIntermidiaryChain = !(isSource || isDestination || signRequired);

  if (!chain) return null;
  if (!isSource && !isDestination && !isExpanded)
    return (
      <SetAddressDialog
        chain={chain}
        onOpen={(v) => setIsAddressDialogOpen(v ? index : undefined)}
        open={isSetAddressDialogOpen}
        index={index}
        signRequired={Boolean(signRequired)}
        isDestination={isDestination}
        chainAddresses={chainAddresses}
        setChainAddresses={setChainAddresses}
      />
    );
  return (
    <div
      className={cn(
        'flex flex-row justify-between',
        isDestination && '-mt-[5px]'
      )}
    >
      <div className="flex flex-row space-x-4">
        <div className={cn('flex flex-col items-center justify-center')}>
          <StyledChainLogoContainer
            className={cn(
              'relative h-14 w-14 rounded-full p-1 transition-all duration-500 ease-in-out',
              isDestination && '-mt-[15px]',
              isLoading || isSuccess
                ? swapAction
                  ? 'bg-gradient-to-b from-green-600 via-blue-800 to-green-600'
                  : 'bg-green-600'
                : '',
              isError && 'bg-red-600'
            )}
          >
            <StyledThemedDiv className="flex h-full w-full items-center justify-center rounded-full p-1">
              <img
                src={
                  chain?.logoURI || 'https://api.dicebear.com/6.x/shapes/svg'
                }
                width={48}
                height={48}
                className={cn('rounded-full object-cover')}
                alt={chainID}
              />
            </StyledThemedDiv>
            {signRequired && (
              <SimpleTooltip label={`Require signing`} type="default">
                <div
                  className={cn(
                    'absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF486E]'
                  )}
                >
                  <FingerPrintIcon className="h-4 w-4 text-white" />
                </div>
              </SimpleTooltip>
            )}
          </StyledChainLogoContainer>
          {!isDestination && (
            <div className="left-- relative flex h-16 w-4 items-center justify-center">
              {transferAction && isExpanded && bridge && (
                <SimpleTooltip
                  label={`Bridged with ${bridge?.name}`}
                  type="default"
                >
                  <StyledBridgeLogoContainer>
                    <img
                      className="object-contain"
                      src={
                        bridge?.logoURI ||
                        'https://api.dicebear.com/6.x/shapes/svg'
                      }
                      height={16}
                      width={16}
                      alt={chainID}
                    />
                  </StyledBridgeLogoContainer>
                </SimpleTooltip>
              )}
              {!isExpanded && (
                <div className="absolute right-6 flex w-full flex-col">
                  {intermidiaryChainsImage.map((c, i) => (
                    <SimpleTooltip label={c.name} key={i}>
                      <StyledBorderDiv
                        as="img"
                        src={c.image}
                        height={20}
                        width={20}
                        className={cn(
                          '-mt-1 rounded-full border-2 object-contain'
                        )}
                        alt={chainID}
                      />
                    </SimpleTooltip>
                  ))}
                </div>
              )}
              {!isExpanded && (
                <StyledThemedButton
                  className="absolute top-[18px] rounded-full border-2 p-1 text-neutral-400 transition-transform hover:scale-110"
                  onClick={() => setIsExpanded(true)}
                >
                  <ExpandArrow className="h-4 w-4" />
                </StyledThemedButton>
              )}

              <StyledChainLogoContainer
                className={cn(
                  'h-full w-1 transition-all',
                  isLoading
                    ? 'animate-gradient-y bg-gradient-to-b from-green-600 from-0% via-green-600 via-20% to-[#ffdc61] to-50%'
                    : isSuccess
                    ? 'bg-green-600'
                    : ''
                )}
              />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col space-y-0">
          {swapAction &&
          signRequired &&
          (!isSource || (isSource && route.chainIDs.length === 1)) ? (
            <AssetSwap
              in={{
                amount: swapAction.amountIn,
                logoURI: getAsset(swapAction.denomIn, swapAction.chainID)
                  ?.logoURI,
                symbol: getAsset(swapAction.denomIn, swapAction.chainID)
                  ?.recommendedSymbol,
                decimals: getAsset(swapAction.denomIn, swapAction.chainID)
                  ?.decimals,
              }}
              out={{
                amount: swapAction.amountOut,
                logoURI: getAsset(swapAction.denomOut, swapAction.chainID)
                  ?.logoURI,
                symbol: getAsset(swapAction.denomOut, swapAction.chainID)
                  ?.recommendedSymbol,
                decimals: getAsset(swapAction.denomOut, swapAction.chainID)
                  ?.decimals,
              }}
            />
          ) : swapAction ? (
            <Asset
              amount={
                isSource && totalChains !== 1
                  ? swapAction.amountIn
                  : swapAction.amountOut
              }
              logoURI={swapAsset?.logoURI}
              symbol={swapAsset?.recommendedSymbol}
              decimals={swapAsset?.decimals}
            />
          ) : (
            <Asset
              amount={
                isSource ? transferAction?.amountIn : transferAction?.amountOut
              }
              logoURI={transferAsset?.logoURI}
              symbol={transferAsset?.recommendedSymbol}
              decimals={transferAsset?.decimals}
            />
          )}
          <div className="flex flex-row items-center space-x-2">
            <p className="text-sm font-semibold text-gray-400">
              {chain?.prettyName}
            </p>
            {chainAddress?.address && isIntermidiaryChain && (
              <SimpleTooltip label={chainAddress.address}>
                <button
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(chainAddress.address || '');
                      toast.success('Address copied to clipboard');
                    } catch (error) {
                      toast.error('Failed to copy address to clipboard');
                    }
                  }}
                  className="opacity-50"
                >
                  {chainAddress?.source !== 'input' ? (
                    <img
                      height={16}
                      width={16}
                      alt={'wallet'}
                      className="object-contain"
                      src={
                        (typeof chainAddress?.source?.walletInfo.logo ===
                        'string'
                          ? chainAddress?.source?.walletInfo.logo
                          : chainAddress?.source?.walletInfo.logo?.major ||
                            chainAddress?.source?.walletInfo.logo?.minor) ||
                        'https://api.dicebear.com/6.x/shapes/svg'
                      }
                    />
                  ) : (
                    <FaKeyboard className="h-4 w-4 text-neutral-400" />
                  )}
                </button>
              </SimpleTooltip>
            )}
            {stepState?.explorerLink && (
              <StyledAdaptiveLink
                className={cn(
                  'flex flex-row items-center text-sm font-semibold underline'
                )}
                href={stepState.explorerLink.link}
                data-testid={`explorer-link`}
              >
                {stepState.explorerLink.shorthand}
                <FaExternalLinkAlt className="ml-1 h-3 w-3" />
              </StyledAdaptiveLink>
            )}
          </div>
          <div
            className={cn(
              'flex h-9 flex-row items-center space-x-2',
              isNotFocused && 'opacity-50'
            )}
          >
            {chainAddress?.address && !isIntermidiaryChain && (
              <>
                {chainAddress?.source !== 'input' ? (
                  <img
                    height={16}
                    width={16}
                    alt={'wallet'}
                    className="object-contain"
                    src={
                      (typeof chainAddress?.source?.walletInfo.logo === 'string'
                        ? chainAddress?.source?.walletInfo.logo
                        : chainAddress?.source?.walletInfo.logo?.major ||
                          chainAddress?.source?.walletInfo.logo?.minor) ||
                      'https://api.dicebear.com/6.x/shapes/svg'
                    }
                  />
                ) : (
                  <FaKeyboard className="h-4 w-4 text-neutral-400" />
                )}

                <SimpleTooltip
                  label={`Copy ${
                    !isSource && !signRequired
                      ? isDestination
                        ? 'Destination'
                        : 'Recovery'
                      : chain.prettyName
                  } Address`}
                >
                  <button
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(
                          chainAddress.address || ''
                        );
                        toast.success('Address copied to clipboard');
                      } catch (error) {
                        toast.error('Failed to copy address to clipboard');
                      }
                    }}
                  >
                    <p
                      className={cn(
                        'text-md font-semibold',
                        isNotFocused && 'font-normal text-neutral-400'
                      )}
                    >
                      {chainAddress.address.slice(0, 8)}...
                      {chainAddress.address.slice(-5)}
                    </p>
                  </button>
                </SimpleTooltip>
              </>
            )}
            {chainAddress?.address &&
              !isIntermidiaryChain &&
              !signRequired &&
              !isSource &&
              !mutationStatus.isPending &&
              !isSuccess && (
                <button onClick={() => setIsAddressDialogOpen(index)}>
                  <StyledPencilSquareIcon
                    className={cn(
                      'h-4 w-4',
                      isNotFocused && 'text-neutral-400'
                    )}
                    isFocused={!isNotFocused}
                  />
                </button>
              )}
          </div>
        </div>
      </div>
      <SetAddressDialog
        chain={chain}
        onOpen={(v) => setIsAddressDialogOpen(v ? index : undefined)}
        open={isSetAddressDialogOpen}
        index={index}
        signRequired={Boolean(signRequired)}
        isDestination={isDestination}
        chainAddresses={chainAddresses}
        setChainAddresses={setChainAddresses}
      />
    </div>
  );
};

const Asset = ({
  logoURI,
  symbol,
  amount,
  decimals,
}: {
  amount?: string;
  logoURI?: string;
  symbol?: string;
  decimals?: number;
}) => {
  const amountDisplayed = useMemo(() => {
    try {
      return formatUnits(BigInt(amount || '0'), decimals ?? 6);
    } catch {
      return '0';
    }
  }, [amount, decimals]);
  return (
    <div className="flex flex-row items-center space-x-1">
      <SimpleTooltip
        enabled={amountDisplayed.length > 6}
        label={`${amountDisplayed} ${symbol}`}
      >
        <div
          className={cn(
            amountDisplayed.length > 6 &&
              'cursor-help tabular-nums underline decoration-neutral-400 decoration-dotted underline-offset-4'
          )}
        >
          <p className="text-md font-medium">
            {parseFloat(amountDisplayed).toLocaleString('en-US', {
              maximumFractionDigits: 6,
            })}
          </p>
        </div>
      </SimpleTooltip>
      <img
        src={logoURI || 'https://api.dicebear.com/6.x/shapes/svg'}
        width={16}
        height={16}
        className={cn('rounded-full object-contain')}
        alt={symbol}
      />
      <p className="text-md font-medium">{symbol}</p>
    </div>
  );
};

const AssetSwap = (props: {
  in: { amount?: string; logoURI?: string; symbol?: string; decimals?: number };
  out: {
    amount?: string;
    logoURI?: string;
    symbol?: string;
    decimals?: number;
  };
}) => {
  return (
    <div className="flex flex-row flex-wrap items-center space-x-1">
      <Asset {...props.in} />
      <ArrowRightIcon className="h-4 w-4" />
      <Asset {...props.out} />
    </div>
  );
};

const StyledAdaptiveLink = styled(AdaptiveLink)`
  color: ${(props) => props.theme.brandColor};
`;

const StyledPencilSquareIcon = styled(PencilSquareIcon)<{ isFocused: boolean }>`
  ${(props) => props.isFocused && props.theme.brandColor};
`;

const StyledBridgeLogoContainer = styled.div`
  border-radius: 50%;
  background-color: ${(props) => props.theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: absolute;
  right: 1rem;
`;

const StyledChainLogoContainer = styled.div`
  background-color: ${(props) => props.theme.borderColor};
`;
