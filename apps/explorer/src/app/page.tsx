"use client";
import React from "react";
import { ToggleThemeButton } from "./template";
import { SmallTextButton } from '@/components/Typography';
import { Column, Row } from "@/components/Layout";
import { transactionStatus, getTransferEventsFromTxStatusResponse, ClientTransferEvent } from "@skip-go/client";
import { useEffect, useState, useMemo } from "react";
import { Step, TransferEventCard, TransferEventCardProps } from "../components/TransferEventCard";
import { defaultSkipClientConfig, skipClientConfigAtom, onlyTestnetsAtom } from "@/state/skipClient";
import { useSetAtom } from "jotai";

export default function Home() {
  const [txHash, setTxHash] = useState("BA47144AF79143EECEDA00BC758FA52D8B124934C7051A78B20DAC9DC42C1BCB");
  const [chainId, setChainId] = useState("osmosis-1");
  const [transferEvents, setTransferEvents] = useState<ClientTransferEvent[]>([]);
  
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);

  const uniqueTransfers = useMemo(() => {
    const seen = new Set<string>();
    const transfers: TransferEventCardProps[] = [];

    const getStep = (index: number, fromOrTo: "from" | "to") => {
      if (index === 0 && fromOrTo === "from") return "Origin";
      if (index === transferEvents.length - 1 && fromOrTo === "to") return "Destination";
      return "Routed";
    }

    transferEvents.forEach((event, index) => {
      const addChainIfUnique = (chainId: string | undefined, explorerLink: string | undefined, step: Step) => {
        if (chainId && !seen.has(chainId)) {
          seen.add(chainId);
          transfers.push({
            chainId,
            explorerLink: explorerLink ?? "",
            transferType: event.transferType ?? "",
            status: event.status ?? "",
            step,
          });
        }
      };

      addChainIfUnique(event.fromChainId, event.fromExplorerLink, getStep(index, "from"));
      addChainIfUnique(event.toChainId, event.toExplorerLink, getStep(index, "to"));
    });

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

    setTransferEvents(transferEvents);
  }

  return (
    <Column>
      <ToggleThemeButton />

      <Row>
        <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="tx hash"/>
        <input type="text" value={chainId} onChange={(e) => setChainId(e.target.value)} placeholder="chain id"/>
        <SmallTextButton onClick={getTxStatus}>get tx info</SmallTextButton>
      </Row>
      
      <Column gap={10}>
        {uniqueTransfers.map((transfer) => (
          <TransferEventCard
            key={transfer.chainId}
            chainId={transfer.chainId}
            explorerLink={transfer.explorerLink}
            transferType={transfer.transferType}
            status={transfer.status}
            step={transfer.step}
          />
        ))}
      </Column>
    </Column>
  );
}
