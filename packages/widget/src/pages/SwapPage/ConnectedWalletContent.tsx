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
import { formatDisplayAmount } from "@/utils/number";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { track } from "@amplitude/analytics-browser";
import { useCroppedImage } from "@/hooks/useCroppedImage";
import { SkeletonElement } from "@/components/Skeleton";

export const ConnectedWalletContent = () => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainId);
  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
    chainId: sourceAsset?.chainId,
  });

  const walletImage = useCroppedImage(sourceAccount?.wallet.logo);

  const { data: sourceBalance, isLoading } = useGetSourceBalance();
  const handleMaxButton = useSetMaxAmount();
  const maxAmountTokenMinusFees = useMaxAmountTokenMinusFees();

  const formattedBalance = useMemo(() => {
    const symbol = sourceDetails?.symbol ? ` ${sourceDetails?.symbol}` : "";
    if (sourceBalance?.error?.message) return "--";
    if (sourceBalance === undefined) return;

    const formattedBalanceAmount = formatDisplayAmount(sourceBalance?.formattedAmount);

    return formattedBalanceAmount + symbol;
  }, [sourceBalance, sourceDetails?.symbol]);
  if (!sourceAccount) return null;

  return (
    <Row
      style={{
        gap: 1,
      }}
    >
      <GhostButton
        onClick={() => {
          track("swap page: connected wallet balance - clicked");
          NiceModal.show(Modals.ConnectedWalletModal);
        }}
        align="center"
        gap={8}
      >
        {sourceAccount.wallet.name !== "injected" &&
          (walletImage ? (
            <img style={{ objectFit: "cover" }} src={walletImage} height={16} width={16} />
          ) : (
            <SkeletonElement height={16} width={16} />
          ))}

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
        disabled={
          !sourceBalance || sourceBalance?.amount === "0" || maxAmountTokenMinusFees === "0"
        }
        onClick={() => {
          track("swap page: max button - clicked");
          handleMaxButton();
        }}
        align="center"
      >
        Max
      </GhostButton>
    </Row>
  );
};
