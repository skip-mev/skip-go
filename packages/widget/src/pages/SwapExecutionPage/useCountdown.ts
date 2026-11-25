import { useState, useEffect, useRef } from "react";

export const useCountdown = ({
  estimatedRouteDurationSeconds,
  enabled,
}: {
  estimatedRouteDurationSeconds?: number;
  enabled?: boolean;
}) => {
  const [countdown, setCountdown] = useState<number | undefined>(estimatedRouteDurationSeconds);
  const deadlineRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled || !estimatedRouteDurationSeconds) return;

    if (deadlineRef.current === undefined) {
      deadlineRef.current = Date.now() + estimatedRouteDurationSeconds * 1_000;
    }
    const deadline = deadlineRef.current;

    const tick = () => {
      const remaining = Math.max(Math.ceil((deadline - Date.now()) / 1_000), 0);
      setCountdown(remaining);
      return remaining;
  };

    if (tick() === 0) return;

    const intervalId = setInterval(() => {
      if (tick() === 0) clearInterval(intervalId);
    }, 1_000);

    return () => clearInterval(intervalId);
  }, [enabled, estimatedRouteDurationSeconds]);

  return countdown;
};
