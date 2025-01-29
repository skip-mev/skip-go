/* eslint-disable prefer-const */
import { makeSignDoc as makeSignDocAmino } from "@cosmjs/amino";
import { createWasmAminoConverters } from "@cosmjs/cosmwasm-stargate";
import { fromBase64, fromBech32 } from "@cosmjs/encoding";
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
} from "@injectivelabs/sdk-ts/dist/esm/client/chain/rest";
import {
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from "@injectivelabs/utils";
import axios from "axios";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { MsgExecute } from "./codegen/initia/move/v1/tx";

import { isAddress, maxUint256, publicActions, WalletClient } from "viem";

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
import {
  DEFAULT_GAS_DENOM_OVERRIDES,
  DEFAULT_CACHE_DURATION,
} from "./constants/constants";
import { createTransaction } from "./injective";
import { RequestClient } from "./request-client";
import {
  getEncodeObjectFromCosmosMessage,
  getEncodeObjectFromCosmosMessageInjective,
  getCosmosGasAmountForMessage,
} from "./transactions";
import * as types from "./types";
import * as clientTypes from "./client-types";
import { msgsDirectRequestToJSON } from "./types/converters";
import { Adapter } from "@solana/wallet-adapter-base";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { MsgInitiateTokenDeposit } from "./codegen/opinit/ophost/v1/tx";
import { createCachingMiddleware, CustomCache } from "./cache";

export const SKIP_API_URL = "https://api.skip.build";

export class SkipClient {
  protected requestClient: RequestClient;

  protected aminoTypes: AminoTypes;
  protected registry: Registry;

  protected endpointOptions: {
    endpoints?: Record<string, clientTypes.EndpointOptions>;
    getRpcEndpointForChain?: (chainID: string) => Promise<string>;
    getRestEndpointForChain?: (chainID: string) => Promise<string>;
  };

  protected getCosmosSigner?: clientTypes.SignerGetters["getCosmosSigner"];
  protected getEVMSigner?: clientTypes.SignerGetters["getEVMSigner"];
  protected getSVMSigner?: clientTypes.SignerGetters["getSVMSigner"];
  protected chainIDsToAffiliates?: clientTypes.SkipClientOptions["chainIDsToAffiliates"];
  protected cumulativeAffiliateFeeBPS?: string = "0";
  protected cacheDurationMs?: number;

  private cache: CustomCache;
  private cachingMiddleware: ReturnType<typeof createCachingMiddleware>;

  constructor(options: clientTypes.SkipClientOptions = {}) {
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

    this.cache = CustomCache.getInstance();

    this.cacheDurationMs = options.cacheDurationMs ?? DEFAULT_CACHE_DURATION;
    this.cachingMiddleware = createCachingMiddleware(this.cache, {
      cacheDurationMs: this.cacheDurationMs,
    });

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
    return this.cachingMiddleware(
      "assets",
      async (opts: types.AssetsRequest) => {
        const response = await this.requestClient.get<{
          chain_to_assets_map: Record<string, { assets: types.AssetJSON[] }>;
        }>("/v2/fungible/assets", types.assetsRequestToJSON({ ...opts }));

        return Object.entries(response.chain_to_assets_map).reduce(
          (acc, [chainID, { assets }]) => {
            acc[chainID] = assets.map((asset) => types.assetFromJSON(asset));
            return acc;
          },
          {} as Record<string, types.Asset[]>,
        );
      },
      [options],
    );
  }

  async chains(options?: types.ChainsRequest): Promise<types.Chain[]> {
    return this.cachingMiddleware(
      "chains",
      async (opts: typeof options) => {
        const response = await this.requestClient.get<{
          chains: types.ChainJSON[];
        }>("/v2/info/chains", types.chainsRequestToJSON({ ...opts }));
        return response.chains.map((chain) => types.chainFromJSON(chain));
      },
      [options],
    );
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
    return types.balanceResponseFromJSON(response);
  }

  async executeRoute(options: clientTypes.ExecuteRouteOptions) {
    const { route, userAddresses, beforeMsg, afterMsg } = options;

    let addressList: string[] = [];
    let i = 0;
    for (let j = 0; j < userAddresses.length; j++) {
      if (route.requiredChainAddresses[i] !== userAddresses[j]?.chainID) {
        i = j;
        continue;
      }
      addressList.push(userAddresses[j]!.address!);
      i++;
    }

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
    } = options;
    const gas = await this.validateGasBalances({
      txs,
      getFallbackGasAmount: options.getFallbackGasAmount,
      getOfflineSigner: options.getCosmosSigner,
      onValidateGasBalance: options.onValidateGasBalance,
      simulate: simulate,
    });
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      if (!tx) {
        raise(`executeRoute error: invalid message at index ${i}`);
      }

      let txResult: types.TxResult;
      if ("cosmosTx" in tx) {
        txResult = await this.executeCosmosTx(tx, options, i, gas);
      } else if ("evmTx" in tx) {
        const txResponse = await this.executeEvmMsg(tx, options);
        txResult = {
          chainID: tx.evmTx.chainID,
          txHash: txResponse.transactionHash,
        };
      } else if ("svmTx" in tx) {
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

  private async executeCosmosTx(
    tx: {
      cosmosTx: types.CosmosTx;
      operationsIndices: number[];
    },
    options: clientTypes.ExecuteRouteOptions,
    index: number,
    gas: clientTypes.Gas[],
  ): Promise<{ chainID: string; txHash: string }> {
    const { userAddresses, getCosmosSigner } = options;
    const gasUsed = gas[index];
    if (!gasUsed) {
      raise(`executeRoute error: invalid gas at index ${index}`);
    }
    const getOfflineSigner = options.getCosmosSigner ?? this.getCosmosSigner;

    if (!getOfflineSigner) {
      throw new Error(
        "executeRoute error: 'getCosmosSigner' is not provided or configured in skip router",
      );
    }

    const [signer, endpoint] = await Promise.all([
      getOfflineSigner(tx.cosmosTx.chainID),
      this.getRpcEndpointForChain(tx.cosmosTx.chainID),
    ]);

    const stargateClient = await SigningStargateClient.connectWithSigner(
      endpoint,
      signer,
      {
        aminoTypes: this.aminoTypes,
        registry: this.registry,
        accountParser,
      },
    );

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
      stargateClient,
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
        "executeMultiChainMessage error: failed to retrieve account from signer",
      );
    }

    const fee = gas.fee;

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
    const { onApproveAllowance, onTransactionSigned } = options;

    const extendedSigner = signer.extend(publicActions);

    // check for approvals
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

      if (allowance >= BigInt(requiredApproval.amount)) {
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
        args: [requiredApproval.spender as `0x${string}`, maxUint256],
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

    // execute tx
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

      if (txStatusResponse.status === "STATE_COMPLETED") {
        return txStatusResponse;
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
    const client = await StargateClient.connect(endpoint, {
      accountParser,
    });
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
    const [mainnetChains, testnetChains] = await Promise.all([
      this.chains({}),
      this.chains({ onlyTestnets: true }),
    ]);
    const skipChains = [...mainnetChains, ...testnetChains];

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
    getOfflineSigner,
    onValidateGasBalance,
    getFallbackGasAmount,
    simulate,
  }: {
    txs: types.Tx[];
    getOfflineSigner?: (chainID: string) => Promise<OfflineSigner>;
    onValidateGasBalance?: clientTypes.ExecuteRouteOptions["onValidateGasBalance"];
    getFallbackGasAmount?: clientTypes.GetFallbackGasAmount;
    simulate?: clientTypes.ExecuteRouteOptions["simulate"];
  }) {
    onValidateGasBalance?.({
      status: "pending",
    });
    const validateResult = await Promise.all(
      txs.map(async (tx, i) => {
        if (!tx) {
          raise(`invalid tx at index ${i}`);
        }
        if ("cosmosTx" in tx) {
          if (!tx.cosmosTx.msgs) {
            raise(`invalid msgs ${tx.cosmosTx.msgs}`);
          }
          getOfflineSigner = getOfflineSigner || this.getCosmosSigner;
          if (!getOfflineSigner) {
            throw new Error(
              "'getCosmosSigner' is not provided or configured in skip router",
            );
          }
          const endpoint = await this.getRpcEndpointForChain(
            tx.cosmosTx.chainID,
          );
          const signer = await getOfflineSigner(tx.cosmosTx.chainID);
          const client = await SigningStargateClient.connectWithSigner(
            endpoint,
            signer,
            {
              aminoTypes: this.aminoTypes,
              registry: this.registry,
              accountParser,
            },
          );

          if (!client) {
            throw new Error("'stargateClient' is not provided for cosmos tx");
          }
          try {
            const res = await this.validateCosmosGasBalance({
              chainID: tx.cosmosTx.chainID,
              signerAddress: tx.cosmosTx.signerAddress,
              client,
              messages: tx.cosmosTx.msgs,
              getFallbackGasAmount,
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
      }),
    );
    const txError = validateResult.find((res) => res && res?.error !== null);
    if (txError) {
      onValidateGasBalance?.({
        status: "error",
      });
      throw new Error(`${txError.error}`);
    }
    onValidateGasBalance?.({
      status: "completed",
    });
    return validateResult as unknown as clientTypes.Gas[];
  }

  /**
   *
   * Validate gas balance for cosmos messages returns a fee asset and StdFee to be used
   *
   */
  async validateCosmosGasBalance({
    chainID,
    signerAddress,
    client,
    messages,
    getFallbackGasAmount,
    txIndex,
    simulate,
  }: {
    chainID: string;
    signerAddress: string;
    client: SigningStargateClient;
    messages?: types.CosmosMsg[];
    getFallbackGasAmount?: clientTypes.GetFallbackGasAmount;
    txIndex?: number;
    simulate?: clientTypes.ExecuteRouteOptions["simulate"];
  }) {
    const [mainnetChains, testnetChains] = await Promise.all([
      this.chains(),
      this.chains({ onlyTestnets: true }),
    ]);

    const [assetsMainnet, assetsTestnet] = await Promise.all([
      this.assets({
        chainIDs: [chainID],
      }),
      this.assets({
        chainIDs: [chainID],
        onlyTestnets: true,
      }),
    ]);
    const assets = {
      ...assetsMainnet,
      ...assetsTestnet,
    };

    const chainAssets = assets[chainID];

    const skipChains = [...mainnetChains, ...testnetChains];
    const chain = skipChains.find((chain) => chain.chainID === chainID);
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
        const estimatedGas = await getCosmosGasAmountForMessage(
          client,
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
      if (chainID === "noble-1") {
        const fee = calculateFee(200_000, gasPrice);
        return fee;
      }
      return calculateFee(Math.ceil(parseFloat(estimatedGasAmount)), gasPrice);
    });
    const feeBalance = await this.balances({
      chains: {
        [chainID]: {
          address: signerAddress,
          denoms: feeAssets.map((asset) => asset.denom),
        },
      },
    });
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

      const balance = feeBalance.chains[chainID]?.denoms[asset.denom];

      if (!balance) {
        return {
          error: `(${chain?.prettyName}) Unable to find balance for ${symbol}`,
          asset,
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

  async validateUserAddresses(userAddresses: clientTypes.UserAddress[]) {
    const chains = await this.chains({
      includeEVM: true,
      includeSVM: true,
    });

    const validations = userAddresses.map((userAddress) => {
      const chain = chains.find(
        (chain) => chain.chainID === userAddress.chainID,
      );

      switch (chain?.chainType) {
        case types.ChainType.Cosmos:
          try {
            const { prefix } = fromBech32(userAddress.address);
            return chain.bech32Prefix === prefix;
          } catch (_error) {
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
