"use client";
import React from "react";
import { ToggleThemeButton } from "./template";
import { SmallTextButton } from '@/components/Typography';
import { Column, Row } from "@/components/Layout";
import { transactionStatus, getTransferEventsFromTxStatusResponse, ClientTransferEvent, TxStatusResponse } from "@skip-go/client";
import { useEffect, useState, useMemo } from "react";
import { TransferEventCard, TransferEventCardProps } from "../components/TransferEventCard";
import { defaultSkipClientConfig, skipClientConfigAtom, onlyTestnetsAtom, ClientAsset } from "@/state/skipClient";
import { useSetAtom } from "jotai";
import { TransactionDetails } from "../components/TransactionDetails";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { NiceModal, Modals } from "@/nice-modal";

export default function Home() {
  const [txHash, setTxHash] = useState("BA47144AF79143EECEDA00BC758FA52D8B124934C7051A78B20DAC9DC42C1BCB");
  const [chainId, setChainId] = useState("osmosis-1");
  const [transferEvents, setTransferEvents] = useState<ClientTransferEvent[]>([]);
  const [transactionStatusResponse, setTransactionStatusResponse] = useState<TxStatusResponse | null>(null);
  
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const isMobileScreenSize = useIsMobileScreenSize();

  const uniqueTransfers = useMemo(() => {
    const seen = new Set<string>();
    const transfers: TransferEventCardProps[] = [];

    const getStep = (index: number, fromOrTo: "from" | "to") => {
      if (index === 0 && fromOrTo === "from") return "Origin";
      if (index === transferEvents.length - 1 && fromOrTo === "to") return "Destination";
      return "Routed";
    }

    transferEvents.forEach((event, index) => {
      const addChainIfUnique = (chainId: string | undefined, explorerLink: string | undefined, fromOrTo: "from" | "to") => {
        if (chainId && !seen.has(chainId)) {
          seen.add(chainId);
          transfers.push({
            chainId,
            explorerLink: explorerLink ?? "",
            transferType: event.transferType ?? "",
            status: event.status ?? "",
            step: getStep(index, fromOrTo),
            txHash: event[`${fromOrTo}TxHash`] ?? "",
            durationInMs: event.durationInMs ?? 0,
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
  
  const getTxStatus = async () => {
    const response = await transactionStatus({
      txHash,
      chainId,
    })
    const transferEvents = getTransferEventsFromTxStatusResponse([response]);

    setTransactionStatusResponse(response);
    setTransferEvents(transferEvents);
    console.log(response);
    console.log(transferEvents);
  }

  const transactionDetails = useMemo(() => {
    const chainIds = uniqueTransfers?.map((event) => event.chainId);
    
    return {
      txHash: transferEvents?.[0]?.fromTxHash ?? "",
      state: transactionStatusResponse?.state,
      chainIds,
    }
  }, [uniqueTransfers, transferEvents, transactionStatusResponse?.state]);

  return (
    <Column id="test"gap={10}>
      <ToggleThemeButton />

      <Row justify="center" gap={10} >
        <button onClick={() => {
          NiceModal.show(Modals.AssetAndChainSelectorModal, {
            context: "source",
            onSelect: (asset: ClientAsset | null) => {
              console.log("Asset selected:", asset);
              NiceModal.hide(Modals.AssetAndChainSelectorModal);
            },
            selectChain: true,
          });
        }}>open modal</button>
        
        <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="tx hash"/>
        <input type="text" value={chainId} onChange={(e) => setChainId(e.target.value)} placeholder="chain id"/>
        <SmallTextButton onClick={getTxStatus}>get tx info</SmallTextButton>
      </Row>
      {
        uniqueTransfers.length > 0 && (
          <Row gap={16} flexDirection={isMobileScreenSize ? "column" : "row"} align={isMobileScreenSize ? "center" : "flex-start"}>
            <TransactionDetails {...transactionDetails} />
            <Column>
              {uniqueTransfers.map((transfer) => (
                <TransferEventCard
                  key={transfer.chainId}
                  chainId={transfer.chainId}
                  explorerLink={transfer.explorerLink}
                  transferType={transfer.transferType}
                  status={transfer.status}
                  step={transfer.step}
                  durationInMs={transfer.durationInMs}
                />
              ))}
            </Column>
          </Row>
        )
      }
      
    </Column>
  );
}
