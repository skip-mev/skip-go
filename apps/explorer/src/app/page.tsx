"use client";
import React from "react";
import { ToggleThemeButton } from "./template";
import { SmallTextButton } from '@/components/Typography';
import { Column, Row } from "@/components/Layout";
import { transactionStatus, getTransferEventsFromTxStatusResponse, ClientTransferEvent, TxStatusResponse } from "@skip-go/client";
import { useEffect, useState, useMemo } from "react";
import { TransferEventCard, TransferEventCardProps } from "../components/TransferEventCard";
import { defaultSkipClientConfig, skipClientConfigAtom, onlyTestnetsAtom, ClientAsset } from "@/state/skipClient";
import { uniqueAssetsBySymbolAtom } from "../state/uniqueAssetsBySymbol";
import { useSetAtom, useAtomValue } from "@/jotai";
import { TransactionDetails } from "../components/TransactionDetails";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { NiceModal, Modals } from "@/nice-modal";
import { GhostButton } from "@/components/Button";
import { HamburgerIcon } from "@/icons/HamburgerIcon";
import { ExplorerModals } from "../constants/modal";

export default function Home() {
  const [txHash, setTxHash] = useState("BA47144AF79143EECEDA00BC758FA52D8B124934C7051A78B20DAC9DC42C1BCB");
  const [chainId, setChainId] = useState("osmosis-1");
  const [transferEvents, setTransferEvents] = useState<ClientTransferEvent[]>([]);
  const [transactionStatusResponse, setTransactionStatusResponse] = useState<TxStatusResponse | null>(null);
  const [rawData, setRawData] = useState<string>("");

  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const uniqueAssetsBySymbol = useAtomValue(uniqueAssetsBySymbolAtom);
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
    setRawData(JSON.stringify(response, null, 2));
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
    <Column gap={10}>
      <ToggleThemeButton />

      <Row justify="center" gap={10} >
        <button onClick={() => {
          NiceModal.show(Modals.AssetAndChainSelectorModal, {
            context: "source",
            onSelect: (asset: ClientAsset | null) => {
              console.log("chain id selected:", asset?.chainId);
              NiceModal.hide(Modals.AssetAndChainSelectorModal);
            },
            overrideSelectedGroup: {
              assets: uniqueAssetsBySymbol,
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
          <>
            <Row gap={16}>
              <Column align="flex-end" width={355}>
                <GhostButton onClick={() => {}}>
                  View token details
                </GhostButton>
              </Column>
              <Column align="flex-end" width={355}>
                <GhostButton gap={5} onClick={() => {
                  NiceModal.show(ExplorerModals.ViewRawDataModal, {
                    data: rawData,
                    onClose: () => {
                      console.log("ViewRawDataModal closed");
                    },
                  });
                }}>
                  View raw data <HamburgerIcon />
                </GhostButton>
              </Column>
            </Row>
            <Row gap={16} flexDirection={isMobileScreenSize ? "column" : "row"} align={isMobileScreenSize ? "center" : "flex-start"}>
              <Column width={355}>
                <TransactionDetails {...transactionDetails} />
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
                  />
                ))}
              </Column>
            </Row>
          </>
        )
      }

    </Column>
  );
}
