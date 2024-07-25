import { Coin, makeSignDoc as makeSignDocAmino } from '@cosmjs/amino';
import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate';
import { fromBase64 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import { Decimal } from '@cosmjs/math';
import { makePubkeyAnyFromAccount } from './proto-signing/pubkey';
import {
  EncodeObject,
  isOfflineDirectSigner,
  makeAuthInfoBytes,
  makeSignDoc,
  OfflineDirectSigner,
  OfflineSigner,
  Registry,
  TxBodyEncodeObject,
} from '@cosmjs/proto-signing';
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
} from '@cosmjs/stargate';
import {
  ChainRestAuthApi,
  ChainRestTendermintApi,
} from '@injectivelabs/sdk-ts/dist/cjs/client/chain/rest';
import {
  BigNumberInBase,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils';
import axios from 'axios';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { MsgExecute } from './codegen/initia/move/v1/tx';

import { accountParser } from './parser';
import { maxUint256, publicActions, WalletClient } from 'viem';

import { chains, initiaChains } from './chains';
import {
  circleAminoConverters,
  circleProtoRegistry,
} from './codegen/circle/client';
import { erc20ABI } from './constants/abis';
import { DEFAULT_GAS_DENOM_OVERRIDES } from './constants/constants';
import { createTransaction } from './injective';
import { RequestClient } from './request-client';
import {
  DEFAULT_GAS_MULTIPLIER,
  getEncodeObjectFromCosmosMessage,
  getEncodeObjectFromCosmosMessageInjective,
  getCosmosGasAmountForMessage,
} from './transactions';
import * as types from './types';
import * as clientTypes from './client-types';
import { msgsDirectRequestToJSON } from './types/converters';
import { Adapter } from '@solana/wallet-adapter-base';
import { Connection, Transaction } from '@solana/web3.js';
import { MsgInitiateTokenDeposit } from './codegen/opinit/ophost/v1/tx';

export const SKIP_API_URL = 'https://api.skip.build';

export class SkipRouter {
  protected requestClient: RequestClient;

  protected aminoTypes: AminoTypes;
  protected registry: Registry;

  protected endpointOptions: {
    endpoints?: Record<string, clientTypes.EndpointOptions>;
    getRpcEndpointForChain?: (chainID: string) => Promise<string>;
    getRestEndpointForChain?: (chainID: string) => Promise<string>;
  };

  protected getCosmosSigner?: (chainID: string) => Promise<OfflineSigner>;
  protected getEVMSigner?: (chainID: string) => Promise<WalletClient>;
  protected getSVMSigner?: () => Promise<Adapter>;

  constructor(options: clientTypes.SkipRouterOptions = {}) {
    this.requestClient = new RequestClient({
      baseURL: options.apiURL || SKIP_API_URL,
      apiKey: options.apiKey,
    });

    this.aminoTypes = new AminoTypes({
      ...createDefaultAminoConverters(),
      ...createWasmAminoConverters(),
      ...circleAminoConverters,
      ...(options.aminoTypes ?? {}),
    });

    this.registry = new Registry([
      ...defaultRegistryTypes,
      ['/cosmwasm.wasm.v1.MsgExecuteContract', MsgExecuteContract],
      ['/initia.move.v1.MsgExecute', MsgExecute],
      ['/opinit.ophost.v1.MsgInitiateTokenDeposit', MsgInitiateTokenDeposit],
      ...circleProtoRegistry,
      ...(options.registryTypes ?? []),
    ]);

    this.endpointOptions = options.endpointOptions ?? {};
    this.getCosmosSigner = options.getCosmosSigner;
    this.getEVMSigner = options.getEVMSigner;
    this.getSVMSigner = options.getSVMSigner;
  }

  async assets(
    options: types.AssetsRequest = {}
  ): Promise<Record<string, types.Asset[]>> {
    const response = await this.requestClient.get<
      {
        chain_to_assets_map: Record<string, { assets: types.AssetJSON[] }>;
      },
      types.AssetsRequestJSON
    >(
      '/v2/fungible/assets',
      types.assetsRequestToJSON({
        ...options,
      })
    );

    return Object.entries(response.chain_to_assets_map).reduce(
      (acc, [chainID, { assets }]) => {
        acc[chainID] = assets.map((asset) => types.assetFromJSON(asset));
        return acc;
      },
      {} as Record<string, types.Asset[]>
    );
  }

  async assetsFromSource(
    options: types.AssetsFromSourceRequest
  ): Promise<Record<string, types.Asset[]>> {
    const response = await this.requestClient.post<
      {
        dest_assets: Record<string, { assets: types.AssetJSON[] }>;
      },
      types.AssetsFromSourceRequestJSON
    >(
      '/v2/fungible/assets_from_source',
      types.assetsFromSourceRequestToJSON({
        ...options,
      })
    );

    return Object.entries(response.dest_assets).reduce(
      (acc, [chainID, { assets }]) => {
        acc[chainID] = assets.map((asset) => types.assetFromJSON(asset));
        return acc;
      },
      {} as Record<string, types.Asset[]>
    );
  }

  async assetsBetweenChains(
    options: types.AssetsBetweenChainsRequest
  ): Promise<types.AssetBetweenChains[]> {
    const response =
      await this.requestClient.post<types.AssetsBetweenChainsResponseJSON>(
        '/v2/fungible/assets_between_chains',
        types.assetsBetweenChainsRequestToJSON(options)
      );

    return types.assetsBetweenChainsResponseFromJSON(response)
      .assetsBetweenChains;
  }

  async bridges(): Promise<types.Bridge[]> {
    const response = await this.requestClient.get<types.BridgesResponseJSON>(
      '/v2/info/bridges'
    );

    return types.bridgesResponseFromJSON(response).bridges;
  }

  async chains(
    {
      includeEVM,
      includeSVM,
      onlyTestnets,
      chainIDs,
    }: {
      includeEVM?: boolean;
      includeSVM?: boolean;
      onlyTestnets?: boolean;
      chainIDs?: string[];
    } = { includeEVM: false, includeSVM: false }
  ): Promise<types.Chain[]> {
    const response = await this.requestClient.get<{
      chains: types.ChainJSON[];
    }>('/v2/info/chains', {
      include_evm: includeEVM,
      include_svm: includeSVM,
      only_testnets: onlyTestnets,
      chain_ids: chainIDs,
    });

    return response.chains.map((chain) => types.chainFromJSON(chain));
  }

  async executeRoute(options: clientTypes.ExecuteRouteOptions) {
    const { route, userAddresses } = options;

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
      raise('executeRoute error: invalid address list');
    }

    const messages = await this.messages({
      sourceAssetDenom: route.sourceAssetDenom,
      sourceAssetChainID: route.sourceAssetChainID,
      destAssetDenom: route.destAssetDenom,
      destAssetChainID: route.destAssetChainID,
      amountIn: route.amountIn,
      amountOut: route.estimatedAmountOut || '0',
      addressList: addressList,
      operations: route.operations,
      slippageTolerancePercent: options.slippageTolerancePercent || '1',
    });
    await this.executeTxs({ ...options, txs: messages.txs });
  }

  async executeTxs(
    options: clientTypes.ExecuteRouteOptions & { txs: types.Tx[] }
  ) {
    const {
      txs,
      userAddresses,
      validateGasBalance,
      getGasPrice,
      gasAmountMultiplier = DEFAULT_GAS_MULTIPLIER,
      getFallbackGasAmount,
    } = options;
    let gasTokenUsed: Coin | undefined;
    if (validateGasBalance) {
      // check balances on chains where a tx is initiated
      gasTokenUsed = await this.validateGasBalances({
        txs,
        userAddresses,
        getOfflineSigner: options.getCosmosSigner,
        getGasPrice,
        gasAmountMultiplier,
        getFallbackGasAmount,
      });
    }

    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      if (!tx) {
        raise(`executeRoute error: invalid message at index ${i}`);
      }

      let txResult: { chainID: string; txHash: string };
      if ('cosmosTx' in tx) {
        // TODO: use typeguard instead

        const cosmosTx = tx.cosmosTx;
        const currentUserAddress = userAddresses.find(
          (x) => x.chainID === cosmosTx.chainID
        )?.address;

        if (!currentUserAddress) {
          raise(
            `executeRoute error: invalid address for chain '${cosmosTx.chainID}'`
          );
        }

        if (cosmosTx.chainID === 'stride-1' && !gasTokenUsed) {
          const getOfflineSigner =
            options.getCosmosSigner || this.getCosmosSigner;
          if (!getOfflineSigner) {
            throw new Error(
              "executeRoute error: 'getCosmosSigner' is not provided or configured in skip router"
            );
          }
          const signer = await getOfflineSigner(tx.cosmosTx.chainID);

          const endpoint = await this.getRpcEndpointForChain(
            tx.cosmosTx.chainID
          );
          // @note: A new client is created for both the gasbalance validation here as the execution later...
          const client = await SigningStargateClient.connectWithSigner(
            endpoint,
            signer,
            {
              aminoTypes: this.aminoTypes,
              registry: this.registry,
              accountParser,
            }
          );
          gasTokenUsed = await this.validateCosmosGasBalance({
            chainID: cosmosTx.chainID,
            messages: cosmosTx.msgs,
            signerAddress: currentUserAddress,
            getGasPrice,
            gasAmountMultiplier,
            getFallbackGasAmount,
            client,
          });
        }

        const txResponse = await this.executeCosmosMessage({
          messages: cosmosTx.msgs,
          chainID: cosmosTx.chainID,
          getCosmosSigner: options.getCosmosSigner,
          getGasPrice: getGasPrice,
          gasAmountMultiplier,
          signerAddress: currentUserAddress,
          getFallbackGasAmount,
          gasTokenUsed,
        });

        txResult = {
          chainID: cosmosTx.chainID,
          txHash: txResponse.transactionHash,
        };
      } else if ('evmTx' in tx) {
        const txResponse = await this.executeEvmMsg(tx, options);
        txResult = {
          chainID: tx.evmTx.chainID,
          txHash: txResponse.transactionHash,
        };
      } else if ('svmTx' in tx) {
        const { svmTx } = tx;
        const getSVMSigner = options.getSVMSigner || this.getSVMSigner;
        if (!getSVMSigner) {
          throw new Error(
            "executeRoute error: 'getSVMSigner' is not provided or configured in skip router"
          );
        }
        const svmSigner = await getSVMSigner();

        const txReceipt = await this.executeSVMTransaction({
          signer: svmSigner,
          message: svmTx,
        });

        txResult = {
          chainID: svmTx.chainID,
          txHash: txReceipt,
        };
      } else {
        raise(`executeRoute error: invalid message type`);
      }

      if (options.onTransactionBroadcast) {
        await options.onTransactionBroadcast({ ...txResult });
      }

      const txStatusResponse = await this.waitForTransaction({
        ...txResult,
        onTransactionTracked: options.onTransactionTracked,
      });

      if (options.onTransactionCompleted) {
        await options.onTransactionCompleted(
          txResult.chainID,
          txResult.txHash,
          txStatusResponse
        );
      }
    }
  }

  async executeEvmMsg(
    message: { evmTx: types.EvmTx },
    options: clientTypes.ExecuteRouteOptions
  ) {
    const { evmTx } = message;

    const getEVMSigner = options.getEVMSigner || this.getEVMSigner;
    if (!getEVMSigner) {
      throw new Error('Unable to get EVM signer');
    }

    const evmSigner = await getEVMSigner(evmTx.chainID);

    return await this.executeEVMTransaction({
      message: evmTx,
      signer: evmSigner,
    });
  }

  async executeCosmosMessage(options: clientTypes.ExecuteCosmosMessage) {
    const {
      signerAddress,
      getCosmosSigner,
      chainID,
      messages,
      getGasPrice,
      gasAmountMultiplier,
      getFallbackGasAmount,
      gasTokenUsed,
    } = options;

    const getOfflineSigner =
      this.getCosmosSigner ||
      getCosmosSigner ||
      raise(
        "executeRoute error: 'getCosmosSigner' is not provided or configured in skip router"
      );

    const signer = await getOfflineSigner(chainID);

    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress
    );

    if (!accountFromSigner) {
      throw new Error(
        'executeMultiChainMessage error: failed to retrieve account from signer'
      );
    }

    const endpoint = await this.getRpcEndpointForChain(chainID);

    const stargateClient = await SigningStargateClient.connectWithSigner(
      endpoint,
      signer,
      {
        aminoTypes: this.aminoTypes,
        registry: this.registry,
        accountParser,
      }
    );

    // @note: reusing the stargate client here and for broadcast 👍
    const fee = await this.estimateGasForMessage({
      stargateClient,
      chainID,
      signerAddress,
      gasAmountMultiplier,
      getGasPrice,
      messages,
      getFallbackGasAmount,
    });

    if (gasTokenUsed) {
      const _fee = fee.amount.find((x) => x.denom === gasTokenUsed.denom);

      if (_fee) {
        // @ts-expect-error - fee amount is readonly
        fee.amount = [_fee] as Coin[];
      }
    }

    if (fee.amount.length > 1) {
      // @ts-expect-error - fee amount is readonly
      fee.amount = [fee.amount[0]];
    }

    const { accountNumber, sequence } = await this.getAccountNumberAndSequence(
      signerAddress,
      chainID
    );

    let rawTx: TxRaw;
    if (isOfflineDirectSigner(signer)) {
      rawTx = await this.signCosmosMessageDirect({
        signerAddress,
        signer,
        chainID,
        cosmosMsgs: messages,
        fee,
        signerData: {
          accountNumber,
          sequence,
          chainId: chainID,
        },
      });
    } else {
      rawTx = await this.signCosmosMessageAmino({
        signerAddress,
        signer,
        chainID,
        cosmosMsgs: messages,
        fee,
        signerData: {
          accountNumber,
          sequence,
          chainId: chainID,
        },
      });
    }

    const txBytes = TxRaw.encode(rawTx).finish();

    const tx = await stargateClient.broadcastTx(txBytes);

    return tx;
  }

  async estimateGasForMessage({
    stargateClient,
    chainID,
    signerAddress,
    gasAmountMultiplier,
    getGasPrice,
    messages,
    encodedMsgs,
    getFallbackGasAmount,
  }: {
    stargateClient: SigningStargateClient;
    chainID: string;
    signerAddress: string;
    gasAmountMultiplier: number | undefined;
    getGasPrice?: clientTypes.GetGasPrice;
    messages?: types.CosmosMsg[];
    encodedMsgs?: EncodeObject[];
    getFallbackGasAmount?: clientTypes.GetFallbackGasAmount;
  }) {
    const estimatedGasAmount = await (async () => {
      try {
        const estimatedGas = await getCosmosGasAmountForMessage(
          stargateClient,
          signerAddress,
          chainID,
          messages,
          encodedMsgs,
          gasAmountMultiplier
        );
        return estimatedGas;
      } catch (error) {
        if (getFallbackGasAmount) {
          const fallbackGasAmount = await getFallbackGasAmount(
            chainID,
            'cosmos'
          );
          if (!fallbackGasAmount) {
            raise(
              `executeRoute error: unable to estimate gas for message(s) ${
                messages || encodedMsgs
              }`
            );
          }
          return String(fallbackGasAmount);
        }
        raise(
          `executeRoute error: unable to estimate gas for message(s) ${
            messages || encodedMsgs
          }`
        );
      }
    })();

    const gasPrice =
      (getGasPrice
        ? await getGasPrice(chainID, 'cosmos')
        : await this.getRecommendedGasPrice(chainID)) ||
      raise(
        `executeRoute error: unable to get gas prices for chain '${chainID}'`
      );

    const fee = calculateFee(
      Math.ceil(parseFloat(estimatedGasAmount)),
      gasPrice
    );

    if (chainID === 'stride-1') {
      const chains = await this.chains();
      const tiaOnStride = chains
        .find((x) => x.chainID === chainID)
        ?.feeAssets.find(
          (item) =>
            item.denom.toLowerCase() ===
            'ibc/BF3B4F53F3694B66E13C23107C84B6485BD2B96296BB7EC680EA77BBA75B4801'.toLowerCase()
        );
      if (tiaOnStride && tiaOnStride.gasPrice) {
        // not needed for now
        // const tiaFeeInfo = {
        //   denom: tiaOnStride.denom,
        //   gasPrice: {
        //     low: tiaOnStride.gasPrice?.low
        //       ? `${tiaOnStride.gasPrice?.low}`
        //       : "",
        //     average: tiaOnStride.gasPrice?.average
        //       ? `${tiaOnStride.gasPrice?.average}`
        //       : "",
        //     high: tiaOnStride.gasPrice?.high
        //       ? `${tiaOnStride.gasPrice?.high}`
        //       : "",
        //   },
        // };

        let price = tiaOnStride.gasPrice.average;
        if (price === '') {
          price = tiaOnStride.gasPrice.high;
        }
        if (price === '') {
          price = tiaOnStride.gasPrice.low;
        }
        const tiaOnStrideGasPrice = new GasPrice(
          Decimal.fromUserInput(price, 18),
          tiaOnStride.denom
        );
        const tiaOnStrideFee = calculateFee(
          Math.ceil(parseFloat(estimatedGasAmount)),
          tiaOnStrideGasPrice
        );
        if (tiaOnStrideFee.amount[0]) {
          (fee.amount as Coin[]).push(tiaOnStrideFee.amount[0]);
        }
      }
    }

    if (!fee) {
      raise(
        `executeRoute error: unable to get fee for message(s) ${
          messages || encodedMsgs
        }`
      );
    }
    return fee;
  }

  async executeEVMTransaction({
    message,
    signer,
  }: {
    message: types.EvmTx;
    signer: WalletClient;
  }) {
    if (!signer.account) {
      throw new Error(
        'executeEVMTransaction error: failed to retrieve account from signer'
      );
    }

    const extendedSigner = signer.extend(publicActions);

    // check for approvals
    for (const requiredApproval of message.requiredERC20Approvals) {
      const allowance = await extendedSigner.readContract({
        address: requiredApproval.tokenContract as `0x${string}`,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [
          signer.account.address as `0x${string}`,
          requiredApproval.spender as `0x${string}`,
        ],
      });

      if (allowance > BigInt(requiredApproval.amount)) {
        continue;
      }

      const txHash = await extendedSigner.writeContract({
        account: signer.account,
        address: requiredApproval.tokenContract as `0x${string}`,
        abi: erc20ABI,
        functionName: 'approve',
        args: [requiredApproval.spender as `0x${string}`, maxUint256],
        chain: signer.chain,
      });

      const receipt = await extendedSigner.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === 'reverted') {
        throw new Error(
          `executeEVMTransaction error: evm tx reverted for hash ${receipt.transactionHash}`
        );
      }
    }

    // execute tx
    const txHash = await extendedSigner.sendTransaction({
      account: signer.account,
      to: message.to as `0x${string}`,
      data: `0x${message.data}`,
      chain: signer.chain,
      value: message.value === '' ? undefined : BigInt(message.value),
    });

    const receipt = await extendedSigner.waitForTransactionReceipt({
      hash: txHash,
    });

    return receipt;
  }

  async executeSVMTransaction({
    signer,
    message,
  }: {
    signer: Adapter;
    message: types.SvmTx;
  }) {
    const _tx = Buffer.from(message.tx, 'base64');
    const transaction = Transaction.from(_tx);
    const endpoint = await this.getRpcEndpointForChain(message.chainID);
    const connection = new Connection(endpoint);
    let signature;
    if ('signTransaction' in signer) {
      const tx = await signer.signTransaction(transaction);
      const serializedTx = tx.serialize();

      await this.submitTransaction({
        chainID: message.chainID,
        tx: Buffer.from(serializedTx).toString('base64'),
      });

      const sig = await connection.sendRawTransaction(serializedTx, {
        preflightCommitment: 'confirmed',
        maxRetries: 5,
      });

      signature = sig;
    }

    if (!signature) {
      throw new Error('executeSVMTransaction error: signature not found');
    }

    let getStatusCount = 0;
    let errorCount = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const result = await connection.getSignatureStatus(signature, {
          searchTransactionHistory: true,
        });
        if (result?.value?.confirmationStatus === 'confirmed') {
          return signature;
        } else if (getStatusCount > 12) {
          await wait(3000);
          throw new Error(
            `executeSVMTransaction error: waiting finalized status timed out for ${signature}`
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
    options: clientTypes.SignCosmosMessageDirectOptions
  ): Promise<TxRaw> {
    const {
      signer,
      signerAddress,
      chainID,
      cosmosMsgs,
      fee,
      signerData: { accountNumber, sequence, chainId },
    } = options;

    if (chainID.includes('evmos')) {
      return this.signCosmosMessageDirectEvmos(
        signerAddress,
        signer,
        cosmosMsgs,
        fee,
        { accountNumber, sequence, chainId }
      );
    }

    if (chainID.includes('injective')) {
      return this.signCosmosMessageDirectInjective(
        signerAddress,
        signer,
        cosmosMsgs,
        fee,
        { accountNumber, sequence, chainId }
      );
    }

    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress
    );

    if (!accountFromSigner) {
      throw new Error(
        'signCosmosMessageDirect error: failed to retrieve account from signer'
      );
    }

    const messages = cosmosMsgs.map((cosmosMsg) =>
      getEncodeObjectFromCosmosMessage(cosmosMsg)
    );

    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
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
      fee.payer
    );

    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      accountNumber
    );

    const { signature, signed } = await signer.signDirect(
      signerAddress,
      signDoc
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
    { accountNumber, sequence, chainId }: SignerData
  ): Promise<TxRaw> {
    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress
    );

    if (!accountFromSigner) {
      throw new Error(
        'signCosmosMessageDirectEvmos: failed to retrieve account from signer'
      );
    }

    const messages = cosmosMsgs.map((cosmosMsg) =>
      getEncodeObjectFromCosmosMessageInjective(cosmosMsg)
    );

    const pk = Buffer.from(accountFromSigner.pubkey).toString('base64');

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
      signDoc
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
    { accountNumber, sequence, chainId }: SignerData
  ): Promise<TxRaw> {
    const accounts = await signer.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === signerAddress
    );

    if (!accountFromSigner) {
      throw new Error(
        'signCosmosMessageDirectInjective: failed to retrieve account from signer'
      );
    }

    const restEndpoint = await this.getRestEndpointForChain(chainId);

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
    const latestHeight = latestBlock.header.height;
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(
      DEFAULT_BLOCK_TIMEOUT_HEIGHT
    );

    const pk = Buffer.from(accountFromSigner.pubkey).toString('base64');

    const messages = cosmosMsgs.map((cosmosMsg) =>
      getEncodeObjectFromCosmosMessageInjective(cosmosMsg)
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
      signDoc
    );

    return TxRaw.fromPartial({
      bodyBytes: directSignResponse.signed.bodyBytes,
      authInfoBytes: directSignResponse.signed.authInfoBytes,
      signatures: [fromBase64(directSignResponse.signature.signature)],
    });
  }

  async signCosmosMessageAmino(
    options: clientTypes.SignCosmosMessageAminoOptions
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
      (account) => account.address === signerAddress
    );

    if (!accountFromSigner) {
      throw new Error(
        'signCosmosMessageAmino: failed to retrieve account from signer'
      );
    }

    const messages = cosmosMsgs.map((cosmosMsg) =>
      getEncodeObjectFromCosmosMessage(cosmosMsg)
    );

    const aminoMsgTransferIndex = messages.findIndex(
      (x) => x.typeUrl === '/ibc.applications.transfer.v1.MsgTransfer'
    );
    if (aminoMsgTransferIndex !== -1) {
      const endpoint = await this.getRpcEndpointForChain(chainID);
      const client = await StargateClient.connect(endpoint, {
        accountParser,
      });

      const currentHeight = await client.getHeight();

      messages[aminoMsgTransferIndex]!.value.timeoutHeight = {
        revisionHeight: currentHeight + 100,
        revisionNumber: currentHeight + 100,
      };

      messages[aminoMsgTransferIndex]!.value.timeoutTimestamp = 0;
    }

    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    const msgs = messages.map((msg) => this.aminoTypes.toAmino(msg));

    const signDoc = makeSignDocAmino(
      msgs,
      fee,
      chainId,
      '',
      accountNumber,
      sequence
    );

    const { signature, signed } = await signer.signAmino(
      signerAddress,
      signDoc
    );

    const signedTxBody = {
      messages: signed.msgs.map((msg) => this.aminoTypes.fromAmino(msg)),
      memo: signed.memo,
    };

    signedTxBody.messages[0]!.value.memo = messages[0]!.value.memo;

    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
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
      signMode
    );

    return TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }

  async messages(options: types.MsgsRequest): Promise<types.MsgsResponse> {
    const response = await this.requestClient.post<
      types.MsgsResponseJSON,
      types.MsgsRequestJSON
    >('/v2/fungible/msgs', {
      ...types.msgsRequestToJSON(options),
      slippage_tolerance_percent: options.slippageTolerancePercent || '0',
    });
    return types.messageResponseFromJSON(response);
  }

  async route(options: types.RouteRequest): Promise<types.RouteResponse> {
    const response = await this.requestClient.post<
      types.RouteResponseJSON,
      types.RouteRequestJSON
    >('/v2/fungible/route', {
      ...types.routeRequestToJSON(options),
      cumulative_affiliate_fee_bps: options.cumulativeAffiliateFeeBPS || '0',
    });

    return types.routeResponseFromJSON(response);
  }

  async msgsDirect(
    options: types.MsgsDirectRequest
  ): Promise<types.MsgsDirectResponse> {
    const response = await this.requestClient.post<
      types.MsgsDirectResponseJSON,
      types.MsgsDirectRequestJSON
    >('/v2/fungible/msgs_direct', {
      ...msgsDirectRequestToJSON(options),
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
      | types.AssetRecommendationRequest[]
  ) {
    const options = types.recommendAssetsRequestToJSON({
      requests: Array.isArray(request) ? request : [request],
    });

    const response =
      await this.requestClient.post<types.RecommendAssetsResponseJSON>(
        '/v2/fungible/recommend_assets',
        options
      );

    return types.recommendAssetsResponseFromJSON(response)
      .recommendationEntries;
  }

  async ibcOriginAssets(
    assets: types.DenomWithChainID[]
  ): Promise<types.AssetOrError[]> {
    const response =
      await this.requestClient.post<types.OriginAssetsResponseJSON>(
        '/v2/fungible/ibc_origin_assets',
        types.originAssetsRequestToJSON({
          assets,
        })
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
    >('/v2/tx/submit', {
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
        >('/v2/tx/track', {
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
        >('/v2/tx/status', {
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
    if (onTransactionTracked) {
      await onTransactionTracked({ txHash, chainID, explorerLink });
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const txStatusResponse = await this.transactionStatus({
        chainID,
        txHash,
      });

      if (txStatusResponse.status === 'STATE_COMPLETED') {
        return txStatusResponse;
      }

      await wait(1000);
    }
  }

  async venues(onlyTestnets?: boolean): Promise<types.SwapVenue[]> {
    const response = await this.requestClient.get<{
      venues: types.SwapVenueJSON[];
    }>('/v2/fungible/venues', {
      only_testnets: onlyTestnets,
    });

    return response.venues.map((venue) => types.swapVenueFromJSON(venue));
  }

  async getCosmsosGasAmountForMessage(
    client: SigningStargateClient,
    signerAddress: string,
    chainID: string,
    cosmosMessages: types.CosmosMsg[]
  ): Promise<string> {
    return getCosmosGasAmountForMessage(
      client,
      signerAddress,
      chainID,
      cosmosMessages
    );
  }

  async getAccountNumberAndSequence(address: string, chainID: string) {
    if (chainID.includes('dymension')) {
      return this.getAccountNumberAndSequenceFromDymension(address, chainID);
    }
    const endpoint = await this.getRpcEndpointForChain(chainID);
    const client = await StargateClient.connect(endpoint, {
      accountParser,
    });
    const account = await client.getAccount(address);
    if (!account) {
      throw new Error(
        'getAccountNumberAndSequence: failed to retrieve account'
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
    chainID: string
  ) {
    const endpoint = await this.getRestEndpointForChain(chainID);

    const response = await axios.get(
      `${endpoint}/cosmos/auth/v1beta1/accounts/${address}`
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
    chainID: string
  ) {
    const endpoint = await this.getRestEndpointForChain(chainID);

    const response = await axios.get(
      `${endpoint}/cosmos/auth/v1beta1/accounts/${address}`
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
    chainID: string
  ) {
    const endpoint = await this.getRestEndpointForChain(chainID);

    const chainRestAuthApi = new ChainRestAuthApi(endpoint);

    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(address);

    return {
      accountNumber: parseInt(
        accountDetailsResponse.account.base_account.account_number
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

    let chain;
    chain = chains().find((chain) => chain.chain_id === chainID);
    if (!chain) {
      chain = initiaChains().find((chain) => chain.chain_id === chainID);
    }
    if (!chain) {
      throw new Error(
        `getRpcEndpointForChain: failed to find chain id '${chainID}' in registry`
      );
    }

    const endpoint = chain.apis?.rpc?.[0]?.address;

    if (!endpoint) {
      throw new Error(
        `getRpcEndpointForChain error: failed to find RPC endpoint for chain '${chainID}'`
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
      chain = initiaChains().find((chain) => chain.chain_id === chainID);
    }
    if (!chain) {
      throw new Error(
        `getRestEndpointForChain error: failed to find chain id '${chainID}' in registry`
      );
    }

    const endpoint = chain.apis?.rest?.[0]?.address;

    if (!endpoint) {
      throw new Error(
        `getRestEndpointForChain error: failed to find REST endpoint for chain '${chainID}'`
      );
    }

    return endpoint;
  }

  async getCosmosFeeForMessage(
    chainID: string,
    msgs: types.CosmosMsg[],
    gasAmountMultiplier: number = DEFAULT_GAS_MULTIPLIER,
    signer?: OfflineSigner,
    gasPrice?: GasPrice
  ) {
    gasPrice ||= await this.getRecommendedGasPrice(chainID);
    if (!gasPrice) {
      throw new Error(
        `getFeeForMessage error: Unable to get gas price for chain: ${chainID}`
      );
    }

    signer ||= await this.getCosmosSigner?.(chainID);
    if (!signer) {
      throw new Error(
        "getFeeForMessage error: signer is not provided or 'getCosmosSigner' is not configured in skip router"
      );
    }

    const accounts = await signer.getAccounts();
    const signerAddress =
      accounts[0]?.address ||
      raise(
        `getFeeForMessage error: unable to resolve account address from signer`
      );

    const endpoint = await this.getRpcEndpointForChain(chainID);

    const client = await SigningStargateClient.connectWithSigner(
      endpoint,
      signer,
      {
        aminoTypes: this.aminoTypes,
        registry: this.registry,
        accountParser,
      }
    );

    const gasNeeded = await getCosmosGasAmountForMessage(
      client,
      signerAddress,
      chainID,
      msgs,
      undefined,
      gasAmountMultiplier
    );

    const fee = calculateFee(Math.ceil(parseFloat(gasNeeded)), gasPrice);

    if (!fee) {
      throw new Error('getFeeForMessage error: unable to get fee for message');
    }

    return fee;
  }

  async getRecommendedGasPrice(chainID: string) {
    const feeInfo = await this.getFeeInfoForChain(chainID);

    if (!feeInfo || !feeInfo.gasPrice) {
      return undefined;
    }

    let price = feeInfo.gasPrice.average;
    if (price === '') {
      price = feeInfo.gasPrice.high;
    }
    if (price === '') {
      price = feeInfo.gasPrice.low;
    }

    return new GasPrice(Decimal.fromUserInput(price, 18), feeInfo.denom);
  }

  async getFeeInfoForChain(
    chainID: string
  ): Promise<types.FeeAsset | undefined> {
    const skipChains = [
      ...(await this.chains({})),
      ...(await this.chains({ onlyTestnets: true })),
    ];

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
      chain = initiaChains().find((chain) => chain.chain_id === chainID);
    }
    if (!chain) {
      return undefined;
    }

    if (!chain.fees) {
      return undefined;
    }

    const registryFeeInfo = chain.fees.fee_tokens.find(
      (feeToken) => feeToken.denom === defaultGasToken
    );

    if (!registryFeeInfo) {
      return undefined;
    }

    return {
      denom: registryFeeInfo.denom,
      gasPrice: {
        low: registryFeeInfo.low_gas_price
          ? `${registryFeeInfo.low_gas_price}`
          : '',
        average: registryFeeInfo.average_gas_price
          ? `${registryFeeInfo.average_gas_price}`
          : '',
        high: registryFeeInfo.high_gas_price
          ? `${registryFeeInfo.high_gas_price}`
          : '',
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
      chain = initiaChains().find((chain) => chain.chain_id === chainID);
    }
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
        (feeToken) => feeToken.denom === stakingTokens[0]?.denom
      );

      if (feeAsset) {
        return feeAsset.denom;
      }
    }

    // next attempt to get the first non-IBC asset in the fee_tokens array, at least this token will be native to the chain
    const nonIBCAsset = chain.fees.fee_tokens.find(
      (token) =>
        !token.denom.startsWith('ibc/') && !token.denom.startsWith('l2/')
    );
    if (nonIBCAsset) {
      return nonIBCAsset.denom;
    }

    const nonL2Asset = chain.fees.fee_tokens.find(
      (token) => !token.denom.startsWith('l2/')
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
      chain = initiaChains().find((chain) => chain.chain_id === chainID);
    }
    if (!chain) {
      throw new Error(
        `getStakingTokensForChain error: failed to find chain id '${chainID}' in registry`
      );
    }

    if (!chain.staking) {
      return undefined;
    }

    return chain.staking.staking_tokens;
  }

  async validateGasBalances({
    txs,
    userAddresses,
    getOfflineSigner,
    getGasPrice,
    gasAmountMultiplier,
    getFallbackGasAmount,
  }: {
    txs: types.Tx[];
    userAddresses: clientTypes.UserAddress[];
    getOfflineSigner?: (chainID: string) => Promise<OfflineSigner>;
    getGasPrice?: clientTypes.GetGasPrice;
    gasAmountMultiplier?: number;
    getFallbackGasAmount?: clientTypes.GetFallbackGasAmount;
  }) {
    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      if (!tx) {
        raise(`validateGasBalances error: invalid tx at index ${i}`);
      }
      if ('cosmosTx' in tx) {
        const msgs = tx.cosmosTx.msgs;
        if (!msgs) {
          raise(`validateGasBalances error: invalid msgs ${msgs}`);
        }

        getOfflineSigner = getOfflineSigner || this.getCosmosSigner;
        if (!getOfflineSigner) {
          throw new Error(
            "executeRoute error: 'getCosmosSigner' is not provided or configured in skip router"
          );
        }
        const signer = await getOfflineSigner(tx.cosmosTx.chainID);

        const endpoint = await this.getRpcEndpointForChain(tx.cosmosTx.chainID);
        // @note: A new client is created for both the gasbalance validation here as the execution later...
        const client = await SigningStargateClient.connectWithSigner(
          endpoint,
          signer,
          {
            aminoTypes: this.aminoTypes,
            registry: this.registry,
            accountParser,
          }
        );

        const currentAddress =
          userAddresses.find(
            (address) => address.chainID === tx.cosmosTx.chainID
          )?.address ||
          raise(
            `validateGasBalance error: invalid address for chain '${tx.cosmosTx.chainID}'`
          );

        return await this.validateCosmosGasBalance({
          client,
          signerAddress: currentAddress,
          chainID: tx.cosmosTx.chainID,
          messages: msgs,
          getGasPrice,
          gasAmountMultiplier,
          getFallbackGasAmount,
        });
      }
    }
  }

  async validateCosmosGasBalance({
    chainID,
    client,
    signerAddress,
    messages,
    getGasPrice,
    gasAmountMultiplier,
    getFallbackGasAmount,
  }: {
    client: SigningStargateClient;
    signerAddress: string;
    chainID: string;
    messages: types.CosmosMsg[];
    getGasPrice?: clientTypes.GetGasPrice;
    gasAmountMultiplier?: number;
    getFallbackGasAmount?: clientTypes.GetFallbackGasAmount;
  }) {
    const fee = await this.estimateGasForMessage({
      stargateClient: client,
      chainID,
      signerAddress,
      gasAmountMultiplier,
      getGasPrice,
      messages,
      getFallbackGasAmount,
    });

    if (!fee.amount[0]) {
      throw new Error(
        `validateCosmosGasBalance error: unable to get fee amount`
      );
    }
    const mainnetAssets = await this.assets();
    const testnetAssets = await this.assets({ onlyTestnets: true });
    const assets = { ...mainnetAssets, ...testnetAssets };
    const assetByChainID = assets[chainID];

    const result = await Promise.all(
      fee.amount.map(async (amount) => {
        const asset = assetByChainID?.find(
          (asset) => asset.denom.toLowerCase() === amount.denom.toLowerCase()
        );
        if (!asset || !asset.decimals) {
          return {
            errMessage: `${amount.denom} is not found in assets for ${chainID}.`,
            amount,
          };
        }
        const balance = await client.getBalance(signerAddress, amount.denom);

        if (parseInt(balance.amount) < parseInt(amount.amount)) {
          const formattedBalance =
            Number(balance.amount) / Math.pow(10, asset.decimals);
          const formattedAmount =
            Number(amount.amount) / Math.pow(10, asset.decimals);
          return {
            errMessage: `Insufficient fee token to initiate transfer on ${chainID}. Need ${formattedAmount} ${
              asset.recommendedSymbol || amount.denom
            }, but only have ${formattedBalance} ${
              asset.recommendedSymbol || amount.denom
            }.`,
            amount,
          };
        }
        return {
          errMessage: null,
          amount,
        };
      })
    );

    const successful = result.find((res) => res.errMessage === null);
    if (!successful) {
      if (result.length > 1) {
        throw new Error(
          result[0]?.errMessage ||
            `Insufficient fee token to initiate transfer on ${chainID}.`
        );
      }
      throw new Error(
        result[0]?.errMessage ||
          `Insufficient fee token to initiate transfer on ${chainID}.`
      );
    }
    return successful.amount;
  }
}

function raise(message?: string, options?: ErrorOptions): never {
  throw new Error(message, options);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
