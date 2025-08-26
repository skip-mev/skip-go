import { useTheme } from "@/styled-components";
import { OverallStatus, TransactionState, TransferEventStatus } from "@skip-go/client";
import { useMemo } from "react";

type StatusLabelAndColor = {
  label: string;
  color: string;
  background: string;
}

type OverallStatusWithAbandoned = OverallStatus | "abandoned";

type CombinedStatus = TransferEventStatus | OverallStatusWithAbandoned;

const getSimpleOverallStatus = (state: TransactionState) => {
  switch (state) {
    case "STATE_SUBMITTED":
    case "STATE_PENDING":
      return "pending";
    case "STATE_COMPLETED_SUCCESS":
      return "success";
    case "STATE_ABANDONED":
      return "abandoned";
    case "STATE_COMPLETED_ERROR":
    case "STATE_PENDING_ERROR":
    default:
      return "failed";
  }
}

export const useOverallStatusLabelAndColor = ({ status, state }: { status?: TransferEventStatus , state?: TransactionState }) => {
  const theme = useTheme();
  const statusLabelAndColor = useMemo(() => {
    const statusMap: Record<CombinedStatus, StatusLabelAndColor> = {
      unconfirmed: { label: "Unconfirmed", color: theme.error.text, background: theme.error.background },
      signing: { label: "In Progress", color: theme.warning.text, background: theme.warning.background },
      approving: { label: "In Progress", color: theme.warning.text, background: theme.warning.background },
      pending: { label: "Pending", color: theme.warning.text, background: theme.warning.background },
      completed: { label: "Successful", color: theme.success.text, background: theme.success.background },
      success: { label: "Successful", color:  theme.success.text, background: theme.success.background },
      failed: { label: "Failed", color:  theme.error.text, background: theme.error.background },
      incomplete: { label: "Not completed", color: theme.error.text, background: theme.error.background },
      abandoned: { label: "Abandoned", color: theme.warning.text, background: theme.warning.background },
    };
  
    if (status) {
      return statusMap[status];
    }
    if (state) {
      return statusMap[getSimpleOverallStatus(state)];
    }
  }, [state, status, theme.error.background, theme.error.text, theme.success.background, theme.success.text, theme.warning.background, theme.warning.text]);

  return statusLabelAndColor;
}