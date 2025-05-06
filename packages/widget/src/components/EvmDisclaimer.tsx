import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { SmallText } from "./Typography";
import { RouteResponse } from "@skip-go/client";

export const EvmDisclaimer = ({ route }: { route?: RouteResponse } = {}) => {
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);

  const usesEvmInOperations = useMemo(() => {
    return route?.requiredChainAddresses?.find((chainId) => {
      const chainType = chains?.find((chain) => chain.chainId === chainId)?.chainType;
      return chainType === "evm";
    });
  }, [chains, route?.requiredChainAddresses]);

  if (usesEvmInOperations) {
    return (
      <StyledEvmWarningMessage>
        <SmallText color={theme.warning.text}>
          This swap contains at least one EVM chain, so it might take longer.
          <br /> Read more about common finality times.
        </SmallText>
      </StyledEvmWarningMessage>
    );
  }
};

const StyledEvmWarningMessage = styled.div`
  padding: 12px;
  border-radius: 5px;
  background: ${({ theme }) => theme.warning.background};
`;
