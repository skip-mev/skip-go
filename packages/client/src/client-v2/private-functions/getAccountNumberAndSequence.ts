import { StargateClient } from "@cosmjs/stargate/build/stargateclient";
import { getRpcEndpointForChain } from "./getRpcEndpointForChain";
import { ClientState } from "../state";
import { accountParser } from "src/registry";
import { createRequest } from "../utils/generateApi";

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
  const endpoint = await getRpcEndpointForChain(chainId);

  const response = await createRequest<object, AccountResponse>({
    path: `${endpoint}/cosmos/auth/v1beta1/accounts/${address}`,
    method: "get",
  }).request();

  let sequence = 0;
  let accountNumber = 0;
  if (response.account.baseAccount) {
    sequence = response.account.baseAccount.sequence as number;
    accountNumber = response.account.baseAccount.accountNumber as number;
  } else {
    sequence = response.account.sequence as number;
    accountNumber = response.account.accountNumber as number;
  }
  return {
    accountNumber,
    sequence,
  };
};
