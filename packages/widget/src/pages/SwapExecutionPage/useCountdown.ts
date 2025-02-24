import { createCountdownTimer } from "@/utils/countdownTimer";
import { useState, useEffect } from "react";
import { SwapExecutionState } from "./SwapExecutionPage";

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
        duration: estimatedDurationSeconds,
        onUpdate: (remainingTime) => {
          setCountdown(parseInt(remainingTime.toString()));
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
