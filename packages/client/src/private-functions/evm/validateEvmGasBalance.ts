import type { WalletClient } from "viem";
import type { EvmTx } from "../../types/swaggerTypes";
import { balances } from "../../api/postBalances";
import { BigNumber } from "bignumber.js";
import { ClientState } from "src/state/clientState";
import { formatUnits } from "viem";
import type { GetFallbackGasAmount } from "src/types/client-types";
import { validateEvmTokenApproval } from "./validateEvmTokenApproval";
import { getEVMGasAmountForMessage } from "../../public-functions/getEvmGasAmountForMessage";

export const validateEvmGasBalance = async ({
  signer,
  tx,
  getFallbackGasAmount,
  useUnlimitedApproval,
  bypassApprovalCheck,
}: {
  signer: WalletClient;
  tx: EvmTx;
  getFallbackGasAmount?: GetFallbackGasAmount;
  useUnlimitedApproval?: boolean;
  bypassApprovalCheck?: boolean;
}) => {
  const chainId = tx?.chainId ?? "";
  const skipAssets = (await ClientState.getSkipAssets({ chainId }))?.[chainId];
  const skipChains = await ClientState.getSkipChains();

  const chain = skipChains?.find?.((chain) => chain.chainId === chainId);

  if (!chain) {
    throw new Error(`failed to find chain for chainId: '${chainId}'`);
  }

  if (!signer.account?.address) {
    throw new Error("validateEvmGasBalance: Signer address not found");
  }

  const skipBalances = (
    await balances({
      chains: {
        [tx?.chainId ?? ""]: {
          address: signer.account?.address,
        },
      },
    })
  )?.chains?.[tx?.chainId ?? ""]?.denoms;

  const nativeGasBalance =
    skipBalances && Object.entries(skipBalances).find(([denom]) => denom.includes("-native"))?.[1];

  const zeroAddressGasBalance =
    skipBalances &&
    Object.entries(skipBalances).find(
      ([denom]) => denom.toLowerCase() === "0x0000000000000000000000000000000000000000",
    )?.[1];
  const gasBalance = nativeGasBalance || zeroAddressGasBalance;

  const { requiredErc20Approvals } = tx;

  if (!bypassApprovalCheck &&requiredErc20Approvals) {
    try {
      await validateEvmTokenApproval({
        requiredErc20Approvals,
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

  const gasAmount = await getEVMGasAmountForMessage(signer, tx, getFallbackGasAmount);

  if (!gasBalance) {
    const nativeAsset = skipAssets?.find((x) => x.denom?.includes("-native"));
    const zeroAddressAsset = skipAssets?.find(
      (x) => x.denom?.toLowerCase() === "0x0000000000000000000000000000000000000000",
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
  if (BigNumber(gasBalance.amount ?? "").lt(Number(gasAmount))) {
    const asset = skipAssets?.find(
      (x) =>
        x.denom?.includes("-native") ||
        x.denom?.toLowerCase() === "0x0000000000000000000000000000000000000000",
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
};
