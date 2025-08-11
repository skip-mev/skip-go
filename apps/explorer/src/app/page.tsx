"use client";
import { ToggleThemeButton } from "./template";
import { SmallTextButton } from '@/components/Typography';
import { Column, Row } from "@/components/Layout";
import { transactionStatus, getTransferEventsFromTxStatusResponse, ClientTransferEvent } from "@skip-go/client";
import { useEffect, useState } from "react";
import { TransferEventCard } from "../components/TransferEventCard";
import { defaultSkipClientConfig, skipClientConfigAtom, onlyTestnetsAtom } from "@/state/skipClient";
import { useSetAtom } from "jotai";
import { prodApiUrl } from "@/constants/skipClientDefault";

export default function Home() {
  const [txHash, setTxHash] = useState("BA47144AF79143EECEDA00BC758FA52D8B124934C7051A78B20DAC9DC42C1BCB");
  const [chainId, setChainId] = useState("osmosis-1");
  const [transferEvents, setTransferEvents] = useState<ClientTransferEvent[]>([]);
  
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);

  useEffect(() => {
    setSkipClientConfig({
      apiUrl: prodApiUrl,
      endpointOptions: defaultSkipClientConfig.endpointOptions,
    });
    setOnlyTestnets(false);
  }, [setSkipClientConfig, setOnlyTestnets]);
  
  const getTxStatus = async () => {
    const response = await transactionStatus({
      txHash,
      chainId,
    })
    const transferEvents = getTransferEventsFromTxStatusResponse([response]);

    setTransferEvents(transferEvents);
    console.log(response);
    console.log(transferEvents);
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
        {
          transferEvents.map((event) => (
            <TransferEventCard key={event.fromChainId} transferEvent={event} />
          ))
        }
        {/* <Container padding={15} width={354} height={144} borderRadius={16}>
          <Row align="center" justify="space-between">
            <Badge> Routed </Badge>
            <Badge> Completed </Badge>
          </Row>
        </Container>

        <Container padding={15} width={354} height={144} borderRadius={16}>
          <Row align="center" justify="space-between">
            <Badge> Destination </Badge>
            <Badge variant="success"> Completed </Badge>
          </Row>
        </Container>

        <Container padding={15} width={354} height={144} borderRadius={16}>
          <Row align="center" justify="space-between">
            <Badge> Destination </Badge>
            <Badge variant="error"> Failed </Badge>
          </Row>
        </Container> */}
      </Column>
    </Column>
  );
}
