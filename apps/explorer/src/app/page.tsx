"use client";
import React, { useCallback, useRef } from "react";
import { Column, Row, Spacer } from "@/components/Layout";
import {
  getTransferEventsFromTxStatusResponse,
  waitForTransactionWithCancel,
  transactionStatus,
  trackTransaction,
} from "@skip-go/client";
import type { TxStatusResponse, TransactionDetails as TransactionDetailsType } from "@skip-go/client";
import { useEffect, useState, useMemo } from "react";
import { TransferEventCard } from "../components/TransferEventCard";
import {
  defaultSkipClientConfig,
  skipClientConfigAtom,
  onlyTestnetsAtom,
} from "@/state/skipClient";
import { useSetAtom } from "@/jotai";
import { TransactionDetails } from "../components/TransactionDetails";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { NiceModal } from "@/nice-modal";
import { GhostButton } from "@/components/Button";
import { HamburgerIcon } from "@/icons/HamburgerIcon";
import { TokenDetails } from "../components/TokenDetails";
import { ExplorerModals } from "../constants/modal";
import { useQueryState, parseAsString, parseAsArrayOf, parseAsBoolean } from "nuqs";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { CoinsIcon } from "../icons/CoinsIcon";
import { Navbar } from "../components/Navbar";
import { ErrorCard, ErrorMessages } from "../components/ErrorCard";
import { ErrorBoundary } from "react-error-boundary";
import { Bridge } from "../components/Bridge";
import { styled } from "@/styled-components";
import { styledScrollbar } from "@/mixins/styledScrollbar";
import { SuccessfulTransactionCard } from "../components/SuccessfulTransactionCard";
import { chainIdsSortedToTopAtom } from "@/state/chainIdsSortedToTop";
import { CHAIN_IDS_SORTED_TO_TOP } from "../constants/chainIdsSortedToTop";
import { isMac } from "@/utils/os";
import { LoadingState } from "../components/LoadingState";
import { buildRouteTransactions, getTimelineCards } from "../utils/routeTimeline";
import { SKIP_API_URL } from "../utils/skipClientConfig";

type ErrorWithCodeAndDetails = Error & {
  code: number;
  details: string;
};

export default function Home() {
  const [txHash, setTxHash] = useState<string>();
  const [chainId, setChainId] = useState<string>();
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const [txHashes, setTxHashes] = useQueryState(
    "tx_hash",
    parseAsArrayOf(parseAsString, ",")
  );
  const [chainIds, setChainIds] = useQueryState(
    "chain_id",
    parseAsArrayOf(parseAsString, ",")
  );

  const [isTestnet] = useQueryState(
    "is_testnet",
    parseAsBoolean.withDefault(false)
  );

  const [data, setData] = useQueryState("data");
  const trackedTxHashes = useRef<string[]>([]);
  const queriedTransactions = useRef<TransactionDetailsType[]>([]);
  const statusRequestId = useRef<number>(0);

  const setChainIdsSortedToTop = useSetAtom(chainIdsSortedToTopAtom);

  const [transactionStatusResponse, setTransactionStatusResponse] =
    useState<TxStatusResponse | undefined>(undefined);


  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const isMobileScreenSize = useIsMobileScreenSize();
  const { transactionDetails: transactionDetailsFromUrlParams, operations, sourceAsset, destAsset } =
    useTransactionHistoryItemFromUrlParams();
  const [transactionStatuses, setTransactionStatuses] = useState<
    (TxStatusResponse | undefined)[]
  >([]);
  const [failedStatusQueries, setFailedStatusQueries] = useState<boolean[]>([]);
  const [errorDetails, setErrorDetails] = useState<{
    errorMessage: ErrorMessages;
    error: ErrorWithCodeAndDetails;
  }>();
  const [cancelStatusPolling, setCancelStatusPolling] = useState<{promise: Promise<TxStatusResponse>, cancel: () => void}[]>([]);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [showLoadingTimeout, setShowLoadingTimeout] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (event: WheelEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-route-preview]")) {
        event.preventDefault();
        return;
      }
      if (contentContainerRef.current) {
        event.preventDefault();

        requestAnimationFrame(() => {
          if (contentContainerRef.current) {
            const scrollAmount = event.deltaY;
            contentContainerRef.current.scrollTop += scrollAmount;
          }
        });

        setShowScrollbar(true);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setShowScrollbar(false);
        }, 400);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const routeTransactions = useMemo(() => buildRouteTransactions(
    operations,
    transactionDetailsFromUrlParams ?? [],
    transactionStatuses.map(status => ({
      status,
      events: status ? getTransferEventsFromTxStatusResponse([status]) : [],
    })),
  ), [operations, transactionDetailsFromUrlParams, transactionStatuses]);

  const transferEvents = useMemo(() => routeTransactions.flatMap(tx => tx.events), [routeTransactions]);
  const transfersToShow = useMemo(() => getTimelineCards(routeTransactions), [routeTransactions]);

  useEffect(() => {
    setSkipClientConfig({ ...defaultSkipClientConfig, apiUrl: SKIP_API_URL });
    setOnlyTestnets(isTestnet);
    setChainIdsSortedToTop(CHAIN_IDS_SORTED_TO_TOP) 
  }, [setSkipClientConfig, setOnlyTestnets, setChainIdsSortedToTop, isTestnet]);

  const onReindex = useCallback(async (_txHash?: string, _chainId?: string) => {
    try {
      await fetch(`${SKIP_API_URL}/v2/tx/retry_track`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_hash: _txHash ?? txHash,
          chain_id: _chainId ?? chainId,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }, [txHash, chainId]);

  const getTxStatus = useCallback(
    async (transactionDetails: TransactionDetailsType[] = []) => {
      const requestId = ++statusRequestId.current;
      const isCurrentRequest = () => requestId === statusRequestId.current;
      queriedTransactions.current = transactionDetails;
      setFailedStatusQueries([]);
      if (cancelStatusPolling.length > 0) {
        cancelStatusPolling.forEach(response => response.cancel());
        setCancelStatusPolling([]);
      }

      const txsToQuery = transactionDetails?.map((tx, index) => ({ tx, index })).filter(
        ({ tx }) => tx.txHash !== undefined && tx.chainId !== undefined
      );

      const responses = txsToQuery?.map(({ tx, index }) =>
        waitForTransactionWithCancel({
          txHash: tx.txHash ?? "",
          chainId: tx.chainId ?? "",
          doNotTrack: true,
          onStatusUpdated: (status) => {
            if (!isCurrentRequest()) return;
            setFailedStatusQueries(previous => isCurrentRequest()
              ? previous.map((failed, txIndex) => txIndex === index ? false : failed)
              : previous);
            setTransactionStatuses((prev) => {
              if (!isCurrentRequest()) return prev;
              const newStatuses = [...prev];
              newStatuses[index] = status;

              setTransactionStatusResponse(newStatuses[0]);

              return newStatuses;
            });
          },
          onError: async (error) => {
            if (!isCurrentRequest()) return;
            setFailedStatusQueries(previous => {
              if (!isCurrentRequest()) return previous;
              const next = [...previous];
              next[index] = true;
              return next;
            });
            const errorWithCodeAndDetails = error as ErrorWithCodeAndDetails;
            const notFound = error.message === "tx not found";
            const abandoned = error.message === "Tracking for the transaction has been abandoned";

            if (notFound || abandoned) {
              if (tx.txHash && !trackedTxHashes.current.includes(tx.txHash)) {
                trackedTxHashes.current.push(tx.txHash);
                if (notFound) {
                  await trackTransaction({
                    txHash: tx.txHash,
                    chainId: tx.chainId,
                  });
                } else if (abandoned) {
                  await onReindex(tx.txHash, tx.chainId);
                }
                if (!isCurrentRequest()) return;
                setErrorDetails(undefined);
                setTransactionStatusResponse(undefined);
                getTxStatus(transactionDetails);
              } else {
                setErrorDetails({
                  errorMessage: ErrorMessages.TRANSACTION_NOT_FOUND,
                  error: errorWithCodeAndDetails,
                });
              }

            } else {
              setErrorDetails({
                errorMessage: ErrorMessages.TRANSACTION_ERROR,
                error: errorWithCodeAndDetails,
              });
            }
          },
        })
      ) || [];

      // onError updates the UI; consume rejections from failures and cancellations.
      responses.forEach(({ promise }) => void promise.catch(() => undefined));
      setCancelStatusPolling(responses);
    },
    [cancelStatusPolling, onReindex]
  );

  const resetState = useCallback(() => {
    statusRequestId.current += 1;
    cancelStatusPolling.forEach(response => response.cancel());
    setCancelStatusPolling([]);

    setTxHashes(null);
    setChainIds(null);
    setData(null);
    setTxHash("");
    setChainId("");

    setTransactionStatuses([]);
    setFailedStatusQueries([]);
    setErrorDetails(undefined);
    setTransactionStatusResponse(undefined);
    trackedTxHashes.current = [];
    queriedTransactions.current = [];

  }, [cancelStatusPolling, setTxHashes, setChainIds, setData]);

  const onSearch = useCallback((_txhash?: string, _chainId?:string) => {
    statusRequestId.current += 1;
    setTransactionStatuses([]);
    setFailedStatusQueries([]);
    setErrorDetails(undefined);
    setTransactionStatusResponse(undefined);
    const hash = _txhash ?? txHash;
    const id = _chainId ?? chainId;

    if (hash && id) {
      setTxHashes([hash]);
      setChainIds([id]);
    }

    if (
      hash !== transactionDetailsFromUrlParams?.[0]?.txHash ||
      id !== transactionDetailsFromUrlParams?.[0]?.chainId
    ) {
      setData(null);
    }

    if (hash && id) {
      const transactions = transactionDetailsFromUrlParams;
      getTxStatus(transactions?.[0]?.txHash === hash && transactions?.[0]?.chainId === id
        ? transactions
        : [{ txHash: hash, chainId: id }]);
    }

  }, [txHash, chainId, transactionDetailsFromUrlParams, setTxHashes, setChainIds, setData, getTxStatus]);

  useEffect(() => {
    const requestId = ++statusRequestId.current;
    if (transactionDetailsFromUrlParams) {
      setChainId(transactionDetailsFromUrlParams[0]?.chainId);
      setTxHash(transactionDetailsFromUrlParams[0]?.txHash);
      getTxStatus(transactionDetailsFromUrlParams);
    } else if (
      txHashes &&
      txHashes.length > 0 &&
      chainIds &&
      chainIds.length > 0
    ) {
      setChainId(chainIds[0]);
      setTxHash(txHashes[0]);

      const transactionDetails: TransactionDetailsType[] = [];

      const calculateMissingChainIds = async () => {
        let nextChainId = chainIds[0];
        for (const txHash of txHashes) {
          const response = await transactionStatus({
            txHash,
            chainId: nextChainId,
          });

          if (requestId !== statusRequestId.current) return;
          transactionDetails.push({ txHash, chainId: nextChainId });
          nextChainId = response?.transferAssetRelease?.chainId || "";
        }
      }

      if (txHashes.length > 1) {
        calculateMissingChainIds().then(() => {
          if (requestId !== statusRequestId.current) return;
          getTxStatus(transactionDetails);
        });
      } else {
        transactionDetails.push({ txHash: txHashes[0], chainId: chainIds[0] });
        getTxStatus(transactionDetails);
      }

    }
    return () => {
      statusRequestId.current += 1;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transactionDetails = useMemo(() => {
    const chainIds = transfersToShow?.map((event) => event.chainId);
    const chainIdsFromUrlParams = [sourceAsset?.chainId ?? "", destAsset?.chainId ?? ""]

    const knownStatuses = transactionStatuses.filter((status): status is TxStatusResponse => Boolean(status?.state));
    // Prefer failures and pending states over an earlier transaction's success.
    const state = knownStatuses.find(status => status.state === "STATE_COMPLETED_ERROR" || status.state === "STATE_PENDING_ERROR")?.state
      ?? knownStatuses.find(status => status.state === "STATE_ABANDONED")?.state
      ?? knownStatuses.find(status => status.state !== "STATE_COMPLETED_SUCCESS")?.state
      ?? knownStatuses[0]?.state;

    return {
      txHash: transferEvents?.[0]?.fromTxHash ?? transactionDetailsFromUrlParams?.[0]?.txHash ?? "",
      state,
      chainIds: chainIds.length > 0 ? chainIds : chainIdsFromUrlParams,
      hasUntrackedSteps: routeTransactions.some(tx => tx.phase === "planned" || tx.phase === "loading"),
    };
  }, [transfersToShow, sourceAsset?.chainId, destAsset?.chainId, transferEvents, transactionDetailsFromUrlParams, transactionStatuses, routeTransactions]);

  const showRawDataModal = useCallback(() => {
    if (transactionStatuses.length > 0) {
      NiceModal.show(ExplorerModals.ViewRawDataModal, {
        data: JSON.stringify(Array.from(transactionStatuses.values()), null, 2),
        blurBackground: true,
      });
    } else {
      NiceModal.show(ExplorerModals.ViewRawDataModal, {
        data: JSON.stringify(
          {
            ...errorDetails?.error,
            message: errorDetails?.error?.message,
          },
          null,
          2
        ),
        blurBackground: true,
      });
    }
  }, [errorDetails, transactionStatuses]);

  const isTop = useMemo(() => {
    return (
      Boolean(
        txHashes && txHashes.length > 0 && chainIds && chainIds.length > 0
      ) || Boolean(data)
    );
  }, [chainIds, data, txHashes]);

  const isLessThan1300 = useIsMobileScreenSize(1300);
  const isSearchAModal = useMemo(() => {
    return Boolean(isTop && isLessThan1300);
  }, [isTop, isLessThan1300]);

  const hasStatusQueryError = Boolean(errorDetails) && failedStatusQueries.some((failed, index) => failed && !transactionStatuses[index]);

  const isLoading = useMemo(() => {
    if (hasStatusQueryError) return false;
    const hasQueryParams = Boolean(
      (txHashes && txHashes.length > 0 && chainIds && chainIds.length > 0) ||
      data ||
      transactionDetailsFromUrlParams
    );
    const hasNoData =
      transfersToShow.length === 0 &&
      !errorDetails &&
      !transactionStatusResponse;

    const isStateSubmittedWithEmptyTransfers =
      transactionStatusResponse?.state === "STATE_SUBMITTED" &&
      transferEvents.length === 0;

    const isAwaitingStatus = routeTransactions.some(tx => tx.phase === "loading");

    return (hasQueryParams && (hasNoData || isAwaitingStatus)) || isStateSubmittedWithEmptyTransfers;
  }, [txHashes, chainIds, data, transactionDetailsFromUrlParams, transfersToShow.length, errorDetails, transactionStatusResponse, transferEvents.length, routeTransactions, hasStatusQueryError]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      setShowLoadingTimeout(false);
      timeoutId = setTimeout(() => {
        setShowLoadingTimeout(true);
      }, 30000); // 30 seconds
    } else {
      setShowLoadingTimeout(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);

  const txNotFound = useMemo(() => {
    return errorDetails?.errorMessage === ErrorMessages.TRANSACTION_NOT_FOUND;
  }, [errorDetails?.errorMessage]);

  const renderPageContent = useMemo(() => {
    if (isLoading && showLoadingTimeout) {
      return (
        <StyledColumns align="flex-end" gap={10}>
          <ErrorCard
            errorTitle="Loading Timeout"
            errorMessage="The transaction is taking longer than expected to load. Please try again or check if the transaction hash and chain ID are correct."
            onRetry={() => onSearch()}
          />
        </StyledColumns>
      );
    }
    if (isLoading) {
      return <LoadingState />;
    }
    if (transfersToShow.length > 0 && !hasStatusQueryError) {
      return (
        <StyledContentContainer
          gap={16}
          flexDirection={isMobileScreenSize ? "column" : "row"}
          align={isMobileScreenSize ? "center" : "flex-start"}
        >
          <StyledColumns>
            <StyledColumns align="flex-end" style={{ position: !isMobileScreenSize ? "absolute" : "relative" }}>
              <GhostButton
                gap={5}
                align="center"
                justify="center"
                onClick={() => setShowTokenDetails(!showTokenDetails)}
                style={{
                  visibility: transactionStatusResponse?.transferAssetRelease?.released || transactionDetailsFromUrlParams
                    ? "visible"
                    : "hidden",
                }}
              >
                {showTokenDetails ? "Close" : "View token details"}
                {!showTokenDetails && <CoinsIcon />}
              </GhostButton>
              <Spacer height={10} />

              {showTokenDetails ? (
                <TokenDetails transactionStatusResponse={transactionStatusResponse} />
              ) : (
                <TransactionDetails {...transactionDetails} />
              )}
            </StyledColumns>
          </StyledColumns>
          <StyledTransferColumn>
            <Row width="100%" justify="flex-end">
              <GhostButton gap={5} onClick={showRawDataModal}>
                View raw data <HamburgerIcon />
              </GhostButton>
            </Row>
            <Spacer height={10} />
            <StyledTransferList ref={contentContainerRef} showScrollbar={showScrollbar}>
              {transfersToShow.map((transfer) => (
                <React.Fragment key={transfer.id}>
                  {transfer.step !== "Origin" && (
                    <Bridge
                      transferType={transfer.transferType}
                      durationInMs={transfer.durationInMs}
                      dimmed={transfer.timeline.phase === "planned"}
                    />
                  )}
                  <ErrorBoundary
                    fallback={
                      <ErrorCard
                        errorTitle={ErrorMessages.TRANSFER_EVENT_ERROR}
                        errorMessage={transactionStatuses.map(status => status?.error?.message).join("")}
                        padding="20px 45px"
                        onRetry={() => onSearch()}
                      />
                    }
                  >
                    <TransferEventCard
                      {...transfer}
                      onReindex={async () => {
                        const requestId = statusRequestId.current;
                        const transactions = queriedTransactions.current;
                        const tx = transactions[transfer.txIndex];
                        if (!tx?.txHash) return;
                        await onReindex(tx.txHash, tx.chainId);
                        if (requestId !== statusRequestId.current) return;
                        setErrorDetails(undefined);
                        await getTxStatus(transactions);
                      }}
                    />
                  </ErrorBoundary>
                </React.Fragment>
              ))}
            </StyledTransferList>
          </StyledTransferColumn>
        </StyledContentContainer>
      )
    }
    if (errorDetails) {
      return (
        <StyledColumns align="flex-end" gap={10}>
          <GhostButton gap={5} onClick={showRawDataModal}>
            View raw data <HamburgerIcon />
          </GhostButton>
          <ErrorCard
            errorTitle={txNotFound ? ErrorMessages.TRANSACTION_NOT_FOUND : ErrorMessages.TRANSACTION_ERROR}
            errorMessage={transactionStatuses.map(status => status?.error?.message).join("")}
            onRetry={() => onSearch()}
          />
        </StyledColumns>
      )
    }
    if (transactionStatusResponse?.state === "STATE_COMPLETED_SUCCESS") {
      if (transactionDetailsFromUrlParams) {
        return (
          <StyledContentContainer
            gap={16}
            flexDirection={isMobileScreenSize ? "column" : "row"}
            align={isMobileScreenSize ? "center" : "flex-start"}
          >
            <StyledColumns>
              <StyledColumns align="flex-end" style={{ position: !isMobileScreenSize ? "absolute" : "relative" }}>
                <GhostButton
                  gap={5}
                  align="center"
                  justify="center"
                  onClick={() => setShowTokenDetails(!showTokenDetails)}
                  style={{
                    visibility: transactionDetailsFromUrlParams
                      ? "visible"
                      : "hidden",
                  }}
                >
                  {showTokenDetails ? "Close" : "View token details"}
                  {!showTokenDetails && <CoinsIcon />}
                </GhostButton>
                <Spacer height={10} />

                {showTokenDetails ? (
                  <TokenDetails />
                ) : (
                  <TransactionDetails {...transactionDetails} />
                )}
              </StyledColumns>
            </StyledColumns>
            <StyledTransferColumn>
              <Row width="100%" justify="flex-end">
                <GhostButton gap={5} onClick={showRawDataModal}>
                  View raw data <HamburgerIcon />
                </GhostButton>
              </Row>
              <Spacer height={10} />
              <StyledTransferList ref={contentContainerRef} showScrollbar={showScrollbar}>
                <TransferEventCard
                  chainId={sourceAsset?.chainId ?? ''}
                  transferType={operations[0]?.type}
                  explorerLink={transactionDetailsFromUrlParams?.[0]?.explorerLink ?? ''}
                  step="Origin"
                />

                <Bridge
                  transferType={operations[0]?.type}
                />

                <TransferEventCard
                  chainId={destAsset?.chainId ?? ''}
                  transferType={operations[0]?.type}
                  status="completed"
                  explorerLink={transactionDetailsFromUrlParams?.[0]?.explorerLink ?? ''}
                  step="Destination"
                />
              </StyledTransferList>
            </StyledTransferColumn>
          </StyledContentContainer>
        )
      }
      return <SuccessfulTransactionCard showRawDataModal={showRawDataModal} />;
    }
    return;
  }, [isLoading, showLoadingTimeout, transfersToShow, hasStatusQueryError, errorDetails, transactionStatusResponse, showScrollbar, isMobileScreenSize, transactionDetailsFromUrlParams, showTokenDetails, transactionDetails, showRawDataModal, txNotFound, transactionStatuses, onSearch, onReindex, getTxStatus, sourceAsset?.chainId, operations, destAsset?.chainId]);

  return (
    <Column width="100%" align="center">
      <Navbar
        isSearchAModal={isSearchAModal}
        isTop={isTop}
        txHash={txHash}
        chainId={chainId}
        onSearch={onSearch}
        resetState={resetState}
        setTxHash={setTxHash}
        setChainId={setChainId}
        isLoading={isLoading}
      />

      { renderPageContent }
    </Column>
  );
}

const StyledContentContainer = styled(Row)`
  height: calc(100vh - 100px);
  @media (min-width: 1023px) {
    height: calc(100vh - 150px);
  }
  > :first-child {
    flex-shrink: 0;
  }
`;

const StyledColumns = styled(Column)`
  width: calc(100vw - 32px);
  @media (min-width: 767px) {
    width: 355px;
  }
`;

const StyledTransferColumn = styled(StyledColumns)`
  height: 100%;
  min-height: 0;

  > :first-child {
    flex-shrink: 0;
  }
`;

const StyledTransferList = styled(Column)<{ showScrollbar: boolean }>`
  flex: 1;
  min-height: 0;
  align-items: center;
  width: calc(100% + 8px);
  padding-right: 8px;
  overflow: auto;

  > * {
    flex-shrink: 0;
  }

  ${isMac() ? "scroll-behavior: auto;" : "scroll-behavior: smooth;"}
  ${({ showScrollbar }) => styledScrollbar(showScrollbar)};
`;
