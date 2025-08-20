"use client";
import React, { useCallback } from "react";
import { Column, Row } from "@/components/Layout";
import {
  getTransferEventsFromTxStatusResponse,
  ClientTransferEvent,
  TxStatusResponse,
  TransactionDetails as TransactionDetailsType,
  waitForTransactionWithCancel,
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
  ClientAsset,
  skipChainsAtom,
} from "@/state/skipClient";
import { uniqueAssetsBySymbolAtom } from "../state/uniqueAssetsBySymbol";
import { useSetAtom, useAtomValue } from "@/jotai";
import { TransactionDetails } from "../components/TransactionDetails";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { NiceModal, Modals } from "@/nice-modal";
import { Button, GhostButton } from "@/components/Button";
import { HamburgerIcon } from "@/icons/HamburgerIcon";
import { TokenDetails } from "../components/TokenDetails";
import { ExplorerModals } from "../constants/modal";
import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";
import { TxHashInput } from "../components/TxHashInput";
import { ChainSelector } from "../components/ChainSelector";
import { SearchButton } from "../components/SearchButton";
import { useTransactionHistoryItemFromUrlParams } from "../hooks/useTransactionHistoryItemFromUrlParams";
import { CoinsIcon } from "../icons/CoinsIcon";
import { Logo, TopRightComponent } from "../components/TopNav";
import { ErrorCard, ErrorMessages } from "../components/ErrorCard";
import { ErrorBoundary } from "react-error-boundary";
import { Bridge } from "../components/Bridge";
import { styled } from "@/styled-components";
import Link from "next/link";

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
  const [transactionStatusResponse, setTransactionStatusResponse] =
    useState<TxStatusResponse | null>(null);
  const chains = useAtomValue(skipChainsAtom);

  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const uniqueAssetsBySymbol = useAtomValue(uniqueAssetsBySymbolAtom);
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
          });
        }
      };

      addChainIfUnique(event.fromChainId, event.fromExplorerLink, "from");
      addChainIfUnique(event.toChainId, event.toExplorerLink, "to");
    });

    return transfers;
  }, [transferEvents]);

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

  const onSearch = useCallback(() => {
    setTransactionStatuses([]);
    setTransferEvents([]);
    setErrorDetails(undefined);
    setTransactionStatusResponse(null);

    if (txHash && chainId) {
      setTxHashes([txHash]);
      setChainIds([chainId]);
    }

    if (
      txHash !== transactionDetailsFromUrlParams?.[0]?.txHash ||
      chainId !== transactionDetailsFromUrlParams?.[0]?.chainId
    ) {
      setData(null);
    }

    if (txHash && chainId) {
      getTxStatus([{ txHash, chainId }]);
    }

  }, [txHash, chainId, transactionDetailsFromUrlParams, getTxStatus, setTxHashes, setChainIds, setData]);

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
      getTxStatus(
        txHashes.map((txHash, index) => ({ txHash, chainId: chainIds[index] }))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedChain = useMemo(() => {
    if (!chainId) return null;
    return chains.data?.find((chain) => chain.chainId === chainId) || null;
  }, [chains.data, chainId]);

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
    <>
      <Logo />
      <TopRightComponent />
      {!isSearchAModal ? (
        <SearchWrapper isTop={isTop}>
          <TxHashInput
            size={isTop ? "small" : "normal"}
            value={txHash || ""}
            onChange={(v) => setTxHash(v)}
            onSearch={() => {
              if (txHash && chainId) {
                onSearch();
              }
            }}
            openModal={() => {
              NiceModal.show(Modals.AssetAndChainSelectorModal, {
                context: "source",
                onSelect: (asset: ClientAsset | null) => {
                  setChainId(asset?.chainId || "");

                  onSearch();
                  NiceModal.hide(Modals.AssetAndChainSelectorModal);
                },
                overrideSelectedGroup: {
                  assets: uniqueAssetsBySymbol,
                },
                selectChain: true,
              });
            }}
          />
          <ChainSelector
            size={isTop ? "small" : "normal"}
            onClick={() => {
              NiceModal.show(Modals.AssetAndChainSelectorModal, {
                context: "source",
                onSelect: (asset: ClientAsset | null) => {
                  setChainId(asset?.chainId || "");
                  if (txHash) {
                    onSearch();
                  }
                  NiceModal.hide(Modals.AssetAndChainSelectorModal);
                },
                overrideSelectedGroup: {
                  assets: uniqueAssetsBySymbol,
                },
                selectChain: true,
              });
            }}
            selectedChain={selectedChain}
          />
          <SearchButton size={isTop ? "small" : "normal"} onClick={onSearch} />
        </SearchWrapper>
      ) : (
        <SearchTopRight>
          <Link href="/">
            <SearchButton size="small" iconOnly />
          </Link>
        </SearchTopRight>
      )}

      { uniqueTransfers.length > 0 ? (
        <StyledColumn>
          <Row gap={16}>
            <Column align="flex-end" width={355}>
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
            </Column>
            <Column align="flex-end" width={355}>
              <GhostButton gap={5} onClick={showRawDataModal}>
                View raw data <HamburgerIcon />
              </GhostButton>
            </Column>
          </Row>
          <Row
            gap={16}
            flexDirection={isMobileScreenSize ? "column" : "row"}
            align={isMobileScreenSize ? "center" : "flex-start"}
          >
            <Column width={355}>
              {showTokenDetails ? (
                <TokenDetails />
              ) : (
                <TransactionDetails {...transactionDetails} />
              )}
            </Column>
            <Column width={355} align="center" justify="center">
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
                        onRetry={onSearch}
                      />
                    }
                  >
                    <TransferEventCard
                      chainId={transfer.chainId}
                      explorerLink={transfer.explorerLink}
                      transferType={transfer.transferType}
                      status={transfer.status}
                      state={transactionStatusResponse?.state}
                      step={transfer.step}
                      index={transfer.index}
                      onReindex={onReindex}
                    />
                  </ErrorBoundary>
                </>
              ))}
            </Column>
          </Row>
        </StyledColumn>
      ) : errorDetails ? (
        <Column width={355} align="flex-end">
          <GhostButton gap={5} onClick={showRawDataModal}>
            View raw data <HamburgerIcon />
          </GhostButton>
          <ErrorCard
            errorMessage={errorDetails.errorMessage}
            onRetry={onSearch}
          />
        </Column>
      ) : null}
    </>
  );
}

const SearchTopRight = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  @media (min-width: 1023px) {
    display: none;
  }
`;

const StyledColumn = styled(Column)`
  margin-top: 180px;
  gap: 10px;
`;

const SearchWrapper = styled.div<{ isTop: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  position: fixed;
  max-width: 970px;
  flex-direction: column;
  padding: 0px 8px;
  width: ${(props) => (props.isTop ? "600px" : "100%")};
  left: 50%;
  @media (min-width: 1024px) {
    flex-direction: row;
    width: ${(props) => (props.isTop ? "600px" : "100%")};
    left: ${(props) => (props.isTop ? "54%" : "50%")};
  }
  @media (min-width: 1440px) {
    width: 100%;
    left: ${(props) => (props.isTop ? "54%" : "50%")};
  }
  @media (min-width: 1500px) {
    width: 100%;
    left: 50%;
  }

  position: fixed;
  top: ${(props) => (props.isTop ? "48px" : "50%")};
  transform: translate(-50%, -50%);

  transition: all 0.2s ease-in-out;
`;
