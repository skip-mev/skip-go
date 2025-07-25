import type { OfflineSigner } from "@cosmjs/proto-signing";
import { ChainType } from "../types/swaggerTypes";
import type { CosmosMsg } from "../types/swaggerTypes";
import { BigNumber } from "bignumber.js";
import { getSigningStargateClient } from "./getSigningStargateClient";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";
import { balances } from "../api/postBalances";
import { ClientState } from "src/state/clientState";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import type { GetFallbackGasAmount } from "src/types/client-types";
import { getCosmosGasAmountForMessage } from "./getCosmosGasAmountForMessage";

export type ValidateCosmosGasBalanceProps = {
  chainId: string;
  signerAddress: string;
  messages?: CosmosMsg[];
  getOfflineSigner?: (chainId: string) => Promise<OfflineSigner>;
  getFallbackGasAmount?: GetFallbackGasAmount;
  txIndex?: number;
  simulate?: ExecuteRouteOptions["simulate"];
  getCosmosPriorityFeeDenom?: ExecuteRouteOptions["getCosmosPriorityFeeDenom"];
  isMultiRoutes?: boolean;
};

/**
 *
 * Validate gas balance for cosmos messages returns a fee asset and StdFee to be used
 *
 */
export const validateCosmosGasBalance = async ({
  chainId,
  signerAddress,
  messages,
  getFallbackGasAmount,
  getOfflineSigner,
  txIndex,
  simulate,
  getCosmosPriorityFeeDenom,
  isMultiRoutes
}: ValidateCosmosGasBalanceProps) => {
  const skipAssets = (await ClientState.getSkipAssets({ chainId }))?.[chainId];
  const skipChains = await ClientState.getSkipChains();

  const prioFeeDenom = await getCosmosPriorityFeeDenom?.(chainId);
  const chain = skipChains?.find((c) => c.chainId === chainId);
  if (!chain) {
    throw new Error(`failed to find chain id '${chainId}'`);
  }

  const { feeAssets } = chain;
  if (!feeAssets) {
    throw new Error(`failed to find fee assets for chain id '${chainId}'`);
  }
  const estimatedGasAmount = await (async () => {
    try {
      if (simulate === false) throw new Error("simulate");
      // Skip gas estimation for noble-1 in multi tx route
      if (txIndex !== 0 && chainId === "noble-1") {
        return "0";
      }
      const { stargateClient } = await getSigningStargateClient({
        chainId,
        getOfflineSigner,
      });
      const estimatedGas = await getCosmosGasAmountForMessage(
        stargateClient,
        signerAddress,
        chainId,
        messages
      );
      console.log("estimatedGas", estimatedGas);
      return estimatedGas;
    } catch (e) {
      const error = e as Error;
      if (error.message === "simulate" && !getFallbackGasAmount) {
        throw new Error(`unable to get gas amount for ${chainId}'s message(s)`);
      }
      if (getFallbackGasAmount) {
        const fallbackGasAmount = await getFallbackGasAmount(
          chainId,
          ChainType.Cosmos
        );
        if (!fallbackGasAmount) {
          throw new Error(`unable to estimate gas for message(s) ${messages}`);
        }
        return String(fallbackGasAmount);
      }
      throw error;
    }
  })();
  const fees = feeAssets.map((asset) => {
    const gasPrice = (() => {
      if (!asset?.gasPrice) return undefined;
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
        asset?.denom ?? ""
      );
    })();
    if (!gasPrice) {
      return null;
    }
    if (chainId === "noble-1") {
      if (isMultiRoutes && txIndex === 0) {
        return calculateFee(Math.ceil(parseFloat(estimatedGasAmount)), gasPrice);
       }
      if (
        asset.denom.toLowerCase() ===
        "ibc/EF48E6B1A1A19F47ECAEA62F5670C37C0580E86A9E88498B7E393EB6F49F33C0".toLowerCase()
      ) {
        const fee = calculateFee(2_000_000, gasPrice);
        return fee;
      }
      const fee = calculateFee(200_000, gasPrice);
      return fee;
    }
    return calculateFee(Math.ceil(parseFloat(estimatedGasAmount)), gasPrice);
  });

  const feeBalance = await balances({
    chains: {
      [chainId]: {
        address: signerAddress,
        denoms: feeAssets.map((asset) => asset.denom ?? ""),
      },
    },
  });
  const validatedAssets = feeAssets.map((asset, index) => {
    const chainAsset = skipAssets?.find((x) => x.denom === asset.denom);
    const symbol = chainAsset?.recommendedSymbol?.toUpperCase();

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
    if (txIndex !== 0 && chainId === "noble-1") {
      return {
        error: null,
        asset,
        fee,
      };
    }

    let balance = feeBalance?.chains?.[chainId]?.denoms?.[asset?.denom ?? ""];

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

    if (parseInt(balance?.amount ?? "") < parseInt(fee.amount[0]?.amount)) {
      const userAmount = new BigNumber(parseFloat(balance?.amount ?? ""))
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

  if (prioFeeDenom) {
    const availableAssets = validatedAssets.filter(
      (res) => res?.error === null
    );
    const prioFeeAsset = availableAssets.find(
      (res) => res?.asset?.denom === prioFeeDenom
    );
    if (prioFeeAsset) {
      return prioFeeAsset;
    }
  }

  const feeUsed = validatedAssets.find((res) => res?.error === null);
  if (!feeUsed) {
    if (validatedAssets.length > 1) {
      throw new Error(
        validatedAssets[0]?.error ||
          `Insufficient fee token to initiate transfer on ${chain.prettyName}.`
      );
    }
    throw new Error(
      validatedAssets[0]?.error ||
        `Insufficient fee token to initiate transfer on ${chain.prettyName}.`
    );
  }
  return feeUsed;
};
