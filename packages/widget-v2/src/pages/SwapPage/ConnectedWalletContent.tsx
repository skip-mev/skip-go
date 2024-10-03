import { Row } from "@/components/Layout";
import { useGetAccount } from "@/hooks/useGetAccount";
import { ConnectedWalletModal } from "@/modals/ConnectedWalletModal/ConnectedWalletModal";
import { useMemo } from "react";
import { useMaxAmountTokenMinusFees, useSetMaxAmount } from "./useSetMaxAmount";
import { useSourceBalance } from "@/hooks/useSourceBalance";
import { useModal } from "@/components/Modal";
import { useAtomValue } from "jotai";
import { sourceAssetAtom } from "@/state/swapPage";
import { GhostButton } from "@/components/Button";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { SpinnerIcon } from "@/icons/SpinnerIcon";
import { limitDecimalsDisplayed } from "@/utils/number";

export const ConnectedWalletContent = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainID);
  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainID,
  });

  const { data: sourceBalance, isLoading } = useSourceBalance();
  const handleMaxButton = useSetMaxAmount();
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();
  const connectedWalletModal = useModal(ConnectedWalletModal);

  const formattedBalance = useMemo(() => {
    if (sourceBalance === undefined || sourceBalance.error?.message) return "";

    const amount = sourceBalance?.amount;
    let formattedBalanceAmount = sourceBalance?.formattedAmount;

    if (amount === "0") {
      formattedBalanceAmount = amount;
    }

    return `${limitDecimalsDisplayed(formattedBalanceAmount)} ${sourceDetails?.symbol}`;
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
          connectedWalletModal.show();
        }}
        align="center"
        gap={8}
        alwaysShowBackground
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
        alwaysShowBackground
      >
        Max
      </GhostButton>
    </Row>
  );
};
