import {
  ArrowRightIcon,
  FingerPrintIcon,
  PencilSquareIcon,
} from '@heroicons/react/20/solid';
import { RouteResponse } from '@skip-router/core';
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
import { useAssets } from '../../hooks/use-assets';
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
  const { data: chain } = useChainByID(chainID);

  const totalChains = chainIDsWithAction.length;
  const isDestination = index === totalChains - 1;
  const isSource = index === 0;

  const { data: assets } = useAssets();

  const getAsset = (_chainID: string, denom: string) =>
    assets?.[_chainID]?.find((a) => a.denom === denom);

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
      swapAction.chainID,
      isSource && totalChains !== 1 ? swapAction.denomIn : swapAction.denomOut
    );
  const transferAsset =
    transferAction &&
    (isSource
      ? getAsset(transferAction.fromChainID, transferAction.denomIn)
      : getAsset(transferAction.toChainID, transferAction.denomOut));

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
          image: chain?.logoURI || '/logo-fallback.png',
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
          <div
            className={cn(
              'relative h-14 w-14 rounded-full p-1 transition-all duration-500 ease-in-out',
              isDestination && '-mt-[15px]',
              isLoading || isSuccess
                ? swapAction
                  ? 'bg-gradient-to-b from-green-600 via-blue-800 to-green-600'
                  : 'bg-green-600'
                : 'bg-neutral-200',
              isError && 'bg-red-600'
            )}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-1">
              <img
                src={chain?.logoURI || '/logo-fallback.png'}
                width={48}
                height={48}
                className={cn('rounded-full object-cover')}
                alt={chainID}
              />
            </div>
            {signRequired && (
              <SimpleTooltip label={`Require signing`} type="default">
                <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF486E]">
                  <FingerPrintIcon className="h-4 w-4 text-white" />
                </div>
              </SimpleTooltip>
            )}
          </div>
          {!isDestination && bridge && (
            <div className="left-- relative flex h-16 w-4 items-center justify-center">
              {transferAction && isExpanded && (
                <SimpleTooltip
                  label={`Bridged with ${bridge?.name}`}
                  type="default"
                >
                  <img
                    src={bridge?.logoURI || '/logo-fallback.png'}
                    height={16}
                    width={16}
                    className={cn(
                      'absolute right-4 top-[22px] bg-opacity-50 object-contain py-1'
                    )}
                    alt={chainID}
                  />
                </SimpleTooltip>
              )}
              {!isExpanded && (
                <div className="absolute right-6 flex w-full flex-col">
                  {intermidiaryChainsImage.map((c, i) => (
                    <SimpleTooltip label={c.name} key={i}>
                      <img
                        src={c.image}
                        height={20}
                        width={20}
                        className={cn(
                          '-mt-1 rounded-full border-2 border-neutral-200 object-contain'
                        )}
                        alt={chainID}
                      />
                    </SimpleTooltip>
                  ))}
                </div>
              )}
              {!isExpanded && (
                <button
                  className="absolute top-[18px] rounded-full border-2 border-neutral-200 bg-white p-1 text-neutral-400 transition-transform hover:scale-110"
                  onClick={() => setIsExpanded(true)}
                >
                  <ExpandArrow className="h-4 w-4" />
                </button>
              )}

              <div
                className={cn(
                  'h-full w-1 transition-all',
                  isLoading
                    ? 'animate-gradient-y bg-neutral-200 bg-gradient-to-b from-green-600 from-0% via-green-600 via-20% to-[#ffdc61] to-50%'
                    : isSuccess
                    ? 'bg-green-600'
                    : 'bg-neutral-200'
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
                logoURI: getAsset(swapAction.chainID, swapAction.denomIn)
                  ?.logoURI,
                symbol: getAsset(swapAction.chainID, swapAction.denomIn)
                  ?.recommendedSymbol,
                decimals: getAsset(swapAction.chainID, swapAction.denomIn)
                  ?.decimals,
              }}
              out={{
                amount: swapAction.amountOut,
                logoURI: getAsset(swapAction.chainID, swapAction.denomOut)
                  ?.logoURI,
                symbol: getAsset(swapAction.chainID, swapAction.denomOut)
                  ?.recommendedSymbol,
                decimals: getAsset(swapAction.chainID, swapAction.denomOut)
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
                        '/logo-fallback.png'
                      }
                    />
                  ) : (
                    <FaKeyboard className="h-4 w-4 text-neutral-400" />
                  )}
                </button>
              </SimpleTooltip>
            )}
            {stepState?.explorerLink && (
              <AdaptiveLink
                className="flex flex-row items-center text-sm font-semibold text-[#FF486E] underline"
                href={stepState.explorerLink.link}
                data-testid={`explorer-link`}
              >
                {stepState.explorerLink.shorthand}
                <FaExternalLinkAlt className="ml-1 h-3 w-3" />
              </AdaptiveLink>
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
                      '/logo-fallback.png'
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
                  <PencilSquareIcon
                    className={cn(
                      'h-4 w-4',
                      !isNotFocused ? 'text-[#FF486E]' : 'text-neutral-400'
                    )}
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
        src={logoURI || '/logo-fallback.png'}
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
