import { SignerGetters } from "../state";
import { TransactionCallbacks } from "../types/callbacks";
import { GasOptions, UserAddress } from "../types/client";
import { CosmosMsg, RouteResponse } from "../types/swaggerTypes";
import { ApiRequest } from "../utils/generateApi";

/** Execute Route Options */
export type ExecuteRouteOptions = SignerGetters &
  GasOptions &
  TransactionCallbacks &
  Pick<ApiRequest<"getMsgsV2">, "timeoutSeconds"> & {
    route: RouteResponse;
    /**
     * Addresses should be in the same order with the `chainIDs` in the `route`
     */
    userAddresses: UserAddress[];
    simulate?: boolean;
    slippageTolerancePercent?: string;
    /**
     * Arbitrary Tx to be executed before or after route msgs
     */
    beforeMsg?: CosmosMsg;
    afterMsg?: CosmosMsg;
    /**
     * Set allowance amount to max if EVM transaction requires allowance approval.
     */
    useUnlimitedApproval?: boolean;
    /**
    /**
     * If `skipApproval` is set to `true`, the router will bypass checking whether
     * the signer has granted approval for the specified token contract on an EVM chain.
     * This can be useful if approval has already been handled externally or there are race conditions.
     */
    bypassApprovalCheck?: boolean;
  };