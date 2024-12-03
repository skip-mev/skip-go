import { Row } from "@/components/Layout";
import { useGetAccount } from "@/hooks/useGetAccount";
import { useMemo } from "react";
import { useMaxAmountTokenMinusFees, useSetMaxAmount } from "./useSetMaxAmount";
import { useGetSourceBalance } from "@/hooks/useGetSourceBalance";
import { useAtomValue } from "jotai";
import { sourceAssetAtom } from "@/state/swapPage";
import { GhostButton } from "@/components/Button";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { SpinnerIcon } from "@/icons/SpinnerIcon";
import { limitDecimalsDisplayed, removeTrailingZeros } from "@/utils/number";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";

export const ConnectedWalletContent = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainID);
  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainID,
  });

  const { data: sourceBalance, isLoading } = useGetSourceBalance();
  const handleMaxButton = useSetMaxAmount();
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();

  const formattedBalance = useMemo(() => {
    const symbol = sourceDetails?.symbol ? ` ${sourceDetails?.symbol}` : "";
    if (sourceBalance?.error?.message) return "--";
    if (sourceBalance === undefined) return;

    const formattedBalanceAmount = limitDecimalsDisplayed(
      removeTrailingZeros(sourceBalance?.formattedAmount)
    );

    return formattedBalanceAmount + symbol;
  }, [sourceBalance, sourceDetails?.symbol]);
  if (!sourceAccount) return null;

  return (
    <Row
      gap={6}
      style={{
        paddingRight: 13,
      }}
    >
      <GhostButton
        onClick={() => {
          NiceModal.show(Modals.ConnectedWalletModal);
        }}
        align="center"
        gap={8}
      >
        {sourceAccount && (
          <img
            style={{ objectFit: "cover" }}
            src={sourceAccount?.wallet.logo}
            height={16}
            width={16}
          />
        )}
        {isLoading ? (
          <div
            style={{
              marginLeft: "8px",
              marginRight: "8px",
              position: "relative",
            }}
          >
            <SpinnerIcon
              style={{
                animation: "spin 1s linear infinite",
                position: "absolute",
                height: 14,
                width: 14,
              }}
            />
          </div>
        ) : (
          formattedBalance
        )}
      </GhostButton>

      <GhostButton
        disabled={!sourceBalance || sourceBalance?.amount === "0" || maxAmountTokenMinusFees === "0"}
        onClick={handleMaxButton}
        align="center"
      >
        Max
      </GhostButton>
    </Row>
  );
};
