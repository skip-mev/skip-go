import { createCountdownTimer } from "@/utils/countdownTimer";
import { useState, useEffect } from "react";
import { SwapExecutionState } from "@/utils/swapExecutionState";

export const useCountdown = ({
  estimatedRouteDurationSeconds,
  swapExecutionState,
}: {
  estimatedRouteDurationSeconds?: number;
  swapExecutionState?: SwapExecutionState;
}) => {
  const [countdown, setCountdown] = useState<number | undefined>(estimatedRouteDurationSeconds);
  const [timer, setTimer] = useState<ReturnType<typeof createCountdownTimer> | undefined>();

  useEffect(() => {
    const estimatedDurationSeconds = estimatedRouteDurationSeconds;
    if (
      !timer &&
      estimatedDurationSeconds &&
      swapExecutionState &&
      [SwapExecutionState.pending, SwapExecutionState.signaturesRemaining].includes(
        swapExecutionState,
      )
    ) {
      const countdownTimer = createCountdownTimer({
        duration: estimatedDurationSeconds * 1_000,
        onUpdate: (remainingTime) => {
          setCountdown(parseInt((remainingTime / 1_000).toString()));
        },
      });
      setTimer(countdownTimer);
      countdownTimer.startCountdown();
    }

    return () => {
      timer?.stopCountdown();
    };
  }, [estimatedRouteDurationSeconds, swapExecutionState, timer]);

  return countdown;
};
