/* eslint-disable prefer-const */
import { makeSignDoc as makeSignDocAmino } from "@cosmjs/amino";
import { createWasmAminoConverters } from "@cosmjs/cosmwasm-stargate";
import { fromBase64 } from "@cosmjs/encoding";
import { bech32m, bech32 } from "bech32";
import { Int53 } from "@cosmjs/math";
import { Decimal } from "@cosmjs/math";
import { makePubkeyAnyFromAccount } from "./proto-signing/pubkey";
import {
  isOfflineDirectSigner,
  makeAuthInfoBytes,
  makeSignDoc,
  OfflineDirectSigner,
  OfflineSigner,
  Registry,
  TxBodyEncodeObject,
} from "@cosmjs/proto-signing";
import {
  AminoTypes,
  calculateFee,
  createDefaultAminoConverters,
  defaultRegistryTypes,
  GasPrice,
  SignerData,
  SigningStargateClient,
  StargateClient,
  StdFee,
} from "@cosmjs/stargate";
import { BigNumber } from "bignumber.js";
import { accountParser } from "./registry";
import {
  ChainRestAuthApi,
  ChainRestTendermintApi,
} from "@injectivelabs/sdk-ts";
import {
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from "@injectivelabs/utils";
import axios from "axios";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { MsgExecute } from "./codegen/initia/move/v1/tx";

import {
  formatUnits,
  isAddress,
  maxUint256,
  publicActions,
  WalletClient,
} from "viem";

import { chains, findFirstWorkingEndpoint } from "./chains";
import {
  circleAminoConverters,
  circleProtoRegistry,
} from "./codegen/circle/client";
import {
  evmosAminoConverters,
  evmosProtoRegistry,
} from "./codegen/evmos/client";
import { erc20ABI } from "./constants/abis";
import { DEFAULT_GAS_DENOM_OVERRIDES } from "./constants/constants";
import { createTransaction } from "./injective";
import { RequestClient } from "./request-client";
import {
  getEncodeObjectFromCosmosMessage,
  getEncodeObjectFromCosmosMessageInjective,
  getCosmosGasAmountForMessage,
  getEVMGasAmountForMessage,
  simulateSvmTx,
} from "./transactions";
import * as types from "./types";
import * as clientTypes from "./client-types";
import { msgsDirectRequestToJSON } from "./types/converters";
import { Adapter } from "@solana/wallet-adapter-base";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { MsgInitiateTokenDeposit } from "./codegen/opinit/ophost/v1/tx";

export const SKIP_API_URL = "https://api.skip.build";

export const GAS_STATION_CHAIN_IDS = ["bbn-test-5", "bbn-1"];
export class SkipClient {
  protected requestClient: RequestClient;

  protected aminoTypes: AminoTypes;
  protected registry: Registry;

  protected endpointOptions: {
    endpoints?: Record<string, clientTypes.EndpointOptions>;
    getRpcEndpointForChain?: (chainID: string) => Promise<string>;
    getRestEndpointForChain?: (chainID: string) => Promise<string>;
  };
  getCosmosSigner?: clientTypes.SignerGetters["getCosmosSigner"];
  getEVMSigner?: clientTypes.SignerGetters["getEVMSigner"];
  getSVMSigner?: clientTypes.SignerGetters["getSVMSigner"];
  chainIDsToAffiliates?: clientTypes.SkipClientOptions["chainIDsToAffiliates"];
  cumulativeAffiliateFeeBPS?: string = "0";

  private clientOptions: clientTypes.SkipClientOptions;
  private skipChains?: types.Chain[];
  private skipAssets?: Record<string, types.Asset[]>;
  private skipBalances?: types.BalanceResponse;
  private signingStargateClientByChainId: Record<
    string,
    SigningStargateClient
  > = {};
  private validateGasResults: clientTypes.ValidateGasResult[] | undefined;

  constructor(options: clientTypes.SkipClientOptions = {}) {
    this.clientOptions = options;
    this.requestClient = new RequestClient({
      baseURL: options.apiURL || SKIP_API_URL,
      apiKey: options.apiKey,
    });

    this.aminoTypes = new AminoTypes({
      ...createDefaultAminoConverters(),
      ...createWasmAminoConverters(),
      ...circleAminoConverters,
      ...evmosAminoConverters,
      ...(options.aminoTypes ?? {}),
    });

    this.registry = new Registry([
      ...defaultRegistryTypes,
      ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
      ["/initia.move.v1.MsgExecute", MsgExecute],
      ["/opinit.ophost.v1.MsgInitiateTokenDeposit", MsgInitiateTokenDeposit],
      ...circleProtoRegistry,
      ...evmosProtoRegistry,
      ...(options.registryTypes ?? []),
    ]);

    this.endpointOptions = options.endpointOptions ?? {};
    this.getCosmosSigner = options.getCosmosSigner;
    this.getEVMSigner = options.getEVMSigner;
    this.getSVMSigner = options.getSVMSigner;

    if (options.chainIDsToAffiliates) {
      this.cumulativeAffiliateFeeBPS = validateChainIDsToAffiliates(
        options.chainIDsToAffiliates,
      );
      this.chainIDsToAffiliates = options.chainIDsToAffiliates;
    }
  }

  updateOptions(options: clientTypes.SkipClientOptions = {}) {
    if (
      this.clientOptions.apiURL !== options.apiURL ||
      this.clientOptions.apiKey !== options.apiKey
    ) {
      this.requestClient = new RequestClient({
        baseURL: options.apiURL || SKIP_API_URL,
        apiKey: options.apiKey,
      });
    }

    if (this.clientOptions.aminoTypes !== options.aminoTypes) {
      this.aminoTypes = new AminoTypes({
        ...createDefaultAminoConverters(),
        ...createWasmAminoConverters(),
        ...circleAminoConverters,
        ...evmosAminoConverters,
        ...(options.aminoTypes ?? {}),
      });
    }

    if (this.clientOptions.registryTypes !== options.registryTypes) {
      this.registry = new Registry([
        ...defaultRegistryTypes,
        ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
        ["/initia.move.v1.MsgExecute", MsgExecute],
        ["/opinit.ophost.v1.MsgInitiateTokenDeposit", MsgInitiateTokenDeposit],
        ...circleProtoRegistry,
        ...evmosProtoRegistry,
        ...(options.registryTypes ?? []),
      ]);
    }

    this.endpointOptions = options.endpointOptions ?? {};
    this.getCosmosSigner = options.getCosmosSigner;
    this.getEVMSigner = options.getEVMSigner;
    this.getSVMSigner = options.getSVMSigner;

    if (options.chainIDsToAffiliates) {
      this.cumulativeAffiliateFeeBPS = validateChainIDsToAffiliates(
        options.chainIDsToAffiliates,
      );
      this.chainIDsToAffiliates = options.chainIDsToAffiliates;
    }
  }

  async assets(
    options: types.AssetsRequest = {},
  ): Promise<Record<string, types.Asset[]>> {
    const response = await this.requestClient.get<{
      chain_to_assets_map: Record<string, { assets: types.AssetJSON[] }>;
    }>("/v2/fungible/assets", types.assetsRequestToJSON({ ...options }));
    const responseCamelCase = Object.entries(
      response.chain_to_assets_map,
    ).reduce(
      (acc, [chainID, { assets }]) => {
        acc[chainID] = assets.map((asset) => types.assetFromJSON(asset));
        return acc;
      },
      {} as Record<string, types.Asset[]>,
    );

    if (
      options.includeEvmAssets &&
      options.includeSvmAssets &&
      options.includeCW20Assets
    ) {
      this.skipAssets = responseCamelCase;
    }
    return responseCamelCase;
  }

  async chains(options?: types.ChainsRequest): Promise<types.Chain[]> {
    const response = await this.requestClient.get<{
      chains: types.ChainJSON[];
    }>("/v2/info/chains", types.chainsRequestToJSON({ ...options }));
    const responseCamelCase = response.chains.map((chain) =>
      types.chainFromJSON(chain),
    );
    if (options?.includeEVM && options?.includeSVM) {
      this.skipChains = responseCamelCase;
    }

    return responseCamelCase;
  }

  async assetsFromSource(
    options: types.AssetsFromSourceRequest,
  ): Promise<Record<string, types.Asset[]>> {
    const response = await this.requestClient.post<
      {
        dest_assets: Record<string, { assets: types.AssetJSON[] }>;
      },
      types.AssetsFromSourceRequestJSON
    >(
      "/v2/fungible/assets_from_source",
      types.assetsFromSourceRequestToJSON({
        ...options,
      }),
    );

    return Object.entries(response.dest_assets).reduce(
      (acc, [chainID, { assets }]) => {
        acc[chainID] = assets.map((asset) => types.assetFromJSON(asset));
        return acc;
      },
      {} as Record<string, types.Asset[]>,
    );
  }

  async assetsBetweenChains(
    options: types.AssetsBetweenChainsRequest,
  ): Promise<types.AssetBetweenChains[]> {
    const response =
      await this.requestClient.post<types.AssetsBetweenChainsResponseJSON>(
        "/v2/fungible/assets_between_chains",
        types.assetsBetweenChainsRequestToJSON(options),
      );

    return types.assetsBetweenChainsResponseFromJSON(response)
      .assetsBetweenChains;
  }

  async bridges(): Promise<types.Bridge[]> {
    const response =
      await this.requestClient.get<types.BridgesResponseJSON>(
        "/v2/info/bridges",
      );

    return types.bridgesResponseFromJSON(response).bridges;
  }

  async balances(
    request: types.BalanceRequest,
  ): Promise<types.BalanceResponse> {
    const response = await this.requestClient.post<types.BalanceResponseJSON>(
      "/v2/info/balances",
      types.balanceRequestToJSON(request),
    );
    const responseCamelCase = types.balanceResponseFromJSON(response);

    this.skipBalances = responseCamelCase;
    return types.balanceResponseFromJSON(response);
  }

  async executeRoute(options: clientTypes.ExecuteRouteOptions) {
    const { route, userAddresses, beforeMsg, afterMsg, timeoutSeconds } =
      options;

    let addressList: string[] = [];
    userAddresses.forEach((userAddress, index) => {
      const requiredChainAddress = route.requiredChainAddresses[index];

      if (requiredChainAddress === userAddress?.chainID) {
        addressList.push(userAddress.address!);
      }
    });

    if (addressList.length !== route.requiredChainAddresses.length) {
      addressList = userAddresses.map((x) => x.address);
    }

    const validLength =
      addressList.length === route.requiredChainAddresses.length ||
      addressList.length === route.chainIDs.length;

    if (!validLength) {
      raise("executeRoute error: invalid address list");
    }

    const isUserAddressesValid =
      await this.validateUserAddresses(userAddresses);

    if (!isUserAddressesValid) {
      raise("executeRoute error: invalid user addresses");
    }

    const messages = await this.messages({
      ...route,
      timeoutSeconds,
      amountOut: route.estimatedAmountOut || "0",
      addressList: addressList,
      slippageTolerancePercent: options.slippageTolerancePercent || "1",
      chainIDsToAffiliates: this.chainIDsToAffiliates,
    });

    if (beforeMsg && messages.txs.length > 0) {
      const firstTx = messages.txs[0];
      if (firstTx && "cosmosTx" in firstTx) {
        firstTx.cosmosTx.msgs.unshift(beforeMsg);
      }
    }

    if (afterMsg && messages.txs.length > 0) {
      const lastTx = messages.txs[messages.txs.length - 1];
      if (lastTx && "cosmosTx" in lastTx) {
        lastTx.cosmosTx.msgs.push(afterMsg);
      }
    }

    await this.executeTxs({ ...options, txs: messages.txs });
  }

  async executeTxs(
    options: clientTypes.ExecuteRouteOptions & { txs: types.Tx[] },
  ) {
    const {
      txs,
      onTransactionBroadcast,
      onTransactionCompleted,
      simulate = true,
      batchSimulate = true,
    } = options;
    const chainIds = txs.map((tx) => {
      if ("cosmosTx" in tx) {
        return {
          chainType: "cosmos",
          chainID: tx.cosmosTx.chainID,
        };
      }
      if ("svmTx" in tx) {
        return {
          chainType: "svm",
          chainID: tx.svmTx.chainID,
        };
      }
      return {
        chainType: "evm",
        chainID: tx.evmTx.chainID,
      };
    });

    const isGasStationSourceEVM = chainIds.find((item, i, array) => {
      return (
        GAS_STATION_CHAIN_IDS.includes(item.chainID) &&
        array[i - 1]?.chainType === "evm"
      );
    });

    this.validateGasResults = undefined;
    const validateChainIds = !batchSimulate
      ? chainIds.map((x) => x.chainID)
      : isGasStationSourceEVM
        ? GAS_STATION_CHAIN_IDS
        : [];

    await this.validateGasBalances({
      txs,
      getFallbackGasAmount: options.getFallbackGasAmount,
      getCosmosSigner: options.getCosmosSigner || this.getCosmosSigner,
      getEVMSigner: options.getEVMSigner || this.getEVMSigner,
      onValidateGasBalance: options.onValidateGasBalance,
      simulate: simulate,
      disabledChainIds: validateChainIds,
      useUnlimitedApproval: options.useUnlimitedApproval,
    });

    const validateEnabledChainIds = async (chainId: string) => {
      await this.validateGasBalances({
        txs,
        getFallbackGasAmount: options.getFallbackGasAmount,
        getCosmosSigner: options.getCosmosSigner || this.getCosmosSigner,
        getEVMSigner: options.getEVMSigner || this.getEVMSigner,
        onValidateGasBalance: options.onValidateGasBalance,
        simulate: simulate,
        enabledChainIds: !batchSimulate ? [chainId] : validateChainIds,
        useUnlimitedApproval: options.useUnlimitedApproval,
      });
    };

    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      if (!tx) {
        raise(`executeRoute error: invalid message at index ${i}`);
      }

      let txResult: types.TxResult;
      if ("cosmosTx" in tx) {
        await validateEnabledChainIds(tx.cosmosTx.chainID);
        txResult = await this.executeCosmosTx({
          tx,
          options,
          index: i,
        });
      } else if ("evmTx" in tx) {
        await validateEnabledChainIds(tx.evmTx.chainID);
        const txResponse = await this.executeEvmMsg(tx, options);
        txResult = {
          chainID: tx.evmTx.chainID,
          txHash: txResponse.transactionHash,
        };
      } else if ("svmTx" in tx) {
        await validateEnabledChainIds(tx.svmTx.chainID);
        txResult = await this.executeSvmTx(tx, options);
      } else {
        raise(`executeRoute error: invalid message type`);
      }
      await onTransactionBroadcast?.({ ...txResult });

      const txStatusResponse = await this.waitForTransaction({
        ...txResult,
        onTransactionTracked: options.onTransactionTracked,
      });

      await onTransactionCompleted?.(
        txResult.chainID,
        txResult.txHash,
        txStatusResponse,
      );
    }
  }

  private async executeCosmosTx({
    tx,
    options,
    index,
  }: {
    tx: {
      cosmosTx: types.CosmosTx;
      operationsIndices: number[];
    };
    options: clientTypes.ExecuteRouteOptions;
    index: number;
  }): Promise<{ chainID: string; txHash: string }> {
    const { userAddresses, getCosmosSigner } = options;

    const gasArray = this.validateGasResults;

    const gas = gasArray?.find(
      (gas) => gas?.error !== null && gas?.error !== undefined,
    );
    if (typeof gas?.error === "string") {
      throw new Error(gas?.error);
    }

    const gasUsed = gasArray?.[index];
    if (!gasUsed) {
      raise(`executeRoute error: invalid gas at index ${index}`);
    }

    const { stargateClient, signer } = await this.getSigningStargateClient({
      chainId: tx.cosmosTx.chainID,
      getOfflineSigner: options.getCosmosSigner,
    });

    const currentUserAddress = userAddresses.find(
      (x) => x.chainID === tx.cosmosTx.chainID,
    )?.address;

    if (!currentUserAddress) {
      raise(
        `executeRoute error: invalid address for chain '${tx.cosmosTx.chainID}'`,
      );
    }

    const txResponse = await this.executeCosmosMessage({
      messages: tx.cosmosTx.msgs,
      chainID: tx.cosmosTx.chainID,
      getCosmosSigner,
      signerAddress: currentUserAddress,
      gas: gasUsed,
      stargateClient: stargateClient,
      signer,
      ...options,
    });

    return {
      chainID: tx.cosmosTx.chainID,
      txHash: txResponse.transactionHash,
    };
  }

  private async executeSvmTx(
    tx: { svmTx: types.SvmTx },
    options: clientTypes.ExecuteRouteOptions,
  ): Promise<{ chainID: string; txHash: string }> {
    const gasArray = this.validateGasResults;

    const gas = gasArray?.find(
      (gas) => gas?.error !== null && gas?.error !== undefined,
    );
    if (typeof gas?.error === "string") {
      throw new Error(gas?.error);
    }
    const { svmTx } = tx;
    const getSVMSigner = options.getSVMSigner || this.getSVMSigner;
    if (!getSVMSigner) {
      throw new Error(
        "executeRoute error: 'getSVMSigner' is not provided or configured in skip router",
      );
    }
    const svmSigner = await getSVMSigner();

    const txReceipt = await this.executeSVMTransaction({
      signer: svmSigner,
      message: svmTx,
      options,
    });

    return {
      chainID: svmTx.chainID,
      txHash: txReceipt,
    };
  }

  async executeEvmMsg(
    message: { evmTx: types.EvmTx },
    options: clientTypes.ExecuteRouteOptions,
  ) {
    const gasArray = this.validateGasResults;

    const gas = gasArray?.find(
      (gas) => gas?.error !== null && gas?.error !== undefined,
    );
    if (typeof gas?.error === "string") {
      throw new Error(gas?.error);
    }

    const { evmTx } = message;

    const getEVMSigner = options.getEVMSigner || this.getEVMSigner;
    if (!getEVMSigner) {
      throw new Error("Unable to get EVM signer");
    }

    const evmSigner = await getEVMSigner(evmTx.chainID);

    return await this.executeEVMTransaction({
      message: evmTx,
      signer: evmSigner,
      options,
    });
  }

  async executeCosmosMessage(
    options: clientTypes.ExecuteCosmosMessage & {
      stargateClient: SigningStargateClient;
      signer: OfflineSigner;
    },
  ) {
    const {
      signerAddress,
      chainID,
      messages,
      gas,
      onTransactionSigned,
      stargateClient,
      signer,
    } = options;

    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error(
        "executeCosmosMessage error: failed to retrieve account from signer",
      );
    }

    const fee = gas.fee;
    if (!fee) {
      throw new Error(
        "executeCosmosMessage error: failed to retrieve fee from gas",
      );
    }

    const { accountNumber, sequence } = await this.getAccountNumberAndSequence(
      signerAddress,
      chainID,
    );

    let rawTx: TxRaw;

    const commonRawTxBody = {
      signerAddress,
      chainID,
      cosmosMsgs: messages,
      fee,
      signerData: {
        accountNumber,
        sequence,
        chainId: chainID,
      },
    };

    if (isOfflineDirectSigner(signer)) {
      rawTx = await this.signCosmosMessageDirect({
        ...commonRawTxBody,
        signer,
      });
    } else {
      rawTx = await this.signCosmosMessageAmino({ ...commonRawTxBody, signer });
    }

    onTransactionSigned?.({
      chainID,
    });

    const txBytes = TxRaw.encode(rawTx).finish();

    const tx = await stargateClient.broadcastTx(txBytes);

    return tx;
  }

  async executeEVMTransaction({
    message,
    signer,
    options,
  }: {
    message: types.EvmTx;
    signer: WalletClient;
    options: clientTypes.ExecuteRouteOptions;
  }) {
    if (!signer.account) {
      throw new Error(
        "executeEVMTransaction error: failed to retrieve account from signer",
      );
    }

    const {
      onApproveAllowance,
      onTransactionSigned,
      bypassApprovalCheck,
      useUnlimitedApproval,
    } = options;
    const extendedSigner = signer.extend(publicActions);

    // Check for approvals unless bypassApprovalCheck is enabled
    if (!bypassApprovalCheck) {
      for (const requiredApproval of message.requiredERC20Approvals) {
        const allowance = await extendedSigner.readContract({
          address: requiredApproval.tokenContract as `0x${string}`,
          abi: erc20ABI,
          functionName: "allowance",
          args: [
            signer.account.address as `0x${string}`,
            requiredApproval.spender as `0x${string}`,
          ],
        });

        if (allowance > BigInt(requiredApproval.amount)) {
          continue;
        }

        onApproveAllowance?.({
          status: "pending",
          allowance: requiredApproval,
        });

        const txHash = await extendedSigner.writeContract({
          account: signer.account,
          address: requiredApproval.tokenContract as `0x${string}`,
          abi: erc20ABI,
          functionName: "approve",
          args: [
            requiredApproval.spender as `0x${string}`,
            useUnlimitedApproval
              ? maxUint256
              : BigInt(requiredApproval.amount) + BigInt(1000),
          ],
          chain: signer.chain,
        });

        const receipt = await extendedSigner.waitForTransactionReceipt({
          hash: txHash,
        });

        if (receipt.status === "reverted") {
          throw new Error(
            `executeEVMTransaction error: evm tx reverted for hash ${receipt.transactionHash}`,
          );
        }
      }

      onApproveAllowance?.({
        status: "completed",
      });
    }

    // Execute the transaction
    const txHash = await extendedSigner.sendTransaction({
      account: signer.account,
      to: message.to as `0x${string}`,
      data: `0x${message.data}`,
      chain: signer.chain,
      value: message.value === "" ? undefined : BigInt(message.value),
    });

    onTransactionSigned?.({
      chainID: message.chainID,
    });

    const receipt = await extendedSigner.waitForTransactionReceipt({
      hash: txHash,
    });

    return receipt;
  }

  async executeSVMTransaction({
    signer,
    message,
    options: options,
  }: {
    signer: Adapter;
    message: types.SvmTx;
    options: clientTypes.ExecuteRouteOptions;
  }) {
    const { onTransactionSigned } = options;
    const _tx = Buffer.from(message.tx, "base64");
    const transaction = Transaction.from(_tx);
    const endpoint = await this.getRpcEndpointForChain(message.chainID);
    const connection = new Connection(endpoint);
    let signature;
    if ("signTransaction" in signer) {
      const tx = await signer.signTransaction(transaction);
      onTransactionSigned?.({
        chainID: message.chainID,
      });
      const serializedTx = tx.serialize();

      await this.submitTransaction({
        chainID: message.chainID,
        tx: serializedTx.toString("base64"),
      }).then((res) => {
        signature = res.txHash;
      });

      const sig = await connection.sendRawTransaction(serializedTx, {
        preflightCommitment: "confirmed",
        maxRetries: 5,
      });

      signature = sig;
    }

    if (!signature) {
      throw new Error("executeSVMTransaction error: signature not found");
    }

    let getStatusCount = 0;
    let errorCount = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const result = await connection.getSignatureStatus(signature, {
          searchTransactionHistory: true,
        });
        if (result?.value?.confirmationStatus === "confirmed") {
          return signature;
        } else if (getStatusCount > 12) {
          await wait(3000);
          throw new Error(
            `executeSVMTransaction error: waiting finalized status timed out for ${signature}`,
          );
        }
        getStatusCount++;

        await wait(3000);
      } catch (error) {
        errorCount++;
        if (errorCount > 12) {
          throw error;
        }
      }
    }
  }

  async getSigningStargateClient({
    chainId,
    getOfflineSigner,
  }: {
    chainId: string;
    getOfflineSigner?: (chainID: string) => Promise<OfflineSigner>;
  }) {
    getOfflineSigner = getOfflineSigner || this.getCosmosSigner;
    if (!getOfflineSigner) {
      throw new Error(
        "'getCosmosSigner' is not provided or configured in skip router",
      );
    }
    if (!this.signingStargateClientByChainId?.[chainId]) {
      const [signer, endpoint] = await Promise.all([
        getOfflineSigner(chainId),
        this.getRpcEndpointForChain(chainId),
      ]);
      this.signingStargateClientByChainId[chainId] =
        await SigningStargateClient.connectWithSigner(endpoint, signer, {
          aminoTypes: this.aminoTypes,
          registry: this.registry,
          accountParser,
        });
    }

    return {
      stargateClient: this.signingStargateClientByChainId[
        chainId
      ] as SigningStargateClient,
      signer: await getOfflineSigner(chainId),
    };
  }

  private async getAssets(chainId?: string) {
    if (
      (chainId && this.skipAssets?.[chainId]) ||
      (!chainId && this.skipAssets)
    ) {
      return this.skipAssets;
    }
    return await this.getMainnetAndTestnetAssets(chainId);
  }

  private async getChains() {
    if (this.skipChains) return this.skipChains;

    return await this.getMainnetAndTestnetChains();
  }

  async signCosmosMessageDirect(
    options: clientTypes.SignCosmosMessageDirectOptions,
  ): Promise<TxRaw> {
    const {
      signer,
      signerAddress,
      chainID,
      cosmosMsgs,
      fee,
      signerData: { accountNumber, sequence, chainId },
    } = options;

    if (chainID.includes("evmos")) {
      return this.signCosmosMessageDirectEvmos(
        signerAddress,
        signer,
        cosmosMsgs,
        fee,
        { accountNumber, sequence, chainId },
      );
    }

    if (chainID.includes("injective")) {
      return this.signCosmosMessageDirectInjective(
        signerAddress,
        signer,
        cosmosMsgs,
        fee,
        { accountNumber, sequence, chainId },
      );
    }

    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error(
        "signCosmosMessageDirect error: failed to retrieve account from signer",
      );
    }

    const messages = cosmosMsgs.map((cosmosMsg) =>
      getEncodeObjectFromCosmosMessage(cosmosMsg),
    );

    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: "/cosmos.tx.v1beta1.TxBody",
      value: {
        messages: messages,
      },
    };

    const txBodyBytes = this.registry.encode(txBodyEncodeObject);

    const gasLimit = Int53.fromString(fee.gas).toNumber();

    const pubkeyAny = makePubkeyAnyFromAccount(accountFromSigner, chainID);

    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey: pubkeyAny, sequence }],
      fee.amount,
      gasLimit,
      fee.granter,
      fee.payer,
    );

    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      accountNumber,
    );

    const { signature, signed } = await signer.signDirect(
      signerAddress,
      signDoc,
    );

    return TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }

  // TODO: This is previously existing code, just moved to a new function.
  // Using signCosmosMessageDirectEvmos on evmos DOES currently fail.
  // I need to investigate what exactly is even different about this and hopefully remove it all together.
  private async signCosmosMessageDirectEvmos(
    signerAddress: string,
    signer: OfflineDirectSigner,
    cosmosMsgs: types.CosmosMsg[],
    fee: StdFee,
    { accountNumber, sequence, chainId }: SignerData,
  ): Promise<TxRaw> {
    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error(
        "signCosmosMessageDirectEvmos: failed to retrieve account from signer",
      );
    }

    const messages = cosmosMsgs.map((cosmosMsg) =>
      getEncodeObjectFromCosmosMessageInjective(cosmosMsg),
    );

    const pk = Buffer.from(accountFromSigner.pubkey).toString("base64");

    const { signDoc } = createTransaction({
      pubKey: pk,
      chainId: chainId,
      message: messages,
      sequence,
      accountNumber,
      timeoutHeight: 0,
      fee,
    });

    const directSignResponse = await signer.signDirect(
      signerAddress,
      // @ts-expect-error TODO: Fix this
      signDoc,
    );

    return TxRaw.fromPartial({
      bodyBytes: directSignResponse.signed.bodyBytes,
      authInfoBytes: directSignResponse.signed.authInfoBytes,
      signatures: [fromBase64(directSignResponse.signature.signature)],
    });
  }

  // TODO: This is previously existing code, just moved to a new function.
  // Using signCosmosMessageDirectInjective on injective DOES currently fail.
  // I need to investigate what exactly is even different about this and hopefully remove it all together.
  private async signCosmosMessageDirectInjective(
    signerAddress: string,
    signer: OfflineDirectSigner,
    cosmosMsgs: types.CosmosMsg[],
    fee: StdFee,
    { accountNumber, sequence, chainId }: SignerData,
  ): Promise<TxRaw> {
    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error(
        "signCosmosMessageDirectInjective: failed to retrieve account from signer",
      );
    }

    const restEndpoint = await this.getRestEndpointForChain(chainId);

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
    const latestHeight = latestBlock.header.height;
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT,
    );
    const pk = Buffer.from(accountFromSigner.pubkey).toString("base64");
    const messages = cosmosMsgs.map((cosmosMsg) =>
      getEncodeObjectFromCosmosMessageInjective(cosmosMsg),
    );
    const { signDoc } = createTransaction({
      pubKey: pk,
      chainId: chainId,
      message: messages,
      sequence,
      accountNumber,
      timeoutHeight: timeoutHeight.toNumber(),
      fee,
    });

    const directSignResponse = await signer.signDirect(
      signerAddress,
      // @ts-expect-error TODO: Fix this
      signDoc,
    );

    return TxRaw.fromPartial({
      bodyBytes: directSignResponse.signed.bodyBytes,
      authInfoBytes: directSignResponse.signed.authInfoBytes,
      signatures: [fromBase64(directSignResponse.signature.signature)],
    });
  }

  async signCosmosMessageAmino(
    options: clientTypes.SignCosmosMessageAminoOptions,
  ): Promise<TxRaw> {
    const {
      signer,
      signerAddress,
      chainID,
      cosmosMsgs,
      fee,
      signerData: { accountNumber, sequence, chainId },
    } = options;

    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error(
        "signCosmosMessageAmino: failed to retrieve account from signer",
      );
    }

    const messages = cosmosMsgs.map((cosmosMsg) =>
      getEncodeObjectFromCosmosMessage(cosmosMsg),
    );

    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    const msgs = messages.map((msg) => this.aminoTypes.toAmino(msg));

    const signDoc = makeSignDocAmino(
      msgs,
      fee,
      chainId,
      "",
      accountNumber,
      sequence,
    );

    const { signature, signed } = await signer.signAmino(
      signerAddress,
      signDoc,
    );

    const signedTxBody = {
      messages: signed.msgs.map((msg) => this.aminoTypes.fromAmino(msg)),
      memo: signed.memo,
    };

    signedTxBody.messages[0]!.value.memo = messages[0]!.value.memo;

    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: "/cosmos.tx.v1beta1.TxBody",
      value: signedTxBody,
    };

    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);

    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
    const signedSequence = Int53.fromString(signed.sequence).toNumber();

    const pubkeyAny = makePubkeyAnyFromAccount(accountFromSigner, chainID);

    const signedAuthInfoBytes = makeAuthInfoBytes(
      [{ pubkey: pubkeyAny, sequence: signedSequence }],
      signed.fee.amount,
      signedGasLimit,
      signed.fee.granter,
      signed.fee.payer,
      signMode,
    );

    return TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }

  async messages(options: types.MsgsRequest): Promise<types.MsgsResponse> {
    const optionsWithChainIdsToAffiliates = {
      ...options,
      chainIDsToAffiliates:
        options.chainIDsToAffiliates || this.chainIDsToAffiliates,
    };
    const response = await this.requestClient.post<
      types.MsgsResponseJSON,
      types.MsgsRequestJSON
    >("/v2/fungible/msgs", {
      ...types.msgsRequestToJSON(optionsWithChainIdsToAffiliates),
      slippage_tolerance_percent: options.slippageTolerancePercent || "0",
    });
    return types.messageResponseFromJSON(response);
  }

  async route(options: types.RouteRequest): Promise<types.RouteResponse> {
    const response = await this.requestClient.post<
      types.RouteResponseJSON,
      types.RouteRequestJSON
    >("/v2/fungible/route", {
      ...types.routeRequestToJSON(options),
      experimental_features: [
        ...new Set([
          "stargate",
          "eureka",
          ...(options.experimentalFeatures || []),
        ]),
      ] as types.ExperimentalFeature[],
      cumulative_affiliate_fee_bps: this.cumulativeAffiliateFeeBPS,
    });

    return types.routeResponseFromJSON(response);
  }

  async msgsDirect(
    options: types.MsgsDirectRequest,
  ): Promise<types.MsgsDirectResponse> {
    const optionsWithChainIdsToAffiliates = {
      ...options,
      chainIDsToAffiliates:
        options.chainIDsToAffiliates || this.chainIDsToAffiliates,
    };
    const response = await this.requestClient.post<
      types.MsgsDirectResponseJSON,
      types.MsgsDirectRequestJSON
    >("/v2/fungible/msgs_direct", {
      ...msgsDirectRequestToJSON(optionsWithChainIdsToAffiliates),
    });

    return {
      msgs: response.msgs.map((msg) => types.msgFromJSON(msg)),
      txs: response.txs.map((tx) => types.txFromJSON(tx)),
      route: types.routeResponseFromJSON(response.route),
    };
  }

  async recommendAssets(
    request:
      | types.AssetRecommendationRequest
      | types.AssetRecommendationRequest[],
  ) {
    const options = types.recommendAssetsRequestToJSON({
      requests: Array.isArray(request) ? request : [request],
    });

    const response =
      await this.requestClient.post<types.RecommendAssetsResponseJSON>(
        "/v2/fungible/recommend_assets",
        options,
      );

    return types.recommendAssetsResponseFromJSON(response)
      .recommendationEntries;
  }

  async ibcOriginAssets(
    assets: types.DenomWithChainID[],
  ): Promise<types.AssetOrError[]> {
    const response =
      await this.requestClient.post<types.OriginAssetsResponseJSON>(
        "/v2/fungible/ibc_origin_assets",
        types.originAssetsRequestToJSON({
          assets,
        }),
      );

    return types.originAssetsResponseFromJSON(response).originAssets;
  }

  async submitTransaction({
    chainID,
    tx,
  }: {
    chainID: string;
    tx: string;
  }): Promise<types.SubmitTxResponse> {
    const response = await this.requestClient.post<
      types.SubmitTxResponseJSON,
      types.SubmitTxRequestJSON
    >("/v2/tx/submit", {
      chain_id: chainID,
      tx: tx,
    });

    return types.submitTxResponseFromJSON(response);
  }

  async trackTransaction({
    chainID,
    txHash,
    options,
  }: {
    chainID: string;
    txHash: string;
    options?: {
      /**
       * Retry options
       * @default { maxRetries: 5, retryInterval: 1000, backoffMultiplier: 2 }
       */
      retry?: {
        /**
         * Maximum number of retries
         * @default 5
         */
        maxRetries?: number;
        /**
         * Retry interval in milliseconds
         * @default 1000
         */
        retryInterval?: number;
        /**
         * Backoff multiplier for retries
         *
         * example: `retryInterval` is set to 1000, backoffMultiplier is set to 2
         *
         * 1st retry: 1000ms
         *
         * 2nd retry: 2000ms
         *
         * 3rd retry: 4000ms
         *
         * 4th retry: 8000ms
         *
         * 5th retry: 16000ms
         *
         * @default 2
         */
        backoffMultiplier?: number;
      };
    };
  }): Promise<types.TrackTxResponse> {
    const maxRetries = options?.retry?.maxRetries ?? 5;
    const retryInterval = options?.retry?.retryInterval ?? 1000;
    const backoffMultiplier = options?.retry?.backoffMultiplier ?? 2;

    let retries = 0;
    let lastError;
    while (retries < maxRetries) {
      try {
        const response = await this.requestClient.post<
          types.TrackTxResponseJSON,
          types.TrackTxRequestJSON
        >("/v2/tx/track", {
          chain_id: chainID,
          tx_hash: txHash,
        });

        return types.trackTxResponseFromJSON(response);
      } catch (error) {
        lastError = error;
        retries++;
        await wait(retryInterval * Math.pow(backoffMultiplier, retries - 1));
      }
    }
    throw lastError;
  }

  async transactionStatus({
    chainID,
    txHash,
    options,
  }: {
    chainID: string;
    txHash: string;
    options?: {
      /**
       * Retry options
       * @default { maxRetries: 5, retryInterval: 1000, backoffMultiplier: 2 }
       */
      retry?: {
        /**
         * Maximum number of retries
         * @default 5
         */
        maxRetries?: number;
        /**
         * Retry interval in milliseconds
         * @default 1000
         */
        retryInterval?: number;
        /**
         * Backoff multiplier for retries
         *
         * example: `retryInterval` is set to 1000, backoffMultiplier is set to 2
         *
         * 1st retry: 1000ms
         *
         * 2nd retry: 2000ms
         *
         * 3rd retry: 4000ms
         *
         * 4th retry: 8000ms
         *
         * 5th retry: 16000ms
         *
         * @default 2
         */
        backoffMultiplier?: number;
      };
    };
  }): Promise<types.TxStatusResponse> {
    const maxRetries = options?.retry?.maxRetries ?? 5;
    const retryInterval = options?.retry?.retryInterval ?? 1000;
    const backoffMultiplier = options?.retry?.backoffMultiplier ?? 2;

    let retries = 0;
    let lastError;
    while (retries < maxRetries) {
      try {
        const response = await this.requestClient.get<
          types.TxStatusResponseJSON,
          types.StatusRequestJSON
        >("/v2/tx/status", {
          chain_id: chainID,
          tx_hash: txHash,
        });
        return types.txStatusResponseFromJSON(response);
      } catch (error) {
        lastError = error;
        retries++;
        await wait(retryInterval * Math.pow(backoffMultiplier, retries - 1));
      }
    }
    throw lastError;
  }

  async waitForTransaction({
    chainID,
    txHash,
    onTransactionTracked,
  }: {
    chainID: string;
    txHash: string;
    onTransactionTracked?: (txInfo: {
      txHash: string;
      chainID: string;
      explorerLink: string;
    }) => Promise<void>;
  }) {
    const { explorerLink } = await this.trackTransaction({
      chainID,
      txHash,
      options: {
        retry: {
          backoffMultiplier: 2.5,
        },
      },
    });
    await onTransactionTracked?.({ txHash, chainID, explorerLink });

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const txStatusResponse = await this.transactionStatus({
        chainID,
        txHash,
      });

      if (txStatusResponse.state === "STATE_COMPLETED_SUCCESS") {
        return txStatusResponse;
      }
      if (txStatusResponse.state === "STATE_COMPLETED_ERROR") {
        throw new Error(
          `${txStatusResponse.error?.type}: ${txStatusResponse.error?.message}`,
        );
      }
      if (txStatusResponse.state === "STATE_ABANDONED") {
        throw new Error("Tracking for the transaction has been abandoned");
      }

      await wait(1000);
    }
  }

  async venues(onlyTestnets?: boolean): Promise<types.SwapVenue[]> {
    const response = await this.requestClient.get<{
      venues: types.SwapVenueJSON[];
    }>("/v2/fungible/venues", {
      only_testnets: onlyTestnets,
    });

    return response.venues.map((venue) => types.swapVenueFromJSON(venue));
  }

  async getAccountNumberAndSequence(address: string, chainID: string) {
    if (chainID.includes("dymension")) {
      return this.getAccountNumberAndSequenceFromDymension(address, chainID);
    }
    const endpoint = await this.getRpcEndpointForChain(chainID);
    const client =
      this.signingStargateClientByChainId[chainID] ??
      (await StargateClient.connect(endpoint, {
        accountParser,
      }));
    const account = await client.getAccount(address);
    if (!account) {
      throw new Error(
        "getAccountNumberAndSequence: failed to retrieve account",
      );
    }

    client.disconnect();

    return {
      accountNumber: account.accountNumber,
      sequence: account.sequence,
    };
  }

  private async getAccountNumberAndSequenceFromDymension(
    address: string,
    chainID: string,
  ) {
    const endpoint = await this.getRestEndpointForChain(chainID);

    const response = await axios.get(
      `${endpoint}/cosmos/auth/v1beta1/accounts/${address}`,
    );
    let sequence = 0;
    let accountNumber = 0;
    if (response.data.account.base_account) {
      sequence = response.data.account.base_account.sequence as number;
      accountNumber = response.data.account.base_account
        .account_number as number;
    } else {
      sequence = response.data.account.sequence as number;
      accountNumber = response.data.account.account_number as number;
    }
    return {
      accountNumber,
      sequence,
    };
  }

  private async getAccountNumberAndSequenceFromEvmos(
    address: string,
    chainID: string,
  ) {
    const endpoint = await this.getRestEndpointForChain(chainID);

    const response = await axios.get(
      `${endpoint}/cosmos/auth/v1beta1/accounts/${address}`,
    );

    const accountNumber = response.data.account.base_account
      .account_number as number;
    const sequence = response.data.account.base_account.sequence as number;

    return {
      accountNumber,
      sequence,
    };
  }

  private async getAccountNumberAndSequenceInjective(
    address: string,
    chainID: string,
  ) {
    const endpoint = await this.getRestEndpointForChain(chainID);

    const chainRestAuthApi = new ChainRestAuthApi(endpoint);

    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(address);

    return {
      accountNumber: parseInt(
        accountDetailsResponse.account.base_account.account_number,
      ),
      sequence: parseInt(accountDetailsResponse.account.base_account.sequence),
    };
  }

  async getRpcEndpointForChain(chainID: string) {
    if (this.endpointOptions.getRpcEndpointForChain) {
      return this.endpointOptions.getRpcEndpointForChain(chainID);
    }

    if (
      this.endpointOptions.endpoints &&
      this.endpointOptions.endpoints[chainID]
    ) {
      const endpointOptions = this.endpointOptions.endpoints[chainID];

      if (endpointOptions?.rpc) {
        return endpointOptions.rpc;
      }
    }

    console.warn(
      "Warning: You are using unreliable public endpoints. We strongly recommend overriding them via endpointOptions for use beyond development settings.",
    );

    let chain;
    chain = chains().find((chain) => chain.chain_id === chainID);
    if (!chain) {
      throw new Error(
        `getRpcEndpointForChain: failed to find chain id '${chainID}' in registry`,
      );
    }

    if (chain.apis?.rpc?.length === 0 || !chain.apis?.rpc) {
      throw new Error(
        `getRpcEndpointForChain error: failed to find RPC endpoint for chain '${chainID}'`,
      );
    }
    const endpoints = chain.apis?.rpc?.map((api) => api.address);
    const endpoint = await findFirstWorkingEndpoint(endpoints, "rpc");

    if (!endpoint) {
      throw new Error(
        `getRpcEndpointForChain error: failed to find RPC endpoint for chain '${chainID}'`,
      );
    }

    return endpoint;
  }

  async getRestEndpointForChain(chainID: string) {
    if (this.endpointOptions.getRestEndpointForChain) {
      return this.endpointOptions.getRestEndpointForChain(chainID);
    }

    if (
      this.endpointOptions.endpoints &&
      this.endpointOptions.endpoints[chainID]
    ) {
      const endpointOptions = this.endpointOptions.endpoints[chainID];

      if (endpointOptions?.rest) {
        return endpointOptions.rest;
      }
    }

    let chain;
    chain = chains().find((chain) => chain.chain_id === chainID);
    if (!chain) {
      throw new Error(
        `getRestEndpointForChain error: failed to find chain id '${chainID}' in registry`,
      );
    }
    if (chain.apis?.rest?.length === 0 || !chain.apis?.rest) {
      throw new Error(
        `getRpcEndpointForChain error: failed to find RPC endpoint for chain '${chainID}'`,
      );
    }
    const endpoints = chain.apis?.rest?.map((api) => api.address);
    const endpoint = await findFirstWorkingEndpoint(endpoints, "rest");

    if (!endpoint) {
      throw new Error(
        `getRestEndpointForChain error: failed to find REST endpoint for chain '${chainID}'`,
      );
    }

    return endpoint;
  }

  async getRecommendedGasPrice(chainID: string) {
    const feeInfo = await this.getFeeInfoForChain(chainID);

    if (!feeInfo || !feeInfo.gasPrice) {
      return undefined;
    }

    let price = feeInfo.gasPrice.average;
    if (price === "") {
      price = feeInfo.gasPrice.high;
    }
    if (price === "") {
      price = feeInfo.gasPrice.low;
    }

    if (!price) return;

    return new GasPrice(
      Decimal.fromUserInput(BigNumber(price).toFixed(), 18),
      feeInfo.denom,
    );
  }

  async getFeeInfoForChain(
    chainID: string,
  ): Promise<types.FeeAsset | undefined> {
    const skipChains = await this.getMainnetAndTestnetChains();

    const skipChain = skipChains.find((chain) => chain.chainID === chainID);

    if (!skipChain) {
      return undefined;
    }

    const defaultGasToken = await this.getDefaultGasTokenForChain(chainID);

    if (!defaultGasToken && !skipChain.feeAssets) {
      return undefined;
    }

    const skipFeeInfo = defaultGasToken
      ? skipChain.feeAssets.find((skipFee) => skipFee.denom === defaultGasToken)
      : skipChain.feeAssets[0];

    if (!skipFeeInfo && skipChain.feeAssets?.[0]?.gasPrice !== null) {
      return skipChain.feeAssets[0];
    }
    if (skipFeeInfo && skipFeeInfo.gasPrice !== null) {
      return skipFeeInfo;
    }

    let chain;
    chain = chains().find((chain) => chain.chain_id === chainID);
    if (!chain) {
      return undefined;
    }

    if (!chain.fees) {
      return undefined;
    }

    const registryFeeInfo = chain.fees.fee_tokens.find(
      (feeToken) => feeToken.denom === defaultGasToken,
    );

    if (!registryFeeInfo) {
      return undefined;
    }

    return {
      denom: registryFeeInfo.denom,
      gasPrice: {
        low: registryFeeInfo.low_gas_price
          ? `${registryFeeInfo.low_gas_price}`
          : "",
        average: registryFeeInfo.average_gas_price
          ? `${registryFeeInfo.average_gas_price}`
          : "",
        high: registryFeeInfo.high_gas_price
          ? `${registryFeeInfo.high_gas_price}`
          : "",
      },
    };
  }

  private getDefaultGasTokenForChain(chainID: string) {
    const gasDenom = DEFAULT_GAS_DENOM_OVERRIDES[chainID];
    if (gasDenom) {
      return gasDenom;
    }

    let chain;
    chain = chains().find((chain) => chain.chain_id === chainID);
    if (!chain) {
      return undefined;
    }

    if (!chain.fees) {
      return undefined;
    }

    // first check if the chain has a staking token, this is often the "default" gas token
    const stakingTokens = this.getStakingTokensForChain(chainID);

    if (stakingTokens && stakingTokens.length > 0) {
      const feeAsset = chain.fees.fee_tokens.find(
        (feeToken) => feeToken.denom === stakingTokens[0]?.denom,
      );

      if (feeAsset) {
        return feeAsset.denom;
      }
    }

    // next attempt to get the first non-IBC asset in the fee_tokens array, at least this token will be native to the chain
    const nonIBCAsset = chain.fees.fee_tokens.find(
      (token) =>
        !token.denom.startsWith("ibc/") && !token.denom.startsWith("l2/"),
    );
    if (nonIBCAsset) {
      return nonIBCAsset.denom;
    }

    const nonL2Asset = chain.fees.fee_tokens.find(
      (token) => !token.denom.startsWith("l2/"),
    );
    if (nonL2Asset) {
      return nonL2Asset.denom;
    }

    // if all else fails, just return the first token in the array
    return chain.fees.fee_tokens[0]?.denom;
  }

  private getStakingTokensForChain(chainID: string) {
    let chain;
    chain = chains().find((chain) => chain.chain_id === chainID);
    if (!chain) {
      throw new Error(
        `getStakingTokensForChain error: failed to find chain id '${chainID}' in registry`,
      );
    }

    if (!chain.staking) {
      return undefined;
    }

    return chain.staking.staking_tokens;
  }

  async validateGasBalances({
    txs,
    onValidateGasBalance,
    getFallbackGasAmount,
    getCosmosSigner,
    getEVMSigner,
    simulate,
    disabledChainIds,
    enabledChainIds,
    useUnlimitedApproval,
  }: {
    txs: types.Tx[];
    onValidateGasBalance?: clientTypes.ExecuteRouteOptions["onValidateGasBalance"];
    getFallbackGasAmount?: clientTypes.GetFallbackGasAmount;
    simulate?: clientTypes.ExecuteRouteOptions["simulate"];
    // skip gas validation for specific chainId
    disabledChainIds?: string[];
    // run gas validation for specific chainId
    enabledChainIds?: string[];
    useUnlimitedApproval?: boolean;
  } & Pick<clientTypes.SignerGetters, "getCosmosSigner" | "getEVMSigner">) {
    // cosmos or svm tx in txs
    if (
      txs.every((tx) => "cosmosTx" in tx === undefined) ||
      txs.every((tx) => "svmTx" in tx === undefined)
    ) {
      return;
    }

    onValidateGasBalance?.({
      status: "pending",
    });

    const validateResult = await Promise.all(
      txs.map(async (tx, i) => {
        if (!tx) {
          raise(`invalid tx at index ${i}`);
        }
        if (
          "cosmosTx" in tx &&
          !disabledChainIds?.includes(tx.cosmosTx.chainID) &&
          (enabledChainIds === undefined ||
            enabledChainIds.includes(tx.cosmosTx.chainID))
        ) {
          if (!tx.cosmosTx.msgs) {
            raise(`invalid msgs ${tx.cosmosTx.msgs}`);
          }

          try {
            const res = await this.validateCosmosGasBalance({
              chainID: tx.cosmosTx.chainID,
              signerAddress: tx.cosmosTx.signerAddress,
              messages: tx.cosmosTx.msgs,
              getFallbackGasAmount,
              getOfflineSigner: getCosmosSigner,
              txIndex: i,
              simulate,
            });

            return res;
          } catch (e) {
            const error = e as Error;
            return {
              error: error.message,
              asset: null,
              fee: null,
            };
          }
        }

        if (
          "evmTx" in tx &&
          !disabledChainIds?.includes(tx.evmTx.chainID) &&
          (enabledChainIds === undefined ||
            enabledChainIds.includes(tx.evmTx.chainID))
        ) {
          const signer = await getEVMSigner?.(tx.evmTx.chainID);
          if (!signer) {
            throw new Error(
              `failed to get signer for chain ${tx.evmTx.chainID}`,
            );
          }
          try {
            const res = await this.validateEvmGasBalance({
              tx: tx.evmTx,
              signer,
              getFallbackGasAmount,
              useUnlimitedApproval,
            });
            return res;
          } catch (e) {
            const error = e as Error;
            return {
              error: error.message,
              asset: null,
              fee: null,
            };
          }
        }

        if (
          "svmTx" in tx &&
          !disabledChainIds?.includes(tx.svmTx.chainID) &&
          (enabledChainIds === undefined ||
            enabledChainIds.includes(tx.svmTx.chainID))
        ) {
          try {
            const res = await this.validateSvmGasBalance({
              tx: tx.svmTx,
            });
            return res;
          } catch (e) {
            const error = e as Error;
            return {
              error: error.message,
              asset: null,
              fee: null,
            };
          }
        }
      }),
    );

    if (validateResult.filter(Boolean).length === 0) {
      return;
    }

    const txError = validateResult.find((res) => res && res?.error !== null);
    if (txError) {
      onValidateGasBalance?.({
        status: "error",
      });
      this.validateGasResults =
        validateResult as unknown as clientTypes.ValidateGasResult[];
      throw new Error(`${txError.error}`);
    }
    onValidateGasBalance?.({
      status: "completed",
    });

    this.validateGasResults =
      validateResult as unknown as clientTypes.ValidateGasResult[];
  }

  /**
   *
   * Validate gas balance for cosmos messages returns a fee asset and StdFee to be used
   *
   */
  async validateCosmosGasBalance({
    chainID,
    signerAddress,
    messages,
    getFallbackGasAmount,
    getOfflineSigner,
    txIndex,
    simulate,
  }: {
    chainID: string;
    signerAddress: string;
    messages?: types.CosmosMsg[];
    getOfflineSigner?: (chainID: string) => Promise<OfflineSigner>;
    getFallbackGasAmount?: clientTypes.GetFallbackGasAmount;
    txIndex?: number;
    simulate?: clientTypes.ExecuteRouteOptions["simulate"];
  }) {
    const chainAssets = (await this.getAssets(chainID))?.[chainID];

    const chain = (await this.getChains()).find(
      (chain) => chain.chainID === chainID,
    );
    if (!chain) {
      throw new Error(`failed to find chain id for '${chainID}'`);
    }

    const { feeAssets } = chain;
    if (!feeAssets) {
      throw new Error(`failed to find fee assets for chain '${chainID}'`);
    }
    const estimatedGasAmount = await (async () => {
      try {
        if (!simulate) throw new Error("simulate");
        // Skip gas estimation for noble-1 in multi tx route
        if (txIndex !== 0 && chainID === "noble-1") {
          return "0";
        }
        const { stargateClient } = await this.getSigningStargateClient({
          chainId: chainID,
          getOfflineSigner,
        });
        const estimatedGas = await getCosmosGasAmountForMessage(
          stargateClient,
          signerAddress,
          chainID,
          messages,
        );
        return estimatedGas;
      } catch (e) {
        const error = e as Error;
        if (error.message === "simulate" && !getFallbackGasAmount) {
          throw new Error(
            `unable to get gas amount for ${chainID}'s message(s)`,
          );
        }
        if (getFallbackGasAmount) {
          const fallbackGasAmount = await getFallbackGasAmount(
            chainID,
            types.ChainType.Cosmos,
          );
          if (!fallbackGasAmount) {
            raise(`unable to estimate gas for message(s) ${messages}`);
          }
          return String(fallbackGasAmount);
        }
        throw error;
      }
    })();
    const fees = feeAssets.map((asset) => {
      const gasPrice = (() => {
        if (!asset.gasPrice) return undefined;
        let price = asset.gasPrice.average;
        if (price === "") {
          price = asset.gasPrice.high;
        }
        if (price === "") {
          price = asset.gasPrice.low;
        }

        if (!price) return;
        return new GasPrice(
          Decimal.fromUserInput(BigNumber(price).toFixed(), 18),
          asset.denom,
        );
      })();
      if (!gasPrice) {
        return null;
      }
      let gasLimitToUse = Math.ceil(parseFloat(estimatedGasAmount));

      if (chainID === "noble-1") {
        gasLimitToUse = 200_000;
      } else if (chainID === "pirin-1" && asset.denom !== "unls") {
        // For Nolus (pirin-1), apply a multiplier for non-native fee tokens
        const nolusMultiplier = 1.4;
        gasLimitToUse = Math.ceil(gasLimitToUse * nolusMultiplier);
      }

      return calculateFee(gasLimitToUse, gasPrice);
    });

    const feeBalance = await this.balances({
      chains: {
        [chainID]: {
          address: signerAddress,
          denoms: feeAssets.map((asset) => asset.denom),
        },
      },
    });
    const skipChains = await this.getChains();
    const validatedAssets = feeAssets.map((asset, index) => {
      const chainAsset = chainAssets?.find((x) => x.denom === asset.denom);
      const symbol = chainAsset?.recommendedSymbol?.toUpperCase();
      const chain = skipChains.find((x) => x.chainID === chainID);
      const decimal = Number(chainAsset?.decimals);
      if (!chainAsset) {
        return {
          error: `(${chain?.prettyName}) Unable to find asset for ${asset.denom}`,
        };
      }
      if (isNaN(decimal))
        return {
          error: `(${chain?.prettyName}) Unable to find decimal for ${symbol}`,
        };

      const fee = fees[index];
      if (!fee) {
        return {
          error: `(${chain?.prettyName}) Unable to calculate fee for ${symbol}`,
          asset,
        };
      }

      // Skip fee validation for noble-1 in multi tx route
      if (txIndex !== 0 && chainID === "noble-1") {
        return {
          error: null,
          asset,
          fee,
        };
      }

      let balance = feeBalance?.chains[chainID]?.denoms[asset.denom];

      if (!balance) {
        balance = {
          amount: "0",
          formattedAmount: "0",
        };
      }
      if (!fee.amount[0]?.amount) {
        return {
          error: `(${chain?.prettyName}) Unable to get fee for ${symbol}`,
          asset,
        };
      }

      if (parseInt(balance.amount) < parseInt(fee.amount[0]?.amount)) {
        const userAmount = new BigNumber(parseFloat(balance.amount))
          .shiftedBy(-decimal)
          .toFixed(decimal);
        const feeAmount = new BigNumber(parseFloat(fee.amount[0]?.amount))
          .shiftedBy(-decimal)
          .toFixed(decimal);
        return {
          error: `Insufficient balance for gas on ${chain?.prettyName}. Need ${feeAmount} ${symbol} but only have ${userAmount} ${symbol}.`,
          asset,
        };
      }
      return {
        error: null,
        asset,
        fee,
      };
    });

    const feeUsed = validatedAssets.find((res) => res?.error === null);
    if (!feeUsed) {
      if (validatedAssets.length > 1) {
        throw new Error(
          validatedAssets[0]?.error ||
            `Insufficient fee token to initiate transfer on ${chainID}.`,
        );
      }
      throw new Error(
        validatedAssets[0]?.error ||
          `Insufficient fee token to initiate transfer on ${chainID}.`,
      );
    }
    return feeUsed;
  }

  async validateEvmGasBalance({
    signer,
    tx,
    getFallbackGasAmount,
    useUnlimitedApproval,
  }: {
    signer: WalletClient;
    tx: types.EvmTx;
    getFallbackGasAmount?: clientTypes.GetFallbackGasAmount;
    useUnlimitedApproval?: boolean;
  }) {
    const chain = (await this.getChains()).find(
      (chain) => chain.chainID === tx.chainID,
    );
    if (!chain) {
      throw new Error(`failed to find chain id for '${tx.chainID}'`);
    }
    if (!signer.account?.address) {
      throw new Error("validateEvmGasBalance: Signer address not found");
    }

    const skipBalances = await this.balances({
      chains: {
        [tx.chainID]: {
          address: signer.account?.address,
        },
      },
    });

    const balances = skipBalances.chains[tx.chainID]?.denoms;

    const nativeGasBalance =
      balances &&
      Object.entries(balances).find(([denom]) =>
        denom.includes("-native"),
      )?.[1];

    const zeroAddressGasBalance =
      balances &&
      Object.entries(balances).find(
        ([denom]) =>
          denom.toLowerCase() === "0x0000000000000000000000000000000000000000",
      )?.[1];
    const gasBalance = nativeGasBalance || zeroAddressGasBalance;

    const { requiredERC20Approvals } = tx;

    if (requiredERC20Approvals) {
      try {
        await this.validateEvmTokenApproval({
          requiredERC20Approvals,
          signer,
          chain,
          gasBalance,
          tx,
          useUnlimitedApproval,
        });
      } catch (error) {
        const err = error as Error;
        return {
          error: err.message,
          asset: null,
          fee: null,
        };
      }
    }

    const gasAmount = await getEVMGasAmountForMessage(
      signer,
      tx,
      getFallbackGasAmount,
    );

    if (!gasBalance) {
      const chainAssets = (await this.getAssets(String(tx.chainID)))?.[
        tx.chainID
      ];

      const nativeAsset = chainAssets?.find((x) => x.denom.includes("-native"));
      const zeroAddressAsset = chainAssets?.find(
        (x) =>
          x.denom.toLowerCase() ===
          "0x0000000000000000000000000000000000000000",
      );
      const asset = nativeAsset || zeroAddressAsset;
      if (!asset?.decimals) {
        return {
          error: `Insufficient balance for gas on ${chain.prettyName}. Need ${gasAmount} gwei.`,
          asset: null,
          fee: null,
        };
      }

      const formattedGasAmount = formatUnits(gasAmount, asset?.decimals);

      return {
        error: `Insufficient balance for gas on ${chain.prettyName}. Need ${formattedGasAmount} ${asset.symbol}.`,
        asset: null,
        fee: null,
      };
    }
    if (BigNumber(gasBalance.amount).lt(Number(gasAmount))) {
      const chainAssets = (await this.getAssets(tx.chainID))?.[tx.chainID];
      const asset = chainAssets?.find(
        (x) =>
          x.denom.includes("-native") ||
          x.denom.toLowerCase() ===
            "0x0000000000000000000000000000000000000000",
      );
      if (!asset?.decimals) {
        return {
          error: `Insufficient balance for gas on ${chain.prettyName}. Need ${gasAmount} gwei but only have ${gasBalance.amount} gwei.`,
          asset: null,
          fee: null,
        };
      }

      const formattedGasAmount = formatUnits(gasAmount, asset?.decimals);
      return {
        error: `Insufficient balance for gas on ${chain.prettyName}. Need ${formattedGasAmount} ${asset.symbol} but only have ${gasBalance.formattedAmount} ${asset.symbol}.`,
        asset: null,
        fee: null,
      };
    }
  }

  async validateEvmTokenApproval({
    requiredERC20Approvals,
    signer,
    chain,
    gasBalance,
    tx,
    useUnlimitedApproval,
  }: {
    requiredERC20Approvals: types.ERC20Approval[];
    signer: WalletClient;
    gasBalance?: types.BalanceResponseDenomEntry | undefined;
    chain: types.Chain;
    tx: types.EvmTx;
    useUnlimitedApproval?: boolean;
  }) {
    if (!signer.account?.address) {
      throw new Error("validateEvmGasBalance: Signer address not found");
    }
    for (const requiredApproval of requiredERC20Approvals) {
      const extendedSigner = signer.extend(publicActions);
      const allowance = await extendedSigner.readContract({
        address: requiredApproval.tokenContract as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [
          signer.account?.address as `0x${string}`,
          requiredApproval.spender as `0x${string}`,
        ],
      });

      if (allowance > BigInt(requiredApproval.amount)) {
        continue;
      }

      const fee = await extendedSigner.estimateFeesPerGas();
      const allowanceGasFee = BigInt(fee.maxFeePerGas) * BigInt(100_000);

      if (!gasBalance) {
        const chainAssets = (await this.getAssets(String(tx.chainID)))?.[
          tx.chainID
        ];

        const nativeAsset = chainAssets?.find((x) =>
          x.denom.includes("-native"),
        );
        const zeroAddressAsset = chainAssets?.find(
          (x) =>
            x.denom.toLowerCase() ===
            "0x0000000000000000000000000000000000000000",
        );
        const asset = nativeAsset || zeroAddressAsset;
        if (!asset?.decimals) {
          throw new Error(
            `Insufficient balance for gas on ${chain.prettyName}. Need ${allowanceGasFee} gwei.`,
          );
        }

        const formattedGasAmount = formatUnits(
          allowanceGasFee,
          asset?.decimals,
        );

        throw new Error(
          `Insufficient balance for gas on ${chain.prettyName}. Need ${formattedGasAmount} ${asset.symbol}.`,
        );
      }
      if (BigNumber(gasBalance.amount).lt(Number(allowanceGasFee))) {
        const chainAssets = (await this.getAssets(tx.chainID))?.[tx.chainID];
        const asset = chainAssets?.find(
          (x) =>
            x.denom.includes("-native") ||
            x.denom.toLowerCase() ===
              "0x0000000000000000000000000000000000000000",
        );
        if (!asset?.decimals) {
          return {
            error: `Insufficient balance for gas on ${chain.prettyName}. Need ${allowanceGasFee} gwei but only have ${gasBalance.amount} gwei.`,
            asset: null,
            fee: null,
          };
        }

        const formattedGasAmount = formatUnits(
          allowanceGasFee,
          asset?.decimals,
        );
        return {
          error: `Insufficient balance for gas on ${chain.prettyName}. Need ${formattedGasAmount} ${asset.symbol} but only have ${gasBalance.formattedAmount} ${asset.symbol}.`,
          asset: null,
          fee: null,
        };
      }

      const txHash = await extendedSigner.writeContract({
        account: signer.account,
        address: requiredApproval.tokenContract as `0x${string}`,
        abi: erc20ABI,
        functionName: "approve",
        args: [
          requiredApproval.spender as `0x${string}`,
          useUnlimitedApproval
            ? maxUint256
            : BigInt(requiredApproval.amount) + BigInt(1000),
        ],
        chain: signer.chain,
      });

      const receipt = await extendedSigner.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === "reverted") {
        throw new Error(
          `executeEVMTransaction error: evm tx reverted for hash ${receipt.transactionHash}`,
        );
      }
    }
  }

  async validateSvmGasBalance({ tx }: { tx: types.SvmTx }) {
    const endpoint = await this.getRpcEndpointForChain(tx.chainID);
    const connection = new Connection(endpoint);
    if (!connection) throw new Error(`Failed to connect to ${tx.chainID}`);
    const simResult = await simulateSvmTx(connection, tx);

    if (simResult.error) {
      return {
        error: simResult.error,
        asset: null,
        fee: null,
      };
    }
  }

  async getMainnetAndTestnetChains() {
    const [mainnetChains, testnetChains] = await Promise.all([
      this.chains({
        includeEVM: true,
        includeSVM: true,
      }),
      this.chains({
        includeEVM: true,
        includeSVM: true,
        onlyTestnets: true,
      }),
    ]);
    this.skipChains = [...mainnetChains, ...testnetChains];
    return [...mainnetChains, ...testnetChains];
  }

  async getMainnetAndTestnetAssets(chainId?: string) {
    const [assetsMainnet, assetsTestnet] = await Promise.all([
      this.assets({
        chainIDs: chainId ? [chainId] : undefined,
      }),
      this.assets({
        chainIDs: chainId ? [chainId] : undefined,
        onlyTestnets: true,
      }),
    ]);
    this.skipAssets = {
      ...assetsMainnet,
      ...assetsTestnet,
    };
    return {
      ...assetsMainnet,
      ...assetsTestnet,
    };
  }

  async validateUserAddresses(userAddresses: clientTypes.UserAddress[]) {
    const chains = await this.getChains();
    const validations = userAddresses.map((userAddress) => {
      const chain = chains.find(
        (chain) => chain.chainID === userAddress.chainID,
      );

      switch (chain?.chainType) {
        case types.ChainType.Cosmos:
          try {
            if (chain.chainID.includes("penumbra")) {
              try {
                return (
                  chain.bech32Prefix ===
                  bech32m.decode(userAddress.address, 143)?.prefix
                );
              } catch {
                // The temporary solution to route around Noble address breakage.
                // This can be entirely removed once `noble-1` upgrades.
                return ["penumbracompat1", "tpenumbra"].includes(
                  bech32.decode(userAddress.address, 1023).prefix,
                );
              }
            }
            return (
              chain.bech32Prefix ===
              bech32.decode(userAddress.address, 1023).prefix
            );
          } catch {
            return false;
          }

        case types.ChainType.EVM:
          try {
            return isAddress(userAddress.address);
          } catch (_error) {
            return false;
          }
        case types.ChainType.SVM:
          try {
            const publicKey = new PublicKey(userAddress.address);
            return PublicKey.isOnCurve(publicKey);
          } catch (_error) {
            return false;
          }
        default:
          return false;
      }
    });

    return validations.every((validation) => validation);
  }
}

function validateChainIDsToAffiliates(
  chainIDsToAffiliates: Record<string, types.ChainAffiliates>,
) {
  const affiliatesArray: types.Affiliate[][] = Object.values(
    chainIDsToAffiliates,
  ).map((chain) => chain.affiliates);

  const firstAffiliateBasisPointsFee = affiliatesArray[0]?.reduce(
    (acc, affiliate) => {
      if (!affiliate.basisPointsFee) {
        throw new Error("basisPointFee must exist in each affiliate");
      }
      return acc + parseInt(affiliate.basisPointsFee, 10);
    },
    0,
  );

  const allBasisPointsAreEqual = affiliatesArray.every((affiliate) => {
    const totalBasisPointsFee = affiliate.reduce((acc, affiliate) => {
      if (!affiliate.basisPointsFee) {
        throw new Error("basisPointFee must exist in each affiliate");
      }
      if (!affiliate.address) {
        throw new Error("address to receive fee must exist in each affiliate");
      }
      return acc + parseInt(affiliate?.basisPointsFee, 10);
    }, 0);
    return totalBasisPointsFee === firstAffiliateBasisPointsFee;
  });

  if (!allBasisPointsAreEqual) {
    throw new Error(
      "basisPointFee does not add up to the same number for each chain in chainIDsToAffiliates",
    );
  }

  return firstAffiliateBasisPointsFee?.toFixed(0);
}
/**
 * @deprecated SkipRouter is deprecated please use SkipClient instead
 */
export class SkipRouter extends SkipClient {}

function raise(message?: string, options?: ErrorOptions): never {
  throw new Error(message, options);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
