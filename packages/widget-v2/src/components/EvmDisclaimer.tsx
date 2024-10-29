import { skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { SmallText } from "./Typography";
import { ClientOperation } from "@/utils/clientType";

export const EvmDisclaimer = ({ operations }: { operations?: ClientOperation[] } = {}) => {
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);

  const usesEvmInOperations = useMemo(() => {
    return operations?.find(
      (operation) => {
        const chainTypeIn = chains?.find(chain => chain.chainID === operation.fromChainID)?.chainType;
        const chainTypeOut = chains?.find(chain => chain.chainID === operation.toChainID)?.chainType;
        return chainTypeIn === "evm" || chainTypeOut === "evm";
      }
    );
  }, [chains, operations]);

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
  background-color: ${({ theme }) => theme.warning.background};
`;
