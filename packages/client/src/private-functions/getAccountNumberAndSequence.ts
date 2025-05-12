import { StargateClient } from "@cosmjs/stargate/build/stargateclient";
import { getRpcEndpointForChain } from "./getRpcEndpointForChain";
import { ClientState } from "../state/clientState";
import { accountParser } from "src/registry";
import { createRequestClient } from "../utils/generateApi";
import { getRestEndpointForChain } from "./getRestEndpointForChain";
import { toCamel } from "src/utils/convert";

export const getAccountNumberAndSequence = async (address: string, chainId: string) => {
  if (chainId.includes("dymension")) {
    return getAccountNumberAndSequenceFromDymension(address, chainId);
  }
  const endpoint = await getRpcEndpointForChain(chainId);
  const client =
    ClientState.signingStargateClientByChainId[chainId] ??
    (await StargateClient.connect(endpoint, {
      accountParser,
    }));
  const account = await client.getAccount(address);
  if (!account) {
    throw new Error("getAccountNumberAndSequence: failed to retrieve account");
  }

  client.disconnect();

  return {
    accountNumber: account.accountNumber,
    sequence: account.sequence,
  };
};

type Account = {
  address: string;
  pubKey?: string;
  accountNumber: number;
  sequence: number;
};

type AccountResponse = {
  account: Account & {
    baseAccount: Account;
  };
};

const getAccountNumberAndSequenceFromDymension = async (address: string, chainId: string) => {
  const endpoint = await getRestEndpointForChain(chainId);

  const jsonResponse: AccountResponse = await createRequestClient({
    baseUrl: `${endpoint}/cosmos/auth/v1beta1/accounts/${address}`,
  }).get();

  const response = toCamel(jsonResponse);

  let sequence = 0;
  let accountNumber = 0;
  if (response.account.baseAccount) {
    sequence = response.account.baseAccount.sequence;
    accountNumber = response.account.baseAccount.accountNumber;
  } else {
    sequence = response.account.sequence;
    accountNumber = response.account.accountNumber;
  }

  return {
    accountNumber,
    sequence,
  };
};
