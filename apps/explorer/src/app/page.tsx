"use client";
import React, { useCallback } from "react";
import { Column, Row } from "@/components/Layout";
import {
  getTransferEventsFromTxStatusResponse,
  ClientTransferEvent,
  TxStatusResponse,
  TransactionDetails as TransactionDetailsType,
  waitForTransaction,
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
import { GhostButton } from "@/components/Button";
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
  const [, setData] = useQueryState("data");
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
  const { transactionDetails: transactionDetailsFromUrlParams } = useTransactionHistoryItemFromUrlParams();
  const [transactionStatuses, setTransactionStatuses] = useState<TxStatusResponse[]>([]);

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
            txHash: event[`${fromOrTo}TxHash`] ?? "",
            durationInMs: event.durationInMs ?? 0,
            index,
          });
        }
      };

      addChainIfUnique(event.fromChainId, event.fromExplorerLink, "from");
      addChainIfUnique(event.toChainId, event.toExplorerLink, "to");
    });

    console.log(transfers);
    return transfers;
  }, [transferEvents]);

  useEffect(() => {
    setSkipClientConfig(defaultSkipClientConfig);
    setOnlyTestnets(false);
  }, [setSkipClientConfig, setOnlyTestnets]);
  
  const getTxStatus = useCallback(async (transactionDetails: TransactionDetailsType[] = []) => {
    const txsToQuery = transactionDetails?.filter((tx) => tx.txHash !== undefined && tx.chainId !== undefined);
    
    txsToQuery?.forEach((tx, index) => waitForTransaction({
      txHash: tx.txHash ?? "",
      chainId: tx.chainId ?? "",
      doNotTrack: true,
      onStatusUpdated: (status) => {
        setTransactionStatuses(prev => {
          const newStatuses = [...prev];
          newStatuses[index] = status;
          
          const allTransferEvents = getTransferEventsFromTxStatusResponse(newStatuses);
          setTransferEvents(allTransferEvents);
          
          setTransactionStatusResponse(newStatuses[0]);
          
          return newStatuses;
        });
      },
      onError: (error) => {
        console.log("onError");
        console.error(error);
      }
    }))
  }, []);

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
  }, [txHashes, chainIds, transactionDetailsFromUrlParams, getTxStatus]);

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

  return (
    <Column gap={10}>
      <Logo />
      <TopRightComponent />

      <Row justify="center" gap={10}>
        <TxHashInput
          size="small"
          value={txHash || ""}
          onChange={(v) => setTxHash(v)}
        />
        <ChainSelector
          size="small"
          onClick={() => {
            NiceModal.show(Modals.AssetAndChainSelectorModal, {
              context: "source",
              onSelect: (asset: ClientAsset | null) => {
                setChainId(asset?.chainId || "");
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
        <SearchButton
          size="small"
          onClick={() => {
            if (txHash && chainId) {
              setTxHashes([txHash]);
              setChainIds([chainId]);
              if (
                txHash !== transactionDetailsFromUrlParams?.[0]?.txHash ||
                chainId !== transactionDetailsFromUrlParams?.[0]?.chainId
              ) {
                setData(null);
              }
            }
          }}
        />
      </Row>
      {uniqueTransfers.length > 0 && (
        <>
          <Row gap={16}>
            <Column align="flex-end" width={355}>
              <GhostButton
                gap={5}
                align="center"
                justify="center"
                onClick={() => setShowTokenDetails(!showTokenDetails)}
              >
                {showTokenDetails ? "Close" : "View token details"}{" "}
                {!showTokenDetails && <CoinsIcon />}
              </GhostButton>
            </Column>
            <Column align="flex-end" width={355}>
              <GhostButton
                gap={5}
                onClick={() => {
                  NiceModal.show(ExplorerModals.ViewRawDataModal, {
                    data: JSON.stringify(Array.from(transactionStatuses.values()), null, 2),
                    onClose: () => {
                      console.log("ViewRawDataModal closed");
                    },
                  });
                }}
              >
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
            <Column width={355}>
              {uniqueTransfers.map((transfer) => (
                <TransferEventCard
                  key={transfer.chainId}
                  chainId={transfer.chainId}
                  explorerLink={transfer.explorerLink}
                  transferType={transfer.transferType}
                  status={transfer.status}
                  step={transfer.step}
                  durationInMs={transfer.durationInMs}
                  index={transfer.index}
                />
              ))}
            </Column>
          </Row>
        </>
      )}
    </Column>
  );
}
