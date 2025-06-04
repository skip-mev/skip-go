import { createCountdownTimer } from "@/utils/countdownTimer";
import { useState, useEffect } from "react";

export const useCountdown = ({
  estimatedRouteDurationSeconds,
  enabled,
}: {
  estimatedRouteDurationSeconds?: number;
  enabled?: boolean;
}) => {
  const [countdown, setCountdown] = useState<number | undefined>(estimatedRouteDurationSeconds);
  const [timer, setTimer] = useState<ReturnType<typeof createCountdownTimer> | undefined>();

  useEffect(() => {
    const estimatedDurationSeconds = estimatedRouteDurationSeconds;
    if (!timer && estimatedDurationSeconds && enabled) {
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
  }, [estimatedRouteDurationSeconds, enabled, timer]);

  return countdown;
};
