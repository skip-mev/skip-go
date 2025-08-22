"use client";
import React, { useCallback } from "react";
import { Column, Row, Spacer } from "@/components/Layout";
import {
  getTransferEventsFromTxStatusResponse,
  ClientTransferEvent,
  TxStatusResponse,
  TransactionDetails as TransactionDetailsType,
  waitForTransactionWithCancel,
  transactionStatus,
} from "@skip-go/client";
import { useEffect, useState, useMemo } from "react";
import {
  TransferEventCard,
  TransferEventCardProps,
} from "../components/TransferEventCard";
import {
  defaultSkipClientConfig,
  skipClientConfigAtom,
  onlyTestnetsAtom,
  skipChainsAtom,
} from "@/state/skipClient";
import { useSetAtom, useAtomValue } from "@/jotai";
import { TransactionDetails } from "../components/TransactionDetails";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { NiceModal } from "@/nice-modal";
import { GhostButton } from "@/components/Button";
import { HamburgerIcon } from "@/icons/HamburgerIcon";
import { TokenDetails } from "../components/TokenDetails";
import { ExplorerModals } from "../constants/modal";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { CoinsIcon } from "../icons/CoinsIcon";
import { Navbar } from "../components/Navbar";
import { ErrorCard, ErrorMessages } from "../components/ErrorCard";
import { ErrorBoundary } from "react-error-boundary";
import { Bridge } from "../components/Bridge";
import { styled } from "@/styled-components";

type ErrorWithCodeAndDetails = Error & {
  code: number;
  details: string;
};

export default function Home() {
  // const theme = useTheme();
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
  const [data, setData] = useQueryState("data");
  const [transferEvents, setTransferEvents] = useState<ClientTransferEvent[]>(
    []
  );

  const { operations } = useTransactionHistoryItemFromUrlParams();
  const [transactionStatusResponse, setTransactionStatusResponse] =
    useState<TxStatusResponse | null>(null);
  const chains = useAtomValue(skipChainsAtom);

  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const isMobileScreenSize = useIsMobileScreenSize();
  const { transactionDetails: transactionDetailsFromUrlParams } =
    useTransactionHistoryItemFromUrlParams();
  const [transactionStatuses, setTransactionStatuses] = useState<
    TxStatusResponse[]
  >([]);
  const [errorDetails, setErrorDetails] = useState<{
    errorMessage: ErrorMessages;
    error: ErrorWithCodeAndDetails;
  }>();
  const [cancelStatusPolling, setCancelStatusPolling] = useState<{promise: Promise<TxStatusResponse>, cancel: () => void}[]>([]);

  const uniqueTransfers = useMemo(() => {
    const seen = new Set<string>();
    const transfers: TransferEventCardProps[] = [];

    const transferAssetReleaseChainId = transactionStatusResponse?.transferAssetRelease?.chainId;
    const transferAssetReleaseIndex = 
      transferEvents.findLastIndex(event => 
        event.fromChainId === transferAssetReleaseChainId || 
        event.toChainId === transferAssetReleaseChainId
      );

    const getStep = (index: number, fromOrTo: "from" | "to") => {
      if (index === 0 && fromOrTo === "from") return "Origin";
      if (index === transferEvents.length - 1 && fromOrTo === "to")
        return "Destination";
      return "Routed";
    };

    transferEvents.forEach((event, index) => {
      const addChainIfUnique = (
        chainId: string | undefined,
        explorerLink: string | undefined,
        fromOrTo: "from" | "to"
      ) => {

        const assetMatches = operations[index]?.denom === transactionStatusResponse?.transferAssetRelease?.denom && operations[index]?.chainId === transactionStatusResponse?.transferAssetRelease?.chainId;

        const getTransferAssetRelease = () => {
          if (!transactionStatusResponse?.transferAssetRelease?.released) return;
          if (assetMatches) {
            return transactionStatusResponse?.transferAssetRelease;
          }
          if (transferAssetReleaseIndex === index && transferAssetReleaseChainId === chainId) {
            return transactionStatusResponse?.transferAssetRelease;
          }
        }

        if (chainId && !seen.has(chainId)) {
          seen.add(chainId);
          transfers.push({
            chainId,
            explorerLink: explorerLink ?? "",
            transferType: event.transferType ?? "",
            status: event.status,
            step: getStep(index, fromOrTo),
            durationInMs: event.durationInMs ?? 0,
            index,
            transferAssetRelease: getTransferAssetRelease(),
          });
        }
      };

      addChainIfUnique(event.fromChainId, event.fromExplorerLink, "from");
      addChainIfUnique(event.toChainId, event.toExplorerLink, "to");
    });

    return transfers;
  }, [operations, transactionStatusResponse?.transferAssetRelease, transferEvents]);

  useEffect(() => {
    setSkipClientConfig(defaultSkipClientConfig);
    setOnlyTestnets(false);
  }, [setSkipClientConfig, setOnlyTestnets]);

  const getTxStatus = useCallback(
    async (transactionDetails: TransactionDetailsType[] = []) => {
      if (cancelStatusPolling.length > 0) {
        cancelStatusPolling.forEach(response => response.cancel());
        setCancelStatusPolling([]);
      }

      const txsToQuery = transactionDetails?.filter(
        (tx) => tx.txHash !== undefined && tx.chainId !== undefined
      );

      const responses = txsToQuery?.map((tx, index) =>
        waitForTransactionWithCancel({
          txHash: tx.txHash ?? "",
          chainId: tx.chainId ?? "",
          doNotTrack: true,
          onStatusUpdated: (status) => {
            setTransactionStatuses((prev) => {
              const newStatuses = [...prev];
              newStatuses[index] = status;

              const allTransferEvents =
                getTransferEventsFromTxStatusResponse(newStatuses);
              setTransferEvents(allTransferEvents);

              setTransactionStatusResponse(newStatuses[0]);

              return newStatuses;
            });
          },
          onError: (error) => {
            const errorWithCodeAndDetails = error as ErrorWithCodeAndDetails;
            if (error.message === "tx not found") {
              setErrorDetails({
                errorMessage: ErrorMessages.TRANSACTION_NOT_FOUND,
                error: errorWithCodeAndDetails,
              });
            } else {
              setErrorDetails({
                errorMessage: ErrorMessages.TRANSACTION_ERROR,
                error: errorWithCodeAndDetails,
              });
            }
          },
        })
      ) || [];

      setCancelStatusPolling(responses);
    },
    [cancelStatusPolling]
  );

  const resetState = useCallback(() => {
    cancelStatusPolling.forEach(response => response.cancel());
    setCancelStatusPolling([]);
    
    setTxHashes(null);
    setChainIds(null);
    setTxHash("");
    setChainId("");
    
    setTransactionStatuses([]);
    setTransferEvents([]);
    setErrorDetails(undefined);
    setTransactionStatusResponse(null);

  }, [cancelStatusPolling, setTxHashes, setChainIds]);

  const onSearch = useCallback((_txhash?: string, _chainId?:string) => {
    setTransactionStatuses([]);
    setTransferEvents([]);
    setErrorDetails(undefined);
    setTransactionStatusResponse(null);
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
      getTxStatus([{ txHash: hash, chainId: id }]);
    }

  }, [txHash, chainId, transactionDetailsFromUrlParams, setTxHashes, setChainIds, setData, getTxStatus]);

  useEffect(() => {
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
          
          transactionDetails.push({ txHash, chainId: nextChainId });
          nextChainId = response?.transferAssetRelease?.chainId || "";
        }
      }

      if (txHashes.length > 1) {
        calculateMissingChainIds().then(() => {
          getTxStatus(transactionDetails);
        });
      } else {
        transactionDetails.push({ txHash: txHashes[0], chainId: chainIds[0] });
        getTxStatus(transactionDetails);
      }

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transactionDetails = useMemo(() => {
    const chainIds = uniqueTransfers?.map((event) => event.chainId);

    return {
      txHash: transferEvents?.[0]?.fromTxHash ?? "",
      state: transactionStatusResponse?.state,
      chainIds,
    };
  }, [uniqueTransfers, transferEvents, transactionStatusResponse?.state]);

  const showRawDataModal = useCallback(() => {
    if (transactionStatuses.length > 0) {
      NiceModal.show(ExplorerModals.ViewRawDataModal, {
        data: JSON.stringify(Array.from(transactionStatuses.values()), null, 2),
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
      });
    }
  }, [errorDetails, transactionStatuses]);

  const onReindex = async () => {
    try {
      await fetch('https://api.skip.build/v2/tx/retry_track', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_hash: txHash,
          chain_id: chainId,
        }),
      });
      onSearch();
    } catch (error) {
      console.error(error);
    }
  }

  const isTop = useMemo(() => {
    return (
      Boolean(
        txHashes && txHashes.length > 0 && chainIds && chainIds.length > 0
      ) || Boolean(data)
    );
  }, [chainIds, data, txHashes]);

  const isLessThan1024 = useIsMobileScreenSize(1024);
  const isSearchAModal = useMemo(() => {
    return Boolean(isTop && isLessThan1024);
  }, [isTop, isLessThan1024]);

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
      />

      { uniqueTransfers.length > 0 ? (
        <Row
          gap={16}
          flexDirection={isMobileScreenSize ? "column" : "row"}
          align={isMobileScreenSize ? "center" : "flex-start"}
        >
          <StyledContentContainers>
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
            
            {showTokenDetails ? (
              <TokenDetails />
            ) : (
              <TransactionDetails {...transactionDetails} />
            )}
          </StyledContentContainers>
          <StyledContentContainers align="center" justify="center">
            <Row width="100%" justify="flex-end">
              <GhostButton gap={5} onClick={showRawDataModal}>
                View raw data <HamburgerIcon />
              </GhostButton>
            </Row>
            <Spacer height={10} />
            {uniqueTransfers.map((transfer) => (
              <>
                {transfer.step !== "Origin" && (
                  <Bridge
                    transferType={transfer.transferType}
                    durationInMs={transfer.durationInMs}
                  />
                )}
                <ErrorBoundary
                  key={transfer.chainId}
                  fallback={
                    <ErrorCard
                      errorMessage={ErrorMessages.TRANSFER_EVENT_ERROR}
                      padding="20px 45px"
                      onRetry={() => onSearch()}
                    />
                  }
                >
                  <TransferEventCard
                    {...transfer}
                    state={transactionStatusResponse?.state}
                    onReindex={onReindex}
                  />
                </ErrorBoundary>
              </>
            ))}
          </StyledContentContainers>
        </Row>
      ) : errorDetails ? (
        <Column width={355} align="flex-end">
          <GhostButton gap={5} onClick={showRawDataModal}>
            View raw data <HamburgerIcon />
          </GhostButton>
          <ErrorCard
            errorMessage={errorDetails.errorMessage}
            onRetry={() => onSearch()}
          />
        </Column>
      ) : null}
    </Column>
  );
}

const StyledContentContainers = styled(Column)`
  width: calc(100vw - 16px);
  @media (min-width: 767px) {
    width: 355px;
  }
`;

const StyledColumn = styled(Column)`
  gap: 10px;
`;
